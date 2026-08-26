import { Link } from 'react-router-dom';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from 'react';
import { getPhotoStyle, getPhotoUrl, type CatalogueTutor } from '@/data/teacherCatalogue';
import {
  FEATURED_Z,
  occupantIndex,
  platePosition,
  poseAt,
  processionBandForWidth,
  ringGeometryFor,
  stationBaseAngle,
  type ProcessionBand,
  type RingGeometry,
} from './procession-geometry';

/**
 * The ring line, generated from the same ellipse the nodes ride on so the two
 * can never disagree. Rear is theta 180-360 (above the ring centre, drawn
 * behind the featured educator); front is 0-180 (below it, drawn in front).
 */
function arcPath(fromDeg: number, toDeg: number) {
  const points: string[] = [];
  for (let deg = fromDeg; deg <= toDeg; deg += 3) {
    const radians = (deg * Math.PI) / 180;
    points.push(`${(550 * Math.cos(radians)).toFixed(1)} ${(110 * Math.sin(radians)).toFixed(1)}`);
  }
  return `M${points.join('L')}`;
}

const REAR_ARC = arcPath(180, 360);
const FRONT_ARC = arcPath(0, 180);

/** Ease the clock rather than halting it: a ring that stops dead reads as broken. */
const PAUSE_EASE_MS = 260;
const RESUME_EASE_MS = 420;
/** Movement before a press becomes a drag, so selecting an educator stays reliable. */
const DRAG_THRESHOLD_PX = 4;
/** How long after a drag a click is ignored. */
const DRAG_CLICK_SUPPRESSION_MS = 260;
/** Per-frame decay applied to a flick, normalised to 60fps. */
const MOMENTUM_DECAY = 0.94;
/** Authored resting rotation. Chosen so no educator sits dead front in a still frame. */
const RESTING_ROTATION = 14;

function useStageBox(ref: RefObject<HTMLElement>) {
  const [box, setBox] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const measure = () => {
      const rect = node.getBoundingClientRect();
      setBox((current) => (
        Math.abs(current.width - rect.width) < 1 && Math.abs(current.height - rect.height) < 1
          ? current
          : { width: rect.width, height: rect.height }
      ));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref]);

  return box;
}

function useProcessionBand() {
  const [band, setBand] = useState<ProcessionBand>(() => (
    typeof window === 'undefined' ? 'desktop' : processionBandForWidth(window.innerWidth)
  ));

  useEffect(() => {
    const update = () => setBand(processionBandForWidth(window.innerWidth));
    window.addEventListener('resize', update, { passive: true });
    return () => window.removeEventListener('resize', update);
  }, []);

  return band;
}

export interface TutorProcessionStageProps {
  active: CatalogueTutor;
  roster: readonly CatalogueTutor[];
  reduced: boolean;
  exchanging: boolean;
  onSelect: (id: string, options?: { focusCentre?: boolean }) => boolean;
  featuredActionRef: RefObject<HTMLAnchorElement>;
}

