import React from 'react';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import StickyBookButton from '@/components/StickyBookButton';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';

const c = {
  navy: '#0c1f4a', navyMid: '#1a3870',
  gold: '#b8860b', goldLight: '#d4a017', goldPale: '#fdf6dc',
  pink: '#fce7f3', pinkMid: '#f9a8d4', pinkText: '#9d174d',
  purple: '#f3e8ff', purpleMid: '#c084fc', purpleText: '#6b21a8',
  green: '#dcfce7', greenMid: '#86efac', greenText: '#166534', greenDeep: '#16a34a',
  blue: '#dbeafe', blueMid: '#93c5fd', blueText: '#1d4ed8',
  white: '#ffffff', muted: '#4a5568', border: '#e2e8f0', soft: '#f8fafc',
};

const curriculumRows = [
  { area: 'Advanced Reading & Analysis', badge: '', what: "Complex text types, author's craft, critical evaluation", skills: 'Inferencing, synthesis, literary techniques, perspective' },
  { area: 'Writing for NAPLAN', badge: 'NAPLAN', what: 'Persuasive and narrative writing at a high level', skills: 'Structure, voice, cohesion, vocabulary, sophisticated grammar' },
  { area: 'Algebra & Problem Solving', badge: 'Core', what: 'Variables, equations, number patterns, multi-step reasoning', skills: 'Algebraic thinking, fraction operations, ratio, percentage' },
  { area: 'Selective School Skills', badge: 'Selective', what: 'Abstract reasoning, general ability, reading under pressure', skills: 'Pattern recognition, logical deduction, speed and accuracy' },
  { area: 'Numeracy & Data', badge: 'NAPLAN', what: 'Statistics, geometry, financial maths, measurement', skills: 'Data interpretation, spatial reasoning, real-world application' },
  { area: 'Study Skills & Independence', badge: '', what: 'Organisation, note-taking, self-testing, time management', skills: 'Exam strategies, revision habits, high school preparation' },
];

const hsChecklist = [
  'Extended writing across multiple text types',
  'Algebraic reasoning and equation solving',
  'Abstract and general reasoning skills (selective prep)',
  'Independent study habits and organisation',
  'Exam strategy and time management under pressure',
  'Self-correction and growth mindset in learning',
];

const approachPoints = [
  { icon: '🏫', bg: c.green, title: 'Selective school preparation', sub: 'Specific skills for OC, selective, and scholarship exams' },
  { icon: '📝', bg: c.blue, title: 'NAPLAN Year 5 aligned', sub: 'We target tested domains throughout the year' },
  { icon: '👥', bg: c.pink, title: 'Small groups (3–4 students)', sub: 'Senior students get individual coaching, not a lecture' },
  { icon: '🎓', bg: c.purple, title: 'High school transition support', sub: 'Building the study habits that Year 7 demands' },
  { icon: '📊', bg: c.goldPale, title: 'Term progress reports', sub: 'Transparent, specific feedback for parents every term' },
];

const fitPoints = [
  'Your child is in <strong>Year 5 or Year 6</strong> and you want to make the most of this critical final window in primary school',
  "You're preparing for a <strong>selective school, OC, or scholarship exam</strong> and need targeted, expert preparation",
  'You want <strong>Year 5 NAPLAN preparation</strong> that builds genuine skills — not test anxiety',
  'Your child is <strong>capable but not yet performing to their potential</strong> and needs a push in the right direction',
  'You want your child entering <strong>high school with strong foundations</strong> and real confidence in both Maths and English',
  'You value a tuition centre that <strong>communicates honestly</strong> and gives specific, useful progress feedback every term',
];

const badgeColors: Record<string, { bg: string; text: string }> = {
  NAPLAN: { bg: c.blue, text: c.blueText },
  Core: { bg: c.green, text: c.greenText },
  Selective: { bg: c.purple, text: c.purpleText },
};

