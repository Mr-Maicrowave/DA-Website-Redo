import React, { useState } from 'react';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import StickyBookButton from '@/components/StickyBookButton';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';

const c = {
  navy: '#0c1f4a', navyMid: '#1a3870',
  gold: '#b8860b', goldLight: '#d4a017', goldPale: '#fdf6dc',
  pink: '#fce7f3', pinkMid: '#f9a8d4', pinkText: '#9d174d',
  purple: '#f3e8ff', purpleMid: '#c084fc', purpleText: '#6b21a8', purpleDeep: '#9333ea',
  green: '#dcfce7', greenMid: '#86efac', greenText: '#166534',
  blue: '#dbeafe', blueMid: '#93c5fd', blueText: '#1d4ed8',
  white: '#ffffff', muted: '#4a5568', border: '#e2e8f0', soft: '#f8fafc',
};

const curriculumRows = [
  { area: 'Reading Comprehension', badge: 'Core', what: 'Literal and inferential understanding, text types', skills: "Main idea, author's purpose, vocabulary in context" },
  { area: 'Writing & Language Conventions', badge: 'NAPLAN', what: 'Narrative and informative writing, grammar, spelling', skills: 'Paragraphing, punctuation, cohesive language use' },
  { area: 'Multiplication & Division', badge: 'Core', what: 'Times tables fluency, mental strategies, word problems', skills: 'Multiplication facts, division as inverse, arrays' },
  { area: 'Numeracy & Problem Solving', badge: 'NAPLAN', what: 'Multi-step problems, data interpretation, measurement', skills: 'Fractions, decimals, area, graphing, number patterns' },
  { area: 'Critical Thinking & Analysis', badge: '', what: 'Comparing texts, evaluating information, reasoning', skills: 'Opinion writing, inference, multi-step maths reasoning' },
];

const napalnChecklist = [
  'Reading accurately under time pressure',
  'Writing clearly with correct punctuation & grammar',
  'Multiplication and division fact fluency',
  'Interpreting graphs, tables, and data displays',
  'Multi-step word problem strategies',
  'Staying calm and confident under test conditions',
];

const approachPoints = [
  { icon: '📚', bg: c.purple, title: 'NSW Curriculum aligned', sub: 'We reinforce and extend, never conflict with school' },
  { icon: '📝', bg: c.pink, title: 'NAPLAN preparation built in', sub: 'Every lesson develops tested skills naturally' },
  { icon: '👥', bg: c.green, title: 'Small groups (3–4 students)', sub: 'Every child is seen and heard every session' },
  { icon: '📊', bg: c.blue, title: 'Term-by-term progress reports', sub: 'You always know where your child stands' },
  { icon: '⭐', bg: c.goldPale, title: 'Positive, encouraging environment', sub: 'Confidence and capability built together' },
];

const fitPoints = [
  'Your child is in <strong>Year 3 or Year 4</strong> and you want to make the most of this critical window',
  'You want <strong>NAPLAN preparation</strong> that builds genuine skills — not just test tricks',
  'Your child is <strong>struggling with times tables, fractions, or word problems</strong> and needs targeted help',
  'Your child is finding <strong>reading comprehension or extended writing</strong> harder than it used to be',
  'Your child is already strong and you want to <strong>extend them beyond the classroom</strong> with challenging work',
  'You want a tuition centre that gives you <strong>clear, honest progress updates</strong> every single term',
];

