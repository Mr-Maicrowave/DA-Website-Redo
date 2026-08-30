import { useEffect, useLayoutEffect, useMemo, useRef, useState, type MutableRefObject } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, PMREMGenerator } from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RoomRotunda } from './RoomRotunda';
import { createRoomTurnPose } from './tutor-library-timeline';
import type { LibraryEvent, LibraryPhase } from './tutor-library-state';
import { SUBJECT_WALLS } from './tutor-library-data';
import { createCompleteShelfBookPool } from './complete-shelf-book-pool';
import type { CompleteShelfTutorRig } from './CompleteShelfTutorBookBridge';
import type { TutorBookPageTurnDirection } from './tutor-book-pages';
import { getTutorLibraryViewportProfile } from './tutor-library-debug';
import type { BookMotionTimingPolicy } from './tutor-book-motion';

export type TutorLibraryMotionProgress = { turn: number; book: number };

const easeInOutQuart = (progress: number) => progress < .5 ? 8 * progress ** 4 : 1 - (-2 * progress + 2) ** 4 / 2;

const REVIEW_CAMERA_POSES = {
  'resting-book': { position: [.15, 2.42, -4.35], target: [.15, 2.42, -7.55], fov: 38 },
  'central-close': { position: [0, 2.55, 1.05], target: [0, 2.65, -7.45], fov: 35 },
  'base-floor': { position: [0, 1.1, 1.25], target: [0, .54, -7.45], fov: 40 },
  'populated-shelf': { position: [-2.55, 2.55, 1.1], target: [-2.3, 2.45, -7.35], fov: 37 },
  'oblique-cabinet': { position: [-3.35, 2.5, 1.4], target: [-.55, 2.6, -7.4], fov: 46 },
  'extracted-book': { position: [.86, .68, .65], target: [.12, .12, -3.18], fov: 34 },
} as const;

/**
 * A dim image-based environment. Cloth sheen and gilt need a source with area to reflect: punctual
 * lights alone are what made every material read as untextured plastic. Kept low so it lifts the
 * specular without flattening the contrast the strips are there to create.
 */
function LibraryEnvironment({ intensity = .3 }: { intensity?: number }) {
  const gl = useThree(state => state.gl);
  const scene = useThree(state => state.scene);

  useLayoutEffect(() => {
    const generator = new PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const environment = generator.fromScene(room, .04).texture;
    scene.environment = environment;
    scene.environmentIntensity = intensity;
    return () => {
      scene.environment = null;
      environment.dispose();
      generator.dispose();
      room.dispose();
    };
  }, [gl, intensity, scene]);

  return null;
}

function CameraFrame({ fromWallIndex, toWallIndex, motionProgress, debugTurnProgress, reviewView, phase }: { fromWallIndex: number; toWallIndex: number; motionProgress: MutableRefObject<TutorLibraryMotionProgress>; debugTurnProgress?: number; reviewView?: string | null; phase: LibraryPhase }) {
  const camera = useThree(state => state.camera) as PerspectiveCamera;
  const size = useThree(state => state.size);

  useFrame(() => {
    const reviewPose = reviewView ? REVIEW_CAMERA_POSES[reviewView as keyof typeof REVIEW_CAMERA_POSES] : undefined;
    const profile = getTutorLibraryViewportProfile(size.width, size.height, phase);
    const pose = reviewPose ?? createRoomTurnPose(
      fromWallIndex,
      toWallIndex,
      debugTurnProgress ?? motionProgress.current.turn,
      profile.cameraRadius,
      profile.targetRadius,
      SUBJECT_WALLS.length,
    );
    const angle = Math.atan2(pose.target[0], -pose.target[2]);
    const targetX = reviewPose ? pose.target[0] : pose.target[0] + Math.cos(angle) * profile.lateralTargetOffset;
    const targetY = reviewPose ? pose.target[1] : profile.targetHeight;
    const targetZ = reviewPose ? pose.target[2] : pose.target[2] + Math.sin(angle) * profile.lateralTargetOffset;
    camera.position.set(pose.position[0], pose.position[1], pose.position[2]);
    if (!reviewPose) camera.position.y = profile.cameraHeight;
    camera.lookAt(targetX, targetY, targetZ);
    camera.fov = reviewPose?.fov ?? profile.fov;
    camera.updateProjectionMatrix();
  });

  return null;
}

function RoomReadySignal({ onRoomReady }: { onRoomReady: () => void }) {
  const emitted = useRef(false);

  useFrame(() => {
    if (emitted.current) return;
    emitted.current = true;
    requestAnimationFrame(() => onRoomReady());
  });

  return null;
}

