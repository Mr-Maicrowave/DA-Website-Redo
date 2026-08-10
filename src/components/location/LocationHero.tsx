import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MapPin, Clock, Phone, ArrowRight, Navigation } from 'lucide-react';

interface LocationHeroProps {
  /** Small uppercase eyebrow above the headline, e.g. "Serving Cabramatta Families Since 2005" */
  eyebrow: string;
  /** Large serif headline — the suburb name or "Tutoring for X Families" */
  headline: string;
  /** Smaller italic gold line under the headline, e.g. "A Short Drive From Cabramatta Station" */
  headlineAccent?: string;
  /** Supporting paragraph under the headline */
  subtext: string;
  /** Address lines shown in the floating NAP card, e.g. ['Level 1/229 Canley Vale Rd', 'Canley Heights NSW 2166'] */
  addressLines: string[];
  /** Opening-hours lines shown in the floating NAP card */
  hoursLines: string[];
  /** Phone number shown in the floating NAP card */
  phone: string;
  /** Google Maps embed src pointing at the centre */
  mapEmbedSrc: string;
  /** Accessible title for the map iframe */
  mapTitle: string;
  /** "Get Directions" link target */
  directionsUrl: string;
  /** Book Interview handler — defaults to jumping to the homepage contact section */
  onBookInterview?: () => void;
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

/**
 * Shared hero for every location / service-area page (Canley Heights, the
 * actual centre, plus the surrounding suburb pages). Deliberately NOT a
 * reskin of SubjectHero: a subject page sells an abstract topic, so its
 * hero is a full-bleed, icon-watermarked dark panel built for scrolling
 * into. A location page sells a real, findable place, so this hero is
 * built around an actual embedded map with the centre's address/hours/
 * phone anchored on top of it — the map does the job the giant watermark
 * icon does on subject pages, but literally rather than decoratively, and
 * the whole thing is shorter than a full viewport because "come visit us"
 * is a faster, more practical pitch than "explore this subject."
 *
 * Palette (brand-navy/brand-gold) and type (Cormorant Garamond) intentionally
 * match the core site (home page, DA Method, Teachers) rather than the
 * subject pages' Playfair Display / #071629 sub-brand — so this reads as
 * "home turf," not "another topic page."
 */
const LocationHero = ({
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
}: LocationHeroProps) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const bookInterview = onBookInterview ?? (() => { window.location.href = '/#contact'; });

  return (
    <section className="relative overflow-hidden bg-brand-navy lg:grid lg:grid-cols-2 lg:min-h-[640px]">
      {/* Copy panel */}
      <motion.div
        ref={ref}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
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
            fontFamily: "'Cormorant Garamond', Georgia, serif",
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
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontStyle: 'italic',
              fontWeight: 500,
              fontSize: 'clamp(1.15rem, 2.2vw, 1.65rem)',
            }}
          >
            {headlineAccent}
          </p>
        )}

        <p className="mt-6 max-w-[46ch] text-base leading-[1.75] text-white/75">{subtext}</p>

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

      {/* Map + floating NAP card */}
      <div className="relative lg:flex lg:flex-col">
        <div className="relative h-72 sm:h-96 lg:absolute lg:inset-0 lg:h-auto">
          <iframe
            title={mapTitle}
            src={mapEmbedSrc}
            className="h-full w-full"
            style={{ border: 0, filter: 'grayscale(0.5) sepia(0.16) saturate(1.4) brightness(0.92)' }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
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
  );
};

export default LocationHero;
