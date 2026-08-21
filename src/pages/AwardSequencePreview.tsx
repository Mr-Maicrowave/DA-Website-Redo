import { Suspense, useEffect, useRef } from 'react';
import { AwardParticleScene } from '@/components/home/award-sequence/AwardParticleScene';
import type { ResolvedStage } from '@/components/home/award-sequence/award-sequence.config';

/**
 * Dev-only isolated preview for building the award particle sequence in
 * stages (see award-sequence.config.ts). Not linked from navigation, not
 * included in production routing — remove once AwardSequence.tsx is wired
 * into Index.tsx for real in the final phase.
 *
 * Default: a ping-pong test driver moves progressRef across 0 -> 0.72 -> 0
 * so the real resolveAwardStage/easing pipeline is exercised without
 * scrolling. For precise, instant comparisons (e.g. "is the logo the same
 * size as the trophy?") pass ?stage=logo or ?stage=trophy to pin the shape
 * at full formation with no animation and no timing guesswork.
 */
const STAGE_OVERRIDES: Record<string, ResolvedStage> = {
  logo: { fromIndex: 1, toIndex: 1, localT: 1, stageIndex: 1, rawProgress: 0.5 },
  trophy: { fromIndex: 2, toIndex: 2, localT: 1, stageIndex: 2, rawProgress: 0.8 },
};

const AwardSequencePreview = () => {
  const progressRef = useRef(0);
  const params = new URLSearchParams(window.location.search);
  const stageOverride = STAGE_OVERRIDES[params.get('stage') ?? ''];

  useEffect(() => {
    if (stageOverride) return;
    let raf: number;
    const durationMs = 9000;
    const start = performance.now();
    const tick = (now: number) => {
      const t = ((now - start) % (durationMs * 2)) / durationMs;
      const pingPong = t <= 1 ? t : 2 - t;
      progressRef.current = pingPong * 0.72;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [stageOverride]);

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#F5F0E8' }}>
      <Suspense fallback={null}>
        <AwardParticleScene progressRef={progressRef} tier="desktop" count={6000} stageOverride={stageOverride} />
      </Suspense>
    </div>
  );
};

export default AwardSequencePreview;
