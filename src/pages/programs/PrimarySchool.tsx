import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { ArrowRight, BookOpen, Brain, Calculator, Check, ClipboardCheck, GraduationCap, Heart, Play, Star, Target, Trophy, UserRound, UsersRound } from 'lucide-react';
import NavigationNew from '@/components/NavigationNew';
import StickyBookButton from '@/components/StickyBookButton';
import SEO from '@/components/SEO';

const heroJourneyNav = [
  { number: '01', label: 'Foundation' },
  { number: '02', label: 'Growth' },
  { number: '03', label: 'Mastery' },
  { number: '04', label: 'Why DA' },
  { number: '05', label: 'Book Consultation' },
];

const premiumEase = [0.22, 1, 0.36, 1] as const;

const CrayonArtwork = ({ progress, reduceMotion }: { progress: MotionValue<number>; reduceMotion: boolean }) => {
  const upperOpacity = useTransform(progress, [0.12, 0.34], [0.08, 0.72]);
  const middleOpacity = useTransform(progress, [0.32, 0.66], [0.05, 0.68]);
  const lowerOpacity = useTransform(progress, [0.58, 0.94], [0.04, 0.7]);
  const upperY = useTransform(progress, [0.12, 0.34], [10, 0]);
  const middleY = useTransform(progress, [0.32, 0.66], [12, 0]);
  const lowerY = useTransform(progress, [0.58, 0.94], [14, 0]);
  const upperScale = useTransform(progress, [0.12, 0.34], [0.985, 1]);
  const middleScale = useTransform(progress, [0.32, 0.66], [0.98, 1]);
  const lowerScale = useTransform(progress, [0.58, 0.94], [0.985, 1]);
  const bands = [
    { className: 'ps-crayon-artwork__band--upper', opacity: upperOpacity, y: upperY, scale: upperScale },
    { className: 'ps-crayon-artwork__band--middle', opacity: middleOpacity, y: middleY, scale: middleScale },
    { className: 'ps-crayon-artwork__band--lower', opacity: lowerOpacity, y: lowerY, scale: lowerScale },
  ];

  return (
    <div className="ps-crayon-artwork" aria-hidden="true">
      {bands.map((band) => (
        <motion.div
          key={band.className}
          className={`ps-crayon-artwork__band ${band.className}`}
          style={reduceMotion ? undefined : { opacity: band.opacity, y: band.y, scale: band.scale }}
        />
      ))}
    </div>
  );
};

const PrimaryHero = ({ pinned = false }: { pinned?: boolean }) => {
  const reduceMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroContentY = useTransform(scrollYProgress, [0.68, 1], [0, reduceMotion ? 0 : -30]);
  const heroContentOpacity = useTransform(scrollYProgress, [0.72, 1], [1, reduceMotion ? 1 : 0.84]);
  const heroImageY = useTransform(scrollYProgress, [0.62, 1], [0, reduceMotion ? 0 : -15]);
  const heroImageScale = useTransform(scrollYProgress, [0.62, 1], [1, reduceMotion ? 1 : 1.025]);
  const sparkY = useTransform(scrollYProgress, [0.72, 1], [-8, reduceMotion ? -8 : 76]);
  const sparkX = useTransform(scrollYProgress, [0.72, 1], [0, reduceMotion ? 0 : 18]);
  const sparkOpacity = useTransform(scrollYProgress, [0.68, 0.76, 0.96, 1], [0, 0.78, 0.78, 0]);

  const entrance = (delay: number, y = 24) => ({
    initial: reduceMotion ? false : { opacity: 0, y },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduceMotion ? 0 : 0.85, delay, ease: premiumEase },
  });

  return (
    <section ref={heroRef} className="ps-hero" aria-labelledby="primary-title">
      <motion.div className="ps-hero__image-wrap" style={pinned ? undefined : { y: heroImageY, scale: heroImageScale }}>
        <motion.div
          className="ps-hero__image"
          initial={reduceMotion ? false : { scale: 1.03 }}
          animate={{ scale: 1 }}
          transition={{ duration: reduceMotion ? 0 : 1.2, ease: premiumEase }}
        />
      </motion.div>
      <motion.div
        className="ps-hero__veil"
        aria-hidden="true"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduceMotion ? 0 : 1.15, ease: premiumEase }}
      />
      <motion.div className="ps-hero__content" style={pinned ? undefined : { y: heroContentY, opacity: heroContentOpacity }}>
        <motion.p {...entrance(0.08)} className="ps-kicker">Primary School · Years 1–6</motion.p>
        <div className="ps-mobile-progress" aria-label={`Current stage: ${heroJourneyNav[0].label}`}>
          <span><b>{heroJourneyNav[0].number}</b>{heroJourneyNav[0].label}</span>
          <i><b style={{ transform: `scaleX(${1 / heroJourneyNav.length})` }} /></i>
        </div>
        <h1 id="primary-title">
          <motion.span {...entrance(0.18, 28)}>Every Stage.</motion.span>
          <motion.span {...entrance(0.31, 28)} className="ps-hero__gold-line">Every Child.</motion.span>
        </h1>
        <motion.p {...entrance(0.43)} className="ps-hero__intro">
          From strong foundations to lifelong confidence, we guide your child through every critical stage of primary school.
        </motion.p>
        <motion.div {...entrance(0.55)} className="ps-hero__actions">
          <Link className="ps-button ps-button--gold" to="/book-interview">Book a Free Trial Lesson <ArrowRight /></Link>
          <a className="ps-how-link" href="#pathway"><span><Play /></span>How We Teach</a>
        </motion.div>
      </motion.div>
      <motion.span
        className="ps-hero__handoff"
        aria-hidden="true"
        style={pinned ? { opacity: 0 } : { x: sparkX, y: sparkY, opacity: reduceMotion ? 0 : sparkOpacity }}
      />
    </section>
  );
};

