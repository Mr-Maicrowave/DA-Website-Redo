import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';

// ─── Palette & typography ──────────────────────────────────────────────────────
const C = {
  navy:       '#0A1B34',
  navyDark:   '#060F1E',
  gold:       '#D4AF37',
  cream:      '#F7F4EE',
  creamDeep:  '#EDE5D4',
  white:      '#FFFFFF',
  muted:      'rgba(10,27,52,0.52)',
  goldBorder: 'rgba(212,175,55,0.22)',
  navyBorder: 'rgba(10,27,52,0.10)',
} as const;
const serif = "'Cormorant Garamond', Georgia, serif";
const sans  = "'DM Sans', 'Inter', sans-serif";
const wrap: React.CSSProperties = { maxWidth: 860, margin: '0 auto', padding: '0 clamp(20px,4vw,48px)' };
const wrapWide: React.CSSProperties = { maxWidth: 1100, margin: '0 auto', padding: '0 clamp(20px,4vw,48px)' };

// ─── Selected Conversations ────────────────────────────────────────────────────
const CONVERSATIONS = [
  {
    n: '01',
    q: 'Why did you start DA Tuition?',
    a: `From the very beginning, my vision has always been to create a place where every child feels seen, valued, and capable of achieving their fullest potential. Witnessing so many children lose confidence due to feeling unsupported or overwhelmed inspired me to build something different.

I dreamed of a nurturing environment where students could rediscover their voice, believe in themselves, and transform impossibilities into achievements. Our mission has always been to walk alongside students on their journey — helping them overcome challenges while knowing they are never alone.`,
    pull: 'Every child deserves to feel seen, valued, and capable of achieving their fullest potential.',
  },
  {
    n: '02',
    q: 'What makes DA different?',
    a: `What makes DA truly special is the heart behind everything we do — the incredible teachers and the genuine care we pour into every child's journey.

With over 20 years of teaching experience, I've learned that every child is unique. We meet them where they are, celebrate their wins, guide them through challenges, and remind them every day that they are capable of extraordinary things. We don't believe in one-size-fits-all methods. Instead, we personalise every class to address the student's specific needs — building a strong foundation and lasting confidence, not just marks on a report.`,
    pull: 'We meet them where they are, celebrate their wins, and guide them through challenges.',
  },
  {
    n: '03',
    q: 'How do you decide what is right for a child?',
    a: `When a student joins DA, we take the time to really get to know them — their strengths, their challenges, their goals, and the ways they learn best. It is never just about academics. We want them to feel confident, curious, and genuinely excited to be in the room.

Together, we set realistic milestones and work toward them step by step. As students grow, we adapt to their needs — making sure they stay on track and continue to progress. The placement is never fixed. If a student has outgrown their group, or if a different environment would serve them better, we say so. We do not wait to be asked.`,
    pull: 'The placement is never fixed. We adapt as students grow.',
  },
  {
    n: '04',
    q: 'What do students need most to succeed today?',
    a: `Today's students face immense pressure — high expectations, constant comparison, and a world that moves faster than ever. Many struggle with self-doubt, fear of failure, and the quiet exhaustion of trying to keep up with everything at once.

To succeed in this environment, students need more than content knowledge. They need to be emotionally and mentally steady. That is why we make it a point in every lesson to help students build the confidence and resilience required to face challenges head-on. Knowing someone genuinely believes in you — that is often the difference between a student who pushes through and one who quietly gives up.`,
    pull: 'Knowing someone genuinely believes in you — that is often the difference.',
  },
  {
    n: '05',
    q: 'What legacy do you hope DA leaves behind?',
    a: `I don't expect anyone to remember me personally. What I hope they'll remember is the heart of this place — the team of teachers who came together with a shared belief: that every child deserves someone who truly believes in them.

Fifty years from now, I dream that the children we've helped will go out into the world as compassionate, capable individuals — carrying with them the values we tried to instil. A big heart. A willingness to make a difference. And the courage to help others wholeheartedly, just as we once did for them.`,
    pull: "What I hope they'll remember is the heart of this place.",
  },
];