const Year34 = () => {
  const [, setHover] = useState(-1);

  return (
    <div className="min-h-screen overflow-x-hidden pt-[120px]" style={{ background: c.white, color: c.navy, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <SEO title="Year 3–4 Tutoring | NAPLAN Ready | DA Tuition" description="Year 3 and 4 are where children build real confidence or begin to fall behind. DA Tuition builds genuine skills for NAPLAN and beyond." canonicalUrl="/programs/year-3-4" />
      <NavigationNew />
      <StickyBookButton />

      {/* Breadcrumb */}
      <div style={{ background: c.soft, borderBottom: `1px solid ${c.border}`, padding: '14px 52px', fontSize: '0.82rem', color: c.muted }}>
        <Link to="/" style={{ color: c.navy, textDecoration: 'none', fontWeight: 600 }}>Home</Link>
        <span style={{ margin: '0 8px' }}>›</span>
        <Link to="/programs/primary-school" style={{ color: c.navy, textDecoration: 'none', fontWeight: 600 }}>Primary School</Link>
        <span style={{ margin: '0 8px' }}>›</span>
        Year 3–4
      </div>

      {/* Sibling tabs */}
      <div style={{ background: c.white, borderBottom: `2px solid ${c.border}`, display: 'flex', justifyContent: 'center', overflowX: 'auto' }}>
        {[
          { label: '🌱 Early Years (Y1–Y2)', to: '/programs/early-years', active: false },
          { label: '📖 Year 3–4', to: '/programs/year-3-4', active: true },
          { label: '🚀 Year 5–6', to: '/programs/year-5-6', active: false },
        ].map((tab, i) => (
          <Link key={i} to={tab.to} style={{ padding: '14px 32px', fontSize: '0.88rem', fontWeight: 700, textDecoration: 'none', color: tab.active ? c.purpleText : c.muted, borderBottom: tab.active ? `3px solid ${c.purpleDeep}` : '3px solid transparent', marginBottom: -2, whiteSpace: 'nowrap', transition: 'all .2s' }}>
            {tab.label}
          </Link>
        ))}
      </div>

      {/* NAPLAN banner */}
      <div style={{ background: `linear-gradient(135deg, ${c.purple} 0%, #ede9fe 100%)`, borderTop: `3px solid ${c.purpleMid}`, borderBottom: `3px solid ${c.purpleMid}`, padding: '20px 52px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, flexWrap: 'wrap' }}>
        {[
          { icon: '📝', title: 'NAPLAN Years 3 & 5', sub: 'We build real skills — not just test tricks' },
          { icon: '📊', title: 'NSW Curriculum Aligned', sub: "Reinforces exactly what's taught at school" },
          { icon: '👥', title: 'Small Groups (3–4 Students)', sub: 'Real individual attention every session' },
        ].map((b, i) => (
          <div key={i} style={{ background: c.white, border: `2px solid ${c.purpleMid}`, borderRadius: 14, padding: '10px 22px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '1.4rem' }}>{b.icon}</span>
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 800, color: c.purpleText, lineHeight: 1.3 }}>{b.title}</div>
              <div style={{ fontSize: '0.75rem', color: c.muted }}>{b.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* HERO */}
      <div style={{ background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 35%, #fce7f3 65%, #e8f5e9 100%)', padding: '80px 52px 72px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(192,132,252,0.35), transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -40, left: -40, width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,168,212,0.18), transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ display: 'inline-block', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '2.5px', textTransform: 'uppercase', color: c.purpleText, background: c.white, border: `1.5px solid ${c.purpleMid}`, padding: '6px 20px', borderRadius: 999, marginBottom: 22 }}>
          📖 Year 3–4 · Ages 8–10 · NAPLAN Ready
        </div>
        <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-2px', color: c.navy, marginBottom: 18 }}>
          The <em style={{ fontStyle: 'normal', color: c.purpleText }}>Middle Years</em><br />Define the Trajectory
        </h1>
        <p style={{ fontSize: '1.1rem', color: c.muted, maxWidth: 580, margin: '0 auto 38px', lineHeight: 1.78 }}>
          Year 3 and 4 are where children either build real confidence — or begin to fall behind. <strong style={{ color: c.navy }}>This is the window that shapes everything that follows.</strong> We make sure it counts.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/#contact" style={{ background: c.navy, color: '#fff', border: 'none', padding: '15px 34px', borderRadius: 12, fontSize: '1rem', fontWeight: 800, cursor: 'pointer', textDecoration: 'none', display: 'inline-block' }}>
            Book a Free Trial Lesson
          </a>
        </div>
      </div>

      {/* WHY */}
      <section style={{ padding: '72px 52px', maxWidth: 1140, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <div style={{ display: 'inline-block', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '2.5px', textTransform: 'uppercase', color: c.gold, background: c.goldPale, border: '1px solid #e8d280', padding: '5px 16px', borderRadius: 999, marginBottom: 16 }}>The Middle Years Moment</div>
          <h2 style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.8rem)', fontWeight: 900, letterSpacing: '-1px', color: c.navy, marginBottom: 14, lineHeight: 1.2 }}>What Makes Year 3–4 So Important</h2>
          <p style={{ fontSize: '1.05rem', color: c.muted, maxWidth: 640, margin: '0 auto', lineHeight: 1.7 }}>
            The shift from <strong style={{ color: c.navy }}>learning to read — to reading to learn</strong> — happens in Year 3. Miss this transition and the gap widens quickly. Nail it, and your child becomes <strong style={{ color: c.navy }}>unstoppable</strong>.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 22 }}>
          {[
            { emoji: '🔄', title: 'The Big Shift Happens Now', desc: 'In <strong>Year 3, school changes dramatically</strong>. Children move from <strong>learning foundational skills</strong> to <strong>applying them across every subject</strong>. This transition catches many families off guard.' },
            { emoji: '📝', title: 'NAPLAN Is on the Horizon', desc: '<strong>Year 3 NAPLAN</strong> tests <strong>reading, writing, language conventions, and numeracy</strong>. Strong performance here builds <strong>momentum — and genuine confidence</strong> — heading into upper primary.' },
            { emoji: '🧩', title: 'Gaps Compound Quickly', desc: "A child who doesn't fully grasp <strong>multiplication in Year 3</strong> will struggle with <strong>fractions in Year 4</strong>, <strong>algebra in Year 7</strong>, and beyond. <strong>These years are the time to close gaps</strong> — not later." },
            { emoji: '🚀', title: 'Confidence Becomes Identity', desc: 'The children who thrive in Year 3–4 develop an identity as <strong>"someone who\'s good at school."</strong> We help every child <strong>own that story</strong> — regardless of where they\'re starting from.' },
          ].map((card, i) => (
            <div key={i} style={{ background: c.white, border: `2px solid ${c.border}`, borderTop: `4px solid ${c.purpleMid}`, borderRadius: 20, padding: '32px 28px', boxShadow: '0 2px 14px rgba(12,31,74,0.05)', transition: 'all .28s' }}
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
          <h2 style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.8rem)', fontWeight: 900, letterSpacing: '-1px', color: c.navy, marginBottom: 14, lineHeight: 1.2 }}>Year 3–4 Curriculum Focus Areas</h2>
          <p style={{ fontSize: '1.05rem', color: c.muted, maxWidth: 640, margin: '0 auto', lineHeight: 1.7 }}>
            100% aligned to the <strong style={{ color: c.navy }}>NSW Curriculum</strong> — with NAPLAN preparation naturally woven into every English and Maths session.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 36, maxWidth: 1100, margin: '0 auto', alignItems: 'start' }} className="y34-grid-responsive">
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
                      {row.badge && <span style={{ marginLeft: 8, fontSize: '0.72rem', background: c.purple, color: c.purpleText, padding: '2px 10px', borderRadius: 999, fontWeight: 800 }}>{row.badge}</span>}
                    </td>
                    <td style={{ padding: '13px 18px', color: c.muted, borderBottom: `1px solid ${c.border}` }}>{row.what}</td>
                    <td style={{ padding: '13px 18px', color: c.muted, borderBottom: `1px solid ${c.border}` }}>{row.skills}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* NAPLAN checklist */}
            <div style={{ background: c.white, border: `2px solid ${c.border}`, borderTop: `4px solid ${c.purpleMid}`, borderRadius: 20, padding: '28px 26px', boxShadow: '0 4px 16px rgba(12,31,74,0.07)' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', color: c.purpleText, marginBottom: 6 }}>📝 NAPLAN Readiness Checklist</div>
              <div style={{ fontSize: '0.8rem', color: c.muted, marginBottom: 18 }}>Skills we develop across Year 3–4 sessions</div>
              {napalnChecklist.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <div style={{ width: 24, height: 24, borderRadius: 6, background: c.purple, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.purpleText, fontWeight: 900, fontSize: '0.8rem', flexShrink: 0 }}>✓</div>
                  <span style={{ fontSize: '0.88rem', color: c.navy }}>{item}</span>
                </div>
              ))}
            </div>

            {/* Testimonial */}
            <div style={{ background: c.white, border: `2px solid ${c.border}`, borderTop: `4px solid ${c.purpleMid}`, borderRadius: 20, padding: '28px 26px', boxShadow: '0 4px 16px rgba(12,31,74,0.07)' }}>
              <div style={{ color: c.goldLight, fontSize: '1.1rem', letterSpacing: 3, marginBottom: 10 }}>★★★★★</div>
              <div style={{ fontSize: '2.2rem', lineHeight: 1, color: c.purpleMid, marginBottom: 4 }}>"</div>
              <p style={{ fontSize: '0.92rem', color: c.navy, lineHeight: 1.75, fontStyle: 'italic', marginBottom: 18 }}>
                "We enrolled our son before Year 3 NAPLAN and honestly didn't know what to expect. He ended up in <strong style={{ fontStyle: 'normal' }}>the top band for both reading and numeracy.</strong> More importantly, he completely stopped saying he was bad at school."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: c.purple, border: `2.5px solid ${c.purpleMid}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: c.purpleText, fontSize: '1rem' }}>D</div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: c.navy }}>David K.</div>
                  <div style={{ fontSize: '0.78rem', color: c.muted }}>Dad of a Year 3 student · Strathfield</div>
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
          <h2 style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.8rem)', fontWeight: 900, letterSpacing: '-1px', color: c.navy, marginBottom: 14, lineHeight: 1.2 }}>How We Teach Year 3–4</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 54, alignItems: 'start', maxWidth: 1000, margin: '0 auto' }} className="y34-approach-responsive">
          <div>
            <p style={{ color: c.muted, fontSize: '1.02rem', lineHeight: 1.82, marginBottom: 18 }}>In Year 3–4, children need <strong style={{ color: c.navy }}>more than repetition</strong> — they need to understand why things work so they can apply skills in new situations, including NAPLAN questions they've never seen before.</p>
            <p style={{ color: c.muted, fontSize: '1.02rem', lineHeight: 1.82, marginBottom: 26 }}>Our tutors identify <strong style={{ color: c.navy }}>the specific misconceptions</strong> holding each child back and address them directly, rather than just re-teaching what the class already covered.</p>
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

      {/* FIT */}
      <div style={{ background: c.purple, borderTop: `2px solid ${c.purpleMid}`, borderBottom: `2px solid ${c.purpleMid}` }}>
        <div style={{ padding: '72px 52px', maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ display: 'inline-block', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '2.5px', textTransform: 'uppercase', color: c.gold, background: c.goldPale, border: '1px solid #e8d280', padding: '5px 16px', borderRadius: 999, marginBottom: 16 }}>Is This Right For Us?</div>
            <h2 style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.8rem)', fontWeight: 900, letterSpacing: '-1px', color: c.navy, marginBottom: 14, lineHeight: 1.2 }}>DA Tuition Year 3–4 Is Perfect If…</h2>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 36 }}>
            {fitPoints.map((pt, i) => (
              <li key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', background: c.white, border: `1.5px solid ${c.purpleMid}`, borderRadius: 14, padding: '18px 22px' }}>
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
          Don't Let the Middle Years<br />Slip By Unaddressed
        </h2>
        <p style={{ fontSize: '1.08rem', color: 'rgba(255,255,255,0.75)', maxWidth: 540, margin: '0 auto 38px', lineHeight: 1.75 }}>
          Year 3 and 4 are too important to leave to chance. Book a free trial lesson and let's show your child what they're truly capable of.
        </p>
        <a href="/#contact" style={{ background: c.goldLight, color: c.navy, border: 'none', padding: '17px 38px', borderRadius: 14, fontSize: '1rem', fontWeight: 900, cursor: 'pointer', textDecoration: 'none', display: 'inline-block' }}>
          Book a Free Trial Lesson →
        </a>
        <div style={{ marginTop: 18, fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)' }}>
          No lock-in contract &nbsp;·&nbsp; Limited spots each term &nbsp;·&nbsp; Results guaranteed or full refund
        </div>
      </div>

      <style>{`@media(max-width:768px){.y34-grid-responsive{grid-template-columns:1fr!important;}.y34-approach-responsive{grid-template-columns:1fr!important;}}`}</style>
      <FooterNew />
    </div>
  );
};

export default Year34;