const FoundationIntro = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const openingRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const opening = openingRef.current;
    const artwork = section?.querySelector<HTMLElement>('.ps-crayon-artwork');
    if (!section || !opening || !artwork) return;

    const updateDoodleBoundary = () => {
      const boundary = opening.offsetTop + opening.offsetHeight - artwork.offsetTop;
      section.style.setProperty('--ps-foundation-doodle-end', `${Math.max(0, boundary)}px`);
    };

    updateDoodleBoundary();
    const observer = new ResizeObserver(updateDoodleBoundary);
    observer.observe(section);
    observer.observe(opening);
    return () => observer.disconnect();
  }, []);

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
      <motion.article className="ps-foundation-outcome" {...reveal(delay)}>
        <div className="ps-foundation-outcome__meta"><span>{item.number}</span><i><Icon /></i></div>
        <h3>{item.title}</h3>
        <p>{item.body}</p>
      </motion.article>
    );
  };

  return (
    <section ref={sectionRef} id="foundation" className="ps-foundation-intro" aria-labelledby="foundation-title">
      <CrayonArtwork progress={scrollYProgress} reduceMotion={reduceMotion} />
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
            <motion.figure className="ps-foundation-collage__photo ps-foundation-collage__photo--top" {...reveal(0.12)}>
              <img src="/images/community/student_attentive.jpg" alt="A DA Tuition student concentrating on her classwork" />
            </motion.figure>
            <motion.figure className="ps-foundation-collage__photo ps-foundation-collage__photo--right" {...reveal(0.2)}>
              <img src="/images/community/class_smiling_camera.jpg" alt="DA Tuition students learning together in class" />
            </motion.figure>
            <motion.figure className="ps-foundation-collage__photo ps-foundation-collage__photo--bottom" {...reveal(0.28)}>
              <img src="/images/community/teacher_kids_warmth.jpg" alt="A DA Tuition teacher with primary students" />
            </motion.figure>
            <motion.figure className="ps-foundation-collage__photo ps-foundation-collage__photo--circle" {...reveal(0.36)}>
              <img src="/images/community/tutor_young_girls.jpg" alt="Young DA Tuition students enjoying their lesson" />
            </motion.figure>
            <motion.img
              className="ps-foundation-collage__doodles"
              src="/images/programs/primary-years-1-2-features-01-02-doodles.png"
              alt=""
              aria-hidden="true"
              draggable="false"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.985 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.16 }}
              transition={{ duration: 1.15, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>
        <div className="ps-foundation-story__row ps-foundation-story__row--photo-last">
          <div className="ps-foundation-outcomes">
            <Outcome item={outcomes[2]} delay={0.08} />
            <Outcome item={outcomes[3]} delay={0.2} />
          </div>
          <motion.figure className="ps-foundation-photo ps-foundation-photo--class" {...reveal(0.1)}>
            <img src="/images/community/primary_colorful_class.jpg" alt="Primary students actively learning together in a DA Tuition classroom" />
          </motion.figure>
          <motion.img
            className="ps-foundation-story__doodle-overlay"
            src="/images/programs/primary-years-1-2-features-03-04-doodles.png"
            alt=""
            aria-hidden="true"
            draggable="false"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ amount: 0.16 }}
            transition={{ duration: reduceMotion ? 0 : 0.9, delay: 0.08, ease: premiumEase }}
          />
        </div>
        <div className="ps-foundation-curriculum">
          <motion.img
            className="ps-foundation-curriculum__doodles"
            src="/images/programs/primary-years-1-2-curriculum-doodles.png"
            alt=""
            aria-hidden="true"
            draggable="false"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.985 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ amount: 0.16 }}
            transition={{ duration: reduceMotion ? 0 : 0.9, ease: premiumEase }}
          />
          <span className="ps-foundation-curriculum__watermark" aria-hidden="true">Y1–2</span>
          <motion.div className="ps-foundation-curriculum__intro" {...reveal()}>
            <h3>Explore what<br /><em>they’ll learn.</em></h3>
          </motion.div>
          <motion.div className="ps-foundation-curriculum__heading" {...reveal(0.1)}>
            <span>Years 1–2</span>
            <h3>Curriculum</h3>
            <p>Our teaching is aligned to the NSW Curriculum and adapted to the student’s current level.</p>
          </motion.div>
          <motion.figure className="ps-foundation-curriculum__photo" {...reveal(0.2)}>
            <img src="/images/community/tutor_one_on_one.jpg" alt="A young primary student working through an activity with her tutor" />
          </motion.figure>
          <div className="ps-foundation-curriculum__journey">
            <motion.article className="ps-foundation-curriculum__stage ps-foundation-curriculum__stage--read" {...reveal(0.18)}>
              <span>01</span><div><h4>Read</h4><p>Phonics, decoding<br />and reading fluency</p></div>
            </motion.article>
            <motion.article className="ps-foundation-curriculum__stage ps-foundation-curriculum__stage--write" {...reveal(0.3)}>
              <span>02</span><div><h4>Write</h4><p>Sentence construction,<br />handwriting and vocabulary</p></div>
            </motion.article>
            <motion.article className="ps-foundation-curriculum__stage ps-foundation-curriculum__stage--think" {...reveal(0.42)}>
              <span>03</span><div><h4>Think</h4><p>Number sense,<br />place value and<br />mathematical reasoning</p></div>
            </motion.article>
          </div>
        </div>
      </div>
    </section>
  );
};

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
      <div className="ps-growth__doodles" aria-hidden="true" />
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

        <div className="ps-growth__divider" aria-hidden="true"><span><Star /></span></div>

        <div className="ps-growth-curriculum">
          <motion.div className="ps-growth-curriculum__intro" {...reveal(0, 30)}>
            <h3>Explore what<br /><em>they’ll master next.</em></h3>
            <span aria-hidden="true">↝</span>
          </motion.div>
          <motion.div className="ps-growth-curriculum__panel" {...reveal(0.14, 36)}>
            <h3>Years 3–4 curriculum</h3>
            <p>Our teaching is aligned to the NSW Curriculum and adapted to the student’s current level.</p>
            <ul>
              <li><Check />Reading to learn through comprehension and inference</li>
              <li><Check />Narrative and informative writing with language conventions</li>
              <li><Check />NAPLAN-aligned numeracy, data and multi-step problem solving</li>
            </ul>
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
      <div className="ps-mastery__doodles" aria-hidden="true" />
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

        <div className="ps-mastery__divider" aria-hidden="true"><span><Star /></span></div>

        <div className="ps-mastery-curriculum">
          <motion.div className="ps-mastery-curriculum__intro" {...reveal(0, 30)}>
            <h3>Preparing them<br /><em>for the next chapter.</em></h3>
            <span aria-hidden="true">↝</span>
          </motion.div>
          <motion.div className="ps-mastery-curriculum__panel" {...reveal(0.14, 36)}>
            <h3>Years 5–6 curriculum</h3>
            <p>Our teaching is aligned to the NSW Curriculum and adapted to the student’s current level.</p>
            <ul>
              <li><Check />Persuasive and narrative writing at a high level</li>
              <li><Check />Selective-school reasoning, speed and accuracy</li>
              <li><Check />Independent study habits, organisation and Year 7 preparation</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const PrimarySchool = () => (
  <div className="primary-story">
    <SEO title="Primary School Tutoring (Years 1–6) | DA Tuition" description="One continuous primary learning journey from strong foundations to NAPLAN confidence, selective school preparation and high school readiness." canonicalUrl="/programs/primary-school" />
    <NavigationNew />
    <StickyBookButton />
    <main>
      <div className="ps-opening">
        <div className="ps-opening__hero">
          <PrimaryHero pinned />
        </div>
      </div>
      <section id="pathway" className="ps-landscape-breath" aria-label="Primary school journey landscape">
        <img
          className="ps-landscape-breath__image"
          src="/images/programs/primary-school-staircase-landscape-v3.png"
          alt="Two primary school students looking across a bright landscape beside a flower-lined stone staircase"
        />
        <div className="ps-landscape-breath__copy">
          <p>Primary School Pathway</p>
          <h2>A Clear Path<br />Through Every Stage.</h2>
          <div className="ps-landscape-breath__rule" aria-hidden="true" />
          <span>From strong foundations to growing independence, every stage is designed to help your child move forward with confidence.</span>
          <a href="#foundation">Explore the Journey <ArrowRight /></a>
        </div>
        <div className="ps-landscape-breath__stages" aria-hidden="true">
          <div className="ps-landscape-stage ps-landscape-stage--foundation"><small>Years 1–2</small><strong>Foundation</strong></div>
          <div className="ps-landscape-stage ps-landscape-stage--growth"><small>Years 3–4</small><strong>Growth</strong></div>
          <div className="ps-landscape-stage ps-landscape-stage--mastery"><small>Years 5–6</small><strong>Mastery</strong></div>
        </div>
        <nav className="ps-landscape-breath__year-nav" aria-label="Primary school year groups">
          <a className="is-active" href="#foundation" aria-label="Go to Years 1–2">1–2</a>
          <a href="#growth" aria-label="Go to Years 3–4">3–4</a>
          <a href="#mastery" aria-label="Go to Years 5–6">5–6</a>
        </nav>
        <div className="ps-landscape-transition" aria-hidden="true" />
      </section>
      <FoundationIntro />
      <GrowthSection />
      <MasterySection />
    </main>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&display=swap');
      .primary-story{--navy:#06172c;--gold:#c8932f;--gold-light:#e1b453;--cream:#f6efe4;background:var(--cream);color:var(--navy);overflow:clip;font-family:"DM Sans",Arial,sans-serif}.primary-story *{box-sizing:border-box}.primary-story h1{font-family:"Cormorant Garamond",Georgia,serif}.ps-kicker{margin:0;color:var(--gold-light);font-size:.72rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase}.ps-button{display:inline-flex;min-height:3.35rem;align-items:center;justify-content:center;gap:.75rem;padding:0 1.45rem;border-radius:.7rem;font-size:.78rem;font-weight:700;text-decoration:none;transition:transform .3s cubic-bezier(.22,1,.36,1),background .3s ease,box-shadow .3s ease}.ps-button svg{width:1rem;transition:transform .3s ease}.ps-button:hover{transform:translateY(-2px)}.ps-button:hover svg{transform:translateX(4px)}.ps-button:focus-visible,.ps-how-link:focus-visible{outline:2px solid var(--gold-light);outline-offset:4px}.ps-button--gold{background:#d8a642;box-shadow:0 6px 8px rgba(6,23,44,.2);color:var(--navy)}.ps-button--gold:hover{background:#e3b95b}
      .ps-opening{--ps-nav-height:3.625rem;position:relative;width:100vw;max-width:none;margin:0;padding-top:var(--ps-nav-height);background:#edf6f8}.ps-opening__hero{position:relative;width:100%;max-width:none;height:calc(100svh - var(--ps-nav-height));margin:0;overflow:hidden}.ps-opening__hero .ps-hero{width:100%;max-width:none;height:100%;min-height:0;margin:0}.ps-hero{position:relative;z-index:0;display:flex;min-height:max(680px,calc(100svh - 5rem));align-items:center;overflow:hidden;background:#071629;color:#fff}.ps-hero__image-wrap,.ps-hero__veil{position:absolute;inset:-16px 0}.ps-hero__image-wrap{inset:-26px;max-width:none;will-change:transform}.ps-hero__image{position:absolute;inset:0;background:url('/images/programs/primary-hero-tutor-two-students.png') center/cover no-repeat;filter:brightness(.98) contrast(1.03) saturate(1.03);will-change:transform}.ps-hero__veil{background:linear-gradient(90deg,rgba(4,22,40,.88) 0%,rgba(4,22,40,.72) 30%,rgba(4,22,40,.38) 55%,rgba(4,22,40,.1) 78%,rgba(4,22,40,.02) 100%);pointer-events:none}.ps-hero__content{position:relative;z-index:2;width:min(1220px,calc(100% - 64px));margin:0 auto;padding:0;will-change:transform,opacity}.ps-hero .ps-kicker{display:inline-flex;align-items:center;gap:.625rem;margin:0 0 1.25rem;color:#f2df9d;font-size:.75rem;font-weight:800;letter-spacing:.18em}.ps-hero .ps-kicker:before{width:1.75rem;height:2px;background:#c9a227;content:""}.ps-hero h1{max-width:47.5rem;margin:0 0 1.75rem;color:#fff8eb;font-family:"Playfair Display",Georgia,serif;font-size:clamp(3.4rem,7vw,6.6rem);font-weight:600;letter-spacing:-.01em;line-height:.94}.ps-hero h1 span{display:block}.ps-hero h1 span+span{margin-top:0}.ps-hero__gold-line{color:#c9a227;font-style:normal}.ps-hero__intro{max-width:54ch;margin:0 0 1.875rem;color:rgba(255,255,255,.86);font-size:1.125rem;line-height:1.75;text-wrap:pretty}.ps-hero__actions{display:flex;flex-wrap:wrap;align-items:center;gap:.875rem;margin-top:0}.ps-hero .ps-button,.ps-hero .ps-how-link{display:inline-flex;height:3.125rem;min-height:3.125rem;align-items:center;justify-content:center;padding:0 1.5rem;border-radius:999px;font-size:.8rem;font-weight:800;text-decoration:none}.ps-hero .ps-button--gold{background:#c9a227;box-shadow:0 8px 18px rgba(201,162,39,.2);color:#071629}.ps-hero .ps-button--gold:hover{background:#d8b543}.ps-hero .ps-how-link{gap:.55rem;border:1px solid rgba(255,255,255,.3);color:#fff}.ps-hero .ps-how-link span{display:grid;width:1.35rem;height:1.35rem;place-items:center;border:0;color:#f2df9d}.ps-hero .ps-how-link svg{width:.72rem;fill:currentColor}.ps-hero .ps-how-link:hover{border-color:rgba(242,223,157,.72);background:rgba(255,255,255,.06);transform:translateY(-2px)}.ps-hero__handoff{position:absolute;z-index:4;bottom:24px;left:72%;width:7px;height:7px;border-radius:50%;background:#f2c96f;box-shadow:0 0 7px rgba(241,190,77,.9),0 0 16px rgba(241,190,77,.45);pointer-events:none;will-change:transform,opacity}.ps-hero__handoff:after{position:absolute;top:-20px;left:3px;width:1px;height:24px;background:linear-gradient(transparent,rgba(241,190,77,.65));content:""}.ps-mobile-progress{display:none}.ps-opening__hero .ps-hero:after{position:absolute;z-index:1;right:0;bottom:-1px;left:0;height:clamp(10rem,28%,18rem);background:linear-gradient(180deg,rgba(6,23,42,0) 0%,rgba(6,23,42,.035) 18%,rgba(6,23,42,.12) 38%,rgba(6,23,42,.3) 58%,rgba(6,23,42,.62) 79%,#06172a 100%);content:"";pointer-events:none}.ps-landscape-breath{position:relative;display:grid;width:100%;min-height:100vh;height:100svh;place-items:center;overflow:hidden;background:#8bcaf0;isolation:isolate}.ps-landscape-breath__ambient{position:absolute;z-index:0;inset:-4%;background:url('/images/programs/primary-school-staircase-landscape.png') center/cover no-repeat;filter:blur(26px) saturate(.92);opacity:.46;transform:scale(1.05)}.ps-landscape-breath__image{position:absolute;z-index:1;inset:0;display:block;width:100%;height:100%!important;object-fit:contain;object-position:center}.ps-landscape-breath__copy{position:absolute;z-index:3;top:17%;left:clamp(2.5rem,7vw,7rem);width:min(45vw,43rem);color:#0b2743;text-shadow:0 1px 0 rgba(255,255,255,.25)}.ps-landscape-breath__copy>p{margin:0 0 clamp(1rem,2vh,1.35rem);color:#9b6818;font-size:clamp(.68rem,.82vw,.82rem);font-weight:750;letter-spacing:.2em;text-transform:uppercase}.ps-landscape-breath__copy h2{margin:0;font-family:"Cormorant Garamond",Georgia,serif;font-size:clamp(3.4rem,5.2vw,5.3rem);font-weight:500;letter-spacing:-.035em;line-height:.92;text-wrap:balance}.ps-landscape-breath__rule{width:clamp(3.5rem,5vw,5rem);height:1px;margin:clamp(1.35rem,2.7vh,1.8rem) 0;background:rgba(155,104,24,.72)}.ps-landscape-breath__copy>span{display:block;max-width:31rem;color:#24415a;font-size:clamp(.9rem,1.1vw,1.08rem);line-height:1.65;text-wrap:pretty}.ps-landscape-breath__copy>a{display:inline-flex;align-items:center;gap:.65rem;margin-top:clamp(1.35rem,2.7vh,1.8rem);border-bottom:1px solid rgba(11,39,67,.55);padding-bottom:.3rem;color:#0b2743;font-size:.78rem;font-weight:750;text-decoration:none}.ps-landscape-breath__copy>a svg{width:.95rem;transition:transform .3s cubic-bezier(.22,1,.36,1)}.ps-landscape-breath__copy>a:hover svg{transform:translateX(4px)}.ps-landscape-breath__stages{position:absolute;z-index:3;inset:0;pointer-events:none}.ps-landscape-stage{position:absolute;width:clamp(7.5rem,12vw,12rem);translate:-50% -50%;color:#172b40;text-align:center;text-shadow:0 1px 0 rgba(255,255,255,.42)}.ps-landscape-stage small,.ps-landscape-stage strong{display:block;text-transform:uppercase}.ps-landscape-stage small{font-size:clamp(.5rem,.65vw,.68rem);font-weight:750;letter-spacing:.16em}.ps-landscape-stage strong{margin-top:.16rem;font:600 clamp(1.05rem,1.7vw,1.8rem)/.95 "Cormorant Garamond",Georgia,serif;letter-spacing:.01em}.ps-landscape-stage--foundation{top:81.5%;left:61%}.ps-landscape-stage--growth{top:66%;left:70.5%}.ps-landscape-stage--mastery{top:51.5%;left:79.5%}.ps-landscape-breath__year-nav{position:absolute;z-index:4;top:22%;right:clamp(1.25rem,3vw,3.5rem);display:grid;gap:clamp(.7rem,1.5vh,1rem)}.ps-landscape-breath__year-nav a{display:grid;width:clamp(2.5rem,3vw,2.9rem);height:clamp(2.5rem,3vw,2.9rem);place-items:center;border-radius:50%;background:rgba(255,250,239,.92);box-shadow:0 4px 8px rgba(7,31,52,.15);color:#17304a;font-size:.62rem;font-weight:750;text-decoration:none;transition:transform .25s ease,background .25s ease}.ps-landscape-breath__year-nav a:hover{transform:translateY(-2px)}.ps-landscape-breath__year-nav a.is-active{background:#d8aa4e;color:#09213a}
      .ps-landscape-breath{display:block;width:100vw;max-width:none;min-height:0;height:auto;margin:0;padding:0;overflow:visible;isolation:auto;background:none}.ps-landscape-breath__image{position:relative;inset:auto;display:block;width:100%;height:auto!important;max-width:none;object-fit:contain}
      .ps-landscape-transition{position:absolute;z-index:5;top:calc(100% - 1px);right:0;left:0;height:clamp(250px,28vw,400px);transform:scaleY(-1);transform-origin:center;background:url('/images/programs/primary-school-staircase-landscape-v3.png') center bottom/100vw auto no-repeat;pointer-events:none;-webkit-mask-image:radial-gradient(ellipse 140% 130% at 50% 125%,#000 0%,#000 42%,rgba(0,0,0,.92) 50%,rgba(0,0,0,.66) 62%,rgba(0,0,0,.34) 75%,rgba(0,0,0,.12) 86%,transparent 94%);mask-image:radial-gradient(ellipse 140% 130% at 50% 125%,#000 0%,#000 42%,rgba(0,0,0,.92) 50%,rgba(0,0,0,.66) 62%,rgba(0,0,0,.34) 75%,rgba(0,0,0,.12) 86%,transparent 94%)}
      .ps-foundation-intro{position:relative;display:block;width:100%;min-height:100vh;margin:0;padding:calc(clamp(250px,28vw,400px) + clamp(40px,4vw,60px)) 1.5rem clamp(8rem,18vh,13rem);overflow:hidden;background:#f7f0e3;color:#06172b}.ps-foundation-intro__content{position:relative;z-index:6;width:min(100%,46rem);margin:0 auto;text-align:center}.ps-foundation-intro__number,.ps-foundation-intro__years,.ps-foundation-intro__support{margin:0}.ps-foundation-intro__number{color:#d8aa4e;font-family:"Cormorant Garamond",Georgia,serif;font-size:clamp(1.55rem,2.2vw,2rem);line-height:1}.ps-foundation-intro__years{margin-top:.65rem;color:rgba(6,23,43,.82);font-size:.7rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase}.ps-foundation-intro__divider{display:block;width:4.75rem;height:1px;margin:1rem auto 1.75rem;background:rgba(200,147,47,.76)}.ps-foundation-intro h2{margin:0;color:#06172b;font-family:"Cormorant Garamond",Georgia,serif;font-size:clamp(3.25rem,5.4vw,5.75rem);font-weight:500;letter-spacing:-.035em;line-height:.89;text-wrap:balance}.ps-foundation-intro h2 em{color:#d8aa4e;font-weight:500}.ps-foundation-intro__detail{display:block;width:3.25rem;height:1px;margin:2rem auto 1.75rem;background:rgba(200,147,47,.76)}.ps-foundation-intro__support{max-width:31rem;margin:0 auto;color:rgba(6,23,43,.7);font-size:clamp(.88rem,1.1vw,1rem);line-height:1.7;text-wrap:pretty}
      .ps-foundation-story{position:relative;z-index:6;width:min(100%,76rem);margin:clamp(5rem,7vw,7.5rem) auto 0}.ps-foundation-story__row{position:relative;display:grid;grid-template-columns:minmax(0,1.08fr) minmax(0,.92fr);align-items:center;gap:clamp(3.5rem,7vw,7.5rem);isolation:isolate}.ps-foundation-story__row:before{position:absolute;z-index:-1;inset:-2.5rem -1.5rem;background:#f7f0e3;content:"";pointer-events:none}.ps-foundation-story__row+.ps-foundation-story__row{margin-top:clamp(8rem,14vw,12rem)}.ps-foundation-story__row--photo-last{grid-template-columns:minmax(0,.92fr) minmax(0,1.08fr)}.ps-foundation-photo{position:relative;min-height:clamp(24rem,39vw,34rem);margin:0;overflow:hidden;background:#eadfca;clip-path:polygon(4% 1%,92% 0,100% 9%,98% 91%,90% 100%,7% 98%,0 90%,1% 8%)}.ps-foundation-photo--class{min-height:clamp(25rem,42vw,36rem);clip-path:polygon(8% 0,96% 3%,100% 12%,98% 94%,89% 100%,3% 96%,0 85%,2% 7%)}.ps-foundation-photo img{display:block;width:100%;height:100%;min-height:inherit;object-fit:cover}.ps-foundation-photo--tutor img{object-position:48% center}.ps-foundation-photo--class img{object-position:56% center}.ps-foundation-outcomes{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0}.ps-foundation-outcome{min-width:0;padding:1.25rem clamp(1rem,2vw,2rem) 1.75rem 0}.ps-foundation-outcome+.ps-foundation-outcome{border-left:1px solid rgba(200,147,47,.24);padding-right:0;padding-left:clamp(1.5rem,2.5vw,2.5rem)}.ps-foundation-outcome__meta{display:flex;align-items:center;justify-content:space-between;gap:1rem;margin-bottom:1.5rem}.ps-foundation-outcome__meta>span{color:#bd8725;font-size:.66rem;font-weight:800;letter-spacing:.16em}.ps-foundation-outcome__meta i{display:grid;width:3.4rem;height:3.4rem;place-items:center;border-radius:50%;background:rgba(216,170,78,.1);color:#bd8725}.ps-foundation-outcome__meta svg{width:1.45rem;height:1.45rem;stroke-width:1.45}.ps-foundation-outcome h3{margin:0;color:#06172b;font-family:"Cormorant Garamond",Georgia,serif;font-size:clamp(1.75rem,2.25vw,2.3rem);font-weight:600;letter-spacing:-.025em;line-height:1.04;text-wrap:balance}.ps-foundation-outcome p{margin:1.15rem 0 0;color:rgba(6,23,43,.68);font-size:clamp(.84rem,1vw,.96rem);line-height:1.72;text-wrap:pretty}.ps-foundation-curriculum{display:grid;grid-template-columns:minmax(15rem,.62fr) minmax(0,1.38fr);align-items:center;gap:clamp(3rem,7vw,7rem);margin-top:clamp(9rem,16vw,14rem)}.ps-foundation-curriculum__intro h3,.ps-foundation-curriculum__panel h3{margin:0;color:#06172b;font-family:"Cormorant Garamond",Georgia,serif}.ps-foundation-curriculum__intro h3{font-size:clamp(2.8rem,4.6vw,4.8rem);font-weight:500;letter-spacing:-.035em;line-height:.92}.ps-foundation-curriculum__intro h3 em{display:inline-block;color:#c8932f;font-weight:500}.ps-foundation-curriculum__intro>span{display:block;margin:1.4rem 0 0 5.5rem;color:#65a6c5;font-family:"Cormorant Garamond",Georgia,serif;font-size:3.25rem;line-height:1;transform:rotate(14deg)}.ps-foundation-curriculum__panel{border:1px solid rgba(200,147,47,.34);border-radius:1rem;padding:clamp(2rem,4vw,3.75rem);background:rgba(255,252,246,.38)}.ps-foundation-curriculum__panel h3{font-size:clamp(2rem,3vw,3rem);font-weight:600;letter-spacing:-.025em}.ps-foundation-curriculum__panel>p{max-width:44rem;margin:.8rem 0 1.65rem;color:rgba(6,23,43,.68);font-size:.94rem;line-height:1.65}.ps-foundation-curriculum__panel ul{display:grid;gap:.95rem;margin:0;border-top:1px solid rgba(200,147,47,.24);padding:1.45rem 0 0;list-style:none}.ps-foundation-curriculum__panel li{display:flex;align-items:flex-start;gap:.85rem;color:rgba(6,23,43,.76);font-size:.9rem;line-height:1.55}.ps-foundation-curriculum__panel li svg{flex:0 0 auto;width:1.05rem;margin-top:.15rem;color:#c8932f;stroke-width:1.8}
      .ps-crayon-artwork{position:absolute;z-index:2;top:calc(clamp(250px,28vw,400px) + 1rem);right:0;bottom:0;left:0;overflow:hidden;pointer-events:none}.ps-crayon-artwork__band{position:absolute;right:0;left:0;height:38%;background-image:url('/images/programs/primary-years-1-2-crayon-doodles.png');background-size:min(100vw,1536px) auto;background-repeat:no-repeat;transform-origin:center;will-change:transform,opacity;-webkit-mask-image:linear-gradient(90deg,#000 0%,#000 18%,transparent 25%,transparent 75%,#000 82%,#000 100%);mask-image:linear-gradient(90deg,#000 0%,#000 18%,transparent 25%,transparent 75%,#000 82%,#000 100%)}.ps-crayon-artwork__band--upper{top:1%;background-position:center top}.ps-crayon-artwork__band--middle{top:32%;background-position:center center}.ps-crayon-artwork__band--lower{top:63%;background-position:center bottom}
      .ps-growth{position:relative;width:100%;margin:0;padding:clamp(7rem,12vw,11rem) 1.5rem clamp(9rem,15vw,14rem);overflow:hidden;background:#f7f0e3;color:#06172b}.ps-growth__inner{position:relative;z-index:3;width:min(100%,82rem);margin:0 auto}.ps-growth__intro{width:min(100%,54rem);margin:0 auto;text-align:center}.ps-growth__number,.ps-growth__years,.ps-growth__lead{margin:0}.ps-growth__number{color:#718b55;font-family:"Cormorant Garamond",Georgia,serif;font-size:clamp(2.3rem,3.5vw,3.5rem);font-weight:600;line-height:1}.ps-growth__years{margin-top:.85rem;color:#718b55;font-size:.78rem;font-weight:800;letter-spacing:.2em;text-transform:uppercase}.ps-growth__rule{display:block;width:5.5rem;height:1px;margin:1.25rem auto 1.9rem;background:rgba(113,139,85,.68)}.ps-growth__intro h2{margin:0;color:#06172b;font-family:"Cormorant Garamond",Georgia,serif;font-size:clamp(3.5rem,6vw,6rem);font-weight:500;letter-spacing:-.038em;line-height:.92;text-wrap:balance}.ps-growth__intro h2 em{color:#718b55;font-weight:500}.ps-growth__lead{max-width:43rem;margin:2.25rem auto 0;color:rgba(6,23,43,.72);font-size:clamp(1rem,1.35vw,1.16rem);line-height:1.75;text-wrap:pretty}.ps-growth__main{display:grid;grid-template-columns:minmax(13rem,.8fr) minmax(22rem,1.45fr) minmax(13rem,.8fr);grid-template-rows:repeat(2,minmax(0,1fr));align-items:center;column-gap:clamp(2rem,4vw,4.5rem);row-gap:clamp(3rem,5vw,5rem);margin-top:clamp(6.5rem,10vw,9rem)}.ps-growth__photo{grid-column:2;grid-row:1/3;align-self:stretch;min-height:clamp(40rem,57vw,52rem);margin:0;overflow:hidden;background:#e6eadf;clip-path:polygon(7% 1%,91% 0,98% 6%,100% 91%,94% 99%,8% 100%,1% 94%,0 8%)}.ps-growth__photo img{display:block;width:100%;height:100%;object-fit:cover;object-position:46% center}.ps-growth-outcome{max-width:18rem;margin:auto;text-align:center}.ps-growth-outcome--one{grid-column:1;grid-row:1}.ps-growth-outcome--two{grid-column:3;grid-row:1}.ps-growth-outcome--three{grid-column:1;grid-row:2}.ps-growth-outcome--four{grid-column:3;grid-row:2}.ps-growth-outcome__icon{display:grid;width:5.25rem;height:5.25rem;margin:0 auto 1rem;place-items:center;border-radius:50%;background:rgba(113,139,85,.1);color:#718b55}.ps-growth-outcome__icon svg{width:2.4rem;height:2.4rem;stroke-width:1.35}.ps-growth-outcome>span{display:block;color:#718b55;font-family:"Cormorant Garamond",Georgia,serif;font-size:1.25rem;font-weight:700}.ps-growth-outcome h3{margin:.55rem 0 0;color:#06172b;font-family:"Cormorant Garamond",Georgia,serif;font-size:clamp(1.55rem,2vw,2rem);font-weight:600;letter-spacing:-.02em;line-height:1.05;text-wrap:balance}.ps-growth-outcome>i{display:block;width:2rem;height:1px;margin:1.25rem auto;background:rgba(113,139,85,.72)}.ps-growth-outcome p{margin:0;color:rgba(6,23,43,.7);font-size:.88rem;line-height:1.68;text-wrap:pretty}.ps-growth__divider{display:flex;align-items:center;gap:2rem;margin:clamp(7rem,11vw,10rem) 0 0;color:#718b55}.ps-growth__divider:before,.ps-growth__divider:after{height:1px;flex:1;background:rgba(113,139,85,.45);content:""}.ps-growth__divider span{display:grid;width:2rem;height:2rem;place-items:center}.ps-growth__divider svg{width:1.5rem;fill:currentColor;stroke-width:1}.ps-growth-curriculum{display:grid;grid-template-columns:minmax(17rem,.68fr) minmax(0,1.32fr);align-items:center;gap:clamp(3.5rem,8vw,8rem);margin-top:clamp(4rem,7vw,6rem)}.ps-growth-curriculum__intro h3,.ps-growth-curriculum__panel h3{margin:0;font-family:"Cormorant Garamond",Georgia,serif}.ps-growth-curriculum__intro h3{color:#06172b;font-size:clamp(3rem,4.8vw,5rem);font-weight:500;letter-spacing:-.038em;line-height:.91}.ps-growth-curriculum__intro h3 em{display:inline-block;color:#718b55;font-weight:500}.ps-growth-curriculum__intro>span{display:block;margin:1.5rem 0 0 6rem;color:#65a6c5;font-family:"Cormorant Garamond",Georgia,serif;font-size:3.4rem;line-height:1;transform:rotate(13deg)}.ps-growth-curriculum__panel{border:1px solid rgba(113,139,85,.38);border-radius:1rem;padding:clamp(2.25rem,4vw,4rem);background:rgba(225,233,216,.18)}.ps-growth-curriculum__panel h3{color:#06172b;font-size:clamp(2.1rem,3vw,3rem);font-weight:600;letter-spacing:-.025em}.ps-growth-curriculum__panel>p{max-width:44rem;margin:.85rem 0 1.75rem;color:rgba(6,23,43,.68);font-size:.94rem;line-height:1.65}.ps-growth-curriculum__panel ul{display:grid;gap:1rem;margin:0;border-top:1px solid rgba(113,139,85,.3);padding:1.55rem 0 0;list-style:none}.ps-growth-curriculum__panel li{display:flex;align-items:flex-start;gap:.9rem;color:rgba(6,23,43,.76);font-size:.9rem;line-height:1.55}.ps-growth-curriculum__panel li svg{flex:0 0 auto;width:1.05rem;margin-top:.15rem;color:#718b55;stroke-width:2}.ps-growth__doodles{position:absolute;z-index:1;inset:2rem 0 auto;height:min(72rem,58%);background:url('/images/programs/primary-years-1-2-crayon-doodles.png') center top/min(100vw,1536px) auto no-repeat;filter:hue-rotate(22deg) saturate(.72);opacity:.24;pointer-events:none;-webkit-mask-image:linear-gradient(90deg,#000 0%,#000 14%,transparent 24%,transparent 76%,#000 86%,#000 100%);mask-image:linear-gradient(90deg,#000 0%,#000 14%,transparent 24%,transparent 76%,#000 86%,#000 100%)}
      .ps-mastery{position:relative;width:100%;margin:0;padding:clamp(7rem,12vw,11rem) 1.5rem clamp(10rem,16vw,15rem);overflow:hidden;background:#f7f0e3;color:#06172b}.ps-mastery__inner{position:relative;z-index:3;width:min(100%,82rem);margin:0 auto}.ps-mastery__intro{width:min(100%,56rem);margin:0 auto;text-align:center}.ps-mastery__number,.ps-mastery__years,.ps-mastery__lead{margin:0}.ps-mastery__number{color:#1f6096;font-family:"Cormorant Garamond",Georgia,serif;font-size:clamp(2.3rem,3.5vw,3.5rem);font-weight:600;line-height:1}.ps-mastery__years{margin-top:.85rem;color:#1f6096;font-size:.78rem;font-weight:800;letter-spacing:.2em;text-transform:uppercase}.ps-mastery__rule{display:block;width:5.5rem;height:1px;margin:1.25rem auto 1.9rem;background:rgba(31,96,150,.62)}.ps-mastery__intro h2{margin:0;color:#06172b;font-family:"Cormorant Garamond",Georgia,serif;font-size:clamp(3.7rem,6.3vw,6rem);font-weight:500;letter-spacing:-.038em;line-height:.91;text-wrap:balance}.ps-mastery__intro h2 em{color:#1f6096;font-weight:500}.ps-mastery__lead{max-width:47rem;margin:2.25rem auto 0;color:rgba(6,23,43,.72);font-size:clamp(1rem,1.35vw,1.16rem);line-height:1.75;text-wrap:pretty}.ps-mastery__photo{width:100%;min-height:clamp(30rem,48vw,43rem);margin:clamp(5.5rem,9vw,8rem) 0 0;overflow:hidden;background:#e3e9ed;clip-path:polygon(4% 3%,12% 0,46% 1%,55% 0,91% 2%,98% 8%,100% 88%,96% 97%,84% 100%,52% 98%,37% 100%,8% 97%,1% 91%,0 13%)}.ps-mastery__photo img{display:block;width:100%;height:100%;min-height:inherit;object-fit:cover;object-position:center 48%}.ps-mastery__outcomes{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));margin-top:clamp(3.5rem,6vw,5.5rem)}.ps-mastery-outcome{position:relative;min-width:0;padding:0 clamp(1.25rem,2.4vw,2.4rem);text-align:center}.ps-mastery-outcome:first-child{padding-left:0}.ps-mastery-outcome:last-child{padding-right:0}.ps-mastery-outcome+.ps-mastery-outcome{border-left:1px solid rgba(31,96,150,.22)}.ps-mastery-outcome>span{display:block;color:#1f6096;font-family:"Cormorant Garamond",Georgia,serif;font-size:1.2rem;font-weight:700}.ps-mastery-outcome__icon{display:grid;width:4.8rem;height:4.8rem;margin:.75rem auto 1.2rem;place-items:center;border-radius:50%;background:rgba(74,139,187,.09);color:#1f6096}.ps-mastery-outcome__icon svg{width:2.25rem;height:2.25rem;stroke-width:1.4}.ps-mastery-outcome h3{margin:0;color:#06172b;font-family:"Cormorant Garamond",Georgia,serif;font-size:clamp(1.5rem,1.9vw,1.95rem);font-weight:600;letter-spacing:-.02em;line-height:1.06;text-wrap:balance}.ps-mastery-outcome>i{display:block;width:2rem;height:1px;margin:1.2rem auto;background:rgba(31,96,150,.55)}.ps-mastery-outcome p{margin:0;color:rgba(6,23,43,.7);font-size:.86rem;line-height:1.68;text-wrap:pretty}.ps-mastery__divider{display:flex;align-items:center;gap:2rem;margin:clamp(6.5rem,10vw,9rem) 0 0;color:#1f6096}.ps-mastery__divider:before,.ps-mastery__divider:after{height:1px;flex:1;background:rgba(31,96,150,.4);content:""}.ps-mastery__divider span{display:grid;width:2rem;height:2rem;place-items:center}.ps-mastery__divider svg{width:1.5rem;fill:currentColor;stroke-width:1}.ps-mastery-curriculum{display:grid;grid-template-columns:minmax(18rem,.7fr) minmax(0,1.3fr);align-items:center;gap:clamp(3.5rem,8vw,8rem);margin-top:clamp(4rem,7vw,6rem)}.ps-mastery-curriculum__intro h3,.ps-mastery-curriculum__panel h3{margin:0;font-family:"Cormorant Garamond",Georgia,serif}.ps-mastery-curriculum__intro h3{color:#06172b;font-size:clamp(3rem,4.8vw,5rem);font-weight:500;letter-spacing:-.038em;line-height:.91}.ps-mastery-curriculum__intro h3 em{display:inline-block;color:#1f6096;font-weight:500}.ps-mastery-curriculum__intro>span{display:block;margin:1.5rem 0 0 6rem;color:#1f6096;font-family:"Cormorant Garamond",Georgia,serif;font-size:3.4rem;line-height:1;transform:rotate(13deg)}.ps-mastery-curriculum__panel{border:1px solid rgba(31,96,150,.38);border-radius:1rem;padding:clamp(2.25rem,4vw,4rem);background:rgba(213,230,242,.18)}.ps-mastery-curriculum__panel h3{color:#06172b;font-size:clamp(2.1rem,3vw,3rem);font-weight:600;letter-spacing:-.025em}.ps-mastery-curriculum__panel>p{max-width:44rem;margin:.85rem 0 1.75rem;color:rgba(6,23,43,.68);font-size:.94rem;line-height:1.65}.ps-mastery-curriculum__panel ul{display:grid;gap:1rem;margin:0;border-top:1px solid rgba(31,96,150,.28);padding:1.55rem 0 0;list-style:none}.ps-mastery-curriculum__panel li{display:flex;align-items:flex-start;gap:.9rem;color:rgba(6,23,43,.76);font-size:.9rem;line-height:1.55}.ps-mastery-curriculum__panel li svg{flex:0 0 auto;width:1.05rem;margin-top:.15rem;color:#1f6096;stroke-width:2}.ps-mastery__doodles{position:absolute;z-index:1;inset:2rem 0 auto;height:min(68rem,52%);background:url('/images/programs/primary-years-1-2-crayon-doodles.png') center 58%/min(100vw,1536px) auto no-repeat;filter:hue-rotate(145deg) saturate(.56) contrast(.9);opacity:.2;pointer-events:none;-webkit-mask-image:linear-gradient(90deg,#000 0%,#000 13%,transparent 23%,transparent 77%,#000 87%,#000 100%);mask-image:linear-gradient(90deg,#000 0%,#000 13%,transparent 23%,transparent 77%,#000 87%,#000 100%)}
      @supports(height:100dvh){.ps-opening__hero{height:calc(100dvh - var(--ps-nav-height))}}
      @media(max-width:1000px){.ps-growth__main{grid-template-columns:minmax(11rem,.78fr) minmax(20rem,1.3fr) minmax(11rem,.78fr);column-gap:1.5rem}.ps-growth__photo{min-height:42rem}.ps-growth-outcome__icon{width:4.5rem;height:4.5rem}.ps-growth-outcome__icon svg{width:2rem;height:2rem}.ps-growth-curriculum{grid-template-columns:minmax(14rem,.55fr) minmax(0,1.45fr);gap:3rem}}
      @media(max-width:1000px){.ps-mastery__outcomes{grid-template-columns:repeat(2,minmax(0,1fr));row-gap:4rem}.ps-mastery-outcome:nth-child(3){border-left:0}.ps-mastery-curriculum{grid-template-columns:minmax(15rem,.58fr) minmax(0,1.42fr);gap:3rem}}
      @media(max-width:900px){.ps-foundation-story__row{gap:2.5rem}.ps-foundation-outcomes{grid-template-columns:1fr}.ps-foundation-outcome{padding:1.25rem 0 1.75rem}.ps-foundation-outcome+.ps-foundation-outcome{border-top:1px solid rgba(200,147,47,.24);border-left:0;padding:1.75rem 0}.ps-foundation-photo{min-height:28rem}.ps-foundation-curriculum{grid-template-columns:minmax(12rem,.5fr) minmax(0,1.5fr);gap:2.5rem}.ps-crayon-artwork__band{height:36%;background-size:clamp(760px,132vw,1100px) auto;-webkit-mask-image:linear-gradient(90deg,#000 0%,#000 14%,transparent 22%,transparent 78%,#000 86%,#000 100%);mask-image:linear-gradient(90deg,#000 0%,#000 14%,transparent 22%,transparent 78%,#000 86%,#000 100%)}.ps-crayon-artwork__band--middle{opacity:.52}.ps-crayon-artwork__band--lower{top:65%}}
      @media(max-width:720px){.ps-foundation-story{margin-top:7rem}.ps-foundation-story__row,.ps-foundation-story__row--photo-last{grid-template-columns:1fr;gap:3.5rem}.ps-foundation-story__row+.ps-foundation-story__row{margin-top:7rem}.ps-foundation-story__row--photo-last .ps-foundation-photo{order:-1}.ps-foundation-photo,.ps-foundation-photo--class{min-height:0;aspect-ratio:4/3}.ps-foundation-outcomes{grid-template-columns:1fr}.ps-foundation-curriculum{grid-template-columns:1fr;gap:3rem;margin-top:8rem}.ps-foundation-curriculum__intro{max-width:25rem}.ps-foundation-curriculum__panel{padding:1.75rem}.ps-foundation-curriculum__intro>span{margin-left:3.5rem}}
      @media(max-width:720px){.ps-growth{padding-right:1.25rem;padding-left:1.25rem}.ps-growth__intro h2{font-size:clamp(3rem,13vw,4.25rem)}.ps-growth__main{display:flex;flex-direction:column;gap:4rem;margin-top:5.5rem}.ps-growth__photo{order:0;width:100%;min-height:0;aspect-ratio:4/5}.ps-growth-outcome{width:min(100%,24rem);max-width:none}.ps-growth-outcome--one{order:1}.ps-growth-outcome--two{order:2}.ps-growth-outcome--three{order:3}.ps-growth-outcome--four{order:4}.ps-growth__divider{margin-top:7rem}.ps-growth-curriculum{grid-template-columns:1fr;gap:3rem;margin-top:4rem}.ps-growth-curriculum__intro{max-width:26rem}.ps-growth-curriculum__intro>span{margin-left:3.5rem}.ps-growth-curriculum__panel{padding:1.75rem}.ps-growth__doodles{opacity:.14;background-size:720px auto;-webkit-mask-image:linear-gradient(90deg,#000 0%,#000 8%,transparent 17%,transparent 83%,#000 92%,#000 100%);mask-image:linear-gradient(90deg,#000 0%,#000 8%,transparent 17%,transparent 83%,#000 92%,#000 100%)}}
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
      .ps-foundation-collage__doodles{position:absolute;z-index:1;inset:0;display:block;width:100%;height:100%;object-fit:fill;background:none;filter:none;-webkit-mask-image:none;mask-image:none;pointer-events:none;user-select:none}
      @media(max-width:1250px){.ps-foundation-story__row--photo-first{min-height:clamp(44rem,72vw,54rem)}.ps-foundation-collage{width:100vw;height:72vw;max-height:54rem}.ps-foundation-collage__photo--top{left:57%;width:8rem}.ps-foundation-collage__photo--right{right:-4rem;width:10rem}.ps-foundation-collage__photo--bottom{left:34%;width:17rem}.ps-foundation-collage__photo--circle{right:6%;width:8rem}.ps-foundation-collage__doodles{opacity:.82}}
      @media(max-width:900px){.ps-foundation-story__row--photo-first{min-height:0;padding:6rem 0 3rem}.ps-foundation-collage__photo--right{display:none}.ps-foundation-collage__photo--top{top:1%;left:72%}.ps-foundation-collage__photo--bottom{left:28%}.ps-foundation-collage__photo--circle{right:2%}.ps-foundation-collage__doodles{opacity:.56}}
      @media(max-width:720px){.ps-foundation-story__row--photo-first{display:grid;min-height:0;padding:4rem 0 0;margin-bottom:0}.ps-foundation-story__row--photo-first>.ps-foundation-photo,.ps-foundation-story__row--photo-first>.ps-foundation-outcomes{transform:none}.ps-foundation-collage{position:relative;top:auto;left:auto;display:grid;width:100%;height:auto;max-height:none;grid-template-columns:minmax(0,1fr) minmax(0,.72fr);gap:1rem;margin-top:1rem;padding:2rem 0;transform:none}.ps-foundation-collage__photo{position:relative;inset:auto;width:100%}.ps-foundation-collage__photo--top{aspect-ratio:4/3}.ps-foundation-collage__photo--bottom{grid-column:1/-1;aspect-ratio:16/9}.ps-foundation-collage__photo--circle{align-self:center;width:min(100%,9rem);justify-self:center}.ps-foundation-collage__photo--right{display:none}.ps-foundation-collage__doodles{inset:-2rem -50vw;width:200vw;height:calc(100% + 4rem);object-fit:fill;opacity:.3}}
      @media(min-width:901px){
        .ps-foundation-story__row--photo-first{display:block;width:100%;height:calc(100svh - 3.625rem);min-height:0;max-height:calc(100svh - 3.625rem);margin-bottom:clamp(2rem,4vh,3rem);overflow:hidden}
        .ps-foundation-story__row--photo-first>.ps-foundation-photo{position:absolute;z-index:4;top:10%;left:0;width:clamp(26.25rem,39vw,38.75rem);height:clamp(26.875rem,56vh,37.5rem);min-height:0;margin:0;transform:none}
        .ps-foundation-story__row--photo-first>.ps-foundation-photo img{width:100%;height:100%;min-height:0;object-fit:cover}
        .ps-foundation-story__row--photo-first>.ps-foundation-outcomes{position:absolute;z-index:5;top:32%;right:0;width:48%;transform:none;background:#f7f0e3}
        .ps-foundation-story__row--photo-first .ps-foundation-outcome{padding-top:clamp(.5rem,1.2vh,.8rem);padding-bottom:clamp(.75rem,1.8vh,1.25rem)}
        .ps-foundation-story__row--photo-first .ps-foundation-outcome+.ps-foundation-outcome{padding-left:clamp(1.25rem,2vw,2rem)}
        .ps-foundation-story__row--photo-first .ps-foundation-outcome__meta{margin-bottom:clamp(.65rem,1.6vh,1rem)}
        .ps-foundation-story__row--photo-first .ps-foundation-outcome__meta i{width:clamp(2.75rem,6vh,3.25rem);height:clamp(2.75rem,6vh,3.25rem)}
        .ps-foundation-story__row--photo-first .ps-foundation-outcome h3{font-size:clamp(1.875rem,2.2vw,2.625rem);line-height:1.02}
        .ps-foundation-story__row--photo-first .ps-foundation-outcome p{margin-top:clamp(.65rem,1.6vh,1rem);font-size:clamp(.875rem,1vw,1.05rem);line-height:1.58}
        .ps-foundation-collage{top:0;left:50%;width:min(100vw,96rem);height:100%;max-height:none;transform:translateX(-50%)}
        .ps-foundation-collage__doodles{inset:7% 0 3%;width:100%;height:90%;object-fit:fill;opacity:1}
        .ps-foundation-collage__photo--top{top:5%;left:58%;width:clamp(7rem,12vw,12.5rem)}
        .ps-foundation-collage__photo--right{display:block;top:24%;right:-7%;width:min(18vw,17.5rem)}
        .ps-foundation-collage__photo--bottom{bottom:2.5%;left:36%;width:min(25vw,24.375rem)}
        .ps-foundation-collage__photo--circle{right:12%;bottom:4%;width:min(13vw,11.875rem)}
      }
      @media(min-width:901px) and (max-height:760px){
        .ps-foundation-story__row--photo-first>.ps-foundation-photo{top:9%;height:56vh;width:min(36vw,32rem)}
        .ps-foundation-story__row--photo-first>.ps-foundation-outcomes{top:29%;width:47%}
        .ps-foundation-story__row--photo-first .ps-foundation-outcome h3{font-size:clamp(1.75rem,2vw,2.25rem)}
        .ps-foundation-story__row--photo-first .ps-foundation-outcome p{font-size:.875rem}
        .ps-foundation-collage__photo--top{top:7%;width:min(11vw,8.5rem)}
        .ps-foundation-collage__photo--right{top:23%;width:min(16vw,12rem)}
        .ps-foundation-collage__photo--bottom{width:min(22vw,18rem)}
        .ps-foundation-collage__photo--circle{width:min(11vw,8.5rem)}
      }
      .ps-foundation-story__row--photo-last>.ps-foundation-outcomes,.ps-foundation-story__row--photo-last>.ps-foundation-photo{position:relative;z-index:2}
      .ps-foundation-story__doodle-overlay{position:absolute;z-index:1;top:50%;left:50%;display:block;width:100vw;max-width:1536px;height:calc(100% + clamp(4rem,8vw,8rem));object-fit:fill;transform-origin:center;translate:-50% -50%;pointer-events:none;user-select:none}
      @media(max-width:1000px){.ps-foundation-story__doodle-overlay{width:115vw;height:calc(100% + 5rem);filter:opacity(.82)}}
      @media(max-width:720px){.ps-foundation-story__row--photo-last{overflow:hidden}.ps-foundation-story__doodle-overlay{top:50%;width:175%;height:100%;object-fit:fill;filter:opacity(.5)}}
      .ps-foundation-curriculum{position:relative;left:50%;display:block;width:min(100vw,1536px);min-height:clamp(760px,66.667vw,1024px);margin-left:0;overflow:hidden;transform:translateX(-50%);isolation:isolate}
      .ps-foundation-curriculum__doodles{position:absolute;z-index:1;inset:0;display:block;width:100%;height:100%;object-fit:fill;pointer-events:none;user-select:none}
      .ps-foundation-curriculum__watermark{position:absolute;z-index:0;bottom:10%;left:-1%;color:rgba(200,147,47,.055);font-family:"Cormorant Garamond",Georgia,serif;font-size:clamp(13rem,24vw,23rem);font-weight:500;letter-spacing:-.09em;line-height:.7;white-space:nowrap;pointer-events:none}
      .ps-foundation-curriculum__intro,.ps-foundation-curriculum__heading,.ps-foundation-curriculum__photo,.ps-foundation-curriculum__stage{position:absolute;z-index:2}
      .ps-foundation-curriculum__intro{top:33%;left:5%;width:30%}
      .ps-foundation-curriculum__intro h3{font-size:clamp(3.4rem,5vw,5.25rem);line-height:.91}
      .ps-foundation-curriculum__heading{top:11%;left:35%;width:32%}
      .ps-foundation-curriculum__heading>span{display:block;margin-bottom:1rem;color:#c8932f;font-size:.76rem;font-weight:800;letter-spacing:.22em;text-transform:uppercase}
      .ps-foundation-curriculum__heading h3{margin:0;color:#06172b;font-family:"Cormorant Garamond",Georgia,serif;font-size:clamp(3.8rem,5.4vw,5.8rem);font-weight:550;letter-spacing:-.04em;line-height:.86}
      .ps-foundation-curriculum__heading p{max-width:31rem;margin:1.7rem 0 0;color:rgba(35,62,86,.74);font-size:clamp(.9rem,1.1vw,1.05rem);line-height:1.72;text-wrap:pretty}
      .ps-foundation-curriculum__photo{top:45%;left:40%;width:clamp(11rem,17vw,16.5rem);aspect-ratio:1;margin:0;overflow:hidden;border-radius:50%;background:#eadfca}
      .ps-foundation-curriculum__photo img{display:block;width:100%;height:100%;object-fit:cover;object-position:52% 83%;transform:scale(1.45)}
      .ps-foundation-curriculum__journey{position:absolute;z-index:2;inset:0}
      .ps-foundation-curriculum__stage{display:flex;align-items:flex-start;gap:1.25rem;width:25rem}
      .ps-foundation-curriculum__stage>span{display:grid;width:4.25rem;height:4.25rem;flex:0 0 auto;place-items:center;border-radius:50%;background:rgba(216,170,78,.11);color:#c8932f;font-family:"Cormorant Garamond",Georgia,serif;font-size:1.65rem;font-weight:600}
      .ps-foundation-curriculum__stage h4{margin:.45rem 0 0;color:#06172b;font-family:"Cormorant Garamond",Georgia,serif;font-size:clamp(1.65rem,2.1vw,2.15rem);font-weight:650;letter-spacing:.015em;line-height:1;text-transform:uppercase}
      .ps-foundation-curriculum__stage p{margin:.9rem 0 0;color:rgba(35,62,86,.72);font-size:clamp(.86rem,1vw,.98rem);line-height:1.7}
      .ps-foundation-curriculum__stage--read{top:15%;left:67%}
      .ps-foundation-curriculum__stage--write{top:42%;left:64%}
      .ps-foundation-curriculum__stage--think{top:70%;left:57%}
      @media(max-width:1100px){.ps-foundation-curriculum__intro{left:4%;width:31%}.ps-foundation-curriculum__heading{left:34%;width:34%}.ps-foundation-curriculum__stage{width:21rem}.ps-foundation-curriculum__stage--read{left:68%}.ps-foundation-curriculum__stage--write{left:65%}.ps-foundation-curriculum__stage--think{left:58%}.ps-foundation-curriculum__photo{left:39%;width:14rem}}
      @media(max-width:800px){.ps-foundation-curriculum{left:50%;display:flex;width:100vw;min-height:0;flex-direction:column;gap:3.25rem;padding:5rem 1.5rem 6rem;transform:translateX(-50%)}.ps-foundation-curriculum__doodles{width:170%;height:100%;margin-left:-35%;object-fit:fill;filter:opacity(.34)}.ps-foundation-curriculum__watermark{bottom:3%;font-size:13rem}.ps-foundation-curriculum__intro,.ps-foundation-curriculum__heading,.ps-foundation-curriculum__photo,.ps-foundation-curriculum__stage{position:relative;inset:auto;width:min(100%,32rem);margin-right:auto;margin-left:auto}.ps-foundation-curriculum__intro{order:1}.ps-foundation-curriculum__heading{order:2}.ps-foundation-curriculum__journey{display:contents}.ps-foundation-curriculum__stage--read{order:3}.ps-foundation-curriculum__stage--write{order:4}.ps-foundation-curriculum__photo{order:5;width:min(68vw,15rem)}.ps-foundation-curriculum__stage--think{order:6}.ps-foundation-curriculum__intro h3{font-size:clamp(3.1rem,13vw,4.5rem)}.ps-foundation-curriculum__heading h3{font-size:clamp(3.6rem,15vw,5rem)}.ps-foundation-curriculum__stage{gap:1rem}.ps-foundation-curriculum__stage>span{width:3.75rem;height:3.75rem}.ps-foundation-curriculum__stage h4{font-size:1.75rem}.ps-foundation-curriculum__stage p{font-size:.92rem}.ps-foundation-curriculum__stage br{display:none}}
      /* Compact the chapter rhythm without moving or transforming individual content. */
      .ps-foundation-intro .ps-crayon-artwork{clip-path:inset(0 0 max(0px,calc(100% - var(--ps-foundation-doodle-end,100%))) 0)}
      .ps-foundation-intro{padding-bottom:clamp(5rem,7vw,7rem)}
      .ps-foundation-story__row+.ps-foundation-story__row{margin-top:clamp(5rem,7vw,7rem)}
      .ps-foundation-curriculum{margin-top:clamp(5.5rem,8vw,7.5rem)}
      @media(min-width:801px){
        .ps-foundation-curriculum{height:calc(100svh - 3.625rem);min-height:40rem;max-height:57.5rem}
        .ps-foundation-curriculum__doodles{top:6%;height:91%;object-fit:fill}
        .ps-foundation-curriculum__watermark{bottom:8%;font-size:clamp(10rem,24vh,18rem)}
        .ps-foundation-curriculum__intro{top:31%;left:10%;width:27%}
        .ps-foundation-curriculum__intro h3{font-size:clamp(3rem,7vh,4.5rem);line-height:.9}
        .ps-foundation-curriculum__heading{top:9%;left:36.5%;width:31%}
        .ps-foundation-curriculum__heading>span{margin-bottom:clamp(.55rem,1.3vh,.85rem)}
        .ps-foundation-curriculum__heading h3{font-size:clamp(3.4rem,7.8vh,5rem);line-height:.86}
        .ps-foundation-curriculum__heading p{margin-top:clamp(.85rem,2vh,1.25rem);font-size:clamp(.86rem,1.65vh,1rem);line-height:1.58}
        .ps-foundation-curriculum__photo{top:49%;left:42%;width:clamp(9.5rem,21vh,13.5rem)}
        .ps-foundation-curriculum__stage{gap:clamp(.8rem,1.5vw,1.15rem);width:clamp(19rem,26vw,24rem)}
        .ps-foundation-curriculum__stage>span{width:clamp(3.25rem,7vh,4rem);height:clamp(3.25rem,7vh,4rem);font-size:clamp(1.35rem,2.8vh,1.6rem)}
        .ps-foundation-curriculum__stage h4{margin-top:.3rem;font-size:clamp(1.45rem,3.2vh,1.95rem)}
        .ps-foundation-curriculum__stage p{margin-top:clamp(.45rem,1.2vh,.75rem);font-size:clamp(.8rem,1.55vh,.94rem);line-height:1.55}
        .ps-foundation-curriculum__stage--read{top:12%;left:64.5%}
        .ps-foundation-curriculum__stage--write{top:44%;left:63%}
        .ps-foundation-curriculum__stage--think{top:71%;left:56.5%}
      }
      .ps-growth{padding-top:clamp(4.5rem,6vw,6rem);padding-bottom:clamp(5rem,7vw,7rem)}
      .ps-growth__main{margin-top:clamp(4.5rem,6vw,6rem)}
      .ps-growth__divider{margin-top:clamp(4.5rem,6vw,6rem)}
      .ps-growth-curriculum{margin-top:clamp(2.5rem,4vw,4rem)}
      .ps-mastery{padding-top:clamp(4.5rem,6vw,6rem);padding-bottom:clamp(7rem,10vw,10rem)}
      .ps-mastery__photo{margin-top:clamp(4rem,5.5vw,5.5rem)}
      .ps-mastery__outcomes{margin-top:clamp(3rem,4.5vw,4rem)}
      .ps-mastery__divider{margin-top:clamp(4.5rem,6vw,6rem)}
      .ps-mastery-curriculum{margin-top:clamp(2.5rem,4vw,4rem)}
      @media(max-width:720px){.ps-foundation-story__row+.ps-foundation-story__row{margin-top:5rem}.ps-foundation-curriculum{margin-top:5.5rem}.ps-growth__main{margin-top:4rem}.ps-growth__divider{margin-top:4.5rem}.ps-growth-curriculum{margin-top:2.75rem}.ps-mastery__photo{margin-top:4rem}.ps-mastery__outcomes{margin-top:3rem}.ps-mastery__divider{margin-top:4.5rem}.ps-mastery-curriculum{margin-top:2.75rem}}
      @media(max-width:540px){.ps-foundation-intro{padding-bottom:5rem}}
      @media(prefers-reduced-motion:reduce){.ps-button,.ps-mobile-progress i b,.ps-landscape-stage,.ps-landscape-stage small,.ps-landscape-stage strong{transition:none}.ps-hero__handoff{display:none}}
    `}</style>
  </div>
);

export default PrimarySchool;
