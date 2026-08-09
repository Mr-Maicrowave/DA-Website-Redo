import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { X, ArrowRight, Search, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import SEO from '@/components/SEO';
import {
  TUTORS,
  type CatalogueTutor,
  getPhotoUrl,
  getPhotoStyle,
  teachesEnglish,
  teachesMath,
  teachesScience,
} from '@/data/teacherCatalogue';

/* ── Palette + type, matched to the homepage (Index.tsx) ───────────────── */
const NAVY = '#0A1F3F';
const NAVY_2 = '#0d2748';
const GOLD = '#D4AF37';
const GOLD_LIGHT = '#F0C86A';
const CREAM = '#F7F4EE';
const SERIF = "'Cormorant Garamond', Georgia, serif";
const SANS = "'DM Sans', 'Inter', sans-serif";
const a = (hex: string, alpha: string) => hex + alpha;

const CARD_CSS = `
.da-card{transition:transform .4s cubic-bezier(.2,.7,.2,1),box-shadow .4s ease,border-color .4s ease}
.da-card:hover{transform:translateY(-6px);box-shadow:0 24px 52px rgba(10,31,63,.30),0 0 0 1px rgba(212,175,55,.55);border-color:rgba(212,175,55,.6)}
.da-card:focus-visible{outline:none;box-shadow:0 0 0 3px rgba(212,175,55,.9)}
body.teacher-profile-open .site-sticky-book-button,
body.teacher-profile-open .site-scroll-to-top{opacity:0!important;pointer-events:none!important;transform:translateY(12px)}
@media (prefers-reduced-motion: reduce){.da-card{transition:none}.da-card:hover{transform:none}}
`;

const SUBJECT_LABEL: Record<CatalogueTutor['primarySubject'], string> = {
  english: 'English',
  math: 'Mathematics',
  science: 'Science',
  both: 'English & Maths',
};

function primaryBadge(t: CatalogueTutor): string {
  if (t.hasPrimary && t.primarySubject === 'both') return 'Primary · English & Maths';
  if (t.hasPrimary) return `Primary · ${SUBJECT_LABEL[t.primarySubject]}`;
  return SUBJECT_LABEL[t.primarySubject];
}

function subjectPills(subjects: string): string[] {
  const result: string[] = [];
  const s = subjects || '';
  if (/Primary/i.test(s)) result.push('Primary');
  if (/English\s*\(Yr/i.test(s)) result.push('English Yr 7-10');
  if (/English Standard/i.test(s)) result.push('Eng Standard');
  if (/English Advanced/i.test(s)) result.push('Eng Advanced');
  if (/English Extension 1/i.test(s)) result.push('Eng Ext 1');
  if (/English Extension 2/i.test(s)) result.push('Eng Ext 2');
  if (/Mathematics\s*\(Yr/i.test(s)) result.push('Maths Yr 7-10');
  if (/Mathematics Standard/i.test(s)) result.push('Maths Standard');
  if (/Mathematics Advanced/i.test(s)) result.push('Maths Advanced');
  if (/Mathematics Extension 1/i.test(s)) result.push('Maths Ext 1');
  if (/Mathematics Extension 2/i.test(s)) result.push('Maths Ext 2');
  if (/Chemistry/i.test(s)) result.push('Chemistry');
  if (/Biology/i.test(s)) result.push('Biology');
  if (/Science\s*\(Yr/i.test(s)) result.push('Science Yr 7-10');
  if (/Business Studies/i.test(s)) result.push('Business Studies');
  if (/Legal Studies/i.test(s)) result.push('Legal Studies');
  return result;
}

const tierLabel = (tier: CatalogueTutor['tier']) =>
  tier === 'senior' ? 'Senior Educator' : tier === 'mid' ? 'Experienced Educator' : 'Educator';

function initials(name: string): string {
  const parts = name.replace(/^(Mr|Mrs|Ms|Miss|Dr)\.?\s+/i, '').trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

const firstName = (name: string) =>
  name.replace(/^(Mr|Mrs|Ms|Miss|Dr)\.?\s+/i, '').trim().split(/\s+/)[0];

type FilterKey = 'all' | 'english' | 'maths' | 'science' | 'primary';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All Teachers' },
  { key: 'english', label: 'English' },
  { key: 'maths', label: 'Mathematics' },
  { key: 'science', label: 'Science' },
  { key: 'primary', label: 'Primary' },
];

type ProfileTab = 'about' | 'teaching' | 'subjects' | 'values';

/* ── Static constellation / glow (aria-hidden, no animation = no jank) ──── */
const Constellation = ({ tone = 'light' }: { tone?: 'light' | 'dark' }) => {
  const dot = tone === 'light' ? 'rgba(255,255,255,0.10)' : 'rgba(10,31,63,0.045)';
  const glow = tone === 'light' ? a(GOLD, '22') : a(GOLD, '12');
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ backgroundImage: `radial-gradient(${dot} 1px, transparent 1px)`, backgroundSize: '26px 26px' }}
      />
      <div
        className="absolute -top-24 left-1/2 -translate-x-1/2 w-[42rem] h-[42rem] rounded-full"
        style={{ background: `radial-gradient(circle, ${glow} 0%, transparent 60%)` }}
      />
    </div>
  );
};

/* ── Portrait with elegant monogram fallback (covers slow/failed loads) ── */
const Portrait = ({
  teacher,
  eager = false,
  imgClassName = '',
}: {
  teacher: CatalogueTutor;
  eager?: boolean;
  imgClassName?: string;
}) => {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      <div
        aria-hidden
        className="absolute inset-0 flex items-center justify-center"
        style={{ background: `linear-gradient(155deg, ${NAVY_2} 0%, ${NAVY} 100%)` }}
      >
        <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 'clamp(2rem,6vw,3rem)', color: a(GOLD, '4d'), letterSpacing: '0.06em' }}>
          {initials(teacher.name)}
        </span>
      </div>
      {!failed && (
        <img
          src={getPhotoUrl(teacher)}
          alt={teacher.name}
          loading={eager ? 'eager' : 'lazy'}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={
            'absolute inset-0 w-full h-full object-cover motion-safe:transition-opacity motion-safe:duration-500 ' +
            (loaded ? 'opacity-100 ' : 'opacity-0 ') +
            imgClassName
          }
          style={getPhotoStyle(teacher)}
        />
      )}
    </>
  );
};

