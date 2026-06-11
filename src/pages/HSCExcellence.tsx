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
  amber: '#fef9c3', amberMid: '#fde047', amberText: '#854d0e',
  white: '#ffffff', muted: '#4a5568', border: '#e2e8f0', soft: '#f8fafc',
};

const subjects = [
  { category: 'Mathematics', color: c.blue, borderColor: c.blueMid, textColor: c.blueText, items: ['Mathematics Standard 1 & 2', 'Mathematics Advanced', 'Mathematics Extension 1', 'Mathematics Extension 2'] },
  { category: 'English', color: c.pink, borderColor: c.pinkMid, textColor: c.pinkText, items: ['English Standard', 'English Advanced', 'English Extension 1', 'English Extension 2'] },
  { category: 'Sciences', color: c.green, borderColor: c.greenMid, textColor: c.greenText, items: ['Biology', 'Chemistry', 'Physics', 'Earth & Environmental Science'] },
  { category: 'HSIE', color: c.purple, borderColor: c.purpleMid, textColor: c.purpleText, items: ['Business Studies', 'Legal Studies', 'Economics', 'Modern History'] },
];

const timeline = [
  { term: 'Term 4 (Year 11)', focus: 'Foundation Building', tasks: ['Content mastery across all subjects', 'Establishing study habits', 'Note-taking systems'], color: c.blue, borderColor: c.blueMid },
  { term: 'Term 1 (Year 12)', focus: 'Assessment Preparation', tasks: ['First major assessments', 'Essay writing & structure', 'Time management skills'], color: c.purple, borderColor: c.purpleMid },
  { term: 'Term 2 (Year 12)', focus: 'Depth & Extension', tasks: ['Past paper practice', 'Identifying weak areas', 'Trial exam preparation'], color: c.pink, borderColor: c.pinkMid },
  { term: 'Term 3 (Year 12)', focus: 'HSC Finalisation', tasks: ['Intensive trial prep', 'Exam technique mastery', 'Stress management strategies'], color: c.green, borderColor: c.greenMid },
];

const fitPoints = [
  'Your child is in <strong>Year 11 or Year 12</strong> and needs expert support to reach their ATAR goal',
  'You want <strong>subject-specific tutoring</strong> from educators who have achieved top results in those exact courses',
  'Your student is <strong>capable but not performing to their potential</strong> and needs targeted exam technique coaching',
  'You want <strong>structured support across all HSC assessment tasks</strong> — not just cramming before exams',
  'Your child is aiming for a <strong>competitive ATAR</strong> for medicine, law, engineering, or another selective course',
  'You want a centre that gives you <strong>honest, regular progress updates</strong> and a clear plan every term',
];

const testimonials = [
  { quote: '"Having gone to many other tutoring places before DA Tuition, I have seen my results improved in my 4 years of being here. Providing me with the support and knowledge for me to excel in my subjects, as well as making my time here the most enjoying and memory-making worthy."', name: 'Tiffany Lang', role: 'DA Tuition Student', initials: 'TL', accent: c.purple, accentMid: c.purpleMid, accentText: c.purpleText },
  { quote: '"The tutors at DA genuinely cared about my ATAR. They didn\'t just teach content — they showed me exactly how to write answers that get full marks. I went from mid-80s to a 94.5 ATAR."', name: 'James H.', role: 'Year 12 Graduate', initials: 'JH', accent: c.blue, accentMid: c.blueMid, accentText: c.blueText },
  { quote: '"My English marks were holding back my ATAR. In one term my teacher completely transformed how I structure responses. I got a Band 6 in Advanced English."', name: 'Sophie R.', role: 'Year 12 Graduate', initials: 'SR', accent: c.pink, accentMid: c.pinkMid, accentText: c.pinkText },
];

