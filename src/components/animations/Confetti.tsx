// Gold confetti — all gold tones, different grades
export const fireConfetti = () => {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d')!;
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  // Gold only — deep to pale
  const GOLDS = [
    '#8B6914',  // antique gold (darkest)
    '#B8960C',  // deep gold
    '#C9A227',  // standard gold
    '#D4AF37',  // classic gold
    '#E8C040',  // bright gold
    '#F0C84A',  // light gold
    '#F5D676',  // pale gold
    '#FAE89A',  // champagne (lightest)
  ];

  const pieces: {
    x: number; y: number;
    vx: number; vy: number;
    color: string; size: number;
    angle: number; spin: number;
  }[] = [];

  for (let i = 0; i < 120; i++) {
    pieces.push({
      x:     Math.random() * canvas.width,
      y:     Math.random() * canvas.height * 0.4,
      vx:    (Math.random() - 0.5) * 4,
      vy:    Math.random() * 3 + 1,
      color: GOLDS[Math.floor(Math.random() * GOLDS.length)],
      size:  Math.random() * 8 + 4,
      angle: Math.random() * Math.PI * 2,
      spin:  (Math.random() - 0.5) * 0.2,
    });
  }

  let frame = 0;
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      p.x     += p.vx;
      p.y     += p.vy;
      p.vy    += 0.05;
      p.angle += p.spin;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.5);
      ctx.restore();
    });
    frame++;
    if (frame < 120) requestAnimationFrame(animate);
    else canvas.remove();
  };
  animate();
};

// Dummy component so `<Confetti />` doesn't break JSX
const Confetti = () => null;
export default Confetti;
