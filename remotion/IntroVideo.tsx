import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  random,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const sceneCount = 9;
const transitionFrames = 10;

const sceneImages = Array.from({ length: sceneCount }, (_, index) =>
  staticFile(`/intro/scenes/scene-${index + 1}.png`)
);

const sceneMotion = [
  { from: 1.03, to: 1.12, x: 0, y: 0 },
  { from: 1.02, to: 1.11, x: -12, y: 4 },
  { from: 1.03, to: 1.13, x: 10, y: 0 },
  { from: 1.04, to: 1.16, x: -10, y: 0 },
  { from: 1.03, to: 1.1, x: 0, y: -8 },
  { from: 1.04, to: 1.17, x: 4, y: -4 },
  { from: 1.03, to: 1.13, x: 0, y: -6 },
  { from: 1.04, to: 1.16, x: 3, y: -4 },
  { from: 1.02, to: 1.045, x: 0, y: 0 },
];

const particles = Array.from({ length: 80 }, (_, index) => ({
  id: index,
  x: random(`particle-x-${index}`),
  y: random(`particle-y-${index}`),
  size: 2 + random(`particle-size-${index}`) * 5,
  speed: 0.4 + random(`particle-speed-${index}`) * 1.4,
  delay: random(`particle-delay-${index}`) * 160,
  blue: random(`particle-blue-${index}`) > 0.78,
}));

const IntroVideo = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps, width, height } = useVideoConfig();
  const sceneDuration = durationInFrames / sceneCount;

  return (
    <AbsoluteFill style={{ backgroundColor: '#fff4de', overflow: 'hidden' }}>
      {sceneImages.map((src, index) => {
        const start = index * sceneDuration;
        const end = start + sceneDuration;
        const localFrame = frame - start;
        const progress = Math.max(0, Math.min(1, localFrame / sceneDuration));
        const opacity = getSceneOpacity(frame, start, end, transitionFrames);
        const motion = sceneMotion[index];
        const float = index === 4 ? Math.sin(localFrame / 8) * 8 : 0;
        const scale = interpolate(progress, [0, 1], [motion.from, motion.to]);
        const x = interpolate(progress, [0, 1], [0, motion.x]);
        const y = interpolate(progress, [0, 1], [0, motion.y]) + float;

        return (
          <AbsoluteFill
            key={src}
            style={{
              opacity,
              transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
              transformOrigin: 'center center',
              willChange: 'opacity, transform',
            }}
          >
            <Img
              src={src}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'saturate(1.05) brightness(1.04)',
              }}
            />
          </AbsoluteFill>
        );
      })}

      <WarmGlow />
      <GoldParticles width={width} height={height} frame={frame} fps={fps} />
      <LightLeak frame={frame} durationInFrames={durationInFrames} />
    </AbsoluteFill>
  );
};

const getSceneOpacity = (
  frame: number,
  start: number,
  end: number,
  transition: number
) => {
  const fadeIn = interpolate(frame, [start, start + transition], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const fadeOut = interpolate(frame, [end - transition, end], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return Math.min(fadeIn, fadeOut);
};

const GoldParticles = ({
  width,
  height,
  frame,
  fps,
}: {
  width: number;
  height: number;
  frame: number;
  fps: number;
}) => (
  <AbsoluteFill style={{ pointerEvents: 'none' }}>
    {particles.map((particle) => {
      const drift = ((frame + particle.delay) * particle.speed) % (height + 180);
      const shimmer = spring({
        frame: (frame + particle.delay) % fps,
        fps,
        config: { damping: 18, stiffness: 42, mass: 0.9 },
      });
      const x = particle.x * width + Math.sin((frame + particle.delay) / 38) * 24;
      const y = particle.y * height - drift + 120;

      return (
        <div
          key={particle.id}
          style={{
            position: 'absolute',
            left: x,
            top: y,
            width: particle.size,
            height: particle.size,
            borderRadius: 999,
            background: particle.blue ? '#8ed4ff' : '#f5c85f',
            boxShadow: particle.blue
              ? '0 0 16px rgba(142, 212, 255, 0.55)'
              : '0 0 18px rgba(245, 200, 95, 0.62)',
            opacity: 0.18 + shimmer * 0.42,
            transform: `scale(${0.7 + shimmer * 0.65})`,
          }}
        />
      );
    })}
  </AbsoluteFill>
);

const WarmGlow = () => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      background:
        'radial-gradient(circle at 50% 28%, rgba(255,255,255,0.34), transparent 34%), radial-gradient(circle at 78% 18%, rgba(255,214,130,0.26), transparent 28%), linear-gradient(180deg, rgba(255,247,225,0.08), rgba(255,255,255,0.16))',
      mixBlendMode: 'screen',
    }}
  />
);

const LightLeak = ({
  frame,
  durationInFrames,
}: {
  frame: number;
  durationInFrames: number;
}) => {
  const sweep = interpolate(frame, [0, durationInFrames], [-35, 135]);
  const pulse = 0.22 + Math.sin(frame / 24) * 0.06;

  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        background: `linear-gradient(${sweep}deg, transparent 0%, rgba(255, 231, 160, ${pulse}) 45%, rgba(255,255,255,0.16) 50%, transparent 62%)`,
        mixBlendMode: 'screen',
      }}
    />
  );
};

export default IntroVideo;
