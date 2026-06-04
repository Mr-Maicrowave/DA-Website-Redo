/**
 * DALogoIntro.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Full-screen cinematic intro for DA Tuition.
 *
 * Animation phases
 * ────────────────
 *  Phase 1  0 – 2.2 s   Particles float freely like a constellation field
 *  Phase 2  2.2 – 5.0 s  Particles converge and form the DA logo shape
 *  Phase 3  5.0 – 6.8 s  Formed logo glows; real logo image fades in on top
 *  Phase 4  6.8 – 8.0 s  Entire overlay fades out → homepage reveals
 *
 * Technique
 * ─────────
 *  • Pure Canvas 2D — no external libraries needed.
 *  • Logo shape is obtained by drawing the actual PNG onto an offscreen canvas
 *    and sampling every non-white / non-transparent pixel → those become the
 *    particle target positions (so the formation exactly matches the real logo).
 *  • Pre-rendered glow sprites (radial-gradient canvases) are used instead of
 *    per-frame gradient creation, keeping the frame budget low.
 *  • The real logo PNG fades in at ~85 % opacity during Phase 3, guaranteeing
 *    the logo always looks crisp and recognisable regardless of particle count.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useRef, useCallback } from 'react';

// ─── Props ──────────────────────────────────────────────────────────────────
interface Props {
  /** Called once the fade-out is fully complete. */
  onComplete: () => void;
}

// ─── Tuneable constants ──────────────────────────────────────────────────────
const PARTICLE_COUNT    = 2800;
const PHASE_FLOAT_MS    = 2200;   // duration of free-float
const PHASE_CONVERGE_MS = 2800;   // duration of convergence
const PHASE_GLOW_MS     = 1800;   // duration of logo glow
const PHASE_FADE_MS     = 1200;   // duration of overlay fade-out

// Logo display size as a fraction of the smaller screen dimension
const LOGO_SCALE = 0.48;

// Particle sprite sizes (px on the pre-rendered canvas)
const SPRITE_SIZE_LARGE = 100;
const SPRITE_SIZE_SMALL = 40;

// ─── Particle data structure ─────────────────────────────────────────────────
interface Particle {
  // current position (updated every frame during float)
  x: number; y: number;
  // idle drift velocity
  vx: number; vy: number;
  // logo target position
  tx: number; ty: number;
  // visual
  size: number;          // base display radius multiplier
  isStar: boolean;       // true → draw spike-star sprite; false → soft dot
  opacity: number;
  twinklePhase: number;
  twinkleSpeed: number;
}

