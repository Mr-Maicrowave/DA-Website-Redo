import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, CheckCircle, Plus, Trash2,
  Phone, Home, ChevronDown, GraduationCap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '@/components/SEO';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';

// ─── Palette ──────────────────────────────────────────────────────────────────
const C = {
  navy:   '#0A1B34',
  gold:   '#D4AF37',
  cream:  '#F7F4EE',
  white:  '#FFFFFF',
  text:   '#1B2B4A',
  // derived (navy = rgb(10,27,52))
  goldDim:    'rgba(212,175,55,0.65)',
  goldFaint:  'rgba(212,175,55,0.12)',
  goldRing:   'rgba(212,175,55,0.28)',
  navyDim:    'rgba(10,27,52,0.45)',
  navyFaint:  'rgba(10,27,52,0.07)',
  creamBorder:'rgba(10,27,52,0.10)',
  inputBg:    '#F9F5EE',
} as const;

// ─── Types ────────────────────────────────────────────────────────────────────

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  school: string;
  yearLevel: string;
  subject: string;
  academicConcern: string;
  tutoringFormat: string;
}

interface ParentForm {
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  preferredContact: string;
  relationship: string;
  suburb: string;
}

interface FormErrors { [key: string]: string; }

// ─── Constants ────────────────────────────────────────────────────────────────

