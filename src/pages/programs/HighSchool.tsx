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
  purple: '#f3e8ff', purpleMid: '#c084fc', purpleText: '#6b21a8',
  green: '#dcfce7', greenMid: '#86efac', greenText: '#166534',
  blue: '#dbeafe', blueMid: '#93c5fd', blueText: '#1d4ed8',
  orange: '#fff7ed', orangeMid: '#fdba74', orangeText: '#c2410c',
  white: '#ffffff', muted: '#4a5568', border: '#e2e8f0', soft: '#f8fafc',
};

const testimonials = [
  { quote: '"My marks have been extremely excellent because she encourages us to try and do well. She makes any problem so much easier to understand and gives me helpful advice that will benefit me during the exam."', name: 'Chau Ho', role: 'Year 10 Student', initials: 'CH', accent: c.blue, accentMid: c.blueMid, accentText: c.blueText },
  { quote: '"DA Tuition helped me go from a C to an A in Maths in one term. The tutors genuinely care about your progress and push you to do your best."', name: 'Marcus T.', role: 'Year 9 Student', initials: 'MT', accent: c.purple, accentMid: c.purpleMid, accentText: c.purpleText },
  { quote: '"The structured approach to essay writing completely changed how I approach English. I went from dreading assignments to actually enjoying them."', name: 'Aisha K.', role: 'Year 8 Student', initials: 'AK', accent: c.pink, accentMid: c.pinkMid, accentText: c.pinkText },
];

const yearLevels = [
  { year: 'Year 7', focus: ['Transition support from primary', 'Organisation & study skills', 'Research methods', 'Essay foundations'], topColor: c.pinkMid, checkColor: c.pinkText },
  { year: 'Year 8', focus: ['Advanced algebra & equations', 'Science report writing', 'Critical text analysis', 'Building study routines'], topColor: c.purpleMid, checkColor: c.purpleText },
  { year: 'Year 9', focus: ['Subject selection guidance', 'Extended responses', 'Advanced mathematics', 'Exam techniques'], topColor: c.blueMid, checkColor: c.blueText },
  { year: 'Year 10', focus: ['RoSA preparation', 'HSC subject selection', 'Advanced writing skills', 'Career exploration'], topColor: c.greenMid, checkColor: c.greenText },
];

const subjects = [
  { name: 'Mathematics', sub: 'Standard, Advanced & Extension', icon: '📐', bg: c.blue, text: c.blueText },
  { name: 'English', sub: 'Standard & Advanced', icon: '📖', bg: c.pink, text: c.pinkText },
  { name: 'Sciences', sub: 'Biology, Chemistry & Physics', icon: '🔬', bg: c.green, text: c.greenText },
  { name: 'Commerce & Economics', sub: 'Business Studies & Legal', icon: '📊', bg: c.purple, text: c.purpleText },
];

const fitPoints = [
  'Your child is in <strong>Year 7–10</strong> and needs help adjusting to the higher expectations of high school',
  'Your student is <strong>capable but not performing to their potential</strong> — and needs targeted support to get there',
  'You want <strong>NAPLAN and RoSA preparation</strong> woven naturally into regular lessons',
  'Your child is <strong>struggling with a specific subject</strong> and needs focused, expert help',
  'You want to <strong>build study skills and habits</strong> now so the HSC years are far less stressful',
  'You value a tuition centre that gives you <strong>clear, honest progress updates</strong> every single term',
];

