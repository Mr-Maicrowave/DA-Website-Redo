import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { PerspectiveCamera } from 'three';
import { RoomRotunda } from './RoomRotunda';
import { createRoomTurnPose } from './tutor-library-timeline';
import type { LibraryEvent, LibraryPhase } from './tutor-library-state';
import { SUBJECT_WALLS } from './tutor-library-data';
import { createCompleteShelfBookPool } from './complete-shelf-book-pool';
import type { CompleteShelfTutorRig } from './CompleteShelfTutorBookBridge';
import type { TutorBookPageTurnDirection } from './tutor-book-pages';
import { getTutorLibraryViewportProfile } from './tutor-library-debug';

const REVIEW_CAMERA_POSES = {
  'resting-book': { position: [.15, 2.42, -4.35], target: [.15, 2.42, -7.55], fov: 38 },
  'central-close': { position: [0, 2.55, 1.05], target: [0, 2.65, -7.45], fov: 35 },
  'base-floor': { position: [0, 1.1, 1.25], target: [0, .54, -7.45], fov: 40 },
  'populated-shelf': { position: [-2.55, 2.55, 1.1], target: [-2.3, 2.45, -7.35], fov: 37 },
  'oblique-cabinet': { position: [-3.35, 2.5, 1.4], target: [-.55, 2.6, -7.4], fov: 46 },
  'extracted-book': { position: [.86, .68, .65], target: [.12, .12, -3.18], fov: 34 },
} as const;

function CameraFrame({ fromWallIndex, toWallIndex, turnProgress, reviewView, phase }: { fromWallIndex: number; toWallIndex: number; turnProgress: number; reviewView?: string | null; phase: LibraryPhase }) {
  const camera = useThree(state => state.camera) as PerspectiveCamera;
  const size = useThree(state => state.size);

  useLayoutEffect(() => {
    const reviewPose = reviewView ? REVIEW_CAMERA_POSES[reviewView as keyof typeof REVIEW_CAMERA_POSES] : undefined;
    const profile = getTutorLibraryViewportProfile(size.width, size.height, phase);
    const pose = reviewPose ?? createRoomTurnPose(
      fromWallIndex,
      toWallIndex,
      turnProgress,
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
  }, [camera, fromWallIndex, phase, reviewView, size.height, size.width, toWallIndex, turnProgress]);

  return null;
}

export function TutorLibraryScene({ fromWallIndex, toWallIndex, turnProgress, reviewView, showWallLabels = true, phase, generation, reducedMotion, pageTurnDirection, selectedEditionId, rigIntentEditionId: requestedRigIntentEditionId, rigIntentToken, bookMotionProgress, onHover, onActivate, onRigReady, onRigUnavailable, onLifecycleComplete, onPageSettled, onError }: { fromWallIndex: number; toWallIndex: number; turnProgress: number; reviewView?: string | null; showWallLabels?: boolean; phase: LibraryPhase; generation: number; reducedMotion: boolean; pageTurnDirection: TutorBookPageTurnDirection; selectedEditionId?: string; rigIntentEditionId?: string; rigIntentToken: number; bookMotionProgress: number; onHover: (editionId: string, rootUuid: string) => void; onActivate: (editionId: string, rootUuid: string) => void; onRigReady: (editionId: string, rootUuid: string, token: number) => void; onRigUnavailable: (editionId: string, rootUuid: string) => void; onLifecycleComplete: (event: LibraryEvent) => void; onPageSettled: (settledPages: number) => void; onError: (message: string) => void }) {
  const bookPool = useMemo(() => createCompleteShelfBookPool<CompleteShelfTutorRig>({ maxDormantRigs: 3 }), []);
  const [pointerRigIntentEditionId, setPointerRigIntentEditionId] = useState<string>();
  const rigIntentEditionId = requestedRigIntentEditionId ?? pointerRigIntentEditionId;
  useEffect(() => () => bookPool.disposeAll(), [bookPool]);
  useEffect(() => {
    if (phase === 'ROOM_IDLE' && !selectedEditionId) setPointerRigIntentEditionId(undefined);
  }, [phase, selectedEditionId]);

  return (
    <>
      <CameraFrame fromWallIndex={fromWallIndex} toWallIndex={toWallIndex} turnProgress={turnProgress} reviewView={reviewView} phase={phase} />
      <color attach="background" args={['#071323']} />
      <fog attach="fog" args={['#071323', 13, 28]} />
      <ambientLight intensity={0.54} color="#e6e1d6" />
      <hemisphereLight intensity={0.62} color="#b9c5cf" groundColor="#382416" />
      <pointLight castShadow position={[0, 4.25, -4.5]} intensity={20} distance={11.5} decay={2} color="#fff1cf" shadow-mapSize={[1024, 1024]} />
      <pointLight position={[-6.2, 3.4, -4.6]} intensity={12} distance={8.8} decay={2} color="#f0e4cb" />
      <pointLight position={[6.2, 3.4, -4.6]} intensity={12} distance={8.8} decay={2} color="#f0e4cb" />
      <RoomRotunda showWallLabels={showWallLabels} pool={bookPool} rigIntentEditionId={rigIntentEditionId} rigIntentToken={rigIntentToken} onRigIntent={setPointerRigIntentEditionId} phase={phase} generation={generation} reducedMotion={reducedMotion} pageTurnDirection={pageTurnDirection} selectedEditionId={selectedEditionId} motionProgress={bookMotionProgress} onHover={onHover} onActivate={onActivate} onRigReady={onRigReady} onRigUnavailable={onRigUnavailable} onLifecycleComplete={onLifecycleComplete} onPageSettled={onPageSettled} onError={onError} />
    </>
  );
}