function MotionDriver({ phase, generation, timing, motionProgress, debugTurnProgress, debugBookProgress, onComplete }: { phase: LibraryPhase; generation: number; timing: BookMotionTimingPolicy; motionProgress: MutableRefObject<TutorLibraryMotionProgress>; debugTurnProgress?: number; debugBookProgress?: number; onComplete: (event: LibraryEvent) => void }) {
  const startedAt = useRef<number>();
  const completed = useRef<string>();
  useEffect(() => { startedAt.current = undefined; completed.current = undefined; }, [generation, phase]);
  useFrame((state) => {
    if (debugTurnProgress !== undefined) motionProgress.current.turn = debugTurnProgress;
    if (debugBookProgress !== undefined) motionProgress.current.book = debugBookProgress;
    const turn = phase === 'ROOM_TURNING' ? { duration: timing.roomTurnMs, type: 'TURN_COMPLETE' as const, target: 'turn' as const } : undefined;
    const book = ({
      BOOK_HOVER_INTENT: { duration: timing.hoverIntentMs, type: 'EXTRACT' as const },
      BOOK_EXTRACTING: { duration: timing.extractionMs, type: 'PREVIEW_READY' as const },
      BOOK_TO_READING: { duration: timing.toReadingMs, type: 'READING_POSE_READY' as const },
      BOOK_RETURNING: { duration: timing.returnMs, type: 'RETURN_COMPLETE' as const },
    } as Partial<Record<LibraryPhase, { duration: number; type: LibraryEvent['type'] }>>)[phase];
    const current = turn ?? (book ? { ...book, target: 'book' as const } : undefined);
    if (!current) { if (phase !== 'BOOK_PREVIEW') motionProgress.current.book = 0; if (phase !== 'ROOM_TURNING') motionProgress.current.turn = 0; return; }
    if ((current.target === 'turn' && debugTurnProgress !== undefined) || (current.target === 'book' && debugBookProgress !== undefined)) return;
    const start = startedAt.current ?? (startedAt.current = state.clock.elapsedTime * 1000);
    const raw = current.duration === 0 ? 1 : Math.min(1, (state.clock.elapsedTime * 1000 - start) / current.duration);
    motionProgress.current[current.target] = current.target === 'turn' ? easeInOutQuart(raw) : raw * raw * (3 - 2 * raw);
    const key = `${generation}:${phase}`;
    if (raw === 1 && completed.current !== key) { completed.current = key; onComplete({ type: current.type, generation } as LibraryEvent); }
  });
  return null;
}

export function TutorLibraryScene({ fromWallIndex, toWallIndex, motionProgress, debugTurnProgress, debugBookProgress, timing, reviewView, showWallLabels = true, phase, generation, reducedMotion, pageTurnDirection, selectedEditionId, rigIntentEditionId: requestedRigIntentEditionId, rigIntentToken, onRoomReady, onActivate, onRigReady, onRigUnavailable, onLifecycleComplete, onPageSettled, onError }: { fromWallIndex: number; toWallIndex: number; motionProgress: MutableRefObject<TutorLibraryMotionProgress>; debugTurnProgress?: number; debugBookProgress?: number; timing: BookMotionTimingPolicy; reviewView?: string | null; showWallLabels?: boolean; phase: LibraryPhase; generation: number; reducedMotion: boolean; pageTurnDirection: TutorBookPageTurnDirection; selectedEditionId?: string; rigIntentEditionId?: string; rigIntentToken: number; onRoomReady: () => void; onActivate: (editionId: string, rootUuid: string) => void; onRigReady: (editionId: string, rootUuid: string, token: number) => void; onRigUnavailable: (editionId: string, rootUuid: string) => void; onLifecycleComplete: (event: LibraryEvent) => void; onPageSettled: (settledPages: number) => void; onError: (message: string) => void }) {
  const bookPool = useMemo(() => createCompleteShelfBookPool<CompleteShelfTutorRig>({ maxDormantRigs: 3 }), []);
  const [pointerRigIntentEditionId, setPointerRigIntentEditionId] = useState<string>();
  const rigIntentEditionId = requestedRigIntentEditionId ?? pointerRigIntentEditionId;
  useEffect(() => () => bookPool.disposeAll(), [bookPool]);
  useEffect(() => {
    if (phase === 'ROOM_IDLE' && !selectedEditionId) setPointerRigIntentEditionId(undefined);
  }, [phase, selectedEditionId]);

  return (
    <>
      <MotionDriver phase={phase} generation={generation} timing={timing} motionProgress={motionProgress} debugTurnProgress={debugTurnProgress} debugBookProgress={debugBookProgress} onComplete={onLifecycleComplete} />
      <RoomReadySignal onRoomReady={onRoomReady} />
      <CameraFrame fromWallIndex={fromWallIndex} toWallIndex={toWallIndex} motionProgress={motionProgress} debugTurnProgress={debugTurnProgress} reviewView={reviewView} phase={phase} />
      <color attach="background" args={['#050d1a']} />
      <fog attach="fog" args={['#050d1a', 11.5, 26]} />
      <LibraryEnvironment />
      <ambientLight intensity={0.1} color="#d9e4f2" />
      <hemisphereLight intensity={0.16} color="#93a8bd" groundColor="#2a1a10" />
      <RoomRotunda fromWallIndex={fromWallIndex} toWallIndex={toWallIndex} showWallLabels={showWallLabels} pool={bookPool} rigIntentEditionId={rigIntentEditionId} rigIntentToken={rigIntentToken} onRigIntent={setPointerRigIntentEditionId} phase={phase} generation={generation} reducedMotion={reducedMotion} pageTurnDirection={pageTurnDirection} selectedEditionId={selectedEditionId} motionProgress={debugBookProgress ?? motionProgress.current.book} motionProgressRef={motionProgress} onActivate={onActivate} onRigReady={onRigReady} onRigUnavailable={onRigUnavailable} onLifecycleComplete={onLifecycleComplete} onPageSettled={onPageSettled} onError={onError} />
    </>
  );
}
