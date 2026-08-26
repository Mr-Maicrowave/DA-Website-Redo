import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, BookOpen, ChevronLeft, ChevronRight, GraduationCap, Quote, UsersRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  TUTORS,
  HOME_TUTOR_IDS,
  getPhotoStyle,
  getPhotoUrl,
  type CatalogueTutor,
} from '@/data/teacherCatalogue';

const NAVY = '#0A1F3F';
const GOLD = '#D4AF37';
const CREAM = '#F7F2E9';
const SERIF = "'Cormorant Garamond', Georgia, serif";
const SANS = "'DM Sans', 'Inter', sans-serif";
const CAROUSEL_TUTORS = HOME_TUTOR_IDS
  .map(id => TUTORS.find(teacher => teacher.id === id))
  .filter((teacher): teacher is CatalogueTutor => Boolean(teacher));

const tierLabel = (tier: CatalogueTutor['tier']) =>
  tier === 'senior' ? 'Senior Educator' : tier === 'mid' ? 'Experienced Educator' : 'Educator';

const CSS = `
  .faculty-section{position:relative;isolation:isolate;overflow:hidden;background:${CREAM};padding:clamp(72px,7vw,108px) 0 0;color:${NAVY}}
  .faculty-shell{position:relative;z-index:2;width:min(1500px,calc(100% - clamp(40px,6vw,96px)));margin:0 auto;display:grid;grid-template-columns:minmax(280px,.9fr) minmax(430px,1.25fr) minmax(320px,.9fr);grid-template-areas:'intro portrait profile';gap:clamp(48px,5vw,90px);align-items:center}
  .faculty-intro{grid-area:intro;align-self:center}
  .faculty-kicker{display:flex;align-items:center;gap:10px;margin:0 0 26px;font:600 clamp(.78rem,.9vw,.95rem)/1.4 ${SANS};letter-spacing:.18em;text-transform:uppercase;color:#B77E16}
  .faculty-title{margin:0;font:400 clamp(3.2rem,4.8vw,5.8rem)/.97 ${SERIF};letter-spacing:-.035em;color:${NAVY};text-wrap:balance}
  .faculty-title span{display:block;color:#B77E16}
  .faculty-rule{display:flex;align-items:center;gap:13px;width:174px;margin:26px 0}
  .faculty-rule:before,.faculty-rule:after{content:'';height:1px;flex:1;background:rgba(183,126,22,.58)}
  .faculty-rule span{color:#B77E16;font-size:.64rem}
  .faculty-lede{max-width:340px;margin:0;font:400 clamp(1rem,1.2vw,1.25rem)/1.6 ${SANS};color:rgba(10,31,63,.76);text-wrap:pretty}
  .faculty-portrait-column{grid-area:portrait;min-width:0}
  .faculty-carousel{position:relative;outline:none}
  .faculty-carousel:focus-visible{border-radius:22px;outline:3px solid rgba(183,126,22,.42);outline-offset:8px}
  .faculty-portrait-stage{position:relative;width:min(100%,600px);margin-inline:auto;touch-action:pan-y}
  .faculty-portrait-frame{position:relative;width:min(100%,600px);aspect-ratio:4/5;margin-inline:auto;overflow:hidden;border:1.5px solid rgba(183,126,22,.82);border-radius:50% 50% 14px 14px / 23% 23% 14px 14px;background:${NAVY};box-shadow:0 8px 8px rgba(10,31,63,.14)}
  .faculty-portrait-slide{position:absolute;inset:0}
  .faculty-portrait{width:100%;height:100%;display:block;object-fit:cover;transform-origin:center top;user-select:none;-webkit-user-drag:none}
  .faculty-arrow{position:absolute;z-index:4;top:50%;width:50px;height:50px;display:grid;place-items:center;border:1px solid rgba(183,126,22,.28);border-radius:50%;background:rgba(255,252,246,.94);color:#B77E16;box-shadow:0 8px 24px rgba(10,31,63,.13);cursor:pointer;transform:translateY(-50%);transition:transform .25s ease,background .25s ease,color .25s ease}
  .faculty-arrow--prev{left:-70px}.faculty-arrow--next{right:-70px}
  .faculty-arrow:hover{background:${NAVY};color:${CREAM};transform:translateY(-50%) scale(1.06)}
  .faculty-arrow:focus-visible,.faculty-selector-button:focus-visible,.faculty-dot:focus-visible{outline:3px solid rgba(183,126,22,.48);outline-offset:3px}
  .faculty-selector{display:grid;grid-auto-flow:column;grid-auto-columns:calc((100% - 60px)/6);justify-content:start;gap:12px;width:min(100%,600px);margin:38px auto 0;position:relative;z-index:5;padding:3px;overflow-x:auto;scrollbar-width:none;scroll-snap-type:x mandatory}
  .faculty-selector::-webkit-scrollbar{display:none}
  .faculty-selector-button{display:grid;justify-items:center;gap:7px;min-width:0;padding:0;border:0;background:transparent;color:rgba(10,31,63,.7);font:500 clamp(.84rem,.9vw,.94rem)/1.2 ${SERIF};white-space:nowrap;scroll-snap-align:start;cursor:pointer}
  .faculty-selector-thumb{width:min(100%,64px);aspect-ratio:1;overflow:hidden;border:1px solid rgba(183,126,22,.25);border-radius:50%;background:${CREAM};box-shadow:0 4px 12px rgba(10,31,63,.08);opacity:.84;transition:border-color .25s ease,box-shadow .25s ease,opacity .25s ease,transform .25s ease}
  .faculty-selector-thumb img{width:100%;height:100%;display:block;object-fit:cover}
  .faculty-selector-button:hover .faculty-selector-thumb,.faculty-selector-button[aria-current=true] .faculty-selector-thumb{border:2px solid #C8922B;box-shadow:0 5px 16px rgba(183,126,22,.22);opacity:1;transform:translateY(-2px) scale(1.06)}
  .faculty-selector-button[aria-current=true]{color:${NAVY}}
  .faculty-profile{grid-area:profile;align-self:center;max-width:440px;min-height:390px;display:flex;align-items:center}
  .faculty-profile-content{width:100%}
  .faculty-profile-label{margin:0 0 16px;font:700 clamp(.8rem,.9vw,.95rem)/1.4 ${SANS};letter-spacing:.18em;text-transform:uppercase;color:#B77E16}
  .faculty-profile-rule{display:flex;align-items:center;gap:12px;width:114px;margin-bottom:25px}
  .faculty-profile-rule:before,.faculty-profile-rule:after{content:'';height:1px;flex:1;background:rgba(183,126,22,.58)}
  .faculty-profile-rule span{color:#B77E16;font-size:.58rem}
  .faculty-name{margin:0;font:400 clamp(2.6rem,3.5vw,4.5rem)/1 ${SERIF};letter-spacing:-.035em;color:${NAVY};text-wrap:balance}
  .faculty-role{margin:16px 0 30px;font:700 clamp(.9rem,1vw,1.1rem)/1.4 ${SANS};letter-spacing:.14em;text-transform:uppercase;color:#B77E16}
  .faculty-quote{position:relative;max-width:420px;margin:0 0 38px;padding:18px 28px;font:italic 400 clamp(1.15rem,1.45vw,1.55rem)/1.45 ${SERIF};color:${NAVY};text-wrap:pretty}
  .faculty-quote svg{position:absolute;top:0;left:0;color:#B77E16}
  .faculty-quote:after{content:'”';position:absolute;right:4px;bottom:-4px;color:#B77E16;font:600 2rem/1 ${SERIF}}
  .faculty-cta{display:inline-flex;min-width:min(100%,316px);align-items:center;justify-content:space-between;gap:28px;padding:18px 24px;border:1px solid rgba(183,126,22,.78);border-radius:12px;background:transparent;color:${NAVY};font:600 clamp(.96rem,1vw,1.08rem)/1 ${SERIF};text-decoration:none;transition:background .3s ease,color .3s ease,transform .3s cubic-bezier(.22,1,.36,1)}
  .faculty-cta svg{color:#B77E16;transition:transform .3s cubic-bezier(.22,1,.36,1),color .3s ease}
  .faculty-cta:hover{background:${NAVY};color:${CREAM};transform:translateY(-2px)}
  .faculty-cta:hover svg{color:${CREAM};transform:translateX(5px)}
  .faculty-cta:focus-visible{outline:3px solid rgba(183,126,22,.48);outline-offset:4px}
  .faculty-trust{position:relative;z-index:2;width:min(1500px,calc(100% - clamp(40px,6vw,96px)));margin:clamp(46px,5vw,72px) auto 0;padding:28px 6%;display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid rgba(183,126,22,.27)}
  .faculty-trust-item{display:grid;grid-template-columns:64px minmax(0,1fr);align-items:center;gap:18px;padding:0 clamp(20px,3vw,48px)}
  .faculty-trust-item+.faculty-trust-item{border-left:1px solid rgba(183,126,22,.34)}
  .faculty-trust-icon{width:62px;height:62px;display:grid;place-items:center;border-radius:50%;background:rgba(212,175,55,.07);color:#B77E16}
  .faculty-trust-copy strong{display:block;font:500 clamp(1.4rem,1.7vw,1.85rem)/1.1 ${SERIF};color:${NAVY}}
  .faculty-trust-copy span{display:block;margin-top:6px;font:400 .9rem/1.45 ${SANS};color:rgba(10,31,63,.68)}
  .faculty-watermark{position:absolute;z-index:0;top:5%;right:-2%;width:clamp(220px,25vw,410px);opacity:.035;pointer-events:none;user-select:none}
  .faculty-laurel{position:absolute;z-index:0;left:-25px;bottom:42px;width:clamp(180px,20vw,330px);opacity:.055;pointer-events:none;user-select:none}
  .faculty-spark{position:absolute;z-index:1;width:9px;height:9px;background:#C8922B;transform:rotate(45deg);opacity:.62;pointer-events:none}
  .faculty-spark--one{top:11%;left:7%}.faculty-spark--two{top:14%;right:25%;width:7px;height:7px}.faculty-spark--three{right:6%;bottom:17%;width:8px;height:8px}
  @media(max-width:1180px){
    .faculty-section{padding-top:72px}.faculty-shell{max-width:1080px;grid-template-columns:minmax(300px,.9fr) minmax(390px,1.1fr);grid-template-areas:'intro intro' 'portrait profile';gap:46px 58px}.faculty-intro{text-align:center}.faculty-kicker{justify-content:center;margin-bottom:18px}.faculty-title{font-size:clamp(3.2rem,7vw,5rem);line-height:.96;letter-spacing:-.015em}.faculty-title br{display:none}.faculty-title span{display:inline}.faculty-rule{margin:20px auto}.faculty-lede{max-width:620px;margin-inline:auto}.faculty-portrait-stage,.faculty-portrait-frame{max-width:520px}.faculty-arrow--prev{left:-26px}.faculty-arrow--next{right:-26px}.faculty-profile{max-width:420px}.faculty-trust{padding-inline:0}.faculty-trust-item{padding-inline:24px}.faculty-trust-item{grid-template-columns:54px minmax(0,1fr)}.faculty-trust-icon{width:52px;height:52px}
  }
  @media(max-width:760px){
    .faculty-section{padding:62px 0 0}.faculty-shell{width:min(calc(100% - 32px),620px);display:flex;flex-direction:column;align-items:stretch;gap:34px}.faculty-intro{text-align:left}.faculty-kicker{justify-content:flex-start;margin-bottom:18px}.faculty-title{font-size:clamp(2.9rem,14vw,4.4rem)}.faculty-title br{display:block}.faculty-title span{display:block}.faculty-rule{margin:22px 0}.faculty-lede{margin:0;max-width:35rem}.faculty-portrait-column{order:2}.faculty-portrait-stage,.faculty-portrait-frame{width:min(82vw,380px)}.faculty-arrow{width:44px;height:44px}.faculty-arrow--prev{left:-19px}.faculty-arrow--next{right:-19px}.faculty-selector{grid-auto-columns:calc((100% - 40px)/5);gap:10px;width:min(100%,430px);padding-inline:0}.faculty-profile{order:3;max-width:none;min-height:350px;text-align:center}.faculty-profile-rule{margin-inline:auto}.faculty-quote{margin-inline:auto}.faculty-cta{width:min(100%,360px)}.faculty-trust{width:min(calc(100% - 32px),620px);margin-top:46px;padding:24px 0;grid-template-columns:1fr}.faculty-trust-item{padding:18px 8px;grid-template-columns:52px minmax(0,1fr)}.faculty-trust-item+.faculty-trust-item{border-left:0;border-top:1px solid rgba(183,126,22,.24)}.faculty-watermark{width:230px;right:-80px}.faculty-laurel{display:none}.faculty-spark--two,.faculty-spark--three{display:none}
  }
  @media(prefers-reduced-motion:reduce){.faculty-cta,.faculty-cta svg,.faculty-arrow,.faculty-selector-thumb{transition:none!important}}
`;

