import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MapPin, Clock, Phone, ArrowRight, Navigation } from 'lucide-react';

interface LocationHeroProps {
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
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

const LocationHero = ({ eyebrow, headline, headlineAccent, subtext, addressLines, hoursLines, phone, mapEmbedSrc, mapTitle, directionsUrl, onBookInterview }: LocationHeroProps) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const bookInterview = onBookInterview ?? (() => { window.location.href = '/#contact'; });

  return (
    <section className="relative overflow-hidden bg-brand-navy pt-14 lg:grid lg:min-h-[640px] lg:grid-cols-2">
      <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUp} className="flex flex-col justify-center px-6 py-20 sm:px-10 lg:px-14 lg:py-16">
        <div className="mb-5 inline-flex items-center gap-2.5 text-xs font-black uppercase tracking-[0.18em] text-brand-lightGold"><span className="h-[2px] w-7 bg-brand-gold" />{eyebrow}</div>
        <h1 className="text-white" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: 'clamp(2.6rem, 5.5vw, 4.6rem)', lineHeight: 1.04, letterSpacing: '-0.01em' }}>{headline}</h1>
        {headlineAccent && <p className="mt-2 text-brand-lightGold" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', fontWeight: 500, fontSize: 'clamp(1.15rem, 2.2vw, 1.65rem)' }}>{headlineAccent}</p>}
        <p className="mt-6 max-w-[46ch] text-base leading-[1.75] text-white/75">{subtext}</p>
        <div className="mt-9 flex flex-wrap gap-3">
          <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center gap-2 rounded-full bg-brand-gold px-7 font-black text-brand-navy shadow-xl shadow-brand-gold/20 transition hover:bg-brand-lightGold">Get Directions <Navigation className="h-4 w-4" /></a>
          <button type="button" onClick={bookInterview} className="inline-flex h-12 items-center gap-2 rounded-full border border-white/25 px-7 font-black text-white transition hover:bg-white/10">Book Interview <ArrowRight className="h-4 w-4" /></button>
        </div>
      </motion.div>

      <div className="relative lg:flex lg:flex-col">
        <div className="relative h-72 sm:h-96 lg:absolute lg:inset-0 lg:h-auto">
          <iframe title={mapTitle} src={mapEmbedSrc} className="h-full w-full" style={{ border: 0, filter: 'grayscale(0.5) sepia(0.16) saturate(1.4) brightness(0.92)' }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-navy/75 via-brand-navy/5 to-transparent lg:bg-gradient-to-r lg:from-brand-navy/55 lg:via-brand-navy/0 lg:to-transparent" style={{ mixBlendMode: 'multiply' }} />
        </div>
        <div className="relative z-10 mx-6 -mt-16 mb-8 rounded-2xl border border-brand-gold/25 bg-white/95 p-6 shadow-2xl shadow-black/25 backdrop-blur-md sm:mx-10 lg:mx-10 lg:mb-10 lg:mt-auto">
          <div className="grid gap-5 sm:grid-cols-3">
            <div className="flex items-start gap-3"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-gold" /><div><p className="text-[11px] font-black uppercase tracking-[0.12em] text-brand-gold">Address</p>{addressLines.map((line) => <p key={line} className="text-sm leading-snug text-brand-navy">{line}</p>)}</div></div>
            <div className="flex items-start gap-3"><Clock className="mt-0.5 h-5 w-5 shrink-0 text-brand-gold" /><div><p className="text-[11px] font-black uppercase tracking-[0.12em] text-brand-gold">Hours</p>{hoursLines.map((line) => <p key={line} className="text-sm leading-snug text-brand-navy">{line}</p>)}</div></div>
            <div className="flex items-start gap-3"><Phone className="mt-0.5 h-5 w-5 shrink-0 text-brand-gold" /><div><p className="text-[11px] font-black uppercase tracking-[0.12em] text-brand-gold">Phone</p><p className="text-sm leading-snug text-brand-navy">{phone}</p></div></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationHero;
