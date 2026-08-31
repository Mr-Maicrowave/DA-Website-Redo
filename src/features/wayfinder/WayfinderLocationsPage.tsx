import { useMemo, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, BusFront, ChevronDown, MapPin, Navigation, TrainFront } from 'lucide-react';
import { PHYSICAL_CENTRES, resolveCentre, shouldShowCentreSwitcher } from '@/data/physical-centres';
import { CommunityMap } from './CommunityMap';
import { getCentreStatus } from './centre-status';
import { WayfinderMap } from './WayfinderMap';
import PageJourney from '@/components/page-journey/PageJourney';
import './wayfinder.css';

const LOCATION_JOURNEY_SECTIONS = [
  { id: 'location-where', label: 'Your Centre', description: 'Find your destination', theme: 'light' as const },
  { id: 'location-when', label: 'Hours', description: 'Plan your visit', theme: 'light' as const },
  { id: 'location-arrive', label: 'Getting Here', description: 'Travel and parking', theme: 'light' as const },
  { id: 'location-community', label: 'Our Reach', description: 'Schools across Sydney', theme: 'light' as const, longScroll: true },
  { id: 'location-ready', label: 'Next Step', description: 'Book an interview', theme: 'dark' as const },
];

export default function WayfinderLocationsPage() {
  const [params, setParams] = useSearchParams();
  const resolved = useMemo(() => resolveCentre(params.get('centre')), [params]);
  const { centre, group, effective } = resolved;
  const reduced = useReducedMotion();
  const status = getCentreStatus(effective.hours!, effective.timezone);
  const today = new Intl.DateTimeFormat('en-AU', {
    timeZone: effective.timezone,
    weekday: 'long',
  }).format(new Date());
  const communityRef = useRef<HTMLElement>(null);
  const { scrollYProgress: communityProgress } = useScroll({
    target: communityRef,
    offset: ['start start', 'end end'],
  });
  const communityMapProgress = useTransform(communityProgress, [0, 0.68], [0, 1], { clamp: true });
  const bookingPath = effective.bookingPath ?? '/book-interview';

  const selectCentre = (id: string) => {
    const next = new URLSearchParams(params);
    next.set('centre', id);
    setParams(next);
  };

  return (
    <>
      <PageJourney pageLabel="Locations" sections={LOCATION_JOURNEY_SECTIONS} />
      <main className="wayfinder" style={{ '--gold': '#d6a921' } as React.CSSProperties}>
      <section id="location-where" className="wayfinder-where wayfinder-hero" aria-labelledby="where-title">
        <WayfinderMap selectedCentre={centre} variant="hero" />
        <div className="wayfinder-where__layout">
          <div className="wayfinder-navline">
            DA <span>WAYFINDER</span><b>01 / WHERE</b>
          </div>
          <div className="wayfinder-where__editorial">
            <p>DA TUITION LOCATIONS</p>
            <h1 id="where-title">Find your way to DA.</h1>
            <div className="wayfinder-route-copy">
              Choose a centre, plan your visit, and find everything you need before you arrive.
            </div>
          </div>
          <aside className="wayfinder-where__rail" aria-label="Selected DA Tuition destination">
            {shouldShowCentreSwitcher(PHYSICAL_CENTRES) && (
              <label className="wayfinder-where__selector">
                <span>CHANGE CENTRE</span>
                <select
                  aria-label="Change centre"
                  value={centre.id}
                  onChange={(event) => selectCentre(event.target.value)}
                >
                  {PHYSICAL_CENTRES.map((item) => (
                    <option key={item.id} value={item.id}>
                      {group.displayName} — {item.buildingLabel}
                    </option>
                  ))}
                </select>
                <ChevronDown size={17} aria-hidden="true" />
              </label>
            )}
            <div className="wayfinder-where__destination" aria-live="polite" aria-atomic="true">
              <motion.div
                key={centre.id}
                initial={reduced ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p>CURRENT DESTINATION</p>
                <div className="wayfinder-where__state">
                  <span>{status.heading}</span>
                  <strong>{status.detail}</strong>
                </div>
                <h2><span>{group.displayName}</span>{centre.buildingLabel}</h2>
                <address>{centre.addressLines[0]}<br />{centre.addressLines[1]}</address>
                <a href={centre.directionsUrl} target="_blank" rel="noreferrer">
                  GET DIRECTIONS <Navigation size={16} aria-hidden="true" />
                </a>
              </motion.div>
            </div>
          </aside>
        </div>
      </section>

      <section id="location-when" className="wayfinder-when" aria-labelledby="when-title">
        <div className="wayfinder-when__inner">
          <div className="wayfinder-when__intro">
            <p>02 / WHEN</p>
            <h2 id="when-title">Practical details,<br /><em>beautifully clear.</em></h2>
          </div>
          <div className="wayfinder-when__live">
            <p>TODAY / {today}</p>
            <strong>{status.heading}</strong>
            <span>{status.detail}</span>
          </div>
          <dl className="wayfinder-when__week">
            {effective.hours?.map((item) => (
              <div key={item.day} className={item.day === today ? 'is-today' : ''}>
                <dt>{item.day}</dt>
                <dd>{item.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section id="location-arrive" className="wayfinder-arrive" aria-labelledby="arrive-title">
        <div className="wayfinder-spine" aria-hidden="true" />
        <div className="wayfinder-arrive-intro">
          <p className="wayfinder-step">03 / ARRIVE</p>
          <h2 id="arrive-title">The route to your<br />next session.</h2>
          <p className="wayfinder-editorial">
            Plan your trip before you leave, with transport and parking information for your selected centre.
          </p>
        </div>
        <ol className="wayfinder-arrive__journey" aria-label="Route to the selected DA Tuition centre">
          <li className="wayfinder-route-node">
            <span className="wayfinder-arrive__waypoint"><TrainFront size={18} aria-hidden="true" /></span>
            <div><small>ARRIVE BY TRAIN</small><b>{effective.arrival?.stationLabel}</b></div>
          </li>
          <li className="wayfinder-route-node">
            <span className="wayfinder-arrive__waypoint"><BusFront size={18} aria-hidden="true" /></span>
            <div><small>CONTINUE BY</small><b>{effective.arrival?.routeLabel}</b></div>
          </li>
          <li className="wayfinder-route-node is-destination">
            <span className="wayfinder-arrive__waypoint"><MapPin size={18} aria-hidden="true" /></span>
            <div>
              <small>DA TUITION</small>
              <b>{centre.buildingLabel}</b>
              <p>{centre.addressLines[0]}<br />{centre.addressLines[1]}</p>
            </div>
          </li>
        </ol>
        <dl className="wayfinder-arrive__details">
          {effective.arrival?.notes?.map((note) => (
            <div key={note.label}>
              <dt>{note.label}</dt>
              <dd>{note.label === 'Parking' ? effective.parking ?? note.detail : note.detail}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section
        id="location-community"
        className="wayfinder-community"
        ref={communityRef}
        aria-labelledby="community-title"
        data-stage="04 / COMMUNITY"
      >
        <div className="wayfinder-community__sticky">
          <CommunityMap progress={communityMapProgress} bookingPath={bookingPath} />
        </div>
      </section>

      <section id="location-ready" className="wayfinder-ready" aria-labelledby="ready-title">
        <WayfinderMap selectedCentre={centre} variant="ready" />
        <div className="wayfinder-ready__content">
          <p className="wayfinder-ready__stage">05 / READY</p>
          <span className="wayfinder-ready__eyebrow">YOU’VE FOUND US</span>
          <h2 id="ready-title">Your next step starts here.</h2>
          <p className="wayfinder-ready__copy">
            Book an interview when you’re ready, or open directions to your selected centre.
          </p>
          <div className="ready-actions">
            <Link to={bookingPath}>BOOK AN INTERVIEW <ArrowRight size={16} aria-hidden="true" /></Link>
            <a href={centre.directionsUrl} target="_blank" rel="noreferrer">GET DIRECTIONS</a>
          </div>
          <address>
            <strong>{group.displayName} — {centre.buildingLabel}</strong>
            {centre.addressLines[0]}<br />{centre.addressLines[1]}
          </address>
        </div>
      </section>
      </main>
    </>
  );
}