const Year56 = () => {
  return (
    <div className="min-h-screen overflow-x-hidden pt-[120px]" style={{ background: c.white, color: c.navy, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <SEO title="Year 5–6 Tutoring | Selective School & NAPLAN | DA Tuition" description="Selective school, Year 5 NAPLAN, and high school readiness all converge in Year 5–6. DA Tuition prepares your child for every milestone." canonicalUrl="/programs/year-5-6" />
      <NavigationNew />
      <StickyBookButton />

      {/* Breadcrumb */}
      <div style={{ background: c.soft, borderBottom: `1px solid ${c.border}`, padding: '14px 52px', fontSize: '0.82rem', color: c.muted }}>
        <Link to="/" style={{ color: c.navy, textDecoration: 'none', fontWeight: 600 }}>Home</Link>
        <span style={{ margin: '0 8px' }}>›</span>
        <Link to="/programs/primary-school" style={{ color: c.navy, textDecoration: 'none', fontWeight: 600 }}>Primary School</Link>
        <span style={{ margin: '0 8px' }}>›</span>
        Year 5–6
      </div>

      {/* Sibling tabs */}
      <div style={{ background: c.white, borderBottom: `2px solid ${c.border}`, display: 'flex', justifyContent: 'center', overflowX: 'auto' }}>
        {[
          { label: '🌱 Early Years (Y1–Y2)', to: '/programs/early-years', active: false },
          { label: '📖 Year 3–4', to: '/programs/year-3-4', active: false },
          { label: '🚀 Year 5–6', to: '/programs/year-5-6', active: true },
        ].map((tab, i) => (
          <Link key={i} to={tab.to} style={{ padding: '14px 32px', fontSize: '0.88rem', fontWeight: 700, textDecoration: 'none', color: tab.active ? c.greenText : c.muted, borderBottom: tab.active ? `3px solid ${c.greenDeep}` : '3px solid transparent', marginBottom: -2, whiteSpace: 'nowrap', transition: 'all .2s' }}>
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Urgency banner */}
      <div style={{ background: `linear-gradient(135deg, ${c.green} 0%, #d1fae5 100%)`, borderTop: `3px solid ${c.greenMid}`, borderBottom: `3px solid ${c.greenMid}`, padding: '18px 52px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32, flexWrap: 'wrap' }}>
        {[
          { icon: '⚡', text: 'Limited Places This Term', highlight: 'Filling Fast' },
          { icon: '🏫', text: 'Selective School Prep', highlight: null },
          { icon: '📝', text: 'Year 5 NAPLAN Ready', highlight: null },
          { icon: '🎓', text: 'High School Transition Support', highlight: null },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.9rem', fontWeight: 700, color: c.navy }}>
            <span style={{ fontSize: '1.3rem' }}>{item.icon}</span>
            {item.text}
            {item.highlight && <span style={{ background: c.navy, color: '#fff', fontSize: '0.78rem', fontWeight: 800, padding: '4px 14px', borderRadius: 999, whiteSpace: 'nowrap' }}>{item.highlight}</span>}
          </div>
        ))}
      </div>

      {/* HERO */}
      <div style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 30%, #dbeafe 60%, #f3e8ff 100%)', padding: '80px 52px 72px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(134,239,172,0.4), transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -40, left: -40, width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle, rgba(147,196,253,0.25), transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ display: 'inline-block', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '2.5px', textTransform: 'uppercase', color: c.greenText, background: c.white, border: `1.5px solid ${c.greenMid}`, padding: '6px 20px', borderRadius: 999, marginBottom: 22 }}>
          🚀 Year 5–6 · Ages 10–12 · Selective & HS Ready
        </div>
        <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-2px', color: c.navy, marginBottom: 18 }}>
          This Is Where <em style={{ fontStyle: 'normal', color: c.greenText }}>Everything</em><br />Gets Decided
        </h1>
        <p style={{ fontSize: '1.1rem', color: c.muted, maxWidth: 580, margin: '0 auto 38px', lineHeight: 1.78 }}>
          Year 5 and 6 are the most consequential years of primary school. <strong style={{ color: c.navy }}>Selective school opportunities, Year 5 NAPLAN, and high school readiness</strong> all converge right here.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/#contact" style={{ background: c.navy, color: '#fff', border: 'none', padding: '15px 34px', borderRadius: 12, fontSize: '1rem', fontWeight: 800, cursor: 'pointer', textDecoration: 'none', display: 'inline-block' }}>
            Secure a Spot — Limited Places
          </a>
        </div>
      </div>

      {/* WHY */}
      <section style={{ padding: '72px 52px', maxWidth: 1140, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <div style={{ display: 'inline-block', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '2.5px', textTransform: 'uppercase', color: c.gold, background: c.goldPale, border: '1px solid #e8d280', padding: '5px 16px', borderRadius: 999, marginBottom: 16 }}>The Stakes</div>
          <h2 style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.8rem)', fontWeight: 900, letterSpacing: '-1px', color: c.navy, marginBottom: 14, lineHeight: 1.2 }}>Why Year 5–6 Is the Most Critical Window</h2>
          <p style={{ fontSize: '1.05rem', color: c.muted, maxWidth: 640, margin: '0 auto', lineHeight: 1.7 }}>
            <strong style={{ color: c.navy }}>Four major milestones</strong> converge in these two years. The families who <strong style={{ color: c.navy }}>prepare now</strong> are the ones who look back <strong style={{ color: c.navy }}>without regret</strong>.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 22 }}>
          {[
            { emoji: '📝', title: 'Year 5 NAPLAN', desc: '<strong>Year 5 NAPLAN results matter</strong> for <strong>selective school applications</strong>, <strong>scholarship eligibility</strong>, and the <strong>academic streaming decisions</strong> that shape your child\'s high school experience.' },
            { emoji: '🏫', title: 'Selective School Entry', desc: 'Selective school and scholarship exams require a <strong>very specific skill set</strong> — well beyond the regular curriculum. <strong>Preparation needs to start early</strong> and be <strong>strategic</strong> to be effective.' },
            { emoji: '🎓', title: 'High School Readiness', desc: '<strong>Year 7 demands significantly more</strong> independent thinking and organisation. Children who enter high school with <strong>strong foundations thrive</strong> — those who don\'t <strong>often struggle silently</strong>.' },
            { emoji: '📚', title: 'Advanced Content Mastery', desc: 'Year 5–6 maths and English move into <strong>abstract reasoning, algebra, extended analysis</strong>, and <strong>sophisticated writing</strong> — skills that require <strong>explicit teaching</strong>, not just practice.' },
          ].map((card, i) => (
            <div key={i} style={{ background: c.white, border: `2px solid ${c.border}`, borderTop: `4px solid ${c.greenMid}`, borderRadius: 20, padding: '32px 28px', boxShadow: '0 2px 14px rgba(12,31,74,0.05)', transition: 'all .28s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-5px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 14px 36px rgba(12,31,74,0.12)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 14px rgba(12,31,74,0.05)'; }}
            >
              <div style={{ fontSize: '2.2rem', marginBottom: 16 }}>{card.emoji}</div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: c.navy, marginBottom: 10 }}>{card.title}</h3>
              <p style={{ fontSize: '0.9rem', color: c.muted, lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: card.desc }} />
            </div>
          ))}
        </div>
      </section>

      {/* CURRICULUM + CHECKLIST */}
      <section style={{ background: c.soft, borderTop: `2px solid ${c.border}`, borderBottom: `2px solid ${c.border}`, padding: '72px 52px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'inline-block', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '2.5px', textTransform: 'uppercase', color: c.gold, background: c.goldPale, border: '1px solid #e8d280', padding: '5px 16px', borderRadius: 999, marginBottom: 16 }}>What We Cover</div>
          <h2 style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.8rem)', fontWeight: 900, letterSpacing: '-1px', color: c.navy, marginBottom: 14, lineHeight: 1.2 }}>Year 5–6 Curriculum Focus Areas</h2>
          <p style={{ fontSize: '1.05rem', color: c.muted, maxWidth: 640, margin: '0 auto', lineHeight: 1.7 }}>
            Aligned to the <strong style={{ color: c.navy }}>NSW Curriculum</strong> with NAPLAN preparation and selective school extension for students aiming higher.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 36, maxWidth: 1100, margin: '0 auto', alignItems: 'start' }} className="y56-grid-responsive">
          <div style={{ background: c.white, borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 20px rgba(12,31,74,0.07)', border: `2px solid ${c.border}` }}>
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
                      {row.badge && badgeColors[row.badge] && (
                        <span style={{ marginLeft: 8, fontSize: '0.72rem', background: badgeColors[row.badge].bg, color: badgeColors[row.badge].text, padding: '2px 10px', borderRadius: 999, fontWeight: 800 }}>{row.badge}</span>
                      )}
                    </td>
                    <td style={{ padding: '13px 18px', color: c.muted, borderBottom: `1px solid ${c.border}` }}>{row.what}</td>
                    <td style={{ padding: '13px 18px', color: c.muted, borderBottom: `1px solid ${c.border}` }}>{row.skills}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* HS checklist */}
            <div style={{ background: c.white, border: `2px solid ${c.border}`, borderTop: `4px solid ${c.greenMid}`, borderRadius: 20, padding: '28px 26px', boxShadow: '0 4px 16px rgba(12,31,74,0.07)' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', color: c.greenText, marginBottom: 6 }}>🎓 High School Readiness Checklist</div>
              <div style={{ fontSize: '0.8rem', color: c.muted, marginBottom: 18 }}>Skills built across our Year 5–6 program</div>
              {hsChecklist.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <div style={{ width: 24, height: 24, borderRadius: 6, background: c.green, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.greenText, fontWeight: 900, fontSize: '0.8rem', flexShrink: 0 }}>✓</div>
                  <span style={{ fontSize: '0.88rem', color: c.navy }}>{item}</span>
                </div>
              ))}
            </div>

            {/* Testimonial */}
            <div style={{ background: c.white, border: `2px solid ${c.border}`, borderTop: `4px solid ${c.greenMid}`, borderRadius: 20, padding: '28px 26px', boxShadow: '0 4px 16px rgba(12,31,74,0.07)' }}>
              <div style={{ color: c.goldLight, fontSize: '1.1rem', letterSpacing: 3, marginBottom: 10 }}>★★★★★</div>
              <div style={{ fontSize: '2.2rem', lineHeight: 1, color: c.greenMid, marginBottom: 4 }}>"</div>
              <p style={{ fontSize: '0.92rem', color: c.navy, lineHeight: 1.75, fontStyle: 'italic', marginBottom: 18 }}>
                "Our daughter got into <strong style={{ fontStyle: 'normal' }}>her first-choice selective school</strong>. But the bigger win was watching her stop saying 'I'm not smart enough.' DA Tuition didn't just prepare her for the exam. They changed how she sees herself."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: c.green, border: `2.5px solid ${c.greenMid}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: c.greenText, fontSize: '1rem' }}>P</div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: c.navy }}>Priya C.</div>
                  <div style={{ fontSize: '0.78rem', color: c.muted }}>Mum of a Year 6 student · Chatswood</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* APPROACH */}
      <section style={{ padding: '72px 52px', maxWidth: 1140, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <div style={{ display: 'inline-block', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '2.5px', textTransform: 'uppercase', color: c.gold, background: c.goldPale, border: '1px solid #e8d280', padding: '5px 16px', borderRadius: 999, marginBottom: 16 }}>Our Approach</div>
          <h2 style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.8rem)', fontWeight: 900, letterSpacing: '-1px', color: c.navy, marginBottom: 14, lineHeight: 1.2 }}>How We Teach Year 5–6</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 54, alignItems: 'start', maxWidth: 1000, margin: '0 auto' }} className="y56-approach-responsive">
          <div>
            <p style={{ color: c.muted, fontSize: '1.02rem', lineHeight: 1.82, marginBottom: 18 }}>Year 5–6 students need <strong style={{ color: c.navy }}>more than content delivery</strong> — they need to develop the kind of thinking that allows them to tackle questions they've never seen before. That's what selective school and NAPLAN actually test.</p>
            <p style={{ color: c.muted, fontSize: '1.02rem', lineHeight: 1.82, marginBottom: 26 }}>Our tutors work closely with each student to identify <strong style={{ color: c.navy }}>exactly where they're losing marks</strong> and build targeted strategies — not just more practice sheets.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {approachPoints.map((ap, i) => (
              <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', background: c.white, border: `2px solid ${c.border}`, borderRadius: 14, padding: '16px 18px', boxShadow: '0 2px 8px rgba(12,31,74,0.04)', transition: 'all .2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = c.goldLight; (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(12,31,74,0.1)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = c.border; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(12,31,74,0.04)'; }}
              >
                <div style={{ flexShrink: 0, width: 38, height: 38, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', background: ap.bg }}>{ap.icon}</div>
                <div>
                  <strong style={{ color: c.navy, display: 'block', marginBottom: 2, fontSize: '0.94rem', fontWeight: 800 }}>{ap.title}</strong>
                  <span style={{ fontSize: '0.88rem', color: c.muted }}>{ap.sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scarcity */}
      <div style={{ maxWidth: 860, margin: '0 auto 0', padding: '0 52px 60px' }}>
        <div style={{ background: `linear-gradient(135deg, ${c.green} 0%, #d1fae5 100%)`, border: `2px solid ${c.greenMid}`, borderRadius: 20, padding: '28px 32px', display: 'flex', alignItems: 'flex-start', gap: 20 }}>
          <span style={{ fontSize: '2.4rem', flexShrink: 0 }}>⏳</span>
          <div>
            <h3 style={{ fontSize: '1.12rem', fontWeight: 900, color: c.navy, marginBottom: 8 }}>Year 5–6 Spots Fill Quickly Each Term</h3>
            <p style={{ fontSize: '0.92rem', color: c.muted, lineHeight: 1.7 }}>Our senior primary program is our most in-demand offering. We keep groups intentionally small — which means we can only accept a limited number of students each term. <strong style={{ color: c.navy }}>Families who enquire early secure their place. Those who wait often miss out.</strong></p>
          </div>
        </div>
      </div>

      {/* FIT */}
      <div style={{ background: c.green, borderTop: `2px solid ${c.greenMid}`, borderBottom: `2px solid ${c.greenMid}` }}>
        <div style={{ padding: '72px 52px', maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ display: 'inline-block', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '2.5px', textTransform: 'uppercase', color: c.gold, background: c.goldPale, border: '1px solid #e8d280', padding: '5px 16px', borderRadius: 999, marginBottom: 16 }}>Is This Right For Us?</div>
            <h2 style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.8rem)', fontWeight: 900, letterSpacing: '-1px', color: c.navy, marginBottom: 14, lineHeight: 1.2 }}>DA Tuition Year 5–6 Is Perfect If…</h2>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 36 }}>
            {fitPoints.map((pt, i) => (
              <li key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', background: c.white, border: `1.5px solid ${c.greenMid}`, borderRadius: 14, padding: '18px 22px' }}>
                <div style={{ width: 28, height: 28, background: c.goldPale, border: `1.5px solid ${c.goldLight}`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.gold, fontWeight: 900, fontSize: '0.85rem', flexShrink: 0, marginTop: 1 }}>✓</div>
                <span style={{ fontSize: '0.95rem', color: c.muted, lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: pt }} />
              </li>
            ))}
          </ul>
          <div style={{ textAlign: 'center' }}>
            <a href="/#contact" style={{ background: c.navy, color: '#fff', border: 'none', padding: '16px 36px', borderRadius: 12, fontSize: '1rem', fontWeight: 800, cursor: 'pointer', textDecoration: 'none', display: 'inline-block' }}>
              Secure a Spot — Limited Places Available
            </a>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ textAlign: 'center', padding: '96px 52px', background: c.navy, borderTop: `4px solid ${c.goldLight}` }}>
        <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 900, letterSpacing: '-1.2px', marginBottom: 18, color: c.white, lineHeight: 1.15 }}>
          Year 5–6 Is Too Important<br />to Leave to Chance
        </h2>
        <p style={{ fontSize: '1.08rem', color: 'rgba(255,255,255,0.75)', maxWidth: 540, margin: '0 auto 38px', lineHeight: 1.75 }}>
          Selective schools, Year 5 NAPLAN, and high school readiness all come down to preparation. The families who start early are the ones who look back without regret. Secure your child's spot today.
        </p>
        <a href="/#contact" style={{ background: c.goldLight, color: c.navy, border: 'none', padding: '17px 38px', borderRadius: 14, fontSize: '1rem', fontWeight: 900, cursor: 'pointer', textDecoration: 'none', display: 'inline-block' }}>
          Book a Free Trial Lesson →
        </a>
        <div style={{ marginTop: 18, fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)' }}>
          Limited spots this term &nbsp;·&nbsp; No lock-in contract &nbsp;·&nbsp; Free 20-minute consultation included
        </div>
      </div>

      <style>{`@media(max-width:768px){.y56-grid-responsive{grid-template-columns:1fr!important;}.y56-approach-responsive{grid-template-columns:1fr!important;}}`}</style>
      <FooterNew />
    </div>
  );
};

export default Year56;