const HSCExcellence = () => {
  const [tIdx, setTIdx] = useState(0);
  const t = testimonials[tIdx];

  return (
    <div className="min-h-screen overflow-x-hidden pt-[120px]" style={{ background: c.white, color: c.navy, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <SEO
        title="HSC Excellence (Years 11–12) | DA Tuition"
        description="Intensive HSC preparation with expert tutors who know exactly how to maximise your ATAR across every subject."
        canonicalUrl="/hsc-excellence"
      />
      <NavigationNew />
      <StickyBookButton />

      {/* HERO */}
      <section style={{ background: 'linear-gradient(135deg, #fdf6dc 0%, #fef9c3 30%, #f3e8ff 65%, #dbeafe 100%)', padding: '88px 52px 80px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,160,23,0.2), transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(192,132,252,0.2), transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ display: 'inline-block', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '2.5px', textTransform: 'uppercase', color: c.gold, background: c.goldPale, border: `1.5px solid ${c.goldLight}`, padding: '6px 20px', borderRadius: 999, marginBottom: 22 }}>
          Years 11–12 · HSC Excellence · ATAR Maximisation
        </div>
        <h1 style={{ fontSize: 'clamp(2.6rem, 5.5vw, 4.2rem)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-2px', color: c.navy, marginBottom: 20 }}>
          Your HSC.<br /><em style={{ fontStyle: 'normal', color: c.gold }}>Your Best Result.</em>
        </h1>
        <p style={{ fontSize: '1.12rem', color: c.muted, maxWidth: 600, margin: '0 auto 40px', lineHeight: 1.78 }}>
          Intensive, personalised HSC preparation with tutors who know the syllabus inside out — and exactly <strong style={{ color: c.navy }}>how to maximise your marks</strong> in every assessment and exam.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/#contact" style={{ background: c.navy, color: '#fff', border: 'none', padding: '15px 34px', borderRadius: 12, fontSize: '1rem', fontWeight: 800, cursor: 'pointer', textDecoration: 'none', display: 'inline-block' }}>
            Book a Free Consultation
          </a>
          <a href="#subjects" style={{ background: c.white, color: c.navy, border: `2px solid ${c.navy}`, padding: '15px 34px', borderRadius: 12, fontSize: '1rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'none', display: 'inline-block' }}>
            View Subjects ↓
          </a>
        </div>
      </section>

      {/* STATS */}
      <div style={{ background: c.navy, padding: '30px 52px', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', borderBottom: `3px solid ${c.goldLight}` }}>
        {[
          { num: '20+', label: 'Years HSC Experience' },
          { num: '99+', label: 'ATAR Achievers' },
          { num: '15+', label: 'HSC Subjects Covered' },
          { num: '98%', label: 'Parent Satisfaction' },
        ].map((s, i) => (
          <div key={i} style={{ textAlign: 'center', padding: '10px 50px', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.15)' : 'none' }}>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: c.goldLight, lineHeight: 1, marginBottom: 4 }}>{s.num}</div>
            <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* SUBJECTS */}
      <div id="subjects" style={{ padding: '76px 52px', maxWidth: 1140, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <div style={{ display: 'inline-block', fontSize: '0.74rem', fontWeight: 800, letterSpacing: '2.5px', textTransform: 'uppercase', color: c.gold, background: c.goldPale, border: '1px solid #e8d280', padding: '5px 16px', borderRadius: 999, marginBottom: 16 }}>Subjects We Cover</div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 900, letterSpacing: '-1px', color: c.navy, marginBottom: 14, lineHeight: 1.2 }}>Expert Tutoring Across Every HSC Subject</h2>
          <p style={{ fontSize: '1.05rem', color: c.muted, maxWidth: 680, margin: '0 auto', lineHeight: 1.82 }}>Every subject is taught by tutors who have achieved top marks in that exact course — Band 6s, state ranks, and high ATARs.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 22 }}>
          {subjects.map((subj, i) => (
            <div key={i} style={{ background: c.white, border: `2px solid ${c.border}`, borderTop: `4px solid ${subj.borderColor}`, borderRadius: 20, padding: '28px', boxShadow: '0 2px 14px rgba(12,31,74,0.05)', transition: 'all .28s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-5px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 14px 36px rgba(12,31,74,0.12)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 14px rgba(12,31,74,0.05)'; }}
            >
              <div style={{ display: 'inline-block', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', color: subj.textColor, background: subj.color, padding: '4px 12px', borderRadius: 999, marginBottom: 16 }}>{subj.category}</div>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {subj.items.map((item, j) => (
                  <li key={j} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ color: subj.textColor, fontWeight: 900, fontSize: '0.85rem' }}>✓</span>
                    <span style={{ fontSize: '0.9rem', color: c.navy }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* TIMELINE */}
      <div style={{ background: c.soft, borderTop: `2px solid ${c.border}`, borderBottom: `2px solid ${c.border}` }}>
        <div style={{ padding: '76px 52px', maxWidth: 1140, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <div style={{ display: 'inline-block', fontSize: '0.74rem', fontWeight: 800, letterSpacing: '2.5px', textTransform: 'uppercase', color: c.gold, background: c.goldPale, border: '1px solid #e8d280', padding: '5px 16px', borderRadius: 999, marginBottom: 16 }}>The Journey</div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 900, letterSpacing: '-1px', color: c.navy, marginBottom: 14, lineHeight: 1.2 }}>Your HSC Roadmap</h2>
            <p style={{ fontSize: '1.05rem', color: c.muted, maxWidth: 600, margin: '0 auto', lineHeight: 1.82 }}>We plan your entire HSC journey term by term — so nothing falls through the cracks.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 22 }}>
            {timeline.map((phase, i) => (
              <div key={i} style={{ background: c.white, border: `2px solid ${c.border}`, borderTop: `4px solid ${phase.borderColor}`, borderRadius: 20, padding: '28px', boxShadow: '0 2px 14px rgba(12,31,74,0.05)' }}>
                <div style={{ display: 'inline-block', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', background: phase.color, color: phase.borderColor === c.blueMid ? c.blueText : phase.borderColor === c.purpleMid ? c.purpleText : phase.borderColor === c.pinkMid ? c.pinkText : c.greenText, padding: '3px 12px', borderRadius: 999, marginBottom: 14 }}>{phase.term}</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 900, color: c.navy, marginBottom: 14 }}>{phase.focus}</div>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {phase.tasks.map((task, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <div style={{ width: 22, height: 22, borderRadius: 6, background: phase.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 900, color: phase.borderColor === c.blueMid ? c.blueText : phase.borderColor === c.purpleMid ? c.purpleText : phase.borderColor === c.pinkMid ? c.pinkText : c.greenText, flexShrink: 0, marginTop: 1 }}>✓</div>
                      <span style={{ fontSize: '0.88rem', color: c.muted, lineHeight: 1.5 }}>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* APPROACH + TESTIMONIAL */}
      <div style={{ padding: '76px 52px', maxWidth: 1140, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 54, alignItems: 'center' }} className="hsc-approach-responsive">
          <div>
            <div style={{ display: 'inline-block', fontSize: '0.74rem', fontWeight: 800, letterSpacing: '2.5px', textTransform: 'uppercase', color: c.gold, background: c.goldPale, border: '1px solid #e8d280', padding: '5px 16px', borderRadius: 999, marginBottom: 16 }}>Our Approach</div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 900, letterSpacing: '-1px', color: c.navy, marginBottom: 14, lineHeight: 1.2 }}>More Than Content — We Teach How to Win</h2>
            <p style={{ fontSize: '1.02rem', color: c.muted, lineHeight: 1.82, marginBottom: 18 }}>The HSC isn't just about knowing the content — it's about knowing <strong style={{ color: c.navy }}>exactly how markers award marks</strong>. Our tutors have been there, and they teach students how to write, structure, and present answers that score at the top.</p>
            <p style={{ fontSize: '1.02rem', color: c.muted, lineHeight: 1.82, marginBottom: 26 }}>We work term by term with a clear plan — no cramming, no guesswork.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { icon: '🎯', bg: c.amber, title: 'Marker-focused responses', sub: 'We teach exactly what gets full marks in each question type.' },
                { icon: '📋', bg: c.blue, title: 'Assessment task support', sub: 'Help with every school assessment, not just the HSC exams.' },
                { icon: '📊', bg: c.purple, title: 'Progress tracking', sub: 'Term-by-term reports so you always know where your child stands.' },
                { icon: '🤝', bg: c.green, title: 'Small groups (3–4 students)', sub: 'Every Year 12 student gets individual attention every session.' },
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

          {/* Testimonial */}
          <div style={{ background: c.white, border: `2px solid ${c.border}`, borderTop: `4px solid ${c.goldLight}`, borderRadius: 24, padding: '32px 28px', boxShadow: '0 6px 24px rgba(12,31,74,0.08)' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', color: c.gold, marginBottom: 16 }}>What Our Students Say</div>
            <div style={{ fontSize: '2.8rem', lineHeight: 1, color: c.goldLight, marginBottom: 4 }}>"</div>
            <p style={{ fontSize: '0.97rem', color: c.navy, lineHeight: 1.75, fontStyle: 'italic', marginBottom: 20, minHeight: 110 }}>{t.quote}</p>
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

      {/* FIT */}
      <div style={{ background: c.amber, borderTop: `2px solid ${c.amberMid}`, borderBottom: `2px solid ${c.amberMid}` }}>
        <div style={{ padding: '72px 52px', maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ display: 'inline-block', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '2.5px', textTransform: 'uppercase', color: c.gold, background: c.goldPale, border: '1px solid #e8d280', padding: '5px 16px', borderRadius: 999, marginBottom: 16 }}>Is This Right For Us?</div>
            <h2 style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.8rem)', fontWeight: 900, letterSpacing: '-1px', color: c.navy, marginBottom: 14, lineHeight: 1.2 }}>DA Tuition HSC Excellence Is Perfect If…</h2>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 36 }}>
            {fitPoints.map((pt, i) => (
              <li key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', background: c.white, border: `1.5px solid ${c.amberMid}`, borderRadius: 14, padding: '18px 22px' }}>
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
          The HSC Is Too Important<br />to Leave to Chance
        </h2>
        <p style={{ fontSize: '1.08rem', color: 'rgba(255,255,255,0.75)', maxWidth: 540, margin: '0 auto 38px', lineHeight: 1.75 }}>
          Your ATAR opens doors — or closes them. Start preparing now with tutors who know exactly how to get you there.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
          <a href="/#contact" style={{ background: c.goldLight, color: c.navy, border: 'none', padding: '17px 38px', borderRadius: 14, fontSize: '1rem', fontWeight: 900, cursor: 'pointer', textDecoration: 'none', display: 'inline-block' }}>
            Book a Free Consultation →
          </a>
          <Link to="/programs/high-school" style={{ background: 'transparent', color: '#fff', border: '2px solid rgba(255,255,255,0.4)', padding: '17px 38px', borderRadius: 14, fontSize: '1rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'none', display: 'inline-block' }}>
            View Years 7–10 →
          </Link>
        </div>
        <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)' }}>
          Limited spots each term &nbsp;·&nbsp; No lock-in contract &nbsp;·&nbsp; Free 20-minute consultation included
        </div>
      </div>

      <style>{`@media(max-width:768px){.hsc-approach-responsive{grid-template-columns:1fr!important;}}`}</style>
      <FooterNew />
    </div>
  );
};

export default HSCExcellence;
