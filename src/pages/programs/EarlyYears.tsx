import React, { useState } from 'react';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import StickyBookButton from '@/components/StickyBookButton';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';

const c = {
  navy: '#0A1B34', navyMid: '#1a3870',
  gold: '#D4AF37', goldLight: '#F0CB6A', goldPale: '#F7F4EE',
  pink: '#FFF8E7', pinkMid: '#F0CB6A', pinkText: '#0A1B34',
  purple: '#F7F4EE', purpleMid: '#D4AF37', purpleText: '#0A1B34',
  green: '#F7F4EE', greenMid: '#c9a227', greenText: '#0A1B34',
  blue: '#F7F4EE', blueMid: '#F0CB6A', blueText: '#0A1B34',
  white: '#ffffff', muted: '#4a5568', border: '#E8E0CC', soft: '#F7F4EE',
};

const slides = [
  { stars: true, quote: "My daughter started Year 1 really struggling with reading — she didn't want to go to school because she felt so behind. After just one term at DA Tuition, the change was <strong>remarkable</strong>. She's not just reading better, she's actually excited to pick up books on her own.", name: 'Jessica M.', role: 'Mum of a Year 2 student', initial: 'J', avatarBg: c.pink, avatarBorder: c.pinkMid, avatarText: c.pinkText },
  { stars: true, quote: "My son was completely disengaged from maths in Year 1. Within six weeks at DA Tuition he was asking to do <strong>maths worksheets for fun</strong>. The teachers have a gift for making numbers feel like a game.", name: 'Amanda K.', role: 'Mum of a Year 1 student', initial: 'A', avatarBg: c.purple, avatarBorder: c.purpleMid, avatarText: c.purpleText },
  { stars: true, quote: "DA Tuition identified the exact gaps in the first session and within one term she was reading <strong>above her year level</strong>. Incredible progress.", name: 'Rachel T.', role: 'Mum of a Year 2 student', initial: 'R', avatarBg: c.blue, avatarBorder: c.blueMid, avatarText: c.blueText },
  { stars: true, quote: "The small group format was exactly what our son needed. At DA Tuition he gets genuine individual attention and his <strong>confidence has absolutely soared</strong>.", name: 'Michael & Sarah P.', role: 'Parents of a Year 1 student', initial: 'M', avatarBg: c.green, avatarBorder: c.greenMid, avatarText: c.greenText },
];

const curriculumRows = [
  { area: 'Phonics & Decoding', badge: 'Core', what: 'Sound–letter relationships, blending, digraphs', skills: 'Reading fluency, spelling patterns' },
  { area: 'Reading Comprehension', badge: '', what: 'Understanding stories, inferencing, retelling', skills: 'Vocabulary, main idea, sequencing' },
  { area: 'Writing & Expression', badge: '', what: 'Sentence construction, punctuation, creative ideas', skills: 'Capital letters, full stops, description' },
  { area: 'Number & Place Value', badge: 'Core', what: 'Counting, grouping, two-digit numbers', skills: 'Addition, subtraction, skip counting' },
  { area: 'Maths Problem Solving', badge: '', what: 'Word problems, logical thinking', skills: 'Reasoning, strategy, checking answers' },
];

const approachSteps = [
  { num: '1', title: 'We Start With a Diagnostic', desc: "Before teaching a single thing, we assess exactly where your child is — what they know, what they're almost ready for, and what's causing them to stumble. No guesswork, ever." },
  { num: '2', title: 'Small Groups, Big Attention', desc: 'Our K–Y2 groups are capped at just 4 students so every child gets genuine individual attention — not just a seat in a class where they go unnoticed.' },
  { num: '3', title: 'Hands-On, Playful Learning', desc: 'Young children learn through doing. We use games, manipulatives, visual tools, and stories — because engaged kids learn faster and remember far more.' },
  { num: '4', title: 'Regular Progress Updates', desc: "You'll receive written progress updates every term so you always know exactly how your child is going — and what to reinforce at home between sessions." },
];

