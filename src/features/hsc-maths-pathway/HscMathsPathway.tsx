import { useState, type JSX } from 'react';
import { ArrowRight, ChevronRight, Compass, HelpCircle, Target, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HSC_STREAMS, getHscStream, type HscStream, type HscStreamId } from './hsc-maths-pathway-model';
import './hsc-maths-pathway.css';

const DETAIL_ITEMS = [
  { label: 'Best fit when', field: 'bestFit', icon: Target },
  { label: 'What changes', field: 'whatChanges', icon: TrendingUp },
  { label: 'Where students need help', field: 'helpNeeded', icon: HelpCircle },
  { label: 'How DA helps', field: 'daSupport', icon: Compass },
] as const;

function CourseGuide({ stream }: { stream: HscStream }) {
  return (
    <div id="hsc-course-guide" role="region" aria-live="polite" aria-labelledby="hsc-course-guide-heading" className="p-6 sm:p-8 lg:p-10">
      <p className="inline-block border-b-2 pb-1 text-xs font-black uppercase tracking-[0.12em] text-[#071629]" style={{ borderColor: stream.color }}>{stream.badge}</p>
      <h3 id="hsc-course-guide-heading" className="mt-3 font-serif text-3xl font-medium leading-[1.08] tracking-[-0.03em] text-[#071629] [text-wrap:balance] sm:text-4xl">{stream.name} at a glance</h3>
      <p className="mt-3 text-sm font-bold text-[#40516b]">{stream.availability}</p>
      <dl className="mt-8 grid gap-6">
        {DETAIL_ITEMS.map(({ label, field, icon: Icon }) => (
          <div key={field} className="grid grid-cols-[1.5rem_1fr] gap-3">
            <Icon className="mt-0.5 h-5 w-5 text-[#40516b]" aria-hidden="true" />
            <div><dt className="text-xs font-black uppercase tracking-[0.1em] text-[#071629]">{label}</dt><dd className="mt-1 text-sm leading-6 text-[#40516b]">{stream[field]}</dd></div>
          </div>
        ))}
      </dl>
      <details className="mt-8 border-y border-[#071629]/15 py-4">
        <summary className="min-h-12 cursor-pointer py-3 text-sm font-black text-[#071629] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#071629] focus-visible:ring-2 focus-visible:ring-[#071629] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffdf8]">See topics covered</summary>
        <ul className="mt-3 grid gap-2 text-sm leading-6 text-[#40516b]">{stream.topics.map((topic) => <li key={topic}>{topic}</li>)}</ul>
      </details>
      <Link to="/book-interview" className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 bg-[#071629] px-5 text-center text-sm font-black text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#071629] focus-visible:ring-2 focus-visible:ring-[#071629] focus-visible:ring-offset-4 focus-visible:ring-offset-[#fffdf8]">Talk through your child&apos;s course choice <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
      <Link to="/hsc-excellence" className="mt-3 inline-flex min-h-12 w-full items-center justify-center gap-2 text-sm font-black text-[#071629] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#071629] focus-visible:ring-2 focus-visible:ring-[#071629] focus-visible:ring-offset-4 focus-visible:ring-offset-[#fffdf8]">Explore HSC program <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
    </div>
  );
}

function UnsureGuide() {
  const [year, setYear] = useState('');
  const [currentCourse, setCurrentCourse] = useState('');
  const [schoolAdvice, setSchoolAdvice] = useState('');
  const isComplete = Boolean(year && currentCourse && schoolAdvice);

  return (
    <div id="hsc-course-guide" role="region" aria-live="polite" aria-labelledby="hsc-course-guide-heading" className="p-6 sm:p-8 lg:p-10">
      <div className="max-w-xl">
        <p className="text-xs font-black uppercase tracking-[0.12em] text-[#40516b]">A practical course-choice checklist</p>
        <h3 id="hsc-course-guide-heading" className="mt-3 font-serif text-3xl font-medium leading-[1.08] tracking-[-0.03em] text-[#071629]">Start with the facts, not a score.</h3>
        <p className="mt-3 text-sm leading-6 text-[#40516b]">This is a comparison checklist, not a placement recommendation. School advice and the student&apos;s current results still come first.</p>

        <fieldset className="mt-7"><legend className="text-sm font-black text-[#071629]">What year is your child entering?</legend><div className="mt-3 flex flex-wrap gap-2">{['Year 10', 'Year 11', 'Year 12'].map((option) => <button key={option} type="button" aria-pressed={year === option} onClick={() => setYear(option)} className={`min-h-11 rounded-xl border px-4 text-sm font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#071629] ${year === option ? 'border-[#071629] bg-[#fff6e7]' : 'border-[#071629]/20 bg-white'}`}>{option}</button>)}</div></fieldset>
        <fieldset className="mt-6"><legend className="text-sm font-black text-[#071629]">What are they studying now?</legend><div className="mt-3 flex flex-wrap gap-2">{['Year 10 Maths', 'Standard', 'Advanced', 'Extension 1', 'Not sure'].map((option) => <button key={option} type="button" aria-pressed={currentCourse === option} onClick={() => setCurrentCourse(option)} className={`min-h-11 rounded-xl border px-4 text-sm font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#071629] ${currentCourse === option ? 'border-[#071629] bg-[#fff6e7]' : 'border-[#071629]/20 bg-white'}`}>{option}</button>)}</div></fieldset>
        <fieldset className="mt-6"><legend className="text-sm font-black text-[#071629]">What has the school recommended or offered?</legend><div className="mt-3 grid gap-2">{['Standard', 'Advanced', 'Advanced + Extension 1', 'We have not received advice yet'].map((option) => <button key={option} type="button" aria-pressed={schoolAdvice === option} onClick={() => setSchoolAdvice(option)} className={`min-h-11 rounded-xl border px-4 text-left text-sm font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#071629] ${schoolAdvice === option ? 'border-[#071629] bg-[#fff6e7]' : 'border-[#071629]/20 bg-white'}`}>{option}</button>)}</div></fieldset>

        {isComplete && <div className="mt-7 rounded-xl border border-[#c9921b]/40 bg-[#fff6e7] p-5"><p className="text-sm font-black text-[#071629]">What to check next</p><ul className="mt-3 grid gap-2 text-sm leading-6 text-[#40516b]"><li>Compare the selected school advice with the course cards on the left.</li><li>Check whether the school&apos;s recommendation matches your child&apos;s current results and confidence.</li>{year === 'Year 12' && <li>For Extension 2, confirm that it replaces the Advanced HSC course in Year 12.</li>}{schoolAdvice === 'We have not received advice yet' && <li>Ask the school which maths course they recommend before making a choice.</li>}</ul></div>}
      </div>
    </div>
  );
}

export function HscMathsPathway(): JSX.Element {
  const [activeStreamId, setActiveStreamId] = useState<HscStreamId | null>(null);
  const [isUnsure, setIsUnsure] = useState(false);
  const activeStream = activeStreamId ? getHscStream(activeStreamId) : null;

  return (
    <section id="hsc-maths" className="scroll-mt-16 text-[#071629]">
      <div className="max-w-none">
        <div className="overflow-hidden bg-[#fffdf8]">
          <header className="border-b border-[#071629]/15 bg-[#fff6e7] px-6 py-10 sm:px-10 sm:py-12">
            <h2 className="max-w-[16ch] font-serif text-4xl font-medium leading-[1.05] tracking-[-0.035em] text-[#071629] [text-wrap:balance] sm:text-5xl">Choose an HSC maths course with confidence.</h2>
            <p className="mt-5 max-w-[70ch] text-base leading-7 text-[#40516b]">Select the course your child is taking or considering. We&apos;ll explain who it suits, what it keeps open and where students usually need support.</p>
          </header>
          <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
            <div className="border-b border-[#071629]/15 p-6 sm:p-8 lg:border-b-0 lg:border-r lg:p-10">
              <p className="text-xs font-black uppercase tracking-[0.12em] text-[#40516b]">1 · Choose a course</p>
              <h3 className="mt-3 max-w-[16ch] font-serif text-3xl font-medium leading-[1.08] tracking-[-0.03em] text-[#071629] [text-wrap:balance]">Which course is your child considering?</h3>
              <p className="mt-3 max-w-[34ch] text-sm leading-6 text-[#40516b]">There is no default recommendation — start with what they are studying now.</p>
              <div className="mt-7 grid gap-3" aria-label="Choose an HSC mathematics stream">
                {HSC_STREAMS.map((stream, index) => {
                  const isSelected = stream.id === activeStreamId;
                  const groupLabel = index === 0 ? 'Year 11–12 · Choose one' : stream.id === 'extension-1' ? 'Studied with Advanced' : stream.id === 'extension-2' ? 'Year 12 only · Requires Advanced + Extension 1' : null;
                  return <div key={stream.id}>
                    {groupLabel && <p className="mb-2 text-xs font-black uppercase tracking-[0.09em] text-[#40516b]">{groupLabel}</p>}
                    <button type="button" aria-pressed={isSelected} aria-controls="hsc-course-guide" onClick={() => { setActiveStreamId(stream.id); setIsUnsure(false); }} className={`group flex min-h-[5.25rem] w-full items-center gap-4 rounded-xl border px-4 py-3 text-left transition-colors motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#071629] focus-visible:ring-2 focus-visible:ring-[#071629] ${isSelected ? 'border-[#071629] bg-[#fff6e7]' : 'border-[#071629]/20 bg-white hover:border-[#071629]/55'}`}>
                      <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: stream.color }} aria-hidden="true" />
                      <span className="min-w-0 flex-1"><span className="block font-serif text-xl font-medium leading-tight text-[#071629]">{stream.name}</span><span className="mt-1 block text-sm leading-5 text-[#40516b]">{stream.shortDescriptor}</span></span>
                      <ChevronRight className="h-5 w-5 shrink-0 text-[#071629] transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden="true" />
                    </button>
                  </div>;
                })}
              </div>
              <button type="button" onClick={() => { setActiveStreamId(null); setIsUnsure(true); }} className="mt-7 text-left text-sm font-black text-[#071629] underline decoration-[#c9921b] decoration-2 underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#071629]">I&apos;m not sure which course fits yet</button>
            </div>
            {activeStream ? <CourseGuide stream={activeStream} /> : isUnsure ? <UnsureGuide /> : <div id="hsc-course-guide" role="region" aria-live="polite" aria-labelledby="hsc-course-guide-heading" className="flex min-h-[22rem] items-center justify-center bg-[#fffdf8] p-8 text-center sm:p-12"><div className="max-w-sm"><span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#f4dfab] font-serif text-2xl text-[#071629]" aria-hidden="true">?</span><h3 id="hsc-course-guide-heading" className="mt-6 font-serif text-3xl font-medium leading-[1.08] tracking-[-0.03em] text-[#071629]">Your course guide will appear here.</h3><p className="mt-4 text-sm leading-6 text-[#40516b]">Select a course on the left to see what matters most — or choose “I&apos;m not sure” for a simpler starting point.</p></div></div>}
          </div>
          <div className="border-t border-[#071629]/15 bg-[#f6ecd9] px-6 py-8 sm:px-10">
            <p className="text-sm font-black text-[#071629]">How the courses connect</p>
            <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-3 text-sm font-bold text-[#071629]">{HSC_STREAMS.map((stream, index) => <div key={stream.id} className="contents">{index > 0 && <span className="text-[#40516b]">{stream.id === 'advanced' ? 'choose one' : stream.id === 'extension-1' ? 'studied with →' : 'in Year 12 → replaces the Advanced HSC course in Year 12 →'}</span>}<span className="rounded-xl border border-[#071629]/25 bg-white px-4 py-3 text-center" style={{ borderColor: stream.color }}>{stream.name}</span></div>)}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