const TeachersPreview = () => {
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);
  const [pageVisible, setPageVisible] = useState(() => typeof document === 'undefined' || document.visibilityState === 'visible');
  const dragStartX = useRef<number | null>(null);
  const selectorRef = useRef<HTMLDivElement>(null);
  const featured = CAROUSEL_TUTORS[activeIndex] ?? CAROUSEL_TUTORS[0] ?? TUTORS[0];
  const tutorCount = CAROUSEL_TUTORS.length;
  const ease = [0.22, 1, 0.36, 1] as const;
  const selectTutor = useCallback((nextIndex: number, nextDirection?: number) => {
    if (!tutorCount) return;
    const normalized = (nextIndex + tutorCount) % tutorCount;
    setDirection(nextDirection ?? (normalized >= activeIndex ? 1 : -1));
    setActiveIndex(normalized);
  }, [activeIndex, tutorCount]);
  const showPrevious = useCallback(() => selectTutor(activeIndex - 1, -1), [activeIndex, selectTutor]);
  const showNext = useCallback(() => selectTutor(activeIndex + 1, 1), [activeIndex, selectTutor]);

  useEffect(() => {
    [-1, 0, 1].forEach(offset => {
      const teacher = CAROUSEL_TUTORS[(activeIndex + offset + tutorCount) % tutorCount];
      if (!teacher) return;
      const image = new Image();
      image.src = getPhotoUrl(teacher);
    });
  }, [activeIndex, tutorCount]);

  useEffect(() => {
    const selector = selectorRef.current;
    const selectedTutor = selector?.querySelector<HTMLElement>('[aria-current="true"]');
    if (!selector || !selectedTutor) return;

    const targetLeft = Math.max(0, selectedTutor.offsetLeft - (selector.clientWidth - selectedTutor.offsetWidth) / 2);
    selector.scrollTo({
      left: targetLeft,
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
  }, [activeIndex, reduceMotion]);

  useEffect(() => {
    const handleVisibility = () => setPageVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  useEffect(() => {
    if (reduceMotion || isHovered || isDragging || hasFocus || !pageVisible || tutorCount < 2) return;
    const timer = window.setTimeout(showNext, 6000);
    return () => window.clearTimeout(timer);
  }, [activeIndex, hasFocus, isDragging, isHovered, pageVisible, reduceMotion, showNext, tutorCount]);

  const shortName = (teacher: CatalogueTutor) => {
    const parts = teacher.name.replace(/^(Mr|Mrs|Ms)\s+/, '').split(' ');
    // Skip a bare initial (e.g. "A.") so the label shows the actual name (e.g. "King").
    return /^[A-Z]\.$/.test(parts[0]) ? parts[1] : parts[0];
  };
  const transitionDuration = reduceMotion ? 0 : 0.6;
  const reveal = (delay: number, y = 22) => ({
    initial: reduceMotion ? false : { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.25 },
    transition: { duration: reduceMotion ? 0 : 0.76, delay: reduceMotion ? 0 : delay, ease },
  });

  return (
    <section id="teachers" className="faculty-section" aria-labelledby="faculty-title">
      <style>{CSS}</style>
      <img className="faculty-watermark" src="/images/da-logo.png" alt="" aria-hidden="true" />
      <img className="faculty-laurel" src="/images/awards/gold-laurel-left.png" alt="" aria-hidden="true" />
      <span className="faculty-spark faculty-spark--one" aria-hidden="true" />
      <span className="faculty-spark faculty-spark--two" aria-hidden="true" />
      <span className="faculty-spark faculty-spark--three" aria-hidden="true" />

      <div className="faculty-shell">
        <motion.header className="faculty-intro" {...reveal(0)}>
          <p className="faculty-kicker"><span aria-hidden="true">✦</span>{TUTORS.length} Educators · All Subjects</p>
          <h2 id="faculty-title" className="faculty-title">The People{' '}<br />Behind the{' '}<br /><span>Results</span></h2>
          <div className="faculty-rule" aria-hidden="true"><span>◆</span></div>
          <p className="faculty-lede">Teachers who care as much about who your child is becoming as they do about grades.</p>
        </motion.header>

        <motion.div
          className="faculty-portrait-column"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: reduceMotion ? 0 : 0.82, delay: reduceMotion ? 0 : 0.1, ease }}
        >
          <div
            className="faculty-carousel"
            role="region"
            aria-roledescription="carousel"
            aria-label="Featured educators"
            tabIndex={0}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onFocusCapture={() => setHasFocus(true)}
            onBlurCapture={event => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setHasFocus(false);
            }}
            onKeyDown={event => {
              if (event.key === 'ArrowLeft') { event.preventDefault(); showPrevious(); }
              if (event.key === 'ArrowRight') { event.preventDefault(); showNext(); }
            }}
          >
            <div
              className="faculty-portrait-stage"
              onPointerDown={event => {
                // Let the prev/next buttons handle their own clicks — capturing the
                // pointer here would swallow the tap before it reaches the button
                // (most noticeable on touch devices).
                if ((event.target as HTMLElement).closest('.faculty-arrow')) return;
                dragStartX.current = event.clientX;
                setIsDragging(true);
                event.currentTarget.setPointerCapture(event.pointerId);
              }}
              onPointerUp={event => {
                const distance = dragStartX.current === null ? 0 : event.clientX - dragStartX.current;
                if (Math.abs(distance) >= 45) distance > 0 ? showPrevious() : showNext();
                dragStartX.current = null;
                setIsDragging(false);
              }}
              onPointerCancel={() => { dragStartX.current = null; setIsDragging(false); }}
            >
              <button className="faculty-arrow faculty-arrow--prev" type="button" onClick={showPrevious} aria-label="View previous featured tutor"><ChevronLeft aria-hidden="true" /></button>
              <div className="faculty-portrait-frame" aria-live="polite">
                <AnimatePresence initial={false} custom={direction} mode="popLayout">
                  <motion.div
                    key={featured.id}
                    className="faculty-portrait-slide"
                    custom={direction}
                    initial={reduceMotion ? false : { opacity: 0, x: direction * 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: direction * -30 }}
                    transition={{ duration: transitionDuration, ease }}
                  >
                    <img className="faculty-portrait" src={getPhotoUrl(featured)} alt={`${featured.name}, ${tierLabel(featured.tier)} at DA Tuition`} style={getPhotoStyle(featured)} draggable={false} decoding="async" />
                  </motion.div>
                </AnimatePresence>
              </div>
              <button className="faculty-arrow faculty-arrow--next" type="button" onClick={showNext} aria-label="View next featured tutor"><ChevronRight aria-hidden="true" /></button>
            </div>

            <div ref={selectorRef} className="faculty-selector" aria-label="Choose an educator">
              {CAROUSEL_TUTORS.map((teacher, index) => (
                <button key={teacher.id} className="faculty-selector-button" type="button" aria-label={`Show ${teacher.name}`} aria-current={index === activeIndex} onClick={() => selectTutor(index)}>
                  <span className="faculty-selector-thumb"><img src={getPhotoUrl(teacher)} alt="" style={getPhotoStyle(teacher)} draggable={false} loading="lazy" decoding="async" /></span>
                  <span>{shortName(teacher)}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div className="faculty-profile" {...reveal(0.2)}>
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              key={featured.id}
              className="faculty-profile-content"
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
              transition={{ duration: transitionDuration, ease }}
            >
              <p className="faculty-profile-label">Educator {activeIndex + 1} of {tutorCount}</p>
              <div className="faculty-profile-rule" aria-hidden="true"><span>◆</span></div>
              <h3 className="faculty-name">{featured.name}</h3>
              <p className="faculty-role">{tierLabel(featured.tier)}</p>
              <blockquote className="faculty-quote"><Quote size={20} aria-hidden="true" />{featured.tagline}</blockquote>
              <Link className="faculty-cta" to="/find-teacher">Meet Our Educators <ArrowRight size={20} aria-hidden="true" /></Link>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      <motion.div className="faculty-trust" {...reveal(0.32, 14)} aria-label="Educator overview">
        <div className="faculty-trust-item">
          <span className="faculty-trust-icon" aria-hidden="true"><UsersRound size={27} strokeWidth={1.5} /></span>
          <span className="faculty-trust-copy"><strong>{TUTORS.length}</strong><span>Expert Educators<br />Across all subjects</span></span>
        </div>
        <div className="faculty-trust-item">
          <span className="faculty-trust-icon" aria-hidden="true"><GraduationCap size={28} strokeWidth={1.5} /></span>
          <span className="faculty-trust-copy"><strong>Years 1–12</strong><span>Comprehensive support<br />for every stage</span></span>
        </div>
        <div className="faculty-trust-item">
          <span className="faculty-trust-icon" aria-hidden="true"><BookOpen size={27} strokeWidth={1.5} /></span>
          <span className="faculty-trust-copy"><strong>All Subjects</strong><span>Expert tuition in every<br />subject area</span></span>
        </div>
      </motion.div>
    </section>
  );
};

export default TeachersPreview;
