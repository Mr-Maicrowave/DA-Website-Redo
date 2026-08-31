import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Clock3, HandHeart, Home, Phone, ShieldCheck, Star, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import SEO from '@/components/SEO';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import { ConsultationContent } from '@/features/interview-wizard/ConsultationContent';
import { InterviewWizard } from '@/features/interview-wizard/InterviewWizard';
import { submitInterviewLocally } from '@/features/interview-wizard/submission';
import type { InterviewFormData } from '@/features/interview-wizard/types';
import './BookInterview.css';
import './BookInterviewReference.css';

const C = { navy: '#0A1B34', gold: '#D4AF37' } as const;
const BENEFITS = [
  { icon: Users, text: 'Personalised Recommendations' },
  { icon: ShieldCheck, text: 'Expert Guidance You Can Trust' },
  { icon: HandHeart, text: 'A Supportive Start to Their Journey' },
  { icon: Star, text: 'Small Groups Big Impact' },
] as const;

function InterviewConfirmation({ parentName, studentName }: { parentName: string; studentName: string }) {
  return <div className="py-4 text-center">
    <motion.div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full" style={{ background: C.gold }} initial={{ scale: .5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
      <CheckCircle className="h-9 w-9" style={{ color: C.navy }} aria-hidden="true" />
    </motion.div>
    <p className="mb-3 text-xs font-black uppercase tracking-[.25em]" style={{ color: C.gold }}>Details received</p>
    <h2 className="font-serif text-4xl text-white">Thank you{parentName ? `, ${parentName}` : ''} — we’ll take it from here.</h2>
    <p className="mx-auto mt-5 max-w-lg leading-7 text-white/70">We’ll review what you’ve shared before getting in touch, so the conversation can start with {studentName || 'your child'} rather than with paperwork.</p>
    <div className="interview-confirmation-journey"><b>✓ Details received</b><span>→</span><b>DA reviews</b><span>→</span><b>We speak with you</b><span>→</span><b>Recommendation</b><span>→</span><b>Right starting point</b></div>
    <p className="mt-4 text-sm" style={{ color: C.gold }}>Most enquiries are contacted within 1 business day.</p>
    <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
      <Link to="/" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-6 font-bold" style={{ background: C.gold, color: C.navy }}><Home className="h-4 w-4" />Return Home</Link>
      <a href="tel:0401940207" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border px-6 font-bold" style={{ borderColor: C.gold, color: C.gold }}><Phone className="h-4 w-4" />Call 0401 940 207</a>
    </div>
  </div>;
}

const BookInterview = () => {
  const [completedData, setCompletedData] = useState<InterviewFormData | null>(null);
  return <div className="min-h-screen interview-page">
    <SEO title="Book an Interview | DA Tuition" description="Book an interview with DA Tuition — a premium K-12 tutoring service in Canley Heights." />
    <NavigationNew />
    <section className="interview-hero">
      <div className="interview-hero-room" aria-hidden="true" />
      <div className="interview-hero-inner">
        <motion.div className="interview-hero-copy" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }}>
          <h1>Book an<br />Interview</h1>
          <div className="interview-brush" aria-hidden="true" />
          <p className="interview-handwritten">A thoughtful conversation today<br /><span>can shape their tomorrow. ♡</span></p>
          <p className="interview-intro">Tell us a little about your child and we’ll recommend the most suitable subject, level and pathway.</p>
        </motion.div>
        <motion.img className="interviewers" src="/images/interview/interviewers.png" alt="Two DA Tuition interviewers ready to meet your family" initial={{ opacity: 0, x: 25, scale: .98 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={{ duration: .9, ease: 'easeOut' }} />
      </div>
    </section>
    <motion.section className="interview-benefits" aria-label="Why families choose DA Tuition" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .2, duration: .6 }}>
      {BENEFITS.map(({ icon: Icon, text }, index) => <div className="interview-benefit" key={text}><Icon aria-hidden="true" /><span><b>0{index + 1}</b>{text}</span></div>)}
    </motion.section>
    <div className="interview-form-canvas">
      <aside className="interview-side-note" aria-hidden="true">We’re here<br />to listen,<br />understand and<br />guide your family<br />every step of<br />the way. ♡</aside>
      <div className="interview-form-wrap">
        <div className="interview-form-card" style={{ background: completedData ? C.navy : 'linear-gradient(160deg, #FDFAF5 0%, #FFFFFF 55%)', border: '1px solid rgba(212,175,55,.2)', boxShadow: '0 6px 8px rgba(10,27,52,.08)' }}>
          {!completedData ? <div className="relative h-[2px] w-full" style={{ background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)` }} /> : null}
          <div className="interview-form-padding">
            {!completedData ? <><p className="interview-duration"><Clock3 aria-hidden="true" />Takes about 5 minutes</p><InterviewWizard submitInterview={submitInterviewLocally} onSuccess={data => setCompletedData(data)} /></> : <InterviewConfirmation parentName={completedData.parentFirstName} studentName={completedData.studentFirstName} />}
          </div>
        </div>
      </div>
    </div>
    {!completedData ? <ConsultationContent /> : null}
    <FooterNew />
  </div>;
};

export default BookInterview;
