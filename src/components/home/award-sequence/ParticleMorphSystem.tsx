import { useEffect, useMemo, useRef, type MutableRefObject } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { vertexShader, fragmentShader } from './award-sequence.shaders';
import {
  randomField,
  placeholderLogo,
  placeholderTrophy,
  placeholderVideoFrame,
  buildParticleSeeds,
  sampleLogo,
  sampleTrophy,
} from './particleTargets';
import { AWARD_SEQUENCE, resolveAwardStage, type ResolvedStage } from './award-sequence.config';

// Every particle except the ~2.5% star sparkles is now drawn procedurally
// (sharp bright core + optional soft halo) directly in the fragment shader —
// see award-sequence.shaders.ts — so only the star sprite is still loaded.
const SPRITE_PATHS = {
  star: '/assets/award-sequence/particles/particle_star.png',
};

interface ParticleMorphSystemProps {
  count: number;
  size: number;
  /** 0-1 raw scroll progress, written by GSAP elsewhere, read here every frame. */
  progressRef: MutableRefObject<number>;
  /** Phase 1: no scroll wiring yet, so this stays fixed at a caller-supplied stage. */
  stageOverride?: ResolvedStage;
  /** World-space bounding box the formed logo must fit inside — see computeLogoWorldBounds. */
  maxWorldWidth: number;
  maxWorldHeight: number;
}

export function ParticleMorphSystem({ count, size, progressRef, stageOverride, maxWorldWidth, maxWorldHeight }: ParticleMorphSystemProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const spriteStar = useLoader(THREE.TextureLoader, SPRITE_PATHS.star);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positionRandom = randomField(count, AWARD_SEQUENCE.layers, 1);
    const positionLogo = placeholderLogo(count);
    const positionTrophy = placeholderTrophy(count);
    const positionVideo = placeholderVideoFrame(count);
    const { scaleSeed, colorSeed, spriteIndex } = buildParticleSeeds(count, AWARD_SEQUENCE.spriteDistribution);

    // `position` itself is required by three but unused by the vertex
    // shader (we read from aPositionRandom instead) — seed it so nothing
    // downstream (frustum culling bounds) chokes on an empty attribute.
    geo.setAttribute('position', new THREE.BufferAttribute(positionRandom.slice(), 3));
    geo.setAttribute('aPositionRandom', new THREE.BufferAttribute(positionRandom, 3));
    geo.setAttribute('aPositionLogo', new THREE.BufferAttribute(positionLogo, 3));
    geo.setAttribute('aPositionTrophy', new THREE.BufferAttribute(positionTrophy, 3));
    geo.setAttribute('aPositionVideo', new THREE.BufferAttribute(positionVideo, 3));
    geo.setAttribute('aScaleSeed', new THREE.BufferAttribute(scaleSeed, 1));
    geo.setAttribute('aColorSeed', new THREE.BufferAttribute(colorSeed, 1));
    geo.setAttribute('aSpriteIndex', new THREE.BufferAttribute(spriteIndex, 1));
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 10);

    return geo;
  }, [count]);

  // Real logo sampling is async (image decode + pixel read) — the geometry
  // above starts with a placeholder shape so first paint isn't blocked,
  // then this swaps the real sampled points into the SAME attribute/array
  // in place once ready. No geometry rebuild, no particle re-creation —
  // continuity is preserved exactly as required.
  useEffect(() => {
    let cancelled = false;
    sampleLogo(count, maxWorldWidth, maxWorldHeight).then((positions) => {
      if (cancelled) return;
      const attr = geometry.getAttribute('aPositionLogo') as THREE.BufferAttribute;
      (attr.array as Float32Array).set(positions);
      attr.needsUpdate = true;
    });
    return () => {
      cancelled = true;
    };
  }, [count, geometry, maxWorldWidth, maxWorldHeight]);

  // Same in-place swap for the trophy target — GLTF load + surface sampling
  // is the slowest of the four (model fetch + area-weighted sampling), but
  // still only runs once per mount, never per-frame.
  useEffect(() => {
    let cancelled = false;
    sampleTrophy(count).then((positions) => {
      if (cancelled) return;
      const attr = geometry.getAttribute('aPositionTrophy') as THREE.BufferAttribute;
      (attr.array as Float32Array).set(positions);
      attr.needsUpdate = true;
    });
    return () => {
      cancelled = true;
    };
  }, [count, geometry]);

  const uniforms = useMemo(
    () => ({
      uMorphProgress: { value: 0 },
      uFromIndex: { value: 0 },
      uToIndex: { value: 0 },
      uTime: { value: 0 },
      uSize: { value: size },
      uPixelRatio: { value: typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1 },
      uDepthFlatten: { value: 0 },
      uSpriteStar: { value: spriteStar },
      uColorRich: { value: AWARD_SEQUENCE.colors.rich },
      uColorWarm: { value: AWARD_SEQUENCE.colors.warm },
      uColorChampagne: { value: AWARD_SEQUENCE.colors.champagne },
      uColorHighlight: { value: AWARD_SEQUENCE.colors.highlight },
      uColorBronze: { value: AWARD_SEQUENCE.colors.bronze },
    }),
    [size, spriteStar]
  );

  useFrame((state) => {
    const material = materialRef.current;
    if (!material) return;

    const stage = stageOverride ?? resolveAwardStage(progressRef.current);

    material.uniforms.uFromIndex.value = stage.fromIndex;
    material.uniforms.uToIndex.value = stage.toIndex;
    material.uniforms.uMorphProgress.value = stage.localT;
    material.uniforms.uTime.value = state.clock.elapsedTime;
    // Flatten depth only during the trophy(2) -> video(3) dissolve.
    material.uniforms.uDepthFlatten.value = stage.fromIndex === 2 && stage.toIndex === 3 ? stage.localT : 0;
  });

  return (
    <points geometry={geometry}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </points>
  );
}
