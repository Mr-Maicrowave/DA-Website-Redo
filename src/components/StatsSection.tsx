import { useEffect, useRef, useState, useCallback } from 'react';

// ─── Confetti engine (no external deps) ───────────────────────────────────────
interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  width: number; height: number;
  opacity: number;
}

function launchConfetti(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  const colors = ['#FFD700', '#C9A84C', '#fff', '#4A90D9', '#F5A623', '#7ED321', '#BD10E0', '#FF6B6B'];
  const particles: Particle[] = [];

  // Spawn from centre-top, slight spread
  for (let i = 0; i < 180; i++) {
    const angle = (Math.random() * Math.PI) - Math.PI / 2 + (Math.random() - 0.5) * 1.4;
    const speed = 4 + Math.random() * 8;
    particles.push({
      x: canvas.width / 2 + (Math.random() - 0.5) * canvas.width * 0.6,
      y: -10,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed + Math.random() * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.2,
      width: 8 + Math.random() * 8,
      height: 4 + Math.random() * 4,
      opacity: 1,
    });
  }

  let frame: number;
  const tick = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.18; // gravity
      p.vx *= 0.99;
      p.rotation += p.rotationSpeed;
      p.opacity -= 0.008;
      if (p.opacity <= 0) continue;
      alive = true;
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
      ctx.restore();
    }
    if (alive) {
      frame = requestAnimationFrame(tick);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };
  frame = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(frame);
}

// ─── Count-up hook ─────────────────────────────────────────────────────────────
function useCountUp(target: number, duration: number, active: boolean) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const raf = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(raf);
      else setValue(target);
    };
    requestAnimationFrame(raf);
  }, [active, target, duration]);
  return value;
}

// ─── Individual stat card ──────────────────────────────────────────────────────
interface StatCardProps {
  target: number;
  suffix: string;
  label: string;
  active: boolean;
  delay: number;
  isRating?: boolean;
}

const StatCard = ({ target, suffix, label, active, delay, isRating }: StatCardProps) => {
  const count = useCountUp(target, 1800, active);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (active) {
      const t = setTimeout(() => setVisible(true), delay);
      return () => clearTimeout(t);
    }
  }, [active, delay]);

  const displayValue = isRating
    ? active ? (count === target ? '5' : (count / 10).toFixed(1)) : '0'
    : count.toLocaleString();

  return (
    <div
      className="relative flex flex-col"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity 0.5s ease, transform 0.5s ease',
      }}
    >
      {/* card */}
      <div
        className="flex-1 rounded-2xl p-8 flex flex-col justify-end"
        style={{
          background: 'linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)',
          border: '1px solid rgba(255,255,255,0.12)',
          backdropFilter: 'blur(8px)',
          minHeight: '200px',
        }}
      >
        {/* gold rule */}
        <div style={{ width: 32, height: 2, background: '#C9A84C', marginBottom: 20 }} />

        {/* number */}
        <div
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
            fontWeight: 700,
            color: '#fff',
            lineHeight: 1,
            marginBottom: 16,
          }}
        >
          {displayValue}
          <span style={{ color: '#C9A84C' }}>{suffix}</span>
        </div>

        {/* label */}
        <div
          style={{
            fontSize: '0.65rem',
            letterSpacing: '0.15em',
            color: 'rgba(255,255,255,0.55)',
            textTransform: 'uppercase',
            fontWeight: 500,
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
};

// ─── Main section ──────────────────────────────────────────────────────────────
const StatsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(false);
  const firedRef = useRef(false);

  const handleIntersect = useCallback((entries: IntersectionObserverEntry[]) => {
    const entry = entries[0];
    if (entry.isIntersecting && !firedRef.current) {
      firedRef.current = true;
      setActive(true);
      if (canvasRef.current) {
        launchConfetti(canvasRef.current);
      }
    }
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(handleIntersect, { threshold: 0.3 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleIntersect]);

  const stats = [
    { target: 20,   suffix: '+',  label: 'Years Experience', isRating: false },
    { target: 10000, suffix: '+', label: 'Students Helped',   isRating: false },
    { target: 50,   suffix: '',   label: 'Google Rating',     isRating: true  },
    { target: 450,  suffix: '+',  label: 'Five-Star Reviews', isRating: false },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8"
      style={{
        background: 'linear-gradient(160deg, #0d1b2e 0%, #122240 50%, #0d1b2e 100%)',
      }}
    >
      {/* confetti canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 10 }}
      />

      {/* subtle star-field dots */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 2 + 1,
              height: Math.random() * 2 + 1,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              background: 'rgba(255,255,255,0.25)',
            }}
          />
        ))}
      </div>

      <div className="relative max-w-6xl mx-auto" style={{ zIndex: 2 }}>
        {/* heading */}
        <div className="text-center mb-16">
          <p
            style={{
              fontSize: '0.7rem',
              letterSpacing: '0.2em',
              color: '#C9A84C',
              textTransform: 'uppercase',
              fontWeight: 600,
              marginBottom: 16,
            }}
          >
            By the Numbers
          </p>
          <h2
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 400,
              color: '#fff',
              lineHeight: 1.2,
            }}
          >
            Two Decades of{' '}
            <em style={{ color: '#C9A84C', fontStyle: 'italic' }}>Proven Results</em>
          </h2>
        </div>

        {/* stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((s, i) => (
            <StatCard
              key={s.label}
              target={s.target}
              suffix={s.suffix}
              label={s.label}
              active={active}
              delay={i * 120}
              isRating={s.isRating}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