const Chip = ({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) => (
  <span
    className="px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide"
    style={
      dark
        ? { background: a(NAVY, 'aa'), color: GOLD_LIGHT, border: `1px solid ${a(GOLD, '40')}` }
        : { background: a(NAVY, '0d'), color: NAVY, border: `1px solid ${a(NAVY, '14')}`, fontFamily: SANS }
    }
  >
    {children}
  </span>
);

/* ── Featured (senior) card — larger, editorial, overlaid nameplate ────── */
const FeaturedCard = ({ teacher, onSelect }: { teacher: CatalogueTutor; onSelect: (el: HTMLButtonElement) => void }) => {
  const ref = useRef<HTMLButtonElement>(null);
  const pills = subjectPills(teacher.subjects).slice(0, 3);
  return (
    <button
      ref={ref}
      onClick={() => ref.current && onSelect(ref.current)}
      aria-label={`View profile of ${teacher.name}`}
      className="da-card group relative block text-left w-full rounded-3xl overflow-hidden"
      style={{ background: NAVY, border: `1px solid ${a(GOLD, '40')}` }}
    >
      <div className="relative overflow-hidden" style={{ paddingBottom: '120%' }}>
        <Portrait teacher={teacher} eager imgClassName="motion-safe:transition-transform motion-safe:duration-700 motion-safe:group-hover:scale-[1.05]" />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, ' + a(NAVY, 'fa') + ' 6%, ' + a(NAVY, '70') + ' 38%, transparent 66%)' }}
        />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] mb-1.5" style={{ color: GOLD_LIGHT, fontFamily: SANS }}>
            {teacher.designation}
          </p>
          <h3 className="text-white leading-tight" style={{ fontFamily: SERIF, fontWeight: 600, fontSize: '1.6rem' }}>
            {teacher.name}
          </h3>
          <p className="text-[13px] leading-snug mt-1.5 mb-3 line-clamp-2" style={{ color: 'rgba(255,255,255,0.72)', fontFamily: SANS }}>
            {teacher.tagline}
          </p>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {pills.map(p => (
              <Chip key={p} dark>{p}</Chip>
            ))}
          </div>
          <span
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider"
            style={{ color: GOLD, fontFamily: SANS }}
          >
            View profile
            <ChevronRight className="w-3.5 h-3.5 motion-safe:transition-transform motion-safe:group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </button>
  );
};

