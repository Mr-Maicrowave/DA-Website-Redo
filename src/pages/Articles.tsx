import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, Search, Sparkles } from 'lucide-react';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import SEO from '@/components/SEO';

type Story = {
  title: string;
  category: string;
  excerpt: string;
  image: string;
  href: string;
  date: string;
  layout?: 'large' | 'wide' | 'small' | 'text';
};

const C = {
  navy: '#071b34',
  ink: '#0a1b34',
  gold: '#c7942d',
  goldSoft: '#e3bb66',
  paper: '#f6efe3',
  paperDeep: '#efe3d0',
  line: 'rgba(151, 104, 42, 0.28)',
  muted: '#536174',
};

const serif = "'Cormorant Garamond', Georgia, serif";
const sans = "'DM Sans', 'Inter', sans-serif";

const featuredStories: Story[] = [
  {
    title: 'The HSC Formula',
    category: 'Exam Prep',
    excerpt: 'A reflective guide to balancing hard work, vulnerability, and purpose through the HSC year.',
    image: '/Articles/images/newsletter/generated/hsc-formula.png',
    href: '/articles/hsc-formula',
    date: 'May 26, 2025',
    layout: 'large',
  },
  {
    title: 'The Journey',
    category: 'Student Success',
    excerpt: 'A 99.25 ATAR story about perseverance, support, and believing achievement is possible.',
    image: '/Articles/images/newsletter/generated/the-journey.png',
    href: '/articles/the-journey',
    date: 'May 26, 2025',
  },
  {
    title: 'High Achiever: Want to Be the Best?',
    category: 'Learning Strategies',
    excerpt: 'What top-performing students do differently, and how consistency becomes a craft.',
    image: '/Articles/images/newsletter/generated/high-achiever.png',
    href: '/articles/high-achiever',
    date: 'May 25, 2025',
  },
];

const latestStories: Story[] = [
  {
    title: 'How Changing Perspectives Unlocks Your Potential',
    category: 'Mindset',
    excerpt: 'A practical reminder that failure is not the end of ability; it can be the start of a stronger method.',
    image: '/Articles/images/newsletter/generated/changing-perspectives.png',
    href: '/articles/changing-perspectives',
    date: 'May 24, 2025',
    layout: 'wide',
  },
  {
    title: 'Resilience... Resilience...',
    category: 'Student Life',
    excerpt: 'What bamboo, pressure, and recovery teach students about bending without breaking.',
    image: '/Articles/images/newsletter/generated/resilience.png',
    href: '/articles/timeless-story',
    date: 'May 23, 2025',
    layout: 'text',
  },
  {
    title: 'To Pick Up, or Not Pick Up the Phone?',
    category: 'Learning Strategies',
    excerpt: 'A student-facing look at dopamine, distraction, and the cost of constant stimulation.',
    image: '/Articles/images/newsletter/generated/phone-button.png',
    href: '/articles/phone-button',
    date: 'May 23, 2025',
    layout: 'text',
  },
  {
    title: "Teacher's Tea Time: Writing with Gru-titude",
    category: 'Inside DA',
    excerpt: "How Mr Danny turns reluctant writers into students who believe their voice matters.",
    image: '/Articles/images/newsletter/generated/teachers-tea-time.png',
    href: '/articles/teachers-tea-time',
    date: 'May 22, 2025',
    layout: 'text',
  },
];

