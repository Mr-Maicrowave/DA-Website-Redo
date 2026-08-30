import { motion, useMotionValue, useMotionValueEvent, useReducedMotion, type MotionValue } from 'framer-motion';
import { useState } from 'react';
import { PHYSICAL_CENTRES, type GeographicCoordinate, type PhysicalCentre } from '@/data/physical-centres';
import { COMMUNITY_WIDE_BASEMAP } from '@/data/community-basemap';
import { COMMUNITY_MOCK_REGIONAL_SCHOOLS } from '@/data/community-school-points';
import { closestPointOnPolyline, getCommunityCameraBounds, getMapScene, getSceneBounds, projectCoordinate, type MapBounds, type MapViewBox } from '@/data/wayfinder-map-scenes';
import { useIsMobile } from '@/hooks/use-mobile';

const MOBILE_COMMUNITY_BOUNDS: MapBounds = { north: -33.76, south: -34.00, west: 150.79, east: 150.99 };

const pathFromCoordinates = (coordinates: readonly GeographicCoordinate[], bounds: MapBounds, viewBox: MapViewBox) => {
  return coordinates.map((coordinate, index) => {
    const point = projectCoordinate(coordinate, bounds, viewBox);
    return `${index === 0 ? 'M' : 'L'}${point.x.toFixed(1)} ${point.y.toFixed(1)}`;
  }).join(' ');
};

type WayfinderMapVariant = 'hero' | 'nearby' | 'ready' | 'community';

