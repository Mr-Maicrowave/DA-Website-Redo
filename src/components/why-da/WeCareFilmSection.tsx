import { ArrowRight } from 'lucide-react';
import { useEffect, useRef, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react';
import { careMoments, finalCarePhoto, type CareMoment, type CarePhoto } from './careMoments';
import './WeCareFilmSection.css';

const photoStyle = (photo: CarePhoto) => ({
  '--care-position-desktop': photo.objectPositionDesktop,
  '--care-position-tablet': photo.objectPositionTablet,
  '--care-position-mobile': photo.objectPositionMobile,
}) as CSSProperties;

function CareImage({ photo, final = false }: { photo: CarePhoto; final?: boolean }) {
  return <div className={`care-photo${final ? ' care-photo--final' : ''}`} style={photoStyle(photo)}>
    {photo.image ? <img src={photo.image} alt={photo.alt} loading="lazy" decoding="async" /> : <span>{final ? 'FINAL PHOTO PENDING' : 'PHOTO PENDING'}</span>}
  </div>;
}

function CareFilmFrame({ moment }: { moment: CareMoment }) {
  return <article className="care-film-frame" data-care-moment={moment.id}>
    <span className="care-film-frame__title">{moment.title}</span>
    <CareImage photo={moment} />
    <p>{moment.quote}</p>
    <small>{moment.number}</small>
  </article>;
}

export default function WeCareFilmSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<Animation | null>(null);
  const rateFrameRef = useRef(0);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const track = trackRef.current;
    if (!track || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const animation = track.animate(
      [{ transform: 'translate3d(0,0,0)' }, { transform: 'translate3d(-50%,0,0)' }],
      { duration: 34000, iterations: Infinity, easing: 'linear' },
    );
    animationRef.current = animation;
    return () => { animation.cancel(); cancelAnimationFrame(rateFrameRef.current); clearTimeout(resumeTimerRef.current); };
  }, []);

  const easeRateTo = (target: number, duration: number) => {
    const animation = animationRef.current;
    if (!animation) return;
    cancelAnimationFrame(rateFrameRef.current);
    const startRate = animation.playbackRate;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      animation.playbackRate = startRate + (target - startRate) * eased;
      if (progress < 1) rateFrameRef.current = requestAnimationFrame(tick);
    };
    rateFrameRef.current = requestAnimationFrame(tick);
  };

  const slowFilm = () => { clearTimeout(resumeTimerRef.current); easeRateTo(.045, 700); };
  const resumeFilm = () => { resumeTimerRef.current = setTimeout(() => easeRateTo(1, 850), 300); };
  const handlePointerDown = (event: ReactPointerEvent) => { if (event.pointerType !== 'mouse') slowFilm(); };

  return <section id="why-da-care" className="why-da-care why-da-care--film" data-testid="why-da-care" aria-labelledby="why-da-care-title">
    <header className="care-editorial-intro" data-motion="care-intro">
      <div className="care-editorial-intro__main">
        <div className="why-da-section-heading"><span>03 /</span><h2 id="why-da-care-title">WE CARE</h2></div>
        <h3><span>Sometimes, they don’t<br />need another explanation.</span><em>They need someone to notice.</em></h3>
      </div>
      <p>We care about the person<br />behind the student.<br /><br />Because that’s where<br />real growth begins.</p>
    </header>

    <div className="care-film-viewport" data-motion="care-film" onPointerDown={handlePointerDown} onPointerUp={resumeFilm} onPointerCancel={resumeFilm} onPointerLeave={resumeFilm}>
      <div className="care-film-track" ref={trackRef}>
        {[0, 1].map((copy) => <div className="care-film-sequence" aria-hidden={copy === 1} key={copy}>
          <div className="care-film-stock" onPointerEnter={slowFilm}>
            <div className="care-film-markings"><span>DA TUITION</span><span>35 MM</span><span>▶</span></div>
            <div className="care-film-frames">{careMoments.map((moment) => <CareFilmFrame moment={moment} key={`${copy}-${moment.id}`} />)}</div>
            <div className="care-film-light" aria-hidden="true" />
          </div>
        </div>)}
      </div>
    </div>

    <footer className="care-editorial-close" data-motion="care-closing">
      <h3>What they learn matters.<strong>How they <em>feel while</em><br /><em>learning</em> matters too.</strong></h3>
      <CareImage photo={finalCarePhoto} final />
      <a href="#why-da-transform"><span><small>NEXT</small><b>04 /</b><strong>WE TRANSFORM</strong></span><i><ArrowRight aria-hidden="true" /></i></a>
    </footer>
  </section>;
}