const guides: Story[] = [
  {
    title: "Unlocking Your Child's Inner Writer: Tips for Success",
    category: 'Parent Guide',
    excerpt: 'Research-backed ways to turn blank-page frustration into confidence, choice, and creative momentum.',
    image: '/Articles/images/newsletter/generated/inner-writer.png',
    href: '/articles/inner-writer',
    date: 'May 22, 2025',
    layout: 'wide',
  },
  {
    title: 'Find Out More About Your Learning Style',
    category: 'Guide',
    excerpt: 'Visual, auditory, and kinaesthetic strategies that help students study in a way that actually sticks.',
    image: '/Articles/images/newsletter/generated/learning-styles.png',
    href: '/articles/learning-styles',
    date: 'May 21, 2025',
    layout: 'wide',
  },
  {
    title: 'All the Best Art Comes from Colouring Outside the Lines',
    category: 'Mindset',
    excerpt: 'A gentle challenge to escape the all-or-nothing trap and see mistakes as growth signals.',
    image: '/Articles/images/newsletter/generated/all-or-nothing.png',
    href: '/articles/all-or-nothing',
    date: 'May 20, 2025',
  },
  {
    title: 'Interview with the Principal',
    category: 'Inside DA',
    excerpt: 'A DA Family HQ conversation about care, confidence, and why tutoring should feel personal.',
    image: '/Articles/images/newsletter/generated/principal-interview.png',
    href: '/about',
    date: 'May 19, 2025',
  },
  {
    title: 'Study Tips for Academic Success: A Guide for Students',
    category: 'Practical Guide',
    excerpt: 'Focused study habits that help students manage time, reduce stress, and build steady progress.',
    image: '/Articles/images/newsletter/generated/study-tips.png',
    href: '/articles/study-tips-for-success',
    date: 'May 18, 2025',
  },
  {
    title: 'NAPLAN Preparation: A Complete Guide for Students and Parents',
    category: 'Exam Prep',
    excerpt: 'A calm, structured guide to preparing with confidence instead of last-minute pressure.',
    image: '/Articles/images/newsletter/generated/naplan.png',
    href: '/articles/preparing-for-naplan',
    date: 'May 17, 2025',
  },
  {
    title: "Choosing the Right Tutor: A Parent's Complete Guide",
    category: 'Parent Guide',
    excerpt: 'How to identify teaching support that is caring, skilled, and genuinely useful for your child.',
    image: '/Articles/images/newsletter/generated/choosing-tutor.png',
    href: '/articles/choosing-right-tutor',
    date: 'May 16, 2025',
  },
  {
    title: 'Mastering Reading Comprehension: Strategies for Every Student',
    category: 'Guide',
    excerpt: 'Practical reading strategies that improve focus, inference, vocabulary, and analytical thinking.',
    image: '/Articles/images/newsletter/generated/reading-comprehension.png',
    href: '/articles/reading-comprehension-strategies',
    date: 'May 15, 2025',
    layout: 'text',
  },
];

const ArticleCard = ({ story, variant = 'standard' }: { story: Story; variant?: 'standard' | 'feature' | 'compact' | 'text' }) => {
  const isText = variant === 'text';
  return (
    <Link
      to={story.href}
      className={`newsletter-card newsletter-card--${variant}`}
      aria-label={`Read ${story.title}`}
    >
      {!isText && (
        <div className="newsletter-card__imageWrap">
          <img src={story.image} alt="" className="newsletter-card__image" loading="eager" />
        </div>
      )}
      <div className="newsletter-card__body">
        <span className="newsletter-card__category">{story.category}</span>
        <h3>{story.title}</h3>
        <p>{story.excerpt}</p>
        <div className="newsletter-card__meta">
          <span className="newsletter-card__mark">DA</span>
          <span>DA Tuition Team</span>
          <span aria-hidden="true">•</span>
          <span>{story.date}</span>
        </div>
      </div>
    </Link>
  );
};

