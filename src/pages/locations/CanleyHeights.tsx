import React, { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import SEO from '@/components/SEO';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import LocationHero from '@/components/location/LocationHero';
import LiveHours from '@/components/location/LiveHours';
import { Car, Train, School, Users, Trophy, Star, CheckCircle, ArrowRight, Navigation, MapPin } from 'lucide-react';
import { siteStats } from '@/data/site-stats';
import { educationalOrganizationSchema, breadcrumbSchema } from '@/lib/seo/schema';

// Design tokens matching home page
const C = {
  navy:  '#0A1B34', navy2: '#0F2244',
  gold:  '#D4AF37', goldL: '#F0C86A',
  cream: '#F7F4EE', cream2: '#EDE5D4',
  white: '#FAFAF8', muted: 'rgba(10,27,52,0.55)',
};
const serif = "'Cormorant Garamond', Georgia, serif";
const sans  = "'DM Sans', 'Inter', sans-serif";

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.22,1,0.36,1] as [number,number,number,number] } },
};
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.7 } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } } };
const schoolCard = {
  hidden: (index: number) => ({
    opacity: 0,
    x: (index % 4 - 1.5) * 18,
    y: index < 4 ? 28 : 42,
    rotate: (index % 2 === 0 ? -1 : 1) * 0.75,
  }),
  visible: (index: number) => ({
    opacity: 1,
    x: 0,
    y: 0,
    rotate: 0,
    transition: {
      duration: 0.7,
      delay: index * 0.065,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

const Reveal = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const reduceMotion = useReducedMotion();
  return (
    <motion.div ref={ref} variants={stagger} initial={reduceMotion ? false : 'hidden'} animate={inView ? 'visible' : 'hidden'}>
      {children}
    </motion.div>
  );
};

const GoldRule = () => (
  <div style={{ width: 52, height: 1, background: `linear-gradient(90deg,transparent,${C.gold},transparent)`, margin: '0 auto 36px' }} />
);

const Tag = ({ t, light = false }: { t: string; light?: boolean }) => (
  <div style={{ fontFamily: sans, fontSize: '.67rem', fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase' as const, color: light ? 'rgba(212,175,55,.85)' : C.gold, marginBottom: 12 }}>{t}</div>
);

const schools = [
  { name: "Canley Vale High School", dist: "800m", type: "Public", logo: "/images/schools/canley-vale-high.png" },
  { name: "Fairfield High School", dist: "2.3km", type: "Public", logo: "/images/schools/fairfield-high.png" },
  { name: "Fairvale High School", dist: "3.1km", type: "Public", logo: "/images/schools/fairvale-high.png" },
  { name: "Freeman Catholic College", dist: "1.8km", type: "Private", logo: "/images/schools/freeman-catholic-college-crest.png" },
  { name: "Canley Heights Public School", dist: "500m", type: "Primary", logo: "/images/schools/canley-heights-public.png" },
  { name: "St Johns Park High School", dist: "3.5km", type: "Public", logo: "/images/schools/st-johns-park-high.png" },
  { name: "Cabramatta High School", dist: "2.8km", type: "Public", logo: "/images/schools/cabramatta-high.png" },
  { name: "Lansvale Public School", dist: "2.2km", type: "Primary", logo: "/images/schools/lansvale-public.png" },
];

const transport = [
  { type: "Train", details: "Take the train to Canley Vale, then a 5-minute bus trip to the centre", Icon: Train, colour: '#5b8fc7', wash: 'rgba(147,197,253,.18)' },
  { type: "Bus", details: "Routes 802, 803, 804 stop nearby", Icon: Navigation, colour: C.gold, wash: 'rgba(212,175,55,.12)' },
  { type: "Parking", details: "Free 2-hour street parking available", Icon: Car, colour: '#4f9570', wash: 'rgba(134,239,172,.16)' },
  { type: "Drop-off", details: "Convenient drop-off zone at entrance", Icon: MapPin, colour: '#8a6bb2', wash: 'rgba(196,181,253,.18)' },
];

const stories = [
  { student: "Jessica L.", school: "Canley Vale High School", result: "99.85 ATAR — Medicine at UNSW", year: "2024", quote: "DA Tuition's location was so convenient — just a 10-minute walk from school!" },
  { student: "Michael N.", school: "Fairfield High School", result: "99.25 ATAR — Medicine at UNSW", year: "2024", quote: "The Canley Heights centre became my second home during Year 12." },
  { student: "Sarah C.", school: "Freeman Catholic College", result: "Band 6 in All Subjects", year: "2023", quote: "Being so close to home meant I could attend extra sessions easily." },
];

const programs = [
  { name: "Primary School Excellence", avail: "Limited spots", popular: true },
  { name: "High School Programs", avail: "3 spots left", popular: true },
  { name: "HSC Excellence", avail: "Open enrollment", popular: false },
  { name: "Primary School Support", avail: "Open enrollment", popular: false },
  { name: "High School (7–10)", avail: "Limited spots", popular: false },
];

const features = [
  'Small groups of 3–5 students so every child is known by name',
  'Band 6 subject teachers who know the NSW syllabus inside out',
  'Regular progress reports and honest parent conversations',
  'Quiet study spaces, modern classrooms, purpose-built for learning',
  'Safe, supervised environment with CCTV and secure entry',
  'Convenient lift access to Level 1 — drop-off zone at entrance',
];

const CanleyHeights = () => {
  const s = { fontFamily: sans } as React.CSSProperties;
  const contactHref = () => { window.location.href = '/#contact'; };

  return (
    <div style={{ minHeight: '100vh', background: C.cream, fontFamily: sans }}>
      <SEO
        title="Tutoring in Canley Heights — K-12 & HSC"
        description="Visit our Canley Heights tutoring centre for expert K-12 support. Conveniently located on Canley Vale Rd, we've helped Fairfield families achieve academic excellence since 2005."
        canonicalUrl="/tutoring-canley-heights"
        jsonLd={[
          educationalOrganizationSchema(siteStats.reviewCount),
          breadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'Locations', url: '/tutoring-canley-heights' },
            { name: 'Canley Heights', url: '/tutoring-canley-heights' },
          ]),
        ]}
      />
      <NavigationNew />

      {/* HERO */}
      <LocationHero
        eyebrow="Serving Canley Heights & Surrounds Since 2005"
        headline="Canley Heights"
        headlineAccent="Our Home Since 2005"
        subtext="Level 1/229 Canley Vale Rd — your local education excellence centre, helping Fairfield families achieve extraordinary results for nearly two decades."
        addressLines={['Level 1/229 Canley Vale Rd', 'Canley Heights NSW 2166']}
        hoursLines={['Tue – Fri: 4:30 pm – 9:30 pm', 'Weekday classes: 5:00 pm – 9:00 pm', 'Saturday: 9:00 am – 6:00 pm', 'Sunday: 10:00 am – 7:00 pm']}
        phone="0401 940 207"
        mapEmbedSrc="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3311.393457591605!2d150.93299447668636!3d-33.882098619623864!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b129665c58965c5%3A0x1c1c1c1c1c1c1c1c!2s229%20Canley%20Vale%20Rd%2C%20Canley%20Heights%20NSW%202166!5e0!3m2!1sen!2sau!4v1711900000000!5m2!1sen!2sau"
        mapTitle="DA Tuition Canley Heights Map"
        directionsUrl="https://maps.google.com/?q=229+Canley+Vale+Rd+Canley+Heights+NSW+2166"
        onBookInterview={contactHref}
      />

      <LiveHours />

      {/* TRANSPORT */}
      <section style={{ background: C.cream, padding: '32px 24px 64px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <Reveal>
            <motion.div variants={fadeUp} style={{ textAlign: 'center', marginBottom: 28 }}>
              <Tag t="Getting Here" />
              <GoldRule />
              <h2 style={{ fontFamily: serif, fontWeight: 500, fontSize: 'clamp(2rem,3.5vw,3rem)', color: C.navy, letterSpacing: '-.02em', lineHeight: 1.1 }}>Easy to Reach</h2>
              <p style={{ ...s, fontSize: '.95rem', color: C.muted, marginTop: 14 }}>Convenient transport options for every family</p>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 2 }}>
              {transport.map(({ type, details, Icon, colour, wash }, i) => (
                <motion.div key={i} variants={fadeUp} style={{ background: C.white, border: `1px solid rgba(212,175,55,.18)`, padding: '30px 24px', textAlign: 'center' }}>
                  <div style={{ width: 52, height: 52, borderRadius: '50%', border: `1px solid ${colour}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', background: wash }}>
                    <Icon size={22} color={colour} />
                  </div>
                  <h3 style={{ fontFamily: serif, fontSize: '1.2rem', fontWeight: 500, color: C.navy, marginBottom: 8 }}>{type}</h3>
                  <p style={{ ...s, fontSize: '.85rem', color: C.muted, lineHeight: 1.65 }}>{details}</p>
                </motion.div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section style={{ background: `linear-gradient(180deg, ${C.cream} 0%, ${C.cream} 42%, ${C.cream2} 100%)`, padding: 'clamp(56px,6vw,78px) 24px clamp(48px,6vw,72px)' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', alignItems: 'center', gap: 'clamp(34px,6vw,80px)' }}>
          <Reveal>
            <motion.div variants={fadeUp}>
              <Tag t="Why families choose DA" />
              <h2 style={{ fontFamily: serif, fontWeight: 500, fontSize: 'clamp(2.35rem,4.25vw,3.8rem)', color: C.navy, letterSpacing: '-.035em', lineHeight: 1.02, maxWidth: 500 }}>
                More than tutoring.<br />
                <em style={{ color: C.gold, fontStyle: 'italic' }}>A place to belong.</em>
              </h2>
              <p style={{ ...s, color: C.muted, fontSize: '1rem', lineHeight: 1.7, maxWidth: 460, marginTop: 18, marginBottom: 24 }}>
                A welcoming local centre where students can focus, build confidence, and feel supported in every next step.
              </p>

              <div style={{ borderTop: `1px solid rgba(10,27,52,.15)` }}>
                {[
                  { Icon: Trophy, title: 'Progress with purpose', body: `Experienced teachers and high expectations help students build toward goals that matter to them.`, accent: C.gold },
                  { Icon: Users, title: 'Known by name', body: `Families value the relationships that grow when a team understands their child’s learning journey.`, accent: '#7a9cc6' },
                  { Icon: MapPin, title: 'Made for local families', body: 'Take the train to Canley Vale, then a 5-minute bus trip to the centre. Parking is available too.', accent: '#819e7d' },
                ].map(({ Icon, title, body, accent }) => (
                  <motion.div key={title} variants={fadeUp} whileHover={{ x: 7, transition: { duration: .24, ease: [0.22, 1, 0.36, 1] } }} style={{ display: 'grid', gridTemplateColumns: '42px minmax(0,1fr)', gap: 16, padding: '18px 0', borderBottom: `1px solid rgba(10,27,52,.15)` }}>
                    <div style={{ width: 38, height: 38, borderRadius: '50%', display: 'grid', placeItems: 'center', background: `${accent}1c`, border: `1px solid ${accent}66` }}>
                      <Icon size={18} color={accent} />
                    </div>
                    <div>
                      <h3 style={{ fontFamily: serif, color: C.navy, fontWeight: 600, fontSize: '1.4rem', lineHeight: 1.05, marginBottom: 6 }}>{title}</h3>
                      <p style={{ ...s, color: C.muted, fontSize: '.88rem', lineHeight: 1.6, maxWidth: 420 }}>{body}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </Reveal>

          <Reveal>
            <motion.figure variants={fadeUp} style={{ position: 'relative', margin: 0 }}>
              <div aria-hidden="true" style={{ position: 'absolute', height: 3, width: 94, background: C.gold, top: -12, right: 28, borderRadius: 99 }} />
              <div style={{ position: 'relative', minHeight: 'clamp(400px,43vw,530px)', overflow: 'hidden', borderRadius: '150px 30px 30px 30px', backgroundImage: "url('/images/programs/highschool-classroom-wide-1-joyful-clean.png')", backgroundPosition: 'center 80%', backgroundSize: 'auto 125%', boxShadow: '0 24px 50px rgba(10,27,52,.14)', filter: 'brightness(1.04) contrast(1.02) saturate(1.03)' }} />
              <figcaption style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginTop: 17, padding: '0 4px', color: C.navy }}>
                <span style={{ ...s, color: C.gold, fontSize: '.64rem', letterSpacing: '.17em', fontWeight: 700, textTransform: 'uppercase' }}>Canley Heights, NSW</span>
                <span style={{ ...s, color: C.muted, fontSize: '.78rem', textAlign: 'right' }}>A calm place to focus and grow.</span>
              </figcaption>
            </motion.figure>
          </Reveal>
        </div>
      </section>

      {/* SCHOOLS */}
      <section style={{ background: C.cream2, padding: '96px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <Reveal>
            <motion.div variants={fadeUp} style={{ textAlign: 'center', marginBottom: 56 }}>
              <Tag t="Local Schools" />
              <GoldRule />
              <h2 style={{ fontFamily: serif, fontWeight: 500, fontSize: 'clamp(2rem,3.5vw,3rem)', color: C.navy, letterSpacing: '-.02em', lineHeight: 1.1 }}>Schools We Serve</h2>
              <p style={{ ...s, fontSize: '.95rem', color: C.muted, marginTop: 14 }}>Supporting students from every local school</p>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 16 }}>
              {schools.map((sc, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  variants={schoolCard}
                  whileHover={{ y: -6, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } }}
                  style={{ background: C.white, border: `1px solid rgba(212,175,55,.2)`, borderRadius: 8, padding: '28px 24px', transformOrigin: 'center bottom' }}
                >
                  <div style={{ width: 72, height: 58, marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={sc.logo} alt={`${sc.name} logo`} style={{ width: 72, height: 58, objectFit: 'contain' }} />
                  </div>
                  <div style={{ fontFamily: serif, fontSize: '1.05rem', fontWeight: 500, color: C.navy, marginBottom: 8 }}>{sc.name}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ ...s, fontSize: '.78rem', color: C.muted }}>{sc.dist} away</span>
                    <span style={{ ...s, fontSize: '.65rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: C.gold, border: `1px solid rgba(212,175,55,.35)`, borderRadius: 2, padding: '2px 8px' }}>{sc.type}</span>
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.p variants={fadeIn} style={{ ...s, fontSize: '.88rem', color: C.muted, textAlign: 'center', marginTop: 32 }}>
              Plus students from: Cabramatta, Lansvale, Wakeley, Wetherill Park, and surrounding areas
            </motion.p>
          </Reveal>
        </div>
      </section>

      {/* ABOUT */}
      <section style={{ background: C.cream, padding: '72px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Reveal>
            <motion.div variants={fadeUp} aria-label="About DA Tuition Canley Heights" style={{ minHeight: 620, borderRadius: 12, padding: 'clamp(32px,6vw,72px)', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
              <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/images/community/canley-heights-classroom-hallway-clean.png)', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(1.05) contrast(1.02) saturate(1.03)' }} />
              <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: `linear-gradient(90deg, ${C.navy} 0%, rgba(10,27,52,.94) 38%, rgba(10,27,52,.62) 66%, rgba(10,27,52,.12) 100%)` }} />
              <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(10,27,52,.38), transparent 55%)' }} />
              <div style={{ position: 'relative', zIndex: 1, maxWidth: 670 }}>
                <Tag t="About the Centre" light />
                <h3 style={{ fontFamily: serif, fontWeight: 500, fontSize: 'clamp(2rem,4vw,3.25rem)', color: C.white, letterSpacing: '-.01em', lineHeight: 1.08, marginBottom: 20 }}>
                  DA Tuition <em style={{ fontStyle: 'italic', color: C.goldL }}>Canley Heights</em>
                </h3>
                <p style={{ ...s, fontSize: '.95rem', color: 'rgba(247,244,238,.7)', lineHeight: 1.8, marginBottom: 16 }}>
                  For nearly 20 years, DA Tuition Canley Heights has been the cornerstone of educational excellence in the Fairfield area, growing from a small tutoring service to the region's most trusted education provider and helping thousands of local students achieve their academic dreams.
                </p>
                <p style={{ ...s, fontSize: '.95rem', color: 'rgba(247,244,238,.7)', lineHeight: 1.8 }}>
                  Located in the heart of Canley Heights, we understand the unique needs of our multicultural community. Our teachers bring diverse perspectives that resonate deeply with local families.
                </p>
                <div style={{ borderTop: '1px solid rgba(240,200,106,.42)', marginTop: 28, paddingTop: 24 }}>
                <h4 style={{ fontFamily: serif, fontWeight: 500, fontSize: '1.3rem', color: C.white, marginBottom: 18 }}>What makes our centre special</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 14 }}>
                  {features.map((f, i) => (
                    <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                      <CheckCircle size={18} color={C.gold} style={{ flexShrink: 0, marginTop: 2 }} />
                      <span style={{ ...s, fontSize: '.84rem', color: 'rgba(247,244,238,.72)', lineHeight: 1.6 }}>{f}</span>
                    </div>
                  ))}
                </div>
                </div>
              </div>
            </motion.div>
          </Reveal>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ background: C.navy, padding: '112px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 70% 60% at 50% 50%,rgba(212,175,55,.10) 0%,transparent 70%)`, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 0, left: '15%', right: '15%', height: 1, background: `linear-gradient(90deg,transparent,${C.gold},transparent)` }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 680, margin: '0 auto' }}>
          <Reveal>
            <motion.div variants={fadeUp}>
              <Tag t="Ready to Begin" light />
              <GoldRule />
              <h2 style={{ fontFamily: serif, fontWeight: 500, fontSize: 'clamp(2.2rem,4vw,3.6rem)', color: C.white, letterSpacing: '-.02em', lineHeight: 1.08, marginBottom: 20 }}>
                Join {siteStats.reviewCount} Families<br />
                <em style={{ fontStyle: 'italic', color: C.goldL }}>Who Trust DA Tuition</em>
              </h2>
              <p style={{ ...s, fontSize: '.95rem', color: 'rgba(247,244,238,.62)', lineHeight: 1.8, marginBottom: 40 }}>
                Experience why we're Fairfield's most trusted tutoring centre. Book your consultation at our Canley Heights location today.
              </p>

              <div style={{ background: 'rgba(212,175,55,.08)', border: `1px solid rgba(212,175,55,.25)`, borderRadius: 8, padding: '20px 32px', marginBottom: 36 }}>
                <div style={{ fontFamily: serif, fontSize: '1.1rem', color: C.goldL, marginBottom: 4 }}>Limited Spots Available</div>
                <div style={{ ...s, fontSize: '.85rem', color: 'rgba(247,244,238,.55)' }}>HSC and primary school programs are filling fast — secure your place now.</div>
              </div>

              <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button onClick={contactHref} style={{ ...s, background: C.gold, color: C.navy, border: 'none', borderRadius: 3, padding: '15px 40px', fontSize: '.88rem', fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                  Book Interview <ArrowRight size={16} />
                </button>
                <button onClick={() => window.open('https://maps.google.com/?q=229+Canley+Vale+Rd+Canley+Heights+NSW+2166','_blank')} style={{ ...s, background: 'transparent', color: C.white, border: `1.5px solid rgba(247,244,238,.28)`, borderRadius: 3, padding: '15px 40px', fontSize: '.88rem', fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', cursor: 'pointer' }}>
                  Get Directions
                </button>
              </div>
              <p style={{ ...s, fontSize: '.75rem', color: 'rgba(247,244,238,.35)', marginTop: 28 }}>
                Level 1/229 Canley Vale Rd, Canley Heights NSW 2166 &nbsp;•&nbsp; 0401 940 207
              </p>
            </motion.div>
          </Reveal>
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: '15%', right: '15%', height: 1, background: `linear-gradient(90deg,transparent,${C.gold},transparent)` }} />
      </section>

      <FooterNew />
    </div>
  );
};

export default CanleyHeights;
