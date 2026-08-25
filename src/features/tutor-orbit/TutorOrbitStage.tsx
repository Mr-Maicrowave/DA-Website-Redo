import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { useEffect, useRef, useState, type PointerEvent } from 'react';
import {
  getPhotoStyle,
  getPhotoUrl,
  type CatalogueTutor,
} from '@/data/teacherCatalogue';
import {
  INNER_ORBIT_DURATION_SECONDS,
  OUTER_ORBIT_DURATION_SECONDS,
  type OrbitTier,
  type SelectionPhase,
} from './tutor-orbit-config';
import {
  SAFE_SECTORS,
  geometryBandForWidth,
  poseForSector,
  type GeometryBand,
} from './tutor-orbit-geometry';
import {
  normalizeStagePointer,
  holdKeysAfterSelection,
  pruneTutorHoldKeys,
  tutorsForGeometryBand,
} from './tutor-orbit-stage-helpers';

const TAU = Math.PI * 2;

const portraitTransition = (reduced: boolean) => ({
  layout: { duration: reduced ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] as const },
});

function useGeometryBand() {
  const [band, setBand] = useState<GeometryBand>(() => geometryBandForWidth(window.innerWidth));

  useEffect(() => {
    const update = () => setBand(geometryBandForWidth(window.innerWidth));
    window.addEventListener('resize', update, { passive: true });
    return () => window.removeEventListener('resize', update);
  }, []);

  return band;
}

function useOrbitClock(enabled: boolean, durationSeconds: number, direction: 1 | -1) {
  const clock = useMotionValue(0);
  const lastFrameAt = useRef<number | null>(null);
  const elapsedMs = useRef(0);

  useEffect(() => {
    const resetFrame = () => {
      lastFrameAt.current = null;
    };
    document.addEventListener('visibilitychange', resetFrame);
    return () => document.removeEventListener('visibilitychange', resetFrame);
  }, []);

  useAnimationFrame((time) => {
    if (!enabled || document.hidden) {
      lastFrameAt.current = null;
      return;
    }

    if (lastFrameAt.current === null) {
      lastFrameAt.current = time;
      return;
    }

    elapsedMs.current += time - lastFrameAt.current;
    lastFrameAt.current = time;
    clock.set(direction * elapsedMs.current / 1000 / durationSeconds * TAU);
  });

  return clock;
}

interface OrbitTutorProps {
  tutor: CatalogueTutor;
  index: number;
  tier: OrbitTier;
  band: GeometryBand;
  clock: MotionValue<number>;
  reduced: boolean;
  isPromotedSource: boolean;
  onSelect: (id: string) => boolean;
  setMotionHold: (key: string, held: boolean) => void;
  applySelectionHolds: (id: string, accepted: boolean) => void;
}

function OrbitTutor({
  tutor,
  index,
  tier,
  band,
  clock,
  reduced,
  isPromotedSource,
  onSelect,
  setMotionHold,
  applySelectionHolds,
}: OrbitTutorProps) {
  const sector = SAFE_SECTORS[band][tier][index] ?? SAFE_SECTORS[band][tier][0];
  const progress = useTransform(clock, (angle) => ((angle / TAU) % 1 + 1) % 1);
  const poseAtProgress = (progress: number) => poseForSector(sector, progress);
  const x = useTransform(progress, (value) => poseAtProgress(value).x);
  const y = useTransform(progress, (value) => poseAtProgress(value).y + Math.sin((value + sector.phase) * TAU) * 2);
  const scale = useTransform(progress, (value) => poseAtProgress(value).scale);
  const opacity = useTransform(progress, (value) => poseAtProgress(value).opacity);

  return (
    <motion.div
      className={`tutor-orbit__${tier}-slot tutor-orbit__${tier}-slot--${index}`}
      style={{ top: '50%', left: '50%', x, y, scale, opacity: isPromotedSource ? 0 : opacity }}
    >
      <button
        type="button"
        className={`tutor-orbit__satellite tutor-orbit__satellite--${tier}`}
        onMouseEnter={() => setMotionHold(`hover:${tutor.id}`, true)}
        onMouseLeave={() => setMotionHold(`hover:${tutor.id}`, false)}
        onFocus={() => setMotionHold(`focus:${tutor.id}`, true)}
        onBlur={() => setMotionHold(`focus:${tutor.id}`, false)}
        onClick={() => {
          const accepted = onSelect(tutor.id);
          applySelectionHolds(tutor.id, accepted);
        }}
        aria-label={`View ${tutor.name}`}
      >
        <motion.span
          className="tutor-orbit__satellite-portrait"
          layoutId={`tutor-${tutor.id}`}
          transition={portraitTransition(reduced)}
        >
          <img src={getPhotoUrl(tutor)} alt="" style={getPhotoStyle(tutor)} />
        </motion.span>
      </button>
      <span className={`tutor-orbit__satellite-name${tier === 'outer' ? ' tutor-orbit__satellite-name--tooltip' : ''}`} aria-hidden="true">
        {tutor.name}
      </span>
    </motion.div>
  );
}

