import { useState } from 'react';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calculator, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '@/components/SEO';

// Each Fibonacci square is a discrete hotspot — the spiral itself is one shape,
// but every ring can carry a fact from a different branch of maths.
const SQUARES = [
  { n: 1, x: 0, y: 0, size: 10, topic: 'Sequences', fact: 'Each Fibonacci number is the sum of the two before it: 1, 1, 2, 3, 5, 8, 13... the same rule that generates this whole spiral.' },
  { n: 1, x: -10, y: 0, size: 10, topic: 'Ratios', fact: 'Divide any Fibonacci number by the one before it and you get closer and closer to 1.618 — the golden ratio.' },
  { n: 2, x: -10, y: -20, size: 20, topic: 'Geometry', fact: 'This spiral is built from nothing but squares and quarter-circles — one of the oldest tricks in geometric construction.' },
  { n: 3, x: 10, y: -20, size: 30, topic: 'Nature patterns', fact: 'Sunflower seed heads and pinecones spiral in Fibonacci numbers — usually 34 and 55 spirals running in opposite directions.' },
  { n: 5, x: -10, y: 10, size: 50, topic: 'Exponential growth', fact: 'Rabbit population problems (the original Fibonacci puzzle from 1202) grow at almost exactly this same golden-ratio rate.' },
];

const HeroFibonacciSpiral = () => {
  const [active, setActive] = useState(0);
  const current = SQUARES[active];

  return (
    <div className="relative self-end overflow-hidden rounded-2xl border border-white/[0.14] bg-[#081b33]/72 p-5 shadow-[0_18px_44px_rgba(0,0,0,0.24)] backdrop-blur-xl sm:p-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_20%,rgba(241,223,154,0.18),transparent_32%),radial-gradient(circle_at_22%_78%,rgba(155,199,255,0.16),transparent_34%)]" />

      <div className="relative mb-5 flex items-center justify-between gap-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#f1df9a]/25 bg-[#f1df9a]/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-[#f1df9a]">
          <Sparkles className="h-3.5 w-3.5" />
          Tap a square
        </div>
        <span className="hidden rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-bold text-white/80 sm:inline-flex">
          F({active + 1}) = {current.n}
        </span>
      </div>

      <svg viewBox="-15 -25 60 90" className="relative z-10 mx-auto h-64 w-full max-w-[220px] overflow-visible" aria-hidden="true">
        {SQUARES.map((sq, i) => {
          const isActive = active === i;
          return (
            <g key={i} onClick={() => setActive(i)} className="cursor-pointer" tabIndex={0} role="button" aria-label={`${sq.topic} square`}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActive(i); } }}>
              <rect
                x={sq.x} y={sq.y} width={sq.size} height={sq.size} rx="1"
                fill={isActive ? 'rgba(241,223,154,0.22)' : 'rgba(255,255,255,0.04)'}
                stroke={isActive ? '#f1df9a' : 'rgba(255,255,255,0.28)'}
                strokeWidth={isActive ? 1.4 : 0.8}
              />
              <text
                x={sq.x + sq.size / 2} y={sq.y + sq.size / 2 + 2}
                textAnchor="middle" fontSize={Math.min(sq.size * 0.35, 9)} fontWeight="900"
                fill={isActive ? '#f1df9a' : 'rgba(255,255,255,0.5)'}
              >
                {sq.n}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="relative z-10 mt-5 min-h-[104px] rounded-xl border border-white/10 bg-white/5 px-4 py-3.5">
        <span className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.14em] text-[#f1df9a]">{current.topic}</span>
        <p className="text-sm leading-6 text-white/78">{current.fact}</p>
      </div>

      <p className="relative z-10 mt-3 text-center text-[11px] text-white/40">
        The spiral grows one topic at a time — tap any square to jump ahead.
      </p>
    </div>
  );
};

const MathematicsDesign2 = () => {
  return (
    <div className="min-h-screen bg-[#fffdf8] text-[#172033]">
      <SEO title="Mathematics — Design 2: Fibonacci Spiral (mockup)" description="Hero concept mockup." canonicalUrl="/subjects/mathematics/design-2" />
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
                Design 2 — Fibonacci Spiral (mockup)
              </div>
              <h1 className="max-w-4xl text-balance font-serif text-5xl font-medium leading-[0.96] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
                One number becomes a spiral.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75">
                A single rule — add the last two numbers — builds a spiral that shows up in shells, sunflowers, and galaxies. Tap a square to see where.
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

            <HeroFibonacciSpiral />
          </div>
        </section>

        <section className="bg-[#fff6e7] px-5 py-14 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#c9a227]">Mockup note</p>
            <p className="mt-3 text-base leading-8 text-[#61708a]">
              This page exists only to preview the Fibonacci Spiral hero concept in real site chrome. The rest of the Mathematics page is unchanged and lives at <code>/subjects/mathematics</code>.
            </p>
          </div>
        </section>
      </main>

      <FooterNew />
    </div>
  );
};

export default MathematicsDesign2;
