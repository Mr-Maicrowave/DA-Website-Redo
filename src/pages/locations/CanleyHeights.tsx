import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import SEO from '@/components/SEO';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import { MapPin, Clock, Phone, Car, Train, School, Users, Trophy, Star, CheckCircle, ArrowRight, Navigation } from 'lucide-react';
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

const Reveal = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} variants={stagger} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
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
  { name: "Canley Vale High School", dist: "800m", type: "Public" },
  { name: "Fairfield High School", dist: "2.3km", type: "Public" },
  { name: "Fairvale High School", dist: "3.1km", type: "Public" },
  { name: "Freeman Catholic College", dist: "1.8km", type: "Private" },
  { name: "Canley Heights Public School", dist: "500m", type: "Primary" },
  { name: "St Johns Park High School", dist: "3.5km", type: "Public" },
  { name: "Cabramatta High School", dist: "2.8km", type: "Public" },
  { name: "Lansvale Public School", dist: "2.2km", type: "Primary" },
];

const transport = [
  { type: "Train", details: "Canley Vale Station — 5 min walk", Icon: Train },
  { type: "Bus", details: "Routes 802, 803, 804 stop nearby", Icon: Navigation },
  { type: "Parking", details: "Free 2-hour street parking available", Icon: Car },
  { type: "Drop-off", details: "Convenient drop-off zone at entrance", Icon: MapPin },
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
      <section style={{ position: 'relative', overflow: 'hidden', minHeight: '92vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.navy }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('/images/v3/hero_entrance.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.2 }} />
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 80% 60% at 50% 40%, rgba(212,175,55,0.14) 0%, transparent 70%), linear-gradient(180deg,${C.navy}cc 0%,${C.navy} 100%)` }} />
        <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: 1, background: `linear-gradient(90deg,transparent,${C.gold},transparent)` }} />

        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: 'clamp(120px,14vh,160px) 24px 80px', maxWidth: 860 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
            <div style={{ display: 'inline-block', border: `1px solid rgba(212,175,55,.35)`, borderRadius: 2, padding: '6px 20px', marginBottom: 28, ...s, fontSize: '.65rem', fontWeight: 700, letterSpacing: '.22em', textTransform: 'uppercase', color: C.goldL }}>
              Serving Canley Heights &amp; Surrounds Since 2005
            </div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.22 }} style={{ fontFamily: serif, fontWeight: 500, fontSize: 'clamp(2.4rem,5.5vw,4.8rem)', lineHeight: 1.06, letterSpacing: '-.018em', color: C.white, marginBottom: 20 }}>
            Tutoring in<br />
            <em style={{ fontStyle: 'italic', color: C.goldL }}>Canley Heights</em>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.38 }} style={{ ...s, fontSize: 'clamp(.95rem,1.5vw,1.15rem)', color: 'rgba(247,244,238,.72)', maxWidth: 620, margin: '0 auto 42px', lineHeight: 1.7 }}>
            Level 1/229 Canley Vale Rd — your local education excellence centre,
            helping Fairfield families achieve extraordinary results for nearly two decades.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.52 }} style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={contactHref} style={{ ...s, background: C.gold, color: C.navy, border: 'none', borderRadius: 3, padding: '14px 36px', fontSize: '.88rem', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              Book Interview <ArrowRight size={16} />
            </button>
            <a href="tel:0401940207">
              <button style={{ ...s, background: 'transparent', color: C.white, border: `1.5px solid rgba(247,244,238,.35)`, borderRadius: 3, padding: '14px 36px', fontSize: '.88rem', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', cursor: 'pointer' }}>
                Call 0401 940 207
              </button>
            </a>
          </motion.div>
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: '10%', right: '10%', height: 1, background: `linear-gradient(90deg,transparent,${C.gold},transparent)` }} />
      </section>

      {/* INFO CARD */}
      <section style={{ background: C.cream, padding: '80px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <Reveal>
            <motion.div variants={fadeUp} style={{ textAlign: 'center', marginBottom: 48 }}>
              <Tag t="Find Us" />
              <h2 style={{ fontFamily: serif, fontWeight: 500, fontSize: 'clamp(2rem,3.5vw,3rem)', color: C.navy, letterSpacing: '-.02em', lineHeight: 1.1 }}>Visit the Centre</h2>
            </motion.div>

            <motion.div variants={fadeIn} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 0, border: `1px solid rgba(212,175,55,.25)`, borderRadius: 12, overflow: 'hidden', boxShadow: '0 12px 48px rgba(10,27,52,.10)' }}>
              <div style={{ background: C.white, padding: '48px 40px', display: 'flex', flexDirection: 'column', gap: 24 }}>
                {[
                  { Icon: MapPin, label: 'Address', lines: ['Level 1/229 Canley Vale Rd', 'Canley Heights NSW 2166'] },
                  { Icon: Clock, label: 'Hours', lines: ['Tue – Fri: 5:00 pm – 9:00 pm', 'Saturday: 9:00 am – 6:00 pm', 'Sunday: 10:00 am – 7:00 pm'] },
                  { Icon: Phone, label: 'Contact', lines: ['0401 940 207', 'canleyheights@datuition.com.au'] },
                ].map(({ Icon, label, lines }, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <div style={{ height: 1, background: `linear-gradient(90deg,${C.gold}44,transparent)` }} />}
                    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                      <Icon size={20} color={C.gold} style={{ flexShrink: 0, marginTop: 2 }} />
                      <div>
                        <div style={{ ...s, fontWeight: 700, fontSize: '.75rem', letterSpacing: '.12em', textTransform: 'uppercase', color: C.gold, marginBottom: 6 }}>{label}</div>
                        {lines.map((l, j) => <div key={j} style={{ fontFamily: serif, fontSize: '1.05rem', color: C.navy, lineHeight: 1.55 }}>{l}</div>)}
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
              <div style={{ minHeight: 300, overflow: 'hidden' }}>
                <iframe
                  title="DA Tuition Canley Heights Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3311.393457591605!2d150.93299447668636!3d-33.882098619623864!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b129665c58965c5%3A0x1c1c1c1c1c1c1c1c!2s229%20Canley%20Vale%20Rd%2C%20Canley%20Heights%20NSW%202166!5e0!3m2!1sen!2sau!4v1711900000000!5m2!1sen!2sau"
                  width="100%" height="100%" style={{ border: 0, display: 'block', minHeight: 300 }}
                  allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </motion.div>

            <motion.div variants={fadeUp} style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginTop: 36 }}>
              <button onClick={contactHref} style={{ ...s, background: C.navy, color: C.white, border: 'none', borderRadius: 3, padding: '13px 32px', fontSize: '.85rem', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                Book Interview <ArrowRight size={15} />
              </button>
              <button onClick={() => window.open('https://maps.google.com/?q=229+Canley+Vale+Rd+Canley+Heights+NSW+2166','_blank')} style={{ ...s, background: 'transparent', color: C.navy, border: `1.5px solid rgba(10,27,52,.28)`, borderRadius: 3, padding: '13px 32px', fontSize: '.85rem', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', cursor: 'pointer' }}>
                Get Directions
              </button>
            </motion.div>
          </Reveal>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section style={{ background: C.navy, padding: '96px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)', width: '70%', height: '60%', background: `radial-gradient(ellipse,rgba(212,175,55,.08) 0%,transparent 70%)`, pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <Reveal>
            <motion.div variants={fadeUp} style={{ textAlign: 'center', marginBottom: 56 }}>
              <Tag t="Why Choose Us" light />
              <GoldRule />
              <h2 style={{ fontFamily: serif, fontWeight: 500, fontSize: 'clamp(2rem,3.8vw,3.4rem)', color: C.white, letterSpacing: '-.02em', lineHeight: 1.1 }}>
                Why Canley Heights Families<br />
                <em style={{ fontStyle: 'italic', color: C.goldL }}>Choose DA Tuition</em>
              </h2>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 2 }}>
              {[
                { Icon: Trophy, ic: C.goldL, title: 'Outstanding Results', body: `Thousands of local students have achieved their academic dreams with us — including ${siteStats.atar95Plus} students with 95+ ATARs and ${siteStats.band6Results} Band 6 HSC results.`, badge: '2025 Award Winner' },
                { Icon: Users, ic: '#93c5fd', title: 'Community Trusted', body: `Recommended by local schools and trusted by over ${siteStats.reviewCount} Fairfield area families. Our reputation is built on two decades of exceptional outcomes.`, badge: '5.0 ★ Rating' },
                { Icon: MapPin, ic: '#86efac', title: 'Perfect Location', body: 'Central Canley Heights with easy access from all surrounding suburbs. Walking distance from Canley Vale station and major bus routes. Free parking available.', badge: 'Free Parking' },
              ].map(({ Icon, ic, title, body, badge }, i) => (
                <motion.div key={i} variants={fadeUp} style={{ background: 'rgba(255,255,255,.04)', border: `1px solid rgba(212,175,55,.12)`, padding: '48px 36px' }}>
                  <Icon size={40} color={ic} style={{ marginBottom: 20 }} />
                  <h3 style={{ fontFamily: serif, fontWeight: 500, fontSize: '1.55rem', color: C.white, letterSpacing: '-.01em', marginBottom: 12 }}>{title}</h3>
                  <p style={{ ...s, fontSize: '.92rem', color: 'rgba(247,244,238,.65)', lineHeight: 1.75, marginBottom: 20 }}>{body}</p>
                  <span style={{ ...s, display: 'inline-block', border: `1px solid rgba(212,175,55,.4)`, borderRadius: 2, padding: '4px 12px', fontSize: '.65rem', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: C.goldL }}>{badge}</span>
                </motion.div>
              ))}
            </div>
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
                <motion.div key={i} variants={fadeUp} style={{ background: C.white, border: `1px solid rgba(212,175,55,.2)`, borderRadius: 8, padding: '28px 24px' }}>
                  <School size={24} color={C.gold} style={{ marginBottom: 12 }} />
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

      {/* TRANSPORT */}
      <section style={{ background: C.cream, padding: '96px 24px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <Reveal>
            <motion.div variants={fadeUp} style={{ textAlign: 'center', marginBottom: 56 }}>
              <Tag t="Getting Here" />
              <GoldRule />
              <h2 style={{ fontFamily: serif, fontWeight: 500, fontSize: 'clamp(2rem,3.5vw,3rem)', color: C.navy, letterSpacing: '-.02em', lineHeight: 1.1 }}>Easy to Reach</h2>
              <p style={{ ...s, fontSize: '.95rem', color: C.muted, marginTop: 14 }}>Convenient transport options for every family</p>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 2 }}>
              {transport.map(({ type, details, Icon }, i) => (
                <motion.div key={i} variants={fadeUp} style={{ background: C.white, border: `1px solid rgba(212,175,55,.18)`, padding: '40px 28px', textAlign: 'center' }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', border: `1px solid rgba(212,175,55,.3)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', background: 'rgba(212,175,55,.06)' }}>
                    <Icon size={22} color={C.gold} />
                  </div>
                  <h3 style={{ fontFamily: serif, fontSize: '1.2rem', fontWeight: 500, color: C.navy, marginBottom: 8 }}>{type}</h3>
                  <p style={{ ...s, fontSize: '.85rem', color: C.muted, lineHeight: 1.65 }}>{details}</p>
                </motion.div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* SUCCESS STORIES */}
      <section style={{ background: C.navy2, padding: '96px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '40%', height: '70%', background: `radial-gradient(ellipse,rgba(212,175,55,.07) 0%,transparent 70%)`, pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <Reveal>
            <motion.div variants={fadeUp} style={{ textAlign: 'center', marginBottom: 56 }}>
              <Tag t="Testimonials" light />
              <GoldRule />
              <h2 style={{ fontFamily: serif, fontWeight: 500, fontSize: 'clamp(2rem,3.8vw,3.4rem)', color: C.white, letterSpacing: '-.02em', lineHeight: 1.1 }}>
                Canley Heights<br /><em style={{ fontStyle: 'italic', color: C.goldL }}>Success Stories</em>
              </h2>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 24 }}>
              {stories.map((st, i) => (
                <motion.div key={i} variants={fadeUp} style={{ background: 'rgba(255,255,255,.04)', border: `1px solid rgba(212,175,55,.15)`, borderRadius: 10, padding: '40px 32px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <span style={{ ...s, fontSize: '.65rem', fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(212,175,55,.7)', border: `1px solid rgba(212,175,55,.25)`, borderRadius: 2, padding: '3px 10px' }}>{st.year}</span>
                    <div style={{ display: 'flex', gap: 2 }}>{[...Array(5)].map((_,j) => <Star key={j} size={13} fill="#FACC15" color="#FACC15" />)}</div>
                  </div>
                  <div style={{ fontFamily: serif, fontSize: '1.25rem', fontWeight: 500, color: C.white, marginBottom: 4 }}>{st.student}</div>
                  <div style={{ ...s, fontSize: '.78rem', color: 'rgba(247,244,238,.5)', marginBottom: 16 }}>{st.school}</div>
                  <div style={{ ...s, fontSize: '.88rem', fontWeight: 700, color: C.goldL, marginBottom: 16 }}>{st.result}</div>
                  <p style={{ fontFamily: serif, fontSize: '1.05rem', fontStyle: 'italic', color: 'rgba(247,244,238,.72)', lineHeight: 1.65, borderLeft: `2px solid rgba(212,175,55,.3)`, paddingLeft: 16 }}>
                    &ldquo;{st.quote}&rdquo;
                  </p>
                </motion.div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* PROGRAMS */}
      <section style={{ background: C.cream2, padding: '96px 24px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <Reveal>
            <motion.div variants={fadeUp} style={{ textAlign: 'center', marginBottom: 56 }}>
              <Tag t="Programs" />
              <GoldRule />
              <h2 style={{ fontFamily: serif, fontWeight: 500, fontSize: 'clamp(2rem,3.5vw,3rem)', color: C.navy, letterSpacing: '-.02em', lineHeight: 1.1 }}>Programs at Canley Heights</h2>
              <p style={{ ...s, fontSize: '.95rem', color: C.muted, marginTop: 14 }}>Comprehensive tutoring for all ages and stages</p>
            </motion.div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {programs.map((pr, i) => (
                <motion.div key={i} variants={fadeUp} style={{ background: C.white, border: `1px solid rgba(212,175,55,.2)`, borderRadius: 8, padding: '22px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <CheckCircle size={20} color="#22c55e" style={{ flexShrink: 0 }} />
                    <div>
                      <div style={{ fontFamily: serif, fontSize: '1.1rem', fontWeight: 500, color: C.navy }}>{pr.name}</div>
                      <div style={{ ...s, fontSize: '.78rem', color: C.muted, marginTop: 2 }}>{pr.avail}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {pr.popular && <span style={{ ...s, fontSize: '.62rem', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: C.gold, border: `1px solid rgba(212,175,55,.4)`, borderRadius: 2, padding: '3px 10px' }}>Popular</span>}
                    <button onClick={contactHref} style={{ ...s, background: 'transparent', color: C.navy, border: `1.5px solid rgba(10,27,52,.25)`, borderRadius: 3, padding: '7px 18px', fontSize: '.78rem', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', cursor: 'pointer' }}>Enquire</button>
                  </div>
                </motion.div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ABOUT */}
      <section style={{ background: C.cream, padding: '96px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <Reveal>
            <motion.div variants={fadeUp} style={{ border: `1px solid rgba(212,175,55,.25)`, borderRadius: 12, overflow: 'hidden', boxShadow: '0 12px 48px rgba(10,27,52,.08)' }}>
              <div style={{ background: C.navy, padding: '56px 48px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: '15%', right: '15%', height: 1, background: `linear-gradient(90deg,transparent,${C.gold},transparent)` }} />
                <Tag t="About the Centre" light />
                <h3 style={{ fontFamily: serif, fontWeight: 500, fontSize: 'clamp(1.6rem,3vw,2.4rem)', color: C.white, letterSpacing: '-.01em', lineHeight: 1.15, marginBottom: 20 }}>
                  DA Tuition <em style={{ fontStyle: 'italic', color: C.goldL }}>Canley Heights</em>
                </h3>
                <p style={{ ...s, fontSize: '.95rem', color: 'rgba(247,244,238,.7)', lineHeight: 1.8, marginBottom: 16 }}>
                  For nearly 20 years, DA Tuition Canley Heights has been the cornerstone of educational excellence in the Fairfield area — growing from a small tutoring service to the region's most trusted education provider, helping thousands of local students achieve their academic dreams.
                </p>
                <p style={{ ...s, fontSize: '.95rem', color: 'rgba(247,244,238,.7)', lineHeight: 1.8 }}>
                  Located in the heart of Canley Heights, we understand the unique needs of our multicultural community. Our teachers bring diverse perspectives that resonate deeply with local families.
                </p>
              </div>
              <div style={{ background: C.white, padding: '48px' }}>
                <h4 style={{ fontFamily: serif, fontWeight: 500, fontSize: '1.3rem', color: C.navy, marginBottom: 24 }}>What makes our centre special:</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {features.map((f, i) => (
                    <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                      <CheckCircle size={18} color={C.gold} style={{ flexShrink: 0, marginTop: 2 }} />
                      <span style={{ ...s, fontSize: '.92rem', color: C.muted, lineHeight: 1.65 }}>{f}</span>
                    </div>
                  ))}
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
