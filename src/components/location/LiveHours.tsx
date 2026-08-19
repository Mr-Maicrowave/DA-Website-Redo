import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Phone } from 'lucide-react';

type DayName = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

type Hours = {
  day: DayName;
  start?: number;
  end?: number;
  label: string;
};

const WEEKLY_HOURS: readonly Hours[] = [
  { day: 'Monday', label: 'Closed' },
  { day: 'Tuesday', start: 16.5, end: 21.5, label: '4:30 pm – 9:30 pm' },
  { day: 'Wednesday', start: 16.5, end: 21.5, label: '4:30 pm – 9:30 pm' },
  { day: 'Thursday', start: 16.5, end: 21.5, label: '4:30 pm – 9:30 pm' },
  { day: 'Friday', start: 16.5, end: 21.5, label: '4:30 pm – 9:30 pm' },
  { day: 'Saturday', start: 9, end: 18, label: '9:00 am – 6:00 pm' },
  { day: 'Sunday', start: 10, end: 19, label: '10:00 am – 7:00 pm' },
];

const DAY_BY_INDEX: readonly DayName[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const CHART_START = 9;
const CHART_END = 21.5;

const formatTime = (date: Date) => date.toLocaleTimeString('en-AU', { hour: 'numeric', minute: '2-digit' }).toLowerCase();

const nextOpening = (now: Date) => {
  for (let offset = 0; offset < 8; offset += 1) {
    const candidate = new Date(now);
    candidate.setDate(now.getDate() + offset);
    const hours = WEEKLY_HOURS.find((entry) => entry.day === DAY_BY_INDEX[candidate.getDay()]);
    if (!hours?.start) continue;
    candidate.setHours(Math.floor(hours.start), (hours.start % 1) * 60, 0, 0);
    if (candidate > now) return { date: candidate, hours, offset };
  }
  return null;
};

const LiveHours = () => {
  const [now, setNow] = useState(() => new Date());
  const [reduceMotion, setReduceMotion] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInView = useInView(chartRef, { once: true, margin: '-60px' });

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 60_000);
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPreference = () => setReduceMotion(media.matches);
    updateMotionPreference();
    media.addEventListener('change', updateMotionPreference);
    return () => {
      window.clearInterval(interval);
      media.removeEventListener('change', updateMotionPreference);
    };
  }, []);

  const currentDay = DAY_BY_INDEX[now.getDay()];
  const currentHour = now.getHours() + now.getMinutes() / 60;
  const today = WEEKLY_HOURS.find((entry) => entry.day === currentDay);
  const isOpen = Boolean(today?.start && today.end && currentHour >= today.start && currentHour < today.end);
  const status = useMemo(() => {
    if (isOpen && today?.end) {
      const closes = new Date(now);
      closes.setHours(Math.floor(today.end), (today.end % 1) * 60, 0, 0);
      return { heading: 'Open now', detail: `Closes at ${formatTime(closes)}`, caption: 'Come and talk to us today', progress: ((currentHour - (today.start ?? 0)) / (today.end - (today.start ?? 0))) * 100, openingSoon: false };
    }
    const next = nextOpening(now);
    if (!next) return { heading: 'Closed right now', detail: 'Please contact us for current hours', caption: 'Send an enquiry anytime', progress: 0, openingSoon: false };
    const dayLabel = next.offset === 0 ? 'today' : next.offset === 1 ? 'tomorrow' : next.hours.day;
    const openingSoon = next.offset === 0 && next.date.getTime() - now.getTime() <= 2 * 60 * 60 * 1000;
    return { heading: openingSoon ? 'Opening soon' : 'Closed right now', detail: `Opens ${dayLabel} at ${formatTime(next.date)}`, caption: openingSoon ? 'We will be ready to welcome you shortly' : 'Send an enquiry anytime', progress: 0, openingSoon };
  }, [currentHour, isOpen, now, today]);

  return (
    <section className="bg-brand-ivory px-4 pb-8 pt-12 sm:px-6 sm:pb-10 sm:pt-16 lg:px-8" aria-labelledby="visit-hours-heading">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-gold">Plan your visit</p>
          <h2 id="visit-hours-heading" className="mt-3 font-serif text-4xl font-medium tracking-[-0.025em] text-brand-navy sm:text-5xl">Centre hours and class times</h2>
        </div>

        <div aria-live="polite" className="relative overflow-hidden rounded-xl bg-brand-navy text-white">
          <div aria-hidden="true" className="absolute -right-20 -top-28 h-80 w-80 rounded-full border border-brand-gold/25" />
          <div aria-hidden="true" className="absolute -right-4 -top-12 h-56 w-56 rounded-full border border-brand-gold/20" />
          <div className="relative grid gap-6 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_15rem] lg:items-center lg:gap-10">
            <div>
              <div className="flex items-center gap-3"><span aria-hidden="true" className={`h-3 w-3 rounded-full ${isOpen || status.openingSoon ? 'bg-emerald-300' : 'bg-brand-gold'}`} /><h3 className="font-serif text-3xl font-medium">{status.heading}</h3></div>
              <p className="mt-2 text-white/75">{status.detail}</p>
              {isOpen && <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full bg-brand-gold" style={{ width: `${Math.max(0, Math.min(status.progress, 100))}%` }} /></div>}
            </div>
            <div className="border-t border-white/15 pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              <p className={`text-sm leading-relaxed ${isOpen ? 'text-emerald-100' : 'text-white/75'}`}>{isOpen ? status.caption : 'Questions before your visit? Our team is happy to help.'}</p>
              <a href="/contact" className="mt-4 inline-flex items-center rounded-full bg-brand-gold px-4 py-2.5 text-xs font-black uppercase tracking-[0.1em] text-brand-navy transition hover:bg-brand-lightGold">Contact us <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" /></a>
            </div>
          </div>
          {!isOpen && <a href="tel:0401940207" className="relative mx-6 mb-6 inline-flex items-center gap-2 text-sm font-bold text-brand-lightGold transition hover:text-white sm:mx-8 sm:mb-8"><Phone className="h-4 w-4" aria-hidden="true" />Need help sooner? Call 0401 940 207</a>}
        </div>

        <div ref={chartRef} className="mt-5 rounded-xl bg-[#F7F4EE] p-5 sm:p-8">
          <h3 className="font-serif text-3xl font-medium text-brand-navy">Weekly centre hours</h3>
          <p className="mt-1 text-sm text-brand-navy/60">Weekday classes run from 5:00 pm to 9:00 pm. Our team is available 30 minutes before and after each session for a welcoming conversation.</p>
          <div className="sr-only">DA Tuition is closed Monday. Tuesday to Friday, 4:30 pm to 9:30 pm. Weekday classes run from 5 pm to 9 pm. Saturday, 9 am to 6 pm. Sunday, 10 am to 7 pm.</div>
          <div className="mt-7 space-y-3" aria-hidden="true">{WEEKLY_HOURS.map((entry) => {
            const todayRow = entry.day === currentDay;
            const left = entry.start ? ((entry.start - CHART_START) / (CHART_END - CHART_START)) * 100 : 0;
            const width = entry.start && entry.end ? ((entry.end - entry.start) / (CHART_END - CHART_START)) * 100 : 0;
            const marker = todayRow && currentHour >= CHART_START && currentHour <= CHART_END ? ((currentHour - CHART_START) / (CHART_END - CHART_START)) * 100 : null;
            const barColour = todayRow ? 'bg-emerald-200' : 'bg-brand-gold/75';
            return <div key={entry.day} className="grid grid-cols-[2.7rem_1fr] items-center gap-2 sm:grid-cols-[3.5rem_1fr] sm:gap-4"><span className={`text-xs uppercase tracking-[0.12em] ${todayRow ? 'font-black text-emerald-800' : 'font-bold text-brand-navy/55'}`}>{entry.day.slice(0, 3)}</span><div className={`relative h-8 overflow-hidden rounded-md ${todayRow ? 'bg-emerald-50' : 'bg-brand-navy/8'}`}>{entry.start && entry.end ? <motion.div initial={reduceMotion ? false : { width: 0 }} animate={{ width: chartInView ? `${width}%` : '0%' }} transition={{ duration: reduceMotion ? 0 : 0.75, ease: [0.22, 1, 0.36, 1] }} className={`absolute inset-y-0 rounded-md ${barColour}`} style={{ left: `${left}%` }}><span className="absolute inset-0 flex min-w-max items-center px-2 text-[10px] font-black text-brand-navy sm:text-xs">{entry.label}</span></motion.div> : <span className="flex h-full items-center px-2 text-xs font-semibold text-brand-navy/45">Closed</span>}{marker !== null && <span className="absolute inset-y-0 z-10 w-px bg-brand-navy" style={{ left: `${marker}%` }} />}</div></div>;
          })}</div>
          <div className="ml-[3.5rem] mt-3 grid grid-cols-5 text-[10px] font-bold text-brand-navy/50 sm:ml-14 sm:text-xs"><span>9am</span><span className="text-center">12pm</span><span className="text-center">3pm</span><span className="text-center">6pm</span><span className="text-right">9:30pm</span></div>
        </div>
      </div>
    </section>
  );
};

export default LiveHours;
