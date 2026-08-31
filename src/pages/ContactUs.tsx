import { FormEvent, useEffect, useState } from 'react';
import { BarChart3, CheckCircle2, ChevronLeft, ChevronRight, ClipboardList, Clock3, Mail, MapPin, PencilLine, Phone, Search, Users, X } from 'lucide-react';
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

const fieldClass = 'mt-2 w-full rounded-md border border-brand-navy/20 bg-white px-4 py-2.5 font-normal text-brand-navy outline-none transition placeholder:font-normal placeholder:text-brand-navy/45 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20';

const differenceItems = [
  {
    icon: Search,
    title: 'We look beyond marks',
    body: 'We understand how your child learns, not just what they know.',
  },
  {
    icon: ClipboardList,
    title: 'Every student begins with a structured diagnostic profile',
    body: 'A detailed starting point is refined as we get to know your child.',
  },
  {
    icon: Users,
    title: 'Tutors receive detailed guidance',
    body: 'Strengths, barriers and teaching strategies are shared with the people supporting them.',
  },
  {
    icon: BarChart3,
    title: 'Parents see what we are noticing',
    body: 'We show what we are working on and how progress is being tracked.',
  },
  {
    icon: PencilLine,
    title: 'Profiles are refined through real teaching observations',
    body: 'We keep updating the plan from what we see in lessons, not assumptions.',
  },
];

const reportPreviews = [
  {
    id: 'parent',
    title: 'Parent / Student Report',
    description: 'Clear insight into how your child learns, what we are noticing, and the next steps we recommend.',
    pages: [
      { src: '/images/contact/reports/parent-report-page-1.webp', alt: 'Parent / Student Report sample page 1' },
      { src: '/images/contact/reports/parent-report-page-2.webp', alt: 'Parent / Student Report sample page 2' },
      { src: '/images/contact/reports/parent-report-page-3.webp', alt: 'Parent / Student Report sample page 3' },
    ],
    points: [
      'Understands why your child may be struggling.',
      'Identifies strengths, barriers and learning patterns.',
      'Personalises support around how your child learns best.',
      'Keeps parents informed about focus areas and support at home.',
      'Shows what progress should look like over time.',
    ],
  },
  {
    id: 'tutor',
    title: 'Tutor Report',
    description: 'Detailed direction for the tutor so lessons begin with a stronger understanding of the student.',
    pages: [
      { src: '/images/contact/reports/tutor-report-page-1.webp', alt: 'Tutor Report sample page 1' },
      { src: '/images/contact/reports/tutor-report-page-2.webp', alt: 'Tutor Report sample page 2' },
      { src: '/images/contact/reports/tutor-report-page-3.webp', alt: 'Tutor Report sample page 3' },
    ],
    points: [
      'Gives tutors a clear teaching plan from the start.',
      'Identifies what works, what triggers difficulties and what to avoid.',
      'Personalises communication and encouragement.',
      'Provides a structured 8-week development plan.',
      'Tracks progress and adjusts teaching when needed.',
    ],
  },
];

