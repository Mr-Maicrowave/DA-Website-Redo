/**
 * DALogoShine.tsx
 * Apple-style moving light effect on the DA Tuition logo.
 *
 * Technique: draw the real logo PNG as the base, then apply
 * moving radial gradient highlights using 'screen' blend mode.
 * 'screen' = dark areas of gradient are invisible, bright areas
 * add light to whatever is underneath — perfect for a shine effect.
 */

import { useEffect, useRef } from 'react';

interface Props {
  size?: number;          // canvas size in px (default 320)
  className?: string;
}

export default function DALogoShine({ size = 320, className = '' }: Props) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const rafRef     = useRef<number>(0);
  const pausedRef  = useRef(false);
  const offsetRef  = useRef(0);        // accumulated time before any pause
  const pausedAtRef = useRef(0);
  const mouseRef   = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const SZ = size, CX = SZ / 2, CY = SZ / 2;

    // Load the real logo
    const img = new Image();
    img.src = '/images/da-logo-slogan.png';

    img.onload = () => {
      const frame = (ts: number) => {
        const t = (offsetRef.current + ts) * 0.00040;

        // 1. Base: draw the real logo
        ctx.clearRect(0, 0, SZ, SZ);
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
        ctx.drawImage(img, 0, 0, SZ, SZ);

        // Switch to screen blend for all light layers
        ctx.globalCompositeOperation = 'screen';

        // 2. Primary hotspot — the main travelling light
        const hotAng = t * 0.55;
        const hx = CX + Math.cos(hotAng) * SZ * 0.30 + (mouseRef.current.x - 0.5) * SZ * 0.08;
        const hy = CY + Math.sin(hotAng * 0.72) * SZ * 0.22 + (mouseRef.current.y - 0.5) * SZ * 0.06;
        const hot = ctx.createRadialGradient(hx, hy, 0, hx, hy, SZ * 0.44);
        hot.addColorStop(0,    `rgba(255,252,210,${0.82 + 0.10 * Math.sin(t * 2.2)})`);
        hot.addColorStop(0.15, `rgba(255,235,140,${0.55 + 0.08 * Math.sin(t * 1.9)})`);
        hot.addColorStop(0.40, 'rgba(220,180,60,0.20)');
        hot.addColorStop(1,    'rgba(0,0,0,0)');
        ctx.fillStyle = hot;
        ctx.fillRect(0, 0, SZ, SZ);

        // 3. Secondary softer light — opposite side, gives depth
        const h2x = CX + Math.cos(hotAng + Math.PI * 0.62) * SZ * 0.20;
        const h2y = CY + Math.sin(hotAng * 0.72 + Math.PI * 0.62) * SZ * 0.15;
        const soft = ctx.createRadialGradient(h2x, h2y, 0, h2x, h2y, SZ * 0.32);
        soft.addColorStop(0,    `rgba(255,248,200,${0.35 + 0.08 * Math.sin(t * 1.6)})`);
        soft.addColorStop(0.45, 'rgba(220,195,100,0.10)');
        soft.addColorStop(1,    'rgba(0,0,0,0)');
        ctx.fillStyle = soft;
        ctx.fillRect(0, 0, SZ, SZ);

        // 4. Slow diagonal sweep — gentle overall colour shift
        const sweepAng = t * 0.20;
        const sweep = ctx.createLinearGradient(
          CX + Math.cos(sweepAng) * SZ, CY + Math.sin(sweepAng) * SZ * 0.7,
          CX - Math.cos(sweepAng) * SZ, CY - Math.sin(sweepAng) * SZ * 0.7
        );
        sweep.addColorStop(0,    'rgba(0,0,0,0)');
        sweep.addColorStop(0.35, `rgba(255,230,120,${0.08 + 0.04 * Math.sin(t * 1.1)})`);
        sweep.addColorStop(0.50, `rgba(255,255,200,${0.12 + 0.05 * Math.sin(t * 1.5)})`);
        sweep.addColorStop(0.65, `rgba(220,200,255,${0.06 + 0.03 * Math.sin(t * 1.1)})`);
        sweep.addColorStop(1,    'rgba(0,0,0,0)');
        ctx.fillStyle = sweep;
        ctx.fillRect(0, 0, SZ, SZ);

        ctx.globalCompositeOperation = 'source-over';

        rafRef.current = requestAnimationFrame(frame);
      };

      rafRef.current = requestAnimationFrame(frame);
    };

    // Mouse tracking for subtle interactivity
    const onMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };
    window.addEventListener('mousemove', onMove);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', onMove);
    };
  }, [size]);

  // Pause / play on click (like Apple's website)
  const togglePause = () => {
    if (pausedRef.current) {
      offsetRef.current -= pausedAtRef.current;
      pausedRef.current = false;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      img.src = '/images/da-logo-slogan.png';
      img.onload = () => {
        const frame = (ts: number) => {
          const t = (offsetRef.current + ts) * 0.00040;
          const SZ = size, CX = SZ / 2, CY = SZ / 2;
          ctx.clearRect(0, 0, SZ, SZ);
          ctx.globalCompositeOperation = 'source-over';
          ctx.drawImage(img, 0, 0, SZ, SZ);
          ctx.globalCompositeOperation = 'screen';
          const hotAng = t * 0.55;
          const hx = CX + Math.cos(hotAng) * SZ * 0.30;
          const hy = CY + Math.sin(hotAng * 0.72) * SZ * 0.22;
          const hot = ctx.createRadialGradient(hx, hy, 0, hx, hy, SZ * 0.44);
          hot.addColorStop(0, `rgba(255,252,210,${0.82 + 0.10 * Math.sin(t * 2.2)})`);
          hot.addColorStop(0.15, `rgba(255,235,140,0.55)`);
          hot.addColorStop(0.40, 'rgba(220,180,60,0.20)');
          hot.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = hot; ctx.fillRect(0, 0, SZ, SZ);
          ctx.globalCompositeOperation = 'source-over';
          rafRef.current = requestAnimationFrame(frame);
        };
        rafRef.current = requestAnimationFrame(frame);
      };
    } else {
      cancelAnimationFrame(rafRef.current);
      pausedAtRef.current = performance.now();
      offsetRef.current += pausedAtRef.current;
      pausedRef.current = true;
    }
  };

  return (
    <div className="relative inline-block" style={{ width: size, height: size }}>
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className={className}
        style={{
          display: 'block',
          filter: 'drop-shadow(0 8px 32px rgba(26,42,110,.18)) drop-shadow(0 2px 8px rgba(212,175,55,.22))',
        }}
      />
      {/* Pause/play button — Apple-style, top-right corner */}
      <button
        onClick={togglePause}
        title="Pause/play animation"
        style={{
          position: 'absolute', top: -8, right: -8,
          width: 26, height: 26, borderRadius: '50%',
          background: 'rgba(26,42,110,0.12)',
          border: '1px solid rgba(26,42,110,0.25)',
          color: 'rgba(26,42,110,0.7)',
          fontSize: '0.55rem', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(10px)', transition: 'all 0.2s',
        }}
      >
        ⏸
      </button>
    </div>
  );
}