// ─── More Conversations ────────────────────────────────────────────────────────
const MORE_CONVERSATIONS = [
  {
    n: '06',
    q: 'How do you ensure the quality of teaching at DA?',
    a: `I hold our teachers to the highest standards — and they hold themselves to an even higher one. Our teachers undergo an extensive screening and training process before joining us. But beyond their qualifications, it is their heart and dedication that define the experience a student has.

They go above and beyond to ensure each child feels supported and challenged in the right way. We provide continuous professional development and encourage genuine collaboration among our staff — because great teaching is not static. It evolves.`,
    pull: "Beyond their qualifications, it's their heart and dedication that define the experience.",
  },
  {
    n: '07',
    q: 'How does DA help students manage academic pressure?',
    a: `We know how heavy academic pressure can feel. That is why we work hard to make DA a place where students feel safe — not just supported, but genuinely understood.

We teach strategies to manage workload, break tasks into achievable steps, and focus on progress rather than perfection. But more than that, we listen. Through classes, extra help outside of sessions, or simply being there when a student needs to talk — we ensure they know they are never alone in this. Sometimes, all a child needs is someone to remind them that they are enough just as they are.`,
    pull: 'Sometimes, all a child needs is someone to remind them that they are enough just as they are.',
  },
  {
    n: '08',
    q: 'What does a typical student journey look like at DA?',
    a: `When a student joins, we take the time to genuinely understand them — not just their current results, but who they are as a learner. From there, we work together to set realistic milestones and pursue them step by step.

As students grow, we adapt to their needs. Some students stay in the same format for years. Others move between programs as their confidence and capability evolve. By the time students leave DA, they are not only better learners — they are more confident and more capable individuals, ready to face whatever comes next.`,
    pull: 'By the time students leave, they are not only better learners — they are more capable individuals.',
  },
  {
    n: '09',
    q: 'DA has received an extraordinary number of heartfelt reviews. What resonates most with families?',
    a: `It is deeply humbling to read the words families share with us. What strikes me most is that the reviews rarely focus on results alone. They speak about how their child became happier, more motivated, more willing to try. They speak about teachers who stayed up late, who went beyond what was asked of them, who genuinely cared.

For us, these students are never numbers or outcomes. They are individuals with dreams, fears, and limitless potential. Helping them unlock that potential is a privilege. And when a parent writes to tell us their child is now proud of themselves — that is the most meaningful reward we could ever receive.`,
    pull: 'These students are never numbers or outcomes. They are individuals with limitless potential.',
  },
  {
    n: '10',
    q: 'What does it take to be a successful student in 2026?',
    a: `Adaptability. Critical thinking. And above all, emotional and mental steadiness. The academic demands students face today are significant — but the internal demands are even greater.

We know that emotions can take over and affect focus, motivation, and self-belief. That is why every lesson at DA is designed not just to deliver content, but to build the inner strength students need to face what comes next — in the examination room, and well beyond it.`,
    pull: 'Every lesson is designed to build the inner strength students need.',
  },
  {
    n: '11',
    q: 'What role do empathy and encouragement play in how you teach?',
    a: `Empathy is at the heart of everything we do. We recognise that academic challenges can feel overwhelming, and students need a safe space to express their worries without fear of judgement. Encouragement helps them see that mistakes are part of growth — building resilience and self-belief that extend far beyond the classroom.

We often remind our students that stumbling is not failure. What matters is how they rise afterward. By focusing on their strengths and helping them tackle weaknesses with patience, we instil a confidence and optimism that stays with them long after they leave us.`,
    pull: 'Stumbling is not failure. What matters is how they rise afterward.',
  },
  {
    n: '12',
    q: 'How does feedback from families guide the way DA works?',
    a: `I hold feedback in the highest regard — it is how we grow. We are truly fortunate to receive such honest and open insights from both parents and students.

Parents often share how their children have become more confident, more focused, and genuinely happier. Students share experiences that offer insights or suggest adjustments that better align with how they learn. Each piece of feedback guides us to refine our approach and explore new ways to serve our students better. To us, feedback is our promise to continuously create the best possible environment for every child.`,
    pull: 'Feedback is our promise to continuously create the best possible environment for every child.',
  },
  {
    n: '13',
    q: 'How can parents and teachers work together to achieve the best outcomes?',
    a: `Education works best when parents, teachers, and students move in the same direction. Regular communication and honest dialogue help everyone stay aligned on goals and strategies — creating a foundation for real, sustained progress.

Whether it is working through academic struggles or celebrating meaningful improvements, this shared effort creates a clear path forward. Our focus is always on what is best for the child. And when parents and teachers are genuinely working together, the student feels it — and rises to meet it.`,
    pull: 'When parents and teachers are genuinely working together, the student rises to meet it.',
  },
  {
    n: '14',
    q: 'What are your long-term goals for DA Tuition?',
    a: `To grow without losing the personal touch that makes this school what it is. We aim to reach more students, deepen our programs, and remain adaptable to the evolving needs of education.

But our goal has never changed: to make a lasting difference in the life of every child who comes through our doors. More resources, more reach — always in service of that same purpose.`,
    pull: 'More resources, more reach — always in service of the same purpose.',
  },
  {
    n: '15',
    q: 'What do you find most rewarding about leading DA?',
    a: `The transformation in a child's eyes when they realise they are capable, valued, and supported. That moment — when a student who once believed they could not do something finally sees that they can — is the most profound thing I have ever witnessed.

There are moments when I hear about our staff staying up late, preparing materials, writing personal notes of encouragement to their students. While I gently remind them to maintain balance, their willingness to go the extra mile fills me with immense pride. These selfless acts are a reflection of who they are — and why this school is what it is.`,
    pull: "The moment a student who believed they couldn't finally sees that they can.",
  },
  {
    n: '16',
    q: 'Can you share a story of a student whose life changed at DA?',
    a: `One story that still moves me deeply is a student who came to us struggling with self-doubt and low grades. He felt defeated — like he simply could not measure up to his peers. Through consistent guidance, encouragement, and many honest conversations, we began to see a transformation.

That student not only improved academically but blossomed into a confident, motivated individual. Today, he is a specialist doctor. His parents still write to us, thanking our team for believing in their child when it mattered most. Stories like these remind us why we do what we do.`,
    pull: 'His parents still write to us, thanking our team for believing in their child when it mattered most.',
  },
];

