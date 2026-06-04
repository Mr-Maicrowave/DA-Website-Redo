/**
 * DAParticleIntro.tsx
 * ─────────────────────────────────────────────────────────────
 * Full-screen canvas intro animation for DA Tuition.
 *
 * Phases:
 *  0 → 2.0s  – particles float freely like stars
 *  2.0 → 4.2s – particles converge to form "DA"
 *  4.2 → 5.5s – "DA" glows softly in place
 *  5.5 → 6.5s – overlay fades out → homepage appears
 *
 * Props:
 *  onComplete  – called when the overlay has fully faded out
 * ─────────────────────────────────────────────────────────────
 */

import { useEffect, useRef, useCallback } from 'react';

interface Props {
  onComplete: () => void;
}

// ── tuneable constants ──────────────────────────────────────
const PARTICLE_COUNT   = 1800;
const FLOAT_DURATION   = 2000;   // ms before convergence starts
const CONVERGE_DURATION = 2200;  // ms for particles to reach DA
const GLOW_DURATION    = 1300;   // ms DA glows before fade
const FADE_DURATION    = 1000;   // ms overlay fade-out

const COLOR_CORE   = { r: 212, g: 175, b: 55  }; // gold
const COLOR_GLOW   = { r: 180, g: 210, b: 255 }; // icy blue
const BG_TOP       = '#000510';
const BG_BOTTOM    = '#000c1a';
// ────────────────────────────────────────────────────────────

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  tx: number; ty: number;   // convergence target
  size: number;
  opacity: number;
  twinkleOffset: number;
  hasTarget: boolean;
}

/** Sample lit pixels from an offscreen canvas where "DA" is drawn */
function getDAPixels(
  width: number,
  height: number,
  count: number
): Array<{ x: number; y: number }> {
  const off = document.createElement('canvas');
  off.width  = width;
  off.height = height;
  const ctx  = off.getContext('2d')!;

  // responsive font size
  const fontSize = Math.min(width * 0.38, height * 0.55);
  ctx.font        = `900 ${fontSize}px "Georgia", serif`;
  ctx.textAlign   = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle   = '#ffffff';
  ctx.fillText('DA', width / 2, height / 2);

  const data   = ctx.getImageData(0, 0, width, height).data;
  const pixels: Array<{ x: number; y: number }> = [];

  // stride so we only visit every 3rd pixel (performance)
  const stride = 3;
  for (let y = 0; y < height; y += stride) {
    for (let x = 0; x < width; x += stride) {
      const idx = (y * width + x) * 4;
      if (data[idx + 3] > 128) pixels.push({ x, y });
    }
  }

  // shuffle and return `count` samples
  for (let i = pixels.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pixels[i], pixels[j]] = [pixels[j], pixels[i]];
  }

  return pixels.slice(0, count);
}

