import { useEffect, useRef, useState } from 'react';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import { BookOpen, Quote } from 'lucide-react';

/* ── Scroll-reveal wrapper: each reflection gently rises into view ── */
function useInView<T extends HTMLElement>(threshold = 0.12) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, { threshold });
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function Reveal({ children }: { children: React.ReactNode }) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0) scale(1)' : 'translateY(36px) scale(0.985)',
        transition: 'opacity 0.8s ease, transform 0.8s ease',
      }}
    >
      {children}
    </div>
  );
}

const PrincipalReflections = () => {
  return (
    <div className="min-h-screen bg-[#fffdf8] text-[#172033]">
      <SEO
        title="Principal's Reflections — Why DA Tuition Exists"
        description="Read the principal's reflections on thoughtful guidance, high standards, and the deeply personalised care that helps every child at DA Tuition rise."
        canonicalUrl="/principal-reflections"
      />
      <NavigationNew />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-[#071629] pt-36 lg:pt-40">
        <div className="absolute inset-0">
          <img
            src="/images/programs/primary-whiteboard-1.jpg"
            alt="DA Tuition Principal"
            className="h-full w-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#071629] via-[#071629]/88 to-[#071629]/40" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#fffdf8] to-transparent" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-5 pb-24 text-center lg:px-8 lg:pb-28">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#f1df9a] backdrop-blur-md">
            <BookOpen className="h-4 w-4" />
            Five Reflections
          </div>

          <h1 className="mx-auto max-w-3xl font-serif text-5xl font-medium leading-[0.98] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
            Principal&rsquo;s <span className="bg-gradient-to-r from-[#c9a227] to-[#f1df9a] bg-clip-text text-transparent">Reflections</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/75">
            Why DA Tuition exists, told in the Principal&rsquo;s own words — on thoughtful guidance, high standards, and the deeply personalised care that helps every child rise.
          </p>
        </div>
      </section>

      {/* Page 1: More Than Tutoring */}
      <Reveal>
        <section className="bg-[#fffdf8] px-5 py-16 lg:px-8">
          <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-[#071629]/8 bg-white shadow-lg shadow-[#071629]/5">
            <div className="h-1 bg-gradient-to-r from-[#c9a227] via-[#f1df9a] to-[#c9a227]" />
            <div className="p-8 md:p-12 lg:p-14">
              <div className="mb-6 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-[0.24em] text-[#c9a227]">DA Tuition</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#61708a]/60">Page 1</span>
              </div>
              <span className="mb-5 inline-block rounded-full border border-[#c9a227]/30 bg-[#fff6e7] px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#c9a227]">
                Principal Reflection
              </span>
              <h2 className="whitespace-pre-line font-serif text-3xl font-medium leading-[1.05] tracking-[-0.03em] text-[#071629] md:text-4xl">
                {'More Than Tutoring.\nWhere Children Rise.'}
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[#61708a]">
                DA Tuition helps students move beyond what has been holding them back, rebuild confidence, and pursue strong academic growth through thoughtful guidance, high standards, and deeply personalised care.
              </p>
              <blockquote className="mt-6 max-w-3xl rounded-r-lg border-l-4 border-[#c9a227] bg-[#fff6e7] px-5 py-4 font-serif text-lg font-medium italic leading-snug text-[#10233f]">
                &ldquo;A child&rsquo;s starting point should never be mistaken for their potential.&rdquo;
              </blockquote>

              <div className="mt-10 grid gap-10 lg:grid-cols-2">
                <div>
                  <span className="mb-4 block h-[3px] w-20 bg-[#c9a227]" />
                  <span className="mb-3 block text-[10px] font-black uppercase tracking-[0.2em] text-[#c9a227]">Core Idea</span>
                  <p className="mb-4 text-[15px] leading-7 text-[#61708a]">
                    <span className="font-semibold text-[#10233f]">I love working at DA Tuition because the work we do is deeply meaningful.</span> It reaches far beyond academic improvement and allows us to play a careful part in helping young people move forward with greater confidence, direction, and hope.
                  </p>
                  <div className="my-5 border-l-[3px] border-[#c9a227]/70 pl-4 text-[15px] italic leading-7 text-[#10233f]">
                    This is a place where students are known carefully, guided thoughtfully, and supported to grow well from where they are.
                  </div>
                  <p className="text-[15px] leading-7 text-[#61708a]">
                    What I value most about DA is the thoughtfulness behind the way we work. Every child is different, and we take that seriously. We do not approach students as though the same formula should apply to everyone. We take the time to understand where each child is, what they are aiming for, and how we can support them well from that point.
                  </p>
                </div>
                <div>
                  <span className="mb-3 block text-[10px] font-black uppercase tracking-[0.2em] text-[#c9a227]">What Families Sense</span>
                  <p className="mb-4 text-[15px] leading-7 text-[#61708a]">
                    I am also very proud of the team around me. This is a team of people who care deeply, think carefully, and hold a great deal of respect for one another.
                  </p>
                  <p className="mb-4 text-[15px] leading-7 text-[#61708a]">
                    There is a calm, genuine warmth in the culture here, and that matters. Children grow best in environments where there is steadiness, sincerity, and thoughtful care behind the work.
                  </p>
                  <p className="text-[15px] leading-7 text-[#61708a]">
                    Partnership with parents is also central to what we do. Every family comes with its own hopes, concerns, and goals for their child, and we take that responsibility seriously. We listen carefully, communicate honestly, and work closely with parents because progress is strongest when the adults around a child are working with trust and shared purpose.
                  </p>
                  <div className="mt-5 rounded-xl border border-[#071629]/8 bg-[#fff6e7] p-5">
                    <div className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#c9a227]">What Families Value</div>
                    <div className="text-[15px] font-medium leading-7 text-[#10233f]">
                      A child who is genuinely known, guided carefully, and taken seriously from the beginning.
                    </div>
                  </div>
                  <div className="mt-5 text-base font-semibold leading-7 text-[#071629]">
                    Thoughtful care and strong guidance can exist together.
                  </div>
                  <p className="mt-4 text-[15px] leading-7 text-[#61708a]">
                    That is why I am so proud to be part of DA. It is a place where students are known carefully, guided thoughtfully, and supported to grow well from where they are.
                  </p>
                </div>
              </div>

              <div className="mt-10 flex items-center justify-between border-t border-[#071629]/8 pt-5">
                <div className="text-base font-semibold text-[#071629]">Why I love working at DA Tuition</div>
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#61708a]/60">DA Tuition</div>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* Page 2: Student Growth */}
      <Reveal>
        <section className="bg-[#fff6e7] px-5 py-16 lg:px-8">
          <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-[#071629]/8 bg-white shadow-lg shadow-[#071629]/5">
            <div className="h-1 bg-gradient-to-r from-[#c9a227] via-[#f1df9a] to-[#c9a227]" />
            <div className="p-8 md:p-12 lg:p-14">
              <div className="mb-6 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-[0.24em] text-[#c9a227]">Student Growth</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#61708a]/60">Page 2</span>
              </div>
              <span className="mb-5 inline-block rounded-full border border-[#c9a227]/30 bg-[#fff6e7] px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#c9a227]">
                Results And Transformation
              </span>
              <h2 className="whitespace-pre-line font-serif text-3xl font-medium leading-[1.05] tracking-[-0.03em] text-[#071629] md:text-4xl">
                {'What do you hope to\nhelp children achieve?'}
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[#61708a]">
                Helping students move from discouragement to discipline, from uncertainty to stronger results, and from low expectations to meaningful ambition.
              </p>
              <blockquote className="mt-6 max-w-3xl rounded-r-lg border-l-4 border-[#c9a227] bg-[#fff6e7] px-5 py-4 font-serif text-lg font-medium italic leading-snug text-[#10233f]">
                &ldquo;That kind of progress reaches further than a report. It changes the way a child begins to carry themselves.&rdquo;
              </blockquote>

              <div className="mt-10 grid gap-10 lg:grid-cols-2">
                <div>
                  <span className="mb-4 block h-[3px] w-20 bg-[#c9a227]" />
                  <span className="mb-3 block text-[10px] font-black uppercase tracking-[0.2em] text-[#c9a227]">Core Idea</span>
                  <p className="mb-4 text-[15px] leading-7 text-[#61708a]">
                    <span className="font-semibold text-[#10233f]">I hope to help children achieve what may once have felt beyond them.</span>
                  </p>
                  <p className="mb-4 text-[15px] leading-7 text-[#61708a]">
                    For some students, that means rebuilding from the ground up. For others, it means refining their skills and pursuing exceptional results with clarity, discipline, and consistency. Whatever their starting point, I want each child to know that where they begin should never be mistaken for their potential.
                  </p>
                  <div className="my-5 border-l-[3px] border-[#c9a227]/70 pl-4 text-[15px] italic leading-7 text-[#10233f]">
                    Excellent results are earned through clear guidance, high standards, honest feedback, and sustained effort.
                  </div>
                  <p className="text-[15px] leading-7 text-[#61708a]">
                    I care deeply about strong academic outcomes. I want my students to build solid foundations, think clearly, write with purpose, and develop the habits that high achievement requires. For students aiming high, I want to help them pursue those goals with maturity, precision, and seriousness.
                  </p>
                </div>
                <div>
                  <div className="rounded-xl border border-[#071629]/8 bg-[#fff6e7] p-5">
                    <div className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#c9a227]">Transformation</div>
                    <div className="text-[15px] font-medium leading-7 text-[#10233f]">
                      To see a child move from thirty percent to ninety percent is deeply rewarding. Beyond the mark itself, I value the ambition, responsibility, and belief that make that result possible.
                    </div>
                  </div>
                  <div className="mt-5 text-base font-semibold leading-7 text-[#071629]">
                    Strong results matter, but the deeper aim is a child who works with purpose.
                  </div>
                  <p className="mt-4 mb-4 text-[15px] leading-7 text-[#61708a]">
                    What makes this work especially meaningful is seeing children change in the way they approach their own future. A student who once felt far behind begins to work with purpose. A child who had stopped aiming high begins to set goals again. A young person who doubted what was possible begins to see that stronger outcomes can be earned through steady effort.
                  </p>
                  <p className="mb-4 text-[15px] leading-7 text-[#61708a]">
                    To see a child move from thirty percent to ninety percent is deeply rewarding. But beyond the mark itself, I value the growth in ambition, responsibility, and belief that often makes that result possible. That kind of progress reaches further than a report. It changes the way a child begins to carry themselves.
                  </p>
                  <p className="text-[15px] leading-7 text-[#61708a]">
                    My hope is that every child leaves not only with stronger results, but with clearer goals, stronger habits, and a firmer belief in what they can achieve.
                  </p>
                </div>
              </div>

              <div className="mt-10 flex items-center justify-between border-t border-[#071629]/8 pt-5">
                <div className="text-base font-semibold text-[#071629]">Helping students achieve more than they once believed possible</div>
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#61708a]/60">DA Tuition</div>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* Page 3: What Holds Children Back */}
      <Reveal>
        <section className="bg-[#fffdf8] px-5 py-16 lg:px-8">
          <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-[#071629]/8 bg-white shadow-lg shadow-[#071629]/5">
            <div className="h-1 bg-gradient-to-r from-[#c9a227] via-[#f1df9a] to-[#c9a227]" />
            <div className="p-8 md:p-12 lg:p-14">
              <div className="mb-6 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-[0.24em] text-[#c9a227]">What Holds Children Back</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#61708a]/60">Page 3</span>
              </div>
              <span className="mb-5 inline-block rounded-full border border-[#c9a227]/30 bg-[#fff6e7] px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#c9a227]">
                Psychological Insight
              </span>
              <h2 className="whitespace-pre-line font-serif text-3xl font-medium leading-[1.05] tracking-[-0.03em] text-[#071629] md:text-4xl">
                {'What have you learned\nis often really\nholding children back?'}
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[#61708a]">
                Often, the greatest obstacle is not ability alone, but the meaning a child begins to attach to difficulty, mistakes, and effort.
              </p>
              <blockquote className="mt-6 max-w-3xl rounded-r-lg border-l-4 border-[#c9a227] bg-[#fff6e7] px-5 py-4 font-serif text-lg font-medium italic leading-snug text-[#10233f]">
                &ldquo;Many children do not need more pressure first. They need help seeing that growth is still possible for them.&rdquo;
              </blockquote>

              <div className="mt-10 grid gap-10 lg:grid-cols-2">
                <div>
                  <span className="mb-4 block h-[3px] w-20 bg-[#c9a227]" />
                  <span className="mb-3 block text-[10px] font-black uppercase tracking-[0.2em] text-[#c9a227]">Core Idea</span>
                  <p className="mb-4 text-[15px] leading-7 text-[#61708a]">
                    <span className="font-semibold text-[#10233f]">I have learned that what holds children back is often deeper than the work itself.</span>
                  </p>
                  <p className="mb-4 text-[15px] leading-7 text-[#61708a]">
                    Sometimes it is weak foundations. Sometimes it is fear of getting things wrong. Sometimes it is discouragement after a long period of struggle. Sometimes it is the quiet belief that no matter how hard they try, they will still fall short. In many cases, what appears to be an academic issue is only part of the story.
                  </p>
                  <p className="text-[15px] leading-7 text-[#61708a]">
                    A child can become trapped not only by gaps in knowledge, but by the meaning they attach to those gaps. Difficulty begins to feel like proof that they are behind. Mistakes begin to feel embarrassing. Effort begins to feel risky because it may lead to disappointment. Over time, some children stop engaging fully, not because they do not care, but because learning has become tied to discouragement rather than progress.
                  </p>
                </div>
                <div>
                  <div className="rounded-xl border border-[#071629]/8 bg-[#fff6e7] p-5">
                    <div className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#c9a227]">Where Growth Begins</div>
                    <div className="text-[15px] font-medium leading-7 text-[#10233f]">
                      Real confidence is not built by avoiding challenge. It is built by learning that they can meet challenge and grow through it.
                    </div>
                  </div>
                  <div className="mt-5 text-base font-semibold leading-7 text-[#071629]">
                    Many children need belief rebuilt before performance can rise.
                  </div>
                  <p className="mt-4 mb-4 text-[15px] leading-7 text-[#61708a]">
                    That is why many children do not need more pressure first. They need help seeing that struggle is not a verdict on their ability. They need support that rebuilds trust in the learning process and helps them experience effort differently. When a child begins to understand that difficulty can be worked through, rather than feared, something important starts to shift.
                  </p>
                  <p className="mb-4 text-[15px] leading-7 text-[#61708a]">
                    I have also learned that children grow best when they are neither over-handled nor left to drift. They need warmth, but they also need clear expectations. They need encouragement, but they also need adults steady enough to guide them through discomfort without letting them give up too quickly. Real confidence is not built by avoiding challenge. It is built by learning that they can meet challenge and grow through it.
                  </p>
                  <p className="text-[15px] leading-7 text-[#61708a]">
                    Very often, before a child can achieve more, they need to believe that growth is genuinely possible for them. That change in belief is not everything, but it is often where everything begins.
                  </p>
                </div>
              </div>

              <div className="mt-10 flex items-center justify-between border-t border-[#071629]/8 pt-5">
                <div className="text-base font-semibold text-[#071629]">Understanding what sits beneath struggle</div>
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#61708a]/60">DA Tuition</div>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* Page 4: Why DA Works */}
      <Reveal>
        <section className="bg-[#fff6e7] px-5 py-16 lg:px-8">
          <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-[#071629]/8 bg-white shadow-lg shadow-[#071629]/5">
            <div className="h-1 bg-gradient-to-r from-[#c9a227] via-[#f1df9a] to-[#c9a227]" />
            <div className="p-8 md:p-12 lg:p-14">
              <div className="mb-6 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-[0.24em] text-[#c9a227]">Why DA Works</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#61708a]/60">Page 4</span>
              </div>
              <span className="mb-5 inline-block rounded-full border border-[#c9a227]/30 bg-[#fff6e7] px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#c9a227]">
                The DA Approach
              </span>
              <h2 className="whitespace-pre-line font-serif text-3xl font-medium leading-[1.05] tracking-[-0.03em] text-[#071629] md:text-4xl">
                {'Why do families see\nsuch meaningful\nchange at DA?'}
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[#61708a]">
                Because progress here is deliberate, individualised, and supported by care, structure, partnership, and high expectations.
              </p>
              <blockquote className="mt-6 max-w-3xl rounded-r-lg border-l-4 border-[#c9a227] bg-[#fff6e7] px-5 py-4 font-serif text-lg font-medium italic leading-snug text-[#10233f]">
                &ldquo;We are trying to strengthen the child behind the result.&rdquo;
              </blockquote>

              <div className="mt-10 grid gap-10 lg:grid-cols-2">
                <div>
                  <span className="mb-4 block h-[3px] w-20 bg-[#c9a227]" />
                  <span className="mb-3 block text-[10px] font-black uppercase tracking-[0.2em] text-[#c9a227]">Core Idea</span>
                  <p className="mb-4 text-[15px] leading-7 text-[#61708a]">
                    <span className="font-semibold text-[#10233f]">Families often see meaningful change at DA because our support is deliberate, individualised, and consistent.</span>
                  </p>
                  <p className="mb-4 text-[15px] leading-7 text-[#61708a]">
                    We do not treat progress as something generic. We look closely at the whole picture and consider what kind of guidance, structure, and accountability will help each child move forward in a meaningful way. Our work is not only to teach, but to respond wisely to what each student needs most.
                  </p>
                  <p className="text-[15px] leading-7 text-[#61708a]">
                    That is why our approach is never one-size-fits-all. Some students need patient rebuilding. Others need sharper thinking, stronger discipline, and greater refinement in order to reach the highest levels. We take both kinds of students seriously. In each case, our role is to bring direction, structure, and momentum to the growth process.
                  </p>
                </div>
                <div>
                  <div className="rounded-xl border border-[#071629]/8 bg-[#fff6e7] p-5">
                    <div className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#c9a227]">What Parents Notice</div>
                    <div className="text-[15px] font-medium leading-7 text-[#10233f]">
                      Students learn best when they feel supported enough to persist, challenged enough to grow, and engaged enough to take ownership of their progress.
                    </div>
                  </div>
                  <div className="mt-5 text-base font-semibold leading-7 text-[#071629]">
                    Meaningful change is rarely accidental. It is carefully guided.
                  </div>
                  <p className="mt-4 mb-4 text-[15px] leading-7 text-[#61708a]">
                    We are also very intentional about the way children experience learning. Students learn best when they feel supported enough to persist, challenged enough to grow, and engaged enough to take ownership of their progress. We want them to develop clarity, discipline, self-respect, and a stronger sense of purpose in their effort. That is what makes progress more lasting.
                  </p>
                  <div className="my-5 border-l-[3px] border-[#c9a227]/70 pl-4 text-[15px] italic leading-7 text-[#10233f]">
                    Progress here is not only about improvement. It is about well-guided improvement.
                  </div>
                  <p className="mb-4 text-[15px] leading-7 text-[#61708a]">
                    Another important part of the DA approach is partnership. We place great value on working closely with parents, because children grow best when the adults around them are aligned. This allows us to support each student with greater consistency and understanding over time.
                  </p>
                  <p className="text-[15px] leading-7 text-[#61708a]">
                    At the heart of it, families often see meaningful change at DA because we are committed not only to improvement, but to well-guided improvement. We are trying to strengthen the child behind the result. When that happens, academic progress often becomes both stronger and more lasting.
                  </p>
                </div>
              </div>

              <div className="mt-10 flex items-center justify-between border-t border-[#071629]/8 pt-5">
                <div className="text-base font-semibold text-[#071629]">The care, structure, and consistency behind progress</div>
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#61708a]/60">DA Tuition</div>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* Page 5: The Teacher I Hope To Be */}
      <Reveal>
        <section className="bg-[#fffdf8] px-5 py-16 lg:px-8">
          <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-[#071629]/8 bg-white shadow-lg shadow-[#071629]/5">
            <div className="h-1 bg-gradient-to-r from-[#c9a227] via-[#f1df9a] to-[#c9a227]" />
            <div className="p-8 md:p-12 lg:p-14">
              <div className="mb-6 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-[0.24em] text-[#c9a227]">The Teacher I Hope To Be</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#61708a]/60">Page 5</span>
              </div>
              <span className="mb-5 inline-block rounded-full border border-[#c9a227]/30 bg-[#fff6e7] px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#c9a227]">
                Lasting Imprint
              </span>
              <h2 className="whitespace-pre-line font-serif text-3xl font-medium leading-[1.05] tracking-[-0.03em] text-[#071629] md:text-4xl">
                {'What kind of teacher\ndo you want your\nstudents to remember\nyou as?'}
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[#61708a]">
                A teacher who cared deeply, treated them with kindness, and never took their potential lightly.
              </p>
              <blockquote className="mt-6 max-w-3xl rounded-r-lg border-l-4 border-[#c9a227] bg-[#fff6e7] px-5 py-4 font-serif text-lg font-medium italic leading-snug text-[#10233f]">
                &ldquo;I do not only want students to remember what they learned from me. I want them to remember how they were treated, what was strengthened in them, and who they became while they were under my care.&rdquo;
              </blockquote>

              <div className="mt-10 grid gap-10 lg:grid-cols-2">
                <div>
                  <span className="mb-4 block h-[3px] w-20 bg-[#c9a227]" />
                  <span className="mb-3 block text-[10px] font-black uppercase tracking-[0.2em] text-[#c9a227]">Core Idea</span>
                  <p className="mb-4 text-[15px] leading-7 text-[#61708a]">
                    <span className="font-semibold text-[#10233f]">I hope my students remember me as a teacher who cared for them deeply, treated them with kindness, and never took their potential lightly.</span>
                  </p>
                  <p className="mb-4 text-[15px] leading-7 text-[#61708a]">
                    More than anything, I would want them to feel safe in my care.
                  </p>
                  <p className="mb-4 text-[15px] leading-7 text-[#61708a]">
                    I would want them to know that they were never reduced to a mark, a weakness, or a difficult season. There is often far more in a child than is visible at first, and I would hope my students felt that I recognised that with patience, honesty, and genuine belief.
                  </p>
                  <div className="my-5 border-l-[3px] border-[#c9a227]/70 pl-4 text-[15px] italic leading-7 text-[#10233f]">
                    Safe, seen, and strengthened by both warmth and clear expectations.
                  </div>
                  <p className="text-[15px] leading-7 text-[#61708a]">
                    I hope they remember me as someone who offered both warmth and steadiness. I believe children need gentleness, but they also need clear expectations. They need encouragement, but they also need someone willing to ask more of them because they are worth that effort. Not out of harshness, but out of sincere belief that their future matters and that they are capable of more than they may currently see in themselves.
                  </p>
                </div>
                <div>
                  <div className="rounded-xl border border-[#071629]/8 bg-[#fff6e7] p-5">
                    <div className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#c9a227]">Lasting Honour</div>
                    <div className="text-[15px] font-medium leading-7 text-[#10233f]">
                      If, years from now, my students remember me as someone who believed in them when they could not yet do that well for themselves, someone who lifted their standards with kindness, and someone who helped expand what they believed was possible for their life, I would consider that one of the greatest honours of my life.
                    </div>
                  </div>
                  <div className="mt-5 text-base font-semibold leading-7 text-[#071629]">
                    The deepest imprint of teaching is often who a child becomes while learning.
                  </div>
                  <p className="mt-4 mb-4 text-[15px] leading-7 text-[#61708a]">
                    I would also hope they remember me as a teacher who helped them grow not only in knowledge, but in character. Someone who helped them become more disciplined, more resilient, more thoughtful, and more assured in themselves. To me, teaching has never only been about content. It is about helping a young person develop the inner strength, judgment, and self-belief that will serve them long after they leave the classroom.
                  </p>
                  <p className="mb-5 text-[15px] leading-7 text-[#61708a]">
                    Because in the end, I do not only want students to remember what they learned from me. I want them to remember how they were treated, what was strengthened in them, and who they became while they were under my care.
                  </p>
                  <div className="rounded-xl border-l-[6px] border-[#c9a227] bg-[#fff6e7] p-5 shadow-sm">
                    <div className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#c9a227]">DA Philosophy</div>
                    <div className="text-base font-medium leading-7 text-[#10233f]">
                      When children are supported with care, clarity, and high expectations, they begin to rise in ways that can shape their future.
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex items-center justify-between border-t border-[#071629]/8 pt-5">
                <div className="text-base font-semibold text-[#071629]">The kind of teacher I hope to remain in their memory</div>
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#61708a]/60">DA Tuition</div>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── Closing CTA ── */}
      <section className="bg-[#071629] px-5 py-20 text-white lg:px-8">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/12 bg-white/[0.06] px-6 py-12 text-center sm:px-12">
          <Quote className="mx-auto mb-6 h-8 w-8 text-[#c9a227]" />
          <p className="mb-8 font-serif text-xl font-medium leading-relaxed text-white sm:text-2xl">
            Interested in learning more about DA Tuition?
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/interview"
              className="inline-flex items-center justify-center rounded-full bg-[#c9a227] px-8 py-3 text-sm font-bold text-[#101521] transition-colors hover:bg-[#f1df9a]"
            >
              Read the Full Interview
            </Link>
            <a
              href="tel:0401940207"
              className="inline-flex items-center justify-center rounded-full border border-white/25 px-8 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10"
            >
              Book an Interview — 0401 940 207
            </a>
          </div>
        </div>
      </section>

      <FooterNew />
    </div>
  );
};

export default PrincipalReflections;
