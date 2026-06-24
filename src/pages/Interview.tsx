import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';

// ─── Palette & typography ──────────────────────────────────────────────────────
const C = {
  navy:       '#0A1B34',
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
const wrap: React.CSSProperties        = { maxWidth: 860, margin: '0 auto', padding: '0 clamp(20px,4vw,48px)' };
const wrapNarrow: React.CSSProperties  = { maxWidth: 660, margin: '0 auto', padding: '0 clamp(20px,4vw,48px)' };

// ─── Conversations ─────────────────────────────────────────────────────────────
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

// ─── Why Some Families ─────────────────────────────────────────────────────────
const WHY_REASONS = [
  {
    n: '01',
    h: 'Major Confidence Concerns',
    b: 'When a child no longer believes in their own ability — and a standard placement meeting will not reach the heart of it.',
  },
  {
    n: '02',
    h: 'Significant Learning Gaps',
    b: 'When the family needs to understand, clearly and honestly, what the right path forward looks like.',
  },
  {
    n: '03',
    h: 'Important Academic Decisions',
    b: 'Subject selection, acceleration, HSC strategy — when what is decided now shapes much of what follows.',
  },
  {
    n: '04',
    h: 'Complex Learning Situations',
    b: 'Some students do not fit an enrolment category. These are the conversations Amanda finds most meaningful.',
  },
];

function WhyFamilies() {
  return (
    <section style={{ background: C.creamDeep, padding: 'clamp(100px,12vw,160px) 0' }}>
      <div style={wrapNarrow}>

        {/* Header */}
        <div style={{ marginBottom: 'clamp(64px,8vw,96px)' }}>
          <p style={{ fontFamily: sans, fontSize: 9, fontWeight: 700, letterSpacing: '0.26em', color: C.gold, textTransform: 'uppercase' as const, marginBottom: 20 }}>
            A Considered Conversation
          </p>
          <h2 style={{ fontFamily: serif, fontSize: 'clamp(32px,5vw,56px)', fontWeight: 400, color: C.navy, lineHeight: 1.08, marginBottom: 28 }}>
            Why Some Families<br />
            Meet With Amanda<br />
            <em style={{ color: C.gold }}>Personally</em>
          </h2>
          <p style={{ fontFamily: sans, fontSize: 15, color: C.muted, lineHeight: 1.9 }}>
            Most families never need this. For those who do, it tends to be one of the most valuable conversations they have.
          </p>
        </div>

        {/* Reasons — typeset list, no cards */}
        {WHY_REASONS.map((item, i, arr) => (
          <div
            key={i}
            style={{
              borderTop: `1px solid ${C.navyBorder}`,
              padding: 'clamp(32px,4vw,52px) 0',
              ...(i === arr.length - 1 ? { borderBottom: `1px solid ${C.navyBorder}` } : {}),
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '28px 1fr', gap: 28 }}>
              <span style={{ fontFamily: serif, fontSize: 12, fontStyle: 'italic', color: C.gold, paddingTop: 7, flexShrink: 0 }}>
                {item.n}
              </span>
              <div>
                <h3 style={{ fontFamily: serif, fontSize: 'clamp(20px,2.5vw,30px)', fontWeight: 400, color: C.navy, lineHeight: 1.15, marginBottom: 12 }}>
                  {item.h}
                </h3>
                <p style={{ fontFamily: sans, fontSize: 14, color: C.muted, lineHeight: 1.85 }}>
                  {item.b}
                </p>
              </div>
            </div>
          </div>
        ))}

      </div>
    </section>
  );
}

// ─── Accordion item — shared between both conversation lists ───────────────────
function ConvItem({
  conv,
  isOpen,
  onToggle,
}: {
  conv: typeof CONVERSATIONS[0];
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div style={{ borderBottom: `1px solid ${C.navyBorder}` }}>
      <button
        onClick={onToggle}
        style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: 'clamp(24px,3vw,36px) 0', display: 'flex', alignItems: 'flex-start', gap: 20, textAlign: 'left' }}
      >
        <span style={{ fontFamily: serif, fontSize: 12, fontStyle: 'italic', color: isOpen ? C.gold : 'rgba(10,27,52,0.22)', minWidth: 28, paddingTop: 5, flexShrink: 0 }}>
          {conv.n}
        </span>
        <p style={{ fontFamily: serif, fontSize: 'clamp(17px,2vw,22px)', fontStyle: 'italic', color: C.navy, fontWeight: 400, lineHeight: 1.4, flex: 1 }}>
          {conv.q}
        </p>
        <span style={{ fontFamily: sans, fontSize: 20, color: isOpen ? C.gold : 'rgba(10,27,52,0.22)', fontWeight: 300, flexShrink: 0, lineHeight: 1 }}>
          {isOpen ? '×' : '+'}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ paddingBottom: 44, paddingLeft: 48 }}>
              {conv.a.split('\n\n').map((para, pi, all) => (
                <p key={pi} style={{ fontFamily: sans, fontSize: 14, color: C.muted, lineHeight: 1.9, marginBottom: pi < all.length - 1 ? 18 : 0 }}>
                  {para}
                </p>
              ))}
              {conv.pull && (
                <div style={{ marginTop: 32, paddingLeft: 20, borderLeft: `2px solid ${C.goldBorder}` }}>
                  <p style={{ fontFamily: serif, fontSize: 'clamp(18px,2.2vw,24px)', fontStyle: 'italic', color: C.navy, lineHeight: 1.55 }}>
                    "{conv.pull}"
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
const Interview: React.FC = () => {
  const [open, setOpen]               = useState<number | null>(null);
  const [moreExpanded, setMoreExpanded] = useState(false);
  const [moreOpen, setMoreOpen]       = useState<number | null>(null);

  return (
    <div className="min-h-screen" style={{ background: C.cream }}>
      <SEO
        title="A Conversation With Amanda — DA Tuition"
        description="Founder and Principal of DA Tuition. Speaking directly with Amanda is reserved for families who require deeper educational guidance."
        canonicalUrl="/interview"
      />
      <NavigationNew />

      {/* ── 1. Hero ──────────────────────────────────────────────────────────── */}
      <section style={{ background: C.navy, minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Subtle ruled lines */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 1, height: '100%', background: 'rgba(212,175,55,0.05)' }} />
          <div style={{ position: 'absolute', top: 60, left: 0, width: '100%', height: 1, background: 'rgba(212,175,55,0.05)' }} />
          <div style={{ position: 'absolute', bottom: 60, left: 0, width: '100%', height: 1, background: 'rgba(212,175,55,0.05)' }} />
        </div>

        <div style={{ width: '100%', padding: 'clamp(120px,14vw,160px) clamp(24px,6vw,80px) clamp(100px,12vw,140px)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1px 1fr', alignItems: 'center' }}>

            {/* Left */}
            <div style={{ paddingRight: 'clamp(40px,6vw,80px)' }}>
              <p style={{ fontFamily: sans, fontSize: 9, fontWeight: 700, letterSpacing: '0.28em', color: C.gold, textTransform: 'uppercase' as const, marginBottom: 32 }}>
                The Principal Interview
              </p>
              <h1 style={{ fontFamily: serif, fontSize: 'clamp(44px,6vw,84px)', fontWeight: 400, color: C.white, lineHeight: 1.04 }}>
                A Conversation<br />
                With Our<br />
                <em style={{ color: C.gold }}>Founder.</em>
              </h1>
            </div>

            {/* Gold hairline divider */}
            <div style={{ width: 1, alignSelf: 'stretch', background: 'rgba(212,175,55,0.14)' }} />

            {/* Right */}
            <div style={{ paddingLeft: 'clamp(40px,6vw,80px)' }}>
              <p style={{ fontFamily: sans, fontSize: 15, color: 'rgba(255,255,255,0.58)', lineHeight: 1.9, marginBottom: 14 }}>
                Most families begin with our enrolment team.
              </p>
              <p style={{ fontFamily: sans, fontSize: 15, color: 'rgba(255,255,255,0.38)', lineHeight: 1.9, marginBottom: 52 }}>
                Occasionally, Amanda personally meets with families when deeper educational guidance is required.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 12, alignItems: 'flex-start' }}>
                <a href="#request">
                  <button style={{ padding: '14px 32px', background: C.gold, color: C.navy, fontFamily: sans, fontSize: 11, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase' as const, border: 'none', borderRadius: 2, cursor: 'pointer' }}>
                    Request A Principal Interview
                  </button>
                </a>
                <a href="#amanda">
                  <button style={{ padding: '14px 32px', background: 'transparent', color: 'rgba(255,255,255,0.45)', fontFamily: sans, fontSize: 11, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase' as const, border: '1px solid rgba(255,255,255,0.14)', borderRadius: 2, cursor: 'pointer' }}>
                    Meet Amanda
                  </button>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 2. Founder ───────────────────────────────────────────────────────── */}
      <section id="amanda" style={{ background: C.cream }}>
        <div style={{ maxWidth: 1300, margin: '0 auto', display: 'grid', gridTemplateColumns: '420px 1fr' }}>

          {/* Portrait */}
          <div style={{ position: 'relative', minHeight: 720 }}>
            <img
              src="/images/v3/smiling_teacher.jpg"
              alt="Amanda Le — Founder and Principal, DA Tuition"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
            />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(to top, rgba(10,27,52,0.94) 0%, transparent 100%)' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 'clamp(24px,3vw,44px)' }}>
              <div style={{ width: 28, height: 1, background: C.gold, marginBottom: 14 }} />
              <p style={{ fontFamily: serif, fontSize: 'clamp(22px,2.5vw,32px)', fontWeight: 400, color: C.white, lineHeight: 1.2, marginBottom: 6 }}>
                Amanda Le
              </p>
              <p style={{ fontFamily: sans, fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', color: C.gold, textTransform: 'uppercase' as const }}>
                Founder & Principal · DA Tuition
              </p>
            </div>
          </div>

          {/* Biography */}
          <div style={{ padding: 'clamp(64px,8vw,120px) clamp(40px,5vw,80px)', display: 'flex', flexDirection: 'column' as const, justifyContent: 'center' }}>

            <h2 style={{ fontFamily: serif, fontSize: 'clamp(36px,5vw,64px)', fontWeight: 400, color: C.navy, lineHeight: 1.06, marginBottom: 8 }}>
              Amanda Le
            </h2>
            <p style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', color: C.muted, textTransform: 'uppercase' as const, marginBottom: 48 }}>
              Founder & Principal — DA Tuition
            </p>

            {/* Credentials */}
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16, marginBottom: 56, paddingBottom: 56, borderBottom: `1px solid ${C.navyBorder}` }}>
              {[
                ['20+ Years',        'In education — teaching, mentoring and leading'],
                ['Founder',          'Established DA Tuition in 2005, Canley Heights NSW'],
                ['650+ Students',    'Families guided across Western Sydney since founding'],
                ['Award Recognised', 'Outstanding Education Service — Fairfield City Business Awards 2025'],
              ].map(([label, detail]) => (
                <div key={label} style={{ display: 'grid', gridTemplateColumns: '108px 1fr', gap: 16, alignItems: 'baseline' }}>
                  <p style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, color: C.navy }}>{label}</p>
                  <p style={{ fontFamily: sans, fontSize: 13, color: C.muted, lineHeight: 1.65 }}>{detail}</p>
                </div>
              ))}
            </div>

            {/* Philosophy */}
            <div style={{ marginBottom: 56 }}>
              <p style={{ fontFamily: sans, fontSize: 14, color: C.muted, lineHeight: 1.9, marginBottom: 18 }}>
                Amanda founded DA Tuition with a single conviction: most tutoring centres were solving the wrong problem. They focused on content delivery. She wanted to focus on the student.
              </p>
              <p style={{ fontFamily: sans, fontSize: 14, color: C.muted, lineHeight: 1.9 }}>
                DA grew from that belief — a school that assesses before recommending, matches teachers deliberately, and measures success not in marks alone, but in the confidence a student carries into an examination room.
              </p>
            </div>

            {/* Pull quote */}
            <div style={{ paddingLeft: 28, borderLeft: `2px solid ${C.gold}` }}>
              <p style={{ fontFamily: serif, fontSize: 'clamp(20px,2.5vw,28px)', fontStyle: 'italic', color: C.navy, lineHeight: 1.55, marginBottom: 16 }}>
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

      {/* ── 4. In Conversation ───────────────────────────────────────────────── */}
      <section style={{ background: C.cream, padding: 'clamp(100px,12vw,160px) 0' }}>
        <div style={wrapNarrow}>

          {/* Header */}
          <div style={{ marginBottom: 'clamp(56px,7vw,80px)' }}>
            <p style={{ fontFamily: sans, fontSize: 9, fontWeight: 700, letterSpacing: '0.26em', color: C.gold, textTransform: 'uppercase' as const, marginBottom: 20 }}>
              In Conversation
            </p>
            <div style={{ width: 32, height: 1, background: C.gold, marginBottom: 28 }} />
            <h2 style={{ fontFamily: serif, fontSize: 'clamp(36px,5vw,64px)', fontWeight: 400, color: C.navy, lineHeight: 1.06 }}>
              Amanda Le
            </h2>
          </div>

          {/* Five conversations */}
          <div style={{ borderTop: `1px solid ${C.navyBorder}` }}>
            {CONVERSATIONS.map((conv, i) => (
              <ConvItem
                key={i}
                conv={conv}
                isOpen={open === i}
                onToggle={() => setOpen(open === i ? null : i)}
              />
            ))}
          </div>

          {/* More Conversations — collapsed by default */}
          <div style={{ marginTop: 52 }}>
            <button
              onClick={() => { setMoreExpanded(!moreExpanded); setMoreOpen(null); }}
              style={{ display: 'flex', alignItems: 'center', gap: 20, background: 'none', border: 'none', cursor: 'pointer', padding: '20px 0', width: '100%' }}
            >
              <div style={{ flex: 1, height: 1, background: C.navyBorder }} />
              <p style={{ fontFamily: sans, fontSize: 10, fontWeight: 700, letterSpacing: '0.20em', color: moreExpanded ? C.gold : 'rgba(10,27,52,0.32)', textTransform: 'uppercase' as const, whiteSpace: 'nowrap', flexShrink: 0 }}>
                {moreExpanded ? 'Close' : 'More Conversations With Amanda'}
              </p>
              <span style={{ fontFamily: sans, fontSize: 18, color: moreExpanded ? C.gold : 'rgba(10,27,52,0.32)', fontWeight: 300, flexShrink: 0 }}>
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
                      <ConvItem
                        key={i}
                        conv={conv}
                        isOpen={moreOpen === i}
                        onToggle={() => setMoreOpen(moreOpen === i ? null : i)}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* ── 5. What Happens During A Principal Interview ──────────────────────── */}
      <section style={{ background: C.navy, padding: 'clamp(100px,12vw,160px) 0', position: 'relative', overflow: 'hidden' }}>
        {/* Single faint spine accent */}
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 1, height: '100%', background: 'rgba(212,175,55,0.04)', pointerEvents: 'none' }} />

        <div style={wrapNarrow}>

          {/* Header */}
          <div style={{ marginBottom: 'clamp(72px,10vw,120px)', textAlign: 'center' }}>
            <p style={{ fontFamily: sans, fontSize: 9, fontWeight: 700, letterSpacing: '0.26em', color: C.gold, textTransform: 'uppercase' as const, marginBottom: 20 }}>
              The Process
            </p>
            <div style={{ width: 32, height: 1, background: C.gold, margin: '0 auto 28px' }} />
            <h2 style={{ fontFamily: serif, fontSize: 'clamp(28px,4vw,52px)', fontWeight: 400, color: C.white, lineHeight: 1.1 }}>
              What Happens During<br />
              <em style={{ color: C.gold }}>A Principal Interview?</em>
            </h2>
          </div>

          {/* Steps — titles only, let the words carry the weight */}
          <div style={{ position: 'relative', maxWidth: 460, margin: '0 auto' }}>
            {/* Fading spine */}
            <div style={{ position: 'absolute', left: 19, top: 20, bottom: 20, width: 1, background: 'linear-gradient(180deg, rgba(212,175,55,0.45) 0%, rgba(212,175,55,0.08) 100%)' }} />

            {[
              'Understand Your Child',
              'Discuss Strengths & Challenges',
              'Explore Goals',
              'Review Suitable Pathways',
              'Receive Honest Recommendations',
              'Plan The Next Steps',
            ].map((title, i, arr) => (
              <div key={i} style={{ display: 'flex', gap: 32, marginBottom: i < arr.length - 1 ? 56 : 0 }}>
                {/* Node */}
                <div style={{ flexShrink: 0, width: 40, height: 40, borderRadius: '50%', border: '1px solid rgba(212,175,55,0.30)', background: 'rgba(212,175,55,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: serif, fontSize: 11, fontStyle: 'italic', color: 'rgba(212,175,55,0.60)' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                {/* Title */}
                <div style={{ paddingTop: 10 }}>
                  <p style={{ fontFamily: serif, fontSize: 'clamp(20px,2.5vw,26px)', fontWeight: 400, color: C.white, lineHeight: 1.2 }}>
                    {title}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Closing statement */}
          <div style={{ marginTop: 'clamp(80px,10vw,120px)', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, justifyContent: 'center', marginBottom: 40 }}>
              <div style={{ flex: 1, maxWidth: 64, height: 1, background: 'rgba(212,175,55,0.22)' }} />
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(212,175,55,0.45)' }} />
              <div style={{ flex: 1, maxWidth: 64, height: 1, background: 'rgba(212,175,55,0.22)' }} />
            </div>
            <p style={{ fontFamily: serif, fontSize: 'clamp(24px,3.5vw,42px)', fontWeight: 400, color: C.white, lineHeight: 1.25 }}>
              This is not an assessment.
            </p>
            <p style={{ fontFamily: serif, fontSize: 'clamp(24px,3.5vw,42px)', fontWeight: 400, fontStyle: 'italic', color: C.gold, lineHeight: 1.25, marginTop: 8 }}>
              It is a conversation.
            </p>
          </div>

        </div>
      </section>

      {/* ── 6. Request ───────────────────────────────────────────────────────── */}
      <section id="request" style={{ background: C.cream, padding: 'clamp(100px,12vw,160px) 0' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', padding: '0 clamp(20px,4vw,48px)', textAlign: 'center' }}>
          <p style={{ fontFamily: sans, fontSize: 9, fontWeight: 700, letterSpacing: '0.26em', color: C.gold, textTransform: 'uppercase' as const, marginBottom: 20 }}>
            Request An Interview
          </p>
          <div style={{ width: 32, height: 1, background: C.goldBorder, margin: '0 auto 36px' }} />
          <h2 style={{ fontFamily: serif, fontSize: 'clamp(32px,5vw,56px)', fontWeight: 400, color: C.navy, lineHeight: 1.1, marginBottom: 36 }}>
            Speak Directly<br />
            <em style={{ color: C.gold }}>With Amanda.</em>
          </h2>
          <p style={{ fontFamily: sans, fontSize: 15, color: C.muted, lineHeight: 1.9, marginBottom: 16 }}>
            A Principal Interview is a private conversation — not a sales call. Amanda listens, asks questions, and tells you honestly what she thinks.
          </p>
          <p style={{ fontFamily: sans, fontSize: 15, color: C.muted, lineHeight: 1.9, marginBottom: 60 }}>
            If DA is right for your child, she will say so. If it is not, she will say that too.
          </p>
          <Link to="/#contact">
            <button style={{ padding: '16px 52px', background: C.gold, color: C.navy, fontFamily: sans, fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, border: 'none', borderRadius: 2, cursor: 'pointer' }}>
              Request A Principal Interview
            </button>
          </Link>
          <p style={{ fontFamily: sans, fontSize: 11, color: 'rgba(10,27,52,0.28)', marginTop: 20 }}>
            Available by request only.
          </p>
        </div>
      </section>

      {/* ── 7. Final CTA ─────────────────────────────────────────────────────── */}
      <section style={{ background: C.navy, padding: 'clamp(120px,14vw,180px) 0', textAlign: 'center' }}>
        <div style={{ maxWidth: 520, margin: '0 auto', padding: '0 24px' }}>
          <h2 style={{ fontFamily: serif, fontSize: 'clamp(32px,5vw,58px)', fontWeight: 400, color: C.white, lineHeight: 1.1, marginBottom: 56 }}>
            Not every family needs this.<br />
            <em style={{ color: C.gold }}>Yours might.</em>
          </h2>
          <Link to="/#contact">
            <button style={{ padding: '14px 44px', background: 'transparent', border: '1px solid rgba(212,175,55,0.42)', color: C.gold, fontFamily: sans, fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' as const, borderRadius: 2, cursor: 'pointer' }}>
              Request An Interview
            </button>
          </Link>
        </div>
      </section>

      <FooterNew />
    </div>
  );
};

export default Interview;