export function TutorProcessionStage({
  active,
  roster,
  reduced,
  exchanging,
  onSelect,
  featuredActionRef,
}: TutorProcessionStageProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const band = useProcessionBand();
  const box = useStageBox(stageRef);
  const ring = useMemo<RingGeometry>(
    () => ringGeometryFor(band, box.width ? box : { width: 1080, height: 720 }),
    [band, box],
  );

  const pool = useMemo(
    () => roster.filter((tutor) => tutor.id !== active.id),
    [roster, active.id],
  );

  const stationEls = useRef<(HTMLDivElement | null)[]>([]);
  const labelEls = useRef<(HTMLSpanElement | null)[]>([]);
  const rotation = useRef(reduced ? RESTING_ROTATION : 0);
  const speed = useRef(reduced ? 0 : 1);
  const lastFrame = useRef<number | null>(null);
  const holds = useRef<Set<string>>(new Set());
  const drag = useRef({
    pointerId: -1,
    active: false,
    startX: 0,
    startRotation: 0,
    lastX: 0,
    lastTime: 0,
    velocity: 0,
    suppressClickUntil: 0,
  });
  const momentum = useRef(0);
  const [paused, setPaused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [step, setStep] = useState(0);
  const [occupants, setOccupants] = useState<number[]>([]);

  const ringRef = useRef(ring);
  ringRef.current = ring;
  const poolSize = pool.length;
  const poolSizeRef = useRef(poolSize);
  poolSizeRef.current = poolSize;

  const paint = useCallback((rotationDeg: number) => {
    const geometry = ringRef.current;
    const next: number[] = [];

    for (let i = 0; i < geometry.stations; i += 1) {
      const base = stationBaseAngle(i, geometry.stations);
      const pose = poseAt(base + rotationDeg, geometry);
      next.push(occupantIndex(i, geometry.stations, base, rotationDeg, poolSizeRef.current));

      const el = stationEls.current[i];
      if (el) {
        el.style.transform = `translate3d(calc(${pose.x.toFixed(2)}px - 50%), calc(${pose.y.toFixed(2)}px - 50%), 0)`;
        el.style.width = `${pose.size.toFixed(2)}px`;
        el.style.height = `${pose.size.toFixed(2)}px`;
        el.style.opacity = pose.opacity.toFixed(3);
        el.style.zIndex = String(pose.z);
        el.style.filter = `blur(${pose.blur.toFixed(2)}px) saturate(${pose.saturate.toFixed(2)}) brightness(${pose.brightness.toFixed(2)}) contrast(${pose.contrast.toFixed(2)})`;
        el.style.setProperty('--tp-depth', pose.depth.toFixed(3));
      }
      const label = labelEls.current[i];
      if (label) {
        label.style.opacity = pose.labelOpacity.toFixed(3);
        label.style.visibility = pose.labelOpacity < 0.02 ? 'hidden' : 'visible';
      }
    }

    setOccupants((current) => (
      current.length === next.length && current.every((value, index) => value === next[index])
        ? current
        : next
    ));
  }, []);

  // One clock for the whole ring. Depth, sort order and labels all read from it.
  useEffect(() => {
    if (reduced) {
      rotation.current = RESTING_ROTATION + step * (360 / ring.stations);
      paint(rotation.current);
      return undefined;
    }

    let frame = 0;
    const tick = (time: number) => {
      frame = window.requestAnimationFrame(tick);
      if (document.hidden) {
        lastFrame.current = null;
        return;
      }
      if (lastFrame.current === null) {
        lastFrame.current = time;
        return;
      }
      const delta = time - lastFrame.current;
      lastFrame.current = time;

      if (drag.current.active) {
        // The pointer owns the rotation; the clock and any momentum stand down.
        momentum.current = 0;
        return;
      }

      const target = holds.current.size > 0 || exchanging ? 0 : 1;
      const ease = target > speed.current ? RESUME_EASE_MS : PAUSE_EASE_MS;
      const towards = delta / ease;
      speed.current = target > speed.current
        ? Math.min(target, speed.current + towards)
        : Math.max(target, speed.current - towards);

      const ambient = (360 / ring.periodSeconds) * speed.current;
      if (Math.abs(momentum.current) > Math.abs(ambient)) {
        // A flick decays into the ambient rate rather than to a stop, so the
        // ring never reads as a carousel that has finished moving.
        rotation.current += (momentum.current * delta) / 1000;
        momentum.current *= Math.pow(MOMENTUM_DECAY, delta / 16.67);
      } else {
        momentum.current = 0;
        rotation.current += (delta / 1000) * ambient;
      }
      paint(rotation.current);
    };

    frame = window.requestAnimationFrame(tick);
    return () => {
      window.cancelAnimationFrame(frame);
      lastFrame.current = null;
    };
  }, [exchanging, paint, reduced, ring.periodSeconds, ring.stations, step]);

  // Repaint immediately when geometry or roster changes, so a resize never shows a stale frame.
  useEffect(() => {
    paint(rotation.current);
  }, [paint, ring, poolSize]);

  const setHold = (key: string, held: boolean) => {
    if (held) holds.current.add(key);
    else holds.current.delete(key);
    setPaused(holds.current.size > 0);
  };

  /** Dragging the full width of the ring turns it half a revolution. */
  const degreesPerPixel = () => 90 / Math.max(1, ring.rx * ring.scale);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (reduced || event.button !== 0) return;
    drag.current = {
      ...drag.current,
      pointerId: event.pointerId,
      active: false,
      startX: event.clientX,
      startRotation: rotation.current,
      lastX: event.clientX,
      lastTime: event.timeStamp,
      velocity: 0,
    };
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (reduced) return;

    if (drag.current.pointerId === event.pointerId) {
      const travelled = event.clientX - drag.current.startX;
      if (!drag.current.active && Math.abs(travelled) > DRAG_THRESHOLD_PX) {
        drag.current.active = true;
        setDragging(true);
        event.currentTarget.setPointerCapture(event.pointerId);
      }
      if (drag.current.active) {
        // Drag right, the front arc travels right, so rotation runs backwards.
        rotation.current = drag.current.startRotation - travelled * degreesPerPixel();
        const elapsed = event.timeStamp - drag.current.lastTime;
        if (elapsed > 0) {
          const perSecond = ((event.clientX - drag.current.lastX) / elapsed) * 1000;
          drag.current.velocity = -perSecond * degreesPerPixel();
        }
        drag.current.lastX = event.clientX;
        drag.current.lastTime = event.timeStamp;
        paint(rotation.current);
        return;
      }
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const nx = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    event.currentTarget.style.setProperty('--tp-drift-x', `${(nx * 9).toFixed(2)}px`);
    event.currentTarget.style.setProperty('--tp-drift-y', `${(ny * 6).toFixed(2)}px`);
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (drag.current.pointerId !== event.pointerId) return;
    if (drag.current.active) {
      momentum.current = drag.current.velocity;
      drag.current.suppressClickUntil = event.timeStamp + DRAG_CLICK_SUPPRESSION_MS;
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      setDragging(false);
    }
    drag.current.pointerId = -1;
    drag.current.active = false;
  };

  const resetDrift = (event: ReactPointerEvent<HTMLDivElement>) => {
    endDrag(event);
    event.currentTarget.style.setProperty('--tp-drift-x', '0px');
    event.currentTarget.style.setProperty('--tp-drift-y', '0px');
  };

  /** A drag that has just ended must not also select whoever was under the pointer. */
  const swallowedByDrag = (timeStamp: number) => timeStamp < drag.current.suppressClickUntil;

  /** Arrow keys give the ring the same control the pointer has. */
  const nudge = (direction: 1 | -1) => {
    momentum.current = 0;
    rotation.current += direction * (360 / ring.stations);
    paint(rotation.current);
  };

  const plate = platePosition(ring);
  const featuredSize = ring.featuredSize * ring.scale;
  const featuredY = ring.featuredY * ring.scale;
  const tierLabel = active.tier === 'senior' ? 'Senior educator' : 'Educator';

  return (
    <div
      ref={stageRef}
      className={`tp${paused ? ' is-paused' : ''}${exchanging ? ' is-exchanging' : ''}${dragging ? ' is-dragging' : ''}`}
      data-band={band}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerLeave={resetDrift}
    >
      <div className="tp__ring" style={{ transform: `translateY(${ring.originY.toFixed(2)}px)` }}>
        {/* Background light only — the portraits never drift, so occlusion stays honest. */}
        <div className="tp__glow" aria-hidden="true" style={{ width: featuredSize * 2.1, height: featuredSize * 2.1, top: featuredY }} />
        <div className="tp__pool" aria-hidden="true" style={{ width: ring.rx * ring.scale * 1.35, height: ring.ry * ring.scale * 2.1 }} />

        <svg className="tp__arc tp__arc--rear" aria-hidden="true" viewBox="-600 -160 1200 320" preserveAspectRatio="none"
          style={{ width: ring.rx * ring.scale * 2.18, height: ring.ry * ring.scale * 2.909 }}>
          <defs>
            <linearGradient id="tp-arc-rear" x1="0" x2="1">
              <stop offset="0" stopColor="#c9a45c" stopOpacity="0" />
              <stop offset="0.5" stopColor="#c9a45c" stopOpacity="0.2" />
              <stop offset="1" stopColor="#c9a45c" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={REAR_ARC} />
        </svg>

        <div className="tp__featured" style={{ top: featuredY, width: featuredSize, height: featuredSize, zIndex: FEATURED_Z }}>
          <div className="tp__occluder" aria-hidden="true" />
          <Link
            ref={featuredActionRef}
            className="tp__featured-action"
            to={`/find-teacher?tutor=${active.id}`}
            aria-label={`Open ${active.name}'s full profile`}
            onMouseEnter={() => setHold('hover:featured', true)}
            onMouseLeave={() => setHold('hover:featured', false)}
            onFocus={() => setHold('focus:featured', true)}
            onBlur={() => setHold('focus:featured', false)}
          >
            <span className="tp__mask tp__mask--featured">
              <span className="tp__zoom">
                <img src={getPhotoUrl(active)} alt="" style={getPhotoStyle(active)} />
              </span>
            </span>
          </Link>
        </div>

        <svg className="tp__arc tp__arc--front" aria-hidden="true" viewBox="-600 -160 1200 320" preserveAspectRatio="none"
          style={{ width: ring.rx * ring.scale * 2.18, height: ring.ry * ring.scale * 2.909, zIndex: FEATURED_Z + 5 }}>
          <defs>
            <linearGradient id="tp-arc-front" x1="0" x2="1">
              <stop offset="0" stopColor="#e6ca92" stopOpacity="0" />
              <stop offset="0.32" stopColor="#e6ca92" stopOpacity="0.4" />
              <stop offset="0.68" stopColor="#e6ca92" stopOpacity="0.4" />
              <stop offset="1" stopColor="#e6ca92" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={FRONT_ARC} />
        </svg>

        <div
          className="tp__plate"
          style={{ top: plate.top, minHeight: plate.height, width: featuredSize * 1.16, fontSize: `${(ring.scale * 100).toFixed(1)}%` }}
        >
          <span className="tp__plate-tier">{tierLabel}</span>
          <span className="tp__plate-name">{active.name}</span>
          <span className="tp__plate-designation">{active.designation}</span>
        </div>

        {Array.from({ length: ring.stations }, (_, i) => {
          const tutor = pool[occupants[i] ?? i % Math.max(1, pool.length)];
          if (!tutor) return null;
          return (
            <div
              key={`station-${i}`}
              className="tp__station"
              ref={(node) => { stationEls.current[i] = node; }}
            >
              <button
                type="button"
                className="tp__portrait"
                data-tutor-id={tutor.id}
                onMouseEnter={() => setHold(`hover:${i}`, true)}
                onMouseLeave={() => setHold(`hover:${i}`, false)}
                onFocus={() => setHold(`focus:${i}`, true)}
                onBlur={() => setHold(`focus:${i}`, false)}
                onClick={(event) => {
                  if (swallowedByDrag(event.timeStamp)) return;
                  onSelect(tutor.id, { focusCentre: event.detail === 0 });
                }}
                onKeyDown={(event) => {
                  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
                  event.preventDefault();
                  nudge(event.key === 'ArrowRight' ? -1 : 1);
                }}
                aria-label={`Feature ${tutor.name}, ${tutor.designation}`}
              >
                <span className="tp__mask">
                  <span className="tp__zoom">
                    <img src={getPhotoUrl(tutor)} alt="" style={getPhotoStyle(tutor)} />
                  </span>
                </span>
              </button>
              <span
                className="tp__label"
                aria-hidden="true"
                ref={(node) => { labelEls.current[i] = node; }}
              >
                <span className="tp__label-name">{tutor.name}</span>
                <span className="tp__label-designation">{tutor.designation}</span>
              </span>
            </div>
          );
        })}
      </div>

      {reduced ? (
        <div className="tp__advance">
          <button type="button" onClick={() => setStep((value) => value - 1)} aria-label="Show the previous educators">&#8249;</button>
          <span>Turn the ring</span>
          <button type="button" onClick={() => setStep((value) => value + 1)} aria-label="Show the next educators">&#8250;</button>
        </div>
      ) : (
        <p className="tp__hint"><span aria-hidden="true" />Select an educator<span aria-hidden="true" /></p>
      )}
    </div>
  );
}
