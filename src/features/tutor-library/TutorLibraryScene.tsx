import { useLayoutEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Color, PerspectiveCamera } from 'three';
import { RoomRotunda } from './RoomRotunda';
import { createRoomTurnPose } from './tutor-library-timeline';
import type { LibraryPhase } from './tutor-library-state';

const REVIEW_CAMERA_POSES = {
  'resting-book': { position: [.15, 2.42, -4.35], target: [.15, 2.42, -7.55], fov: 38 },
  'central-close': { position: [0, 2.55, 1.05], target: [0, 2.65, -7.45], fov: 35 },
  'base-floor': { position: [0, 1.1, 1.25], target: [0, .54, -7.45], fov: 40 },
  'populated-shelf': { position: [-2.55, 2.55, 1.1], target: [-2.3, 2.45, -7.35], fov: 37 },
  'oblique-cabinet': { position: [-3.35, 2.5, 1.4], target: [-.55, 2.6, -7.4], fov: 46 },
  'extracted-book': { position: [.86, .68, .65], target: [.12, .12, -3.18], fov: 34 },
} as const;

function CameraFrame({ fromWallIndex, toWallIndex, turnProgress, reviewView }: { fromWallIndex: number; toWallIndex: number; turnProgress: number; reviewView?: string | null }) {
  const camera = useThree(state => state.camera) as PerspectiveCamera;

  const frameCamera = () => {
    const reviewPose = reviewView ? REVIEW_CAMERA_POSES[reviewView as keyof typeof REVIEW_CAMERA_POSES] : undefined;
    const pose = reviewPose ?? createRoomTurnPose(fromWallIndex, toWallIndex, turnProgress, 4.1, 7.75);
    camera.position.set(pose.position[0], pose.position[1], pose.position[2]);
    camera.lookAt(pose.target[0], pose.target[1], pose.target[2]);
    camera.fov = reviewPose?.fov ?? 52;
    camera.updateProjectionMatrix();
  };

  useLayoutEffect(frameCamera, [camera, fromWallIndex, toWallIndex, turnProgress, reviewView]);
  useFrame(frameCamera);

  return null;
}

export function TutorLibraryScene({ fromWallIndex, toWallIndex, turnProgress, reviewView, showWallLabels = true, phase, selectedEditionId, bookMotionProgress, onHover }: { fromWallIndex: number; toWallIndex: number; turnProgress: number; reviewView?: string | null; showWallLabels?: boolean; phase: LibraryPhase; selectedEditionId?: string; bookMotionProgress: number; onHover: (editionId: string) => void }) {
  return (
    <>
      <CameraFrame fromWallIndex={fromWallIndex} toWallIndex={toWallIndex} turnProgress={turnProgress} reviewView={reviewView} />
      <color attach="background" args={[new Color('#071323')]} />
      <fog attach="fog" args={['#071323', 13, 28]} />
      <ambientLight intensity={0.54} color="#e6e1d6" />
      <hemisphereLight intensity={0.62} color="#b9c5cf" groundColor="#382416" />
      <pointLight castShadow position={[0, 4.25, -4.5]} intensity={20} distance={11.5} decay={2} color="#fff1cf" shadow-mapSize={[1024, 1024]} />
      <pointLight position={[-6.2, 3.4, -4.6]} intensity={12} distance={8.8} decay={2} color="#f0e4cb" />
      <pointLight position={[6.2, 3.4, -4.6]} intensity={12} distance={8.8} decay={2} color="#f0e4cb" />
      <RoomRotunda showWallLabels={showWallLabels} phase={phase} selectedEditionId={selectedEditionId} motionProgress={bookMotionProgress} onHover={onHover} />
    </>
  );
}
