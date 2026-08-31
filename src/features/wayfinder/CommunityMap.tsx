import { useEffect, useMemo, useRef } from 'react';
import type { MotionValue } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PHYSICAL_CENTRES } from '@/data/physical-centres';
import { COMMUNITY_SCHOOLS } from '@/data/community-schools';
import { getMapScene } from '@/data/wayfinder-map-scenes';
import { useIsMobile } from '@/hooks/use-mobile';
import './community-map.css';

// Esri Light Gray Canvas raster tiles — no API key required. Two layers so label density can be
// tuned independently of the base. NOTE: ArcGIS REST tiles use {z}/{y}/{x} — not the more common
// {z}/{x}/{y} — getting this wrong yields a mirrored map that still renders without erroring.
const TILE_BASE = 'https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}';
const TILE_REFERENCE = 'https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}';
const ESRI_ATTRIBUTION = 'Tiles &copy; Esri &mdash; Esri, HERE, Garmin, &copy; OpenStreetMap contributors';
// The legacy Esri Light Gray Canvas cache has Australian coverage through level 16.
// Beyond that it serves the "Map data not yet available" placeholder rather than an error tile.
const ESRI_MAX_NATIVE_ZOOM = 16;
// Leaflet scales the current raster grid until it receives the next native level. Limiting a
// scroll jump to this much zoom per frame stops a stale local tile from filling the screen.
const MAX_CAMERA_ZOOM_STEP = 0.14;

const LOCAL_BOUNDS = L.latLngBounds([-33.8875, 150.9195], [-33.8795, 150.9365]);
const SYDNEY_BOUNDS = L.latLngBounds([-34.03, 150.62], [-33.66, 151.30]);

const HUB_COORDINATES = {
  lat: (PHYSICAL_CENTRES[0].coordinates.lat + PHYSICAL_CENTRES[1].coordinates.lat) / 2,
  lng: (PHYSICAL_CENTRES[0].coordinates.lng + PHYSICAL_CENTRES[1].coordinates.lng) / 2,
};

const CONNECTION = getMapScene('canley-heights').connection;

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const lerp = (from: number, to: number, t: number) => from + (to - from) * t;
// Smoothstep — used to ease the pull-back so it starts and ends softly rather than at a constant rate.
const smoothstep = (t: number) => t * t * (3 - 2 * t);

const greatCircleDistance = (a: { lat: number; lng: number }, b: { lat: number; lng: number }) => {
  const rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad;
  const dLng = (b.lng - a.lng) * rad;
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLng / 2) ** 2;
  return 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
};

// Sorted once, at module load, so the dot reveal radiates outward from the hub in a stable order.
const SORTED_SCHOOLS = [...COMMUNITY_SCHOOLS].sort(
  (a, b) => greatCircleDistance(HUB_COORDINATES, a.coordinates) - greatCircleDistance(HUB_COORDINATES, b.coordinates),
);
const TOTAL_SCHOOLS = SORTED_SCHOOLS.length;
const INNER_CATCHMENT_COUNT = 52;
const OUTER_SYDNEY_START = 70;
// The map needs to show the community's reach, not draw an 80-spoke starburst over the cartography.
// These evenly spaced outer-school anchors keep the network legible while every school remains a dot.
const CONNECTION_SCHOOL_INDICES = SORTED_SCHOOLS.flatMap((_, index) => (
  index >= INNER_CATCHMENT_COUNT && (index - INNER_CATCHMENT_COUNT) % 2 === 0 ? [index] : []
));

type ScrubbedLeafletMap = L.Map & {
  _loaded?: boolean;
  _move: (centre: L.LatLng, zoom: number, data?: unknown, suppressEvent?: boolean) => void;
};

type ScrubbedTileLayer = L.TileLayer & {
  _setView: (centre: L.LatLng, zoom: number, noPrune?: boolean, noUpdate?: boolean) => void;
};