export const WayfinderMap = ({ selectedCentre, variant = 'hero', communityProgress }: { selectedCentre: PhysicalCentre; variant?: WayfinderMapVariant; communityProgress?: MotionValue<number> }) => {
  const reduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const fallbackProgress = useMotionValue(0);
  const activeProgress = communityProgress ?? fallbackProgress;
  const [rawCommunityProgress, setRawCommunityProgress] = useState(0);
  useMotionValueEvent(activeProgress, 'change', setRawCommunityProgress);
  const scene = getMapScene('canley-heights');
  const isCommunity = variant === 'community';
  const progress = isCommunity ? (reduceMotion ? .68 : rawCommunityProgress) : 0;
  const bounds = isCommunity ? getCommunityCameraBounds(scene, progress, isMobile ? MOBILE_COMMUNITY_BOUNDS : scene.communityBounds) : getSceneBounds(scene, variant);
  const centreRoad = scene.roads.find((road) => road.id === 'canley-vale-road');
  const selectedPoint = projectCoordinate(selectedCentre.coordinates, bounds, scene.viewBox);
  const presentationOffset = variant === 'ready' ? { x: 200, y: -16 } : variant === 'nearby' ? { x: 0, y: -100 } : { x: 0, y: 0 };
  const focusStrength = variant === 'nearby' ? 0 : .14;
  const camera = {
    x: (scene.viewBox.width / 2 - selectedPoint.x) * focusStrength + presentationOffset.x,
    y: (scene.viewBox.height / 2 - selectedPoint.y) * focusStrength + presentationOffset.y,
  };

  const localOpacity = isCommunity ? Math.max(0, 1 - Math.max(0, progress - .56) / .32) : 1;
  const localLabelOpacity = isCommunity ? Math.max(0, 1 - Math.max(0, progress - .08) / .12) : 1;
  const regionalOpacity = isCommunity ? Math.max(0, Math.min(1, (progress - .12) / .48)) : 0;
  const atlasOpacity = isCommunity ? Math.max(0, Math.min(1, (progress - .08) / .42)) : 0;
  const midLabelOpacity = isCommunity ? Math.max(0, Math.min(1, (progress - .25) / .18)) * (1 - Math.max(0, progress - .82) / .18) : 0;
  const regionalLabelOpacity = isCommunity ? Math.max(0, Math.min(1, (progress - .54) / .22)) : 0;
  const wideBasemapOpacity = isCommunity ? Math.max(0, Math.min(1, (progress - .14) / .38)) : 0;
  const mobileOrientationOpacity = Math.max(midLabelOpacity, regionalLabelOpacity * .88);
  const hubCoordinates = {
    lat: (PHYSICAL_CENTRES[0].coordinates.lat + PHYSICAL_CENTRES[1].coordinates.lat) / 2,
    lng: (PHYSICAL_CENTRES[0].coordinates.lng + PHYSICAL_CENTRES[1].coordinates.lng) / 2,
  };
  const hubPoint = projectCoordinate(hubCoordinates, bounds, scene.viewBox);

  return <svg className={`wayfinder-map${isCommunity ? ' community-map' : ''}`} viewBox={`0 0 ${scene.viewBox.width} ${scene.viewBox.height}`} preserveAspectRatio={variant === 'nearby' || isCommunity ? 'none' : undefined} aria-hidden="true" data-testid="wayfinder-map-geometry">
    {isCommunity && <defs><radialGradient id="community-density" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#244a63" stopOpacity=".15"/><stop offset=".52" stopColor="#244a63" stopOpacity=".055"/><stop offset="1" stopColor="#244a63" stopOpacity="0"/></radialGradient><radialGradient id="community-hub-glow" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#d6a921" stopOpacity=".28"/><stop offset="1" stopColor="#d6a921" stopOpacity="0"/></radialGradient><linearGradient id="community-copy-safe" x1="0" x2="1"><stop offset="0" stopColor="#e9decb" stopOpacity=".92"/><stop offset=".68" stopColor="#e9decb" stopOpacity=".58"/><stop offset="1" stopColor="#e9decb" stopOpacity="0"/></linearGradient></defs>}
    <motion.g animate={camera} transition={{ duration: reduceMotion ? 0 : .8, ease: [0.22, 1, .36, 1] }}>
      {isCommunity && <g className="community-map__atlas" opacity={atlasOpacity}>
        <g className="community-map__wide-basemap" opacity={wideBasemapOpacity}>
          {COMMUNITY_WIDE_BASEMAP.districtMasses.map((mass) => <path key={mass.id} className="community-map__district-mass" d={`${pathFromCoordinates(mass.coordinates, bounds, scene.viewBox)} Z`} />)}
          {COMMUNITY_WIDE_BASEMAP.waterways.map((waterway) => <path key={waterway.id} className="community-map__waterway" d={pathFromCoordinates(waterway.coordinates, bounds, scene.viewBox)} />)}
          {COMMUNITY_WIDE_BASEMAP.connectors.map((connector) => <path key={connector.id} className="community-map__connector-road" d={pathFromCoordinates(connector.coordinates, bounds, scene.viewBox)} />)}
          {COMMUNITY_WIDE_BASEMAP.majorRoads.map((road) => <path key={road.id} className="community-map__major-road" d={pathFromCoordinates(road.coordinates, bounds, scene.viewBox)} />)}
        </g>
        {COMMUNITY_WIDE_BASEMAP.labels.filter((item) => !isMobile || item.mobile).map((item) => { const point = projectCoordinate(item.coordinates, bounds, scene.viewBox); const opacity = item.stage === 'mid' ? (isMobile ? mobileOrientationOpacity : midLabelOpacity) : regionalLabelOpacity; return <text key={item.id} x={point.x + item.offset.x} y={point.y + item.offset.y} className={`community-map__orientation community-map__orientation--${item.stage}`} opacity={opacity}>{item.label}</text>; })}
      </g>}
      {scene.roads.map((road, index) => <motion.path key={road.id} d={pathFromCoordinates(road.coordinates, bounds, scene.viewBox)} initial={reduceMotion || isCommunity ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: reduceMotion || isCommunity ? 0 : index * .08, duration: .7 }} className={`wayfinder-road wayfinder-road-${road.hierarchy}`} style={{ opacity: isCommunity ? .18 + localOpacity * .82 : 1 }} />)}
      {scene.roads.filter((road) => road.hierarchy === 'major').map((road) => {
        const midpoint = projectCoordinate(road.coordinates[Math.floor(road.coordinates.length / 2)], bounds, scene.viewBox);
        return <text key={`${road.id}-label`} x={midpoint.x + 12} y={midpoint.y - 10} className="wayfinder-label wayfinder-road-label" opacity={localLabelOpacity}>{road.name}</text>;
      })}
      {scene.places.map((place) => {
        const point = projectCoordinate(place.coordinates, bounds, scene.viewBox);
        const showLabel = variant === 'nearby' || place.kind === 'station' || isCommunity;
        return <g key={place.id} className={`wayfinder-place wayfinder-place-${place.id}`} opacity={localOpacity}><circle cx={point.x} cy={point.y} r="4" />{showLabel && <text x={point.x + (place.labelOffset?.x ?? 12)} y={point.y + (place.labelOffset?.y ?? -12)} className="wayfinder-label" opacity={localLabelOpacity}>{place.name}</text>}</g>;
      })}
      {isCommunity && <g className="community-map__regional-points" opacity={regionalOpacity}>{COMMUNITY_MOCK_REGIONAL_SCHOOLS.map((point, index) => {
        const marker = projectCoordinate(point.coordinates, bounds, scene.viewBox);
        const reveal = Math.max(0, Math.min(1, (progress - (.12 + (index % 13) * .012)) / .42));
        const localCatchment = index < 52;
        const pointOpacity = localCatchment ? .68 : index < 70 ? .52 : .34;
        const radius = localCatchment ? 4.5 : index < 70 ? 4 : 3.6;
        return <circle key={point.id} className={`community-map__mock-point${localCatchment ? ' is-local-catchment' : ''}`} cx={marker.x} cy={marker.y} r={radius} opacity={reveal * pointOpacity} />;
      })}</g>}
      <motion.path d={pathFromCoordinates(scene.connection, bounds, scene.viewBox)} className="wayfinder-gold-route" initial={reduceMotion || isCommunity ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: reduceMotion || isCommunity ? 0 : .48, duration: .9, ease: 'easeInOut' }} style={{ opacity: localOpacity }} />
      {centreRoad && PHYSICAL_CENTRES.map((centre) => {
        const property = projectCoordinate(centre.coordinates, bounds, scene.viewBox);
        const roadPoint = projectCoordinate(closestPointOnPolyline(centre.coordinates, centreRoad.coordinates).coordinate, bounds, scene.viewBox);
        const selected = centre.id === selectedCentre.id;
        return <line key={`${centre.id}-frontage`} x1={property.x} y1={property.y} x2={roadPoint.x} y2={roadPoint.y} className="wayfinder-property-connector" opacity={selected ? localOpacity : localOpacity * .36} />;
      })}
      {PHYSICAL_CENTRES.map((centre) => {
        const point = projectCoordinate(centre.coordinates, bounds, scene.viewBox);
        const selected = centre.id === selectedCentre.id;
        return <g key={centre.id} transform={`translate(${point.x} ${point.y})`} className={selected ? 'is-selected' : 'wayfinder-centre--secondary'} opacity={selected ? localOpacity : localOpacity * .58}>
          {selected && <circle r="26" className="wayfinder-marker-halo" />}
          <circle r={selected ? 18 : 8} className="wayfinder-marker-ring" />
          <circle r={selected ? 6 : 3} className="wayfinder-marker-core" />
          <text x={selected ? 28 : -12} y={selected ? 30 : -14} textAnchor={selected ? undefined : 'end'} className="wayfinder-marker-label" opacity={selected ? localLabelOpacity : localLabelOpacity * .42}>{centre.buildingLabel}</text>
        </g>;
      })}
      {isCommunity && <g className="community-map__hub" transform={`translate(${hubPoint.x} ${hubPoint.y})`} opacity={Math.max(regionalOpacity, localOpacity * .72)}>
        <ellipse rx="152" ry="94" fill="url(#community-density)" className="community-map__density" />
        <circle r="60" fill="url(#community-hub-glow)" className="community-map__hub-glow" />
        <circle r="29" className="community-map__hub-pulse" />
        <circle r="17" className="wayfinder-marker-ring" />
        <circle r="6" className="wayfinder-marker-core" />
      </g>}
      {isCommunity && <rect className="community-map__copy-safe" x="0" y="0" width="460" height={scene.viewBox.height} fill="url(#community-copy-safe)" opacity={regionalOpacity} />}
    </motion.g>
  </svg>;
};
