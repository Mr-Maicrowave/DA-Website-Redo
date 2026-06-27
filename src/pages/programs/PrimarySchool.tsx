import React, { useState } from 'react';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import StickyBookButton from '@/components/StickyBookButton';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';

const c = {
  navy: '#0A1B34',
  navyMid: '#1a3870',
  gold: '#D4AF37',
  goldLight: '#F0CB6A',
  goldPale: '#F7F4EE',
  pink: '#FFF8E7',
  pinkMid: '#F0CB6A',
  pinkText: '#0A1B34',
  purple: '#F7F4EE',
  purpleMid: '#D4AF37',
  purpleText: '#0A1B34',
  green: '#F7F4EE',
  greenMid: '#c9a227',
  greenText: '#0A1B34',
  blue: '#F7F4EE',
  blueMid: '#F0CB6A',
  blueText: '#0A1B34',
  white: '#ffffff',
  muted: '#4a5568',
  border: '#E8E0CC',
  soft: '#F7F4EE',
};

const testimonials = [
  { text: '"My son went from struggling with his times tables to <strong>topping his class in one term.</strong> He actually looks forward to Saturdays now."', name: 'Sarah L.', role: 'Mum of a Year 4 student', initials: 'SL', accent: c.goldPale, accentMid: c.goldLight, accentText: c.navy },
  { text: '"Our daughter was so anxious about reading aloud. After just <strong>six weeks at DA Tuition,</strong> she was putting her hand up in class."', name: 'Jessica M.', role: 'Mum of a Year 2 student', initials: 'JM', accent: c.goldPale, accentMid: c.gold, accentText: c.navy },
  { text: '"We enrolled before Year 3 NAPLAN. He ended up in <strong>the top band in reading and numeracy.</strong> He stopped saying he was bad at school."', name: 'David K.', role: 'Dad of a Year 3 student', initials: 'DK', accent: c.goldPale, accentMid: c.goldLight, accentText: c.navy },
  { text: '"Our daughter got into <strong>her first-choice selective school.</strong> The bigger win was watching her stop saying "I\'m not smart."', name: 'Priya C.', role: 'Mum of a Year 6 student', initials: 'PC', accent: c.goldPale, accentMid: c.gold, accentText: c.navy },
];

const fitItems = [
  { bg: 'rgba(247,244,238,0.8)', border: c.goldLight, text: 'Want to <strong>address gaps</strong> before they compound into bigger problems' },
  { bg: 'rgba(255,248,231,0.8)', border: c.gold, text: 'Have a child who is <strong>capable but not yet</strong> performing to their potential' },
  { bg: 'rgba(247,244,238,0.8)', border: c.goldLight, text: 'Want <strong>NAPLAN preparation</strong> woven naturally into regular lessons' },
  { bg: 'rgba(255,248,231,0.8)', border: c.gold, text: 'Are looking for <strong>extension work</strong> for a child ahead of their class' },
  { bg: 'rgba(247,244,238,0.8)', border: c.goldLight, text: 'Want their child entering each year with <strong>confidence and momentum</strong>' },
  { bg: 'rgba(255,248,231,0.8)', border: c.gold, text: 'Value <strong>regular communication</strong> and transparent progress updates' },
];