const fitPoints = [
  'Your child is in <strong>Year 1 or Year 2</strong> and you want to give them the strongest possible start',
  "You've noticed your child is <strong>behind in reading or phonics</strong> and want to close the gap before Year 3",
  'Your child finds <strong>numbers or basic maths</strong> confusing and needs a patient, step-by-step approach',
  'You want <strong>more than just homework help</strong> — you want genuine skill-building from qualified teachers',
  'Your child is already doing well and you want to <strong>extend and enrich</strong> their learning above classroom level',
  'You want a centre that <strong>communicates clearly with you</strong> and gives honest progress feedback every single term',
];

const whyCards = [
  { num: 'I', title: 'Reading Is the Gateway Skill', desc: 'Every subject — <strong>maths, science, history</strong> — demands reading. Children who <strong>read fluently by Year 2</strong> have a <strong>compounding advantage</strong> that grows every single year.' },
  { num: 'II', title: "Number Sense Can't Be Rushed", desc: 'Understanding <em>why</em> numbers work — not just <strong>memorising facts</strong> — is what separates a child who <strong>struggles with maths</strong> from one who <strong>genuinely loves it</strong>.' },
  { num: 'III', title: 'Confidence Is Formed Early', desc: 'How a child feels about school in <strong>Year 1–2 shapes their identity as a learner</strong> for years. We build <strong>confidence alongside skills</strong> so they believe they can do hard things.' },
  { num: 'IV', title: 'Early Gaps Widen Fast', desc: 'A <strong>small gap at school entry</strong> becomes a <strong>significant gap by Year 4</strong>. Addressing it early is <strong>faster, less stressful, and far more effective</strong> than catching up later.' },
];

