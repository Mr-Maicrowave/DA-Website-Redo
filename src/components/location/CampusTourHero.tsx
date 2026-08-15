import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, Phone, ArrowRight, Navigation, DoorOpen, Building2 } from 'lucide-react';

/**
 * CampusTourHero
 * ---------------
 * Drop-in replacement / extension for the existing `LocationHero` used on
 * every location page (see src/components/location/LocationHero.tsx).
 * Same brand tokens (brand-navy, brand-gold, brand-lightGold), same
 * Cormorant Garamond headline treatment and pill CTAs, so it reads as the
 * same page family rather than a new sub-brand.
 *
 * Adds two things LocationHero intentionally doesn't do:
 *  1. An Outside / Inside toggle so a first-time parent can see the actual
 *     entrance before they park, without a heavy 360 viewer build.
 *  2. A horizontal "A day at DA" photo strip below the fold-line, using the
 *     same Reveal/fadeUp stagger pattern already used in CanleyHeights.tsx.
 *
 * Usage: swap in for <LocationHero ... /> on a location page and pass the
 * extra `outsidePhoto` / `insidePhoto` / `dayStrip` props alongside the
 * existing LocationHero props.
 */

interface DayStripFrame {
  image: string;
  caption: string;
}

interface CampusTourHeroProps {
  eyebrow: string;
  headline: string;
  headlineAccent?: string;
  subtext: string;
  addressLines: string[];
  hoursLines: string[];
  phone: string;
  mapEmbedSrc: string;
  mapTitle: string;
  directionsUrl: string;
  onBookInterview?: () => void;
  /** Street-facing entrance photo shown in the "Outside" toggle state */
  outsidePhoto: { src: string; alt: string };
  /** Classroom / interior photo shown in the "Inside" toggle state */
  insidePhoto: { src: string; alt: string };
  /** 4-6 frames for the "A day at DA" strip beneath the hero */
  dayStrip: DayStripFrame[];
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const serif = "'Cormorant Garamond', Georgia, serif";

const CampusTourHero = ({
  eyebrow,
  headline,
  headlineAccent,
  subtext,
  addressLines,
  hoursLines,
  phone,
  mapEmbedSrc,
  mapTitle,
  directionsUrl,
  onBookInterview,
  outsidePhoto,
  insidePhoto,
  dayStrip,
}: CampusTourHeroProps) => {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true, margin: '-80px' });
  const stripRef = useRef(null);
  const stripInView = useInView(stripRef, { once: true, margin: '-60px' });

  const [view, setView] = useState<'outside' | 'inside'>('outside');
  const bookInterview = onBookInterview ?? (() => { window.location.href = '/#contact'; });
  const activePhoto = view === 'outside' ? outsidePhoto : insidePhoto;

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-brand-navy pt-14 lg:grid lg:grid-cols-2 lg:min-h-[640px]">
        <motion.div
          ref={heroRef}
          initial="hidden"
          animate={heroInView ? 'visible' : 'hidden'}
          variants={fadeUp}
          className="flex flex-col justify-center px-6 py-20 sm:px-10 lg:px-14 lg:py-16"
        >
          <div className="mb-5 inline-flex items-center gap-2.5 text-xs font-black uppercase tracking-[0.18em] text-brand-lightGold">
            <span className="h-[2px] w-7 bg-brand-gold" />
            {eyebrow}
          </div>

          <h1
            className="text-white"
            style={{
              fontFamily: serif,
              fontWeight: 600,
              fontSize: 'clamp(2.6rem, 5.5vw, 4.6rem)',
              lineHeight: 1.04,
              letterSpacing: '-0.01em',
            }}
          >
            {headline}
          </h1>

          {headlineAccent && (
            <p
              className="mt-2 text-brand-lightGold"
              style={{ fontFamily: serif, fontStyle: 'italic', fontWeight: 500, fontSize: 'clamp(1.15rem, 2.2vw, 1.65rem)' }}
            >
              {headlineAccent}
            </p>
          )}

          <p className="mt-6 max-w-[46ch] text-base leading-[1.75] text-white/75">{subtext}</p>

          {/* Outside / Inside toggle */}
          <div className="mt-8 inline-flex w-fit rounded-full border border-white/15 bg-white/5 p-1">
            <button
              type="button"
              onClick={() => setView('outside')}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.08em] transition ${
                view === 'outside' ? 'bg-brand-gold text-brand-navy' : 'text-white/70 hover:text-white'
              }`}
            >
              <Building2 className="h-3.5 w-3.5" />
              Outside
            </button>
            <button
              type="button"
              onClick={() => setView('inside')}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.08em] transition ${
                view === 'inside' ? 'bg-brand-gold text-brand-navy' : 'text-white/70 hover:text-white'
              }`}
            >
              <DoorOpen className="h-3.5 w-3.5" />
              Inside
            </button>
          </div>

          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-brand-gold px-7 font-black text-brand-navy shadow-xl shadow-brand-gold/20 transition hover:bg-brand-lightGold"
            >
              Get Directions
              <Navigation className="h-4 w-4" />
            </a>
            <button
              type="button"
              onClick={bookInterview}
              className="inline-flex h-12 items-center gap-2 rounded-full border border-white/25 px-7 font-black text-white transition hover:bg-white/10"
            >
              Book Interview
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>

        {/* Photo (toggled) + floating NAP card */}
        <div className="relative lg:flex lg:flex-col">
          <div className="relative h-72 overflow-hidden sm:h-96 lg:absolute lg:inset-0 lg:h-auto">
            <AnimatePresence mode="wait">
              <motion.img
                key={view}
                src={activePhoto.src}
                alt={activePhoto.alt}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="h-full w-full object-cover"
              />
            </AnimatePresence>
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-navy/75 via-brand-navy/5 to-transparent lg:bg-gradient-to-r lg:from-brand-navy/55 lg:via-brand-navy/0 lg:to-transparent"
              style={{ mixBlendMode: 'multiply' }}
            />
          </div>

          <div className="relative z-10 mx-6 -mt-16 mb-8 rounded-2xl border border-brand-gold/25 bg-white/95 p-6 shadow-2xl shadow-black/25 backdrop-blur-md sm:mx-10 lg:mx-10 lg:mb-10 lg:mt-auto">
            <div className="grid gap-5 sm:grid-cols-3">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-gold" />
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.12em] text-brand-gold">Address</p>
                  {addressLines.map((l) => (
                    <p key={l} className="text-sm leading-snug text-brand-navy">{l}</p>
                  ))}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-brand-gold" />
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.12em] text-brand-gold">Hours</p>
                  {hoursLines.map((l) => (
                    <p key={l} className="text-sm leading-snug text-brand-navy">{l}</p>
                  ))}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-brand-gold" />
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.12em] text-brand-gold">Phone</p>
                  <p className="text-sm leading-snug text-brand-navy">{phone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* A DAY AT DA — photo strip */}
      <section className="bg-brand-ivory px-6 py-16 sm:px-10 lg:px-14">
        <motion.div
          ref={stripRef}
          initial="hidden"
          animate={stripInView ? 'visible' : 'hidden'}
          variants={stagger}
          className="mx-auto max-w-6xl"
        >
          <motion.div variants={fadeUp} className="mb-8 text-center">
            <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-brand-gold">A day at DA</p>
            <h2 style={{ fontFamily: serif, fontWeight: 500 }} className="text-3xl text-brand-navy sm:text-4xl">
              What your child's afternoon looks like
            </h2>
          </motion.div>

          <div className="flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 lg:grid-cols-5 sm:overflow-visible">
            {dayStrip.map((frame, i) => (
              <motion.figure
                key={i}
                variants={fadeUp}
                className="w-40 shrink-0 sm:w-auto"
              >
                <div className="overflow-hidden rounded-xl border border-brand-gold/25">
                  <img src={frame.image} alt={frame.caption} className="h-32 w-full object-cover sm:h-36" />
                </div>
                <figcaption className="mt-2 text-xs font-semibold leading-snug text-brand-navy/75">
                  {frame.caption}
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </motion.div>
      </section>
    </>
  );
};

export default CampusTourHero;