const HighSchool = () => {
  const [tIdx, setTIdx] = useState(0);
  const t = testimonials[tIdx];

  return (
    <div className="min-h-screen overflow-x-hidden pt-[120px]" style={{ background: c.white, color: c.navy, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <SEO
        title="High School Tutoring (Years 7–10) | DA Tuition"
        description="Expert tutoring for Years 7–10 that builds confidence, closes gaps, and sets students up for HSC success."
        canonicalUrl="/programs/high-school"
      />
      <NavigationNew />
      <StickyBookButton />

      {/* HERO */}
      <section style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 35%, #e0e7ff 65%, #f0fdf4 100%)', padding: '88px 52px 80px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle, rgba(147,197,253,0.3), transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(134,239,172,0.2), transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ display: 'inline-block', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '2.5px', textTransform: 'uppercase', color: c.gold, background: c.goldPale, border: `1.5px solid ${c.goldLight}`, padding: '6px 20px', borderRadius: 999, marginBottom: 22 }}>
          Years 7–10 · High School · NSW Curriculum Aligned
        </div>
        <h1 style={{ fontSize: 'clamp(2.6rem, 5.5vw, 4.2rem)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-2px', color: c.navy, marginBottom: 20 }}>
          High School Done <em style={{ fontStyle: 'normal', color: c.blueText }}>Right</em>
        </h1>
        <p style={{ fontSize: '1.12rem', color: c.muted, maxWidth: 600, margin: '0 auto 40px', lineHeight: 1.78 }}>
          The transition to high school brings new pressures. We give students the <strong style={{ color: c.navy }}>skills, confidence, and habits</strong> they need to thrive — not just survive — from Year 7 all the way to the HSC.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/#contact" style={{ background: c.navy, color: '#fff', border: 'none', padding: '15px 34px', borderRadius: 12, fontSize: '1rem', fontWeight: 800, cursor: 'pointer', textDecoration: 'none', display: 'inline-block' }}>
            Book a Free Consultation
          </a>
          <a href="#year-groups" style={{ background: c.white, color: c.navy, border: `2px solid ${c.navy}`, padding: '15px 34px', borderRadius: 12, fontSize: '1rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'none', display: 'inline-block' }}>
            See Year Groups ↓
          </a>
        </div>
      </section>

      {/* STATS */}
      <div style={{ background: c.navy, padding: '30px 52px', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', borderBottom: `3px solid ${c.goldLight}` }}>
        {[
          { num: '20+', label: 'Years Serving Families' },
          { num: '500+', label: 'Students Transformed' },
          { num: '7–10', label: 'All Year Groups Covered' },
          { num: '98%', label: 'Parent Satisfaction' },
        ].map((s, i) => (
          <div key={i} style={{ textAlign: 'center', padding: '10px 50px', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.15)' : 'none' }}>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: c.goldLight, lineHeight: 1, marginBottom: 4 }}>{s.num}</div>
            <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* YEAR GROUPS */}
      <div id="year-groups" style={{ padding: '76px 52px', maxWidth: 1140, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <div style={{ display: 'inline-block', fontSize: '0.74rem', fontWeight: 800, letterSpacing: '2.5px', textTransform: 'uppercase', color: c.gold, background: c.goldPale, border: '1px solid #e8d280', padding: '5px 16px', borderRadius: 999, marginBottom: 16 }}>Year-by-Year Support</div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 900, letterSpacing: '-1px', color: c.navy, marginBottom: 14, lineHeight: 1.2 }}>Tailored for Every Stage of High School</h2>
          <p style={{ fontSize: '1.05rem', color: c.muted, maxWidth: 680, margin: '0 auto', lineHeight: 1.82 }}>Each year brings unique challenges. Our curriculum adapts to meet students exactly where they are.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 22 }}>
          {yearLevels.map((level, i) => (
            <div key={i} style={{ background: c.white, border: `2px solid ${c.border}`, borderTop: `4px solid ${level.topColor}`, borderRadius: 20, padding: '32px 28px', boxShadow: '0 2px 14px rgba(12,31,74,0.05)', transition: 'all .28s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-5px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 14px 36px rgba(12,31,74,0.12)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 14px rgba(12,31,74,0.05)'; }}
            >
              <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: c.navy, marginBottom: 20 }}>{level.year}</h3>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {level.focus.map((item, j) => (
                  <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <span style={{ color: level.checkColor, fontWeight: 900, flexShrink: 0, marginTop: 1 }}>✓</span>
                    <span style={{ fontSize: '0.9rem', color: c.navy, lineHeight: 1.4 }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* APPROACH + TESTIMONIAL */}
      <div style={{ background: c.soft, borderTop: `2px solid ${c.border}`, borderBottom: `2px solid ${c.border}` }}>
        <div style={{ padding: '76px 52px', maxWidth: 1140, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 54, alignItems: 'center' }} className="hs-approach-responsive">
            <div>
              <div style={{ display: 'inline-block', fontSize: '0.74rem', fontWeight: 800, letterSpacing: '2.5px', textTransform: 'uppercase', color: c.gold, background: c.goldPale, border: '1px solid #e8d280', padding: '5px 16px', borderRadius: 999, marginBottom: 16 }}>Beyond Subject Tutoring</div>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 900, letterSpacing: '-1px', color: c.navy, marginBottom: 14, lineHeight: 1.2 }}>We Build the Whole Student</h2>
              <p style={{ fontSize: '1.02rem', color: c.muted, lineHeight: 1.82, marginBottom: 18 }}>High school success requires more than subject knowledge. Our tutors build <strong style={{ color: c.navy }}>genuine relationships</strong> with each student and develop the skills that carry them through every exam — and beyond.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 26 }}>
                {[
                  { icon: '⏰', bg: c.blue, title: 'Time Management', sub: 'Balancing multiple subjects and extracurriculars effectively.' },
                  { icon: '📝', bg: c.pink, title: 'Note-Taking & Study Systems', sub: 'Effective methods tailored for each subject.' },
                  { icon: '🎯', bg: c.green, title: 'Exam Preparation', sub: 'Strategic revision techniques and stress management.' },
                  { icon: '🎓', bg: c.purple, title: 'RoSA & HSC Pathways', sub: 'Subject selection guidance and Year 10 milestone support.' },
                ].map((ap, i) => (
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

            {/* Testimonial carousel */}
            <div style={{ background: c.white, border: `2px solid ${c.border}`, borderTop: `4px solid ${c.blueMid}`, borderRadius: 24, padding: '32px 28px', boxShadow: '0 6px 24px rgba(12,31,74,0.08)' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', color: c.gold, marginBottom: 16 }}>What Students Say</div>
              <div style={{ fontSize: '2.8rem', lineHeight: 1, color: c.blueMid, marginBottom: 4 }}>"</div>
              <p style={{ fontSize: '0.97rem', color: c.navy, lineHeight: 1.75, fontStyle: 'italic', marginBottom: 20, minHeight: 100 }}>{t.quote}</p>
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
                  {[{ l: '←', fn: () => setTIdx(i => (i - 1 + testimonials.length) % testimonials.length) }, { l: '→', fn: () => setTIdx(i => (i + 1) % testimonials.length) }].map((btn, i) => (
                    <button key={i} onClick={btn.fn} style={{ width: 36, height: 36, borderRadius: '50%', border: `2px solid ${c.border}`, background: c.white, cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{btn.l}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SUBJECTS */}
      <div style={{ padding: '76px 52px', maxWidth: 1140, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <div style={{ display: 'inline-block', fontSize: '0.74rem', fontWeight: 800, letterSpacing: '2.5px', textTransform: 'uppercase', color: c.gold, background: c.goldPale, border: '1px solid #e8d280', padding: '5px 16px', borderRadius: 999, marginBottom: 16 }}>Subjects</div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 900, letterSpacing: '-1px', color: c.navy, marginBottom: 14, lineHeight: 1.2 }}>Comprehensive Subject Support</h2>
          <p style={{ fontSize: '1.05rem', color: c.muted, maxWidth: 580, margin: '0 auto', lineHeight: 1.82 }}>Expert tutoring across all core subjects, aligned with the NSW curriculum.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 22 }}>
          {subjects.map((s, i) => (
            <div key={i} style={{ background: c.white, border: `2px solid ${c.border}`, borderTop: `4px solid`, borderTopColor: s.bg === c.blue ? c.blueMid : s.bg === c.pink ? c.pinkMid : s.bg === c.green ? c.greenMid : c.purpleMid, borderRadius: 20, padding: '28px', boxShadow: '0 2px 12px rgba(12,31,74,0.05)', transition: 'all .25s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 30px rgba(12,31,74,0.1)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(12,31,74,0.05)'; }}
            >
              <div style={{ width: 48, height: 48, borderRadius: 14, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: 16 }}>{s.icon}</div>
              <div style={{ fontSize: '1.08rem', fontWeight: 900, color: c.navy, marginBottom: 6 }}>{s.name}</div>
              <div style={{ fontSize: '0.85rem', color: c.muted }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FIT */}
      <div style={{ background: c.blue, borderTop: `2px solid ${c.blueMid}`, borderBottom: `2px solid ${c.blueMid}` }}>
        <div style={{ padding: '72px 52px', maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ display: 'inline-block', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '2.5px', textTransform: 'uppercase', color: c.gold, background: c.goldPale, border: '1px solid #e8d280', padding: '5px 16px', borderRadius: 999, marginBottom: 16 }}>Is This Right For Us?</div>
            <h2 style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.8rem)', fontWeight: 900, letterSpacing: '-1px', color: c.navy, marginBottom: 14, lineHeight: 1.2 }}>DA Tuition High School Is Perfect If…</h2>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 36 }}>
            {fitPoints.map((pt, i) => (
              <li key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', background: c.white, border: `1.5px solid ${c.blueMid}`, borderRadius: 14, padding: '18px 22px' }}>
                <div style={{ width: 28, height: 28, background: c.goldPale, border: `1.5px solid ${c.goldLight}`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.gold, fontWeight: 900, fontSize: '0.85rem', flexShrink: 0, marginTop: 1 }}>✓</div>
                <span style={{ fontSize: '0.95rem', color: c.muted, lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: pt }} />
              </li>
            ))}
          </ul>
          <div style={{ textAlign: 'center' }}>
            <a href="/#contact" style={{ background: c.navy, color: '#fff', border: 'none', padding: '16px 36px', borderRadius: 12, fontSize: '1rem', fontWeight: 800, cursor: 'pointer', textDecoration: 'none', display: 'inline-block' }}>
              Book a Free Consultation
            </a>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ textAlign: 'center', padding: '96px 52px', background: c.navy, borderTop: `4px solid ${c.goldLight}` }}>
        <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 900, letterSpacing: '-1.2px', marginBottom: 18, color: c.white, lineHeight: 1.15 }}>
          Ready to Unlock Your<br />Teen's Potential?
        </h2>
        <p style={{ fontSize: '1.08rem', color: 'rgba(255,255,255,0.75)', maxWidth: 540, margin: '0 auto 38px', lineHeight: 1.75 }}>
          Years 7–10 lay the foundation for HSC success. Join hundreds of students achieving their personal best with DA Tuition.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
          <a href="/#contact" style={{ background: c.goldLight, color: c.navy, border: 'none', padding: '17px 38px', borderRadius: 14, fontSize: '1rem', fontWeight: 900, cursor: 'pointer', textDecoration: 'none', display: 'inline-block' }}>
            Book a Free Consultation →
          </a>
          <Link to="/hsc-excellence" style={{ background: 'transparent', color: '#fff', border: `2px solid rgba(255,255,255,0.4)`, padding: '17px 38px', borderRadius: 14, fontSize: '1rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'none', display: 'inline-block' }}>
            View HSC Program →
          </Link>
        </div>
        <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)' }}>
          Free 20-minute consultation &nbsp;·&nbsp; No obligation &nbsp;·&nbsp; Limited spots each term
        </div>
      </div>

      <style>{`@media(max-width:768px){.hs-approach-responsive{grid-template-columns:1fr!important;}}`}</style>
      <FooterNew />
    </div>
  );
};

export default HighSchool;
