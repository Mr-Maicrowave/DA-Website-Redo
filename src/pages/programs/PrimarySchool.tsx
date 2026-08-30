import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { BookOpen, Brain, Calculator, Check, ClipboardCheck, GraduationCap, Heart, Star, Target, Trophy, UserRound, UsersRound } from 'lucide-react';
import NavigationNew from '@/components/NavigationNew';
import PageJourney from '@/components/page-journey/PageJourney';
import StickyBookButton from '@/components/StickyBookButton';
import SEO from '@/components/SEO';
import PrimaryReferenceStory from '@/features/primary-storybook/PrimaryReferenceStory';

const PRIMARY_JOURNEY_SECTIONS = [
  { id: 'primary-introduction', label: 'Introduction', description: 'Primary school learning', theme: 'light' as const },
  { id: 'foundation', label: 'Learning journey', description: 'Years 1 to 6', theme: 'light' as const },
  { id: 'pathway', label: 'How We Teach', description: 'Support that adapts', theme: 'light' as const },
  { id: 'programs', label: 'Programs', description: 'Find the right fit', theme: 'light' as const },
  { id: 'family-reasons', label: 'Why DA', description: 'What families value', theme: 'light' as const },
  { id: 'primary-journey-outro', label: 'Next Step', description: 'Start with a conversation', theme: 'light' as const },
];

const premiumEase = [0.22, 1, 0.36, 1] as const;

const PrimaryHero = () => {
  const reduceMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || reduceMotion) return;

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!finePointer.matches) return;

    let frame = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const render = () => {
      currentX += (targetX - currentX) * 0.065;
      currentY += (targetY - currentY) * 0.065;
      hero.style.setProperty('--hero-pointer-x', currentX.toFixed(3));
      hero.style.setProperty('--hero-pointer-y', currentY.toFixed(3));
      frame = requestAnimationFrame(render);
    };

    const onPointerMove = (event: PointerEvent) => {
      targetX = (event.clientX / window.innerWidth - 0.5) * 2;
      targetY = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    const onPointerLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onPointerLeave);
    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onPointerMove);
      document.documentElement.removeEventListener('mouseleave', onPointerLeave);
    };
  }, [reduceMotion]);

  const entrance = (delay: number, y = 24) => ({
    initial: reduceMotion ? false : { opacity: 0, y },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduceMotion ? 0 : 0.85, delay, ease: premiumEase },
  });

  return (
    <section ref={heroRef} className="ps-hero" aria-labelledby="primary-title">
      <picture className="ps-hero__background">
        <source srcSet="/primary-reference/hero/primary-school-watercolor-viewport.avif" type="image/avif" />
        <source srcSet="/primary-reference/hero/primary-school-watercolor-viewport.webp" type="image/webp" />
        <img src="/primary-reference/hero/primary-school-watercolor-viewport.png" alt="Two primary students looking up a flower-lined staircase toward a sunlit door" fetchPriority="high" />
      </picture>
      <div className="ps-hero__clouds" aria-hidden="true" />
      <div className="ps-hero__midground ps-hero__wind ps-hero__wind--children" aria-hidden="true" />
      <div className="ps-hero__wind ps-hero__wind--foreground" aria-hidden="true" />
      <div className="ps-hero__wind ps-hero__wind--lower-flowers" aria-hidden="true" />
      <div className="ps-hero__wind ps-hero__wind--lower-stairs" aria-hidden="true" />
      <div className="ps-hero__wind ps-hero__wind--middle-stairs" aria-hidden="true" />
      <div className="ps-hero__wind ps-hero__wind--upper-flowers" aria-hidden="true" />
      <div className="ps-hero__wind ps-hero__wind--door" aria-hidden="true" />
      <div className="ps-hero__foreground" aria-hidden="true" />
      <div className="ps-hero__sunlight" aria-hidden="true" />
      <div className="ps-hero__veil" aria-hidden="true" />

      <motion.div className="ps-hero__content">
        <motion.p {...entrance(0.08)} className="ps-kicker">Primary School</motion.p>
        <motion.h1 id="primary-title" {...entrance(0.18, 28)}>Where little steps<br />become big ones.</motion.h1>
        <motion.p {...entrance(0.34)} className="ps-hero__intro">Building confidence, curiosity and strong foundations from Years 1–6.</motion.p>
        <motion.a {...entrance(0.48)} className="ps-hero__journey-link" href="#primary-page-content">Explore their journey <span aria-hidden="true">↓</span></motion.a>
      </motion.div>
    </section>
  );
};