// ─── Why Families Component ────────────────────────────────────────────────────
const WHY_CARDS = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="13" stroke="currentColor" strokeWidth="1.2" />
        <path d="M14 8v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="14" cy="19" r="1" fill="currentColor" />
      </svg>
    ),
    n: '01',
    h: 'Major Confidence Concerns',
    b: 'When a child no longer believes in their own ability. These conversations require more than a standard placement meeting — they benefit from the insight and care Amanda brings personally.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="1" y="1" width="26" height="26" rx="2" stroke="currentColor" strokeWidth="1.2" />
        <path d="M7 14h14M7 9h9M7 19h11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
    n: '02',
    h: 'Significant Learning Gaps',
    b: "When parents need clarity on the best pathway forward. Amanda's direct involvement helps families understand their options clearly — without the pressure of a standard enrolment process.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 3L3 10v8l11 7 11-7v-8L14 3z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M14 3v17M3 10l11 7 11-7" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
    ),
    n: '03',
    h: 'Important Academic Decisions',
    b: 'Subject selection, acceleration pathways and HSC planning. When the decisions a family makes in the next six months will shape the next six years, it is worth speaking with someone who has navigated these crossroads many times.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="10" r="5" stroke="currentColor" strokeWidth="1.2" />
        <path d="M5 24c0-4.418 4.03-8 9-8s9 3.582 9 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M20 13l2 2 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    n: '04',
    h: 'Complex Learning Situations',
    b: 'When a deeper understanding is needed before recommending a program. Some students do not fit neatly into an enrolment category. These are the conversations Amanda finds most meaningful.',
  },
];

function WhyFamilies() {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <section style={{ background: C.creamDeep, padding: 'clamp(80px,10vw,130px) 0' }}>
      <div style={wrapWide}>
        {/* Header */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 'clamp(40px,6vw,80px)', alignItems: 'end', marginBottom: 64 }}>
          <div>
            <p style={{ fontFamily: sans, fontSize: 9, fontWeight: 700, letterSpacing: '0.26em', color: C.gold, textTransform: 'uppercase' as const, marginBottom: 16 }}>
              A Considered Conversation
            </p>
            <div style={{ width: 32, height: 1, background: C.gold, marginBottom: 20 }} />
            <h2 style={{ fontFamily: serif, fontSize: 'clamp(28px,4vw,52px)', fontWeight: 400, color: C.navy, lineHeight: 1.08 }}>
              Why Some Families<br />
              Meet With Amanda<br />
              <em style={{ color: C.gold }}>Personally</em>
            </h2>
          </div>
          <div>
            <p style={{ fontFamily: sans, fontSize: 15, color: C.muted, lineHeight: 1.85, marginBottom: 16 }}>
              Most families never need a Principal Interview. For those who do, it tends to be one of the most valuable conversations they have.
            </p>
            <p style={{ fontFamily: sans, fontSize: 15, color: C.muted, lineHeight: 1.85 }}>
              The four situations below are the ones Amanda most commonly steps into — not because a standard enrolment is insufficient, but because the situation genuinely calls for something more.
            </p>
          </div>
        </div>

        {/* Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 'clamp(10px,1.5vw,16px)' }}>
          {WHY_CARDS.map((card, i) => {
            const isHovered = hovered === i;
            return (
              <div
                key={i}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background: isHovered ? C.navy : C.white,
                  border: `1px solid ${isHovered ? C.navy : C.navyBorder}`,
                  borderRadius: 4,
                  padding: 'clamp(24px,3vw,36px)',
                  cursor: 'default',
                  transition: 'background 0.3s ease, border-color 0.3s ease',
                  display: 'flex', flexDirection: 'column' as const, gap: 0,
                }}
              >
                {/* Icon */}
                <div style={{
                  color: isHovered ? C.gold : C.navy,
                  opacity: isHovered ? 1 : 0.35,
                  marginBottom: 24,
                  transition: 'color 0.3s ease, opacity 0.3s ease',
                }}>
                  {card.icon}
                </div>

                {/* Number */}
                <p style={{
                  fontFamily: serif, fontSize: 12, fontStyle: 'italic',
                  color: isHovered ? C.gold : C.muted,
                  marginBottom: 12,
                  transition: 'color 0.3s ease',
                }}>
                  {card.n}
                </p>

                {/* Heading */}
                <h3 style={{
                  fontFamily: sans, fontSize: 'clamp(14px,1.4vw,16px)', fontWeight: 700,
                  color: isHovered ? C.white : C.navy,
                  lineHeight: 1.4, marginBottom: 14,
                  transition: 'color 0.3s ease',
                }}>
                  {card.h}
                </h3>

                {/* Divider */}
                <div style={{
                  width: isHovered ? 32 : 16, height: 1,
                  background: isHovered ? C.gold : C.navyBorder,
                  marginBottom: 16,
                  transition: 'width 0.3s ease, background 0.3s ease',
                }} />

                {/* Body */}
                <p style={{
                  fontFamily: sans, fontSize: 13,
                  color: isHovered ? 'rgba(255,255,255,0.60)' : C.muted,
                  lineHeight: 1.8, flex: 1,
                  transition: 'color 0.3s ease',
                }}>
                  {card.b}
                </p>
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <div style={{ marginTop: 48, display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ height: 1, flex: 1, background: C.navyBorder }} />
          <p style={{ fontFamily: serif, fontSize: 15, fontStyle: 'italic', color: C.muted, flexShrink: 0 }}>
            A Principal Interview is not a standard enrolment meeting.
          </p>
          <div style={{ height: 1, flex: 1, background: C.navyBorder }} />
        </div>
      </div>
    </section>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