/* ── Compact card — framed portrait + distinct nameplate footer ────────── */
const TutorCard = ({ teacher, onSelect }: { teacher: CatalogueTutor; onSelect: (el: HTMLButtonElement) => void }) => {
  const ref = useRef<HTMLButtonElement>(null);
  return (
    <button
      ref={ref}
      onClick={() => ref.current && onSelect(ref.current)}
      aria-label={`View profile of ${teacher.name}`}
      className="da-card group relative flex flex-col w-full rounded-2xl overflow-hidden"
      style={{ background: NAVY, border: `1px solid ${a(GOLD, '2e')}` }}
    >
      <div className="relative overflow-hidden" style={{ paddingBottom: '110%' }}>
        <Portrait teacher={teacher} imgClassName="motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[1.06]" />
        {/* vignettes to lift the portrait off the card */}
        <div aria-hidden className="absolute inset-0" style={{ background: `linear-gradient(to bottom, ${a(NAVY, '40')} 0%, transparent 22%)` }} />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3" style={{ background: `linear-gradient(to top, ${a(NAVY, 'cc')} 0%, transparent 100%)` }} />
        {teacher.tier === 'senior' && (
          <span className="absolute top-3 right-3 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ background: GOLD, color: NAVY }}>
            Senior
          </span>
        )}
        <span className="absolute bottom-3 left-3"><Chip dark>{primaryBadge(teacher)}</Chip></span>
      </div>
      {/* nameplate */}
      <div className="p-3.5 flex flex-col gap-1" style={{ borderTop: `1px solid ${a(GOLD, '26')}`, background: NAVY }}>
        <p className="text-[9px] font-bold uppercase tracking-[0.16em]" style={{ color: GOLD, fontFamily: SANS }}>
          {teacher.designation}
        </p>
        <h3 className="leading-snug text-white" style={{ fontFamily: SERIF, fontWeight: 600, fontSize: '1.15rem' }}>
          {teacher.name}
        </h3>
        <p className="text-[11px] leading-snug line-clamp-2" style={{ color: 'rgba(255,255,255,0.62)', fontFamily: SANS }}>
          {teacher.tagline}
        </p>
        <div className="flex items-center gap-1 mt-1.5" style={{ color: a(GOLD, 'cc'), fontFamily: SANS }}>
          <span className="text-[10px] font-semibold uppercase tracking-wider">View profile</span>
          <ChevronRight className="w-3 h-3 motion-safe:transition-transform motion-safe:group-hover:translate-x-0.5" />
        </div>
      </div>
    </button>
  );
};

const SectionHeader = ({ eyebrow, title, count, note }: { eyebrow: string; title: string; count?: number; note?: string }) => (
  <div className="mb-6">
    <p className="text-[11px] font-bold uppercase tracking-[0.2em] mb-1.5" style={{ color: GOLD, fontFamily: SANS }}>
      {eyebrow}
    </p>
    <div className="flex items-end gap-3 flex-wrap">
      <h2 style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 'clamp(1.6rem, 3.2vw, 2.2rem)', color: NAVY, letterSpacing: '-0.01em', lineHeight: 1.1 }}>
        {title}
      </h2>
      {count !== undefined && (
        <span className="text-sm pb-1.5" style={{ color: a(NAVY, '80'), fontFamily: SANS }}>{count}</span>
      )}
    </div>
    <div className="mt-3 h-px w-full" style={{ background: `linear-gradient(to right, ${a(GOLD, '99')}, ${a(NAVY, '14')} 35%, transparent)` }} />
    {note && (
      <p className="mt-3 max-w-2xl text-sm leading-relaxed" style={{ color: a(NAVY, 'a6'), fontFamily: SANS }}>
        {note}
      </p>
    )}
  </div>
);

