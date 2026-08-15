import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Car, Train, Bus, DoorOpen, ClipboardCheck, Sofa, type LucideIcon } from 'lucide-react';

/**
 * ArrivalLogistics
 * ----------------
 * New section for location pages, meant to sit directly under CampusTourHero
 * (or the existing LocationHero) and before the "Why Choose Us" section in
 * CanleyHeights.tsx. Matches that file's inline-style brand-token approach
 * (C.navy / C.gold / C.cream2) plus the Cormorant Garamond + DM Sans pairing
 * and GoldRule divider already used throughout the page, so it drops in
 * without introducing a new visual language.
 *
 * Two parts:
 *  1. A mode toggle (Driving / Train / Bus) so a parent only sees the
 *     instructions relevant to how they're actually arriving.
 *  2. A numbered arrival timeline (park/arrive -> enter -> sign in -> settle)
 *     connected by a thin gold line, echoing the GoldRule motif.
 */

const C = {
  navy: '#0A1B34',
  gold: '#D4AF37',
  goldL: '#F0C86A',
  cream: '#F7F4EE',
  cream2: '#EDE5D4',
  white: '#FAFAF8',
  muted: 'rgba(10,27,52,0.55)',
};
const serif = "'Cormorant Garamond', Georgia, serif";
const sans = "'DM Sans', 'Inter', sans-serif";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } } };

type Mode = 'driving' | 'train' | 'bus';

const modeCopy: Record<Mode, { Icon: LucideIcon; label: string; lines: string[] }> = {
  driving: {
    Icon: Car,
    label: 'Driving',
    lines: [
      'Free 2-hour street parking is available directly outside on Canley Vale Rd.',
      'A short drop-off zone sits right at the entrance for a quick pickup or drop-off.',
      'Overflow parking is available on the side streets if the front is full.',
    ],
  },
  train: {
    Icon: Train,
    label: 'Train',
    lines: [
      'Take the train to Canley Vale Station, then catch a local bus for a 5-minute trip to the centre.',
      'Local bus services stop near Canley Vale Rd, close to the centre entrance.',
      'Allow a little extra time for the connection, especially after school.',
    ],
  },
  bus: {
    Icon: Bus,
    label: 'Bus',
    lines: [
      'Routes 802, 803 and 804 all stop within a few minutes of the centre.',
      'The nearest stop is directly on Canley Vale Rd, opposite the entrance.',
      'Check current timetables before evening classes, as frequency drops after 7pm.',
    ],
  },
};

const arrivalSteps: { Icon: LucideIcon; title: string; body: string }[] = [
  { Icon: Car, title: 'Arrive', body: 'Park on the street or arrive by local bus from Canley Vale Station.' },
  { Icon: DoorOpen, title: 'Enter', body: 'Take the lift to Level 1. The entrance is well signed from the street.' },
  { Icon: ClipboardCheck, title: 'Sign in', body: 'Reception will greet you and confirm which class or interview you\'re here for.' },
  { Icon: Sofa, title: 'Settle in', body: 'A quiet waiting area is available for parents while students head into class.' },
];

const ArrivalLogistics = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [mode, setMode] = useState<Mode>('driving');
  const active = modeCopy[mode];

  return (
    <section style={{ background: C.cream2, padding: '96px 24px', fontFamily: sans }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={stagger}>
          <motion.div variants={fadeUp} style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontFamily: sans, fontSize: '.67rem', fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: C.gold, marginBottom: 12 }}>
              Getting Here
            </div>
            <div style={{ width: 52, height: 1, background: `linear-gradient(90deg,transparent,${C.gold},transparent)`, margin: '0 auto 36px' }} />
            <h2 style={{ fontFamily: serif, fontWeight: 500, fontSize: 'clamp(2rem,3.5vw,3rem)', color: C.navy, letterSpacing: '-.02em', lineHeight: 1.1 }}>
              However you're arriving, it's an easy trip
            </h2>
          </motion.div>

          {/* Mode toggle */}
          <motion.div variants={fadeUp} style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
            {(Object.keys(modeCopy) as Mode[]).map((key) => {
              const { Icon, label } = modeCopy[key];
              const isActive = mode === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setMode(key)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    fontFamily: sans,
                    fontSize: '.78rem',
                    fontWeight: 700,
                    letterSpacing: '.06em',
                    textTransform: 'uppercase',
                    padding: '10px 20px',
                    borderRadius: 999,
                    border: `1.5px solid ${isActive ? C.gold : 'rgba(10,27,52,0.2)'}`,
                    background: isActive ? C.gold : 'transparent',
                    color: isActive ? C.navy : C.navy,
                    cursor: 'pointer',
                    transition: 'all .2s ease',
                  }}
                >
                  <Icon size={15} />
                  {label}
                </button>
              );
            })}
          </motion.div>

          {/* Active mode detail */}
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            style={{ background: C.white, border: `1px solid rgba(212,175,55,.25)`, borderRadius: 12, padding: '32px 36px', marginBottom: 64 }}
          >
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(212,175,55,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <active.Icon size={18} color={C.gold} />
              </div>
              <span style={{ fontFamily: serif, fontSize: '1.3rem', fontWeight: 500, color: C.navy }}>{active.label} to DA Tuition</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {active.lines.map((line, i) => (
                <p key={i} style={{ fontSize: '.92rem', color: C.muted, lineHeight: 1.7, margin: 0 }}>{line}</p>
              ))}
            </div>
          </motion.div>

          {/* Numbered arrival timeline */}
          <motion.div variants={fadeUp} style={{ textAlign: 'center', marginBottom: 40 }}>
            <h3 style={{ fontFamily: serif, fontWeight: 500, fontSize: '1.6rem', color: C.navy }}>Your first visit, step by step</h3>
          </motion.div>

          <div style={{ position: 'relative' }}>
            <div
              style={{
                position: 'absolute',
                top: 20,
                left: 'calc(12.5% )',
                right: 'calc(12.5%)',
                height: 1,
                background: `linear-gradient(90deg,transparent,${C.gold},${C.gold},transparent)`,
                display: 'none',
              }}
              className="hidden sm:block"
            />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 24 }}>
              {arrivalSteps.map(({ Icon, title, body }, i) => (
                <motion.div key={i} variants={fadeUp} style={{ textAlign: 'center', position: 'relative' }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      border: `1.5px solid ${C.gold}`,
                      background: C.white,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    <Icon size={17} color={C.gold} />
                  </div>
                  <div style={{ fontFamily: sans, fontSize: '.65rem', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: C.gold, marginBottom: 6 }}>
                    Step {i + 1}
                  </div>
                  <div style={{ fontFamily: serif, fontSize: '1.15rem', fontWeight: 500, color: C.navy, marginBottom: 8 }}>{title}</div>
                  <p style={{ fontSize: '.85rem', color: C.muted, lineHeight: 1.65, margin: 0 }}>{body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ArrivalLogistics;
