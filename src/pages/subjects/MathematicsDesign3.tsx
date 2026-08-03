import { useState } from 'react';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calculator, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '@/components/SEO';

// Each point on the bridge is a discrete hotspot — same structural idea as the
// Science page's apple hotspots — so one structure can carry facts from six
// different branches of maths, not just parabolas.
const HOTSPOTS = [
  { x: 150, y: 120, topic: 'Algebra', fact: 'The cable’s curve isn’t a random shape — it’s the same parabola behind y = ax² + bx + c, the equation every Year 10 student graphs.' },
  { x: 95, y: 68.75, topic: 'Trigonometry', fact: 'The steeper a cable’s angle near the tower, the more of its tension pulls sideways instead of up — engineers calculate this with sine and cosine.' },
  { x: 150, y: 85, topic: 'Calculus', fact: 'The lowest point of the cable is exactly where its slope hits zero — literally what a derivative is built to find.' },
  { x: 205, y: 68.75, topic: 'Vectors', fact: 'Tension in a cable is a vector — engineers split it into horizontal and vertical components to work out what each tower actually has to hold.' },
  { x: 40, y: 120, topic: 'Geometry', fact: 'Bridge towers are built to sit exactly perpendicular to the deck — a few degrees off and the whole load path fails.' },
  { x: 260, y: 120, topic: 'Statistics', fact: 'Engineers model expected traffic load using statistics, then build in a safety margin far beyond the average case.' },
];

const HeroSuspensionBridge = () => {
  const [active, setActive] = useState(0);
  const current = HOTSPOTS[active];

  return (
    <div className="relative self-end overflow-hidden rounded-2xl border border-white/[0.14] bg-[#081b33]/72 p-5 shadow-[0_18px_44px_rgba(0,0,0,0.24)] backdrop-blur-xl sm:p-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_20%,rgba(241,223,154,0.18),transparent_32%),radial-gradient(circle_at_22%_78%,rgba(155,199,255,0.16),transparent_34%)]" />

      <div className="relative mb-5 flex items-center justify-between gap-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#f1df9a]/25 bg-[#f1df9a]/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-[#f1df9a]">
          <Sparkles className="h-3.5 w-3.5" />
          Tap a point on the bridge
        </div>
        <span className="hidden rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-bold text-white/80 sm:inline-flex">
          {active + 1} of {HOTSPOTS.length}
        </span>
      </div>

      <svg viewBox="0 0 300 160" className="relative z-10 mx-auto h-56 w-full max-w-[320px]" aria-hidden="true">
        {/* Towers */}
        <rect x="34" y="20" width="12" height="100" rx="2" fill="rgba(255,255,255,0.14)" />
        <rect x="254" y="20" width="12" height="100" rx="2" fill="rgba(255,255,255,0.14)" />
        {/* Deck */}
        <rect x="20" y="118" width="260" height="6" rx="2" fill="rgba(255,255,255,0.18)" />
        {/* Cable */}
        <path d="M 40 20 Q 150 150 260 20" fill="none" stroke="#f1df9a" strokeWidth="2" strokeOpacity="0.55" />
        {/* Deck hangers */}
        {[95, 150, 205].map((x) => (
          <line key={x} x1={x} y1={x === 150 ? 85 : 68.75} x2={x} y2="118" stroke="#f1df9a" strokeWidth="0.75" strokeOpacity="0.3" />
        ))}

        {HOTSPOTS.map((h, i) => {
          const isActive = active === i;
          return (
            <g
              key={h.topic}
              onClick={() => setActive(i)}
              className="cursor-pointer"
              tabIndex={0}
              role="button"
              aria-label={h.topic}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActive(i); } }}
            >
              {isActive && <circle cx={h.x} cy={h.y} r="9" fill="none" stroke="#f1df9a" strokeWidth="1.2" strokeOpacity="0.8" />}
              <circle cx={h.x} cy={h.y} r="5" fill={isActive ? '#f1df9a' : 'rgba(255,255,255,0.55)'} />
            </g>
          );
        })}
      </svg>

      <div className="relative z-10 mt-5 min-h-[104px] rounded-xl border border-white/10 bg-white/5 px-4 py-3.5">
        <span className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.14em] text-[#f1df9a]">{current.topic}</span>
        <p className="text-sm leading-6 text-white/78">{current.fact}</p>
      </div>

      <p className="relative z-10 mt-3 text-center text-[11px] text-white/40">
        One bridge, six branches of maths holding it up.
      </p>
    </div>
  );
};

const MathematicsDesign3 = () => {
  return (
    <div className="min-h-screen bg-[#fffdf8] text-[#172033]">
      <SEO title="Mathematics — Design 3: Suspension Bridge (mockup)" description="Hero concept mockup." canonicalUrl="/subjects/mathematics/design-3" />
      <NavigationNew />

      <main>
        <section className="relative overflow-hidden bg-[#071629] pt-36 lg:pt-40">
          <div className="absolute inset-0">
            <img src="/images/v3/teacher_whiteboard.jpg" alt="" className="h-full w-full object-cover opacity-55" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#071629] via-[#071629]/88 to-[#071629]/40" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#fff6e7] to-transparent" />
          </div>

          <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-10 px-5 pb-24 lg:grid-cols-[1fr_.9fr] lg:px-8 lg:pb-28">
            <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: 'easeOut' }}>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#f1df9a] backdrop-blur-md">
                <Calculator className="h-4 w-4" />
                Design 3 — Suspension Bridge (mockup)
              </div>
              <h1 className="max-w-4xl text-balance font-serif text-5xl font-medium leading-[0.96] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
                Six branches of maths, holding up one bridge.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75">
                Every part of a suspension bridge is doing maths — the cable's curve, the towers' angles, the load calculations. Tap a point to see which.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/book-interview">
                  <Button size="lg" className="h-12 rounded-full bg-[#c9a227] px-7 font-black text-[#101521] shadow-xl shadow-[#c9a227]/25 hover:bg-[#e0bd4b]">
                    Book an Interview
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>

            <HeroSuspensionBridge />
          </div>
        </section>

        <section className="bg-[#fff6e7] px-5 py-14 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#c9a227]">Mockup note</p>
            <p className="mt-3 text-base leading-8 text-[#61708a]">
              This page exists only to preview the Suspension Bridge hero concept in real site chrome. The rest of the Mathematics page is unchanged and lives at <code>/subjects/mathematics</code>.
            </p>
          </div>
        </section>
      </main>

      <FooterNew />
    </div>
  );
};

export default MathematicsDesign3;
