import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import katex from 'katex';
import { NetworkAmbientMoment } from '@/features/maths-ambient-motion/MathsAmbientMotion';

const InlineMath = ({ expression, label }: { expression: string; label: string }) => (
  <span
    className="inline-block max-w-full align-baseline [&_.katex]:text-inherit"
    aria-label={label}
    dangerouslySetInnerHTML={{
      __html: katex.renderToString(expression, { displayMode: false, throwOnError: false }),
    }}
  />
);

const teachingSequence = [
  { name: 'Predict', detail: 'Say what should happen before reaching for a rule.' },
  { name: 'Explore', detail: 'Test the idea with a diagram, example or simpler case.' },
  { name: 'Explain', detail: 'Connect every line of working to the decision behind it.' },
  { name: 'Apply', detail: 'Use the reasoning independently in a new question.' },
];

export const MathsGraphLabInvitation = () => (
  <section className="relative overflow-hidden bg-[#071629] px-5 py-16 text-white lg:px-8" aria-labelledby="maths-graph-lab-invitation-heading">
    <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
      <div className="max-w-xl">
        <p className="text-sm font-black text-[#f0c86a]">A practical tool students can return to</p>
        <h2 id="maths-graph-lab-invitation-heading" className="mt-4 text-balance font-serif text-4xl font-medium leading-[1.05] tracking-[-0.035em] sm:text-5xl">
          Move the graph. Explain what changed.
        </h2>
        <p className="mt-5 max-w-[62ch] text-pretty text-base leading-8 text-white/76">
          Predict a transformation, test it with guided controls, then switch to the unrestricted grapher whenever you need a quick calculator.
        </p>
        <Link
          to="/maths-graph-lab"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-7 inline-flex min-h-12 items-center justify-center rounded-full bg-[#f0c86a] px-6 text-sm font-black text-[#071629] transition-colors hover:bg-[#ffe19a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-[#071629]"
        >
          Open the Graph Lab <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="min-w-0" aria-hidden="true">
        <svg viewBox="0 0 620 270" className="block h-auto w-full" focusable="false">
          <defs>
            <linearGradient id="graph-lab-invitation-gold" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#b98718" />
              <stop offset="0.52" stopColor="#f0c86a" />
              <stop offset="0.72" stopColor="#fff8d1" />
              <stop offset="1" stopColor="#d5a62f" />
            </linearGradient>
            <filter id="graph-lab-invitation-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          {[90, 170, 250, 330, 410, 490, 570].map((x) => <line key={`x-${x}`} x1={x} y1="24" x2={x} y2="244" stroke="white" strokeOpacity="0.08" />)}
          {[44, 94, 144, 194, 244].map((y) => <line key={`y-${y}`} x1="48" y1={y} x2="594" y2={y} stroke="white" strokeOpacity="0.08" />)}
          <path d="M48 194H594M118 244V24" fill="none" stroke="white" strokeOpacity="0.42" strokeWidth="1.5" />
          <path d="M62 44C168 61 207 194 294 194C382 194 424 60 584 44" fill="none" stroke="white" strokeOpacity="0.27" strokeWidth="3" strokeDasharray="7 8" />
          <path d="M62 126C168 143 207 236 294 236C382 236 424 142 584 126" fill="none" stroke="url(#graph-lab-invitation-gold)" strokeWidth="4" strokeLinecap="round" filter="url(#graph-lab-invitation-glow)" />
          <line x1="294" y1="194" x2="294" y2="236" stroke="#f0c86a" strokeWidth="2" strokeDasharray="4 5" />
          <circle cx="294" cy="236" r="6" fill="#fff8d1" stroke="#f0c86a" strokeWidth="3" filter="url(#graph-lab-invitation-glow)" />
          <text x="310" y="224" fill="#f0c86a" fontSize="15" fontWeight="700">d moves the graph down</text>
          <text x="470" y="32" fill="white" fillOpacity="0.5" fontSize="13">parent graph</text>
          <text x="470" y="120" fill="#f0c86a" fontSize="13" fontWeight="700">transformed graph</text>
        </svg>
      </div>
    </div>
  </section>
);

export const MathsTeachingProof = () => (
  <section id="math-teaching-proof" className="scroll-mt-24 bg-[#fff6e7] px-5 py-20 lg:px-8 lg:py-24" aria-labelledby="math-teaching-proof-heading">
    <NetworkAmbientMoment passive />
    <div className="mx-auto max-w-7xl">
      <div className="grid gap-7 border-b border-[#071629]/14 pb-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
        <div>
          <p className="text-sm font-black text-[#9a6e0b]">How learning changes</p>
          <h2 id="math-teaching-proof-heading" className="mt-3 text-balance font-serif text-4xl font-medium leading-[1.06] tracking-[-0.035em] text-[#071629] sm:text-5xl">
            We teach the decision behind every step.
          </h2>
        </div>
        <p className="max-w-[65ch] text-pretty text-base leading-8 text-[#40516b]">
          Correct working matters, but lasting confidence comes from understanding why a move is valid and recognising when to use it again.
        </p>
      </div>

      <div className="maths-teaching-sequence">
        <ol className="grid border-b border-[#071629]/14 md:grid-cols-4" aria-label="DA Tuition teaching sequence">
          {teachingSequence.map((step, index) => (
            <li key={step.name} className="border-[#071629]/12 py-6 md:border-r md:px-5 md:last:border-r-0 md:first:pl-0">
              <div className="flex items-baseline gap-3">
                <span className="text-xs font-black tabular-nums text-[#9a6e0b]">0{index + 1}</span>
                <h3 className="text-lg font-black text-[#071629]">{step.name}</h3>
              </div>
              <p className="mt-2 text-sm leading-6 text-[#536077]">{step.detail}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
        <div className="rounded-2xl border border-[#071629]/14 bg-white p-6 sm:p-8">
          <p className="text-xs font-black text-[#8d6815]">A common algebra misconception</p>
          <div className="mt-5 text-2xl text-[#071629] sm:text-3xl">
            <InlineMath expression="3(x-2)+5=20" label="three times open bracket x minus two close bracket plus five equals twenty" />
          </div>
          <p className="mt-7 text-xs font-black text-[#8a3f39]">Student attempt</p>
          <div className="mt-3 space-y-2 text-lg text-[#8a3f39]">
            <p className="line-through decoration-2 decoration-[#b34d45]">
              <InlineMath expression="3x-2+5=20" label="three x minus two plus five equals twenty" />
            </p>
            <p><InlineMath expression="3x+3=20" label="three x plus three equals twenty" /></p>
            <p><InlineMath expression="3x=23" label="three x equals twenty three" /></p>
            <p><InlineMath expression="x=\frac{23}{3}" label="x equals twenty three over three" /></p>
          </div>
          <p className="mt-6 text-sm leading-7 text-[#536077]">
            The first line has lost the multiplication on the −2. Every later line follows from that one decision, which is why the tutor looks for the first misconception rather than only correcting the final answer.
          </p>
        </div>

        <div className="pt-1">
          <p className="text-xs font-black text-[#8d6815]">The tutor does not simply replace the answer</p>
          <blockquote className="mt-4 max-w-[34ch] font-serif text-2xl leading-snug tracking-[-0.025em] text-[#071629] sm:text-3xl">
            “What does the 3 need to multiply inside the bracket before we can undo anything?”
          </blockquote>

          <div className="mt-8 grid gap-4">
            {[
              { expression: '3(x-2)=3x-6', label: 'three times open bracket x minus two close bracket equals three x minus six', text: 'Distribute the 3 to both terms inside the bracket, not just to x.' },
              { expression: '3x-6+5=20\\Rightarrow3x-1=20', label: 'three x minus six plus five equals twenty, therefore three x minus one equals twenty', text: 'Simplify the constants before isolating x.' },
              { expression: '3x=21', label: 'three x equals twenty one', text: 'Add 1 to both sides to undo the minus 1 while preserving equality.' },
              { expression: 'x=21\\div3=7', label: 'x equals twenty one divided by three equals seven', text: 'Then divide both sides by 3.' },
              { expression: '3(7-2)+5=20', label: 'three times open bracket seven minus two close bracket plus five equals twenty', text: 'Check the result in the original equation.' },
            ].map((step) => (
              <div key={step.expression} className="grid gap-2 border-t border-[#071629]/12 pt-4 sm:grid-cols-[14rem_1fr] sm:items-baseline">
                <span className="flex items-center gap-2 font-bold text-[#245f42]">
                  <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <InlineMath expression={step.expression} label={step.label} />
                </span>
                <p className="text-sm leading-6 text-[#536077]">{step.text}</p>
              </div>
            ))}
          </div>

          <p className="mt-7 max-w-[65ch] text-sm font-semibold leading-7 text-[#40516b]">
            The student leaves with a method they can explain and reuse—not one corrected line to memorise.
          </p>
        </div>
      </div>
    </div>
  </section>
);