/* ── Expanded profile — desktop "dossier" two-column / mobile sheet ─────── */
const ProfileModal = ({
  teacher,
  onClose,
  returnFocusTo,
  triggerRect,
}: {
  teacher: CatalogueTutor;
  onClose: () => void;
  returnFocusTo: HTMLElement | null;
  triggerRect?: DOMRect | null;
}) => {
  const [tab, setTab] = useState<ProfileTab>('about');
  const panelRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 768px)').matches : true,
  );

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const handler = () => setIsDesktop(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Focus: move in, trap Tab, restore to the originating card on close.
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const focusables = () =>
      Array.from(
        panel.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'),
      ).filter(el => el.offsetParent !== null);

    (focusables()[0] ?? panel).focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return onClose();
      if (e.key !== 'Tab') return;
      const items = focusables();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      returnFocusTo?.focus?.();
    };
  }, [onClose, returnFocusTo]);

  const pills = subjectPills(teacher.subjects);
  const TABS: { key: ProfileTab; label: string }[] = [
    { key: 'about', label: 'About' },
    { key: 'teaching', label: 'Teaching style' },
    { key: 'subjects', label: 'Subjects' },
    { key: 'values', label: 'Values' },
  ];

  // Card-expand animation: modal grows from the clicked card's position
  const getExpandVariants = () => {
    if (!triggerRect || !isDesktop || reduce) return null;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const modalW = Math.min(vw - 48, 896); // max-w-4xl ≈ 896px
    // With md:pt-20 on the container, items-center shifts center down by ~40px
    const modalCx = vw / 2;
    const modalCy = vh / 2 + 40;
    const cardCx = triggerRect.left + triggerRect.width / 2;
    const cardCy = triggerRect.top + triggerRect.height / 2;
    const scale = Math.max(triggerRect.width / modalW, 0.08);
    const x = cardCx - modalCx;
    const y = cardCy - modalCy;
    return {
      hidden: { opacity: 0, scale, x, y },
      visible: { opacity: 1, scale: 1, x: 0, y: 0 },
      exit: { opacity: 0, scale: scale * 0.85, x, y },
    };
  };
  const expandVariants = getExpandVariants();

  const panelVariants = expandVariants ?? (isDesktop
    ? {
        hidden: { opacity: 0, scale: reduce ? 1 : 0.96, y: reduce ? 0 : 16 },
        visible: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: reduce ? 1 : 0.97, y: reduce ? 0 : 10 },
      }
    : {
        hidden: { opacity: reduce ? 0 : 1, y: reduce ? 0 : '100%' },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: reduce ? 0 : 1, y: reduce ? 0 : '100%' },
      });
  const transition = expandVariants
    ? { type: 'spring' as const, damping: 30, stiffness: 260, mass: 0.85, opacity: { duration: 0.18 } }
    : reduce
      ? { duration: 0.18 }
      : { type: 'spring' as const, damping: 30, stiffness: 300 };
  const tabTransition = reduce ? { duration: 0.12 } : { duration: 0.28, ease: [0.2, 0.7, 0.2, 1] as [number, number, number, number] };

  const SectionHeading = ({ children }: { children: React.ReactNode }) => (
    <h4 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: GOLD, fontFamily: SANS }}>
      {children}
    </h4>
  );
  const Body = ({ children }: { children: React.ReactNode }) => (
    <p className="text-sm leading-relaxed" style={{ color: a(NAVY, 'cc'), fontFamily: SANS }}>
      {children}
    </p>
  );

  const TabContent = () => (
    <AnimatePresence mode="wait">
      <motion.div
        key={tab}
        initial={{ opacity: 0, y: reduce ? 0 : 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: reduce ? 0 : -8 }}
        transition={tabTransition}
      >
        {tab === 'about' && (
          <div className="space-y-5">
            <blockquote className="text-lg leading-relaxed italic rounded-xl p-4" style={{ color: NAVY, background: a(GOLD, '12'), border: `1px solid ${a(GOLD, '33')}`, fontFamily: SERIF }}>
              "{teacher.tagline}"
            </blockquote>
            {teacher.profile && (
              <>
                <div>
                  <SectionHeading>Why DA?</SectionHeading>
                  <Body>{teacher.profile.whyDA}</Body>
                </div>
                <div>
                  <SectionHeading>What I hope to achieve</SectionHeading>
                  <Body>{teacher.profile.goals}</Body>
                </div>
              </>
            )}
          </div>
        )}
        {tab === 'teaching' && (
          <div className="space-y-5">
            <div className="rounded-xl p-4" style={{ background: a(NAVY, '08') }}>
              <SectionHeading>Personal motto</SectionHeading>
              <p className="text-base italic leading-relaxed" style={{ color: NAVY, fontFamily: SERIF }}>"{teacher.motto}"</p>
            </div>
            {teacher.profile?.tags && (
              <div>
                <SectionHeading>At a glance</SectionHeading>
                <div className="flex flex-wrap gap-2">
                  {teacher.profile.tags.map(t => (
                    <span key={t} className="px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: a(NAVY, '12'), color: NAVY, fontFamily: SANS }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        {tab === 'subjects' && (
          <div className="space-y-4">
            <Body>{firstName(teacher.name)} teaches across the following areas:</Body>
            <div className="flex flex-wrap gap-2">
              {pills.map(p => (
                <span key={p} className="px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: NAVY, color: GOLD, fontFamily: SANS }}>
                  {p}
                </span>
              ))}
            </div>
            <div className="mt-6 rounded-xl p-4 text-center" style={{ background: a(NAVY, '08'), border: '1px solid ' + a(NAVY, '14') }}>
              <p className="text-sm font-medium mb-3" style={{ color: NAVY, fontFamily: SANS }}>Want to check availability?</p>
              <a href="/book-interview" className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-opacity hover:opacity-80" style={{ background: NAVY, color: GOLD, fontFamily: SANS }}>
                Book a consultation
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}
        {tab === 'values' && (
          <div className="space-y-5">
            {teacher.profile?.remembered && (
              <div>
                <SectionHeading>How students remember me</SectionHeading>
                <blockquote className="text-base leading-relaxed italic rounded-xl p-4" style={{ color: NAVY, background: a(GOLD, '12'), border: `1px solid ${a(GOLD, '33')}`, fontFamily: SERIF }}>
                  {teacher.profile.remembered}
                </blockquote>
              </div>
            )}
            <div className="rounded-xl p-4 flex items-center gap-3" style={{ background: a(GOLD, '18') }}>
              <span className="text-2xl" aria-hidden>&#127891;</span>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: a(NAVY, '80'), fontFamily: SANS }}>Experience level</p>
                <p className="text-sm font-semibold" style={{ color: NAVY, fontFamily: SANS }}>{tierLabel(teacher.tier)}</p>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );

  const Tabs = ({ padRight = false }: { padRight?: boolean }) => (
    <div role="tablist" aria-label="Profile sections" className={'flex flex-shrink-0 overflow-x-auto ' + (padRight ? 'pr-14' : '')} style={{ borderBottom: `1px solid ${a(NAVY, '14')}` }}>
      {TABS.map(t => (
        <button
          key={t.key}
          role="tab"
          aria-selected={tab === t.key}
          onClick={() => setTab(t.key)}
          className="relative flex-1 min-w-max px-4 py-3 text-sm font-semibold transition-colors whitespace-nowrap focus:outline-none focus-visible:bg-black/5"
          style={{ color: tab === t.key ? NAVY : a(NAVY, '7a'), fontFamily: SANS }}
        >
          {t.label}
          {tab === t.key &&
            (reduce ? (
              <span className="absolute left-0 right-0 bottom-0 h-0.5" style={{ background: GOLD }} />
            ) : (
              <motion.span layoutId="da-tab-underline" className="absolute left-0 right-0 bottom-0 h-0.5" style={{ background: GOLD }} />
            ))}
        </button>
      ))}
    </div>
  );

  const CloseBtn = ({ onImage = false }: { onImage?: boolean }) => (
    <button
      onClick={onClose}
      aria-label="Close profile"
      className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2"
      style={onImage ? { background: 'rgba(255,255,255,0.2)', color: '#fff' } : { background: a(NAVY, '0f'), color: NAVY }}
    >
      <X className="w-5 h-5" />
    </button>
  );

  return (
    <div className="fixed inset-0 z-[70] flex items-end md:items-center justify-center p-0 md:p-6 md:pt-20">
      <motion.div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      />

      {isDesktop ? (
        /* ---------- DESKTOP DOSSIER ---------- */
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="tutor-profile-name"
          tabIndex={-1}
          className="relative z-10 w-full max-w-4xl max-h-[calc(86vh-5rem)] overflow-hidden rounded-3xl flex flex-row focus:outline-none"
          style={{ background: '#fff', border: `1px solid ${a(GOLD, '40')}`, boxShadow: `0 40px 90px ${a(NAVY, '4d')}` }}
          variants={panelVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={transition}
        >
          {/* Portrait column */}
          <div className="relative w-[40%] flex-shrink-0 overflow-hidden" style={{ background: NAVY, minHeight: '340px' }}>
            <Portrait teacher={teacher} eager />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, ' + a(NAVY, 'f5') + ' 4%, ' + a(NAVY, '40') + ' 45%, transparent 75%)' }} />
            <div aria-hidden className="absolute top-0 right-0 w-px h-full" style={{ background: a(GOLD, '40') }} />
            <motion.div
              className="absolute bottom-0 left-0 right-0 p-6"
              initial={{ opacity: 0, y: reduce ? 0 : 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reduce ? { duration: 0.15 } : { delay: 0.1, duration: 0.4 }}
            >
              <span className="inline-block text-[10px] font-bold uppercase tracking-[0.16em] px-2.5 py-1 rounded-full mb-3" style={{ background: GOLD, color: NAVY }}>
                {tierLabel(teacher.tier)}
              </span>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] mb-1.5" style={{ color: GOLD_LIGHT, fontFamily: SANS }}>
                {teacher.designation}
              </p>
              <h2 id="tutor-profile-name" className="text-white leading-tight" style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 'clamp(1.6rem, 2.4vw, 2.1rem)' }}>
                {teacher.name}
              </h2>
            </motion.div>
          </div>
          {/* Content column */}
          <div className="flex-1 min-w-0 flex flex-col bg-white">
            <CloseBtn />
            <Tabs padRight />
            <div className="overflow-y-auto p-6" style={{ maxHeight: 'calc(86vh - 9rem)' }}>
              <TabContent />
            </div>
          </div>
        </motion.div>
      ) : (
        /* ---------- MOBILE SHEET ---------- */
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="tutor-profile-name"
          tabIndex={-1}
          className="relative z-10 w-full max-h-[92dvh] overflow-hidden rounded-t-3xl flex flex-col focus:outline-none"
          style={{ background: '#fff', boxShadow: `0 -10px 50px ${a(NAVY, '4d')}` }}
          variants={panelVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={transition}
        >
          <div className="relative h-56 flex-shrink-0 overflow-hidden" style={{ background: NAVY }}>
            <Portrait teacher={teacher} eager />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, ' + a(NAVY, 'f5') + ' 0%, ' + a(NAVY, '70') + ' 48%, transparent 80%)' }} />
            <CloseBtn onImage />
            <div className="absolute bottom-4 left-5 right-12">
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: GOLD, fontFamily: SANS }}>{teacher.designation}</p>
              <h2 id="tutor-profile-name" className="text-white leading-tight" style={{ fontFamily: SERIF, fontWeight: 600, fontSize: '1.7rem' }}>
                {teacher.name}
              </h2>
            </div>
          </div>
          <Tabs />
          <div className="flex-1 overflow-y-auto p-5">
            <TabContent />
          </div>
        </motion.div>
      )}
    </div>
  );
};

/* ── Hero stat ─────────────────────────────────────────────────────────── */
const Stat = ({ value, label }: { value: string; label: string }) => (
  <div className="text-center">
    <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 'clamp(1.7rem, 3vw, 2.4rem)', color: GOLD, lineHeight: 1 }}>{value}</div>
    <div className="text-[10px] sm:text-xs uppercase tracking-[0.16em] mt-1.5" style={{ color: 'rgba(255,255,255,0.6)', fontFamily: SANS }}>{label}</div>
  </div>
);

const FindTeacher = () => {
  const [filter, setFilter] = useState<FilterKey>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<CatalogueTutor | null>(null);
  const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const openProfile = useCallback((teacher: CatalogueTutor, el: HTMLButtonElement) => {
    triggerRef.current = el;
    setTriggerRect(el.getBoundingClientRect());
    setSelected(teacher);
  }, []);
  const closeProfile = useCallback(() => setSelected(null), []);

  useEffect(() => {
    document.body.style.overflow = selected ? 'hidden' : '';
    document.body.classList.toggle('teacher-profile-open', Boolean(selected));
    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('teacher-profile-open');
    };
  }, [selected]);

  const filtered = useMemo(() => {
    let list = [...TUTORS];
    if (filter === 'english') list = list.filter(teachesEnglish);
    else if (filter === 'maths') list = list.filter(teachesMath);
    else if (filter === 'science') list = list.filter(teachesScience);
    else if (filter === 'primary') list = list.filter(t => t.hasPrimary);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        t =>
          t.name.toLowerCase().includes(q) ||
          t.designation.toLowerCase().includes(q) ||
          t.subjects.toLowerCase().includes(q) ||
          t.tagline.toLowerCase().includes(q),
      );
    }
    return list;
  }, [filter, search]);

  const grouped = filter === 'all' && !search.trim();
  const seniors = useMemo(() => filtered.filter(t => t.tier === 'senior'), [filtered]);
  const experienced = useMemo(() => filtered.filter(t => t.tier === 'mid'), [filtered]);
  const teachingTeam = useMemo(() => filtered.filter(t => t.tier === 'junior'), [filtered]);

  return (
    <div className="min-h-screen" style={{ background: CREAM, fontFamily: SANS }}>
      <style>{CARD_CSS}</style>
      <SEO
        title="Meet Our Educators"
        description="Browse our faculty of 40+ expert educators and find the perfect match for your child. DA Tuition, Canley Heights."
        canonicalUrl="/find-teacher"
      />
      <NavigationNew />

      {/* Hero — faculty masthead */}
      <div className="relative pt-28 pb-12 px-4 text-center overflow-hidden" style={{ background: NAVY }}>
        <Constellation tone="light" />
        <div className="relative max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-[0.22em] mb-4" style={{ color: GOLD }}>
            The DA Tuition Faculty
          </p>
          <h1 className="text-white leading-tight mb-4" style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 'clamp(2.3rem, 6vw, 3.7rem)', letterSpacing: '-0.02em' }}>
            Meet Our Educators
          </h1>
          <p className="text-base sm:text-lg mb-9 max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.72)' }}>
            Hand-picked teachers who care as much about confidence as they do about marks. Get to know the people behind the results.
          </p>

          <div className="flex justify-center gap-8 sm:gap-14 mb-9">
            <Stat value="40+" label="Educators" />
            <Stat value="20+" label="Years" />
            <Stat value="650+" label="Students" />
            <Stat value="K–12" label="All Levels" />
          </div>

          <div className="mx-auto mb-6 max-w-2xl rounded-2xl px-5 py-4 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.76)', background: 'rgba(255,255,255,0.07)', border: `1px solid ${a(GOLD, '24')}` }}>
            Senior educators are shown first for transparency, but placements are matched to your child's subject, confidence and learning style.
          </div>

          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(255,255,255,0.55)' }} />
            <input
              type="text"
              placeholder="Search by name or subject..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Search teachers by name or subject"
              className="w-full pl-11 pr-4 py-3 rounded-full text-sm outline-none"
              style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', caretColor: GOLD, border: `1px solid ${a(GOLD, '33')}` }}
            />
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="sticky top-[72px] z-30 py-3 px-4 overflow-x-auto" style={{ background: NAVY, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex gap-2 justify-center min-w-max mx-auto">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className="px-4 py-1.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap focus:outline-none"
              style={{ background: filter === f.key ? GOLD : 'rgba(255,255,255,0.08)', color: filter === f.key ? NAVY : 'rgba(255,255,255,0.75)' }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="relative">
        <Constellation tone="dark" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg font-medium" style={{ color: a(NAVY, '80') }}>
                No teachers found.{' '}
                <button onClick={() => { setFilter('all'); setSearch(''); }} style={{ color: NAVY }} className="underline">
                  Clear filters
                </button>
              </p>
            </div>
          ) : grouped ? (
            <>
              <section className="mb-14">
                <SectionHeader
                  eyebrow="Experience first"
                  title="Senior Educators"
                  count={seniors.length}
                  note="Shown first because they help lead programs and mentor the team. Your child's best match still depends on subject, personality, confidence and goals."
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                  {seniors.map(t => (
                    <FeaturedCard key={t.id} teacher={t} onSelect={el => openProfile(t, el)} />
                  ))}
                </div>
              </section>
              <section className="mb-14">
                <SectionHeader
                  eyebrow="Established teachers"
                  title="Experienced Educators"
                  count={experienced.length}
                  note="A broad group of trusted tutors across primary, English, mathematics and science, all supported by the same DA lesson standards."
                />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
                  {experienced.map(t => (
                    <TutorCard key={t.id} teacher={t} onSelect={el => openProfile(t, el)} />
                  ))}
                </div>
              </section>
              <section>
                <SectionHeader
                  eyebrow="The wider faculty"
                  title="Teaching Team"
                  count={teachingTeam.length}
                  note="More carefully selected educators who bring energy, subject strength and close support to the classroom."
                />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
                  {teachingTeam.map(t => (
                    <TutorCard key={t.id} teacher={t} onSelect={el => openProfile(t, el)} />
                  ))}
                </div>
              </section>
            </>
          ) : (
            <>
              <p className="text-sm mb-6" style={{ color: a(NAVY, '70') }}>
                Showing {filtered.length} educator{filtered.length !== 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
                {filtered.map(t => (
                  <TutorCard key={t.id} teacher={t} onSelect={el => openProfile(t, el)} />
                ))}
              </div>
            </>
          )}

          {/* Match CTA */}
          <div className="relative mt-20 rounded-3xl p-10 text-center overflow-hidden" style={{ background: NAVY, border: `1px solid ${a(GOLD, '40')}` }}>
            <Constellation tone="light" />
            <div className="relative">
              <h3 className="text-white mb-3" style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>
                Not sure who is right for your child?
              </h3>
              <p className="text-sm mb-7 max-w-lg mx-auto" style={{ color: 'rgba(255,255,255,0.72)' }}>
                Tell us about your child and our team will match them with the right educator — by needs, personality, and goals.
              </p>
              <a href="/book-interview" className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-sm transition-opacity hover:opacity-85" style={{ background: GOLD, color: NAVY }}>
                Request a teacher match
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <FooterNew />

      <AnimatePresence>
        {selected && (
          <ProfileModal key={selected.id} teacher={selected} onClose={closeProfile} returnFocusTo={triggerRef.current} triggerRect={triggerRect} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default FindTeacher;
