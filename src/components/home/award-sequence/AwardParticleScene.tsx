import { useMemo, useRef, type MutableRefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ParticleMorphSystem } from './ParticleMorphSystem';
import { AWARD_SEQUENCE, computeLogoWorldBounds, resolveAwardStage, type ResolvedStage } from './award-sequence.config';

type CameraTier = keyof typeof AWARD_SEQUENCE.camera;

interface CameraRigProps {
  progressRef: MutableRefObject<number>;
  tier: CameraTier;
  stageOverride?: ResolvedStage;
}

function CameraRig({ progressRef, tier, stageOverride }: CameraRigProps) {
  const { camera } = useThree();
  const pointer = useRef({ x: 0, y: 0 });
  const config = AWARD_SEQUENCE.camera[tier];

  useFrame(() => {
    const stage = stageOverride ?? resolveAwardStage(progressRef.current);
    // Same tiny push-in (2-4%, per brief) on every stage's local progress —
    // applying it only to the trophy previously made it zoom in far more
    // than the logo, breaking the "same size" read between the two.
    const targetZ = config.pushInStart + (config.pushInEnd - config.pushInStart) * stage.localT;
    camera.position.z += (targetZ - camera.position.z) * 0.06;
    camera.position.x += (pointer.current.x * config.driftPx - camera.position.x) * 0.04;
    camera.position.y += (pointer.current.y * config.driftPx - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

interface AwardParticleSceneProps {
  progressRef: MutableRefObject<number>;
  tier: CameraTier;
  count: number;
  /** Phase 1/2/3 isolated verification only — real builds omit this and let scroll drive everything. */
  stageOverride?: ResolvedStage;
}

export function AwardParticleScene({ progressRef, tier, count, stageOverride }: AwardParticleSceneProps) {
  const config = AWARD_SEQUENCE.camera[tier];
  const size = AWARD_SEQUENCE.particleSize[tier];

  // Computed once from the real viewport at mount (not continuously
  // resize-reactive in this pass — matches the "only change scaling"
  // scope). See computeLogoWorldBounds for why this needs the camera's
  // own projection rather than a fixed world-space constant.
  const { maxWorldWidth, maxWorldHeight } = useMemo(() => {
    if (typeof window === 'undefined') return { maxWorldWidth: 4, maxWorldHeight: 4 };
    return computeLogoWorldBounds(tier, window.innerWidth, window.innerHeight);
  }, [tier]);

  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      camera={{ fov: config.fov, position: [0, 0, config.pushInStart], near: 0.1, far: 40 }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <CameraRig progressRef={progressRef} tier={tier} stageOverride={stageOverride} />
      <ParticleMorphSystem
        count={count}
        size={size}
        progressRef={progressRef}
        stageOverride={stageOverride}
        maxWorldWidth={maxWorldWidth}
        maxWorldHeight={maxWorldHeight}
      />
    </Canvas>
  );
}

export default AwardParticleScene;