function OrbitMarker({
  tier,
  index,
  band,
  clock,
  reduced,
}: {
  tier: OrbitTier;
  index: number;
  band: GeometryBand;
  clock: MotionValue<number>;
  reduced: boolean;
}) {
  const sector = SAFE_SECTORS[band][tier][index] ?? SAFE_SECTORS[band][tier][0];
  const progress = useTransform(clock, (angle) => ((angle / TAU) % 1 + 1) % 1);
  const x = useTransform(progress, (value) => poseForSector(sector, value).x);
  const y = useTransform(progress, (value) => poseForSector(sector, value).y);

  return <motion.span className={`tutor-orbit__marker tutor-orbit__marker--${tier}`} style={{ x, y }} />;
}

const entrance = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

export interface TutorOrbitStageProps {
  active: CatalogueTutor;
  innerTutors: readonly CatalogueTutor[];
  outerTutors: readonly CatalogueTutor[];
  phase: SelectionPhase;
  selectedId: string | null;
  originTier: OrbitTier | null;
  reduced: boolean;
  onSelect: (id: string) => boolean;
}

export function TutorOrbitStage({
  active,
  innerTutors,
  outerTutors,
  phase,
  selectedId,
  originTier,
  reduced,
  onSelect,
}: TutorOrbitStageProps) {
  const band = useGeometryBand();
  const [holdKeys, setHoldKeys] = useState<Set<string>>(() => new Set());
  const paused = holdKeys.size > 0 || phase !== 'idle';
  const innerClock = useOrbitClock(!reduced && !paused, INNER_ORBIT_DURATION_SECONDS, 1);
  const outerClock = useOrbitClock(!reduced && !paused, OUTER_ORBIT_DURATION_SECONDS, -1);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const fieldX = useSpring(useTransform(pointerX, (value) => Math.sign(value) * Math.abs(value) * 5), { stiffness: 55, damping: 22 });
  const fieldY = useSpring(useTransform(pointerY, (value) => Math.sign(value) * Math.abs(value) * 5), { stiffness: 55, damping: 22 });
  const haloX = useSpring(useTransform(pointerX, [-1, 1], [-8, 8]), { stiffness: 55, damping: 22 });
  const haloY = useSpring(useTransform(pointerY, [-1, 1], [-8, 8]), { stiffness: 55, damping: 22 });
  const geometryX = useSpring(useTransform(pointerX, [-1, 1], [-3, 3]), { stiffness: 55, damping: 22 });
  const geometryY = useSpring(useTransform(pointerY, [-1, 1], [-3, 3]), { stiffness: 55, damping: 22 });
  const selectedTutor = [active, ...innerTutors, ...outerTutors].find((tutor) => tutor.id === selectedId);
  const selectedIndex = originTier === 'outer'
    ? outerTutors.findIndex((tutor) => tutor.id === selectedId)
    : innerTutors.findIndex((tutor) => tutor.id === selectedId);
  const originSector = originTier ? SAFE_SECTORS[band][originTier][Math.max(0, selectedIndex)] : undefined;
  const waypointSector = SAFE_SECTORS[band].inner[Math.max(0, selectedIndex) % SAFE_SECTORS[band].inner.length];
  const originProgress = ((outerClock.get() / TAU) % 1 + 1) % 1;
  const origin = originSector ? poseForSector(originSector, originProgress) : { x: 0, y: 0 };
  const waypoint = poseForSector(waypointSector, 0.5);
  const stageInnerTutors = tutorsForGeometryBand(innerTutors, band, 'inner');
  const stageOuterTutors = tutorsForGeometryBand(outerTutors, band, 'outer');

  useEffect(() => {
    if (phase === 'idle' || !selectedId) return;
    setHoldKeys((current) => pruneTutorHoldKeys(current, selectedId));
  }, [phase, selectedId]);

  const setMotionHold = (key: string, held: boolean) => {
    setHoldKeys((current) => {
      const next = new Set(current);
      if (held) next.add(key);
      else next.delete(key);
      return next;
    });
  };

  const applySelectionHolds = (tutorId: string, accepted: boolean) => {
    setHoldKeys((current) => holdKeysAfterSelection(current, tutorId, accepted));
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set(normalizeStagePointer(event.clientX, rect.left, rect.width));
    pointerY.set(normalizeStagePointer(event.clientY, rect.top, rect.height));
  };

  const resetPointer = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <motion.div
      className={`tutor-orbit__stage${paused ? ' is-paused' : ''}${phase !== 'idle' ? ' is-transitioning' : ''}`}
      initial="hidden"
      animate="visible"
      onPointerMove={reduced ? undefined : onPointerMove}
      onPointerLeave={resetPointer}
    >
      <motion.div aria-hidden="true" variants={entrance} transition={{ duration: reduced ? 0 : 0.3 }} style={{ position: 'absolute', inset: 0 }}>
        <motion.svg
          className="tutor-orbit__geometry"
          viewBox="0 0 700 650"
          preserveAspectRatio="none"
          style={reduced ? undefined : { x: geometryX, y: geometryY }}
        >
          <ellipse className="tutor-orbit__path tutor-orbit__path--outer" cx="350" cy="326" rx="322" ry="258" transform="rotate(-7 350 326)" />
          <ellipse className="tutor-orbit__path tutor-orbit__path--middle" cx="350" cy="326" rx="258" ry="205" transform="rotate(6 350 326)" />
          <ellipse className="tutor-orbit__path tutor-orbit__path--inner" cx="350" cy="324" rx="174" ry="165" transform="rotate(-4 350 324)" />
          <path className="tutor-orbit__path tutor-orbit__path--dash" d="M36 380C116 106 472 36 666 240" />
        </motion.svg>
      </motion.div>

      <motion.div aria-hidden="true" variants={entrance} transition={{ duration: reduced ? 0 : 0.3 }} style={{ position: 'absolute', inset: 0 }}>
        <motion.div style={{ position: 'absolute', inset: 0, ...(reduced ? {} : { x: haloX, y: haloY }) }}>
          <div className={`tutor-orbit__halo tutor-orbit__halo--${active.primarySubject.toLowerCase()}`} />
        </motion.div>
      </motion.div>

      <motion.div variants={entrance} transition={{ delay: reduced ? 0 : 0.3, duration: reduced ? 0 : 0.46 }} style={{ position: 'absolute', inset: 0, zIndex: 4, pointerEvents: 'none' }}>
        <div className="tutor-orbit__featured">
          <div className="tutor-orbit__featured-label">{active.tier === 'senior' ? 'Senior educator' : 'Educator'}</div>
          <div className="tutor-orbit__featured-float">
            <motion.div
              className="tutor-orbit__featured-frame"
              layoutId={`tutor-${active.id}`}
              transition={portraitTransition(reduced)}
            >
              <img src={getPhotoUrl(active)} alt={`${active.name}, DA Tuition educator`} style={getPhotoStyle(active)} />
            </motion.div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={entrance} transition={{ delay: reduced ? 0 : 0.5, duration: reduced ? 0 : 0.6 }} style={{ position: 'absolute', inset: 0 }}>
      <motion.div className="tutor-orbit__portrait-field" style={{ position: 'absolute', inset: 0, ...(reduced ? {} : { x: fieldX, y: fieldY }) }}>
        <motion.div className="tutor-orbit__inner-orbit" variants={entrance} transition={{ delay: reduced ? 0 : 0.5, duration: reduced ? 0 : 0.6 }}>
          {stageInnerTutors.map((tutor, index) => (
            <OrbitTutor key={tutor.id} tutor={tutor} index={index} tier="inner" band={band} clock={innerClock} reduced={reduced} isPromotedSource={false} onSelect={onSelect} setMotionHold={setMotionHold} applySelectionHolds={applySelectionHolds} />
          ))}
        </motion.div>

        <motion.div className="tutor-orbit__outer-orbit" variants={entrance} transition={{ delay: reduced ? 0 : 0.72, duration: reduced ? 0 : 0.73 }}>
          {stageOuterTutors.map((tutor, index) => (
            <OrbitTutor key={tutor.id} tutor={tutor} index={index} tier="outer" band={band} clock={outerClock} reduced={reduced} isPromotedSource={phase === 'promoting' && originTier === 'outer' && tutor.id === selectedId} onSelect={onSelect} setMotionHold={setMotionHold} applySelectionHolds={applySelectionHolds} />
          ))}
        </motion.div>

        {phase === 'promoting' && selectedTutor ? (
          <motion.div
            className="tutor-orbit__promotion-portrait"
            aria-hidden="true"
            initial={{ x: origin.x, y: origin.y, scale: 0.9, opacity: 0.7 }}
            animate={{ x: [origin.x, waypoint.x], y: [origin.y, waypoint.y], scale: [0.9, 1.08], opacity: 1 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: 'absolute', zIndex: 7, top: '50%', left: '50%', width: 56, aspectRatio: '1', overflow: 'hidden', borderRadius: '50%', pointerEvents: 'none' }}
          >
            <img src={getPhotoUrl(selectedTutor)} alt="" style={{ ...getPhotoStyle(selectedTutor), width: '100%', height: '100%', objectFit: 'cover' }} />
          </motion.div>
        ) : null}
      </motion.div>
      </motion.div>

      <OrbitMarker tier="inner" index={1} band={band} clock={innerClock} reduced={reduced} />
      <OrbitMarker tier="outer" index={3} band={band} clock={outerClock} reduced={reduced} />
      <OrbitMarker tier="outer" index={7} band={band} clock={outerClock} reduced={reduced} />

      <motion.p className="tutor-orbit__hint" variants={entrance} transition={{ delay: reduced ? 0 : 1.05, duration: reduced ? 0 : 0.75 }}><span aria-hidden="true" />Select an educator to learn more</motion.p>
    </motion.div>
  );
}
