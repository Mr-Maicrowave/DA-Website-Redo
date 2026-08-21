/* ============================================================================
   AWARD SEQUENCE — PARTICLE SHADERS

   GPU-side morph: four target-position attributes are uploaded once at
   mount and never touched again. Per frame we only update uMorphProgress
   / uFromIndex / uToIndex (+ uTime for idle drift, uSize/uPixelRatio for
   sizing) — interpolation happens per-vertex on the GPU, so cost stays
   flat regardless of particle count. See ParticleMorphSystem.tsx.

   Rendering model (rewritten for crispness — see particle-quality pass):
   the majority of particles (the "dot" category, aSpriteIndex 0) are drawn
   PROCEDURALLY — a sharp bright core with a small, fast-fading halo — not
   sampled from a soft glow texture. Only the rare accent types (soft orb,
   sparkle, streak) still sample their PNG sprite, and even those get their
   alpha sharpened via a power curve so nothing reads as a diffuse blob.
============================================================================ */

export const vertexShader = /* glsl */ `
  attribute vec3 aPositionRandom;
  attribute vec3 aPositionLogo;
  attribute vec3 aPositionTrophy;
  attribute vec3 aPositionVideo;
  attribute float aScaleSeed;
  attribute float aColorSeed;
  attribute float aSpriteIndex;

  uniform float uMorphProgress;
  uniform int uFromIndex;
  uniform int uToIndex;
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uDepthFlatten; // 0 = keep native Z, 1 = flatten toward plane (trophy -> video)

  varying float vColorSeed;
  varying float vSpriteIndex;
  varying float vDepthFade;

  vec3 positionForIndex(int i, vec3 rnd, vec3 logo, vec3 trophy, vec3 video) {
    if (i == 0) return rnd;
    if (i == 1) return logo;
    if (i == 2) return trophy;
    return video;
  }

  void main() {
    vec3 from = positionForIndex(uFromIndex, aPositionRandom, aPositionLogo, aPositionTrophy, aPositionVideo);
    vec3 to = positionForIndex(uToIndex, aPositionRandom, aPositionLogo, aPositionTrophy, aPositionVideo);
    vec3 morphed = mix(from, to, uMorphProgress);

    // Once a shape is settled (from === to, mid-hold) this drift is the
    // ONLY motion left — kept microscopic on purpose so a formed logo
    // locks into a precise, premium-feeling formation instead of
    // constantly jittering. Mid-transition it's the same tiny amount,
    // which is imperceptible against the much larger morph motion.
    float driftPhase = uTime * 0.15 + aColorSeed * 6.2831;
    morphed.x += sin(driftPhase) * 0.0035;
    morphed.y += cos(driftPhase * 0.9) * 0.0035;

    // Flatten Z toward the frame plane during the trophy -> video dissolve.
    morphed.z = mix(morphed.z, 0.0, uDepthFlatten);

    vec4 mvPosition = modelViewMatrix * vec4(morphed, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float camDist = max(-mvPosition.z, 1.0);
    // Depth communicates via SIZE and BRIGHTNESS (vDepthFade, read in the
    // fragment shader), never via blur — every particle stays sharp.
    float depth = clamp(1.0 - camDist / 14.0, 0.25, 1.0);

    // Size tiers — appearance only, independent of the sprite/colour
    // category below. Dense & crisp direction: tiny (0.7-1.2x, ~75%),
    // medium/larger-luminous (1.2-1.6x, ~15%), highlight (1.6-2.2x, top
    // ~10%, shared with the sparkle boost below) — brought back up from
    // the ultra-tiny pass now that particle COUNT is doing most of the
    // detail-resolving work. Uses its own scrambled read of aScaleSeed
    // so it doesn't correlate 1:1 with any other per-particle roll.
    float sizeR = fract(aScaleSeed * 3.1);
    float scale;
    if (sizeR < 0.75) {
      scale = mix(0.7, 1.2, sizeR / 0.75);
    } else if (sizeR < 0.9) {
      scale = mix(1.2, 1.6, (sizeR - 0.75) / 0.15);
    } else {
      scale = mix(1.6, 2.2, (sizeR - 0.9) / 0.1);
    }
    // Star/sparkle particles always render prominent — "slightly larger
    // and brighter" per spec — regardless of their own size-tier roll.
    if (aSpriteIndex > 1.5) {
      scale = max(scale, mix(1.8, 2.4, fract(aColorSeed * 4.0)));
    }
    scale *= depth;

    float pointSize = uSize * uPixelRatio * scale * (140.0 / camDist);
    gl_PointSize = clamp(pointSize, 1.0, 22.0);

    vColorSeed = aColorSeed;
    vSpriteIndex = aSpriteIndex;
    vDepthFade = depth;
  }
`;

