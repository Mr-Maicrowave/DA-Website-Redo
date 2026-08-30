import { motion, useReducedMotion } from 'framer-motion';
import { PHYSICAL_CENTRES, type GeographicCoordinate, type PhysicalCentre } from '@/data/physical-centres';
import { closestPointOnPolyline, getMapScene, getSceneBounds, projectCoordinate, type MapBounds, type MapViewBox } from '@/data/wayfinder-map-scenes';

const pathFromCoordinates = (coordinates: readonly GeographicCoordinate[], bounds: MapBounds, viewBox: MapViewBox) => {
  return coordinates.map((coordinate, index) => {
    const point = projectCoordinate(coordinate, bounds, viewBox);
    return `${index === 0 ? 'M' : 'L'}${point.x.toFixed(1)} ${point.y.toFixed(1)}`;
  }).join(' ');
};

type WayfinderMapVariant = 'hero' | 'nearby' | 'ready';

export const WayfinderMap = ({ selectedCentre, variant = 'hero' }: { selectedCentre: PhysicalCentre; variant?: WayfinderMapVariant }) => {
  const reduceMotion = useReducedMotion();
  const scene = getMapScene('canley-heights');
  const bounds = getSceneBounds(scene, variant);
  const centreRoad = scene.roads.find((road) => road.id === 'canley-vale-road');
  const selectedPoint = projectCoordinate(selectedCentre.coordinates, bounds, scene.viewBox);
  const presentationOffset = variant === 'ready' ? { x: 200, y: -16 } : variant === 'nearby' ? { x: 0, y: -100 } : { x: 0, y: 0 };
  const focusStrength = variant === 'nearby' ? 0 : .14;
  const camera = {
    x: (scene.viewBox.width / 2 - selectedPoint.x) * focusStrength + presentationOffset.x,
    y: (scene.viewBox.height / 2 - selectedPoint.y) * focusStrength + presentationOffset.y,
  };

  return <svg className="wayfinder-map" viewBox={`0 0 ${scene.viewBox.width} ${scene.viewBox.height}`} preserveAspectRatio={variant === 'nearby' ? 'none' : undefined} aria-hidden="true" data-testid="wayfinder-map-geometry">
    <motion.g animate={camera} transition={{ duration: reduceMotion ? 0 : .8, ease: [0.22, 1, .36, 1] }}>
      {scene.roads.map((road, index) => <motion.path key={road.id} d={pathFromCoordinates(road.coordinates, bounds, scene.viewBox)} initial={reduceMotion ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: reduceMotion ? 0 : index * .08, duration: .7 }} className={`wayfinder-road wayfinder-road-${road.hierarchy}`} />)}
      {scene.roads.filter((road) => road.hierarchy === 'major').map((road) => {
        const midpoint = projectCoordinate(road.coordinates[Math.floor(road.coordinates.length / 2)], bounds, scene.viewBox);
        return <text key={`${road.id}-label`} x={midpoint.x + 12} y={midpoint.y - 10} className="wayfinder-label wayfinder-road-label">{road.name}</text>;
      })}
      {scene.places.map((place) => {
        const point = projectCoordinate(place.coordinates, bounds, scene.viewBox);
        const showLabel = variant === 'nearby' || place.kind === 'station';
        return <g key={place.id} className={`wayfinder-place wayfinder-place-${place.id}`}><circle cx={point.x} cy={point.y} r="4" />{showLabel && <text x={point.x + (place.labelOffset?.x ?? 12)} y={point.y + (place.labelOffset?.y ?? -12)} className="wayfinder-label">{place.name}</text>}</g>;
      })}
      <motion.path d={pathFromCoordinates(scene.connection, bounds, scene.viewBox)} className="wayfinder-gold-route" initial={reduceMotion ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: reduceMotion ? 0 : .48, duration: .9, ease: 'easeInOut' }} />
      {centreRoad && PHYSICAL_CENTRES.map((centre) => {
        const property = projectCoordinate(centre.coordinates, bounds, scene.viewBox);
        const roadPoint = projectCoordinate(closestPointOnPolyline(centre.coordinates, centreRoad.coordinates).coordinate, bounds, scene.viewBox);
        const selected = centre.id === selectedCentre.id;
        return <line key={`${centre.id}-frontage`} x1={property.x} y1={property.y} x2={roadPoint.x} y2={roadPoint.y} className="wayfinder-property-connector" opacity={selected ? 1 : .36} />;
      })}
      {PHYSICAL_CENTRES.map((centre) => {
        const point = projectCoordinate(centre.coordinates, bounds, scene.viewBox);
        const selected = centre.id === selectedCentre.id;
        return <g key={centre.id} transform={`translate(${point.x} ${point.y})`} className={selected ? 'is-selected' : 'wayfinder-centre--secondary'} opacity={selected ? 1 : .58}>
          {selected && <circle r="26" className="wayfinder-marker-halo" />}
          <circle r={selected ? 18 : 8} className="wayfinder-marker-ring" />
          <circle r={selected ? 6 : 3} className="wayfinder-marker-core" />
          <text x={selected ? 28 : -12} y={selected ? 30 : -14} textAnchor={selected ? undefined : 'end'} className="wayfinder-marker-label" opacity={selected ? 1 : .42}>{centre.buildingLabel}</text>
        </g>;
      })}
    </motion.g>
  </svg>;
};