const TITLES          = ['Mr', 'Mrs', 'Ms', 'Miss', 'Dr', 'Prof'];
const CONTACT_METHODS = ['Phone Call', 'SMS', 'Email', 'WhatsApp'];
const RELATIONSHIPS   = ['Mother', 'Father', 'Guardian', 'Grandparent', 'Other'];
const YEAR_LEVELS     = [
  'Kindergarten','Year 1','Year 2','Year 3','Year 4','Year 5','Year 6',
  'Year 7','Year 8','Year 9','Year 10','Year 11','Year 12',
];
const SUBJECTS = [
  'English','Mathematics','Science','Biology','Chemistry','Physics',
  'Business Studies','Legal Studies','General Mathematics','Extension Mathematics',
  'Advanced English','Standard English','Other',
];
const TUTORING_FORMATS = [
  'Small Group (3–5 students)','One-on-One','Online','Not Sure Yet',
];
const CONCERNS = [
  'Falling behind in class',
  'Preparing for exams / HSC',
  'Building confidence',
  'Understanding core concepts',
  'Improving exam technique',
  'Catching up after absence',
  'Extension / Enrichment',
  'Other',
];
const JOURNEY_STEPS = [
  { n: 1, label: 'Parent Details',  sub: 'Your contact information' },
  { n: 2, label: 'Student Details', sub: 'About your child'         },
  { n: 3, label: 'Confirmation',    sub: 'All done'                 },
] as const;
const NEXT_STEPS = [
  {
    n: '01',
    title: 'Submission reviewed',
    body: "Our team carefully reads your details to understand your child's needs and goals.",
  },
  {
    n: '02',
    title: 'Program matched',
    body: 'We identify the most suitable subject, year level, class and starting point for your child.',
  },
  {
    n: '03',
    title: 'We contact you',
    body: 'A team member reaches out to discuss our recommendations and confirm availability.',
  },
  {
    n: '04',
    title: 'Your child begins',
    body: 'Your child starts their DA journey — supported, challenged and ready to grow.',
  },
] as const;
const ORDINALS = ['First','Second','Third','Fourth','Fifth'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function emptyStudent(): Student {
  return {
    id: crypto.randomUUID(),
    firstName: '', lastName: '', dateOfBirth: '', school: '',
    yearLevel: '', subject: '', academicConcern: '', tutoringFormat: '',
  };
}

// ─── Enrolment Journey ────────────────────────────────────────────────────────

const ROMAN = ['I', 'II', 'III'] as const;

function EnrolmentJourney({ step }: { step: number }) {
  return (
    <>
      {/* ── Desktop — horizontal ── */}
      <div className="hidden sm:block w-full max-w-lg mx-auto select-none">

        {/* Header — ornamental flanking lines */}
        <div className="flex items-center gap-5 mb-11">
          <div className="flex-1 h-px"
               style={{ background: `linear-gradient(90deg, transparent, ${C.gold}40)` }} />
          <div className="flex items-center gap-2.5">
            {/* Left ornament */}
            <div className="flex items-center gap-1">
              <div className="w-[3px] h-[3px] rounded-full" style={{ background: C.gold, opacity: 0.35 }} />
              <div className="w-1 h-px" style={{ background: `${C.gold}55` }} />
            </div>
            <p className="text-[6.5px] font-black uppercase whitespace-nowrap"
               style={{ color: C.goldDim, letterSpacing: '0.55em' }}>
              Enrolment Journey
            </p>
            {/* Right ornament */}
            <div className="flex items-center gap-1">
              <div className="w-1 h-px" style={{ background: `${C.gold}55` }} />
              <div className="w-[3px] h-[3px] rounded-full" style={{ background: C.gold, opacity: 0.35 }} />
            </div>
          </div>
          <div className="flex-1 h-px"
               style={{ background: `linear-gradient(90deg, ${C.gold}40, transparent)` }} />
        </div>

        {/* Steps row */}
        <div className="flex items-start">
          {JOURNEY_STEPS.map((s, i) => {
            const done   = step > s.n;
            const active = step === s.n;
            const last   = i === JOURNEY_STEPS.length - 1;
            const roman  = ROMAN[i];

            return (
              <div key={s.n} className="flex items-start" style={{ flex: last ? '0 0 auto' : '1 1 auto' }}>
                {/* ── Node ── */}
                <div className="flex flex-col items-center">
                  <div className="relative w-[68px] h-[68px] flex items-center justify-center">

                    {/* Outermost breathing ring — active only */}
                    <AnimatePresence>
                      {active && (
                        <motion.div key="breathe"
                          className="absolute rounded-full"
                          style={{
                            inset: -14,
                            border: `1px solid ${C.gold}`,
                            opacity: 0,
                          }}
                          animate={{ opacity: [0, 0.18, 0] }}
                          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                        />
                      )}
                    </AnimatePresence>

                    {/* Outer ring — active only, entrance animation */}
                    <AnimatePresence>
                      {active && (
                        <motion.div key="outer-ring"
                          className="absolute rounded-full"
                          style={{ inset: -9, border: `1px solid rgba(212,175,55,0.32)` }}
                          initial={{ opacity: 0, scale: 0.7 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.7 }}
                          transition={{ duration: 0.4, ease: 'easeOut' }}
                        />
                      )}
                    </AnimatePresence>

                    {/* Main circle */}
                    <motion.div
                      className="w-[68px] h-[68px] rounded-full flex items-center justify-center relative overflow-hidden"
                      animate={{
                        background: done
                          ? `linear-gradient(135deg, ${C.gold} 0%, #c9a82e 100%)`
                          : active
                          ? `linear-gradient(135deg, ${C.gold} 0%, #e4c45a 60%, ${C.gold} 100%)`
                          : 'transparent',
                        boxShadow: active
                          ? `0 0 0 1.5px ${C.gold}, 0 10px 36px rgba(212,175,55,0.32), 0 2px 8px rgba(0,0,0,0.2)`
                          : done
                          ? `0 0 0 1px rgba(212,175,55,0.55), 0 6px 20px rgba(212,175,55,0.20)`
                          : `0 0 0 1px rgba(255,255,255,0.13)`,
                      }}
                      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                    >
                      {/* Shimmer on active */}
                      {active && (
                        <motion.div
                          className="absolute inset-0 rounded-full"
                          style={{
                            background: 'linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%)',
                          }}
                          animate={{ x: ['-100%', '200%'] }}
                          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.2 }}
                        />
                      )}

                      <AnimatePresence mode="wait">
                        {done ? (
                          <motion.div key="chk"
                            initial={{ opacity: 0, scale: 0.3, rotate: -20 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            transition={{ duration: 0.3, ease: 'backOut' }}>
                            <CheckCircle className="w-[26px] h-[26px]" strokeWidth={2}
                              style={{ color: C.navy }} />
                          </motion.div>
                        ) : (
                          <motion.span key="roman"
                            className="font-serif font-medium leading-none"
                            style={{
                              fontSize: active ? '1.15rem' : '1rem',
                              letterSpacing: '0.06em',
                              color: active ? C.navy : 'rgba(255,255,255,0.22)',
                            }}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.22 }}>
                            {roman}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </div>

                  {/* Labels */}
                  <div className="mt-5 text-center">
                    <p className="leading-none font-black uppercase"
                       style={{
                         fontSize: '8.5px',
                         letterSpacing: '0.24em',
                         color: done
                           ? `${C.gold}88`
                           : active
                           ? C.gold
                           : 'rgba(255,255,255,0.18)',
                         transition: 'color 0.35s',
                       }}>
                      {s.label}
                    </p>
                    {/* Active step has a small gold underline */}
                    <motion.div
                      className="mx-auto mt-1.5 rounded-full"
                      style={{ height: '1.5px', background: C.gold }}
                      animate={{ width: active ? 20 : 0, opacity: active ? 0.65 : 0 }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                    />
                    <p className="mt-1.5 italic"
                       style={{
                         fontSize: '8.5px',
                         color: active ? 'rgba(255,255,255,0.38)' : 'rgba(255,255,255,0.12)',
                         transition: 'color 0.35s',
                       }}>
                      {s.sub}
                    </p>
                  </div>
                </div>

                {/* Track between nodes */}
                {!last && (
                  <div className="flex-1 relative mt-[33px] mx-5" style={{ height: '1px' }}>
                    {/* Dotted base track */}
                    <div className="absolute inset-0"
                         style={{
                           backgroundImage: `repeating-linear-gradient(90deg, rgba(255,255,255,0.14) 0px, rgba(255,255,255,0.14) 3px, transparent 3px, transparent 9px)`,
                         }} />
                    {/* Solid gold fill */}
                    <motion.div
                      className="absolute inset-0 origin-left overflow-hidden"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: step > s.n ? 1 : 0 }}
                      transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}>
                      <div className="h-full w-full"
                           style={{ background: `linear-gradient(90deg, ${C.gold}, ${C.gold}aa)` }} />
                    </motion.div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Mobile — vertical ── */}
      <div className="sm:hidden w-full max-w-[280px] mx-auto select-none">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, transparent, ${C.gold}38)` }} />
          <p className="text-[6.5px] font-black uppercase whitespace-nowrap"
             style={{ color: C.goldDim, letterSpacing: '0.52em' }}>
            Enrolment Journey
          </p>
          <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${C.gold}38, transparent)` }} />
        </div>

        {JOURNEY_STEPS.map((s, i) => {
          const done   = step > s.n;
          const active = step === s.n;
          const last   = i === JOURNEY_STEPS.length - 1;
          const roman  = ROMAN[i];
          return (
            <div key={s.n} className="flex items-start gap-5">
              <div className="flex flex-col items-center">

                {/* Circle */}
                <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                  {/* Breathing ring on active */}
                  <AnimatePresence>
                    {active && (
                      <motion.div key="mb-breathe"
                        className="absolute rounded-full"
                        style={{ inset: -7, border: `1px solid ${C.gold}` }}
                        animate={{ opacity: [0, 0.2, 0] }}
                        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                      />
                    )}
                  </AnimatePresence>
                  {/* Outer ring on active */}
                  <AnimatePresence>
                    {active && (
                      <motion.div key="mb-outer"
                        className="absolute rounded-full"
                        style={{ inset: -4, border: `1px solid rgba(212,175,55,0.3)` }}
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.38, ease: 'easeOut' }}
                      />
                    )}
                  </AnimatePresence>

                  <motion.div
                    className="w-12 h-12 rounded-full flex items-center justify-center relative overflow-hidden"
                    animate={{
                      background: done
                        ? `linear-gradient(135deg, ${C.gold} 0%, #c9a82e 100%)`
                        : active
                        ? `linear-gradient(135deg, ${C.gold} 0%, #e4c45a 60%, ${C.gold} 100%)`
                        : 'transparent',
                      boxShadow: active
                        ? `0 0 0 1.5px ${C.gold}, 0 6px 20px rgba(212,175,55,0.28)`
                        : done
                        ? `0 0 0 1px rgba(212,175,55,0.5), 0 4px 14px rgba(212,175,55,0.18)`
                        : `0 0 0 1px rgba(255,255,255,0.12)`,
                    }}
                    transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                  >
                    {done ? (
                      <CheckCircle className="w-5 h-5" strokeWidth={2} style={{ color: C.navy }} />
                    ) : (
                      <span className="font-serif font-medium" style={{
                        fontSize: active ? '1rem' : '0.88rem',
                        letterSpacing: '0.06em',
                        color: active ? C.navy : 'rgba(255,255,255,0.22)',
                      }}>{roman}</span>
                    )}
                  </motion.div>
                </div>

                {/* Vertical track */}
                {!last && (
                  <div className="relative mx-auto mt-2" style={{ width: '1px', height: '40px' }}>
                    <div className="absolute inset-0"
                         style={{
                           backgroundImage: `repeating-linear-gradient(180deg, rgba(255,255,255,0.14) 0px, rgba(255,255,255,0.14) 3px, transparent 3px, transparent 9px)`,
                         }} />
                    <motion.div className="absolute inset-0 origin-top overflow-hidden"
                      animate={{ scaleY: step > s.n ? 1 : 0 }}
                      transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}>
                      <div className="h-full w-full" style={{ background: C.gold }} />
                    </motion.div>
                  </div>
                )}
              </div>

              {/* Label area */}
              <div className={`pt-2.5 ${last ? '' : 'pb-9'}`}>
                <p className="leading-none font-black uppercase"
                   style={{
                     fontSize: '9.5px',
                     letterSpacing: '0.22em',
                     color: done
                       ? `${C.gold}80`
                       : active
                       ? C.gold
                       : 'rgba(255,255,255,0.2)',
                     transition: 'color 0.35s',
                   }}>
                  {s.label}
                </p>
                {/* Active underline */}
                <motion.div
                  className="mt-1.5 rounded-full"
                  style={{ height: '1.5px', background: C.gold }}
                  animate={{ width: active ? 18 : 0, opacity: active ? 0.6 : 0 }}
                  transition={{ duration: 0.38 }}
                />
                <p className="mt-1.5 italic"
                   style={{
                     fontSize: '9px',
                     color: active ? 'rgba(255,255,255,0.38)' : 'rgba(255,255,255,0.13)',
                     transition: 'color 0.35s',
                   }}>
                  {s.sub}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

// ─── DA Note ─────────────────────────────────────────────────────────────────

function DANote({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="mt-8 flex gap-3.5 rounded-xl px-5 py-4"
      style={{
        background: `rgba(10,27,52,0.032)`,
        border: `1px solid ${C.gold}14`,
      }}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.35 }}
    >
      {/* Tapered gold left bar */}
      <div className="w-[1.5px] self-stretch rounded-full shrink-0"
           style={{ background: `linear-gradient(180deg, ${C.gold}55 0%, ${C.gold}10 100%)` }} />
      <div>
        <p className="text-[8px] font-black uppercase mb-1.5"
           style={{ color: C.goldDim, letterSpacing: '0.38em' }}>
          Why we ask this
        </p>
        <p className="text-[12px] leading-[1.78]" style={{ color: `${C.text}48` }}>
          {children}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Field primitives ─────────────────────────────────────────────────────────

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <motion.p className="mt-1.5 text-[11px] text-red-500 flex items-center gap-1.5"
      initial={{ opacity: 0, y: -3 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }}>
      <span className="w-1 h-1 rounded-full bg-red-400 shrink-0" />
      {msg}
    </motion.p>
  );
}

function TextField({
  label, value, onChange, type = 'text', placeholder, error, hint,
}: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; error?: string; hint?: string;
}) {
  const [focused, setFocused] = useState(false);
  const filled   = value.trim().length > 0;
  const hasError = Boolean(error);

  return (
    <motion.div whileHover={{ y: focused ? 0 : -1 }} transition={{ duration: 0.14 }}>
      <label className="block mb-2.5 text-[10px] font-black uppercase tracking-[0.20em]"
        style={{
          color: hasError ? '#ef4444' : focused ? C.gold : `${C.text}45`,
          transition: 'color 0.22s',
          letterSpacing: '0.20em',
        }}>
        {label}
      </label>
      <div className="relative">
        <input
          type={type} value={value} placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full rounded-xl px-5 py-[15px] text-[14px] outline-none appearance-none"
          style={{
            background: hasError ? '#fff5f5' : C.inputBg,
            color: C.text,
            letterSpacing: '0.01em',
            border: `1.5px solid ${hasError ? '#ef4444' : focused ? C.gold : filled ? '#d6cdb8' : '#e3dace'}`,
            boxShadow: focused
              ? `0 0 0 4px ${C.goldRing}, 0 2px 8px rgba(0,0,0,0.03)`
              : '0 1px 3px rgba(0,0,0,0.04)',
            transition: 'border-color 0.22s, box-shadow 0.22s, background 0.22s',
          }}
        />
        <AnimatePresence>
          {filled && !focused && !hasError && (
            <motion.div className="absolute right-4 top-1/2 -translate-y-1/2"
              initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }} transition={{ duration: 0.16 }}>
              <CheckCircle className="w-4 h-4" strokeWidth={2} style={{ color: C.gold }} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {hint && !error && (
        <p className="mt-2 text-[10.5px] leading-snug italic" style={{ color: `${C.text}35` }}>{hint}</p>
      )}
      <FieldError msg={error} />
    </motion.div>
  );
}

function SelectField({
  label, value, onChange, options, placeholder = 'Select…', error, hint,
}: {
  label: string; value: string; onChange: (v: string) => void;
  options: string[]; placeholder?: string; error?: string; hint?: string;
}) {
  const [focused, setFocused] = useState(false);
  const filled   = value.length > 0;
  const hasError = Boolean(error);

  return (
    <motion.div whileHover={{ y: focused ? 0 : -1 }} transition={{ duration: 0.14 }}>
      <label className="block mb-2.5 text-[10px] font-black uppercase"
        style={{
          color: hasError ? '#ef4444' : focused ? C.gold : `${C.text}45`,
          transition: 'color 0.22s',
          letterSpacing: '0.20em',
        }}>
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full rounded-xl px-5 py-[15px] pr-11 text-[14px] outline-none appearance-none"
          style={{
            background: hasError ? '#fff5f5' : C.inputBg,
            color: filled ? C.text : '#b8bdc8',
            letterSpacing: '0.01em',
            border: `1.5px solid ${hasError ? '#ef4444' : focused ? C.gold : filled ? '#d6cdb8' : '#e3dace'}`,
            boxShadow: focused
              ? `0 0 0 4px ${C.goldRing}, 0 2px 8px rgba(0,0,0,0.03)`
              : '0 1px 3px rgba(0,0,0,0.04)',
            transition: 'border-color 0.22s, box-shadow 0.22s, background 0.22s',
          }}
        >
          <option value="" style={{ color: '#b8bdc8' }}>{placeholder}</option>
          {options.map((o) => (
            <option key={o} value={o} style={{ color: C.text }}>{o}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
          <AnimatePresence mode="wait">
            {filled && !focused && !hasError ? (
              <motion.div key="ok"
                initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }} transition={{ duration: 0.15 }}>
                <CheckCircle className="w-4 h-4" strokeWidth={2} style={{ color: C.gold }} />
              </motion.div>
            ) : (
              <motion.div key="chev"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                exit={{ opacity: 0 }} transition={{ duration: 0.1 }}>
                <ChevronDown className="w-4 h-4"
                  style={{ color: focused ? C.gold : `${C.text}38`, transition: 'color 0.2s' }} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      {hint && !error && (
        <p className="mt-2 text-[10.5px] leading-snug italic" style={{ color: `${C.text}35` }}>{hint}</p>
      )}
      <FieldError msg={error} />
    </motion.div>
  );
}

// ─── Section divider ──────────────────────────────────────────────────────────

function SectionDivider({ label }: { label?: string }) {
  return (
    <div className="mb-8 flex items-center gap-5">
      <div className="flex-1 h-px"
           style={{ background: `linear-gradient(90deg, ${C.gold}30, transparent)` }} />
      {label && (
        <span className="text-[7px] font-black uppercase shrink-0"
              style={{ color: `${C.gold}50`, letterSpacing: '0.52em' }}>
          {label}
        </span>
      )}
      <div className="flex-1 h-px"
           style={{ background: `linear-gradient(90deg, transparent, ${C.gold}30)` }} />
    </div>
  );
}

// ─── Step 1 ───────────────────────────────────────────────────────────────────

function Step1({ form, setForm, errors }: {
  form: ParentForm; setForm: (f: ParentForm) => void; errors: FormErrors;
}) {
  const set = (k: keyof ParentForm) => (v: string) => setForm({ ...form, [k]: v });
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, ease: 'easeOut' }}>

      {/* Step header */}
      <div className="mb-10">
        <p className="text-[7.5px] font-black uppercase mb-4"
           style={{ color: C.goldDim, letterSpacing: '0.44em' }}>
          Step 1 of 2 &nbsp;·&nbsp; Parent Details
        </p>
        <h2 className="font-serif leading-[1.15]"
            style={{
              fontSize: 'clamp(1.55rem, 3.8vw, 2rem)',
              color: C.navy,
              letterSpacing: '-0.025em',
            }}>
          Every student's journey starts with<br className="hidden sm:block" />
          understanding where they are now.
        </h2>
        <div className="mt-4 w-12 h-[1.5px] rounded-full"
             style={{ background: `linear-gradient(90deg, ${C.gold}, ${C.gold}30)` }} />
        <p className="mt-4 text-[13px] leading-[1.85] max-w-lg" style={{ color: `${C.text}55` }}>
          We'll use your details to reach out personally — not with a generic email,
          but a real conversation about what's right for your child.
        </p>
      </div>

      <SectionDivider label="Your Details" />

      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-[110px_1fr_1fr] gap-5">
          <SelectField label="Title" value={form.title} onChange={set('title')}
            options={TITLES} placeholder="Title" error={errors.title} />
          <TextField label="First Name" value={form.firstName} onChange={set('firstName')}
            placeholder="e.g. Sarah" error={errors.firstName} />
          <TextField label="Last Name" value={form.lastName} onChange={set('lastName')}
            placeholder="e.g. Nguyen" error={errors.lastName} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <TextField label="Email Address" value={form.email} onChange={set('email')}
            type="email" placeholder="sarah@email.com" error={errors.email}
            hint="We'll confirm your interview via email." />
          <TextField label="Mobile Number" value={form.mobile} onChange={set('mobile')}
            type="tel" placeholder="04xx xxx xxx" error={errors.mobile}
            hint="Preferred for quick scheduling." />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <SelectField label="Preferred Contact Method" value={form.preferredContact}
            onChange={set('preferredContact')} options={CONTACT_METHODS}
            error={errors.preferredContact}
            hint="We'll always reach out the way that suits you." />
          <SelectField label="Relationship to Student" value={form.relationship}
            onChange={set('relationship')} options={RELATIONSHIPS}
            error={errors.relationship} />
        </div>

        <TextField label="Suburb" value={form.suburb} onChange={set('suburb')}
          placeholder="e.g. Canley Heights" error={errors.suburb}
          hint="Helps us suggest the most convenient learning format." />
      </div>

      <DANote>
        We read every submission ourselves before reaching out. Your contact details
        help us respond in the way that suits your family — not with an auto-reply,
        but a real conversation at a time that works for you.
      </DANote>
    </motion.div>
  );
}

// ─── Student Card ─────────────────────────────────────────────────────────────

function StudentCard({ student, index, onChange, onRemove, canRemove, errors }: {
  student: Student; index: number; onChange: (s: Student) => void;
  onRemove: () => void; canRemove: boolean; errors: FormErrors;
}) {
  const set    = (k: keyof Student) => (v: string) => onChange({ ...student, [k]: v });
  const prefix = `s${index}`;
  const displayName = student.firstName.trim() || `${ORDINALS[index] ?? 'Your'} Child`;

  return (
    <motion.div layout
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6, scale: 0.98 }} transition={{ duration: 0.28 }}
      className="rounded-2xl overflow-hidden"
      style={{ border: `1.5px solid ${C.creamBorder}`, boxShadow: '0 2px 12px rgba(10,27,52,0.05)' }}>

      {/* Card header */}
      <div className="flex items-center justify-between px-7 py-5"
           style={{ background: C.navy }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
               style={{ background: C.gold }}>
            <GraduationCap className="w-4 h-4" style={{ color: C.navy }} />
          </div>
          <div>
            <span className="text-[9.5px] font-black uppercase tracking-[0.22em]"
                  style={{ color: `${C.gold}80` }}>
              Student {index + 1}
            </span>
            <AnimatePresence mode="wait">
              {student.firstName.trim() && (
                <motion.p key={displayName}
                  className="text-[13px] font-semibold leading-none mt-0.5"
                  style={{ color: C.white }}
                  initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
                  {displayName}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
        {canRemove && (
          <motion.button type="button" onClick={onRemove}
            className="flex items-center gap-1.5 text-[11px] font-semibold"
            style={{ color: 'rgba(255,255,255,0.3)' }}
            whileHover={{ color: '#f87171' }} whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.15 }}>
            <Trash2 className="w-3.5 h-3.5" />Remove
          </motion.button>
        )}
      </div>

      {/* Fields */}
      <div className="p-7 space-y-6" style={{ background: '#FDFAF6' }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <TextField label="First Name" value={student.firstName} onChange={set('firstName')}
            placeholder="e.g. Minh" error={errors[`${prefix}_firstName`]} />
          <TextField label="Last Name" value={student.lastName} onChange={set('lastName')}
            placeholder="e.g. Nguyen" error={errors[`${prefix}_lastName`]} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <TextField label="Date of Birth" value={student.dateOfBirth}
            onChange={set('dateOfBirth')} type="date" error={errors[`${prefix}_dateOfBirth`]} />
          <TextField label="Current School" value={student.school} onChange={set('school')}
            placeholder="e.g. Fairfield High School" error={errors[`${prefix}_school`]} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <SelectField label="Year Level" value={student.yearLevel}
            onChange={set('yearLevel')} options={YEAR_LEVELS}
            error={errors[`${prefix}_yearLevel`]}
            hint="We tailor content to the exact NSW curriculum year." />
          <SelectField label="Subject Interested In" value={student.subject}
            onChange={set('subject')} options={SUBJECTS}
            error={errors[`${prefix}_subject`]} />
        </div>
        {/* Thin divider before concerns */}
        <div className="h-px" style={{ background: `${C.gold}14` }} />
        <SelectField label="What is your main concern right now?"
          value={student.academicConcern} onChange={set('academicConcern')}
          options={CONCERNS} placeholder="Select the closest match…"
          error={errors[`${prefix}_academicConcern`]}
          hint="This helps us recommend the most effective starting point." />
        <SelectField label="Preferred Learning Format" value={student.tutoringFormat}
          onChange={set('tutoringFormat')} options={TUTORING_FORMATS}
          placeholder="Select a format…" error={errors[`${prefix}_tutoringFormat`]}
          hint="All formats use the same small-group approach DA is known for." />
      </div>
    </motion.div>
  );
}

// ─── Step 2 ───────────────────────────────────────────────────────────────────

function Step2({ students, setStudents, errors }: {
  students: Student[]; setStudents: (s: Student[]) => void; errors: FormErrors;
}) {
  const update  = (i: number, s: Student) => { const n = [...students]; n[i] = s; setStudents(n); };
  const add     = () => setStudents([...students, emptyStudent()]);
  const remove  = (i: number) => setStudents(students.filter((_, j) => j !== i));

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, ease: 'easeOut' }}>

      {/* Step header */}
      <div className="mb-10">
        <p className="text-[7.5px] font-black uppercase mb-4"
           style={{ color: C.goldDim, letterSpacing: '0.44em' }}>
          Step 2 of 2 &nbsp;·&nbsp; Student Details
        </p>
        <h2 className="font-serif leading-[1.15]"
            style={{
              fontSize: 'clamp(1.55rem, 3.8vw, 2rem)',
              color: C.navy,
              letterSpacing: '-0.025em',
            }}>
          The more we understand about your child,<br className="hidden sm:block" />
          the better we can recommend the right pathway.
        </h2>
        <div className="mt-4 w-12 h-[1.5px] rounded-full"
             style={{ background: `linear-gradient(90deg, ${C.gold}, ${C.gold}30)` }} />
        <p className="mt-4 text-[13px] leading-[1.85] max-w-lg" style={{ color: `${C.text}55` }}>
          No two students are the same. These details help us match your child to the right
          class, teacher and level — before you even walk through our door.
        </p>
      </div>

      <SectionDivider label="Student Information" />

      <div className="space-y-5">
        <AnimatePresence>
          {students.map((s, i) => (
            <StudentCard key={s.id} student={s} index={i}
              onChange={(u) => update(i, u)}
              onRemove={() => remove(i)}
              canRemove={students.length > 1}
              errors={errors} />
          ))}
        </AnimatePresence>

        {students.length < 5 && (
          <motion.button type="button" onClick={add}
            className="w-full flex items-center justify-center gap-2.5 rounded-2xl border-2 border-dashed py-4 text-[11.5px] font-bold uppercase tracking-[0.16em]"
            style={{ borderColor: `${C.gold}35`, color: `${C.gold}60` }}
            whileHover={{ borderColor: `${C.gold}70`, color: C.gold, backgroundColor: `${C.gold}06` }}
            whileTap={{ scale: 0.99 }} transition={{ duration: 0.16 }}>
            <Plus className="w-4 h-4" />Add Another Student
          </motion.button>
        )}
      </div>

      <DANote>
        These details help us understand your child's starting point before we recommend
        a class. We look at year level, subject, confidence and goals together — so that
        when we suggest a pathway, it's one we genuinely believe is right for them.
      </DANote>

      {/* Promise block */}
      <motion.div className="mt-6 rounded-2xl p-6"
        style={{ background: C.navy, border: `1px solid ${C.gold}20` }}
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.38 }}>
        <div className="flex gap-4">
          <div className="w-[1.5px] shrink-0 rounded-full"
               style={{ background: `linear-gradient(180deg, ${C.gold} 0%, ${C.gold}25 100%)` }} />
          <div>
            <p className="text-[8.5px] font-black uppercase mb-2.5"
               style={{ color: C.goldDim, letterSpacing: '0.32em' }}>Our Promise</p>
            <p className="text-[13px] leading-[1.88]" style={{ color: 'rgba(255,255,255,0.58)' }}>
              We don't believe in one-size-fits-all tutoring. Every recommendation is tailored
              to the student's goals, confidence and learning needs — and we won't enrol your
              child unless we're confident we're the right fit.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Step 3 — Confirmation ────────────────────────────────────────────────────