export const fragmentShader = /* glsl */ `
  precision highp float;

  uniform sampler2D uSpriteStar;
  // Five-way weighted colour palette (appearance pass — see the actual
  // hex values in award-sequence.config.ts, currently a light-blue mix).
  // Discrete category pick from vColorSeed, not a smooth gradient — reads
  // as a genuine MIX of distinct tones, not one flat colour.
  uniform vec3 uColorRich;
  uniform vec3 uColorWarm;
  uniform vec3 uColorChampagne;
  uniform vec3 uColorHighlight;
  uniform vec3 uColorBronze;

  varying float vColorSeed;
  varying float vSpriteIndex;
  varying float vDepthFade;

  vec3 pickColor(float seed) {
    if (seed < 0.40) return uColorRich;
    if (seed < 0.65) return uColorWarm;
    if (seed < 0.80) return uColorChampagne;
    if (seed < 0.88) return uColorHighlight;
    return uColorBronze;
  }

  void main() {
    vec2 centred = gl_PointCoord - vec2(0.5);
    float d = length(centred);

    vec3 color = pickColor(vColorSeed);
    bool isStar = vSpriteIndex > 1.5; // ~2-3%, elegant 4-point glints
    // ~8% get a soft luminous halo on top of their sharp core (the "3%
    // soft glow" tier, given some headroom) —
    // decorrelated from colour via a scrambled read of the same seed.
    bool hasGlow = fract(vColorSeed * 13.7) < 0.08;

    float alpha;
    vec3 finalColor;

    if (isStar) {
      vec4 tex = texture2D(uSpriteStar, gl_PointCoord);
      alpha = pow(tex.a, 1.6);
      finalColor = mix(color, vec3(0.93, 0.98, 1.0), pow(max(tex.r, max(tex.g, tex.b)), 1.4) * 0.8);
    } else {
      // Sharp bright centre + soft transparent halo — luminous, not blurry.
      // Core tightened and brightened further ("more shiny") so it reads
      // as a small, intense glint rather than a filled circle; hasGlow
      // particles keep a visibly bigger/softer halo around that same
      // tight core, everyone else stays a crisp point with a thin feather.
      float coreRadius = hasGlow ? 0.1 : 0.12;
      float haloRadius = hasGlow ? 0.46 : 0.3;
      float core = 1.0 - smoothstep(0.0, coreRadius, d);
      float halo = 1.0 - smoothstep(coreRadius, haloRadius, d);
      alpha = core + halo * (hasGlow ? 0.45 : 0.18);
      finalColor = mix(color, vec3(0.93, 0.98, 1.0), core * 0.8);
    }

    // Per-particle presence: most land 0.65-0.95, bright/glow/star
    // particles read stronger (0.9-1). Deliberately NOT a flat global
    // dimmer — every particle carries its own opacity.
    float baseAlpha = mix(0.65, 0.95, fract(vColorSeed * 7.0));
    if (isStar || hasGlow) baseAlpha = mix(0.9, 1.0, fract(vColorSeed * 5.0));
    alpha *= baseAlpha;

    // Depth still communicates via brightness — but only the furthest
    // background particles are allowed to drop below 0.5; everything in
    // the main/foreground layers keeps real presence against the cream.
    alpha *= mix(0.32, 1.0, vDepthFade);

    if (alpha < 0.02) discard;

    gl_FragColor = vec4(finalColor, alpha);
  }
`;