/** Easing: ease-in-out cubic */
function easeInOut(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** Lerp */
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export default function DAParticleIntro({ onComplete }: Props) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const stateRef   = useRef({
    particles: [] as Particle[],
    startTime: 0,
    overlayOpacity: 1,
    animId: 0,
    completed: false,
  });

  const init = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const W = canvas.width  = window.innerWidth;
    const H = canvas.height = window.innerHeight;
    const s = stateRef.current;

    // ── generate DA target positions ────────────────────────
    const targets = getDAPixels(W, H, PARTICLE_COUNT);

    // ── create particles ────────────────────────────────────
    s.particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
      const t = targets[i % targets.length];
      return {
        x:  Math.random() * W,
        y:  Math.random() * H,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        tx: t ? t.x : Math.random() * W,
        ty: t ? t.y : Math.random() * H,
        size:          Math.random() * 1.8 + 0.5,
        opacity:       Math.random() * 0.6 + 0.4,
        twinkleOffset: Math.random() * Math.PI * 2,
        hasTarget:     !!t,
      };
    });

    s.startTime     = performance.now();
    s.overlayOpacity = 1;
    s.completed      = false;
  }, []);

  const draw = useCallback((timestamp: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const W   = canvas.width;
    const H   = canvas.height;
    const s   = stateRef.current;
    const elapsed = timestamp - s.startTime;

    // ── phase boundaries ────────────────────────────────────
    const convergeStart = FLOAT_DURATION;
    const glowStart     = convergeStart + CONVERGE_DURATION;
    const fadeStart     = glowStart     + GLOW_DURATION;
    const totalDuration = fadeStart     + FADE_DURATION;

    // ── background gradient ─────────────────────────────────
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, BG_TOP);
    bg.addColorStop(1, BG_BOTTOM);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // ── subtle nebula blobs ─────────────────────────────────
    const drawNebula = (cx: number, cy: number, r: number, color: string) => {
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grad.addColorStop(0, color);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    };
    drawNebula(W * 0.2,  H * 0.3,  W * 0.25, 'rgba(20,40,100,0.18)');
    drawNebula(W * 0.8,  H * 0.7,  W * 0.22, 'rgba(10,60,80,0.15)');
    drawNebula(W * 0.55, H * 0.5,  W * 0.30, 'rgba(40,20,80,0.10)');

    // ── convergence progress (0 → 1) ────────────────────────
    let convergeProg = 0;
    if (elapsed > convergeStart) {
      convergeProg = Math.min(1, (elapsed - convergeStart) / CONVERGE_DURATION);
    }
    const convergeEased = easeInOut(convergeProg);

    // ── glow pulse (after convergence) ──────────────────────
    const glowPulse = elapsed > glowStart
      ? 0.5 + 0.5 * Math.sin((elapsed - glowStart) * 0.006)
      : 0;

    // ── draw particles ──────────────────────────────────────
    s.particles.forEach((p) => {
      // floating phase: drift
      if (convergeProg < 1) {
        p.x += p.vx;
        p.y += p.vy;
        // wrap edges
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;
      }

      // converge: interpolate toward target
      const drawX = lerp(p.x, p.tx, convergeEased);
      const drawY = lerp(p.y, p.ty, convergeEased);

      // twinkle opacity when floating
      const twinkle = convergeProg < 0.5
        ? p.opacity * (0.7 + 0.3 * Math.sin(timestamp * 0.001 + p.twinkleOffset))
        : p.opacity;

      // colour: blend from white → gold as they converge
      const r = Math.round(lerp(255, COLOR_CORE.r, convergeEased));
      const g = Math.round(lerp(255, COLOR_CORE.g, convergeEased));
      const b = Math.round(lerp(255, COLOR_CORE.b, convergeEased));

      // extra glow boost after forming
      const glowBoost = glowPulse * 0.6;
      const finalR = Math.min(255, Math.round(lerp(r, COLOR_GLOW.r, glowBoost)));
      const finalG = Math.min(255, Math.round(lerp(g, COLOR_GLOW.g, glowBoost)));
      const finalB = Math.min(255, Math.round(lerp(b, COLOR_GLOW.b, glowBoost)));

      const alpha = Math.min(1, twinkle + glowBoost * 0.4);

      // halo glow when formed
      if (convergeEased > 0.6) {
        const haloAlpha = (convergeEased - 0.6) / 0.4 * 0.15 + glowPulse * 0.1;
        ctx.beginPath();
        ctx.arc(drawX, drawY, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${finalR},${finalG},${finalB},${haloAlpha})`;
        ctx.fill();
      }

      // core particle
      ctx.beginPath();
      ctx.arc(drawX, drawY, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${finalR},${finalG},${finalB},${alpha})`;
      ctx.fill();
    });

    // ── constellation lines while floating ──────────────────
    if (convergeProg < 0.3) {
      const lineAlpha = (0.3 - convergeProg) / 0.3 * 0.12;
      ctx.strokeStyle = `rgba(150,180,255,${lineAlpha})`;
      ctx.lineWidth   = 0.4;
      // only check a subset for performance
      const subset = s.particles.slice(0, 300);
      for (let i = 0; i < subset.length; i++) {
        for (let j = i + 1; j < subset.length; j++) {
          const dx = subset[i].x - subset[j].x;
          const dy = subset[i].y - subset[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 80) {
            ctx.beginPath();
            ctx.moveTo(subset[i].x, subset[i].y);
            ctx.lineTo(subset[j].x, subset[j].y);
            ctx.stroke();
          }
        }
      }
    }

    // ── overlay fade out ─────────────────────────────────────
    if (elapsed > fadeStart) {
      const fadeProg = Math.min(1, (elapsed - fadeStart) / FADE_DURATION);
      s.overlayOpacity = 1 - fadeProg;
      canvas.style.opacity = String(s.overlayOpacity);

      if (fadeProg >= 1 && !s.completed) {
        s.completed = true;
        onComplete();
        return; // stop loop
      }
    }

    s.animId = requestAnimationFrame(draw);
  }, [onComplete]);

  useEffect(() => {
    init();

    const handleResize = () => init();
    window.addEventListener('resize', handleResize);

    const s = stateRef.current;
    s.animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(s.animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [init, draw]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position:   'fixed',
        inset:      0,
        zIndex:     9999,
        display:    'block',
        background: BG_TOP,
        transition: 'opacity 0.05s linear',
      }}
      aria-hidden="true"
    />
  );
}