const Interview: React.FC = () => {
  const [open, setOpen] = useState<number | null>(null);
  const [moreExpanded, setMoreExpanded] = useState(false);
  const [moreOpen, setMoreOpen] = useState<number | null>(null);

  return (
    <div className="min-h-screen" style={{ background: C.cream }}>
      <SEO
        title="A Conversation With Amanda — DA Tuition"
        description="Founder and Principal of DA Tuition. Speaking directly with Amanda is rare — reserved for families who require deeper educational guidance."
        canonicalUrl="/interview"
      />
      <NavigationNew />

      {/* ── 1. Hero ──────────────────────────────────────────────────────────── */}
      <section style={{ background: C.navy, minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative ruled lines */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 1, height: '100%', background: 'rgba(212,175,55,0.06)' }} />
          <div style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: 1, background: 'rgba(212,175,55,0.04)' }} />
          <div style={{ position: 'absolute', bottom: 60, left: 0, width: '100%', height: 1, background: 'rgba(212,175,55,0.06)' }} />
          <div style={{ position: 'absolute', top: 60, left: 0, width: '100%', height: 1, background: 'rgba(212,175,55,0.06)' }} />
        </div>

        <div style={{ width: '100%', padding: 'clamp(120px,14vw,160px) clamp(24px,6vw,80px) clamp(100px,12vw,140px)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1px 1fr', gap: 0, alignItems: 'center' }}>

            {/* Left — identity */}
            <div style={{ paddingRight: 'clamp(40px,6vw,80px)' }}>
              <p style={{ fontFamily: sans, fontSize: 9, fontWeight: 700, letterSpacing: '0.28em', color: C.gold, textTransform: 'uppercase' as const, marginBottom: 32 }}>
                The Principal Interview
              </p>
              <h1 style={{ fontFamily: serif, fontSize: 'clamp(44px,6vw,84px)', fontWeight: 400, color: C.white, lineHeight: 1.04, marginBottom: 0 }}>
                A Conversation<br />
                With Our<br />
                <em style={{ color: C.gold }}>Founder.</em>
              </h1>
            </div>

            {/* Vertical divider */}
            <div style={{ width: 1, alignSelf: 'stretch', background: 'rgba(212,175,55,0.14)', margin: '0' }} />

            {/* Right — context + CTAs */}
            <div style={{ paddingLeft: 'clamp(40px,6vw,80px)' }}>
              <p style={{ fontFamily: sans, fontSize: 15, color: 'rgba(255,255,255,0.60)', lineHeight: 1.85, marginBottom: 12 }}>
                Most families begin with our enrolment team.
              </p>
              <p style={{ fontFamily: sans, fontSize: 15, color: 'rgba(255,255,255,0.42)', lineHeight: 1.85, marginBottom: 48 }}>
                Occasionally, Amanda personally meets with families when deeper educational guidance is required.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 12, alignItems: 'flex-start' }}>
                <a href="#request">
                  <button style={{
                    padding: '14px 32px',
                    background: C.gold, color: C.navy,
                    fontFamily: sans, fontSize: 11, fontWeight: 700, letterSpacing: '0.10em',
                    textTransform: 'uppercase' as const, border: 'none', borderRadius: 2, cursor: 'pointer',
                  }}>
                    Request A Principal Interview
                  </button>
                </a>
                <a href="#amanda">
                  <button style={{
                    padding: '14px 32px',
                    background: 'transparent', color: 'rgba(255,255,255,0.55)',
                    fontFamily: sans, fontSize: 11, fontWeight: 600, letterSpacing: '0.10em',
                    textTransform: 'uppercase' as const,
                    border: '1px solid rgba(255,255,255,0.15)', borderRadius: 2, cursor: 'pointer',
                  }}>
                    Meet Amanda
                  </button>
                </a>
              </div>

              <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                <p style={{ fontFamily: sans, fontSize: 11, color: 'rgba(255,255,255,0.22)', letterSpacing: '0.08em', lineHeight: 1.7 }}>
                  DA Tuition · Canley Heights · Founded 2005<br />20+ Years · 650+ Students
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 2. Founder Profile ───────────────────────────────────────────────── */}
      <section id="amanda" style={{ background: C.cream }}>
        <div style={{ maxWidth: 1300, margin: '0 auto', display: 'grid', gridTemplateColumns: '420px 1fr' }}>

          {/* Left — portrait */}
          <div style={{ position: 'relative', minHeight: 680 }}>
            <img
              src="/images/v3/smiling_teacher.jpg"
              alt="Amanda Le — Founder and Principal, DA Tuition"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
            />
            {/* Gradient overlay at bottom for name plate */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '45%', background: 'linear-gradient(to top, rgba(10,27,52,0.92) 0%, transparent 100%)' }} />
            {/* Name plate */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 'clamp(24px,3vw,40px)' }}>
              <div style={{ width: 28, height: 1, background: C.gold, marginBottom: 12 }} />
              <p style={{ fontFamily: serif, fontSize: 'clamp(22px,2.5vw,30px)', fontWeight: 400, color: C.white, lineHeight: 1.2, marginBottom: 4 }}>
                Amanda Le
              </p>
              <p style={{ fontFamily: sans, fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', color: C.gold, textTransform: 'uppercase' as const }}>
                Founder & Principal · DA Tuition
              </p>
            </div>
          </div>

          {/* Right — biography */}
          <div style={{ padding: 'clamp(52px,7vw,96px) clamp(40px,5vw,80px)', display: 'flex', flexDirection: 'column' as const, justifyContent: 'center' }}>

            {/* Eyebrow */}
            <p style={{ fontFamily: sans, fontSize: 9, fontWeight: 700, letterSpacing: '0.26em', color: C.gold, textTransform: 'uppercase' as const, marginBottom: 20 }}>
              Founder Profile
            </p>

            {/* Name & title */}
            <h2 style={{ fontFamily: serif, fontSize: 'clamp(36px,5vw,64px)', fontWeight: 400, color: C.navy, lineHeight: 1.06, marginBottom: 28 }}>
              Amanda Le
            </h2>
            <p style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', color: C.muted, textTransform: 'uppercase' as const, marginBottom: 36 }}>
              Founder & Principal — DA Tuition
            </p>

            {/* Credentials */}
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 14, marginBottom: 44, paddingBottom: 44, borderBottom: `1px solid ${C.navyBorder}` }}>
              {[
                ['20+ Years', 'In education — teaching, mentoring and leading'],
                ['Founder', 'Established DA Tuition in 2005 in Canley Heights, NSW'],
                ['650+ Students', 'Families served across Western Sydney since founding'],
                ['Award Recognised', 'Outstanding Education Service — Fairfield City Business Awards 2025'],
              ].map(([label, detail]) => (
                <div key={label} style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: 16, alignItems: 'baseline' }}>
                  <p style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, color: C.navy }}>{label}</p>
                  <p style={{ fontFamily: sans, fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{detail}</p>
                </div>
              ))}
            </div>

            {/* Philosophy */}
            <div style={{ marginBottom: 44 }}>
              <p style={{ fontFamily: sans, fontSize: 9, fontWeight: 700, letterSpacing: '0.20em', color: C.gold, textTransform: 'uppercase' as const, marginBottom: 14 }}>
                Personal Philosophy
              </p>
              <p style={{ fontFamily: sans, fontSize: 14, color: C.muted, lineHeight: 1.85, marginBottom: 14 }}>
                Amanda founded DA Tuition with a single conviction: most tutoring centres were solving the wrong problem. They focused on content delivery. She wanted to focus on the student.
              </p>
              <p style={{ fontFamily: sans, fontSize: 14, color: C.muted, lineHeight: 1.85 }}>
                DA grew from that belief — a school that assesses before recommending, matches teachers deliberately, and measures success not in marks alone, but in the confidence a student carries into an examination room.
              </p>
            </div>

            {/* Pull quote */}
            <div style={{ position: 'relative', paddingLeft: 28 }}>
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, background: C.gold, borderRadius: 1 }} />
              <p style={{ fontFamily: serif, fontSize: 'clamp(18px,2.2vw,26px)', fontStyle: 'italic', color: C.navy, lineHeight: 1.5, marginBottom: 16 }}>
                "Every child deserves to feel seen, valued and capable of achieving their fullest potential."
              </p>
              <p style={{ fontFamily: sans, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: C.gold, textTransform: 'uppercase' as const }}>
                Amanda Le — Founder, DA Tuition
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── 3. Why Some Families ─────────────────────────────────────────────── */}
      <WhyFamilies />

      {/* ── 4. Selected Conversations ────────────────────────────────────────── */}
      <section style={{ background: C.cream, padding: 'clamp(80px,10vw,130px) 0' }}>
        <div style={wrap}>
          <div style={{ marginBottom: 56 }}>
            <p style={{ fontFamily: sans, fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', color: C.gold, textTransform: 'uppercase', marginBottom: 12 }}>
              Selected Conversations
            </p>
            <div style={{ width: 32, height: 1, background: C.gold, marginBottom: 20 }} />
            <h2 style={{ fontFamily: serif, fontSize: 'clamp(28px,4vw,48px)', fontWeight: 400, color: C.navy, lineHeight: 1.15, marginBottom: 16 }}>
              Five Questions.<br />
              <em style={{ color: C.gold }}>Her Own Words.</em>
            </h2>
            <p style={{ fontFamily: sans, fontSize: 14, color: C.muted, lineHeight: 1.75 }}>
              From a longer conversation. Selected for what they reveal about how Amanda thinks.
            </p>
          </div>

          <div style={{ borderTop: `1px solid ${C.navyBorder}` }}>
            {CONVERSATIONS.map((conv, i) => (
              <div key={i} style={{ borderBottom: `1px solid ${C.navyBorder}` }}>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: 'clamp(20px,3vw,28px) 0', display: 'flex', alignItems: 'flex-start', gap: 20, textAlign: 'left' }}
                >
                  <span style={{ fontFamily: serif, fontSize: 13, color: open === i ? C.gold : C.muted, fontStyle: 'italic', minWidth: 28, paddingTop: 3, flexShrink: 0 }}>{conv.n}</span>
                  <p style={{ fontFamily: serif, fontSize: 'clamp(16px,2vw,20px)', fontStyle: 'italic', color: C.navy, fontWeight: 400, lineHeight: 1.4, flex: 1 }}>
                    {conv.q}
                  </p>
                  <span style={{ fontFamily: sans, fontSize: 20, color: open === i ? C.gold : C.muted, fontWeight: 300, flexShrink: 0, lineHeight: 1 }}>
                    {open === i ? '×' : '+'}
                  </span>
                </button>

                <AnimatePresence>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{ paddingBottom: 36, paddingLeft: 48 }}>
                        {conv.a.split('\n\n').map((para, pi) => (
                          <p key={pi} style={{ fontFamily: sans, fontSize: 14, color: C.muted, lineHeight: 1.85, marginBottom: pi < conv.a.split('\n\n').length - 1 ? 16 : 0 }}>
                            {para}
                          </p>
                        ))}
                        {conv.pull && (
                          <div style={{ marginTop: 28, paddingLeft: 20, borderLeft: `2px solid ${C.goldBorder}` }}>
                            <p style={{ fontFamily: serif, fontSize: 'clamp(17px,2vw,22px)', fontStyle: 'italic', color: C.navy, lineHeight: 1.5 }}>
                              "{conv.pull}"
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* ── More Conversations ─────────────────────────────────────────────── */}
          <div style={{ marginTop: 48 }}>
            <button
              onClick={() => { setMoreExpanded(!moreExpanded); setMoreOpen(null); }}
              style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'none', border: 'none', cursor: 'pointer', padding: '16px 0', width: '100%' }}
            >
              <div style={{ flex: 1, height: 1, background: C.navyBorder }} />
              <p style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: moreExpanded ? C.gold : C.muted, textTransform: 'uppercase', whiteSpace: 'nowrap', flexShrink: 0 }}>
                {moreExpanded ? 'Close' : 'More Conversations With Amanda'}
              </p>
              <span style={{ fontFamily: sans, fontSize: 18, color: moreExpanded ? C.gold : C.muted, fontWeight: 300, flexShrink: 0 }}>
                {moreExpanded ? '×' : '+'}
              </span>
              <div style={{ flex: 1, height: 1, background: C.navyBorder }} />
            </button>

            <AnimatePresence>
              {moreExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{ borderTop: `1px solid ${C.navyBorder}`, marginTop: 8 }}>
                    {MORE_CONVERSATIONS.map((conv, i) => (
                      <div key={i} style={{ borderBottom: `1px solid ${C.navyBorder}` }}>
                        <button
                          onClick={() => setMoreOpen(moreOpen === i ? null : i)}
                          style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: 'clamp(20px,3vw,28px) 0', display: 'flex', alignItems: 'flex-start', gap: 20, textAlign: 'left' }}
                        >
                          <span style={{ fontFamily: serif, fontSize: 13, color: moreOpen === i ? C.gold : C.muted, fontStyle: 'italic', minWidth: 28, paddingTop: 3, flexShrink: 0 }}>{conv.n}</span>
                          <p style={{ fontFamily: serif, fontSize: 'clamp(16px,2vw,20px)', fontStyle: 'italic', color: C.navy, fontWeight: 400, lineHeight: 1.4, flex: 1 }}>
                            {conv.q}
                          </p>
                          <span style={{ fontFamily: sans, fontSize: 20, color: moreOpen === i ? C.gold : C.muted, fontWeight: 300, flexShrink: 0, lineHeight: 1 }}>
                            {moreOpen === i ? '×' : '+'}
                          </span>
                        </button>

                        <AnimatePresence>
                          {moreOpen === i && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              style={{ overflow: 'hidden' }}
                            >
                              <div style={{ paddingBottom: 36, paddingLeft: 48 }}>
                                {conv.a.split('\n\n').map((para, pi) => (
                                  <p key={pi} style={{ fontFamily: sans, fontSize: 14, color: C.muted, lineHeight: 1.85, marginBottom: pi < conv.a.split('\n\n').length - 1 ? 16 : 0 }}>
                                    {para}
                                  </p>
                                ))}
                                {conv.pull && (
                                  <div style={{ marginTop: 28, paddingLeft: 20, borderLeft: `2px solid ${C.goldBorder}` }}>
                                    <p style={{ fontFamily: serif, fontSize: 'clamp(17px,2vw,22px)', fontStyle: 'italic', color: C.navy, lineHeight: 1.5 }}>
                                      "{conv.pull}"
                                    </p>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* ── 5. What Happens During A Principal Interview ──────────────────────── */}
      <section style={{ background: C.navy, padding: 'clamp(80px,10vw,130px) 0', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative ruled lines */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{ position: 'absolute', top: `${10 + i * 16}%`, left: 0, right: 0, height: 1, background: 'rgba(212,175,55,0.04)' }} />
          ))}
        </div>

        <div style={wrap}>
          {/* Header */}
          <div style={{ marginBottom: 'clamp(56px,8vw,96px)', textAlign: 'center' }}>
            <p style={{ fontFamily: sans, fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', color: C.gold, textTransform: 'uppercase' as const, marginBottom: 14 }}>
              The Process
            </p>
            <div style={{ width: 32, height: 1, background: C.gold, margin: '0 auto 24px' }} />
            <h2 style={{ fontFamily: serif, fontSize: 'clamp(28px,4vw,52px)', fontWeight: 400, color: C.white, lineHeight: 1.12 }}>
              What Happens During<br />
              <em style={{ color: C.gold }}>A Principal Interview?</em>
            </h2>
          </div>

          {/* Vertical Journey */}
          <div style={{ position: 'relative', maxWidth: 600, margin: '0 auto' }}>
            {/* Continuous spine line */}
            <div style={{ position: 'absolute', left: 19, top: 28, bottom: 28, width: 1, background: 'linear-gradient(180deg, rgba(212,175,55,0.6) 0%, rgba(212,175,55,0.15) 100%)' }} />

            {[
              { n: '01', title: 'Understand Your Child', desc: 'Amanda begins by listening — to you, and to what you share about your child. No agenda. No assumptions.' },
              { n: '02', title: 'Discuss Strengths & Challenges', desc: 'Together, you explore what your child does well and where they are finding it difficult, academically and emotionally.' },
              { n: '03', title: 'Explore Goals', desc: 'Short-term targets and longer-term aspirations are considered side by side — what matters to your family, not a generic outcome.' },
              { n: '04', title: 'Review Suitable Pathways', desc: 'Amanda walks you through the options that genuinely fit your child\'s profile. She does not present everything — only what is relevant.' },
              { n: '05', title: 'Receive Honest Recommendations', desc: 'You receive a direct, considered view. If DA is the right environment, she will say so. If it is not, she will say that too.' },
              { n: '06', title: 'Plan The Next Steps', desc: 'The conversation closes with a clear path forward — whether that is enrolment, further assessment, or simply knowing what to do next.' },
            ].map((step, i, arr) => (
              <div key={i} style={{ display: 'flex', gap: 32, marginBottom: i < arr.length - 1 ? 48 : 0, position: 'relative' }}>
                {/* Node */}
                <div style={{ flexShrink: 0, width: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 4 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    border: `1px solid rgba(212,175,55,0.55)`,
                    background: 'rgba(212,175,55,0.07)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <span style={{ fontFamily: serif, fontSize: 12, fontStyle: 'italic', color: C.gold }}>{step.n}</span>
                  </div>
                </div>

                {/* Content */}
                <div style={{ paddingTop: 8, paddingBottom: 4 }}>
                  <p style={{ fontFamily: serif, fontSize: 'clamp(18px,2.2vw,24px)', fontWeight: 400, color: C.white, lineHeight: 1.2, marginBottom: 10 }}>
                    {step.title}
                  </p>
                  <p style={{ fontFamily: sans, fontSize: 13, color: 'rgba(247,244,238,0.52)', lineHeight: 1.8 }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Final statement */}
          <div style={{ marginTop: 'clamp(64px,9vw,104px)', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, justifyContent: 'center', marginBottom: 28 }}>
              <div style={{ flex: 1, maxWidth: 80, height: 1, background: 'rgba(212,175,55,0.3)' }} />
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.gold, opacity: 0.6 }} />
              <div style={{ flex: 1, maxWidth: 80, height: 1, background: 'rgba(212,175,55,0.3)' }} />
            </div>
            <p style={{ fontFamily: serif, fontSize: 'clamp(22px,3vw,38px)', fontWeight: 400, color: C.white, lineHeight: 1.3 }}>
              This is not an assessment.
            </p>
            <p style={{ fontFamily: serif, fontSize: 'clamp(22px,3vw,38px)', fontWeight: 400, fontStyle: 'italic', color: C.gold, lineHeight: 1.3, marginTop: 6 }}>
              It is a conversation.
            </p>
          </div>
        </div>
      </section>

      {/* ── 6. Request A Principal Interview ─────────────────────────────────── */}
      <section id="request" style={{ background: C.creamDeep, padding: 'clamp(80px,10vw,130px) 0' }}>
        <div style={wrap}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(40px,6vw,80px)', alignItems: 'start' }}>
            <div>
              <p style={{ fontFamily: sans, fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', color: C.gold, textTransform: 'uppercase', marginBottom: 12 }}>
                Request An Interview
              </p>
              <div style={{ width: 32, height: 1, background: C.gold, marginBottom: 20 }} />
              <h2 style={{ fontFamily: serif, fontSize: 'clamp(26px,3.5vw,42px)', fontWeight: 400, color: C.navy, lineHeight: 1.15, marginBottom: 20 }}>
                Speak Directly<br />
                <em style={{ color: C.gold }}>With Amanda.</em>
              </h2>
              <p style={{ fontFamily: sans, fontSize: 14, color: C.muted, lineHeight: 1.8, marginBottom: 20 }}>
                A Principal Interview is a private conversation — not a sales call. Amanda does not pitch programs or push enrolment. She listens, asks questions, and tells you honestly what she thinks.
              </p>
              <p style={{ fontFamily: sans, fontSize: 14, color: C.muted, lineHeight: 1.8 }}>
                If DA is right for your child, she will say so. If it isn't, she will say that too.
              </p>
            </div>

            <div style={{ background: C.navy, borderRadius: 4, padding: 'clamp(32px,4vw,48px)' }}>
              <p style={{ fontFamily: sans, fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', color: C.gold, textTransform: 'uppercase', marginBottom: 24 }}>
                What to expect
              </p>
              {[
                ['A private conversation', '30–45 minutes, no audience'],
                ['No obligation', 'Amanda does not close enrolments in these meetings'],
                ['Honest guidance', 'Her role is to help you find clarity, not to fill a spot'],
                ['A starting point', 'Most families leave knowing exactly what to do next'],
              ].map(([h, b]) => (
                <div key={h} style={{ display: 'flex', gap: 14, marginBottom: 20 }}>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: C.gold, flexShrink: 0, marginTop: 8 }} />
                  <div>
                    <p style={{ fontFamily: sans, fontSize: 13, fontWeight: 700, color: C.white, marginBottom: 3 }}>{h}</p>
                    <p style={{ fontFamily: sans, fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>{b}</p>
                  </div>
                </div>
              ))}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 24, marginTop: 8 }}>
                <Link to="/#contact">
                  <button style={{ width: '100%', padding: '15px 24px', background: C.gold, color: C.navy, fontFamily: sans, fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', border: 'none', borderRadius: 2, cursor: 'pointer' }}>
                    Request a Principal Interview
                  </button>
                </Link>
                <p style={{ fontFamily: sans, fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 12, textAlign: 'center', fontStyle: 'italic' }}>
                  Available by request only. Limited availability.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. Final CTA ─────────────────────────────────────────────────────── */}
      <section style={{ background: C.navy, padding: 'clamp(80px,10vw,130px) 0', textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', padding: '0 24px' }}>
          <p style={{ fontFamily: sans, fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', color: C.gold, textTransform: 'uppercase', marginBottom: 16 }}>
            The First Step
          </p>
          <div style={{ width: 32, height: 1, background: C.goldBorder, margin: '0 auto 28px' }} />
          <h2 style={{ fontFamily: serif, fontSize: 'clamp(28px,5vw,52px)', fontWeight: 400, color: C.white, lineHeight: 1.1, marginBottom: 16 }}>
            Not every family needs this.<br />
            <em style={{ color: C.gold }}>Yours might.</em>
          </h2>
          <p style={{ fontFamily: sans, fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.8, marginBottom: 36 }}>
            If you've read this far, there is probably something about your child's situation that a standard enrolment process doesn't fully address. That is exactly when Amanda speaks personally.
          </p>
          <Link to="/#contact">
            <button style={{ padding: '14px 40px', background: 'transparent', border: `1.5px solid ${C.gold}`, color: C.gold, fontFamily: sans, fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', borderRadius: 2, cursor: 'pointer' }}>
              Request An Interview
            </button>
          </Link>
          <p style={{ fontFamily: sans, fontSize: 12, color: 'rgba(255,255,255,0.22)', marginTop: 16 }}>
            No commitment. No pitch. Just a conversation.
          </p>
        </div>
      </section>

      <FooterNew />
    </div>
  );
};

export default Interview;