const ContactUs = () => {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [topic, setTopic] = useState('');
  const [yearLevel, setYearLevel] = useState('');
  const [activeReportPages, setActiveReportPages] = useState<Record<string, number>>({ parent: 0, tutor: 0 });
  const [activeReportViewer, setActiveReportViewer] = useState<{ reportId: string; pageIndex: number } | null>(null);

  const activeViewerReport = activeReportViewer
    ? reportPreviews.find((report) => report.id === activeReportViewer.reportId)
    : undefined;
  const activeViewerPage = activeViewerReport?.pages[activeReportViewer?.pageIndex ?? 0] ?? activeViewerReport?.pages[0];

  const showReportPage = (reportId: string, pageIndex: number) => {
    setActiveReportPages((current) => ({
      ...current,
      [reportId]: pageIndex,
    }));
  };

  const openReportViewer = (reportId: string, pageIndex: number) => {
    setActiveReportViewer({ reportId, pageIndex });
  };

  const showViewerPage = (direction: -1 | 1) => {
    setActiveReportViewer((current) => {
      if (!current) return current;
      const report = reportPreviews.find((item) => item.id === current.reportId);
      if (!report) return current;
      const pageIndex = (current.pageIndex + direction + report.pages.length) % report.pages.length;
      setActiveReportPages((activePages) => ({ ...activePages, [current.reportId]: pageIndex }));
      return { ...current, pageIndex };
    });
  };

  useEffect(() => {
    if (!activeReportViewer) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveReportViewer(null);
      if (event.key === 'ArrowLeft') showViewerPage(-1);
      if (event.key === 'ArrowRight') showViewerPage(1);
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeReportViewer]);

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
        <section className="contact-hero">
          <img
            className="contact-hero__image"
            src="/images/contact/contact-hero-consultation.webp"
            alt=""
            aria-hidden="true"
            decoding="async"
          />
          <div className="contact-hero__overlay" aria-hidden="true" />
          <div className="contact-hero__content">
            <p style={{ color: C.goldL, fontWeight: 800, letterSpacing: '.14em', textTransform: 'uppercase', fontSize: '.76rem', marginBottom: 18 }}>Contact Us</p>
            <h1 style={{ maxWidth: 720, fontFamily: serif, fontWeight: 500, fontSize: 'clamp(3rem, 7vw, 5.5rem)', lineHeight: .96, letterSpacing: '-.035em', color: C.white, margin: 0, textWrap: 'balance' }}>A helpful answer starts with a conversation.</h1>
            <p style={{ maxWidth: 600, color: 'rgba(247,244,238,.78)', fontSize: '1.05rem', lineHeight: 1.75, marginTop: 28 }}>Tell us what is on your mind. Whether you are exploring tutoring for the first time or looking for support with a specific subject, our team will point you in the right direction.</p>
          </div>
        </section>
        <style>{`
          .contact-hero {
            position: relative;
            display: flex;
            min-height: clamp(620px, 82svh, 860px);
            align-items: center;
            overflow: hidden;
            background: ${C.navy};
            padding: clamp(96px, 12vw, 150px) 24px clamp(88px, 10vw, 122px);
            isolation: isolate;
          }

          .contact-hero__image,
          .contact-hero__overlay {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
          }

          .contact-hero__image {
            z-index: -2;
            display: block;
            object-fit: contain;
            object-position: right center;
            filter: brightness(0.96) contrast(1.03) saturate(1.02);
          }

          .contact-hero__overlay {
            z-index: -1;
            background:
              linear-gradient(90deg, rgba(6,17,31,0.88) 0%, rgba(6,17,31,0.68) 33%, rgba(6,17,31,0.26) 62%, rgba(6,17,31,0.08) 100%),
              linear-gradient(0deg, rgba(6,17,31,0.44) 0%, rgba(6,17,31,0.03) 52%, rgba(6,17,31,0.18) 100%);
          }

          .contact-hero__content {
            position: relative;
            width: min(100%, 1120px);
            margin: 0 auto;
          }

          .contact-content {
            display: grid;
            grid-template-columns: minmax(0, 1.85fr) minmax(300px, 0.8fr);
            gap: clamp(28px, 4vw, 56px);
            align-items: stretch;
            max-width: 1360px;
            margin: 0 auto;
            padding: clamp(36px, 5vw, 64px) 24px clamp(34px, 5vw, 58px);
          }

          .contact-side-stack {
            display: grid;
            gap: 18px;
          }

          .contact-side-stack > aside {
            height: 100%;
          }

          .difference-panel {
            width: min(1360px, calc(100% - 48px));
            max-width: 1360px;
            margin: 0 auto clamp(44px, 5vw, 70px);
            border: 1px solid rgba(10,27,52,.1);
            border-radius: 8px;
            background: rgba(255,255,255,.58);
            padding: clamp(22px, 3vw, 34px);
            box-shadow: 0 12px 32px rgba(10,27,52,.06);
          }

          .difference-panel__eyebrow,
          .report-preview__eyebrow {
            color: #8a6810;
            font-size: .72rem;
            font-weight: 800;
            letter-spacing: .12em;
            text-transform: uppercase;
          }

          .difference-panel h2,
          .report-preview h2 {
            font-family: ${serif};
            font-weight: 500;
            letter-spacing: -.03em;
            color: ${C.navy};
          }

          .difference-panel h2 {
            margin: 10px 0 14px;
            font-size: clamp(2rem, 3vw, 3rem);
            line-height: 1.04;
          }

          .difference-panel__rule,
          .report-preview__rule {
            width: 42px;
            height: 1px;
            background: #b9851d;
          }

          .difference-panel__list {
            display: grid;
            grid-template-columns: repeat(5, minmax(0, 1fr));
            gap: 10px;
            margin-top: 18px;
          }

          .difference-panel__item {
            display: grid;
            grid-template-columns: 1fr;
            gap: 12px;
            align-content: start;
            border: 1px solid rgba(10,27,52,.1);
            border-radius: 8px;
            background: rgba(255,255,255,.64);
            min-height: 184px;
            padding: 16px 14px;
          }

          .difference-panel__icon,
          .report-preview__tick {
            display: grid;
            place-items: center;
            border-radius: 999px;
            background: linear-gradient(135deg, #f2dfb9, #d5aa46);
            color: ${C.navy};
          }

          .difference-panel__icon {
            width: 52px;
            height: 52px;
          }

          .difference-panel__item strong {
            display: block;
            font-size: .88rem;
            line-height: 1.25;
          }

          .difference-panel__item span {
            display: block;
            margin-top: 3px;
            color: rgba(10,27,52,.68);
            font-size: .8rem;
            line-height: 1.4;
          }

          .report-preview {
            max-width: 1360px;
            margin: 0 auto;
            padding: 0 24px clamp(64px, 8vw, 104px);
          }

          .report-preview__intro {
            max-width: 760px;
            margin: 0 auto clamp(22px, 3vw, 34px);
            text-align: center;
          }

          .report-preview h2 {
            margin: 8px 0 10px;
            font-size: clamp(2.25rem, 4vw, 3.5rem);
            line-height: 1.02;
          }

          .report-preview__rule {
            margin: 0 auto 12px;
          }

          .report-preview__intro p {
            margin: 0;
            color: rgba(10,27,52,.7);
            line-height: 1.65;
          }

          .report-preview__grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 16px;
          }

          .report-card {
            border: 1px solid rgba(10,27,52,.12);
            border-radius: 8px;
            background: rgba(255,255,255,.72);
            padding: clamp(18px, 2vw, 24px);
            box-shadow: 0 18px 48px rgba(10,27,52,.07);
          }

          .report-card__header {
            display: block;
            margin-bottom: 14px;
          }

          .report-card__header p {
            margin: 0;
            color: #8a6810;
            font-size: .78rem;
            font-weight: 800;
            letter-spacing: .1em;
            text-transform: uppercase;
          }

          .report-card__header span {
            display: block;
            margin-top: 3px;
            color: rgba(10,27,52,.68);
            font-size: .84rem;
            line-height: 1.4;
            letter-spacing: 0;
            text-transform: none;
            font-weight: 500;
          }

          .report-card__body {
            display: grid;
            grid-template-columns: minmax(220px, .66fr) minmax(0, 1fr);
            gap: clamp(20px, 2.6vw, 34px);
            align-items: start;
          }

          .report-card__preview {
            display: grid;
            gap: 12px;
          }

          .report-card__page-button {
            overflow: hidden;
            border: 1px solid rgba(10,27,52,.1);
            border-radius: 6px;
            background: white;
            box-shadow: 0 10px 22px rgba(10,27,52,.1);
            cursor: pointer;
            padding: 0;
            text-align: left;
            transition: transform .2s ease, box-shadow .2s ease;
          }

          .report-card__page-button:hover,
          .report-card__page-button:focus-visible {
            box-shadow: 0 16px 30px rgba(10,27,52,.15);
            outline: none;
            transform: translateY(-1px);
          }

          .report-card__page-button:focus-visible {
            box-shadow: 0 0 0 3px rgba(212,175,55,.28), 0 16px 30px rgba(10,27,52,.15);
          }

          .report-card__page-button img {
            display: block;
            width: 100%;
            height: auto;
          }

          .report-card__pager {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
          }

          .report-card__pager button {
            min-width: 42px;
            border: 1px solid rgba(10,27,52,.14);
            border-radius: 999px;
            background: rgba(255,255,255,.72);
            color: rgba(10,27,52,.68);
            cursor: pointer;
            font-size: .74rem;
            font-weight: 800;
            padding: 6px 10px;
            transition: background .2s ease, border-color .2s ease, color .2s ease;
          }

          .report-card__pager button.is-active {
            border-color: rgba(212,175,55,.72);
            background: rgba(212,175,55,.16);
            color: ${C.navy};
          }

          .report-lightbox {
            position: fixed;
            inset: 0;
            z-index: 1000;
            display: grid;
            place-items: center;
            background: rgba(6,17,31,.9);
            padding: 12px clamp(54px, 7vw, 130px) 20px;
          }

          .report-lightbox__shell {
            position: relative;
            z-index: 1;
            display: grid;
            grid-template-rows: auto minmax(0, 1fr) auto;
            justify-items: center;
            gap: 10px;
            width: min(760px, 100%);
            height: 100%;
          }

          .report-lightbox__close,
          .report-lightbox__arrow,
          .report-lightbox__pager button {
            border: 1px solid rgba(255,255,255,.24);
            background: rgba(250,250,248,.94);
            color: ${C.navy};
            cursor: pointer;
            transition: transform .2s ease, background .2s ease, box-shadow .2s ease;
          }

          .report-lightbox__close {
            display: grid;
            place-items: center;
            justify-self: end;
            width: 42px;
            height: 42px;
            border-radius: 999px;
          }

          .report-lightbox__close:hover,
          .report-lightbox__arrow:hover,
          .report-lightbox__pager button:hover,
          .report-lightbox__close:focus-visible,
          .report-lightbox__arrow:focus-visible,
          .report-lightbox__pager button:focus-visible {
            outline: none;
            background: white;
            box-shadow: 0 0 0 3px rgba(212,175,55,.32);
            transform: translateY(-1px);
          }

          .report-lightbox__page {
            display: block;
            width: auto;
            max-width: 100%;
            max-height: calc(100dvh - 118px);
            min-height: 0;
            border-radius: 6px;
            background: white;
            box-shadow: 0 22px 60px rgba(0,0,0,.36);
          }

          .report-lightbox__arrow {
            position: absolute;
            top: 50%;
            z-index: 2;
            display: grid;
            place-items: center;
            width: 48px;
            height: 48px;
            border-radius: 999px;
          }

          .report-lightbox__arrow--prev {
            left: clamp(10px, 2vw, 28px);
          }

          .report-lightbox__arrow--next {
            right: clamp(10px, 2vw, 28px);
          }

          .report-lightbox__pager {
            display: flex;
            justify-content: center;
            gap: 8px;
          }

          .report-lightbox__pager button {
            min-width: 42px;
            border-radius: 999px;
            font-size: .75rem;
            font-weight: 800;
            padding: 6px 10px;
          }

          .report-lightbox__pager button.is-active {
            border-color: rgba(212,175,55,.78);
            background: #f1d890;
          }

          .report-card__points {
            display: grid;
            gap: 14px;
            margin: 0;
            padding: 2px 0 0;
            list-style: none;
          }

          .report-card__points li {
            display: grid;
            grid-template-columns: 23px minmax(0, 1fr);
            gap: 10px;
            align-items: start;
            color: rgba(10,27,52,.84);
            font-size: .9rem;
            line-height: 1.45;
          }

          .report-preview__tick {
            width: 23px;
            height: 23px;
            background: rgba(212,175,55,.16);
            color: #9b6b10;
          }

          .report-preview__tick svg {
            width: 15px;
            height: 15px;
          }

          @media (max-width: 1100px) {
            .difference-panel__list {
              grid-template-columns: repeat(3, minmax(0, 1fr));
            }
          }

          @media (min-width: 768px) {
            .contact-side-stack {
              margin-top: 158px;
              min-height: calc(100% - 158px);
            }
          }

          @media (max-width: 767px) {
            .contact-hero {
              min-height: 720px;
              align-items: flex-end;
              padding: 118px 20px 56px;
            }

            .contact-hero__image {
              bottom: auto;
              height: auto;
              aspect-ratio: 1448 / 1086;
              max-height: 46%;
              object-position: center top;
            }

            .contact-hero__overlay {
              background:
                linear-gradient(180deg, rgba(6,17,31,0.08) 0%, rgba(6,17,31,0.18) 34%, rgba(6,17,31,0.88) 100%),
                linear-gradient(90deg, rgba(6,17,31,0.36), rgba(6,17,31,0.18));
            }

            .contact-content {
              grid-template-columns: 1fr;
              padding-inline: 20px;
            }

            .difference-panel {
              margin-inline: 20px;
              padding: 18px;
            }

            .difference-panel__list {
              grid-template-columns: 1fr;
            }

            .difference-panel__item {
              grid-template-columns: 40px minmax(0, 1fr);
              min-height: 0;
            }

            .difference-panel__icon {
              width: 40px;
              height: 40px;
            }

            .report-preview {
              padding-inline: 20px;
            }

            .report-preview__grid,
            .report-card__body {
              grid-template-columns: 1fr;
            }

            .report-card__points {
              gap: 10px;
            }

            .report-lightbox {
              padding: 10px 50px 16px;
            }

            .report-lightbox__shell {
              width: 100%;
            }

            .report-lightbox__page {
              max-height: calc(100dvh - 112px);
            }

            .report-lightbox__arrow {
              width: 40px;
              height: 40px;
            }

            .report-lightbox__arrow--prev {
              left: 6px;
            }

            .report-lightbox__arrow--next {
              right: 6px;
            }
          }
        `}</style>

        <section className="contact-content">
          <div>
            <p style={{ color: '#8a6810', fontSize: '.78rem', fontWeight: 800, letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 12 }}>Send an enquiry</p>
            <h2 style={{ fontFamily: serif, fontSize: 'clamp(2.25rem, 4vw, 3.5rem)', fontWeight: 500, letterSpacing: '-.03em', lineHeight: 1.05, margin: 0 }}>How can we help?</h2>
            <p style={{ color: 'rgba(10,27,52,.68)', maxWidth: 760, lineHeight: 1.65, margin: '14px 0 22px' }}>A few details help us give you a more useful response. Fields marked with an asterisk are required.</p>

            {submitted ? <div role="status" className="rounded-xl border border-brand-gold/40 bg-white p-7" style={{ boxShadow: '0 6px 20px rgba(10,27,52,.08)' }}><CheckCircle2 size={30} color={C.gold} /><h2 style={{ fontFamily: serif, fontSize: '2rem', fontWeight: 500, margin: '14px 0 8px' }}>Thank you. We have received your enquiry.</h2><p style={{ color: 'rgba(10,27,52,.7)', lineHeight: 1.7 }}>A member of the DA Tuition team will be in touch soon.</p></div> : <form onSubmit={submitEnquiry} className="rounded-xl bg-white p-5 sm:p-6" style={{ boxShadow: '0 6px 20px rgba(10,27,52,.08)' }}>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-bold text-brand-navy">Parent or guardian name *<input required name="parentName" autoComplete="name" className={fieldClass} placeholder="Your full name" /></label>
                <label className="text-sm font-bold text-brand-navy">Email address *<input required name="email" type="email" autoComplete="email" className={fieldClass} placeholder="you@example.com" /></label>
                <label className="text-sm font-bold text-brand-navy">Mobile number *<input required name="phone" type="tel" autoComplete="tel" className={fieldClass} placeholder="04XX XXX XXX" /></label>
                <label className="text-sm font-bold text-brand-navy">What can we help with? *<select required name="topic" value={topic} onChange={(event) => setTopic(event.target.value)} className={`${fieldClass} ${topic ? 'text-brand-navy' : 'text-brand-navy/45'}`}><option value="" disabled>Select an option</option>{enquiryTopics.map((enquiryTopic) => <option key={enquiryTopic}>{enquiryTopic}</option>)}</select></label>
                <label className="text-sm font-bold text-brand-navy">Student name <input name="childName" className={fieldClass} placeholder="Optional" /></label>
                <label className="text-sm font-bold text-brand-navy">Student year level <select name="yearLevel" value={yearLevel} onChange={(event) => setYearLevel(event.target.value)} className={`${fieldClass} ${yearLevel ? 'text-brand-navy' : 'text-brand-navy/45'}`}><option value="">Select year level</option>{yearLevels.map((year) => <option key={year}>{year}</option>)}</select></label>
              </div>
              <label className="mt-4 block text-sm font-bold text-brand-navy">Your question or enquiry *<textarea required name="message" rows={4} className={fieldClass} placeholder="For example, the subjects your child needs help with, when you hope to start, or anything you would like us to know." /></label>
              <input type="text" name="_honey" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
              <button type="submit" disabled={isSubmitting} className="mt-5 inline-flex items-center rounded-full px-6 py-3 text-sm font-bold transition hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-65" style={{ background: C.navy, color: C.white }}>{isSubmitting ? 'Sending enquiry...' : 'Send enquiry'} <ChevronRight size={18} className="ml-2" /></button>
              {submitError ? <p role="alert" className="mt-4 text-sm font-medium text-red-700">{submitError}</p> : <p className="mt-3 text-xs leading-5 text-brand-navy/60">Your enquiry will be sent directly to the DA Tuition team. You can also call us directly.</p>}
            </form>}
          </div>

          <div className="contact-side-stack">
            <aside style={{ background: C.cream2, borderRadius: 12, padding: '26px 22px' }}>
              <h2 style={{ fontFamily: serif, fontSize: '2rem', fontWeight: 500, lineHeight: 1.1, margin: 0 }}>Prefer to speak with us?</h2>
              <p style={{ color: 'rgba(10,27,52,.68)', lineHeight: 1.65, margin: '12px 0 22px' }}>Call or email our Canley Heights team. We are happy to answer a quick question.</p>
              <div className="space-y-5">
                <a href="tel:0401940207" className="flex items-start gap-3 text-brand-navy no-underline"><span className="mt-0.5 rounded-full bg-brand-gold/20 p-2"><Phone size={18} /></span><span><strong className="block">Call us</strong><span className="text-sm text-brand-navy/70">0401 940 207</span></span></a>
                <a href="mailto:info@datuition.com.au" className="flex items-start gap-3 text-brand-navy no-underline"><span className="mt-0.5 rounded-full bg-brand-gold/20 p-2"><Mail size={18} /></span><span><strong className="block">Email us</strong><span className="text-sm text-brand-navy/70">info@datuition.com.au</span></span></a>
                <a href="https://maps.google.com/?q=229+Canley+Vale+Rd+Canley+Heights+NSW+2166" target="_blank" rel="noreferrer" className="flex items-start gap-3 text-brand-navy no-underline"><span className="mt-0.5 rounded-full bg-brand-gold/20 p-2"><MapPin size={18} /></span><span><strong className="block">Visit the centre</strong><span className="text-sm text-brand-navy/70">Level 1, 229 Canley Vale Rd<br />Canley Heights NSW 2166</span></span></a>
                <div className="flex items-start gap-3"><span className="mt-0.5 rounded-full bg-brand-gold/20 p-2"><Clock3 size={18} /></span><span><strong className="block">Centre hours</strong><span className="text-sm text-brand-navy/70">Tue to Fri, 4:30 pm to 9:30 pm<br />Saturday, 9:00 am to 6:00 pm<br />Sunday, 10:00 am to 7:00 pm</span></span></div>
              </div>
            </aside>
          </div>
        </section>

        <section className="difference-panel" aria-labelledby="difference-heading">
          <p className="difference-panel__eyebrow">What makes DA different?</p>
          <h2 id="difference-heading">Careful. Personalised. Proven.</h2>
          <div className="difference-panel__rule" aria-hidden="true" />
          <div className="difference-panel__list">
            {differenceItems.map((item) => {
              const Icon = item.icon;
              return (
                <article className="difference-panel__item" key={item.title}>
                  <span className="difference-panel__icon" aria-hidden="true"><Icon size={23} strokeWidth={1.9} /></span>
                  <div>
                    <strong>{item.title}</strong>
                    <span>{item.body}</span>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="report-preview" aria-labelledby="report-preview-heading">
          <div className="report-preview__intro">
            <p className="report-preview__eyebrow">Behind every recommendation</p>
            <h2 id="report-preview-heading">See the care behind every DA lesson</h2>
            <div className="report-preview__rule" aria-hidden="true" />
            <p>Parents receive clear insight. Tutors receive detailed direction. Together, it means more thoughtful support for your child.</p>
          </div>

          <div className="report-preview__grid">
            {reportPreviews.map((report) => {
              const activePageIndex = activeReportPages[report.id] ?? 0;
              const activePage = report.pages[activePageIndex] ?? report.pages[0];

              return (
                <article className="report-card" key={report.title}>
                  <div className="report-card__header">
                    <p>{report.title}<span>{report.description}</span></p>
                  </div>
                  <div className="report-card__body">
                    <div className="report-card__preview">
                      <button
                        type="button"
                        className="report-card__page-button"
                        onClick={() => openReportViewer(report.id, activePageIndex)}
                        aria-label={`Open ${report.title} sample page ${activePageIndex + 1}`}
                      >
                        <img src={activePage.src} alt={activePage.alt} loading="lazy" decoding="async" />
                      </button>
                      <div className="report-card__pager" aria-label={`${report.title} sample pages`}>
                        {report.pages.map((page, index) => (
                          <button
                            type="button"
                            className={index === activePageIndex ? 'is-active' : ''}
                            onClick={() => showReportPage(report.id, index)}
                            aria-label={`Show ${page.alt}`}
                            aria-pressed={index === activePageIndex}
                            key={page.src}
                          >
                            {index + 1}
                          </button>
                        ))}
                      </div>
                    </div>
                    <ul className="report-card__points">
                      {report.points.map((point) => (
                        <li key={point}><span className="report-preview__tick" aria-hidden="true"><CheckCircle2 /></span>{point}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {activeViewerReport && activeViewerPage ? (
          <div
            className="report-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={`${activeViewerReport.title} sample page ${(activeReportViewer?.pageIndex ?? 0) + 1}`}
            onClick={() => setActiveReportViewer(null)}
          >
            <button
              type="button"
              className="report-lightbox__arrow report-lightbox__arrow--prev"
              onClick={(event) => {
                event.stopPropagation();
                showViewerPage(-1);
              }}
              aria-label="Previous sample page"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="report-lightbox__shell" onClick={(event) => event.stopPropagation()}>
              <button
                type="button"
                className="report-lightbox__close"
                onClick={() => setActiveReportViewer(null)}
                aria-label="Close sample report"
              >
                <X size={22} />
              </button>
              <img className="report-lightbox__page" src={activeViewerPage.src} alt={activeViewerPage.alt} />
              <div className="report-lightbox__pager" aria-label={`${activeViewerReport.title} sample pages`}>
                {activeViewerReport.pages.map((page, index) => (
                  <button
                    type="button"
                    className={index === (activeReportViewer?.pageIndex ?? 0) ? 'is-active' : ''}
                    onClick={() => {
                      showReportPage(activeViewerReport.id, index);
                      setActiveReportViewer({ reportId: activeViewerReport.id, pageIndex: index });
                    }}
                    aria-label={`Show ${page.alt}`}
                    aria-pressed={index === (activeReportViewer?.pageIndex ?? 0)}
                    key={page.src}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
            <button
              type="button"
              className="report-lightbox__arrow report-lightbox__arrow--next"
              onClick={(event) => {
                event.stopPropagation();
                showViewerPage(1);
              }}
              aria-label="Next sample page"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        ) : null}
      </main>
      <FooterNew />
    </div>
  );
};

export default ContactUs;
