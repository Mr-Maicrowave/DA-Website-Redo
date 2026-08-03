import { useState } from 'react';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calculator, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '@/components/SEO';

// Each domino is a discrete hotspot — same structural idea as the Science page's
// apple hotspots — so the chain can carry facts from any maths topic, not just one.
const DOMINOES = [
  { topic: 'Algebra', fact: 'Solving 5x − 7 = 18 is really just "undoing" operations in reverse order — the same logic every domino in this chain follows.' },
  { topic: 'Geometry', fact: 'A domino toppling traces an arc — the same circular motion behind angle and rotation problems in geometry.' },
  { topic: 'Probability', fact: 'A row of dominoes has exactly one way to fall in order, but 5,040 possible orders if shuffled — that’s 7 factorial.' },
  { topic: 'Exponential growth', fact: 'Each domino here is 1.5× the size of the last — after just 10 dominoes, the final one would be over 50× the size of the first.' },
  { topic: 'Trigonometry', fact: 'The angle a domino falls through before hitting the next one determines whether the chain continues — engineers call this the critical toppling angle.' },
  { topic: 'Statistics', fact: 'Domino chain reactions are used to model "cascading failure" in statistics — one small event increasing the probability of the next.' },
  { topic: 'Calculus', fact: 'The speed of a falling domino isn’t constant — it accelerates, which is exactly what a derivative measures: how fast something is changing.' },
];

const HeroDominoChain = () => {
  const [toppled, setToppled] = useState(-1);

  const active = toppled >= 0 ? DOMINOES[toppled] : null;

  return (
    <div className="relative self-end overflow-hidden rounded-2xl border border-white/[0.14] bg-[#081b33]/72 p-5 shadow-[0_18px_44px_rgba(0,0,0,0.24)] backdrop-blur-xl sm:p-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_20%,rgba(241,223,154,0.18),transparent_32%),radial-gradient(circle_at_22%_78%,rgba(155,199,255,0.16),transparent_34%)]" />

      <div className="relative mb-5 flex items-center justify-between gap-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#f1df9a]/25 bg-[#f1df9a]/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-[#f1df9a]">
          <Sparkles className="h-3.5 w-3.5" />
          Tap a domino
        </div>
        <span className="hidden rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-bold text-white/80 sm:inline-flex">
          {toppled + 1} of {DOMINOES.length} fallen
        </span>
      </div>

      <div className="relative z-10 flex h-40 items-end justify-between gap-2 px-2 sm:h-48">
        {DOMINOES.map((d, i) => {
          const isDown = i <= toppled;
          const isActive = i === toppled;
          const height = 60 + i * 12;
          return (
            <button
              key={d.topic}
              type="button"
              onClick={() => setToppled(i)}
              aria-label={`Domino ${i + 1}: ${d.topic}`}
              className="group relative flex-1 focus-visible:outline-none"
              style={{ height: `${height}px` }}
            >
              <div
                className="absolute bottom-0 left-1/2 w-full max-w-[26px] origin-bottom rounded-[3px] border transition-transform duration-500 ease-out"
                style={{
                  height: `${height}px`,
                  transform: `translateX(-50%) rotate(${isDown ? 62 : 0}deg)`,
                  transitionDelay: isDown ? `${i * 70}ms` : '0ms',
                  background: isActive ? '#f1df9a' : isDown ? 'rgba(241,223,154,0.35)' : 'rgba(255,255,255,0.14)',
                  borderColor: isActive ? '#f1df9a' : 'rgba(255,255,255,0.22)',
                }}
              >
                <span
                  className="absolute left-1/2 top-2 h-1.5 w-1.5 -translate-x-1/2 rounded-full"
                  style={{ background: isDown ? '#071629' : 'rgba(255,255,255,0.4)' }}
                />
              </div>
            </button>
          );
        })}
      </div>

      <div className="relative z-10 mt-5 min-h-[104px] rounded-xl border border-white/10 bg-white/5 px-4 py-3.5">
        {active ? (
          <>
            <span className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.14em] text-[#f1df9a]">{active.topic}</span>
            <p className="text-sm leading-6 text-white/78">{active.fact}</p>
          </>
        ) : (
          <p className="text-sm leading-6 text-white/50">Tap the first domino to start the chain — each one reveals a different maths idea.</p>
        )}
      </div>

      <p className="relative z-10 mt-3 text-center text-[11px] text-white/40">
        Every domino ties back to a different branch of maths.
      </p>
    </div>
  );
};

const MathematicsDesign1 = () => {
  return (
    <div className="min-h-screen bg-[#fffdf8] text-[#172033]">
      <SEO title="Mathematics — Design 1: Domino Chain (mockup)" description="Hero concept mockup." canonicalUrl="/subjects/mathematics/design-1" />
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
                Design 1 — Domino Chain (mockup)
              </div>
              <h1 className="max-w-4xl text-balance font-serif text-5xl font-medium leading-[0.96] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
                One idea knocks the next one over.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75">
                Maths topics build on each other the same way a domino chain does — tap through the row and watch a different branch of maths reveal itself each time.
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

            <HeroDominoChain />
          </div>
        </section>

        <section className="bg-[#fff6e7] px-5 py-14 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#c9a227]">Mockup note</p>
            <p className="mt-3 text-base leading-8 text-[#61708a]">
              This page exists only to preview the Domino Chain hero concept in real site chrome. The rest of the Mathematics page (curiosity cards, pathways, HSC streams, mistake-finder) is unchanged and lives at <code>/subjects/mathematics</code>.
            </p>
          </div>
        </section>
      </main>

      <FooterNew />
    </div>
  );
};

export default MathematicsDesign1;