const EarlyYears = () => {
  const [slide, setSlide] = useState(0);
  const s = slides[slide];

  return (
    <div className="min-h-screen overflow-x-hidden pt-[120px]" style={{ background: c.white, color: c.navy, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <SEO title="Early Years Tutoring (Year 1–2) | DA Tuition" description="Build the reading, writing, and number sense foundations that last a lifetime. Year 1–2 tutoring in Sydney." canonicalUrl="/programs/early-years" />
      <NavigationNew />
      <StickyBookButton />

      {/* Breadcrumb */}
      <div style={{ background: c.soft, borderBottom: `1px solid ${c.border}`, padding: '14px 52px', fontSize: '0.82rem', color: c.muted }}>
        <Link to="/" style={{ color: c.navy, textDecoration: 'none', fontWeight: 600 }}>Home</Link>
        <span style={{ margin: '0 8px' }}>›</span>
        <Link to="/programs/primary-school" style={{ color: c.navy, textDecoration: 'none', fontWeight: 600 }}>Primary School</Link>
        <span style={{ margin: '0 8px' }}>›</span>
        Early Years (Y1–Y2)
      </div>

      {/* Sibling tabs */}
      <div style={{ background: c.white, borderBottom: `2px solid ${c.border}`, display: 'flex', justifyContent: 'center', overflowX: 'auto' }}>
        {[
          { label: 'Early Years (Y1–Y2)', to: '/programs/early-years', active: true },
          { label: 'Year 3–4', to: '/programs/year-3-4', active: false },
          { label: 'Year 5–6', to: '/programs/year-5-6', active: false },
        ].map((tab, i) => (
          <Link key={i} to={tab.to} style={{ padding: '14px 32px', fontSize: '0.88rem', fontWeight: 700, textDecoration: 'none', color: tab.active ? c.navy : c.muted, borderBottom: tab.active ? `3px solid ${c.gold}` : '3px solid transparent', marginBottom: -2, whiteSpace: 'nowrap', transition: 'all .2s' }}>
            {tab.label}
          </Link>
        ))}
      </div>

      {/* HERO */}
      <div style={{ background: 'linear-gradient(135deg, #F7F4EE 0%, #FFFFFF 55%, rgba(240,203,106,0.12) 100%)', padding: '80px 52px 72px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(240,203,106,0.22), transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -40, left: -40, width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,175,55,0.1), transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ display: 'inline-block', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '2.5px', textTransform: 'uppercase', color: c.gold, background: c.goldPale, border: `1.5px solid ${c.goldLight}`, padding: '6px 20px', borderRadius: 999, marginBottom: 22 }}>
          Early Years · Year 1 – Year 2 · Ages 6–8
        </div>
        <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-2px', color: c.navy, marginBottom: 18 }}>
          Build the <em style={{ fontStyle: 'normal', color: c.gold }}>Foundations</em><br />That Last a Lifetime
        </h1>
        <p style={{ fontSize: '1.1rem', color: c.muted, maxWidth: 580, margin: '0 auto 38px', lineHeight: 1.78 }}>
          The early years are the single most important window for developing <strong style={{ color: c.navy }}>reading, writing, and number sense</strong>. Get it right now — and everything that follows becomes so much easier.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/#contact" style={{ background: c.navy, color: '#fff', border: 'none', padding: '15px 34px', borderRadius: 12, fontSize: '1rem', fontWeight: 800, cursor: 'pointer', textDecoration: 'none', display: 'inline-block' }}>
            Book a Free Trial Lesson
          </a>
        </div>
      </div>

      {/* PHOTO STRIP */}
      <div style={{ padding: '52px 52px 0', maxWidth: 1140, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, borderRadius: 24, overflow: 'hidden', border: `2px solid ${c.border}`, boxShadow: '0 8px 32px rgba(10,27,52,0.07)' }} className="ey-photo-grid">
          <div style={{ overflow: 'hidden', height: 360 }}>
            <img
              src="/images/programs/early-years.jpg"
              alt="DA Tuition early years student learning one-on-one with teacher"
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
            />
          </div>
          <div style={{ background: c.navy, padding: '48px 44px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ display: 'inline-block', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '2.5px', textTransform: 'uppercase', color: c.gold, background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.3)', padding: '5px 16px', borderRadius: 999, marginBottom: 20, width: 'fit-content' }}>Inside DA Tuition</div>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#fff', marginBottom: 16, lineHeight: 1.2, letterSpacing: '-0.5px' }}>Every Child Gets Noticed, Every Session</h2>
            <p style={{ fontSize: '0.97rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.75, marginBottom: 0 }}>Our Early Years groups are capped at just 4 students — so your child receives genuine individual attention. Not a seat in a room. Real teaching.</p>
          </div>
        </div>
      </div>

      {/* WHY */}
      <section style={{ padding: '72px 52px', maxWidth: 1140, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <div style={{ display: 'inline-block', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '2.5px', textTransform: 'uppercase', color: c.gold, background: c.goldPale, border: '1px solid #E8E0CC', padding: '5px 16px', borderRadius: 999, marginBottom: 16 }}>Why It Matters</div>
          <h2 style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.8rem)', fontWeight: 900, letterSpacing: '-1px', color: c.navy, marginBottom: 14, lineHeight: 1.2 }}>Why These Years Are So Critical</h2>
          <p style={{ fontSize: '1.05rem', color: c.muted, maxWidth: 640, margin: '0 auto', lineHeight: 1.7 }}>
            Children who build <strong style={{ color: c.navy }}>strong literacy and numeracy</strong> in their first three years of school carry that advantage <strong style={{ color: c.navy }}>all the way through to Year 12</strong> — and beyond.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 22 }}>
          {whyCards.map((card, i) => (
            <div key={i} style={{ background: c.white, border: `2px solid ${c.border}`, borderRadius: 20, padding: '32px 28px', boxShadow: '0 2px 14px rgba(10,27,52,0.05)', transition: 'all .28s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-5px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 14px 36px rgba(10,27,52,0.12)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 14px rgba(10,27,52,0.05)'; }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 12, background: c.goldPale, border: `2px solid ${c.goldLight}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 900, color: c.gold, marginBottom: 16 }}>{card.num}</div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: c.navy, marginBottom: 10 }}>{card.title}</h3>
              <p style={{ fontSize: '0.9rem', color: c.muted, lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: card.desc }} />
            </div>
          ))}
        </div>
      </section>

      {/* CURRICULUM TABLE + TESTIMONIAL */}
      <section style={{ background: c.soft, borderTop: `2px solid ${c.border}`, borderBottom: `2px solid ${c.border}`, padding: '72px 52px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'inline-block', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '2.5px', textTransform: 'uppercase', color: c.gold, background: c.goldPale, border: '1px solid #E8E0CC', padding: '5px 16px', borderRadius: 999, marginBottom: 16 }}>What We Cover</div>
          <h2 style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.8rem)', fontWeight: 900, letterSpacing: '-1px', color: c.navy, marginBottom: 14, lineHeight: 1.2 }}>Year 1–2 Curriculum Focus Areas</h2>
          <p style={{ fontSize: '1.05rem', color: c.muted, maxWidth: 640, margin: '0 auto', lineHeight: 1.7 }}>
            Every session is aligned to the <strong style={{ color: c.navy }}>NSW Curriculum</strong> for your child's exact year group — reinforcing and extending what they learn at school.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 36, maxWidth: 1100, margin: '0 auto', alignItems: 'start' }} className="ey-grid-responsive">
          <div style={{ background: c.white, borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 20px rgba(10,27,52,0.07)', border: `2px solid ${c.border}` }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: c.navy }}>
                  <th style={{ textAlign: 'left', padding: '14px 18px', color: '#fff', fontWeight: 800 }}>Focus Area</th>
                  <th style={{ textAlign: 'left', padding: '14px 18px', color: '#fff', fontWeight: 800 }}>What We Build</th>
                  <th style={{ textAlign: 'left', padding: '14px 18px', color: '#fff', fontWeight: 800 }}>Key Skills</th>
                </tr>
              </thead>
              <tbody>
                {curriculumRows.map((row, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? c.white : c.soft }}>
                    <td style={{ padding: '13px 18px', color: c.navy, fontWeight: 700, borderBottom: `1px solid ${c.border}` }}>
                      {row.area}
                      {row.badge && <span style={{ marginLeft: 8, fontSize: '0.72rem', background: c.goldPale, color: c.navy, padding: '2px 10px', borderRadius: 999, fontWeight: 800 }}>{row.badge}</span>}
                    </td>
                    <td style={{ padding: '13px 18px', color: c.muted, borderBottom: `1px solid ${c.border}` }}>{row.what}</td>
                    <td style={{ padding: '13px 18px', color: c.muted, borderBottom: `1px solid ${c.border}` }}>{row.skills}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Testimonial carousel */}
          <div style={{ background: c.white, border: `2px solid ${c.border}`, borderTop: `5px solid ${c.gold}`, borderRadius: 24, padding: '36px 30px', boxShadow: '0 8px 32px rgba(10,27,52,0.08)' }}>
            <div style={{ color: c.goldLight, fontSize: '1.2rem', letterSpacing: 4, marginBottom: 14 }}>★★★★★</div>
            <div style={{ fontSize: '2.8rem', lineHeight: 1, color: c.gold, marginBottom: 6 }}>"</div>
            <p style={{ fontSize: '0.97rem', color: c.navy, lineHeight: 1.8, fontStyle: 'italic', marginBottom: 24, minHeight: 100 }} dangerouslySetInnerHTML={{ __html: s.quote }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: c.goldPale, border: `2.5px solid ${c.goldLight}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: c.navy, fontSize: '1.1rem' }}>{s.initial}</div>
              <div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: c.navy }}>{s.name}</div>
                <div style={{ fontSize: '0.78rem', color: c.muted }}>{s.role}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button onClick={() => setSlide(i => (i - 1 + slides.length) % slides.length)} style={{ background: c.goldPale, border: `1.5px solid ${c.goldLight}`, borderRadius: '50%', width: 34, height: 34, cursor: 'pointer', fontSize: '1rem', color: c.navy, fontWeight: 900 }}>‹</button>
              <div style={{ display: 'flex', gap: 7 }}>
                {slides.map((_, i) => (
                  <button key={i} onClick={() => setSlide(i)} style={{ width: i === slide ? 22 : 9, height: 9, borderRadius: 4, border: 'none', background: i === slide ? c.gold : c.border, cursor: 'pointer', padding: 0, transition: 'all .2s' }} />
                ))}
              </div>
              <button onClick={() => setSlide(i => (i + 1) % slides.length)} style={{ background: c.goldPale, border: `1.5px solid ${c.goldLight}`, borderRadius: '50%', width: 34, height: 34, cursor: 'pointer', fontSize: '1rem', color: c.navy, fontWeight: 900 }}>›</button>
            </div>
          </div>
        </div>
      </section>

      {/* APPROACH */}
      <section style={{ padding: '72px 52px', maxWidth: 1140, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <div style={{ display: 'inline-block', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '2.5px', textTransform: 'uppercase', color: c.gold, background: c.goldPale, border: '1px solid #E8E0CC', padding: '5px 16px', borderRadius: 999, marginBottom: 16 }}>Our Approach</div>
          <h2 style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.8rem)', fontWeight: 900, letterSpacing: '-1px', color: c.navy, marginBottom: 14, lineHeight: 1.2 }}>How We Teach Early Years</h2>
          <p style={{ fontSize: '1.05rem', color: c.muted, maxWidth: 600, margin: '0 auto', lineHeight: 1.7 }}>Young learners need a specific environment — warm, structured, and full of small wins. Here's exactly how we create it.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 22 }}>
          {approachSteps.map((step, i) => (
            <div key={i} style={{ background: c.white, border: `2px solid ${c.border}`, borderRadius: 20, padding: '32px 28px', boxShadow: '0 2px 12px rgba(10,27,52,0.05)', transition: 'all .25s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(10,27,52,0.1)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(10,27,52,0.05)'; }}
            >
              <div style={{ width: 42, height: 42, borderRadius: 12, background: c.goldPale, border: `1.5px solid ${c.goldLight}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 900, color: c.gold, marginBottom: 18 }}>{step.num}</div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: c.navy, marginBottom: 10 }}>{step.title}</h3>
              <p style={{ fontSize: '0.9rem', color: c.muted, lineHeight: 1.7 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FIT */}
      <div style={{ background: c.goldPale, borderTop: `2px solid ${c.goldLight}`, borderBottom: `2px solid ${c.goldLight}` }}>
        <div style={{ padding: '72px 52px', maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ display: 'inline-block', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '2.5px', textTransform: 'uppercase', color: c.gold, background: c.white, border: '1px solid #E8E0CC', padding: '5px 16px', borderRadius: 999, marginBottom: 16 }}>Is This Right For Us?</div>
            <h2 style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.8rem)', fontWeight: 900, letterSpacing: '-1px', color: c.navy, marginBottom: 14, lineHeight: 1.2 }}>DA Tuition Early Years Is Perfect If…</h2>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 36 }}>
            {fitPoints.map((pt, i) => (
              <li key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', background: c.white, border: `1.5px solid ${c.goldLight}`, borderRadius: 14, padding: '18px 22px' }}>
                <div style={{ width: 28, height: 28, background: c.goldPale, border: `1.5px solid ${c.goldLight}`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.gold, fontWeight: 900, fontSize: '0.85rem', flexShrink: 0, marginTop: 1 }}>✓</div>
                <span style={{ fontSize: '0.95rem', color: c.muted, lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: pt }} />
              </li>
            ))}
          </ul>
          <div style={{ textAlign: 'center' }}>
            <a href="/#contact" style={{ background: c.navy, color: '#fff', border: 'none', padding: '16px 36px', borderRadius: 12, fontSize: '1rem', fontWeight: 800, cursor: 'pointer', textDecoration: 'none', display: 'inline-block' }}>
              Book Our Free Trial Lesson — No Commitment
            </a>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ textAlign: 'center', padding: '96px 52px', background: c.navy, borderTop: `4px solid ${c.goldLight}` }}>
        <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 900, letterSpacing: '-1.2px', marginBottom: 18, color: c.white, lineHeight: 1.15 }}>
          Ready to Give Your Child<br />the Best Start?
        </h2>
        <p style={{ fontSize: '1.08rem', color: 'rgba(255,255,255,0.75)', maxWidth: 540, margin: '0 auto 38px', lineHeight: 1.75 }}>
          Join hundreds of K–Y2 families across Sydney who've trusted DA Tuition to build the foundations that last a lifetime. Spots are limited — secure yours today.
        </p>
        <a href="/#contact" style={{ background: c.goldLight, color: c.navy, border: 'none', padding: '17px 38px', borderRadius: 14, fontSize: '1rem', fontWeight: 900, cursor: 'pointer', textDecoration: 'none', display: 'inline-block' }}>
          Book a Free Trial Lesson →
        </a>
        <div style={{ marginTop: 18, fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)' }}>
          No entrance exam &nbsp;·&nbsp; No lock-in contract &nbsp;·&nbsp; Just results
        </div>
      </div>

      <style>{`@media(max-width:768px){.ey-grid-responsive{grid-template-columns:1fr!important;}.ey-photo-grid{grid-template-columns:1fr!important;}}`}</style>
      <FooterNew />
    </div>
  );
};

export default EarlyYears;
