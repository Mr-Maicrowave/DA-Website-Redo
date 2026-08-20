import { FormEvent, useState } from 'react';
import { CheckCircle2, ChevronRight, Clock3, Mail, MapPin, Phone } from 'lucide-react';
import SEO from '@/components/SEO';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';

const C = {
  navy: '#0A1B34',
  gold: '#D4AF37',
  goldL: '#F0C86A',
  cream: '#F7F4EE',
  cream2: '#EDE5D4',
  white: '#FAFAF8',
} as const;

const serif = "'Cormorant Garamond', Georgia, serif";
const sans = "'DM Sans', 'Inter', sans-serif";

const yearLevels = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6', 'Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11', 'Year 12'];
const enquiryTopics = ['Starting tuition', 'Subjects or programs', 'Fees and payments', 'Class times or availability', 'An existing enrolment', 'Something else'];

const fieldClass = 'mt-2 w-full rounded-md border border-brand-navy/20 bg-white px-4 py-3 font-normal text-brand-navy outline-none transition placeholder:font-normal placeholder:text-brand-navy/45 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20';

const ContactUs = () => {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [topic, setTopic] = useState('');
  const [yearLevel, setYearLevel] = useState('');

  const submitEnquiry = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    const form = event.currentTarget;
    const details = new FormData(form);
    if (String(details.get('_honey') ?? '')) {
      setSubmitted(true);
      setIsSubmitting(false);
      return;
    }
    const parent = String(details.get('parentName') ?? '');
    const email = String(details.get('email') ?? '');
    const phone = String(details.get('phone') ?? '');
    const child = String(details.get('childName') ?? '');
    const year = String(details.get('yearLevel') ?? '');
    const topic = String(details.get('topic') ?? '');
    const message = String(details.get('message') ?? '');
    try {
      const response = await fetch('https://formsubmit.co/ajax/serina.h1805@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          parent_or_guardian: parent,
          email,
          mobile_number: phone,
          student_name: child || 'Not provided',
          student_year_level: year || 'Not provided',
          enquiry_topic: topic,
          message,
          _subject: `DA Tuition enquiry from ${parent}`,
          _template: 'table',
          _honey: '',
        }),
      });
      if (!response.ok) throw new Error('Unable to send enquiry');
      setSubmitted(true);
      setTopic('');
      setYearLevel('');
      form.reset();
    } catch {
      setSubmitError('We could not send your enquiry just now. Please call 0401 940 207 or email us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ background: C.cream, color: C.navy, fontFamily: sans }}>
      <SEO title="Contact Us" description="Contact DA Tuition with your question, and our team will help you find the right next step for your child." canonicalUrl="/contact" />
      <NavigationNew />

      <main>
      <section aria-label="Contact DA Tuition" style={{ maxWidth: 1120, margin: '0 auto', padding: 'clamp(122px, 13vw, 164px) 24px 0' }}>
        <div className="relative isolate min-h-[300px] overflow-hidden rounded-2xl sm:min-h-[360px]">
          <img
            src="/images/programs/highschool-tutor-1on1-1-contact-enhanced.png"
            alt="A DA Tuition tutor smiling as she helps a student"
            className="absolute inset-0 h-full w-full object-cover brightness-[1.02] contrast-[1.02] saturate-[1.02]"
            style={{ objectPosition: '0% center', transform: 'translateX(18%) scale(1.05)', transformOrigin: 'right center' }}
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(90deg, rgba(10,27,52,.98) 0%, rgba(10,27,52,.9) 36%, rgba(10,27,52,.38) 62%, rgba(10,27,52,.04) 100%)' }}
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0A1B34]/65 to-transparent" />

          <div className="relative z-10 flex min-h-[300px] items-end p-6 sm:min-h-[360px] sm:p-10">
            <div style={{ maxWidth: 460 }}>
              <p style={{ color: C.goldL, fontSize: '.76rem', fontWeight: 800, letterSpacing: '.14em', textTransform: 'uppercase', margin: 0 }}>Contact Us</p>
              <p style={{ color: C.white, fontFamily: serif, fontSize: 'clamp(2rem, 4vw, 3.25rem)', fontWeight: 500, lineHeight: 1.02, letterSpacing: '-.025em', margin: '10px 0 0', textWrap: 'balance' }}>A friendly conversation can make all the difference.</p>
            </div>
          </div>
        </div>
      </section>

        <section id="enquiry" className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.5fr)_minmax(260px,.75fr)]" style={{ maxWidth: 1120, margin: '0 auto', padding: 'clamp(44px, 6vw, 72px) 24px clamp(56px, 8vw, 96px)', gap: 'clamp(32px, 6vw, 80px)', alignItems: 'start', scrollMarginTop: 24 }}>
          <div>
            <p style={{ color: '#8a6810', fontSize: '.78rem', fontWeight: 800, letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 12 }}>Send an enquiry</p>
            <h1 style={{ fontFamily: serif, fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 500, letterSpacing: '-.03em', lineHeight: 1.05, margin: 0, textWrap: 'balance' }}>How can we help?</h1>
            <p style={{ color: 'rgba(10,27,52,.68)', maxWidth: 580, lineHeight: 1.75, margin: '14px 0 30px' }}>Share a few details and our team will point you towards the right next step. Fields marked with an asterisk are required.</p>

            {submitted ? <div role="status" className="rounded-xl border border-brand-gold/40 bg-white p-7" style={{ boxShadow: '0 6px 20px rgba(10,27,52,.08)' }}><CheckCircle2 size={30} color={C.gold} /><h2 style={{ fontFamily: serif, fontSize: '2rem', fontWeight: 500, margin: '14px 0 8px' }}>Thank you. We have received your enquiry.</h2><p style={{ color: 'rgba(10,27,52,.7)', lineHeight: 1.7 }}>A member of the DA Tuition team will be in touch soon.</p></div> : <form onSubmit={submitEnquiry} className="rounded-xl bg-white p-5 sm:p-8" style={{ boxShadow: '0 6px 20px rgba(10,27,52,.08)' }}>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="text-sm font-bold text-brand-navy">Parent or guardian name *<input required name="parentName" autoComplete="name" className={fieldClass} placeholder="Your full name" /></label>
                <label className="text-sm font-bold text-brand-navy">Email address *<input required name="email" type="email" autoComplete="email" className={fieldClass} placeholder="you@example.com" /></label>
                <label className="text-sm font-bold text-brand-navy">Mobile number *<input required name="phone" type="tel" autoComplete="tel" className={fieldClass} placeholder="04XX XXX XXX" /></label>
                <label className="text-sm font-bold text-brand-navy">What can we help with? *<select required name="topic" value={topic} onChange={(event) => setTopic(event.target.value)} className={`${fieldClass} ${topic ? 'text-brand-navy' : 'text-brand-navy/45'}`}><option value="" disabled>Select an option</option>{enquiryTopics.map((enquiryTopic) => <option key={enquiryTopic}>{enquiryTopic}</option>)}</select></label>
                <label className="text-sm font-bold text-brand-navy">Student name <input name="childName" className={fieldClass} placeholder="Optional" /></label>
                <label className="text-sm font-bold text-brand-navy">Student year level <select name="yearLevel" value={yearLevel} onChange={(event) => setYearLevel(event.target.value)} className={`${fieldClass} ${yearLevel ? 'text-brand-navy' : 'text-brand-navy/45'}`}><option value="">Select year level</option>{yearLevels.map((year) => <option key={year}>{year}</option>)}</select></label>
              </div>
              <label className="mt-5 block text-sm font-bold text-brand-navy">Your question or enquiry *<textarea required name="message" rows={6} className={fieldClass} placeholder="For example, the subjects your child needs help with, when you hope to start, or anything you would like us to know." /></label>
              <input type="text" name="_honey" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
              <button type="submit" disabled={isSubmitting} className="mt-6 inline-flex items-center rounded-full px-6 py-3.5 text-sm font-bold transition hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-65" style={{ background: C.navy, color: C.white }}>{isSubmitting ? 'Sending enquiry...' : 'Send enquiry'} <ChevronRight size={18} className="ml-2" /></button>
              {submitError ? <p role="alert" className="mt-4 text-sm font-medium text-red-700">{submitError}</p> : <p className="mt-4 text-xs leading-5 text-brand-navy/60">Your enquiry will be sent directly to the DA Tuition team. You can also call us directly.</p>}
            </form>}
          </div>

          <aside style={{ background: C.cream2, borderRadius: 12, padding: '28px 24px' }}>
            <h2 style={{ fontFamily: serif, fontSize: '2rem', fontWeight: 500, lineHeight: 1.1, margin: 0 }}>Prefer to speak with us?</h2>
            <p style={{ color: 'rgba(10,27,52,.68)', lineHeight: 1.65, margin: '12px 0 22px' }}>Call or email our Canley Heights team. We are happy to answer a quick question.</p>
            <div className="space-y-5">
              <a href="tel:0401940207" className="flex items-start gap-3 text-brand-navy no-underline"><span className="mt-0.5 rounded-full bg-brand-gold/20 p-2"><Phone size={18} /></span><span><strong className="block">Call us</strong><span className="text-sm text-brand-navy/70">0401 940 207</span></span></a>
              <a href="mailto:info@datuition.com.au" className="flex items-start gap-3 text-brand-navy no-underline"><span className="mt-0.5 rounded-full bg-brand-gold/20 p-2"><Mail size={18} /></span><span><strong className="block">Email us</strong><span className="text-sm text-brand-navy/70">info@datuition.com.au</span></span></a>
              <a href="https://maps.google.com/?q=229+Canley+Vale+Rd+Canley+Heights+NSW+2166" target="_blank" rel="noreferrer" className="flex items-start gap-3 text-brand-navy no-underline"><span className="mt-0.5 rounded-full bg-brand-gold/20 p-2"><MapPin size={18} /></span><span><strong className="block">Visit the centre</strong><span className="text-sm text-brand-navy/70">Level 1, 229 Canley Vale Rd<br />Canley Heights NSW 2166</span></span></a>
              <div className="flex items-start gap-3"><span className="mt-0.5 rounded-full bg-brand-gold/20 p-2"><Clock3 size={18} /></span><span><strong className="block">Centre hours</strong><span className="text-sm text-brand-navy/70">Tue to Fri, 4:30 pm to 9:30 pm<br />Saturday, 9:00 am to 6:00 pm<br />Sunday, 10:00 am to 7:00 pm</span></span></div>
            </div>
          </aside>
        </section>
      </main>
      <FooterNew />
    </div>
  );
};

export default ContactUs;