export const CommunityMap = ({ progress, bookingPath }: { progress: MotionValue<number>; bookingPath: string }) => {
  const mapElRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const baseLayerRef = useRef<L.TileLayer | null>(null);
  const referenceLayerRef = useRef<L.TileLayer | null>(null);
  const boundsRef = useRef<{ local: number | null; sydney: number | null }>({ local: null, sydney: null });
  const mapSizeRef = useRef<{ width: number; height: number } | null>(null);
  const latestProgressRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const connectorRef = useRef<SVGPathElement>(null);
  const buildingRefs = useRef<(SVGGElement | null)[]>([]);
  const schoolConnectionRefs = useRef<(SVGLineElement | null)[]>([]);
  const dotGroupRefs = useRef<(SVGGElement | null)[]>([]);
  const localCardRef = useRef<HTMLDivElement>(null);
  const regionalCardRef = useRef<HTMLDivElement>(null);
  const regionalTitleRef = useRef<HTMLHeadingElement>(null);

  const isMobile = useIsMobile();
  const reduceMotion = useReducedMotion();
  const verifiedCount = useMemo(() => COMMUNITY_SCHOOLS.filter((school) => school.verified).length, []);

  const render = (p: number) => {
    const map = mapRef.current;
    if (!map) return;
    const { local: localZoom, sydney: sydneyZoom } = boundsRef.current;
    if (localZoom === null || sydneyZoom === null || !Number.isFinite(localZoom) || !Number.isFinite(sydneyZoom)) return;

    const localCentre = LOCAL_BOUNDS.getCenter();
    const sydneyCentreRaw = SYDNEY_BOUNDS.getCenter();
    const lngSpan = SYDNEY_BOUNDS.getEast() - SYDNEY_BOUNDS.getWest();
    const offsetFraction = isMobile ? 0 : 0.18;
    const sydneyCentre = L.latLng(sydneyCentreRaw.lat, sydneyCentreRaw.lng + lngSpan * offsetFraction);

    let centre: L.LatLng;
    let zoom: number;
    let buildingOpacity: number;
    let connectorOpacity: number;

    // Motion-reduced visitors receive the completed regional frame immediately. Keeping the
    // camera, dots and copy in the same state avoids an otherwise contradictory local card
    // over a Sydney-wide map.
    const showRegionalContext = Boolean(reduceMotion);
    if (showRegionalContext) {
      centre = sydneyCentre;
      zoom = sydneyZoom;
      buildingOpacity = 1;
      connectorOpacity = 0;
    } else if (p <= 0.28) {
      centre = localCentre;
      zoom = localZoom;
      buildingOpacity = 1;
      connectorOpacity = 1;
    } else if (p <= 0.62) {
      const t = smoothstep(clamp01((p - 0.28) / (0.62 - 0.28)));
      centre = L.latLng(lerp(localCentre.lat, sydneyCentre.lat, t), lerp(localCentre.lng, sydneyCentre.lng, t));
      zoom = lerp(localZoom, sydneyZoom, t);
      buildingOpacity = 1;
      connectorOpacity = 1 - clamp01((p - 0.28) / (0.38 - 0.28));
    } else {
      centre = sydneyCentre;
      zoom = sydneyZoom;
      buildingOpacity = 1;
      connectorOpacity = 0;
    }

    const scrubbedMap = map as ScrubbedLeafletMap;
    let cameraIsSettling = false;
    if (scrubbedMap._loaded && !reduceMotion) {
      const currentCentre = map.getCenter();
      const currentZoom = map.getZoom();
      const zoomDistance = Math.abs(zoom - currentZoom);
      const zoomStep = Math.min(Math.abs(zoom - currentZoom), MAX_CAMERA_ZOOM_STEP);
      if (zoomDistance > 0.001) {
        const stepFraction = zoomStep / zoomDistance;
        centre = L.latLng(
          lerp(currentCentre.lat, centre.lat, stepFraction),
          lerp(currentCentre.lng, centre.lng, stepFraction),
        );
        zoom = currentZoom + Math.sign(zoom - currentZoom) * zoomStep;
        cameraIsSettling = stepFraction < 1;
      }
    }
    if (!scrubbedMap._loaded) {
      // The initial view needs Leaflet's public lifecycle so the layer can mount and load its first grid.
      map.setView(centre, zoom, { animate: false });
    } else {
      // setView emits viewprereset, which clears every raster tile on every scroll frame. Move the
      // camera directly, then update coverage without pruning the previous tile level.
      scrubbedMap._move(centre, zoom, undefined, true);
      [baseLayerRef.current, referenceLayerRef.current].forEach((layer) => {
        if (!layer) return;
        const scrubbedLayer = layer as ScrubbedTileLayer;
        scrubbedLayer._setView(centre, zoom, true, false);
      });
    }

    const localOpacity = showRegionalContext ? 0 : clamp01(1 - (p - 0.44) / (0.5 - 0.44));
    const regionalOpacity = showRegionalContext ? 1 : clamp01((p - 0.5) / (0.56 - 0.5));
    if (localCardRef.current) localCardRef.current.style.opacity = String(localOpacity);
    if (regionalCardRef.current) regionalCardRef.current.style.opacity = String(regionalOpacity);
    if (regionalTitleRef.current) regionalTitleRef.current.setAttribute('aria-hidden', String(!showRegionalContext && regionalOpacity <= 0.5));

    if (connectorRef.current) {
      const d = CONNECTION.map((coordinate, index) => {
        const point = map.latLngToContainerPoint([coordinate.lat, coordinate.lng]);
        return `${index === 0 ? 'M' : 'L'}${point.x.toFixed(1)} ${point.y.toFixed(1)}`;
      }).join(' ');
      connectorRef.current.setAttribute('d', d);
      connectorRef.current.style.opacity = String(connectorOpacity);
    }

    PHYSICAL_CENTRES.forEach((centrePoint, index) => {
      const marker = buildingRefs.current[index];
      if (!marker) return;
      const point = map.latLngToContainerPoint([centrePoint.coordinates.lat, centrePoint.coordinates.lng]);
      marker.setAttribute('transform', `translate(${point.x.toFixed(1)} ${point.y.toFixed(1)})`);
      marker.style.opacity = String(buildingOpacity);
    });

    const hubPoint = map.latLngToContainerPoint([HUB_COORDINATES.lat, HUB_COORDINATES.lng]);

    SORTED_SCHOOLS.forEach((school, index) => {
      const connection = schoolConnectionRefs.current[index];
      const group = dotGroupRefs.current[index];
      const point = map.latLngToContainerPoint([school.coordinates.lat, school.coordinates.lng]);
      const start = 0.74 + (index / TOTAL_SCHOOLS) * 0.16;
      const t = showRegionalContext ? 1 : clamp01((p - start) / 0.10);
      if (connection) {
        connection.setAttribute('x1', hubPoint.x.toFixed(1));
        connection.setAttribute('y1', hubPoint.y.toFixed(1));
        connection.setAttribute('x2', point.x.toFixed(1));
        connection.setAttribute('y2', point.y.toFixed(1));
        connection.style.opacity = String(t * 0.3);
      }
      if (!group) return;
      const eased = t < 0.8 ? lerp(0.4, 1.06, t / 0.8) : lerp(1.06, 1, (t - 0.8) / 0.2);
      const scale = t === 0 ? 0.4 : eased;
      const bob = (1 - t) * 6;
      group.setAttribute('transform', `translate(${point.x.toFixed(1)} ${(point.y - bob).toFixed(1)}) scale(${scale.toFixed(3)})`);
      group.style.opacity = String(t);
    });

    if (cameraIsSettling && rafRef.current === null) {
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        renderRef.current(latestProgressRef.current);
      });
    }
  };

  const renderRef = useRef(render);
  renderRef.current = render;

  useEffect(() => {
    if (!mapElRef.current || mapRef.current) return;
    const map = L.map(mapElRef.current, {
      zoomSnap: 0, // REQUIRED — fractional zoom, otherwise the scroll-driven pull-back stair-steps
      zoomDelta: 0,
      zoomAnimation: false,
      fadeAnimation: true,
      markerZoomAnimation: false,
      attributionControl: true,
      zoomControl: false,
      // the map must never capture the page's scroll or touch input:
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      touchZoom: false,
      boxZoom: false,
      keyboard: false,
    });
    mapRef.current = map;

    const tileOptions = { maxZoom: ESRI_MAX_NATIVE_ZOOM, maxNativeZoom: ESRI_MAX_NATIVE_ZOOM, keepBuffer: 6 };
    const baseLayer = L.tileLayer(TILE_BASE, tileOptions).addTo(map);
    baseLayerRef.current = baseLayer;
    const referenceLayer = L.tileLayer(TILE_REFERENCE, tileOptions).addTo(map);
    referenceLayerRef.current = referenceLayer;
    map.attributionControl.setPrefix(false);
    map.attributionControl.addAttribution(ESRI_ATTRIBUTION);

    const recomputeBounds = () => {
      const { width, height } = mapElRef.current!.getBoundingClientRect();
      if (width === 0 || height === 0) return;

      const previousSize = mapSizeRef.current;
      const sizeChanged = !previousSize || previousSize.width !== width || previousSize.height !== height;
      if (!sizeChanged) return;

      mapSizeRef.current = { width, height };
      if (previousSize) map.invalidateSize({ animate: false, pan: false });
      boundsRef.current = {
        local: map.getBoundsZoom(LOCAL_BOUNDS, true),
        sydney: map.getBoundsZoom(SYDNEY_BOUNDS, true),
      };
      renderRef.current(latestProgressRef.current);
    };
    recomputeBounds();

    const resizeObserver = new ResizeObserver(recomputeBounds);
    resizeObserver.observe(mapElRef.current);

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapRef.current = null;
      baseLayerRef.current = null;
      referenceLayerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    referenceLayerRef.current?.setOpacity(isMobile ? 0.7 : 1);
    renderRef.current(latestProgressRef.current);
  }, [isMobile]);

  useEffect(() => {
    latestProgressRef.current = progress.get();
    renderRef.current(latestProgressRef.current);
    const unsubscribe = progress.on('change', (value) => {
      latestProgressRef.current = value;
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        renderRef.current(latestProgressRef.current);
      });
    });
    return () => {
      unsubscribe();
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [progress, reduceMotion]);

  return (
    <div className="community-map">
      <div className="community-map__canvas" ref={mapElRef} />
      <svg className="community-map__overlay" aria-hidden="true">
        <path ref={connectorRef} className="community-map__connector" />
        <g className="community-map__connections">
          {CONNECTION_SCHOOL_INDICES.map((index) => (
            <line key={SORTED_SCHOOLS[index].id} ref={(el) => { schoolConnectionRefs.current[index] = el; }} className="community-map__connection" />
          ))}
        </g>
        {SORTED_SCHOOLS.map((school, index) => {
          const isInnerCatchment = index < INNER_CATCHMENT_COUNT;
          const isOuterSydney = index >= OUTER_SYDNEY_START;
          return (
            <g
              key={school.id}
              ref={(el) => { dotGroupRefs.current[index] = el; }}
              className={`community-map__dot-group${isInnerCatchment ? ' is-inner-catchment' : ''}${isOuterSydney ? ' is-outer-sydney' : ''}`}
            >
              {isInnerCatchment && <circle className="community-map__dot-ring" r="11" />}
              <circle className="community-map__dot" r={isInnerCatchment ? 7.5 : isOuterSydney ? 5.25 : 6.25} />
            </g>
          );
        })}
        {PHYSICAL_CENTRES.map((centrePoint, index) => (
          <g key={centrePoint.id} ref={(el) => { buildingRefs.current[index] = el; }} className="community-map__building">
            <circle r="10" className="community-map__building-halo" />
            <circle r="7" className="community-map__building-ring" />
            <circle r="3.25" className="community-map__building-core" />
            <g className="community-map__building-label" transform={`translate(${index === 0 ? 16 : -16} ${index === 0 ? -13 : 18})`}>
              <line x1={index === 0 ? -10 : 10} y1="8" x2="0" y2="8" />
              <rect x={index === 0 ? 0 : -76} y="0" width="76" height="17" />
              <text x={index === 0 ? 8 : -8} y="12" textAnchor={index === 0 ? 'start' : 'end'}>{centrePoint.buildingLabel.toUpperCase()}</text>
            </g>
          </g>
        ))}
      </svg>
      <div className="community-card">
        <div className="community-card__stack">
          <div className="community-card__local" ref={localCardRef}>
            <p className="community-card__eyebrow">04 / COMMUNITY</p>
            <h2 id="community-title">Local community.</h2>
            <p className="community-card__body">DA Canley Heights, set within its surrounding streets.</p>
          </div>
          <div className="community-card__regional" ref={regionalCardRef}>
            <p className="community-card__eyebrow">INDICATIVE COMMUNITY MAP</p>
            <h2 ref={regionalTitleRef} aria-hidden="true">One centre,<br /><em>in context.</em></h2>
            <hr />
            <p className="community-card__network-label">REGIONAL VIEW</p>
            <p className="community-card__body">The blue dots represent schools attended by students we teach across Sydney. Their positions are indicative while our school-location data is being verified.</p>
            {verifiedCount > 0 ? (
              <div className="community-card__stat">
                <strong>{verifiedCount}</strong>
                <span>verified school locations represented</span>
              </div>
            ) : null}
          </div>
        </div>
        <hr />
        <Link to={bookingPath} className="community-card__cta">BOOK AN INTERVIEW <ArrowRight size={14} /></Link>
      </div>
    </div>
  );
};