const Articles = () => {
  return (
    <div className="newsletter-page">
      <SEO
        title="Articles & Guides"
        description="DA Tuition articles, guides, newsletter insights, exam strategies, and parent resources."
        canonicalUrl="/articles"
      />
      <NavigationNew />

      <main className="newsletter-shell">
        <header className="newsletter-masthead">
          <div className="newsletter-topbar">
            <span><CalendarDays size={16} /> Monday, May 26, 2025</span>
            <Link to="/" className="newsletter-brand" aria-label="DA Tuition home">
              <img src="/images/da-logo.png" alt="" />
              <strong>DA TUITION</strong>
            </Link>
            <span><Search size={16} /> Search</span>
          </div>
          <h1>DA NEWSLETTER</h1>
          <div className="newsletter-subtitle">
            <span />
            <p>Insights. Strategies. Success.</p>
            <span />
          </div>
          <nav aria-label="Newsletter categories" className="newsletter-tabs">
            <a href="#featured">Academics</a>
            <a href="#latest">Exam Prep</a>
            <a href="#guides">Learning Strategies</a>
            <a href="#guides">Student Life</a>
            <a href="#community">Parent Guide</a>
            <a href="#guides">Resources</a>
          </nav>
        </header>

        <section id="featured" className="newsletter-section">
          <div className="section-heading">
            <h2><Sparkles size={21} /> Featured Stories</h2>
            <Link to="/articles/hsc-formula">View all features <ArrowRight size={16} /></Link>
          </div>
          <div className="featured-grid">
            {featuredStories.map((story, index) => (
              <ArticleCard key={story.title} story={story} variant={index === 0 ? 'feature' : 'standard'} />
            ))}
          </div>
        </section>

        <section id="latest" className="newsletter-section">
          <div className="section-heading">
            <h2>Latest News</h2>
            <Link to="/articles/high-achiever">View all news <ArrowRight size={16} /></Link>
          </div>
          <div className="latest-layout">
            <ArticleCard story={latestStories[0]} variant="feature" />
            <div className="latest-stack">
              {latestStories.slice(1).map((story) => (
                <ArticleCard key={story.title} story={story} variant="text" />
              ))}
            </div>
          </div>
        </section>

        <section id="guides" className="newsletter-section">
          <div className="section-heading">
            <h2>Practical Guides</h2>
            <Link to="/articles/inner-writer">View all guides <ArrowRight size={16} /></Link>
          </div>
          <div className="guides-grid">
            {guides.map((story, index) => (
              <ArticleCard
                key={story.title}
                story={story}
                variant={story.layout === 'wide' && index < 2 ? 'compact' : story.layout === 'text' ? 'text' : 'standard'}
              />
            ))}
          </div>
        </section>

        <section id="community" className="community-banner" aria-labelledby="community-title">
          <div className="community-book" aria-hidden="true">
            <img src="/Articles/images/newsletter/da-community-book.png" alt="" />
          </div>
          <div className="community-copy">
            <span>Stay inspired. Stay ahead.</span>
            <h2 id="community-title">Join the DA Tuition Community</h2>
            <p>Subscribe for expert insights, practical guides, and updates to support your child's learning journey.</p>
            <form className="community-form">
              <label htmlFor="newsletter-email">Email address</label>
              <input id="newsletter-email" type="email" placeholder="Enter your email address" />
              <button type="submit">Subscribe</button>
            </form>
          </div>
          <div className="community-badges" aria-hidden="true">
            <span>Expert Insights</span>
            <span>Practical Strategies</span>
            <span>Student Success Stories</span>
          </div>
        </section>
      </main>

      <FooterNew />

      <style>{`
        .newsletter-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at 8% 10%, rgba(212, 175, 55, 0.13), transparent 28%),
            linear-gradient(180deg, #fbf4e7 0%, ${C.paper} 42%, #f8eedf 100%);
          color: ${C.ink};
          font-family: ${sans};
        }

        .newsletter-shell {
          width: min(1240px, calc(100% - 40px));
          margin: 0 auto;
          padding: 118px 0 42px;
        }

        .newsletter-masthead {
          position: relative;
          border-bottom: 4px solid ${C.ink};
          padding-bottom: 18px;
        }

        .newsletter-topbar {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 18px;
          border-bottom: 1px solid ${C.line};
          padding-bottom: 16px;
          font-size: 0.9rem;
          color: ${C.ink};
        }

        .newsletter-topbar > span {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .newsletter-topbar > span:last-child {
          justify-self: end;
        }

        .newsletter-brand {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          color: ${C.ink};
          font-weight: 900;
          letter-spacing: 0.08em;
        }

        .newsletter-brand img {
          width: 46px;
          height: 46px;
          object-fit: contain;
        }

        .newsletter-masthead h1 {
          margin: 34px 0 12px;
          text-align: center;
          font-family: ${serif};
          font-size: clamp(4.2rem, 11.5vw, 10rem);
          font-weight: 700;
          line-height: 0.8;
          letter-spacing: 0.015em;
          color: ${C.navy};
        }

        .newsletter-subtitle {
          display: grid;
          grid-template-columns: minmax(40px, 1fr) auto minmax(40px, 1fr);
          align-items: center;
          gap: 24px;
          margin: 0 auto 26px;
          max-width: 820px;
        }

        .newsletter-subtitle span {
          height: 2px;
          background: linear-gradient(90deg, transparent, ${C.gold});
        }

        .newsletter-subtitle span:last-child {
          background: linear-gradient(90deg, ${C.gold}, transparent);
        }

        .newsletter-subtitle p {
          margin: 0;
          color: ${C.gold};
          font-weight: 900;
          letter-spacing: 0.32em;
          text-transform: uppercase;
        }

        .newsletter-tabs {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          border-top: 1px solid ${C.ink};
          padding-top: 14px;
          gap: 10px;
          text-align: center;
        }

        .newsletter-tabs a {
          color: ${C.ink};
          font-family: ${serif};
          font-weight: 700;
          text-decoration: none;
          text-transform: uppercase;
          font-size: 0.83rem;
          letter-spacing: 0.04em;
        }

        .newsletter-section {
          margin-top: clamp(38px, 6vw, 70px);
        }

        .section-heading {
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 18px;
          margin-bottom: 22px;
        }

        .section-heading::after {
          content: '';
          height: 1px;
          background: ${C.line};
          grid-column: 2;
          grid-row: 1;
        }

        .section-heading h2 {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin: 0;
          font-family: ${serif};
          color: ${C.navy};
          font-size: clamp(1.9rem, 4vw, 2.9rem);
          line-height: 0.95;
          text-transform: uppercase;
        }

        .section-heading a {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #a66316;
          font-family: ${serif};
          font-size: 1rem;
          text-decoration: none;
        }

        .featured-grid,
        .guides-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 20px;
        }

        .latest-layout {
          display: grid;
          grid-template-columns: minmax(0, 1.25fr) minmax(320px, 0.85fr);
          gap: 24px;
        }

        .latest-stack {
          display: grid;
          gap: 0;
          border-top: 1px solid ${C.line};
        }

        .newsletter-card {
          display: flex;
          min-width: 0;
          overflow: hidden;
          border: 1px solid ${C.line};
          background: rgba(255, 252, 245, 0.72);
          color: ${C.ink};
          text-decoration: none;
          transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease;
        }

        .newsletter-card:hover {
          transform: translateY(-4px);
          border-color: rgba(199, 148, 45, 0.62);
          box-shadow: 0 18px 42px rgba(48, 34, 12, 0.14);
        }

        .newsletter-card--standard,
        .newsletter-card--feature {
          flex-direction: column;
        }

        .newsletter-card--feature:first-child {
          grid-column: span 1;
        }

        .newsletter-card--compact {
          grid-column: span 1;
          min-height: 320px;
        }

        .newsletter-card--compact,
        .newsletter-card--text {
          display: grid;
          grid-template-columns: 0.95fr 1fr;
        }

        .newsletter-card--text {
          grid-template-columns: 1fr;
          border-width: 0 0 1px;
          background: transparent;
        }

        .newsletter-card--text:hover {
          transform: none;
          box-shadow: none;
          background: rgba(255,255,255,0.24);
        }

        .newsletter-card__imageWrap {
          min-height: 230px;
          background: ${C.paperDeep};
        }

        .newsletter-card--feature .newsletter-card__imageWrap {
          min-height: 330px;
        }

        .newsletter-card--compact .newsletter-card__imageWrap {
          min-height: 100%;
        }

        .newsletter-card__image {
          width: 100%;
          height: 100%;
          min-height: inherit;
          display: block;
          object-fit: cover;
        }

        .newsletter-card__body {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: clamp(1.1rem, 2.3vw, 1.75rem);
        }

        .newsletter-card__category {
          color: #a66316;
          font-size: 0.72rem;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .newsletter-card h3 {
          margin: 0;
          color: ${C.navy};
          font-family: ${serif};
          font-size: clamp(1.45rem, 2.6vw, 2.35rem);
          font-weight: 700;
          line-height: 1.04;
        }

        .newsletter-card--text h3 {
          font-size: clamp(1.25rem, 2vw, 1.7rem);
        }

        .newsletter-card p {
          margin: 0;
          color: ${C.muted};
          font-size: 0.98rem;
          line-height: 1.58;
        }

        .newsletter-card__meta {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: auto;
          color: ${C.ink};
          font-family: ${serif};
          font-size: 0.92rem;
        }

        .newsletter-card__mark {
          display: inline-grid;
          place-items: center;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: ${C.navy};
          color: ${C.goldSoft};
          font-family: ${serif};
          font-size: 0.76rem;
          font-weight: 800;
        }

        .guides-grid {
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }

        .guides-grid .newsletter-card--compact {
          grid-column: span 2;
        }

        .community-banner {
          position: relative;
          display: grid;
          grid-template-columns: minmax(180px, 0.8fr) minmax(320px, 1.4fr) auto;
          align-items: center;
          gap: clamp(1.5rem, 4vw, 3rem);
          overflow: hidden;
          margin: clamp(46px, 7vw, 78px) 0 20px;
          padding: clamp(2rem, 4vw, 3.25rem);
          border-radius: 10px;
          background:
            radial-gradient(circle at 16% 26%, rgba(227, 187, 102, 0.2), transparent 28%),
            linear-gradient(135deg, #071b34 0%, #102a4a 58%, #071b34 100%);
          color: #fffaf0;
        }

        .community-banner::after {
          content: '';
          position: absolute;
          inset: 12px;
          border: 1px solid rgba(227, 187, 102, 0.24);
          border-radius: 8px;
          pointer-events: none;
        }

        .community-book {
          position: relative;
          z-index: 1;
          align-self: stretch;
          min-height: 210px;
          border-radius: 8px;
          overflow: hidden;
        }

        .community-book img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: 54% 48%;
          filter: saturate(1.06) contrast(1.03);
        }

        .community-copy,
        .community-badges {
          position: relative;
          z-index: 1;
        }

        .community-copy > span {
          color: ${C.goldSoft};
          font-size: 0.78rem;
          font-weight: 900;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        .community-copy h2 {
          margin: 0.55rem 0 0.5rem;
          font-family: ${serif};
          font-size: clamp(2rem, 4vw, 3.3rem);
          font-weight: 600;
          line-height: 0.98;
        }

        .community-copy p {
          max-width: 620px;
          margin: 0 0 1.3rem;
          color: rgba(255,250,240,0.78);
          line-height: 1.6;
        }

        .community-form {
          display: grid;
          grid-template-columns: minmax(180px, 1fr) auto;
          gap: 12px;
          max-width: 580px;
        }

        .community-form label {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip: rect(0 0 0 0);
        }

        .community-form input {
          min-height: 48px;
          border: 1px solid rgba(227,187,102,0.34);
          border-radius: 5px;
          background: #fffaf0;
          color: ${C.ink};
          padding: 0 16px;
          font: 600 0.96rem ${sans};
        }

        .community-form button {
          min-height: 48px;
          border: 0;
          border-radius: 5px;
          background: linear-gradient(135deg, #f0c66b, #c7942d);
          color: ${C.ink};
          cursor: pointer;
          font: 900 0.95rem ${sans};
          padding: 0 26px;
        }

        .community-badges {
          display: grid;
          gap: 13px;
          color: rgba(255,250,240,0.8);
          font-size: 0.88rem;
        }

        .community-badges span {
          border-left: 1px solid ${C.goldSoft};
          padding-left: 14px;
        }

        @media (max-width: 1060px) {
          .featured-grid,
          .guides-grid,
          .latest-layout,
          .community-banner {
            grid-template-columns: 1fr 1fr;
          }

          .latest-stack,
          .guides-grid .newsletter-card--compact,
          .community-copy {
            grid-column: span 2;
          }

          .community-badges {
            grid-column: span 2;
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 760px) {
          .newsletter-shell {
            width: min(100% - 24px, 1240px);
            padding-top: 98px;
          }

          .newsletter-topbar,
          .newsletter-tabs,
          .featured-grid,
          .guides-grid,
          .latest-layout,
          .community-banner {
            grid-template-columns: 1fr;
          }

          .newsletter-topbar > span,
          .newsletter-topbar > span:last-child {
            justify-self: center;
          }

          .newsletter-tabs {
            grid-template-columns: repeat(2, 1fr);
          }

          .section-heading {
            grid-template-columns: 1fr;
          }

          .section-heading::after {
            display: none;
          }

          .newsletter-card--compact,
          .newsletter-card--text,
          .guides-grid .newsletter-card--compact,
          .latest-stack,
          .community-copy,
          .community-badges {
            grid-column: auto;
            grid-template-columns: 1fr;
          }

          .community-form,
          .community-badges {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Articles;