const FoundationIntro = () => {
  const openingRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: openingRef, offset: ['start 85%', 'end 30%'] });
  const muted = 'rgba(6,23,43,0.3)';
  const cream = '#06172b';
  const gold = '#d8aa4e';
  const strongColor = useTransform(scrollYProgress, [0.14, 0.29], [muted, cream]);
  const foundationsColor = useTransform(scrollYProgress, [0.28, 0.44], [muted, gold]);
  const shapeColor = useTransform(scrollYProgress, [0.43, 0.58], [muted, cream]);
  const everythingColor = useTransform(scrollYProgress, [0.56, 0.72], [muted, cream]);
  const thatColor = useTransform(scrollYProgress, [0.7, 0.85], [muted, cream]);
  const followsColor = useTransform(scrollYProgress, [0.83, 0.98], [muted, cream]);
  const foundationsGlow = useTransform(scrollYProgress, [0.28, 0.4, 0.56], [
    '0 0 0 rgba(216,170,78,0)',
    '0 0 5px rgba(216,170,78,.22)',
    '0 0 3px rgba(216,170,78,.12)',
  ]);
  const markerOpacity = useTransform(scrollYProgress, [0.02, 0.2], [0.5, 1]);
  const markerY = useTransform(scrollYProgress, [0.02, 0.2], [12, 0]);
  const supportOpacity = useTransform(scrollYProgress, [0.76, 1], [0.42, 1]);
  const reveal = (delay = 0) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 42, scale: 0.985 },
    whileInView: { opacity: 1, y: 0, scale: 1 },
    viewport: { amount: 0.18 },
    transition: { duration: reduceMotion ? 0 : 0.8, delay, ease: premiumEase },
  });

  const outcomes = [
    { number: '01', icon: BookOpen, title: <>Core reading and<br />number skills</>, body: 'We build strong foundations in reading, decoding and number sense through engaging, hands-on learning.' },
    { number: '02', icon: Trophy, title: <>Confidence<br />through small wins</>, body: 'Every small achievement builds confidence and helps our students believe they can do more.' },
    { number: '03', icon: UserRound, title: <>Individual attention<br />every lesson</>, body: 'Our small class sizes mean every child gets the guidance they need to grow at their own pace.' },
    { number: '04', icon: Heart, title: <>Loved by parents<br />for real results</>, body: 'We partner with parents and celebrate progress together—because consistency drives results.' },
  ];

  const Outcome = ({ item, delay }: { item: typeof outcomes[number]; delay: number }) => {
    const Icon = item.icon;
    return (
      <motion.article className={`ps-foundation-outcome ps-foundation-outcome--${item.number}`} {...reveal(delay)}>
        <div className="ps-foundation-outcome__meta"><span>{item.number}</span><i><Icon /></i></div>
        <h3>{item.title}</h3>
        <p>{item.body}</p>
      </motion.article>
    );
  };

  return (
    <section id="foundation" className="ps-foundation-intro" aria-labelledby="foundation-title">
      <div className="ps-foundation-intro__side-doodles" aria-hidden="true">
        <img
          className="ps-foundation-intro__side-doodle ps-foundation-intro__side-doodle--left"
          src="/images/programs/primary-years-1-2-doodles-left.png"
          alt=""
        />
        <img
          className="ps-foundation-intro__side-doodle ps-foundation-intro__side-doodle--right"
          src="/images/programs/primary-years-1-2-doodles-right.png"
          alt=""
        />
      </div>
      <div ref={openingRef} className="ps-foundation-intro__content">
        <motion.div className="ps-foundation-intro__chapter-mark" style={reduceMotion ? undefined : { opacity: markerOpacity, y: markerY }}>
          <p className="ps-foundation-intro__number">01</p>
          <p className="ps-foundation-intro__years">Years 1–2</p>
          <span className="ps-foundation-intro__divider" aria-hidden="true" />
        </motion.div>
        <h2 id="foundation-title">
          <motion.span style={reduceMotion ? undefined : { color: strongColor }}>Strong</motion.span>{' '}
          <motion.em style={reduceMotion ? undefined : { color: foundationsColor, textShadow: foundationsGlow }}>foundations</motion.em><br />
          <motion.span style={reduceMotion ? undefined : { color: shapeColor }}>shape</motion.span>{' '}
          <motion.span style={reduceMotion ? undefined : { color: everythingColor }}>everything</motion.span><br />
          <motion.span style={reduceMotion ? undefined : { color: thatColor }}>that</motion.span>{' '}
          <motion.span style={reduceMotion ? undefined : { color: followsColor }}>follows.</motion.span>
        </h2>
        <span className="ps-foundation-intro__detail" aria-hidden="true" />
        <motion.p className="ps-foundation-intro__support" style={reduceMotion ? undefined : { opacity: supportOpacity }}>We build core skills, spark curiosity and nurture confidence—creating the strongest start for your child’s future.</motion.p>
      </div>
      <div className="ps-foundation-story">
        <div className="ps-foundation-story__row ps-foundation-story__row--photo-first">
          <motion.figure className="ps-foundation-photo ps-foundation-photo--tutor" {...reveal()}>
            <img src="/images/community/tutor_one_on_one.jpg" alt="A DA Tuition tutor supporting a young primary student with her work" />
          </motion.figure>
          <div className="ps-foundation-outcomes">
            <Outcome item={outcomes[0]} delay={0.08} />
            <Outcome item={outcomes[1]} delay={0.2} />
          </div>
          <div className="ps-foundation-collage">
            <motion.figure className="ps-foundation-collage__photo ps-foundation-collage__photo--circle" {...reveal(0.36)}>
              <img src="/images/community/tutor_young_girls.jpg" alt="Young DA Tuition students enjoying their lesson" />
            </motion.figure>
          </div>
        </div>
        <div className="ps-foundation-story__row ps-foundation-story__row--photo-last">
          <img className="ps-foundation-story__flower-doodle" src="/images/programs/primary-years-1-2-doodles-flower.png" alt="" aria-hidden="true" />
          <div className="ps-foundation-outcomes">
            <Outcome item={outcomes[2]} delay={0.08} />
            <Outcome item={outcomes[3]} delay={0.2} />
          </div>
          <motion.figure className="ps-foundation-photo ps-foundation-photo--class" {...reveal(0.1)}>
            <img src="/images/community/primary_colorful_class.jpg" alt="Primary students actively learning together in a DA Tuition classroom" />
          </motion.figure>
        </div>
        <div className="ps-foundation-curriculum">
          <motion.div className="ps-foundation-curriculum__intro" {...reveal()}>
            <h3>Explore what<br /><em>they’ll learn.</em></h3>
            <img className="ps-foundation-curriculum__intro-doodles" src="/images/programs/primary-years-1-2-doodles-house.png" alt="" aria-hidden="true" />
          </motion.div>
          <div className="ps-foundation-curriculum__journey">
            <motion.header className="ps-foundation-curriculum__header" {...reveal(0.08)}>
              <h3 aria-label="Years 1–2 Curriculum"><span>Years 1–2</span><b>Curriculum</b></h3>
              <i className="ps-foundation-curriculum__header-line" aria-hidden="true" />
            </motion.header>
            <div className="ps-foundation-curriculum__items">
              <img className="ps-curriculum-continuous-doodle" src="/images/programs/primary-years-1-2-curriculum-rail.png" alt="" aria-hidden="true" />
              <motion.article className="ps-foundation-curriculum__item ps-foundation-curriculum__item--blue" {...reveal(0.18)}>
                <span className="ps-foundation-curriculum__icon" aria-hidden="true" />
                <div><h4><span>Phonics &amp; Reading</span></h4><p>Phonics, decoding and reading fluency</p></div>
              </motion.article>
              <motion.article className="ps-foundation-curriculum__item ps-foundation-curriculum__item--pink" {...reveal(0.55)}>
                <span className="ps-foundation-curriculum__icon" aria-hidden="true" />
                <div><h4><span>Writing &amp; Language</span></h4><p>Sentence construction, handwriting and vocabulary</p></div>
              </motion.article>
              <motion.article className="ps-foundation-curriculum__item ps-foundation-curriculum__item--green" {...reveal(0.92)}>
                <span className="ps-foundation-curriculum__icon" aria-hidden="true" />
                <div><h4><span>Number Sense</span></h4><p>Number sense, place value and mathematical reasoning</p></div>
              </motion.article>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const OpenCurriculum = ({
  years,
  items,
}: {
  years: string;
  items: Array<{ text: string; accent: 'blue' | 'pink' | 'green' }>;
}) => (
  <div className="ps-open-curriculum">
    <header className="ps-open-curriculum__header">
      <h3><span>{years}</span><b>Curriculum</b></h3>
      <i aria-hidden="true" />
    </header>
    <div className="ps-open-curriculum__items">
      <img className="ps-curriculum-continuous-doodle" src="/images/programs/primary-years-1-2-curriculum-rail.png" alt="" aria-hidden="true" />
      {items.map(({ text: itemText, accent }) => (
        <div className={`ps-open-curriculum__item ps-open-curriculum__item--${accent}`} key={itemText}>
          <span className="ps-open-curriculum__icon" aria-hidden="true" />
          <p>{itemText}</p>
        </div>
      ))}
    </div>
  </div>
);

const GrowthSection = () => {
  const reduceMotion = useReducedMotion();
  const reveal = (delay = 0, y = 32) => ({
    initial: reduceMotion ? false : { opacity: 0, y, scale: 0.99 },
    whileInView: { opacity: 1, y: 0, scale: 1 },
    viewport: { amount: 0.18 },
    transition: { duration: reduceMotion ? 0 : 0.78, delay, ease: premiumEase },
  });
  const outcomes = [
    { number: '01', icon: Brain, title: 'Independence and responsibility', body: 'We encourage students to take ownership of their learning and develop strong habits for success.', className: 'ps-growth-outcome--one' },
    { number: '02', icon: Target, title: 'Stronger thinking and problem solving', body: 'We develop logical thinking and apply strategies to solve problems with confidence.', className: 'ps-growth-outcome--two' },
    { number: '03', icon: UsersRound, title: 'Collaborative learning', body: 'We learn together, share ideas and build the communication skills needed for the future.', className: 'ps-growth-outcome--three' },
    { number: '04', icon: Star, title: 'NAPLAN readiness', body: 'We build the skills and stamina needed for NAPLAN and future academic challenges.', className: 'ps-growth-outcome--four' },
  ];

  return (
    <section id="growth" className="ps-growth" aria-labelledby="growth-title">
      <div className="ps-growth__intro-doodles" aria-hidden="true">
        <img className="ps-growth__doodle ps-growth__doodle--bulb" src="/images/programs/primary-years-3-4-doodle-bulb.png" alt="" />
        <img className="ps-growth__doodle ps-growth__doodle--book" src="/images/programs/primary-years-3-4-doodle-book.png" alt="" />
        <img className="ps-growth__doodle ps-growth__doodle--pencil" src="/images/programs/primary-years-3-4-doodle-pencil.png" alt="" />
        <img className="ps-growth__doodle ps-growth__doodle--intro-right" src="/images/programs/primary-years-3-4-doodle-intro-right.png" alt="" />
      </div>
      <div className="ps-growth__inner">
        <header className="ps-growth__intro">
          <motion.p className="ps-growth__number" {...reveal(0, 20)}>02</motion.p>
          <motion.p className="ps-growth__years" {...reveal(0.08, 20)}>Years 3–4</motion.p>
          <motion.span className="ps-growth__rule" aria-hidden="true" {...reveal(0.12, 16)} />
          <motion.h2 id="growth-title" {...reveal(0.16, 28)}>Growing skills.<br /><em>Building independence.</em></motion.h2>
          <motion.p className="ps-growth__lead" {...reveal(0.25, 24)}>We help students think deeper, work independently, and take on new challenges with confidence.</motion.p>
        </header>

        <div className="ps-growth__main">
          <motion.figure className="ps-growth__photo" {...reveal(0.08, 46)}>
            <img src="/images/community/tutor_mentor_girls.jpg" alt="A DA Tuition tutor guiding upper-primary students through their work" />
          </motion.figure>
          {outcomes.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.article key={item.number} className={`ps-growth-outcome ${item.className}`} {...reveal(0.16 + index * 0.09, 28)}>
                <div className="ps-growth-outcome__icon"><Icon /></div>
                <span>{item.number}</span>
                <h3>{item.title}</h3>
                <i aria-hidden="true" />
                <p>{item.body}</p>
              </motion.article>
            );
          })}
        </div>

        <div className="ps-growth-curriculum">
          <motion.div className="ps-growth-curriculum__intro" {...reveal(0, 30)}>
            <h3>Explore what<br /><em>they’ll master next.</em></h3>
            <img className="ps-growth-curriculum__doodle ps-growth-curriculum__doodle--left" src="/images/programs/primary-years-3-4-doodle-curriculum-left.png" alt="" aria-hidden="true" />
          </motion.div>
          <motion.div {...reveal(0.14, 36)}>
            <OpenCurriculum years="Years 3–4" items={[
              { text: 'Reading to learn through comprehension and inference', accent: 'blue' },
              { text: 'Narrative and informative writing with language conventions', accent: 'pink' },
              { text: 'NAPLAN-aligned numeracy, data and multi-step problem solving', accent: 'green' },
            ]} />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const MasterySection = () => {
  const reduceMotion = useReducedMotion();
  const reveal = (delay = 0, y = 32) => ({
    initial: reduceMotion ? false : { opacity: 0, y, scale: 0.99 },
    whileInView: { opacity: 1, y: 0, scale: 1 },
    viewport: { amount: 0.18 },
    transition: { duration: reduceMotion ? 0 : 0.8, delay, ease: premiumEase },
  });
  const outcomes = [
    { number: '01', icon: BookOpen, title: <>Advanced literacy<br />&amp; comprehension</>, body: 'We develop strong analytical reading skills and deeper understanding across a wide range of texts.' },
    { number: '02', icon: Calculator, title: <>Mathematical reasoning<br />&amp; problem solving</>, body: 'We strengthen mathematical thinking and apply strategies to solve complex problems with accuracy and confidence.' },
    { number: '03', icon: ClipboardCheck, title: <>Independent study<br />&amp; organisation</>, body: 'We build effective study habits, time management and the independence needed to thrive in high school and beyond.' },
    { number: '04', icon: GraduationCap, title: <>High school<br />readiness</>, body: 'We prepare students for Year 7 transition, selective schools and future academic challenges.' },
  ];

  return (
    <section id="mastery" className="ps-mastery" aria-labelledby="mastery-title">
      <div className="ps-mastery__hero-doodles" aria-hidden="true">
        <img className="ps-mastery__hero-doodle ps-mastery__hero-doodle--left" src="/images/programs/primary-years-5-6-doodles-hero-left.png" alt="" />
        <img className="ps-mastery__hero-doodle ps-mastery__hero-doodle--right" src="/images/programs/primary-years-5-6-doodles-hero-right.png" alt="" />
      </div>
      <div className="ps-mastery__inner">
        <header className="ps-mastery__intro">
          <motion.p className="ps-mastery__number" {...reveal(0, 20)}>03</motion.p>
          <motion.p className="ps-mastery__years" {...reveal(0.08, 20)}>Years 5–6</motion.p>
          <motion.span className="ps-mastery__rule" aria-hidden="true" {...reveal(0.12, 16)} />
          <motion.h2 id="mastery-title" {...reveal(0.16, 28)}>Ready for what<br /><em>comes next.</em></motion.h2>
          <motion.p className="ps-mastery__lead" {...reveal(0.25, 24)}>We prepare students for selective entry, Year 7 transition, and high school success with academic excellence and resilience.</motion.p>
        </header>

        <motion.figure className="ps-mastery__photo" {...reveal(0.08, 46)}>
          <img src="/images/community/0X1A7290.jpeg" alt="Upper-primary DA Tuition students engaged in classroom learning" />
        </motion.figure>

        <div className="ps-mastery__outcomes">
          {outcomes.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.article key={item.number} className="ps-mastery-outcome" {...reveal(0.12 + index * 0.09, 28)}>
                <span>{item.number}</span>
                <div className="ps-mastery-outcome__icon"><Icon /></div>
                <h3>{item.title}</h3>
                <i aria-hidden="true" />
                <p>{item.body}</p>
              </motion.article>
            );
          })}
        </div>

        <div className="ps-mastery-curriculum">
          <motion.div className="ps-mastery-curriculum__intro" {...reveal(0, 30)}>
            <h3>Preparing them<br /><em>for the next chapter.</em></h3>
            <img className="ps-mastery-curriculum__doodle ps-mastery-curriculum__doodle--left" src="/images/programs/primary-years-5-6-doodles-curriculum-left.png" alt="" aria-hidden="true" />
          </motion.div>
          <motion.div {...reveal(0.14, 36)}>
            <OpenCurriculum years="Years 5–6" items={[
              { text: 'Persuasive and narrative writing at a high level', accent: 'blue' },
              { text: 'Selective-school reasoning, speed and accuracy', accent: 'pink' },
              { text: 'Independent study habits, organisation and Year 7 preparation', accent: 'green' },
            ]} />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const PrimarySchool = () => (
  <div className="primary-story">
    <SEO title="Primary School Tutoring (Years 1–6)" description="One continuous primary learning journey from strong foundations to NAPLAN confidence, selective school preparation and high school readiness." canonicalUrl="/programs/primary-school" />
    <NavigationNew />
    <PageJourney pageLabel="Primary School" sections={PRIMARY_JOURNEY_SECTIONS} />
    <StickyBookButton />
    <div id="primary-introduction" className="ps-opening">
      <div className="ps-opening__hero">
        <PrimaryHero />
      </div>
    </div>
    <PrimaryReferenceStory />
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&display=swap');
      .primary-story{--navy:#06172c;--gold:#c8932f;--gold-light:#e1b453;--cream:#f6efe4;background:var(--cream);color:var(--navy);overflow:clip;font-family:"DM Sans",Arial,sans-serif}.primary-story *{box-sizing:border-box}.primary-story h1{font-family:"Cormorant Garamond",Georgia,serif}.ps-kicker{margin:0;color:var(--gold-light);font-size:.72rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase}.ps-button{display:inline-flex;min-height:3.35rem;align-items:center;justify-content:center;gap:.75rem;padding:0 1.45rem;border-radius:.7rem;font-size:.78rem;font-weight:700;text-decoration:none;transition:transform .3s cubic-bezier(.22,1,.36,1),background .3s ease,box-shadow .3s ease}.ps-button svg{width:1rem;transition:transform .3s ease}.ps-button:hover{transform:translateY(-2px)}.ps-button:hover svg{transform:translateX(4px)}.ps-button:focus-visible,.ps-how-link:focus-visible{outline:2px solid var(--gold-light);outline-offset:4px}.ps-button--gold{background:#d8a642;box-shadow:0 6px 8px rgba(6,23,44,.2);color:var(--navy)}.ps-button--gold:hover{background:#e3b95b}
      .ps-opening{--ps-nav-height:3.625rem;position:relative;width:100vw;max-width:none;margin:0;padding-top:var(--ps-nav-height);background:#edf6f8}.ps-opening__hero{position:relative;width:100%;max-width:none;height:calc(100svh - var(--ps-nav-height));margin:0;overflow:hidden}.ps-opening__hero .ps-hero{width:100%;max-width:none;height:100%;min-height:0;margin:0}.ps-hero{position:relative;z-index:0;display:flex;min-height:max(680px,calc(100svh - 5rem));align-items:center;overflow:hidden;background:#071629;color:#fff}.ps-hero__image-wrap,.ps-hero__veil{position:absolute;inset:-16px 0}.ps-hero__image-wrap{inset:-26px;max-width:none;will-change:transform}.ps-hero__image{position:absolute;inset:0;background:url('/images/programs/primary-hero-tutor-two-students.png') center/cover no-repeat;filter:brightness(.98) contrast(1.03) saturate(1.03);will-change:transform}.ps-hero__veil{background:linear-gradient(90deg,rgba(4,22,40,.88) 0%,rgba(4,22,40,.72) 30%,rgba(4,22,40,.38) 55%,rgba(4,22,40,.1) 78%,rgba(4,22,40,.02) 100%);pointer-events:none}.ps-hero__content{position:relative;z-index:2;width:min(1220px,calc(100% - 64px));margin:0 auto;padding:0;will-change:transform,opacity}.ps-hero .ps-kicker{display:inline-flex;align-items:center;gap:.625rem;margin:0 0 1.25rem;color:#f2df9d;font-size:.75rem;font-weight:800;letter-spacing:.18em}.ps-hero .ps-kicker:before{width:1.75rem;height:2px;background:#c9a227;content:""}.ps-hero h1{max-width:47.5rem;margin:0 0 1.75rem;color:#fff8eb;font-family:"Playfair Display",Georgia,serif;font-size:clamp(3.4rem,7vw,6.6rem);font-weight:600;letter-spacing:-.01em;line-height:.94}.ps-hero h1 span{display:block}.ps-hero h1 span+span{margin-top:0}.ps-hero__gold-line{color:#c9a227;font-style:normal}.ps-hero__intro{max-width:54ch;margin:0 0 1.875rem;color:rgba(255,255,255,.86);font-size:1.125rem;line-height:1.75;text-wrap:pretty}.ps-hero__actions{display:flex;flex-wrap:wrap;align-items:center;gap:.875rem;margin-top:0}.ps-hero .ps-button,.ps-hero .ps-how-link{display:inline-flex;height:3.125rem;min-height:3.125rem;align-items:center;justify-content:center;padding:0 1.5rem;border-radius:999px;font-size:.8rem;font-weight:800;text-decoration:none}.ps-hero .ps-button--gold{background:#c9a227;box-shadow:0 8px 18px rgba(201,162,39,.2);color:#071629}.ps-hero .ps-button--gold:hover{background:#d8b543}.ps-hero .ps-how-link{gap:.55rem;border:1px solid rgba(255,255,255,.3);color:#fff}.ps-hero .ps-how-link span{display:grid;width:1.35rem;height:1.35rem;place-items:center;border:0;color:#f2df9d}.ps-hero .ps-how-link svg{width:.72rem;fill:currentColor}.ps-hero .ps-how-link:hover{border-color:rgba(242,223,157,.72);background:rgba(255,255,255,.06);transform:translateY(-2px)}.ps-hero__handoff{position:absolute;z-index:4;bottom:24px;left:72%;width:7px;height:7px;border-radius:50%;background:#f2c96f;box-shadow:0 0 7px rgba(241,190,77,.9),0 0 16px rgba(241,190,77,.45);pointer-events:none;will-change:transform,opacity}.ps-hero__handoff:after{position:absolute;top:-20px;left:3px;width:1px;height:24px;background:linear-gradient(transparent,rgba(241,190,77,.65));content:""}.ps-mobile-progress{display:none}.ps-opening__hero .ps-hero:after{position:absolute;z-index:1;right:0;bottom:-1px;left:0;height:clamp(10rem,28%,18rem);background:linear-gradient(180deg,rgba(6,23,42,0) 0%,rgba(6,23,42,.035) 18%,rgba(6,23,42,.12) 38%,rgba(6,23,42,.3) 58%,rgba(6,23,42,.62) 79%,#06172a 100%);content:"";pointer-events:none}.ps-landscape-breath{position:relative;display:grid;width:100%;min-height:100vh;height:100svh;place-items:center;overflow:hidden;background:#8bcaf0;isolation:isolate}.ps-landscape-breath__ambient{position:absolute;z-index:0;inset:-4%;background:url('/images/programs/primary-school-staircase-landscape.png') center/cover no-repeat;filter:blur(26px) saturate(.92);opacity:.46;transform:scale(1.05)}.ps-landscape-breath__image{position:absolute;z-index:1;inset:0;display:block;width:100%;height:100%!important;object-fit:contain;object-position:center}.ps-landscape-breath__copy{position:absolute;z-index:3;top:17%;left:clamp(2.5rem,7vw,7rem);width:min(45vw,43rem);color:#0b2743;text-shadow:0 1px 0 rgba(255,255,255,.25)}.ps-landscape-breath__copy>p{margin:0 0 clamp(1rem,2vh,1.35rem);color:#9b6818;font-size:clamp(.68rem,.82vw,.82rem);font-weight:750;letter-spacing:.2em;text-transform:uppercase}.ps-landscape-breath__copy h2{margin:0;font-family:"Cormorant Garamond",Georgia,serif;font-size:clamp(3.4rem,5.2vw,5.3rem);font-weight:500;letter-spacing:-.035em;line-height:.92;text-wrap:balance}.ps-landscape-breath__rule{width:clamp(3.5rem,5vw,5rem);height:1px;margin:clamp(1.35rem,2.7vh,1.8rem) 0;background:rgba(155,104,24,.72)}.ps-landscape-breath__copy>span{display:block;max-width:31rem;color:#24415a;font-size:clamp(.9rem,1.1vw,1.08rem);line-height:1.65;text-wrap:pretty}.ps-landscape-breath__copy>a{display:inline-flex;align-items:center;gap:.65rem;margin-top:clamp(1.35rem,2.7vh,1.8rem);border-bottom:1px solid rgba(11,39,67,.55);padding-bottom:.3rem;color:#0b2743;font-size:.78rem;font-weight:750;text-decoration:none}.ps-landscape-breath__copy>a svg{width:.95rem;transition:transform .3s cubic-bezier(.22,1,.36,1)}.ps-landscape-breath__copy>a:hover svg{transform:translateX(4px)}.ps-landscape-breath__stages{position:absolute;z-index:3;inset:0;pointer-events:none}.ps-landscape-stage{position:absolute;width:clamp(7.5rem,12vw,12rem);translate:-50% -50%;color:#172b40;text-align:center;text-shadow:0 1px 0 rgba(255,255,255,.42)}.ps-landscape-stage small,.ps-landscape-stage strong{display:block;text-transform:uppercase}.ps-landscape-stage small{font-size:clamp(.5rem,.65vw,.68rem);font-weight:750;letter-spacing:.16em}.ps-landscape-stage strong{margin-top:.16rem;font:600 clamp(1.05rem,1.7vw,1.8rem)/.95 "Cormorant Garamond",Georgia,serif;letter-spacing:.01em}.ps-landscape-stage--foundation{top:81.5%;left:61%}.ps-landscape-stage--growth{top:66%;left:70.5%}.ps-landscape-stage--mastery{top:51.5%;left:79.5%}.ps-landscape-breath__year-nav{position:absolute;z-index:4;top:22%;right:clamp(1.25rem,3vw,3.5rem);display:grid;gap:clamp(.7rem,1.5vh,1rem)}.ps-landscape-breath__year-nav a{display:grid;width:clamp(2.5rem,3vw,2.9rem);height:clamp(2.5rem,3vw,2.9rem);place-items:center;border-radius:50%;background:rgba(255,250,239,.92);box-shadow:0 4px 8px rgba(7,31,52,.15);color:#17304a;font-size:.62rem;font-weight:750;text-decoration:none;transition:transform .25s ease,background .25s ease}.ps-landscape-breath__year-nav a:hover{transform:translateY(-2px)}.ps-landscape-breath__year-nav a.is-active{background:#d8aa4e;color:#09213a}
      .ps-landscape-breath{display:block;width:100vw;max-width:none;min-height:0;height:auto;margin:0;padding:0;overflow:visible;isolation:auto;background:none}.ps-landscape-breath__image{position:relative;inset:auto;display:block;width:100%;height:auto!important;max-width:none;object-fit:contain}
      .ps-foundation-intro{position:relative;display:block;width:100%;min-height:100vh;margin:0;padding:calc(clamp(250px,28vw,400px) + clamp(40px,4vw,60px)) 1.5rem clamp(8rem,18vh,13rem);overflow:hidden;background:#f7f0e3;color:#06172b}.ps-foundation-intro__content{position:relative;z-index:6;width:min(100%,46rem);margin:0 auto;text-align:center}.ps-foundation-intro__number,.ps-foundation-intro__years,.ps-foundation-intro__support{margin:0}.ps-foundation-intro__number{color:#d8aa4e;font-family:"Cormorant Garamond",Georgia,serif;font-size:clamp(1.55rem,2.2vw,2rem);line-height:1}.ps-foundation-intro__years{margin-top:.65rem;color:rgba(6,23,43,.82);font-size:.7rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase}.ps-foundation-intro__divider{display:block;width:4.75rem;height:1px;margin:1rem auto 1.75rem;background:rgba(200,147,47,.76)}.ps-foundation-intro h2{margin:0;color:#06172b;font-family:"Cormorant Garamond",Georgia,serif;font-size:clamp(3.25rem,5.4vw,5.75rem);font-weight:500;letter-spacing:-.035em;line-height:.89;text-wrap:balance}.ps-foundation-intro h2 em{color:#d8aa4e;font-weight:500}.ps-foundation-intro__detail{display:block;width:3.25rem;height:1px;margin:2rem auto 1.75rem;background:rgba(200,147,47,.76)}.ps-foundation-intro__support{max-width:31rem;margin:0 auto;color:rgba(6,23,43,.7);font-size:clamp(.88rem,1.1vw,1rem);line-height:1.7;text-wrap:pretty}
      .ps-foundation-intro__side-doodles{position:absolute;z-index:5;top:calc(clamp(250px,28vw,400px) + clamp(3rem,4vw,4rem));right:clamp(1.875rem,2.5vw,3.125rem);left:clamp(1.875rem,2.5vw,3.125rem);aspect-ratio:3/2;pointer-events:none;user-select:none}.ps-foundation-intro__side-doodle{position:absolute;inset:0;display:block;width:100%;height:100%;max-width:none;object-fit:contain;object-position:center top;pointer-events:none;user-select:none}.ps-foundation-intro__side-doodle--left{clip-path:inset(0 50% 0 0);transform:scale(.7);transform-origin:left top}.ps-foundation-intro__side-doodle--right{clip-path:inset(0 0 0 50%);transform:scale(.7);transform-origin:right top}
      .ps-foundation-story{position:relative;z-index:6;width:min(100%,76rem);margin:clamp(5rem,7vw,7.5rem) auto 0}.ps-foundation-story__row{position:relative;display:grid;grid-template-columns:minmax(0,1.08fr) minmax(0,.92fr);align-items:center;gap:clamp(3.5rem,7vw,7.5rem);isolation:isolate}.ps-foundation-story__row:before{position:absolute;z-index:-1;inset:-2.5rem -1.5rem;background:#f7f0e3;content:"";pointer-events:none}.ps-foundation-story__row+.ps-foundation-story__row{margin-top:clamp(8rem,14vw,12rem)}.ps-foundation-story__row--photo-last{grid-template-columns:minmax(0,.92fr) minmax(0,1.08fr)}.ps-foundation-photo{position:relative;min-height:clamp(24rem,39vw,34rem);margin:0;overflow:hidden;background:#eadfca;clip-path:polygon(4% 1%,92% 0,100% 9%,98% 91%,90% 100%,7% 98%,0 90%,1% 8%)}.ps-foundation-photo--class{min-height:clamp(25rem,42vw,36rem);clip-path:polygon(8% 0,96% 3%,100% 12%,98% 94%,89% 100%,3% 96%,0 85%,2% 7%)}.ps-foundation-photo img{display:block;width:100%;height:100%;min-height:inherit;object-fit:cover}.ps-foundation-photo--tutor img{object-position:48% center}.ps-foundation-photo--class img{object-position:56% center}.ps-foundation-outcomes{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0}.ps-foundation-outcome{min-width:0;padding:1.25rem clamp(1rem,2vw,2rem) 1.75rem 0}.ps-foundation-outcome+.ps-foundation-outcome{border-left:1px solid rgba(200,147,47,.24);padding-right:0;padding-left:clamp(1.5rem,2.5vw,2.5rem)}.ps-foundation-outcome__meta{display:flex;align-items:center;justify-content:space-between;gap:1rem;margin-bottom:1.5rem}.ps-foundation-outcome__meta>span{color:#bd8725;font-size:.66rem;font-weight:800;letter-spacing:.16em}.ps-foundation-outcome__meta i{display:grid;width:3.4rem;height:3.4rem;place-items:center;border-radius:50%;background:rgba(216,170,78,.1);color:#bd8725}.ps-foundation-outcome__meta svg{width:1.45rem;height:1.45rem;stroke-width:1.45}.ps-foundation-outcome h3{margin:0;color:#06172b;font-family:"Cormorant Garamond",Georgia,serif;font-size:clamp(1.75rem,2.25vw,2.3rem);font-weight:600;letter-spacing:-.025em;line-height:1.04;text-wrap:balance}.ps-foundation-outcome p{margin:1.15rem 0 0;color:rgba(6,23,43,.68);font-size:clamp(.84rem,1vw,.96rem);line-height:1.72;text-wrap:pretty}.ps-foundation-curriculum{display:grid;grid-template-columns:minmax(15rem,.62fr) minmax(0,1.38fr);align-items:center;gap:clamp(3rem,7vw,7rem);margin-top:clamp(9rem,16vw,14rem)}.ps-foundation-curriculum__intro h3,.ps-foundation-curriculum__panel h3{margin:0;color:#06172b;font-family:"Cormorant Garamond",Georgia,serif}.ps-foundation-curriculum__intro h3{font-size:clamp(2.8rem,4.6vw,4.8rem);font-weight:500;letter-spacing:-.035em;line-height:.92}.ps-foundation-curriculum__intro h3 em{display:inline-block;color:#c8932f;font-weight:500}.ps-foundation-curriculum__intro>span{display:block;margin:1.4rem 0 0 5.5rem;color:#65a6c5;font-family:"Cormorant Garamond",Georgia,serif;font-size:3.25rem;line-height:1;transform:rotate(14deg)}.ps-foundation-curriculum__panel{border:1px solid rgba(200,147,47,.34);border-radius:1rem;padding:clamp(2rem,4vw,3.75rem);background:rgba(255,252,246,.38)}.ps-foundation-curriculum__panel h3{font-size:clamp(2rem,3vw,3rem);font-weight:600;letter-spacing:-.025em}.ps-foundation-curriculum__panel>p{max-width:44rem;margin:.8rem 0 1.65rem;color:rgba(6,23,43,.68);font-size:.94rem;line-height:1.65}.ps-foundation-curriculum__panel ul{display:grid;gap:.95rem;margin:0;border-top:1px solid rgba(200,147,47,.24);padding:1.45rem 0 0;list-style:none}.ps-foundation-curriculum__panel li{display:flex;align-items:flex-start;gap:.85rem;color:rgba(6,23,43,.76);font-size:.9rem;line-height:1.55}.ps-foundation-curriculum__panel li svg{flex:0 0 auto;width:1.05rem;margin-top:.15rem;color:#c8932f;stroke-width:1.8}
      .ps-crayon-artwork{position:absolute;z-index:2;top:calc(clamp(250px,28vw,400px) + 1rem);right:0;bottom:0;left:0;overflow:hidden;pointer-events:none}.ps-crayon-artwork__band{position:absolute;right:0;left:0;height:38%;background-image:url('/images/programs/primary-years-1-2-crayon-doodles.png');background-size:min(100vw,1536px) auto;background-repeat:no-repeat;transform-origin:center;will-change:transform,opacity;-webkit-mask-image:linear-gradient(90deg,#000 0%,#000 18%,transparent 25%,transparent 75%,#000 82%,#000 100%);mask-image:linear-gradient(90deg,#000 0%,#000 18%,transparent 25%,transparent 75%,#000 82%,#000 100%)}.ps-crayon-artwork__band--upper{top:1%;background-position:center top}.ps-crayon-artwork__band--middle{top:32%;background-position:center center}.ps-crayon-artwork__band--lower{top:63%;background-position:center bottom}
      .ps-growth{position:relative;width:100%;margin:0;padding:clamp(7rem,12vw,11rem) 1.5rem clamp(9rem,15vw,14rem);overflow:hidden;background:#f7f0e3;color:#06172b}.ps-growth__inner{position:relative;z-index:3;width:min(100%,82rem);margin:0 auto}.ps-growth__intro{width:min(100%,54rem);margin:0 auto;text-align:center}.ps-growth__number,.ps-growth__years,.ps-growth__lead{margin:0}.ps-growth__number{color:#718b55;font-family:"Cormorant Garamond",Georgia,serif;font-size:clamp(2.3rem,3.5vw,3.5rem);font-weight:600;line-height:1}.ps-growth__years{margin-top:.85rem;color:#718b55;font-size:.78rem;font-weight:800;letter-spacing:.2em;text-transform:uppercase}.ps-growth__rule{display:block;width:5.5rem;height:1px;margin:1.25rem auto 1.9rem;background:rgba(113,139,85,.68)}.ps-growth__intro h2{margin:0;color:#06172b;font-family:"Cormorant Garamond",Georgia,serif;font-size:clamp(3.5rem,6vw,6rem);font-weight:500;letter-spacing:-.038em;line-height:.92;text-wrap:balance}.ps-growth__intro h2 em{color:#718b55;font-weight:500}.ps-growth__lead{max-width:43rem;margin:2.25rem auto 0;color:rgba(6,23,43,.72);font-size:clamp(1rem,1.35vw,1.16rem);line-height:1.75;text-wrap:pretty}.ps-growth__main{display:grid;grid-template-columns:minmax(13rem,.8fr) minmax(22rem,1.45fr) minmax(13rem,.8fr);grid-template-rows:repeat(2,minmax(0,1fr));align-items:center;column-gap:clamp(2rem,4vw,4.5rem);row-gap:clamp(3rem,5vw,5rem);margin-top:clamp(6.5rem,10vw,9rem)}.ps-growth__photo{grid-column:2;grid-row:1/3;align-self:stretch;min-height:clamp(40rem,57vw,52rem);margin:0;overflow:hidden;background:#e6eadf;clip-path:polygon(7% 1%,91% 0,98% 6%,100% 91%,94% 99%,8% 100%,1% 94%,0 8%)}.ps-growth__photo img{display:block;width:100%;height:100%;object-fit:cover;object-position:46% center}.ps-growth-outcome{max-width:18rem;margin:auto;text-align:center}.ps-growth-outcome--one{grid-column:1;grid-row:1}.ps-growth-outcome--two{grid-column:3;grid-row:1}.ps-growth-outcome--three{grid-column:1;grid-row:2}.ps-growth-outcome--four{grid-column:3;grid-row:2}.ps-growth-outcome__icon{display:grid;width:5.25rem;height:5.25rem;margin:0 auto 1rem;place-items:center;border-radius:50%;background:rgba(113,139,85,.1);color:#718b55}.ps-growth-outcome__icon svg{width:2.4rem;height:2.4rem;stroke-width:1.35}.ps-growth-outcome>span{display:block;color:#718b55;font-family:"Cormorant Garamond",Georgia,serif;font-size:1.25rem;font-weight:700}.ps-growth-outcome h3{margin:.55rem 0 0;color:#06172b;font-family:"Cormorant Garamond",Georgia,serif;font-size:clamp(1.55rem,2vw,2rem);font-weight:600;letter-spacing:-.02em;line-height:1.05;text-wrap:balance}.ps-growth-outcome>i{display:block;width:2rem;height:1px;margin:1.25rem auto;background:rgba(113,139,85,.72)}.ps-growth-outcome p{margin:0;color:rgba(6,23,43,.7);font-size:.88rem;line-height:1.68;text-wrap:pretty}.ps-growth__divider{display:flex;align-items:center;gap:2rem;margin:clamp(7rem,11vw,10rem) 0 0;color:#718b55}.ps-growth__divider:before,.ps-growth__divider:after{height:1px;flex:1;background:rgba(113,139,85,.45);content:""}.ps-growth__divider span{display:grid;width:2rem;height:2rem;place-items:center}.ps-growth__divider svg{width:1.5rem;fill:currentColor;stroke-width:1}.ps-growth-curriculum{display:grid;grid-template-columns:minmax(17rem,.68fr) minmax(0,1.32fr);align-items:center;gap:clamp(3.5rem,8vw,8rem);margin-top:clamp(4rem,7vw,6rem)}.ps-growth-curriculum__intro h3,.ps-growth-curriculum__panel h3{margin:0;font-family:"Cormorant Garamond",Georgia,serif}.ps-growth-curriculum__intro h3{color:#06172b;font-size:clamp(3rem,4.8vw,5rem);font-weight:500;letter-spacing:-.038em;line-height:.91}.ps-growth-curriculum__intro h3 em{display:inline-block;color:#718b55;font-weight:500}.ps-growth-curriculum__intro>span{display:block;margin:1.5rem 0 0 6rem;color:#65a6c5;font-family:"Cormorant Garamond",Georgia,serif;font-size:3.4rem;line-height:1;transform:rotate(13deg)}.ps-growth-curriculum__panel{border:1px solid rgba(113,139,85,.38);border-radius:1rem;padding:clamp(2.25rem,4vw,4rem);background:rgba(225,233,216,.18)}.ps-growth-curriculum__panel h3{color:#06172b;font-size:clamp(2.1rem,3vw,3rem);font-weight:600;letter-spacing:-.025em}.ps-growth-curriculum__panel>p{max-width:44rem;margin:.85rem 0 1.75rem;color:rgba(6,23,43,.68);font-size:.94rem;line-height:1.65}.ps-growth-curriculum__panel ul{display:grid;gap:1rem;margin:0;border-top:1px solid rgba(113,139,85,.3);padding:1.55rem 0 0;list-style:none}.ps-growth-curriculum__panel li{display:flex;align-items:flex-start;gap:.9rem;color:rgba(6,23,43,.76);font-size:.9rem;line-height:1.55}.ps-growth-curriculum__panel li svg{flex:0 0 auto;width:1.05rem;margin-top:.15rem;color:#718b55;stroke-width:2}.ps-growth__doodles{position:absolute;z-index:1;inset:2rem 0 auto;height:min(72rem,58%);background:url('/images/programs/primary-years-1-2-crayon-doodles.png') center top/min(100vw,1536px) auto no-repeat;filter:hue-rotate(22deg) saturate(.72);opacity:.24;pointer-events:none;-webkit-mask-image:linear-gradient(90deg,#000 0%,#000 14%,transparent 24%,transparent 76%,#000 86%,#000 100%);mask-image:linear-gradient(90deg,#000 0%,#000 14%,transparent 24%,transparent 76%,#000 86%,#000 100%)}
      .ps-mastery{position:relative;width:100%;margin:0;padding:clamp(7rem,12vw,11rem) 1.5rem clamp(10rem,16vw,15rem);overflow:hidden;background:#f7f0e3;color:#06172b}.ps-mastery__inner{position:relative;z-index:3;width:min(100%,82rem);margin:0 auto}.ps-mastery__intro{width:min(100%,56rem);margin:0 auto;text-align:center}.ps-mastery__number,.ps-mastery__years,.ps-mastery__lead{margin:0}.ps-mastery__number{color:#1f6096;font-family:"Cormorant Garamond",Georgia,serif;font-size:clamp(2.3rem,3.5vw,3.5rem);font-weight:600;line-height:1}.ps-mastery__years{margin-top:.85rem;color:#1f6096;font-size:.78rem;font-weight:800;letter-spacing:.2em;text-transform:uppercase}.ps-mastery__rule{display:block;width:5.5rem;height:1px;margin:1.25rem auto 1.9rem;background:rgba(31,96,150,.62)}.ps-mastery__intro h2{margin:0;color:#06172b;font-family:"Cormorant Garamond",Georgia,serif;font-size:clamp(3.7rem,6.3vw,6rem);font-weight:500;letter-spacing:-.038em;line-height:.91;text-wrap:balance}.ps-mastery__intro h2 em{color:#1f6096;font-weight:500}.ps-mastery__lead{max-width:47rem;margin:2.25rem auto 0;color:rgba(6,23,43,.72);font-size:clamp(1rem,1.35vw,1.16rem);line-height:1.75;text-wrap:pretty}.ps-mastery__photo{width:100%;min-height:clamp(30rem,48vw,43rem);margin:clamp(5.5rem,9vw,8rem) 0 0;overflow:hidden;background:#e3e9ed;clip-path:polygon(4% 3%,12% 0,46% 1%,55% 0,91% 2%,98% 8%,100% 88%,96% 97%,84% 100%,52% 98%,37% 100%,8% 97%,1% 91%,0 13%)}.ps-mastery__photo img{display:block;width:100%;height:100%;min-height:inherit;object-fit:cover;object-position:center 48%}.ps-mastery__outcomes{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));margin-top:clamp(3.5rem,6vw,5.5rem)}.ps-mastery-outcome{position:relative;min-width:0;padding:0 clamp(1.25rem,2.4vw,2.4rem);text-align:center}.ps-mastery-outcome:first-child{padding-left:0}.ps-mastery-outcome:last-child{padding-right:0}.ps-mastery-outcome+.ps-mastery-outcome{border-left:1px solid rgba(31,96,150,.22)}.ps-mastery-outcome>span{display:block;color:#1f6096;font-family:"Cormorant Garamond",Georgia,serif;font-size:1.2rem;font-weight:700}.ps-mastery-outcome__icon{display:grid;width:4.8rem;height:4.8rem;margin:.75rem auto 1.2rem;place-items:center;border-radius:50%;background:rgba(74,139,187,.09);color:#1f6096}.ps-mastery-outcome__icon svg{width:2.25rem;height:2.25rem;stroke-width:1.4}.ps-mastery-outcome h3{margin:0;color:#06172b;font-family:"Cormorant Garamond",Georgia,serif;font-size:clamp(1.5rem,1.9vw,1.95rem);font-weight:600;letter-spacing:-.02em;line-height:1.06;text-wrap:balance}.ps-mastery-outcome>i{display:block;width:2rem;height:1px;margin:1.2rem auto;background:rgba(31,96,150,.55)}.ps-mastery-outcome p{margin:0;color:rgba(6,23,43,.7);font-size:.86rem;line-height:1.68;text-wrap:pretty}.ps-mastery__divider{display:flex;align-items:center;gap:2rem;margin:clamp(6.5rem,10vw,9rem) 0 0;color:#1f6096}.ps-mastery__divider:before,.ps-mastery__divider:after{height:1px;flex:1;background:rgba(31,96,150,.4);content:""}.ps-mastery__divider span{display:grid;width:2rem;height:2rem;place-items:center}.ps-mastery__divider svg{width:1.5rem;fill:currentColor;stroke-width:1}.ps-mastery-curriculum{display:grid;grid-template-columns:minmax(18rem,.7fr) minmax(0,1.3fr);align-items:center;gap:clamp(3.5rem,8vw,8rem);margin-top:clamp(4rem,7vw,6rem)}.ps-mastery-curriculum__intro h3,.ps-mastery-curriculum__panel h3{margin:0;font-family:"Cormorant Garamond",Georgia,serif}.ps-mastery-curriculum__intro h3{color:#06172b;font-size:clamp(3rem,4.8vw,5rem);font-weight:500;letter-spacing:-.038em;line-height:.91}.ps-mastery-curriculum__intro h3 em{display:inline-block;color:#1f6096;font-weight:500}.ps-mastery-curriculum__intro>span{display:block;margin:1.5rem 0 0 6rem;color:#1f6096;font-family:"Cormorant Garamond",Georgia,serif;font-size:3.4rem;line-height:1;transform:rotate(13deg)}.ps-mastery-curriculum__panel{border:1px solid rgba(31,96,150,.38);border-radius:1rem;padding:clamp(2.25rem,4vw,4rem);background:rgba(213,230,242,.18)}.ps-mastery-curriculum__panel h3{color:#06172b;font-size:clamp(2.1rem,3vw,3rem);font-weight:600;letter-spacing:-.025em}.ps-mastery-curriculum__panel>p{max-width:44rem;margin:.85rem 0 1.75rem;color:rgba(6,23,43,.68);font-size:.94rem;line-height:1.65}.ps-mastery-curriculum__panel ul{display:grid;gap:1rem;margin:0;border-top:1px solid rgba(31,96,150,.28);padding:1.55rem 0 0;list-style:none}.ps-mastery-curriculum__panel li{display:flex;align-items:flex-start;gap:.9rem;color:rgba(6,23,43,.76);font-size:.9rem;line-height:1.55}.ps-mastery-curriculum__panel li svg{flex:0 0 auto;width:1.05rem;margin-top:.15rem;color:#1f6096;stroke-width:2}.ps-mastery__doodles{position:absolute;z-index:1;inset:2rem 0 auto;height:min(68rem,52%);background:url('/images/programs/primary-years-1-2-crayon-doodles.png') center 58%/min(100vw,1536px) auto no-repeat;filter:hue-rotate(145deg) saturate(.56) contrast(.9);opacity:.2;pointer-events:none;-webkit-mask-image:linear-gradient(90deg,#000 0%,#000 13%,transparent 23%,transparent 77%,#000 87%,#000 100%);mask-image:linear-gradient(90deg,#000 0%,#000 13%,transparent 23%,transparent 77%,#000 87%,#000 100%)}
      @supports(height:100dvh){.ps-opening__hero{height:calc(100dvh - var(--ps-nav-height))}}
      .ps-growth__intro-doodles{position:absolute;z-index:2;top:clamp(2.5rem,4.5vw,4.75rem);right:clamp(1.5rem,3vw,3.5rem);left:clamp(1.5rem,3vw,3.5rem);height:clamp(28rem,40vw,38rem);pointer-events:none}.ps-growth__doodle{position:absolute;display:block;height:auto;object-fit:contain;opacity:.62;filter:saturate(.78);pointer-events:none;user-select:none}.ps-growth__doodle--bulb{top:0;left:0;width:clamp(11rem,16vw,15rem)}.ps-growth__doodle--book{top:clamp(11rem,16vw,15rem);left:clamp(.25rem,2.5vw,2.5rem);width:clamp(8.5rem,12vw,11.5rem)}.ps-growth__doodle--pencil{top:clamp(19rem,26vw,24rem);left:clamp(3rem,7vw,7rem);width:clamp(7.5rem,10vw,9.5rem)}.ps-growth__doodle--intro-right{top:0;right:0;width:clamp(11rem,16vw,15.5rem)}.ps-growth__intro{position:relative;z-index:3}.ps-growth-curriculum{position:relative;isolation:isolate}.ps-growth-curriculum__intro,.ps-growth-curriculum__panel{position:relative;z-index:2}.ps-growth-curriculum__doodle{position:absolute;z-index:1;display:block;height:auto;object-fit:contain;opacity:.55;filter:saturate(.74);pointer-events:none;user-select:none}.ps-growth-curriculum__doodle--left{bottom:-4rem;left:-2rem;width:clamp(11rem,16vw,15rem)}.ps-growth-curriculum__doodle--right{right:-2rem;bottom:-3.5rem;width:clamp(10rem,14vw,13rem)}
      @media(max-width:1000px){.ps-growth__main{grid-template-columns:minmax(11rem,.78fr) minmax(20rem,1.3fr) minmax(11rem,.78fr);column-gap:1.5rem}.ps-growth__photo{min-height:42rem}.ps-growth-outcome__icon{width:4.5rem;height:4.5rem}.ps-growth-outcome__icon svg{width:2rem;height:2rem}.ps-growth-curriculum{grid-template-columns:minmax(14rem,.55fr) minmax(0,1.45fr);gap:3rem}.ps-growth__doodle--bulb{width:10rem}.ps-growth__doodle--book{width:8rem}.ps-growth__doodle--pencil{width:7rem}.ps-growth__doodle--intro-right{width:10.5rem}.ps-growth-curriculum__doodle--left{left:-1rem;width:10rem}.ps-growth-curriculum__doodle--right{right:-1rem;width:9rem}}
      @media(max-width:1000px){.ps-mastery__outcomes{grid-template-columns:repeat(2,minmax(0,1fr));row-gap:4rem}.ps-mastery-outcome:nth-child(3){border-left:0}.ps-mastery-curriculum{grid-template-columns:minmax(15rem,.58fr) minmax(0,1.42fr);gap:3rem}}
      @media(max-width:900px){.ps-foundation-story__row{gap:2.5rem}.ps-foundation-outcomes{grid-template-columns:1fr}.ps-foundation-outcome{padding:1.25rem 0 1.75rem}.ps-foundation-outcome+.ps-foundation-outcome{border-top:1px solid rgba(200,147,47,.24);border-left:0;padding:1.75rem 0}.ps-foundation-photo{min-height:28rem}.ps-foundation-curriculum{grid-template-columns:minmax(12rem,.5fr) minmax(0,1.5fr);gap:2.5rem}.ps-crayon-artwork__band{height:36%;background-size:clamp(760px,132vw,1100px) auto;-webkit-mask-image:linear-gradient(90deg,#000 0%,#000 14%,transparent 22%,transparent 78%,#000 86%,#000 100%);mask-image:linear-gradient(90deg,#000 0%,#000 14%,transparent 22%,transparent 78%,#000 86%,#000 100%)}.ps-crayon-artwork__band--middle{opacity:.52}.ps-crayon-artwork__band--lower{top:65%}}
      @media(max-width:720px){.ps-foundation-story{margin-top:7rem}.ps-foundation-story__row,.ps-foundation-story__row--photo-last{grid-template-columns:1fr;gap:3.5rem}.ps-foundation-story__row+.ps-foundation-story__row{margin-top:7rem}.ps-foundation-story__row--photo-last .ps-foundation-photo{order:-1}.ps-foundation-photo,.ps-foundation-photo--class{min-height:0;aspect-ratio:4/3}.ps-foundation-outcomes{grid-template-columns:1fr}.ps-foundation-curriculum{grid-template-columns:1fr;gap:3rem;margin-top:8rem}.ps-foundation-curriculum__intro{max-width:25rem}.ps-foundation-curriculum__panel{padding:1.75rem}.ps-foundation-curriculum__intro>span{margin-left:3.5rem}}
      @media(max-width:720px){.ps-growth{padding-right:1.25rem;padding-left:1.25rem}.ps-growth__intro h2{font-size:clamp(3rem,13vw,4.25rem)}.ps-growth__main{display:flex;flex-direction:column;gap:4rem;margin-top:5.5rem}.ps-growth__photo{order:0;width:100%;min-height:0;aspect-ratio:4/5}.ps-growth-outcome{width:min(100%,24rem);max-width:none}.ps-growth-outcome--one{order:1}.ps-growth-outcome--two{order:2}.ps-growth-outcome--three{order:3}.ps-growth-outcome--four{order:4}.ps-growth__divider{margin-top:7rem}.ps-growth-curriculum{grid-template-columns:1fr;gap:3rem;margin-top:4rem}.ps-growth-curriculum__intro{max-width:26rem}.ps-growth-curriculum__intro>span{margin-left:3.5rem}.ps-growth-curriculum__panel{padding:1.75rem}.ps-growth__intro-doodles{top:1.75rem;right:.75rem;left:.75rem;height:18rem}.ps-growth__doodle--bulb{width:6.5rem}.ps-growth__doodle--intro-right{width:7rem}.ps-growth__doodle--book,.ps-growth__doodle--pencil,.ps-growth-curriculum__doodle{display:none}.ps-growth__doodles{opacity:.14;background-size:720px auto;-webkit-mask-image:linear-gradient(90deg,#000 0%,#000 8%,transparent 17%,transparent 83%,#000 92%,#000 100%);mask-image:linear-gradient(90deg,#000 0%,#000 8%,transparent 17%,transparent 83%,#000 92%,#000 100%)}}
      @media(max-width:720px){.ps-mastery{padding-right:1.25rem;padding-left:1.25rem}.ps-mastery__intro h2{font-size:clamp(3rem,13vw,4.35rem)}.ps-mastery__photo{min-height:0;aspect-ratio:4/3;margin-top:5rem}.ps-mastery__outcomes{grid-template-columns:1fr;gap:4rem;margin-top:4rem}.ps-mastery-outcome,.ps-mastery-outcome:first-child,.ps-mastery-outcome:last-child{width:min(100%,25rem);margin:0 auto;border-left:0;padding:0}.ps-mastery-curriculum{grid-template-columns:1fr;gap:3rem;margin-top:4rem}.ps-mastery-curriculum__intro{max-width:27rem}.ps-mastery-curriculum__intro>span{margin-left:3.5rem}.ps-mastery-curriculum__panel{padding:1.75rem}.ps-mastery__doodles{opacity:.11;background-size:720px auto;-webkit-mask-image:linear-gradient(90deg,#000 0%,#000 7%,transparent 16%,transparent 84%,#000 93%,#000 100%);mask-image:linear-gradient(90deg,#000 0%,#000 7%,transparent 16%,transparent 84%,#000 93%,#000 100%)}}
      @media(max-width:820px){.ps-mobile-progress{display:block;width:min(17rem,78vw);margin:.4rem 0 1.25rem;color:#657084;font-size:.64rem;letter-spacing:.1em;text-transform:uppercase}.ps-mobile-progress span{display:flex;gap:.55rem}.ps-mobile-progress span b{color:var(--gold)}.ps-mobile-progress i{display:block;height:1px;margin-top:.5rem;background:rgba(6,23,44,.16)}.ps-mobile-progress i b{display:block;width:100%;height:100%;transform-origin:left;background:var(--gold);transition:transform .5s ease}.ps-opening{--ps-nav-height:3.625rem}.ps-opening__hero .ps-hero__content{width:calc(100% - 40px);margin:0 auto;padding-top:clamp(5.5rem,11svh,7rem);padding-bottom:clamp(2.25rem,5svh,3.5rem)}.ps-hero h1{max-width:38rem;font-size:clamp(3.35rem,10vw,4.8rem)}.ps-hero__intro{max-width:32rem;font-size:1rem}.ps-hero .ps-kicker{margin-bottom:1.15rem}.ps-hero__handoff{left:58%}.ps-hero__veil{background:linear-gradient(90deg,rgba(4,22,40,.92) 0%,rgba(4,22,40,.8) 38%,rgba(4,22,40,.5) 68%,rgba(4,22,40,.22) 100%)}.ps-opening__hero .ps-hero:after{height:clamp(8rem,24%,13rem)}.ps-landscape-breath__copy{top:11%;left:clamp(1.5rem,5vw,2.5rem);width:min(65vw,33rem)}.ps-landscape-breath__copy h2{font-size:clamp(2.8rem,7vw,3.8rem)}.ps-landscape-breath__copy>span{max-width:27rem;font-size:.88rem}.ps-landscape-breath__year-nav{top:16%;right:.8rem}.ps-landscape-stage--foundation{top:70%}.ps-landscape-stage--growth{top:60.5%}.ps-landscape-stage--mastery{top:51%}}
      @media(max-width:540px){.ps-opening__hero .ps-hero__content{width:calc(100% - 32px);padding-top:5.25rem;padding-bottom:2.5rem}.ps-hero h1{font-size:clamp(3rem,15vw,4.15rem);line-height:.94}.ps-hero__intro{max-width:27rem;margin-bottom:1.5rem;font-size:.94rem;line-height:1.65}.ps-hero__actions{align-items:stretch;flex-direction:column;gap:.7rem;width:min(100%,19rem)}.ps-hero .ps-button,.ps-hero .ps-how-link{width:100%;height:3rem;min-height:3rem}.ps-hero .ps-kicker{font-size:.68rem;letter-spacing:.15em}.ps-hero__handoff{left:52%}.ps-opening__hero .ps-hero:after{height:clamp(7rem,22%,10rem)}.ps-landscape-breath__copy{top:4.5%;left:1.1rem;width:calc(100% - 6rem)}.ps-landscape-breath__copy>p{margin-bottom:.7rem;font-size:.58rem;letter-spacing:.16em}.ps-landscape-breath__copy h2{font-size:clamp(2.15rem,9.5vw,2.75rem);line-height:.94}.ps-landscape-breath__rule{margin:.75rem 0}.ps-landscape-breath__copy>span{font-size:.76rem;line-height:1.45}.ps-landscape-breath__copy>a{margin-top:.75rem;font-size:.68rem}.ps-landscape-breath__year-nav{top:5%;right:.55rem;gap:.5rem}.ps-landscape-breath__year-nav a{width:2.2rem;height:2.2rem;font-size:.54rem}.ps-landscape-stage{width:6.5rem}.ps-landscape-stage small{font-size:.46rem}.ps-landscape-stage strong{font-size:1rem}.ps-landscape-stage--foundation{top:60%}.ps-landscape-stage--growth{top:55%}.ps-landscape-stage--mastery{top:50.5%}.ps-foundation-intro{padding:calc(clamp(250px,28vw,400px) + 72px) 1.25rem 7rem}.ps-foundation-intro h2{font-size:clamp(2.85rem,14vw,4rem);line-height:.92}.ps-foundation-intro__support{max-width:22rem;font-size:.85rem}.ps-crayon-artwork__band{height:35%;background-size:700px auto;opacity:.48;-webkit-mask-image:linear-gradient(90deg,#000 0%,#000 9%,transparent 18%,transparent 82%,#000 91%,#000 100%);mask-image:linear-gradient(90deg,#000 0%,#000 9%,transparent 18%,transparent 82%,#000 91%,#000 100%)}.ps-crayon-artwork__band--middle{display:none}.ps-crayon-artwork__band--lower{top:67%}}
      .ps-landscape-stage{translate:none;filter:none;isolation:isolate;pointer-events:auto;color:rgba(91,68,38,.8);mix-blend-mode:multiply;-webkit-font-smoothing:auto;text-shadow:-1px -1px 0 rgba(255,244,207,.32),1px 1px 0 rgba(70,49,24,.56);transition:color .36s cubic-bezier(.22,1,.36,1),text-shadow .36s cubic-bezier(.22,1,.36,1)}.ps-landscape-stage:before{position:absolute;z-index:0;top:50%;left:50%;width:var(--ps-hotspot-width,160%);height:var(--ps-hotspot-height,175%);transform:translate(-50%,-50%);clip-path:polygon(3% 14%,100% 0,96% 86%,0 100%);content:""}.ps-landscape-stage small,.ps-landscape-stage strong{position:relative;z-index:1}.ps-landscape-stage small{font-size:clamp(.4rem,.52vw,.55rem);font-weight:680;letter-spacing:.22em;opacity:.72;text-shadow:-1px -1px 0 rgba(255,244,207,.26),1px 1px 0 rgba(70,49,24,.46);transition:color .36s cubic-bezier(.22,1,.36,1),opacity .36s cubic-bezier(.22,1,.36,1),text-shadow .36s cubic-bezier(.22,1,.36,1)}.ps-landscape-stage strong{margin-top:.2rem;font-size:clamp(.86rem,1.44vw,1.54rem);font-weight:620;letter-spacing:.018em;opacity:.84;transition:color .36s cubic-bezier(.22,1,.36,1),opacity .36s cubic-bezier(.22,1,.36,1),text-shadow .36s cubic-bezier(.22,1,.36,1)}.ps-landscape-stage--foundation{--ps-hotspot-width:185%;--ps-hotspot-height:185%;top:80.2%;left:70.5%;transform:translate(-50%,-50%) perspective(520px) rotateZ(-.9deg) rotateY(-2.6deg) skewX(-1.9deg) scaleY(.86)}.ps-landscape-stage--growth{--ps-hotspot-width:165%;top:74.45%;left:75.3%;transform:translate(-50%,-50%) perspective(560px) rotateZ(-.65deg) rotateY(-1.9deg) skewX(-1.4deg) scale(.96,.88);color:rgba(88,66,38,.78)}.ps-landscape-stage--mastery{--ps-hotspot-width:145%;--ps-hotspot-height:160%;top:68.95%;left:79.2%;transform:translate(-50%,-50%) perspective(600px) rotateZ(-.45deg) rotateY(-1.25deg) skewX(-.95deg) scale(.93,.9);color:rgba(96,73,42,.76)}
      @media(hover:hover){.ps-landscape-stage:hover{color:rgba(151,105,35,.92);mix-blend-mode:normal;text-shadow:-1px -1px 0 rgba(255,237,177,.62),1px 1px 0 rgba(91,57,18,.56),0 0 1.5px rgba(216,170,78,.28)}.ps-landscape-stage:hover small{color:rgba(179,132,54,.88);opacity:.84;text-shadow:-1px -1px 0 rgba(255,239,188,.52),1px 1px 0 rgba(91,57,18,.46),0 0 1px rgba(216,170,78,.2)}.ps-landscape-stage:hover strong{opacity:.96}}
      .ps-foundation-story__row--photo-first{margin-bottom:clamp(7rem,10vw,10rem)}
      .ps-foundation-story__row--photo-first>.ps-foundation-photo,.ps-foundation-story__row--photo-first>.ps-foundation-outcomes{position:relative;z-index:2}
      .ps-foundation-collage{position:absolute;z-index:1;top:0;left:50%;width:min(100vw,96rem);height:100%;transform:translateX(-50%);pointer-events:none}
      .ps-foundation-collage__photo{position:absolute;z-index:2;margin:0;overflow:hidden;background:#eadfca}
      .ps-foundation-collage__photo img{display:block;width:100%;height:100%;object-fit:cover}
      .ps-foundation-collage__photo--top{top:clamp(-8rem,-8vw,-5rem);left:52%;width:clamp(7.5rem,10vw,10rem);aspect-ratio:1/1.1;clip-path:polygon(13% 2%,86% 8%,100% 22%,94% 88%,76% 100%,4% 89%,0 22%)}
      .ps-foundation-collage__photo--top img{object-position:42% 44%}
      .ps-foundation-collage__photo--right{top:20%;right:-1.5rem;width:clamp(11rem,15vw,15rem);aspect-ratio:1/1.18;clip-path:polygon(18% 2%,95% 9%,100% 82%,73% 100%,8% 88%,0 27%)}
      .ps-foundation-collage__photo--right img{object-position:center}
      .ps-foundation-collage__photo--bottom{bottom:clamp(-9rem,-9vw,-6rem);left:39%;width:clamp(16rem,23vw,22rem);aspect-ratio:1.65/1;clip-path:polygon(4% 10%,18% 2%,53% 6%,70% 1%,96% 12%,100% 82%,88% 98%,47% 94%,24% 100%,2% 87%)}
      .ps-foundation-collage__photo--bottom img{object-position:center 44%}
      .ps-foundation-collage__photo--circle{right:12%;bottom:clamp(-8rem,-8vw,-5rem);width:clamp(8rem,11vw,10.5rem);aspect-ratio:1;border:1.5px solid rgba(216,170,78,.9);border-radius:50%;padding:3px;background:transparent;overflow:visible}
      .ps-foundation-collage__photo--circle:after{position:absolute;inset:-4px 2px 1px -3px;border:1px solid rgba(216,170,78,.72);border-radius:48% 52% 49% 51%;content:"";transform:rotate(-4deg)}
      .ps-foundation-collage__photo--circle img{border-radius:50%;object-position:center 34%}
      .ps-foundation-collage__doodles{position:absolute;z-index:1;inset:clamp(-9rem,-9vw,-6rem) 0 clamp(-11rem,-11vw,-8rem);background:url('/images/programs/primary-years-1-2-crayon-doodles.png') center/100% auto no-repeat;opacity:.78;filter:saturate(1.05);-webkit-mask-image:linear-gradient(90deg,#000 0%,#000 47%,rgba(0,0,0,.2) 52%,transparent 57%,transparent 88%,rgba(0,0,0,.25) 93%,#000 100%);mask-image:linear-gradient(90deg,#000 0%,#000 47%,rgba(0,0,0,.2) 52%,transparent 57%,transparent 88%,rgba(0,0,0,.25) 93%,#000 100%)}
      @media(max-width:1350px){.ps-foundation-collage__photo--right{display:none}}
      @media(max-width:1100px){.ps-foundation-collage{width:100vw}.ps-foundation-collage__photo--top{left:55%}.ps-foundation-collage__photo--right{right:-2rem;width:10rem}.ps-foundation-collage__photo--bottom{left:35%;width:17rem}.ps-foundation-collage__photo--circle{right:8%;width:8rem}.ps-foundation-collage__doodles{opacity:.62}}
      @media(max-width:900px){.ps-foundation-collage__photo--right{display:none}.ps-foundation-collage__photo--top{left:46%}.ps-foundation-collage__photo--bottom{left:31%}.ps-foundation-collage__photo--circle{right:2%}.ps-foundation-collage__doodles{opacity:.48}}
      @media(max-width:720px){.ps-foundation-story__row--photo-first{margin-bottom:0}.ps-foundation-collage{position:relative;top:auto;left:auto;display:grid;width:100%;height:auto;grid-template-columns:minmax(0,1fr) minmax(0,.72fr);gap:1rem;margin-top:1rem;transform:none}.ps-foundation-collage__photo{position:relative;inset:auto;width:100%}.ps-foundation-collage__photo--top{aspect-ratio:4/3}.ps-foundation-collage__photo--bottom{grid-column:1/-1;aspect-ratio:16/9}.ps-foundation-collage__photo--circle{align-self:center;width:min(100%,9rem);justify-self:center}.ps-foundation-collage__photo--right{display:none}.ps-foundation-collage__doodles{inset:-2rem -1rem;opacity:.3;background-size:720px auto;-webkit-mask-image:linear-gradient(90deg,#000 0%,transparent 28%,transparent 72%,#000 100%);mask-image:linear-gradient(90deg,#000 0%,transparent 28%,transparent 72%,#000 100%)}}
      /* Years 1–2, features 01–02: one editorial collage canvas, with a protected text plane. */
      .ps-foundation-story__row--photo-first{min-height:clamp(48rem,66.667vw,64rem);margin-bottom:clamp(3rem,5vw,5rem);align-content:center}
      .ps-foundation-story__row--photo-first>.ps-foundation-photo,.ps-foundation-story__row--photo-first>.ps-foundation-outcomes{position:relative;z-index:4}
      .ps-foundation-story__row--photo-first>.ps-foundation-photo{transform:translateY(-1.5%)}
      .ps-foundation-story__row--photo-first>.ps-foundation-outcomes{transform:translateY(-1%)}
      .ps-foundation-collage{top:50%;width:min(100vw,96rem);height:min(66.667vw,64rem);transform:translate(-50%,-50%)}
      .ps-foundation-collage__photo{z-index:3}
      .ps-foundation-collage__photo--top{top:2.5%;left:58%;width:clamp(7rem,10vw,10rem)}
      .ps-foundation-collage__photo--right{top:24%;right:-3.5%;width:clamp(11rem,15vw,15rem)}
      .ps-foundation-collage__photo--bottom{bottom:3%;left:35%;width:clamp(16rem,23vw,22rem)}
      .ps-foundation-collage__photo--circle{right:13%;bottom:4%;width:clamp(8rem,11vw,10.5rem)}
      .ps-foundation-collage__doodles{position:absolute;z-index:1;inset:0;display:block;width:100%;height:100%;object-fit:fill;object-position:center;background:none;filter:none;-webkit-mask-image:none;mask-image:none;pointer-events:none;user-select:none}
      .ps-foundation-story__row--photo-first .ps-foundation-outcome__meta i{display:none}
      @media(max-width:1250px){.ps-foundation-story__row--photo-first{min-height:clamp(44rem,72vw,54rem)}.ps-foundation-collage{width:100vw;height:72vw;max-height:54rem}.ps-foundation-collage__photo--top{left:57%;width:8rem}.ps-foundation-collage__photo--right{right:-4rem;width:10rem}.ps-foundation-collage__photo--bottom{left:34%;width:17rem}.ps-foundation-collage__photo--circle{right:6%;width:8rem}.ps-foundation-collage__doodles{opacity:.82}}
      @media(max-width:900px){.ps-foundation-story__row--photo-first{min-height:0;padding:6rem 0 3rem}.ps-foundation-collage__photo--right{display:none}.ps-foundation-collage__photo--top{top:1%;left:72%}.ps-foundation-collage__photo--bottom{left:28%}.ps-foundation-collage__photo--circle{right:2%}.ps-foundation-collage__doodles{opacity:.56}}
      @media(max-width:720px){.ps-foundation-story__row--photo-first{display:grid;min-height:0;padding:4rem 0 0;margin-bottom:0}.ps-foundation-story__row--photo-first>.ps-foundation-photo,.ps-foundation-story__row--photo-first>.ps-foundation-outcomes{transform:none}.ps-foundation-collage{position:relative;top:auto;left:auto;display:grid;width:100%;height:auto;max-height:none;grid-template-columns:minmax(0,1fr) minmax(0,.72fr);gap:1rem;margin-top:1rem;padding:2rem 0;transform:none}.ps-foundation-collage__photo{position:relative;inset:auto;width:100%}.ps-foundation-collage__photo--top{aspect-ratio:4/3}.ps-foundation-collage__photo--bottom{grid-column:1/-1;aspect-ratio:16/9}.ps-foundation-collage__photo--circle{align-self:center;width:min(100%,9rem);justify-self:center}.ps-foundation-collage__photo--right{display:none}.ps-foundation-collage__doodles{inset:-2rem -50vw;width:200vw;height:calc(100% + 4rem);object-fit:fill;opacity:.3}}
      @media(min-width:901px){
        .ps-foundation-story__row--photo-first{position:relative;left:auto;display:grid;width:100vw;max-width:none;height:calc(100svh - 3.625rem);min-height:0;max-height:calc(100svh - 3.625rem);grid-template-columns:4vw minmax(0,34vw) 4vw minmax(0,34vw) minmax(0,1fr);align-items:center;gap:0;box-sizing:border-box;margin-right:0;margin-bottom:clamp(2rem,4vh,3rem);margin-left:calc(50% - 50vw);padding:0;overflow-x:clip;overflow-y:hidden;transform:none}
        .ps-foundation-story__row--photo-first>.ps-foundation-photo{position:relative;z-index:2;grid-column:2;width:88%;height:clamp(21rem,43vh,28rem);min-height:0;margin:0;justify-self:center;translate:1cm -2cm;transform:none}
        .ps-foundation-story__row--photo-first>.ps-foundation-photo img{width:100%;height:100%;min-height:0;object-fit:cover}
        .ps-foundation-story__row--photo-first>.ps-foundation-outcomes{position:relative;z-index:5;grid-column:4;width:100%;max-width:42rem;transform:none;background:transparent}
        .ps-foundation-story__row--photo-first .ps-foundation-outcome{padding-top:clamp(.5rem,1.2vh,.8rem);padding-bottom:clamp(.75rem,1.8vh,1.25rem)}
        .ps-foundation-story__row--photo-first .ps-foundation-outcome+.ps-foundation-outcome{padding-left:clamp(1.25rem,2vw,2rem)}
        .ps-foundation-story__row--photo-first .ps-foundation-outcome__meta{margin-bottom:clamp(1.35rem,2.8vh,1.75rem)}
        .ps-foundation-story__row--photo-first .ps-foundation-outcome__meta i{width:clamp(2.6rem,5.5vh,3rem);height:clamp(2.6rem,5.5vh,3rem)}
        .ps-foundation-story__row--photo-first .ps-foundation-outcome h3{font-size:clamp(1.7rem,1.9vw,2.15rem);line-height:1.04}
        .ps-foundation-story__row--photo-first .ps-foundation-outcome p{margin-top:clamp(1.1rem,2.3vh,1.5rem);font-size:clamp(.875rem,1vw,1.05rem);line-height:1.6}
        .ps-foundation-collage{top:0;left:0;width:100%;height:100%;max-height:none;transform:none}
        .ps-foundation-collage__doodles{z-index:4;inset:0;width:100%;height:100%;object-fit:fill;object-position:center;opacity:1;transform:none;-webkit-mask-image:none;mask-image:none}
        .ps-foundation-collage__photo--top{top:3%;left:58.5%;width:min(12.8vw,12.5rem)}
        .ps-foundation-collage__photo--right{display:block;top:25%;right:.5vw;width:min(18.5vw,18rem)}
        .ps-foundation-collage__photo--bottom{bottom:0;left:33%;width:min(26vw,25rem)}
        .ps-foundation-collage__photo--circle{right:10%;bottom:12%;width:min(12.4vw,11.75rem);translate:0 -6cm}
      }
      @media(min-width:901px) and (max-height:760px){
        .ps-foundation-story__row--photo-first>.ps-foundation-photo{top:auto;left:auto;width:88%;height:42vh}
        .ps-foundation-story__row--photo-first>.ps-foundation-outcomes{top:auto;left:auto;width:auto}
        .ps-foundation-story__row--photo-first .ps-foundation-outcome h3{font-size:clamp(1.75rem,2vw,2.25rem)}
        .ps-foundation-story__row--photo-first .ps-foundation-outcome p{font-size:.875rem}
        .ps-foundation-collage__photo--top{top:3%;width:min(11.5vw,8.5rem)}
        .ps-foundation-collage__photo--right{top:20%;right:.5vw;width:min(15.5vw,11.5rem)}
        .ps-foundation-collage__photo--bottom{width:min(23vw,18rem)}
        .ps-foundation-collage__photo--circle{bottom:10%;width:min(11.5vw,8.5rem)}
      }
      .ps-foundation-story__row--photo-first .ps-foundation-collage__doodles{opacity:.76;filter:saturate(.75) blur(.65px)}
      .ps-foundation-story__row--photo-first .ps-foundation-outcome__meta>span{position:relative}
      .ps-foundation-story__row--photo-first .ps-foundation-outcome--01 .ps-foundation-outcome__meta>span:after,.ps-foundation-story__row--photo-first .ps-foundation-outcome--02 .ps-foundation-outcome__meta>span:after{position:absolute;top:50%;left:calc(100% + .75rem);display:block;width:3.5rem;height:3.5rem;background-image:url('/images/programs/primary-years-1-2-outcome-doodles.png');background-repeat:no-repeat;background-size:9rem 6rem;content:"";transform:translateY(-50%);pointer-events:none}
      .ps-foundation-story__row--photo-first .ps-foundation-outcome--01 .ps-foundation-outcome__meta>span:after{background-position:.05rem -1.35rem}
      .ps-foundation-story__row--photo-first .ps-foundation-outcome--02 .ps-foundation-outcome__meta>span:after{background-position:-5.85rem -1.35rem}
      @media(min-width:901px){
        .ps-foundation-story{margin-top:clamp(.75rem,1.5vw,1.5rem)}
        .ps-foundation-story__row--photo-first:after{position:absolute;z-index:6;top:15%;left:clamp(2rem,5.5vw,6rem);width:clamp(5.5rem,7.5vw,8rem);aspect-ratio:2/3;background:url('/images/programs/primary-years-1-2-photo-edge-doodles.png') center/contain no-repeat;content:"";pointer-events:none}
      }
      .ps-foundation-story__row--photo-last>.ps-foundation-photo{position:relative;z-index:2}
      .ps-foundation-story__row--photo-last>.ps-foundation-outcomes{position:relative;z-index:4}
      .ps-foundation-curriculum{position:relative;left:50%;display:grid;width:min(92vw,90rem);grid-template-columns:minmax(16rem,30%) minmax(0,1fr);align-items:center;column-gap:clamp(5rem,9vw,10rem);margin-left:0;padding:clamp(3rem,5vw,5rem) 0;transform:translateX(-50%)}
      .ps-foundation-curriculum__intro{position:relative;z-index:2;display:grid;min-height:24rem;align-content:center}
      .ps-foundation-curriculum__intro h3{margin:0;color:#06172b;font-family:"Cormorant Garamond",Georgia,serif;font-size:clamp(2.7rem,3.8vw,4.15rem);font-weight:500;letter-spacing:-.035em;line-height:.88;text-wrap:balance}
      .ps-foundation-curriculum__intro h3 em{color:#c8932f;font-weight:500}
      .ps-foundation-curriculum__intro-doodles{display:block;width:min(100%,15rem);height:7rem;margin-top:1.5rem;background:url('/images/programs/primary-years-1-2-curriculum-doodles.png') left bottom/36rem auto no-repeat;filter:saturate(.62) blur(.25px);opacity:.42;pointer-events:none}
      .ps-foundation-curriculum__journey{position:relative;z-index:2;min-width:0;padding-left:clamp(2rem,4vw,4rem)}
      .ps-foundation-curriculum__header{max-width:40rem;margin:0 0 clamp(3rem,5vw,4.75rem)}
      .ps-foundation-curriculum__header h3{margin:0;color:#06172b;font-family:"Cormorant Garamond",Georgia,serif;font-size:clamp(2.25rem,3vw,3.25rem);font-weight:600;letter-spacing:-.025em;line-height:1;text-transform:uppercase}
      .ps-foundation-curriculum__header p{max-width:40rem;margin:1rem 0 0;color:rgba(35,62,86,.75);font-size:clamp(.9rem,1.05vw,1rem);line-height:1.7;text-wrap:pretty}
      .ps-foundation-curriculum__items{position:relative;z-index:2;display:grid;gap:clamp(3.5rem,5vw,5.25rem);padding-left:clamp(5.5rem,8vw,8rem)}
      .ps-foundation-curriculum__item{display:grid;grid-template-columns:clamp(4.5rem,5.5vw,5.5rem) minmax(0,1fr);align-items:start;gap:clamp(1.25rem,2vw,2rem);max-width:39rem}
      .ps-foundation-curriculum__icon{display:block;width:clamp(4.5rem,5.5vw,5.5rem);height:clamp(4.5rem,5.5vw,5.5rem);background-image:url('/images/programs/primary-years-1-2-curriculum-doodles.png');background-repeat:no-repeat;filter:saturate(.66) opacity(.7);transform:rotate(-2deg)}
      .ps-foundation-curriculum__item h4{position:relative;isolation:isolate;display:inline-block;margin:.1rem 0 .65rem;color:#06172b;font-family:"Cormorant Garamond",Georgia,serif;font-size:clamp(1.35rem,1.8vw,1.8rem);font-weight:700;letter-spacing:.025em;line-height:1;text-transform:uppercase}
      .ps-foundation-curriculum__item h4 span{position:relative;z-index:1}
      .ps-foundation-curriculum__item h4:before{position:absolute;z-index:0;right:-2.25rem;bottom:-.15rem;left:-.55rem;height:.78em;border-radius:42% 58% 44% 56%/64% 42% 58% 36%;content:"";opacity:.52;transform:rotate(-1deg) skewX(-5deg);transform-origin:left center}
      .ps-foundation-curriculum__item p{margin:0;color:rgba(35,62,86,.76);font-size:clamp(.9rem,1.05vw,1rem);line-height:1.55;text-wrap:pretty}
      .ps-foundation-curriculum__item--blue .ps-foundation-curriculum__icon{background-size:32rem 21.333rem;background-position:-25.7rem -3rem}.ps-foundation-curriculum__item--blue h4:before{background:#a9d5eb}
      .ps-foundation-curriculum__item--pink .ps-foundation-curriculum__icon{background-size:32rem 21.333rem;background-position:-25.6rem -9.2rem}.ps-foundation-curriculum__item--pink h4:before{background:#efb5c2;transform:rotate(1deg) skewX(4deg)}
      .ps-foundation-curriculum__item--green .ps-foundation-curriculum__icon{background-size:32rem 21.333rem;background-position:-24rem -14.7rem}.ps-foundation-curriculum__item--green h4:before{background:#bbd6a7;transform:rotate(-.6deg) skewX(-3deg)}
      .ps-foundation-curriculum__path{position:absolute;z-index:1;top:10.5rem;left:clamp(3rem,5vw,5.25rem);width:clamp(3.75rem,5.5vw,5.5rem);height:calc(100% - 11rem);overflow:visible;pointer-events:none}
      .ps-foundation-curriculum__path path{fill:none;stroke:rgba(91,155,194,.48);stroke-width:3;stroke-linecap:round;stroke-dasharray:1 10;vector-effect:non-scaling-stroke}
      @media(max-width:800px){.ps-foundation-curriculum{width:min(calc(100vw - 2.5rem),42rem);grid-template-columns:1fr;gap:3.5rem;padding:3.5rem 0 4rem}.ps-foundation-curriculum__intro{min-height:0}.ps-foundation-curriculum__intro h3{font-size:clamp(3rem,12vw,4.2rem)}.ps-foundation-curriculum__intro-doodles{width:11rem;height:5.5rem;background-size:29rem auto}.ps-foundation-curriculum__journey{padding-left:0}.ps-foundation-curriculum__header{margin-bottom:3.25rem}.ps-foundation-curriculum__header h3{font-size:clamp(2rem,8vw,2.7rem)}.ps-foundation-curriculum__items{gap:3.5rem;padding-left:4.75rem}.ps-foundation-curriculum__path{top:9.5rem;left:.75rem;width:3.5rem;height:calc(100% - 10rem)}}
      /* Compact the chapter rhythm without moving or transforming individual content. */
      .ps-foundation-intro .ps-crayon-artwork{clip-path:inset(0 0 max(0px,calc(100% - var(--ps-foundation-doodle-end,100%))) 0)}
      .ps-foundation-intro{padding-bottom:clamp(5rem,7vw,7rem)}
      .ps-foundation-story__row+.ps-foundation-story__row{margin-top:clamp(5rem,7vw,7rem)}
      .ps-foundation-curriculum{margin-top:clamp(4rem,6vw,6rem)}
      .ps-growth{padding-top:clamp(4.5rem,6vw,6rem);padding-bottom:clamp(5rem,7vw,7rem)}
      .ps-growth__main{margin-top:clamp(4.5rem,6vw,6rem)}
      .ps-growth__divider{margin-top:clamp(4.5rem,6vw,6rem)}
      .ps-growth-curriculum{margin-top:1cm}
      .ps-mastery{padding-top:clamp(4.5rem,6vw,6rem);padding-bottom:clamp(7rem,10vw,10rem)}
      .ps-mastery__photo{margin-top:clamp(4rem,5.5vw,5.5rem)}
      .ps-mastery__outcomes{margin-top:clamp(3rem,4.5vw,4rem)}
      .ps-mastery__divider{margin-top:clamp(4.5rem,6vw,6rem)}
      .ps-mastery-curriculum{margin-top:1cm}
      @media(min-width:901px){.ps-foundation-story__row--photo-first{height:auto;min-height:clamp(29rem,52vh,36rem);max-height:none;margin-bottom:0}.ps-foundation-story__row+.ps-foundation-story__row{margin-top:1cm}.ps-foundation-story__row--photo-last{margin-top:clamp(-10rem,-8vw,-6rem)}.ps-foundation-story__row--photo-last>.ps-foundation-photo{width:82%;min-height:clamp(20rem,32vw,28rem);justify-self:end}.ps-foundation-story__row--photo-last:after{content:none}.ps-foundation-curriculum{margin-top:1cm;padding-top:0}}
      @media(max-width:720px){.ps-foundation-story__row+.ps-foundation-story__row{margin-top:5rem}.ps-foundation-curriculum{margin-top:5.5rem}.ps-growth__main{margin-top:4rem}.ps-growth-curriculum{margin-top:1cm}.ps-mastery__photo{margin-top:4rem}.ps-mastery__outcomes{margin-top:3rem}.ps-mastery-curriculum{margin-top:1cm}}
      /* Supplied Years 1–2 crayon artwork, composed around a protected content column. */
      .ps-foundation-intro__side-doodles{top:calc(clamp(250px,28vw,400px) + clamp(2rem,3vw,3.5rem));right:0;left:0;aspect-ratio:auto;height:clamp(24rem,42vw,38rem);overflow:hidden}
      .ps-foundation-intro__side-doodle{inset:auto;width:clamp(18rem,28vw,28rem);height:auto;opacity:.72;filter:saturate(.82);object-fit:contain}
      .ps-foundation-intro__side-doodle--left{top:0;left:clamp(1rem,2.5vw,3rem);clip-path:none;transform:rotate(-1.5deg);transform-origin:center}
      .ps-foundation-intro__side-doodle--right{top:clamp(1rem,3vw,3rem);right:clamp(1rem,2.5vw,3rem);clip-path:none;transform:rotate(1.25deg);transform-origin:center}
      .ps-foundation-story__flower-doodle{position:absolute;z-index:5;top:clamp(-5rem,-5vw,-3rem);right:clamp(-8rem,-7vw,-4rem);display:block;width:clamp(14rem,20vw,20rem);height:auto;opacity:.64;filter:saturate(.8);pointer-events:none;user-select:none}
      .ps-foundation-curriculum__intro-doodles{display:block;width:clamp(13rem,19vw,18rem);height:auto;margin:1.5rem 0 0 clamp(-3.5rem,-3vw,-1.5rem);background:none;filter:saturate(.78);opacity:.66;pointer-events:none;user-select:none}
      .ps-foundation-curriculum__journey{position:relative;min-height:clamp(38rem,48vw,44rem);padding-left:0}
      .ps-foundation-curriculum__rail-art{position:absolute;z-index:1;top:clamp(7.25rem,9vw,8.75rem);left:clamp(-5rem,-4vw,-2rem);display:block;width:clamp(18rem,22vw,22rem);height:auto;aspect-ratio:2/3;object-fit:contain;opacity:.72;filter:saturate(.78);pointer-events:none;user-select:none}
      .ps-foundation-curriculum__header{position:relative;z-index:2;max-width:43rem;margin:0 0 clamp(3rem,4vw,4rem);padding-left:clamp(11.5rem,14vw,14rem)}
      .ps-foundation-curriculum__header h3{color:#bd8725;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;font-size:clamp(1rem,1.35vw,1.25rem);font-weight:750;letter-spacing:.16em;line-height:1.2;text-transform:uppercase}
      .ps-foundation-curriculum__header p{margin-top:1rem;color:rgba(35,62,86,.78);font-size:clamp(.95rem,1.15vw,1.08rem);line-height:1.65}
      .ps-foundation-curriculum__items{gap:clamp(3.25rem,4.5vw,4.5rem);padding-left:clamp(11.5rem,14vw,14rem)}
      .ps-foundation-curriculum__item{display:block;min-height:clamp(7rem,9vw,8.5rem);max-width:40rem}
      .ps-foundation-curriculum__icon{display:none}
      .ps-foundation-curriculum__item h4{display:block;width:max-content;max-width:100%;margin:0 0 1.15rem;font-size:clamp(1.25rem,1.7vw,1.65rem);letter-spacing:.045em;line-height:1.08}
      .ps-foundation-curriculum__item h4:before{right:-3.25rem;bottom:-.3rem;left:-1rem;height:1.12em;opacity:.58}
      .ps-foundation-curriculum__item p{font-size:clamp(.95rem,1.1vw,1.05rem);line-height:1.62}
      @media(max-width:1000px){.ps-foundation-intro__side-doodle{width:clamp(15rem,32vw,20rem);opacity:.58}.ps-foundation-intro__side-doodle--left{left:.5rem}.ps-foundation-intro__side-doodle--right{right:.5rem}.ps-foundation-story__flower-doodle{right:-6rem;width:15rem;opacity:.5}}
      @media(max-width:800px){.ps-foundation-curriculum__journey{min-height:39rem}.ps-foundation-curriculum__header{padding-left:0}.ps-foundation-curriculum__rail-art{top:8.5rem;left:-4.5rem;width:15rem;height:auto;opacity:.6}.ps-foundation-curriculum__items{gap:3.25rem;padding-left:7.5rem}.ps-foundation-curriculum__item{min-height:7rem}.ps-foundation-curriculum__item h4{font-size:clamp(1.08rem,4.5vw,1.4rem)}.ps-foundation-curriculum__item p{font-size:.92rem}}
      @media(max-width:720px){.ps-foundation-intro__side-doodles{right:0;left:0;height:27rem}.ps-foundation-intro__side-doodle{width:11rem;opacity:.34}.ps-foundation-intro__side-doodle--left{top:2rem;left:.25rem}.ps-foundation-intro__side-doodle--right{top:5rem;right:.25rem}.ps-foundation-story__flower-doodle{top:auto;right:-5rem;bottom:-3rem;width:12rem;opacity:.38}.ps-foundation-curriculum__intro-doodles{width:12rem;margin-left:-2rem;opacity:.55}}
      @media(max-width:480px){.ps-foundation-curriculum__journey{min-height:37rem}.ps-foundation-curriculum__rail-art{top:9.25rem;left:-3.75rem;width:12rem;height:auto}.ps-foundation-curriculum__items{gap:2.8rem;padding-left:6rem}.ps-foundation-curriculum__item h4{white-space:normal}.ps-foundation-curriculum__item p{font-size:.86rem;line-height:1.55}}
      /* Years 1–2 curriculum: balanced editorial composition and one shared row system. */
      .ps-foundation-curriculum{width:min(90vw,86rem);grid-template-columns:minmax(0,42fr) minmax(0,58fr);align-items:start;column-gap:clamp(3.5rem,6vw,6.5rem);padding:clamp(2rem,2.5vw,2.75rem) 0}
      .ps-foundation-curriculum__intro{min-height:0;align-content:start;padding-left:clamp(.5rem,2vw,2rem)}
      .ps-foundation-curriculum__intro h3{font-size:clamp(3.6rem,5.4vw,5.5rem);line-height:.84}
      .ps-foundation-curriculum__intro-doodles{width:min(100%,18rem);height:auto;margin:clamp(1.25rem,2vw,1.75rem) 0 0 clamp(-2rem,-1.5vw,-.5rem);opacity:.72;filter:saturate(.82)}
      .ps-foundation-curriculum__journey{min-height:0;padding-left:0}
      .ps-foundation-curriculum__rail-art{display:none}
      .ps-foundation-curriculum__header{max-width:none;margin:0 0 clamp(2.25rem,3vw,3rem);padding-left:0}
      .ps-foundation-curriculum__header h3{display:flex;align-items:baseline;gap:clamp(1rem,2vw,2rem);color:#06172b;font-family:"Cormorant Garamond",Georgia,serif;line-height:1;text-transform:none}
      .ps-foundation-curriculum__header h3 span{font-size:clamp(2.7rem,4vw,4.1rem);font-weight:600;letter-spacing:-.025em;white-space:nowrap}
      .ps-foundation-curriculum__header h3 b{color:#bd8725;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;font-size:clamp(.8rem,1.05vw,1rem);font-weight:750;letter-spacing:.24em;text-transform:uppercase}
      .ps-foundation-curriculum__header-line{position:relative;display:block;width:100%;height:1px;margin:1rem 0 1.4rem;background:linear-gradient(90deg,rgba(189,135,37,.72),rgba(189,135,37,.2))}
      .ps-foundation-curriculum__header-line:after{position:absolute;top:50%;right:0;color:#bd8725;font-size:1.15rem;line-height:1;content:"✦";transform:translateY(-52%)}
      .ps-foundation-curriculum__header p{max-width:38rem;margin:0;color:rgba(35,62,86,.68);font-size:clamp(.92rem,1.05vw,1rem);line-height:1.65}
      .ps-foundation-curriculum__items{gap:0;padding-left:0}
      .ps-foundation-curriculum__items,.ps-open-curriculum__items{--curriculum-doodle-lane:clamp(11.5rem,14vw,14rem);position:relative}
      .ps-curriculum-continuous-doodle{position:absolute;z-index:1;top:50%;left:0;display:block;width:var(--curriculum-doodle-lane);height:auto;aspect-ratio:2/3;object-fit:contain;opacity:.72;filter:saturate(.78);transform:translateY(-50%);pointer-events:none;user-select:none}
      .ps-foundation-curriculum__item{display:grid;min-height:0;max-width:none;grid-template-columns:var(--curriculum-doodle-lane) minmax(0,1fr);align-items:center;gap:clamp(1.5rem,2.5vw,2.5rem);padding:clamp(1.7rem,2.4vw,2.35rem) 0;border-top:0}
      .ps-foundation-curriculum__icon{display:block;width:var(--curriculum-doodle-lane);height:1px;visibility:hidden}
      .ps-foundation-curriculum__item>div{grid-column:2;min-width:0}
      .ps-foundation-curriculum__item--blue .ps-foundation-curriculum__icon{background-size:38rem 25.333rem;background-position:-30.52rem -3.56rem}
      .ps-foundation-curriculum__item--pink .ps-foundation-curriculum__icon{background-size:38rem 25.333rem;background-position:-30.4rem -10.93rem}
      .ps-foundation-curriculum__item--green .ps-foundation-curriculum__icon{background-size:38rem 25.333rem;background-position:-28.5rem -17.46rem}
      .ps-foundation-curriculum__item h4{display:inline-block;width:auto;max-width:100%;margin:0 0 .7rem;font-size:clamp(1.35rem,1.8vw,1.75rem);letter-spacing:.025em;line-height:1.05}
      .ps-foundation-curriculum__item h4:before{right:-1.5rem;bottom:-.12rem;left:-.3rem;height:.38em;opacity:.72}
      .ps-foundation-curriculum__item p{max-width:34rem;margin:0;color:rgba(35,62,86,.72);font-size:clamp(.92rem,1.05vw,1rem);line-height:1.58}
      @media(max-width:1000px){.ps-foundation-curriculum{width:min(calc(100vw - 3rem),76rem);grid-template-columns:minmax(0,40fr) minmax(0,60fr);column-gap:3rem}.ps-foundation-curriculum__intro h3{font-size:clamp(3.25rem,5.5vw,4.5rem)}.ps-foundation-curriculum__item{grid-template-columns:5.75rem minmax(0,1fr);gap:1.5rem}.ps-foundation-curriculum__icon{width:5.75rem;height:5.75rem}}
      @media(max-width:800px){.ps-foundation-curriculum{width:min(calc(100vw - 2.5rem),42rem);grid-template-columns:1fr;gap:4rem;padding:4rem 0}.ps-foundation-curriculum__intro{min-height:0;padding-left:0}.ps-foundation-curriculum__intro-doodles{width:min(100%,23rem);margin-left:-1rem}.ps-foundation-curriculum__journey{min-height:0}.ps-foundation-curriculum__header h3{flex-wrap:wrap;gap:.55rem 1.25rem}.ps-foundation-curriculum__header h3 span{font-size:clamp(2.7rem,10vw,3.8rem)}.ps-foundation-curriculum__items{padding-left:0}.ps-foundation-curriculum__item{grid-template-columns:5.75rem minmax(0,1fr);gap:1.4rem;padding:1.75rem 0}.ps-foundation-curriculum__item h4{font-size:clamp(1.25rem,4.5vw,1.55rem)}.ps-foundation-curriculum__item p{font-size:.92rem}}
      @media(max-width:430px){.ps-foundation-curriculum__item{grid-template-columns:1fr;gap:.9rem;text-align:center}.ps-foundation-curriculum__icon{margin:0 auto}.ps-foundation-curriculum__item h4{margin-right:auto;margin-left:auto}.ps-foundation-curriculum__item p{margin-right:auto;margin-left:auto}.ps-foundation-curriculum__header{text-align:left}}
      /* Shared open-canvas curriculum system for Years 3–4 and Years 5–6. */
      .ps-growth-curriculum,.ps-mastery-curriculum{left:50%;width:min(90vw,86rem);grid-template-columns:minmax(0,42fr) minmax(0,58fr);align-items:center;column-gap:clamp(3.5rem,6vw,6.5rem);transform:translateX(-50%)}
      .ps-growth-curriculum>div:last-child,.ps-mastery-curriculum>div:last-child{min-width:0}
      .ps-open-curriculum{width:100%;color:#06172b}
      .ps-open-curriculum__header{max-width:none;margin:0 0 clamp(2.25rem,3vw,3rem)}
      .ps-open-curriculum__header h3{display:flex;align-items:baseline;gap:clamp(1rem,2vw,2rem);margin:0;color:#06172b;font-family:"Cormorant Garamond",Georgia,serif;line-height:1}
      .ps-open-curriculum__header h3 span{font-size:clamp(2.7rem,4vw,4.1rem);font-weight:600;letter-spacing:-.025em;white-space:nowrap}
      .ps-open-curriculum__header h3 b{color:#bd8725;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;font-size:clamp(.8rem,1.05vw,1rem);font-weight:750;letter-spacing:.24em;text-transform:uppercase}
      .ps-open-curriculum__header>i{position:relative;display:block;width:100%;height:1px;margin:1rem 0 1.4rem;background:linear-gradient(90deg,rgba(189,135,37,.72),rgba(189,135,37,.2))}
      .ps-open-curriculum__header>i:after{position:absolute;top:50%;right:0;color:#bd8725;font-size:1.15rem;line-height:1;content:"✦";transform:translateY(-52%)}
      .ps-open-curriculum__header p{max-width:38rem;margin:0;color:rgba(35,62,86,.68);font-size:clamp(.92rem,1.05vw,1rem);line-height:1.65;text-wrap:pretty}
      .ps-open-curriculum__items{display:grid;gap:0}
      .ps-open-curriculum__item{position:relative;z-index:2;display:grid;grid-template-columns:var(--curriculum-doodle-lane) minmax(0,1fr);align-items:center;gap:clamp(1.5rem,2.5vw,2.5rem);padding:clamp(1.7rem,2.4vw,2.35rem) 0;border-top:0}
      .ps-open-curriculum__icon{display:block;width:var(--curriculum-doodle-lane);height:1px;visibility:hidden}
      .ps-open-curriculum__item>p{grid-column:2;min-width:0}
      .ps-open-curriculum__item--blue .ps-open-curriculum__icon{background-size:38rem 25.333rem;background-position:-30.52rem -3.56rem}
      .ps-open-curriculum__item--pink .ps-open-curriculum__icon{background-size:38rem 25.333rem;background-position:-30.4rem -10.93rem}
      .ps-open-curriculum__item--green .ps-open-curriculum__icon{background-size:38rem 25.333rem;background-position:-28.5rem -17.46rem}
      .ps-open-curriculum__item p{position:relative;width:fit-content;max-width:34rem;margin:0;color:#06172b;font-family:"Cormorant Garamond",Georgia,serif;font-size:clamp(1.3rem,1.65vw,1.65rem);font-weight:650;line-height:1.2;text-wrap:pretty}
      .ps-open-curriculum__item p:after{display:block;width:min(7rem,45%);height:.28rem;margin-top:.65rem;border-radius:999px;content:"";opacity:.68}
      .ps-open-curriculum__item--blue p:after{background:#a9d5eb}.ps-open-curriculum__item--pink p:after{background:#efb5c2}.ps-open-curriculum__item--green p:after{background:#bbd6a7}
      .ps-growth-curriculum__intro,.ps-mastery-curriculum__intro{align-self:stretch;display:grid;min-height:clamp(23rem,29vw,27rem);align-content:center;padding:0 0 0 clamp(.5rem,2vw,2rem)}
      .ps-growth-curriculum__intro h3,.ps-mastery-curriculum__intro h3{font-size:clamp(3.6rem,5.4vw,5.5rem);letter-spacing:-.035em;line-height:.84;text-wrap:balance}
      .ps-growth-curriculum__intro .ps-growth-curriculum__doodle--left,.ps-mastery-curriculum__intro .ps-mastery-curriculum__doodle--left{position:relative;inset:auto;display:block;width:min(100%,26rem);height:auto;aspect-ratio:1;margin:clamp(2rem,3vw,3rem) 0 0 clamp(-2rem,-1.5vw,-.5rem);opacity:.72;filter:saturate(.82);transform:none}
      @media(max-width:1000px){.ps-growth-curriculum,.ps-mastery-curriculum{width:min(calc(100vw - 3rem),76rem);grid-template-columns:minmax(0,40fr) minmax(0,60fr);column-gap:3rem}.ps-growth-curriculum__intro h3,.ps-mastery-curriculum__intro h3{font-size:clamp(3.25rem,5.5vw,4.5rem)}.ps-foundation-curriculum__items,.ps-open-curriculum__items{--curriculum-doodle-lane:10rem}.ps-foundation-curriculum__item,.ps-open-curriculum__item{grid-template-columns:var(--curriculum-doodle-lane) minmax(0,1fr);gap:1.5rem}}
      @media(max-width:720px){.ps-growth-curriculum,.ps-mastery-curriculum{width:min(calc(100vw - 2.5rem),42rem);grid-template-columns:1fr;gap:4rem}.ps-growth-curriculum__intro,.ps-mastery-curriculum__intro{min-height:0;padding-left:0}.ps-growth-curriculum__intro .ps-growth-curriculum__doodle--left,.ps-mastery-curriculum__intro .ps-mastery-curriculum__doodle--left{width:min(100%,23rem);margin-left:-1rem}.ps-open-curriculum__header h3{flex-wrap:wrap;gap:.55rem 1.25rem}.ps-open-curriculum__header h3 span{font-size:clamp(2.7rem,10vw,3.8rem)}.ps-foundation-curriculum__items,.ps-open-curriculum__items{--curriculum-doodle-lane:8.5rem}.ps-foundation-curriculum__item,.ps-open-curriculum__item{grid-template-columns:var(--curriculum-doodle-lane) minmax(0,1fr);gap:1.25rem;padding:1.75rem 0}.ps-open-curriculum__item p{font-size:clamp(1.2rem,5vw,1.5rem)}}
      @media(max-width:430px){.ps-foundation-curriculum__items,.ps-open-curriculum__items{--curriculum-doodle-lane:7rem}.ps-foundation-curriculum__item,.ps-open-curriculum__item{grid-template-columns:var(--curriculum-doodle-lane) minmax(0,1fr);gap:1rem;text-align:left}.ps-open-curriculum__item p{margin:0}.ps-open-curriculum__item p:after{margin-left:0}}
      /* Supplied Years 5–6 sheets frame the intro and curriculum without entering the text plane. */
      .ps-mastery__hero-doodles{position:absolute;z-index:2;top:clamp(2.5rem,4vw,4.5rem);left:50%;width:min(100vw,96rem);height:clamp(25rem,38vw,35rem);transform:translateX(-50%);overflow:hidden;pointer-events:none;user-select:none}
      .ps-mastery__hero-doodle{position:absolute;display:block;width:clamp(17rem,23vw,23rem);height:auto;aspect-ratio:1;opacity:.64;filter:saturate(.78);object-fit:contain}
      .ps-mastery__hero-doodle--left{top:clamp(1rem,3vw,3rem);left:clamp(1rem,2.5vw,3rem);transform:rotate(-1deg)}
      .ps-mastery__hero-doodle--right{top:0;right:clamp(1rem,2.5vw,3rem);transform:rotate(1deg)}
      .ps-mastery-curriculum{position:relative;isolation:isolate}
      .ps-mastery-curriculum__intro,.ps-mastery-curriculum__panel{position:relative;z-index:2}
      .ps-mastery-curriculum__intro{align-self:stretch;display:grid;min-height:clamp(34rem,42vw,40rem);align-content:center;padding-top:0}
      .ps-mastery-curriculum__doodle{position:absolute;z-index:1;display:block;height:auto;opacity:.62;filter:saturate(.8);object-fit:contain;pointer-events:none;user-select:none}
      .ps-mastery-curriculum__intro .ps-mastery-curriculum__doodle--left{position:relative;inset:auto;width:min(100%,26rem);height:auto;aspect-ratio:1;margin:clamp(2rem,3vw,3rem) 0 0 clamp(-2rem,-1.5vw,-.5rem);opacity:.72;filter:saturate(.82);transform:none}
      .ps-mastery-curriculum__doodle--right{right:clamp(.25rem,1vw,1rem);bottom:clamp(-1rem,-1vw,0rem);width:clamp(11rem,15vw,14rem);aspect-ratio:1;transform:rotate(1deg)}
      @media(max-width:1000px){.ps-mastery__hero-doodle{width:clamp(14rem,30vw,18rem);opacity:.48}.ps-mastery__hero-doodle--left{left:.5rem}.ps-mastery__hero-doodle--right{right:.5rem}.ps-mastery-curriculum__doodle--right{right:.25rem;width:11rem}}
      @media(max-width:720px){.ps-mastery__hero-doodles{top:3rem;height:24rem}.ps-mastery__hero-doodle{width:10rem;opacity:.28}.ps-mastery__hero-doodle--left{top:3rem;left:.25rem}.ps-mastery__hero-doodle--right{top:5rem;right:.25rem}.ps-mastery-curriculum{padding-bottom:3rem}.ps-mastery-curriculum__intro{min-height:0;padding-top:0}.ps-mastery-curriculum__intro .ps-mastery-curriculum__doodle--left{width:min(100%,23rem);margin-left:-1rem}.ps-mastery-curriculum__doodle--right{right:.5rem;bottom:1rem;width:9rem;opacity:.28}}
      /* Primary opening: one vertical story from photography into the illustrated pathway. */
      .ps-opening{padding-top:0;background:#f7f0e3}
      .ps-opening__hero{height:auto;min-height:100svh}
      .ps-opening__hero .subject-hero{min-height:100svh}
      .ps-opening__hero .ps-hero:after{z-index:1;height:clamp(8rem,21%,13rem);background:linear-gradient(180deg,rgba(247,240,227,0) 0%,rgba(247,240,227,.04) 34%,rgba(247,240,227,.13) 58%,rgba(247,240,227,.34) 82%,rgba(247,240,227,.52) 100%)}
      .ps-opening__hero{-webkit-mask-image:radial-gradient(ellipse 44% 18% at 50% 82%,#000 0%,#000 42%,rgba(0,0,0,.76) 60%,rgba(0,0,0,.32) 78%,transparent 100%),linear-gradient(180deg,#000 0%,#000 81%,rgba(0,0,0,.76) 85%,rgba(0,0,0,.32) 90%,transparent 95%);mask-image:radial-gradient(ellipse 44% 18% at 50% 82%,#000 0%,#000 42%,rgba(0,0,0,.76) 60%,rgba(0,0,0,.32) 78%,transparent 100%),linear-gradient(180deg,#000 0%,#000 81%,rgba(0,0,0,.76) 85%,rgba(0,0,0,.32) 90%,transparent 95%)}
      #primary-page-content{position:relative;z-index:auto;margin-top:0;background:#f7f0e3}
      .ps-landscape-breath{position:relative;display:block;width:100%;height:auto;min-height:0;margin:0;padding:.5rem 0 0;overflow:hidden;background:#f7f0e3;isolation:auto}
      .ps-landscape-breath__copy{position:relative;z-index:4;top:auto;left:auto;width:min(calc(100% - 3rem),47rem);margin:0 auto;color:#0b2743;text-align:center;text-shadow:none}
      .ps-landscape-breath__copy>p{display:flex;align-items:center;justify-content:center;gap:.85rem;margin:0 0 .85rem;color:#a9781e;font-size:clamp(.62rem,.72vw,.72rem);font-weight:750;letter-spacing:.19em;text-transform:uppercase}
      .ps-landscape-breath__copy>p i{position:relative;display:block;width:clamp(2.4rem,3.5vw,3.5rem);height:1px;background:rgba(185,136,40,.58)}
      .ps-landscape-breath__copy>p i:after{position:absolute;top:50%;width:4px;height:4px;background:#c99b36;content:"";transform:translateY(-50%) rotate(45deg)}
      .ps-landscape-breath__copy>p i:first-child:after{right:0}.ps-landscape-breath__copy>p i:last-child:after{left:0}
      .ps-landscape-breath__copy h2{font-size:clamp(3.2rem,4.7vw,4.65rem);line-height:.94}
      .ps-landscape-breath__rule{position:relative;width:4.5rem;margin:1.15rem auto 1.05rem}
      .ps-landscape-breath__rule:after{position:absolute;top:50%;left:50%;width:5px;height:5px;background:#c99b36;content:"";transform:translate(-50%,-50%) rotate(45deg)}
      .ps-landscape-breath__copy>span{max-width:26rem;margin:0 auto;color:rgba(36,65,90,.72);font-size:clamp(.86rem,.98vw,.96rem);line-height:1.55}
      .ps-landscape-breath__visual{position:relative;width:100%;height:auto;min-height:0;margin-top:clamp(-9rem,-10vw,-7rem);overflow:visible;background:#f7f0e3;isolation:isolate}
      .ps-landscape-breath__visual:before,.ps-landscape-breath__visual:after{position:absolute;z-index:3;background:#f7f0e3;content:"";pointer-events:none}
      .ps-landscape-breath__visual:before{top:-1.5rem;right:-3%;left:-3%;height:clamp(4.25rem,6vw,5.75rem);box-shadow:0 1.1rem 2.2rem rgba(247,240,227,.72);filter:blur(clamp(.7rem,1.3vw,1.15rem))}
      .ps-landscape-breath__visual:after{top:clamp(-7rem,-7vw,-4.5rem);left:50%;width:82%;height:clamp(14rem,21vw,19rem);border-radius:50%;box-shadow:0 1.2rem 2.4rem rgba(247,240,227,.66);filter:blur(clamp(.75rem,1.45vw,1.3rem));transform:translateX(-50%)}
      .ps-landscape-breath__image{position:relative;z-index:1;inset:auto;display:block;width:100%;height:auto!important;max-width:none;margin:0;object-fit:contain;object-position:center}
      .ps-landscape-breath__stages{z-index:3}
      .ps-landscape-breath__year-nav{z-index:4;top:24%}
      .ps-landscape-reflection{position:relative;z-index:1;width:100%;height:clamp(17rem,27vw,25rem);margin-top:0;background:url('/images/programs/primary-school-staircase-landscape-v3.png') center bottom/100vw auto no-repeat;opacity:.78;transform:scaleY(-1);transform-origin:center;-webkit-mask-image:radial-gradient(ellipse 145% 132% at 50% 126%,#000 0%,#000 40%,rgba(0,0,0,.9) 52%,rgba(0,0,0,.62) 67%,rgba(0,0,0,.3) 80%,rgba(0,0,0,.1) 89%,transparent 96%);mask-image:radial-gradient(ellipse 145% 132% at 50% 126%,#000 0%,#000 40%,rgba(0,0,0,.9) 52%,rgba(0,0,0,.62) 67%,rgba(0,0,0,.3) 80%,rgba(0,0,0,.1) 89%,transparent 96%);pointer-events:none}
      .ps-mobile-progress{display:none}
      .ps-foundation-intro{padding-top:clamp(4.5rem,8vw,7rem)}
      .ps-foundation-intro__side-doodles{top:clamp(2rem,4vw,4rem)}
      /* Keep the hand-off between year groups deliberate, without leaving a visual hole. */
      .primary-story{--ps-stage-edge:clamp(3.25rem,4vw,4.5rem);--ps-curriculum-gap:clamp(5rem,5.5vw,6rem)}
      .ps-foundation-intro{padding-bottom:clamp(1.5rem,2vw,2rem)}
      .ps-growth{padding-top:clamp(2rem,2.5vw,2.75rem);padding-bottom:var(--ps-stage-edge)}
      .ps-mastery{padding-top:var(--ps-stage-edge)}
      .ps-growth-curriculum,.ps-mastery-curriculum{margin-top:var(--ps-curriculum-gap)}
      @media(max-width:820px){.ps-opening__hero{-webkit-mask-image:radial-gradient(ellipse 48% 17% at 50% 82%,#000 0%,#000 40%,rgba(0,0,0,.74) 59%,rgba(0,0,0,.3) 78%,transparent 100%),linear-gradient(180deg,#000 0%,#000 80%,rgba(0,0,0,.74) 84%,rgba(0,0,0,.3) 89%,transparent 94%);mask-image:radial-gradient(ellipse 48% 17% at 50% 82%,#000 0%,#000 40%,rgba(0,0,0,.74) 59%,rgba(0,0,0,.3) 78%,transparent 100%),linear-gradient(180deg,#000 0%,#000 80%,rgba(0,0,0,.74) 84%,rgba(0,0,0,.3) 89%,transparent 94%)}.ps-landscape-breath{padding-top:.35rem}.ps-landscape-breath__copy{left:auto;width:min(calc(100% - 2.5rem),40rem)}.ps-landscape-breath__copy h2{font-size:clamp(2.9rem,8vw,3.8rem)}.ps-landscape-breath__visual{height:auto;min-height:0;margin-top:-5rem}.ps-landscape-breath__visual:before{height:clamp(3.75rem,10vw,5rem)}.ps-landscape-breath__visual:after{top:clamp(-5.5rem,-10vw,-3.5rem);width:86%;height:clamp(11rem,27vw,15rem)}.ps-landscape-breath__image{object-position:center}.ps-landscape-breath__year-nav{top:18%;right:.8rem}.ps-landscape-stage--foundation{top:80.2%}.ps-landscape-stage--growth{top:74.45%}.ps-landscape-stage--mastery{top:68.95%}.ps-landscape-reflection{height:clamp(14rem,43vw,20rem);margin-top:0;background-size:auto 175%;background-position:center bottom}.ps-foundation-intro{padding-top:4.5rem}.ps-foundation-intro__side-doodles{top:1.5rem}}
      @media(max-width:540px){.ps-foundation-intro{padding-top:4rem;padding-bottom:var(--ps-stage-edge)}.ps-landscape-breath{padding-top:.25rem}.ps-landscape-breath__copy{top:auto;left:auto;width:calc(100% - 2rem)}.ps-landscape-breath__copy>p{gap:.55rem;margin-bottom:.7rem;font-size:.56rem;letter-spacing:.15em}.ps-landscape-breath__copy>p i{width:1.8rem}.ps-landscape-breath__copy h2{font-size:clamp(2.55rem,11vw,3.15rem);line-height:.94}.ps-landscape-breath__rule{margin:.9rem auto}.ps-landscape-breath__copy>span{max-width:21rem;font-size:.78rem;line-height:1.52}.ps-pathway-copy-break{display:none}.ps-landscape-breath__visual{height:auto;margin-top:-4.5rem}.ps-landscape-breath__visual:before{top:-1rem;right:-5%;left:-5%;height:3.5rem;box-shadow:0 .75rem 1.4rem rgba(247,240,227,.72);filter:blur(.6rem)}.ps-landscape-breath__visual:after{top:-4.25rem;width:90%;height:11.5rem;box-shadow:0 .8rem 1.5rem rgba(247,240,227,.66);filter:blur(.7rem)}.ps-landscape-breath__image{object-position:center}.ps-landscape-breath__year-nav{top:20%;right:.55rem}.ps-landscape-stage{display:none}.ps-landscape-reflection{height:13rem;margin-top:0;background-size:auto 190%}}
      /* Phase 1 Primary hero: supplied artwork, calm editorial copy and restrained ambient depth. */
      .ps-opening,.ps-opening__hero{width:100%;margin:0;padding:0;background:#9dd0f1}
      .ps-opening__hero{height:100svh;min-height:100svh;overflow:hidden;-webkit-mask-image:none;mask-image:none}
      .ps-opening__hero .ps-hero{--hero-pointer-x:0;--hero-pointer-y:0;position:relative;display:block;width:100%;height:100%;min-height:100svh;margin:0;overflow:hidden;background:#9dd0f1;color:#09223d;isolation:isolate}
      .ps-hero:before,.ps-opening__hero .ps-hero:after{content:none}
      .ps-hero__background{position:absolute;z-index:0;inset:0;display:block;transform:translate3d(calc(var(--hero-pointer-x) * -2px),calc(var(--hero-pointer-y) * -2px),0) scale(1.012);transition:none;will-change:transform}
      .ps-hero__background img{display:block;width:100%;height:100%;object-fit:cover;object-position:center;background:#9dd0f1}
      .ps-hero__clouds{position:absolute;z-index:1;top:-8%;left:-8%;width:72%;height:55%;background:radial-gradient(ellipse at 45% 55%,rgba(255,255,255,.16),rgba(255,255,255,0) 68%);opacity:.7;transform:translate3d(calc(var(--hero-pointer-x) * -1px),calc(var(--hero-pointer-y) * -1px),0);animation:psHeroCloudDrift 34s ease-in-out infinite alternate;pointer-events:none;will-change:transform}
      .ps-hero__midground{transform:translate3d(calc(var(--hero-pointer-x) * 4px),calc(var(--hero-pointer-y) * 3px),0)}
      .ps-hero__foreground{position:absolute;z-index:2;right:-4%;bottom:-5%;width:58%;height:46%;background:radial-gradient(ellipse at 76% 72%,rgba(255,255,255,.07),rgba(255,255,255,0) 68%);transform:translate3d(calc(var(--hero-pointer-x) * 9px),calc(var(--hero-pointer-y) * 7px),0);pointer-events:none;will-change:transform}
      .ps-hero__sunlight{position:absolute;z-index:3;inset:-18%;background:radial-gradient(circle at 22% 24%,rgba(255,250,218,.18),transparent 31%),linear-gradient(112deg,transparent 25%,rgba(255,244,204,.07) 48%,transparent 68%);opacity:.58;animation:psHeroSunlight 30s ease-in-out infinite alternate;pointer-events:none;will-change:transform,opacity}
      .ps-hero__veil{position:absolute;z-index:4;inset:0;background:linear-gradient(90deg,rgba(244,250,250,.82) 0%,rgba(244,250,250,.56) 23%,rgba(244,250,250,.08) 43%,transparent 61%);pointer-events:none}
      .ps-hero__content{position:absolute;z-index:8;top:clamp(8.5rem,18vh,12rem);left:max(clamp(2rem,6vw,6rem),calc((100vw - 96rem)/2));width:min(35rem,38vw);margin:0;padding:0;color:#09223d;text-shadow:0 1px 0 rgba(255,255,255,.26)}
      .ps-hero .ps-kicker{display:flex;align-items:center;gap:.8rem;margin:0 0 1.15rem;color:#214b6d;font-size:.7rem;font-weight:800;letter-spacing:.22em;text-transform:uppercase}
      .ps-hero .ps-kicker:before{width:2.6rem;height:1px;background:#b47d20;content:""}
      .ps-hero h1{max-width:9ch;margin:0;color:#09223d;font-family:"Cormorant Garamond",Georgia,serif;font-size:clamp(3.7rem,5.3vw,5.8rem);font-weight:500;letter-spacing:-.04em;line-height:.88;text-wrap:balance}
      .ps-hero__intro{max-width:31rem;margin:1.65rem 0 0;color:#173d5c;font-family:"Cormorant Garamond",Georgia,serif;font-size:clamp(1.15rem,1.42vw,1.45rem);font-style:italic;line-height:1.42;text-wrap:pretty}
      .ps-hero__journey-link{display:inline-flex;min-height:44px;align-items:center;gap:.65rem;margin-top:1.35rem;border-bottom:1px solid rgba(9,34,61,.52);padding:.15rem 0 .32rem;color:#09223d;font-size:.76rem;font-weight:750;letter-spacing:.035em;text-decoration:none;transition:border-color .25s ease,transform .25s ease}
      .ps-hero__journey-link span{font-family:Georgia,serif;font-size:1rem;transition:transform .25s ease}
      .ps-hero__journey-link:hover{border-color:#b47d20;transform:translateY(-1px)}.ps-hero__journey-link:hover span{transform:translateY(3px)}
      .ps-hero__wind{position:absolute;z-index:5;border-radius:50%;background:linear-gradient(100deg,transparent 15%,rgba(255,255,255,.045) 50%,transparent 82%);opacity:0;pointer-events:none;transform-origin:50% 100%;animation:psHeroWind 11s cubic-bezier(.45,.05,.4,.95) infinite;will-change:transform,opacity}
      .ps-hero__wind--foreground{right:-2%;bottom:-5%;width:46%;height:28%;animation-delay:0s}
      .ps-hero__wind--children{z-index:5;bottom:2%;left:31%;width:25%;height:39%;animation-delay:.35s}
      .ps-hero__wind--lower-flowers{right:18%;bottom:5%;width:30%;height:36%;animation-delay:.7s}
      .ps-hero__wind--lower-stairs{right:18%;bottom:27%;width:25%;height:26%;animation-delay:1.05s}
      .ps-hero__wind--middle-stairs{right:17%;bottom:46%;width:23%;height:24%;animation-delay:1.45s}
      .ps-hero__wind--upper-flowers{right:5%;top:14%;width:31%;height:36%;animation-delay:1.9s}
      .ps-hero__wind--door{right:3%;top:2%;width:30%;height:38%;animation-delay:2.35s}
      @keyframes psHeroWind{0%,3%,43%,100%{opacity:0;transform:translate3d(0,0,0) rotate(0)}10%{opacity:.7;transform:translate3d(2px,-1px,0) rotate(.7deg)}20%{opacity:.35;transform:translate3d(-1px,-2px,0) rotate(-.35deg)}32%{opacity:.18;transform:translate3d(1px,0,0) rotate(.2deg)}}
      @keyframes psHeroCloudDrift{0%{transform:translate3d(calc(var(--hero-pointer-x) * -1px - 8px),calc(var(--hero-pointer-y) * -1px),0)}100%{transform:translate3d(calc(var(--hero-pointer-x) * -1px + 16px),calc(var(--hero-pointer-y) * -1px + 3px),0)}}
      @keyframes psHeroSunlight{0%{opacity:.42;transform:translate3d(-1.2%,0,0) scale(1)}100%{opacity:.63;transform:translate3d(1.4%,-.6%,0) scale(1.015)}}
      @media(max-width:900px){.ps-hero__background img{object-fit:cover;object-position:62% center}.ps-hero__veil{background:linear-gradient(90deg,rgba(244,250,250,.82),rgba(244,250,250,.42) 42%,rgba(244,250,250,.05) 68%,transparent)}.ps-hero__content{top:clamp(7rem,14vh,9rem);left:clamp(1.5rem,5vw,3rem);width:min(28rem,48vw)}.ps-hero h1{font-size:clamp(3.2rem,7.5vw,4.6rem)}.ps-hero__intro{font-size:1.12rem}}
      @media(max-width:600px){.ps-opening__hero,.ps-opening__hero .ps-hero{height:100svh;min-height:100svh}.ps-hero__background{inset:0;transform:none}.ps-hero__background img{object-fit:cover;object-position:62% center}.ps-hero__clouds,.ps-hero__foreground{display:none}.ps-hero__veil{background:linear-gradient(180deg,rgba(244,250,250,.8) 0%,rgba(244,250,250,.58) 31%,rgba(244,250,250,.12) 57%,transparent 76%)}.ps-hero__content{top:5.8rem;left:1.25rem;width:calc(100% - 2.5rem);text-align:left}.ps-hero .ps-kicker{margin-bottom:.8rem;font-size:.62rem}.ps-hero h1{max-width:8.5ch;font-size:clamp(3rem,13.2vw,4rem);line-height:.9}.ps-hero__intro{max-width:21rem;margin-top:1rem;font-size:1.03rem;line-height:1.34}.ps-hero__journey-link{margin-top:.8rem}.ps-hero__wind{animation-duration:12.5s;opacity:0}}
      @media(prefers-reduced-motion:reduce){.ps-button,.ps-mobile-progress i b,.ps-landscape-stage,.ps-landscape-stage small,.ps-landscape-stage strong,.ps-hero__journey-link,.ps-hero__journey-link span{transition:none}.ps-hero__handoff{display:none}.ps-hero__background,.ps-hero__clouds,.ps-hero__midground,.ps-hero__foreground,.ps-hero__sunlight,.ps-hero__wind{animation:none;transform:none}.ps-hero__wind{opacity:0}}
    `}</style>
  </div>
);

export default PrimarySchool;