const PrimarySchool = () => {
  const [tIdx, setTIdx] = useState(0);

  const prev = () => setTIdx(i => (i - 1 + testimonials.length) % testimonials.length);
  const next = () => setTIdx(i => (i + 1) % testimonials.length);

  const t = testimonials[tIdx];

  return (
    <div className="min-h-screen overflow-x-hidden pt-[120px]" style={{ background: c.white, color: c.navy, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <SEO
        title="Primary School Tutoring (K–6) | DA Tuition"
        description="Personalised K–6 tutoring that builds unshakeable confidence, strengthens foundations, and turns every child into a capable independent learner."
        canonicalUrl="/programs/primary-school"
      />
      <NavigationNew />
      <StickyBookButton />

      {/* HERO */}
      <section style={{ background: 'linear-gradient(135deg, #F7F4EE 0%, #FFFFFF 55%, rgba(240,203,106,0.12) 100%)', padding: '88px 52px 80px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,175,55,0.15), transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(240,203,106,0.1), transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ display: 'inline-block', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '2.5px', textTransform: 'uppercase', color: c.gold, background: c.goldPale, border: `1.5px solid ${c.goldLight}`, padding: '6px 20px', borderRadius: 999, marginBottom: 22 }}>
          Year 1–6 Primary School · NSW Curriculum Aligned
        </div>
        <h1 style={{ fontSize: 'clamp(2.6rem, 5.5vw, 4.2rem)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-2px', color: c.navy, marginBottom: 20 }}>
          Where Every Child's<br /><em style={{ fontStyle: 'normal', color: c.gold }}>Potential Blooms</em>
        </h1>
        <p style={{ fontSize: '1.12rem', color: c.muted, maxWidth: 600, margin: '0 auto 40px', lineHeight: 1.78 }}>
          Personalised tutoring that builds <strong style={{ color: c.navy }}>unshakeable confidence</strong>, strengthens foundations, and turns every child into a capable, independent learner — from Kindergarten to Year 6.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/#contact" style={{ background: c.navy, color: '#fff', border: 'none', padding: '15px 34px', borderRadius: 12, fontSize: '1rem', fontWeight: 800, cursor: 'pointer', textDecoration: 'none', display: 'inline-block' }}>
            Book an Interview
          </a>
          <a href="#year-groups" style={{ background: c.white, color: c.navy, border: `2px solid ${c.navy}`, padding: '15px 34px', borderRadius: 12, fontSize: '1rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'none', display: 'inline-block' }}>
            See Our Programs ↓
          </a>
        </div>
      </section>

      {/* STATS */}
      <div style={{ background: c.navy, padding: '30px 52px', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', borderBottom: `3px solid ${c.goldLight}` }}>
        {[
          { num: '20+', label: 'Years Serving Families' },
          { num: '500+', label: 'Students Transformed' },
          { num: '98%', label: 'Parent Satisfaction' },
          { num: '1–6', label: 'All Year Groups Covered' },
        ].map((s, i) => (
          <div key={i} style={{ textAlign: 'center', padding: '10px 50px', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.15)' : 'none' }}>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: c.goldLight, lineHeight: 1, marginBottom: 4 }}>{s.num}</div>
            <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* YEAR NAV */}
      <div id="year-groups" style={{ background: c.soft, borderBottom: `2px solid ${c.border}`, padding: '52px 52px 48px', textAlign: 'center' }}>
        <div style={{ fontSize: '0.78rem', fontWeight: 800, letterSpacing: '2.5px', textTransform: 'uppercase', color: c.muted, marginBottom: 24 }}>Select your child's year group</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap' }}>
          {[
            { label: 'Year 1 – Year 2', desc: 'Phonics, reading & early maths', to: '/programs/early-years', topColor: c.goldLight },
            { label: 'Year 3 – Year 4', desc: 'NAPLAN prep & comprehension', to: '/programs/year-3-4', topColor: c.gold },
            { label: 'Year 5 – Year 6', desc: 'Selective prep & high school ready', to: '/programs/year-5-6', topColor: c.greenMid },
          ].map((tile, i) => (
            <Link key={i} to={tile.to} style={{ background: c.white, border: `2px solid ${c.border}`, borderTop: `4px solid ${tile.topColor}`, borderRadius: 20, padding: '28px 36px', textDecoration: 'none', color: c.navy, minWidth: 220, textAlign: 'center', boxShadow: '0 2px 12px rgba(10,27,52,0.06)', display: 'block', transition: 'all .25s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-5px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 14px 36px rgba(10,27,52,0.14)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(10,27,52,0.06)'; }}
            >
              <div style={{ fontSize: '1.08rem', fontWeight: 900, marginBottom: 5 }}>{tile.label}</div>
              <div style={{ fontSize: '0.82rem', color: c.muted }}>{tile.desc}</div>
              <div style={{ marginTop: 12, fontSize: '1.1rem', color: tile.topColor }}>→</div>
            </Link>
          ))}
        </div>
      </div>

      {/* PILLARS */}
      <div style={{ padding: '76px 52px', maxWidth: 1140, margin: '0 auto' }}>
        <div style={{ fontSize: '0.74rem', fontWeight: 800, letterSpacing: '2.5px', textTransform: 'uppercase', color: c.gold, marginBottom: 10 }}>Our Three Pillars</div>
        <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 900, letterSpacing: '-1px', color: c.navy, marginBottom: 18, lineHeight: 1.2 }}>Built for Every Stage of Primary School</h2>
        <p style={{ fontSize: '1.05rem', color: c.muted, maxWidth: 680, lineHeight: 1.82 }}>
          Our program is grounded in <strong style={{ color: c.goldLight }}>three core pillars</strong> that work together — giving every child the skills, confidence, and thinking habits they need to thrive at every level.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginTop: 44 }}>
          {[
            { num: 'I', title: 'Strong Foundations', desc: '<strong>Phonics, reading fluency, handwriting,</strong> and number sense built through structured, age-appropriate practice that sticks for life.', points: ['Phonics & decoding skills', 'Reading fluency & comprehension', 'Number sense & place value'], topColor: c.goldLight },
            { num: 'II', title: 'Academic Excellence', desc: '<strong>English and Maths aligned to the NSW Curriculum,</strong> with extension work for students ready to go further and be genuinely challenged.', points: ['100% NSW Curriculum aligned', 'Extension tasks for advanced learners', 'NAPLAN preparation built in'], topColor: c.gold },
            { num: 'III', title: 'Critical Thinking', desc: '<strong>Problem-solving tasks, comprehension strategies,</strong> and worded questions that build truly independent thinkers who don\'t give up.', points: ['Multi-step problem solving', 'Inferencing & text analysis', 'Independent study habits'], topColor: c.greenMid },
          ].map((p, i) => (
            <div key={i} style={{ background: c.white, border: `2px solid ${c.border}`, borderTop: `5px solid ${p.topColor}`, borderRadius: 22, padding: 36, transition: 'all .28s', boxShadow: '0 2px 14px rgba(10,27,52,0.05)', cursor: 'default' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 18px 44px rgba(10,27,52,0.12)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 14px rgba(10,27,52,0.05)'; }}
            >
              <div style={{ width: 56, height: 56, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', fontWeight: 900, marginBottom: 22, background: c.goldPale, border: `2px solid ${c.goldLight}`, color: c.gold }}>{p.num}</div>
              <div style={{ fontSize: '1.18rem', fontWeight: 900, marginBottom: 12, color: c.navy }}>{p.title}</div>
              <p style={{ fontSize: '0.93rem', color: c.muted, lineHeight: 1.7, marginBottom: 20 }} dangerouslySetInnerHTML={{ __html: p.desc }} />
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {p.points.map((pt, j) => (
                  <li key={j} style={{ fontSize: '0.88rem', color: c.navy, padding: '5px 0 5px 22px', position: 'relative', lineHeight: 1.5 }}>
                    <span style={{ position: 'absolute', left: 0, color: c.gold, fontWeight: 900 }}>✓</span>
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* APPROACH */}
      <div style={{ background: c.soft, borderTop: `2px solid ${c.border}`, borderBottom: `2px solid ${c.border}` }}>
        <div style={{ padding: '76px 52px', maxWidth: 1140, margin: '0 auto' }}>
          <div style={{ fontSize: '0.74rem', fontWeight: 800, letterSpacing: '2.5px', textTransform: 'uppercase', color: c.gold, marginBottom: 10 }}>How We Teach</div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 900, letterSpacing: '-1px', color: c.navy, marginBottom: 14, lineHeight: 1.2 }}>Our Approach</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 54, alignItems: 'center', marginTop: 48 }} className="approach-grid-responsive">
            <div>
              <p style={{ color: c.muted, fontSize: '1.02rem', lineHeight: 1.82, marginBottom: 18 }}>At DA Tuition, we believe <strong style={{ color: c.navy }}>every child learns differently.</strong> Our tutors build genuine relationships with each student and adapt to what actually works — not a script.</p>
              <p style={{ color: c.muted, fontSize: '1.02rem', lineHeight: 1.82, marginBottom: 26 }}>We follow the <strong style={{ color: c.navy }}>NSW Curriculum</strong> so everything reinforces and extends what your child is already doing in school — never in conflict with it.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { num: '1', title: 'Small Groups (3–4 Students)', sub: 'Every child is noticed, supported, and genuinely challenged.' },
                  { num: '2', title: 'Regular Parent Reports', sub: 'Written progress updates every term — you always know where your child stands.' },
                  { num: '3', title: 'Positive Reinforcement', sub: 'Confidence and capability built together, every single session.' },
                ].map((ap, i) => (
                  <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', background: c.white, border: `2px solid ${c.border}`, borderRadius: 14, padding: '16px 18px', boxShadow: '0 2px 8px rgba(10,27,52,0.04)' }}>
                    <div style={{ flexShrink: 0, width: 38, height: 38, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 900, color: c.gold, background: c.goldPale, border: `1.5px solid ${c.goldLight}` }}>{ap.num}</div>
                    <div>
                      <strong style={{ color: c.navy, display: 'block', marginBottom: 2, fontSize: '0.94rem', fontWeight: 800 }}>{ap.title}</strong>
                      <span style={{ fontSize: '0.9rem', color: c.muted, lineHeight: 1.55 }}>{ap.sub}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Testimonial card */}
            <div style={{ background: c.white, border: `2px solid ${c.border}`, borderTop: `4px solid ${c.goldLight}`, borderRadius: 24, padding: '32px 28px', boxShadow: '0 6px 24px rgba(10,27,52,0.08)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', color: c.gold, marginBottom: 16 }}>What Parents Tell Us</div>
              <div style={{ fontSize: '2.8rem', lineHeight: 1, color: c.gold, marginBottom: 4 }}>"</div>
              <p style={{ fontSize: '0.97rem', color: c.navy, lineHeight: 1.75, fontStyle: 'italic', marginBottom: 20, minHeight: 90 }} dangerouslySetInnerHTML={{ __html: t.text }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: t.accent, border: `2.5px solid ${t.accentMid}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: t.accentText, fontSize: '0.95rem' }}>{t.initials}</div>
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: c.navy }}>{t.name}</div>
                  <div style={{ fontSize: '0.78rem', color: c.muted }}>{t.role}</div>
                  <div style={{ color: c.goldLight, fontSize: '0.85rem', letterSpacing: 2 }}>★★★★★</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  {testimonials.map((_, i) => (
                    <button key={i} onClick={() => setTIdx(i)} style={{ width: i === tIdx ? 26 : 8, height: 8, borderRadius: 4, border: 'none', background: i === tIdx ? c.navy : c.border, cursor: 'pointer', transition: 'all .2s', padding: 0 }} />
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[{ label: '←', fn: prev }, { label: '→', fn: next }].map((btn, i) => (
                    <button key={i} onClick={btn.fn} style={{ width: 36, height: 36, borderRadius: '50%', border: `2px solid ${c.border}`, background: c.white, cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{btn.label}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FIT */}
      <div style={{ padding: '76px 52px', maxWidth: 1140, margin: '0 auto' }}>
        <div style={{ fontSize: '0.74rem', fontWeight: 800, letterSpacing: '2.5px', textTransform: 'uppercase', color: c.gold, marginBottom: 10 }}>Is This Right for Us?</div>
        <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 900, letterSpacing: '-1px', color: c.navy, marginBottom: 18, lineHeight: 1.2 }}>This program is for families who…</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18, marginTop: 40 }}>
          {fitItems.map((item, i) => (
            <div key={i} style={{ background: item.bg, border: `2px solid ${item.border}`, borderRadius: 16, padding: '22px 24px', display: 'flex', gap: 14, alignItems: 'flex-start', transition: 'all .22s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 28px rgba(10,27,52,0.1)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = ''; }}
            >
              <div style={{ width: 30, height: 30, background: c.goldPale, border: `2px solid ${c.goldLight}`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.gold, fontWeight: 900, fontSize: '0.9rem', flexShrink: 0, marginTop: 1 }}>✓</div>
              <div style={{ fontSize: '0.92rem', color: c.muted, lineHeight: 1.58 }} dangerouslySetInnerHTML={{ __html: item.text }} />
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ textAlign: 'center', padding: '96px 52px', background: c.navy, borderTop: `4px solid ${c.goldLight}` }}>
        <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 900, letterSpacing: '-1.2px', marginBottom: 18, color: c.white, lineHeight: 1.15 }}>
          Give Your Child the Strongest<br />Possible Start
        </h2>
        <p style={{ fontSize: '1.08rem', color: 'rgba(255,255,255,0.75)', maxWidth: 540, margin: '0 auto 38px', lineHeight: 1.75 }}>
          No entrance exam. No pressure. We gently assess your child in the first session and tailor the program from there.
        </p>
        <a href="/#contact" style={{ background: c.goldLight, color: c.navy, border: 'none', padding: '17px 38px', borderRadius: 14, fontSize: '1rem', fontWeight: 900, cursor: 'pointer', textDecoration: 'none', display: 'inline-block' }}>
          Book an Interview →
        </a>
        <div style={{ marginTop: 18, fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)' }}>
          Free 20-minute consultation &nbsp;·&nbsp; No obligation &nbsp;·&nbsp; Limited spots each term
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .approach-grid-responsive { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <FooterNew />
    </div>
  );
};

export default PrimarySchool;