// ─── Utility: ease-in-out cubic ─────────────────────────────────────────────
function easeInOut(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

// ─── Sprite factories ────────────────────────────────────────────────────────
/**
 * Build a pre-rendered "spike star" canvas (4-pointed cross with glow halo).
 * This is the premium celestial-map-style star used for larger particles.
 */
function buildStarSprite(
  r: number, g: number, b: number,
  size = SPRITE_SIZE_LARGE
): HTMLCanvasElement {
  const c   = document.createElement('canvas');
  c.width   = c.height = size;
  const ctx = c.getContext('2d')!;
  const m   = size / 2;

  // Outer radial halo
  const halo = ctx.createRadialGradient(m, m, 0, m, m, m);
  halo.addColorStop(0,   `rgba(${r},${g},${b},0.55)`);
  halo.addColorStop(0.3, `rgba(${r},${g},${b},0.14)`);
  halo.addColorStop(1,   'rgba(0,0,0,0)');
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, size, size);

  // Horizontal spike (thin ellipse with bright-centre gradient)
  const makeSpike = (horizontal: boolean) => {
    const g2 = horizontal
      ? ctx.createLinearGradient(0, m, size, m)
      : ctx.createLinearGradient(m, 0, m, size);
    g2.addColorStop(0,    'rgba(255,255,255,0)');
    g2.addColorStop(0.3,  `rgba(${r},${g},${b},0.65)`);
    g2.addColorStop(0.5,  'rgba(255,255,255,1)');
    g2.addColorStop(0.7,  `rgba(${r},${g},${b},0.65)`);
    g2.addColorStop(1,    'rgba(255,255,255,0)');
    ctx.save();
    ctx.fillStyle = g2;
    horizontal
      ? ctx.beginPath() && ctx.ellipse(m, m, m * 0.92, m * 0.055, 0, 0, Math.PI * 2)
      : ctx.beginPath() && ctx.ellipse(m, m, m * 0.055, m * 0.92, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  // Draw both spikes
  const hg = ctx.createLinearGradient(0, m, size, m);
  hg.addColorStop(0, 'rgba(255,255,255,0)');
  hg.addColorStop(0.3, `rgba(${r},${g},${b},0.65)`);
  hg.addColorStop(0.5, 'rgba(255,255,255,1)');
  hg.addColorStop(0.7, `rgba(${r},${g},${b},0.65)`);
  hg.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.save();
  ctx.fillStyle = hg;
  ctx.beginPath();
  ctx.ellipse(m, m, m * 0.92, m * 0.055, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  const vg = ctx.createLinearGradient(m, 0, m, size);
  vg.addColorStop(0, 'rgba(255,255,255,0)');
  vg.addColorStop(0.3, `rgba(${r},${g},${b},0.65)`);
  vg.addColorStop(0.5, 'rgba(255,255,255,1)');
  vg.addColorStop(0.7, `rgba(${r},${g},${b},0.65)`);
  vg.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.save();
  ctx.fillStyle = vg;
  ctx.beginPath();
  ctx.ellipse(m, m, m * 0.055, m * 0.92, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Bright core dot
  const core = ctx.createRadialGradient(m, m, 0, m, m, m * 0.18);
  core.addColorStop(0, 'rgba(255,255,255,1)');
  core.addColorStop(1, `rgba(${r},${g},${b},0)`);
  ctx.fillStyle = core;
  ctx.beginPath();
  ctx.arc(m, m, m * 0.18, 0, Math.PI * 2);
  ctx.fill();

  return c;
}

/** Soft glow dot — used for the smaller background particles. */
function buildDotSprite(
  r: number, g: number, b: number,
  size = SPRITE_SIZE_SMALL
): HTMLCanvasElement {
  const c   = document.createElement('canvas');
  c.width   = c.height = size;
  const ctx = c.getContext('2d')!;
  const m   = size / 2;
  const grd = ctx.createRadialGradient(m, m, 0, m, m, m);
  grd.addColorStop(0,    'rgba(255,255,255,1)');
  grd.addColorStop(0.18, `rgba(${r},${g},${b},0.85)`);
  grd.addColorStop(0.55, `rgba(${r},${g},${b},0.22)`);
  grd.addColorStop(1,    'rgba(0,0,0,0)');
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, size, size);
  return c;
}

// ─── Logo pixel sampler ──────────────────────────────────────────────────────
/**
 * Draws the logo image centred and scaled onto an offscreen canvas, then
 * returns a shuffled array of {x, y} positions for every non-white pixel.
 * These become the particle "target" positions during convergence.
 */
function sampleLogoPixels(
  img: HTMLImageElement,
  screenW: number,
  screenH: number,
  maxCount: number
): Array<{ x: number; y: number }> {
  const off    = document.createElement('canvas');
  off.width    = screenW;
  off.height   = screenH;
  const ctx    = off.getContext('2d')!;

  // Centre the logo on the screen
  const logoSize = Math.min(screenW, screenH) * LOGO_SCALE;
  const lx = (screenW - logoSize) / 2;
  const ly = (screenH - logoSize) / 2;
  ctx.drawImage(img, lx, ly, logoSize, logoSize);

  const { data } = ctx.getImageData(0, 0, screenW, screenH);
  const pts: Array<{ x: number; y: number }> = [];

  // Sample every 2nd pixel for performance
  for (let y = 0; y < screenH; y += 2) {
    for (let x = 0; x < screenW; x += 2) {
      const i = (y * screenW + x) * 4;
      const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
      // Keep only opaque, non-white pixels → these are the logo's visual elements
      if (a > 60 && (r < 230 || g < 230 || b < 230)) {
        pts.push({ x, y });
      }
    }
  }

  // Fisher-Yates shuffle
  for (let i = pts.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    const tmp = pts[i]; pts[i] = pts[j]; pts[j] = tmp;
  }

  return pts.slice(0, maxCount);
}

// ─── Main component ──────────────────────────────────────────────────────────
export default function DALogoIntro({ onComplete }: Props) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);

  // We store mutable state in a ref so the rAF closure always sees fresh values
  const stateRef = useRef({
    particles:   [] as Particle[],
    hubs:        [] as Particle[],
    connections: [] as Array<[Particle, Particle]>,
    startTime:   0,
    rafId:       0,
    finished:    false,
    logoImg:     null as HTMLImageElement | null,
    logoReady:   false,
    // Temp canvas for the logo fade-in overlay
    logoCanvas:  null as HTMLCanvasElement | null,
  });

  // Pre-render sprite canvases once
  const sprites = useRef({
    starWhite: buildStarSprite(210, 225, 255),
    starGold:  buildStarSprite(212, 175,  55),
    starGlow:  buildStarSprite(255, 240, 180),
    dotWhite:  buildDotSprite(200, 218, 255),
    dotGold:   buildDotSprite(212, 175,  55),
  });

  /** Initialise / re-initialise particles after image load or window resize */
  const init = useCallback((img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const W = canvas.width  = window.innerWidth;
    const H = canvas.height = window.innerHeight;

    const s       = stateRef.current;
    s.logoImg     = img;
    s.logoReady   = true;

    // Sample target positions from the actual logo image
    const targets = sampleLogoPixels(img, W, H, PARTICLE_COUNT);

    // Create particles
    s.particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
      const tgt  = targets[i % targets.length];
      const tier = Math.random();
      return {
        x:  Math.random() * W,
        y:  Math.random() * H,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        tx: tgt.x,
        ty: tgt.y,
        // Skew toward small sizes; a few large "named" stars
        size:   tier < 0.55 ? Math.random() * 0.8 + 0.3
              : tier < 0.88 ? Math.random() * 1.3 + 0.9
              :               Math.random() * 2.0 + 1.8,
        isStar:       tier > 0.75,
        opacity:      0.35 + Math.random() * 0.65,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.0007 + Math.random() * 0.0013,
      };
    });

    // Pick ~22 "hub" stars (largest) and connect nearest neighbours
    // → these become the constellation lines during the float phase
    s.hubs = s.particles.filter(p => p.size > 2.2).slice(0, 22);
    s.connections = [];
    s.hubs.forEach((hub, i) => {
      s.hubs
        .map((other, j) => ({ other, j, d: Math.hypot(hub.x - other.x, hub.y - other.y) }))
        .filter(({ j }) => j !== i)
        .sort((a, b) => a.d - b.d)
        .slice(0, 2)
        .forEach(({ other }) => s.connections.push([hub, other]));
    });

    // Build a canvas holding the logo image at screen-centred position
    // (used for the fade-in overlay in Phase 3)
    const lc     = document.createElement('canvas');
    lc.width     = W; lc.height = H;
    const lctx   = lc.getContext('2d')!;
    const logoSz = Math.min(W, H) * LOGO_SCALE;
    lctx.drawImage(img, (W - logoSz) / 2, (H - logoSz) / 2, logoSz, logoSz);
    s.logoCanvas  = lc;

    s.startTime  = 0;
    s.finished   = false;
  }, []);

  /** Main render loop */
  const frame = useCallback((ts: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx   = canvas.getContext('2d')!;
    const W     = canvas.width;
    const H     = canvas.height;
    const s     = stateRef.current;
    const sp    = sprites.current;

    if (!s.startTime) s.startTime = ts;
    const elapsed = ts - s.startTime;

    // Phase boundary timestamps
    const T_CONVERGE = PHASE_FLOAT_MS;
    const T_GLOW     = T_CONVERGE + PHASE_CONVERGE_MS;
    const T_FADE     = T_GLOW     + PHASE_GLOW_MS;

    // Convergence progress 0 → 1
    const cp = elapsed < T_CONVERGE ? 0
             : clamp((elapsed - T_CONVERGE) / PHASE_CONVERGE_MS, 0, 1);
    const ce = easeInOut(cp);

    // Glow pulse 0 → 1 (after convergence)
    const gp = elapsed > T_GLOW
             ? 0.5 + 0.5 * Math.sin((elapsed - T_GLOW) * 0.007)
             : 0;

    // ── Clear canvas ───────────────────────────────────────────────────────
    ctx.clearRect(0, 0, W, H);

    // ── Deep space background ──────────────────────────────────────────────
    const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
    bgGrad.addColorStop(0, '#000000');
    bgGrad.addColorStop(0.5, '#020d1e');
    bgGrad.addColorStop(1, '#010810');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // ── Nebula clouds (depth atmosphere) ──────────────────────────────────
    const nebulae: [number, number, number, string][] = [
      [W * 0.15, H * 0.22, W * 0.30, 'rgba(12,30,105,0.22)'],
      [W * 0.82, H * 0.72, W * 0.26, 'rgba(6,44,78,0.16)'],
      [W * 0.52, H * 0.46, W * 0.34, 'rgba(38,12,80,0.11)'],
      [W * 0.30, H * 0.80, W * 0.22, 'rgba(4,40,58,0.14)'],
    ];
    nebulae.forEach(([nx, ny, nr, col]) => {
      const ng = ctx.createRadialGradient(nx, ny, 0, nx, ny, nr);
      ng.addColorStop(0, col);
      ng.addColorStop(1, 'transparent');
      ctx.fillStyle = ng;
      ctx.beginPath();
      ctx.arc(nx, ny, nr, 0, Math.PI * 2);
      ctx.fill();
    });

    // ── Constellation lines (float phase only, fade as converging begins) ──
    if (cp < 0.20) {
      const lineFade = (0.20 - cp) / 0.20;
      s.connections.forEach(([a, b]) => {
        const ax = lerp(a.x, a.tx, ce), ay = lerp(a.y, a.ty, ce);
        const bx = lerp(b.x, b.tx, ce), by = lerp(b.y, b.ty, ce);
        const dist = Math.hypot(ax - bx, ay - by);
        if (dist < W * 0.50) {
          const la = lineFade * 0.40 * (1 - dist / (W * 0.50));
          ctx.strokeStyle = `rgba(180,210,255,${la})`;
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(bx, by);
          ctx.stroke();
        }
      });
    }

    // ── Particles ──────────────────────────────────────────────────────────
    s.particles.forEach(p => {
      // Drift during float phase
      if (cp < 1) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10;
        if (p.y > H + 10) p.y = -10;
      }

      // Interpolated draw position
      const dx = lerp(p.x, p.tx, ce);
      const dy = lerp(p.y, p.ty, ce);

      // Twinkling opacity (suppressed once formed)
      const twinkle = cp < 0.55
        ? p.opacity * (0.48 + 0.52 * Math.sin(ts * p.twinkleSpeed + p.twinklePhase))
        : p.opacity;

      const alpha = clamp(twinkle + gp * 0.30, 0, 1);
      if (alpha < 0.02) return;

      const baseSize = p.size * (p.isStar ? 18 : 12);
      const glowSize = baseSize * (1 + gp * 0.85);

      // White/blue sprite (floating phase)
      if (ce < 1) {
        ctx.globalAlpha = alpha * (1 - ce * 0.90);
        ctx.drawImage(
          p.isStar ? sp.starWhite : sp.dotWhite,
          dx - baseSize / 2, dy - baseSize / 2, baseSize, baseSize
        );
      }

      // Gold sprite (converged phase)
      if (ce > 0.02) {
        ctx.globalAlpha = alpha * ce;
        const goldSprite = gp > 0.35 ? sp.starGlow : (p.isStar ? sp.starGold : sp.dotGold);
        ctx.drawImage(
          goldSprite,
          dx - glowSize / 2, dy - glowSize / 2, glowSize, glowSize
        );
      }
    });

    ctx.globalAlpha = 1;

    // ── Fade in the REAL logo image once particles are ~90 % converged ─────
    // This ensures the logo always looks sharp and recognisable
    if (s.logoCanvas && ce > 0.85) {
      const logoAlpha = ((ce - 0.85) / 0.15) * (0.55 + gp * 0.35);
      ctx.globalAlpha = clamp(logoAlpha, 0, 0.92);
      ctx.drawImage(s.logoCanvas, 0, 0);
      ctx.globalAlpha = 1;
    }

    // ── Overlay fade-out ───────────────────────────────────────────────────
    if (elapsed > T_FADE) {
      const fp = clamp((elapsed - T_FADE) / PHASE_FADE_MS, 0, 1);
      if (canvasRef.current) {
        canvasRef.current.style.opacity = String(1 - fp);
      }
      if (fp >= 1 && !s.finished) {
        s.finished = true;
        onComplete();
        return; // stop loop
      }
    }

    s.rafId = requestAnimationFrame(frame);
  }, [onComplete]);

  // ── Bootstrap: load logo → init particles → start loop ──────────────────
  useEffect(() => {
    const img = new Image();
    img.src   = '/images/da-logo-premium.png';

    img.onload = () => {
      init(img);
      stateRef.current.rafId = requestAnimationFrame(frame);
    };

    img.onerror = () => {
      // Fallback: start without logo sampling (particles still float/converge)
      console.warn('DALogoIntro: logo image not found, falling back.');
      const fallbackImg = new Image();
      fallbackImg.width  = 1;
      fallbackImg.height = 1;
      init(fallbackImg);
      stateRef.current.rafId = requestAnimationFrame(frame);
    };

    const handleResize = () => {
      if (stateRef.current.logoImg) init(stateRef.current.logoImg);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(stateRef.current.rafId);
      window.removeEventListener('resize', handleResize);
    };
  }, [init, frame]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position:   'fixed',
        inset:      0,
        zIndex:     9999,
        display:    'block',
        background: '#000',
        transition: 'opacity 0.05s linear',
      }}
      aria-hidden="true"
    />
  );
}
