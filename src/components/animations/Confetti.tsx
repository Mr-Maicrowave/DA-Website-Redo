// Gold dust — fine particles, slow drift, luxury feel
export const fireConfetti = () => {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d')!;
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  // Gold palette only — no colour, no navy, no white
  const GOLDS = ['#C9A227', '#D4AF37', '#E8C040', '#F0C84A', '#B8960C', '#DFC060', '#F5D676'];

  interface Mote {
    x: number; y: number;
    vx: number; vy: number;
    size: number;
    color: string;
    alpha: number;
    decay: number;       // how fast this particle fades
    wobble: number;      // phase offset for horizontal drift
    wobbleSpeed: number;
    sliver: boolean;     // true = thin elongated speck, false = soft circle
    rot: number;
    rotSpeed: number;
  }

  const motes: Mote[] = [];

  for (let i = 0; i < 220; i++) {
    const sliver = Math.random() > 0.45;
    motes.push({
      x:           Math.random() * canvas.width,
      y:           -20 - Math.random() * canvas.height * 0.35,
      vx:          (Math.random() - 0.5) * 0.8,
      vy:          Math.random() * 1.2 + 0.3,          // slow fall
      size:        sliver
                     ? Math.random() * 1.2 + 0.4        // slivers: very thin
                     : Math.random() * 2.2 + 0.6,       // circles: small
      color:       GOLDS[Math.floor(Math.random() * GOLDS.length)],
      alpha:       Math.random() * 0.55 + 0.45,
      decay:       Math.random() * 0.0025 + 0.0015,     // slow individual fade
      wobble:      Math.random() * Math.PI * 2,
      wobbleSpeed: (Math.random() - 0.5) * 0.035,
      sliver,
      rot:         Math.random() * Math.PI,
      rotSpeed:    (Math.random() - 0.5) * 0.025,
    });
  }

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;

    for (const m of motes) {
      m.wobble += m.wobbleSpeed;
      m.x      += m.vx + Math.sin(m.wobble) * 0.5;
      m.y      += m.vy;
      m.rot    += m.rotSpeed;
      m.alpha  -= m.decay;
      if (m.alpha <= 0) continue;
      alive = true;

      ctx.save();
      ctx.globalAlpha = m.alpha;
      ctx.fillStyle   = m.color;
      ctx.translate(m.x, m.y);
      ctx.rotate(m.rot);

      if (m.sliver) {
        // Elongated dust speck — like a flake of gold leaf
        ctx.beginPath();
        ctx.ellipse(0, 0, m.size * 3.5, m.size * 0.55, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Soft circle — like a suspended dust mote
        ctx.beginPath();
        ctx.arc(0, 0, m.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    if (alive) requestAnimationFrame(animate);
    else canvas.remove();
  };

  animate();
};

// Dummy component so `<Confetti />` doesn't break JSX
const Confetti = () => null;
export default Confetti;