function Step3({ parentName }: { parentName: string }) {
  return (
    <div className="py-4">
      {/* Icon */}
      <div className="flex justify-center mb-10">
        <div className="relative inline-flex items-center justify-center">
          <motion.div className="absolute rounded-full border"
            style={{ width: 120, height: 120, borderColor: `${C.gold}25` }}
            animate={{ scale: [1, 1.1, 1], opacity: [0.7, 0.2, 0.7] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }} />
          <div className="w-24 h-24 rounded-full flex items-center justify-center"
               style={{ border: `1px solid ${C.gold}30` }}>
            <motion.div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: C.gold }}
              initial={{ scale: 0.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.45, ease: 'backOut', delay: 0.1 }}>
              <motion.div
                initial={{ scale: 0, rotate: -25 }} animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.38, ease: 'backOut', delay: 0.3 }}>
                <CheckCircle className="w-8 h-8" strokeWidth={2.2} style={{ color: C.navy }} />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Heading */}
      <div className="text-center mb-10">
        <motion.p className="text-[8.5px] font-black uppercase tracking-[0.38em] mb-4"
          style={{ color: C.goldDim }}
          initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38, duration: 0.35 }}>
          Interview Request Submitted
        </motion.p>
        <motion.h2 className="font-serif leading-[1.1] tracking-[-0.03em] mb-5"
          style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', color: C.white } as React.CSSProperties}
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.44, duration: 0.4 }}>
          Thank You{parentName ? `, ${parentName}` : ''}&thinsp;—<br />
          We've Received Your Request
        </motion.h2>
        <motion.p className="text-[14px] leading-[1.9] max-w-sm mx-auto"
          style={{ color: 'rgba(255,255,255,0.52)' }}
          initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.52, duration: 0.38 }}>
          We'll help find the right subject, level and starting point for your child.
        </motion.p>
        {/* Response time */}
        <motion.div className="inline-flex items-center gap-2 mt-5 px-4 py-2 rounded-full"
          style={{ background: `${C.gold}14`, border: `1px solid ${C.gold}25` }}
          initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.62, duration: 0.32 }}>
          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: C.gold }} />
          <span className="text-[11px] font-semibold" style={{ color: `${C.gold}cc` }}>
            Most enquiries are contacted within 1 business day.
          </span>
        </motion.div>
      </div>

      {/* What happens next */}
      <motion.div className="rounded-2xl overflow-hidden mb-8"
        style={{ border: `1px solid ${C.gold}22` }}
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.68, duration: 0.42 }}>
        <div className="px-6 py-4 flex items-center gap-4"
             style={{ background: `${C.gold}12`, borderBottom: `1px solid ${C.gold}20` }}>
          <span className="text-[9px] font-black uppercase tracking-[0.28em]"
                style={{ color: C.goldDim }}>What Happens Next</span>
          <div className="flex-1 h-px" style={{ background: `${C.gold}25` }} />
        </div>
        <div style={{ background: `${C.navy}ee` }}>
          {NEXT_STEPS.map((s, i) => (
            <motion.div key={s.n}
              className="flex items-start gap-5 px-6 py-5"
              style={{ borderBottom: i < NEXT_STEPS.length - 1 ? `1px solid ${C.gold}12` : 'none' }}
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.76 + i * 0.08, duration: 0.32 }}>
              <div className="flex flex-col items-center shrink-0">
                <div className="w-9 h-9 rounded-full flex items-center justify-center"
                     style={{ background: C.gold }}>
                  <span className="font-serif text-[11px] font-medium" style={{ color: C.navy }}>
                    {s.n}
                  </span>
                </div>
                {i < NEXT_STEPS.length - 1 && (
                  <div className="w-px flex-1 min-h-[20px] mt-2"
                       style={{ background: `${C.gold}25` }} />
                )}
              </div>
              <div className="pt-1.5 pb-1">
                <p className="text-[13.5px] font-bold mb-1" style={{ color: C.white }}>
                  {s.title}
                </p>
                <p className="text-[12.5px] leading-[1.75]" style={{ color: 'rgba(255,255,255,0.46)' }}>
                  {s.body}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Buttons */}
      <motion.div className="flex flex-col sm:flex-row gap-3"
        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.08, duration: 0.38 }}>
        <Link to="/"
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl py-4 text-[12px] font-bold uppercase tracking-[0.14em] transition-all duration-200"
          style={{ background: C.gold, color: C.navy, boxShadow: `0 4px 20px ${C.gold}40` }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#c9a82e')}
          onMouseLeave={(e) => (e.currentTarget.style.background = C.gold)}>
          <Home className="w-4 h-4" />Return Home
        </Link>
        <a href="tel:0401940207"
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl py-4 text-[12px] font-bold uppercase tracking-[0.14em] transition-all duration-200"
          style={{ border: `2px solid ${C.gold}55`, color: C.gold, background: 'transparent' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = C.goldFaint; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
          <Phone className="w-4 h-4" />Call 0401 940 207
        </a>
      </motion.div>
    </div>
  );
}

// ─── Validation ───────────────────────────────────────────────────────────────

function validateStep1(f: ParentForm): FormErrors {
  const e: FormErrors = {};
  if (!f.firstName.trim())  e.firstName  = 'First name is required';
  if (!f.lastName.trim())   e.lastName   = 'Last name is required';
  if (!f.email.trim())      e.email      = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'Please enter a valid email';
  if (!f.mobile.trim())     e.mobile     = 'Mobile number is required';
  else if (!/^[\d\s+\-()]{8,}$/.test(f.mobile)) e.mobile = 'Please enter a valid mobile number';
  if (!f.preferredContact)  e.preferredContact = 'Please select a contact method';
  if (!f.relationship)      e.relationship     = 'Please select your relationship';
  if (!f.suburb.trim())     e.suburb     = 'Suburb is required';
  return e;
}

function validateStep2(students: Student[]): FormErrors {
  const e: FormErrors = {};
  students.forEach((s, i) => {
    const p = `s${i}`;
    if (!s.firstName.trim()) e[`${p}_firstName`] = 'Required';
    if (!s.lastName.trim())  e[`${p}_lastName`]  = 'Required';
    if (!s.yearLevel)        e[`${p}_yearLevel`] = 'Required';
    if (!s.subject)          e[`${p}_subject`]   = 'Required';
  });
  return e;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const BookInterview = () => {
  const [step, setStep]     = useState<1 | 2 | 3>(1);
  const [errors, setErrors] = useState<FormErrors>({});
  const [parentForm, setParentForm] = useState<ParentForm>({
    title: '', firstName: '', lastName: '', email: '',
    mobile: '', preferredContact: '', relationship: '', suburb: '',
  });
  const [students, setStudents] = useState<Student[]>([emptyStudent()]);

  const handleNext = () => {
    if (step === 1) {
      const e = validateStep1(parentForm);
      if (Object.keys(e).length) { setErrors(e); return; }
      setErrors({}); setStep(2); window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (step === 2) {
      const e = validateStep2(students);
      if (Object.keys(e).length) { setErrors(e); return; }
      setErrors({}); setStep(3); window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  const handleBack = () => {
    setErrors({});
    if (step === 2) setStep(1);
    if (step === 3) setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isConfirmation = step === 3;

  return (
    <div className="min-h-screen">
      <SEO
        title="Book an Interview | DA Tuition"
        description="Book an interview with DA Tuition — a premium K-12 tutoring service in Canley Heights."
      />
      <NavigationNew />

      {/* ── HERO — compact ── */}
      <div className="relative overflow-hidden" style={{ background: C.navy }}>
        {/* Gold radial glow */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 70% 55% at 28% 55%, rgba(212,175,55,0.09) 0%, transparent 68%)',
        }} />

        <div className="relative max-w-2xl mx-auto px-4 sm:px-8 pt-[96px] pb-10">

          {/* Back link */}
          <Link to="/"
            className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] mb-8 transition-colors duration-200"
            style={{ color: 'rgba(255,255,255,0.28)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.28)')}>
            <ArrowLeft className="w-3.5 h-3.5" />Back to Home
          </Link>

          {/* Heading block */}
          <div className="mb-8">
            <p className="text-[7.5px] font-black uppercase tracking-[0.42em] mb-3.5"
               style={{ color: C.goldDim }}>
              DA Tuition · Canley Heights NSW
            </p>
            <h1 className="font-serif font-medium tracking-[-0.03em] text-white"
                style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', lineHeight: 1.08 }}>
              Book an Interview
            </h1>
            {/* Decorative gold rule under heading */}
            <div className="mt-3 mb-4 w-14 h-[2px] rounded-full"
                 style={{ background: `linear-gradient(90deg, ${C.gold}, ${C.gold}55)` }} />
            <p className="text-[13px] leading-[1.75] max-w-sm" style={{ color: 'rgba(255,255,255,0.42)' }}>
              Let's find the right starting point. Tell us a little about your child and
              we'll recommend the most suitable subject, level and pathway.
            </p>
          </div>

          {/* Journey indicator */}
          <EnrolmentJourney step={step} />
        </div>

        {/* Gold rule separating hero from body */}
        <div className="h-[3px] w-full"
             style={{ background: `linear-gradient(90deg, ${C.gold} 0%, ${C.gold}55 60%, transparent 100%)` }} />
      </div>

      {/* ── BODY — cream background ── */}
      <div className="pb-24" style={{ background: C.cream }}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6">

          {/* Form card */}
          <div
            className="rounded-3xl overflow-hidden"
            style={{
              background: isConfirmation
                ? C.navy
                : 'linear-gradient(160deg, #FDFAF5 0%, #FFFFFF 55%)',
              border: isConfirmation
                ? `1px solid ${C.gold}22`
                : `1.5px solid rgba(212,175,55,0.18)`,
              boxShadow: isConfirmation
                ? `0 8px 48px rgba(10,27,52,0.22), 0 2px 8px rgba(10,27,52,0.10)`
                : `0 8px 48px rgba(10,27,52,0.08), 0 2px 12px rgba(10,27,52,0.05), 0 0 0 0.5px rgba(212,175,55,0.12)`,
            }}
          >
            {/* Gold top bar — premium document seal */}
            {!isConfirmation && (
              <div className="relative h-[2px] w-full overflow-hidden">
                <div className="absolute inset-0"
                     style={{ background: `linear-gradient(90deg, transparent 0%, ${C.gold}90 20%, ${C.gold} 50%, ${C.gold}90 80%, transparent 100%)` }} />
              </div>
            )}

            <div className="p-8 sm:p-12">
              <AnimatePresence mode="wait">
                {step === 1 && <Step1 key="s1" form={parentForm} setForm={setParentForm} errors={errors} />}
                {step === 2 && <Step2 key="s2" students={students} setStudents={setStudents} errors={errors} />}
                {step === 3 && <Step3 key="s3" parentName={parentForm.firstName} />}
              </AnimatePresence>

              {/* Nav buttons */}
              {step < 3 && (
                <div className={`mt-12 pt-8 flex gap-4 ${step > 1 ? 'justify-between' : 'justify-end'}`}
                     style={{ borderTop: `1px solid rgba(10,27,52,0.07)` }}>
                  {step > 1 && (
                    <motion.button type="button" onClick={handleBack}
                      className="inline-flex items-center gap-2.5 rounded-xl px-7 py-4 text-[11px] font-bold uppercase"
                      style={{
                        border: `1.5px solid rgba(10,27,52,0.11)`,
                        color: `${C.text}45`,
                        background: 'transparent',
                        letterSpacing: '0.14em',
                      }}
                      whileHover={{ y: -1, borderColor: 'rgba(10,27,52,0.22)', color: `${C.text}80` }}
                      whileTap={{ scale: 0.98 }} transition={{ duration: 0.15 }}>
                      <ArrowLeft className="w-3.5 h-3.5" />Back
                    </motion.button>
                  )}
                  <motion.button type="button" onClick={handleNext}
                    className="inline-flex items-center gap-2.5 rounded-xl px-9 py-4 text-[11px] font-bold uppercase"
                    style={{
                      background: C.navy,
                      color: C.white,
                      letterSpacing: '0.14em',
                      boxShadow: `0 4px 24px rgba(10,27,52,0.20)`,
                    }}
                    whileHover={{
                      y: -2,
                      boxShadow: `0 10px 32px rgba(10,27,52,0.26), 0 4px 16px rgba(212,175,55,0.16)`,
                    }}
                    whileTap={{ scale: 0.98, y: 0 }} transition={{ duration: 0.16 }}>
                    {step === 1 ? 'Continue to Student Details' : 'Send My Request'}
                    <ArrowRight className="w-3.5 h-3.5" style={{ color: C.gold }} />
                  </motion.button>
                </div>
              )}
            </div>
          </div>

          {/* Trust strip — understated */}
          {step < 3 && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
              {['20+ years experience', '650+ students helped', 'Small groups of 3–5'].map((t, i, arr) => (
                <div key={t} className="flex items-center gap-6">
                  <span className="text-[11px]" style={{ color: `${C.text}42`, letterSpacing: '0.04em' }}>
                    {t}
                  </span>
                  {i < arr.length - 1 && (
                    <div className="w-[3px] h-[3px] rounded-full" style={{ background: `${C.gold}40` }} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <FooterNew />
    </div>
  );
};

export default BookInterview;
