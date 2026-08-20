import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Sparkles, X } from 'lucide-react';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import SEO from '@/components/SEO';

type Story = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  image: string;
  pageCount: number;
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

const pageImage = (slug: string, page: number, total: number) => {
  const filePage = total >= 10 ? String(page).padStart(2, '0') : String(page);
  return `/Articles/newsletter-pages/${slug}/page-${filePage}.png`;
};

const featuredStories: Story[] = [
  {
    slug: 'principal-interview',
    title: 'Interview with the Principal',
    category: 'Inside DA',
    excerpt: 'Beyond the classroom: our Principal shares the thinking, values and purpose behind the DA Tuition experience.',
    image: '/Articles/images/newsletter/principal-interview-mic.png',
    pageCount: 5,
    layout: 'large',
  },
  {
    slug: 'teachers-tea-time',
    title: "Teacher's Tea Time: Writing with Gru-titude",
    category: 'Inside DA',
    excerpt: "How Mr Danny turns reluctant writers into students who believe their voice matters.",
    image: '/Articles/images/newsletter/teachers-tea-time.png',
    pageCount: 3,
  },
  {
    slug: 'the-journey',
    title: 'The Journey',
    category: 'Student Success',
    excerpt: 'A 99.25 ATAR story about perseverance, support, and believing achievement is possible.',
    image: '/Articles/images/newsletter/journey-path.png',
    pageCount: 1,
  },
];

const latestStories: Story[] = [
  {
    slug: 'outside-the-lines',
    title: 'All the Best Art Comes from Colouring Outside the Lines',
    category: 'Mindset',
    excerpt: 'A gentle challenge to escape the all-or-nothing trap and see mistakes as growth signals.',
    image: '/Articles/images/newsletter/outside-lines-stress.png',
    pageCount: 2,
    layout: 'wide',
  },
  {
    slug: 'phone-button',
    title: 'To Pick Up, or Not Pick Up the Phone?',
    category: 'Learning Strategies',
    excerpt: 'A student-facing look at dopamine, distraction, and the cost of constant stimulation.',
    image: '/Articles/images/newsletter/pick-up-phone.png',
    pageCount: 2,
    layout: 'text',
  },
  {
    slug: 'hsc-formula',
    title: 'The HSC Formula',
    category: 'Exam Prep',
    excerpt: 'A reflective guide to balancing hard work, vulnerability, and purpose through the HSC year.',
    image: '/Articles/images/newsletter/hsc-formula-ideas.png',
    pageCount: 1,
    layout: 'text',
  },
  {
    slug: 'resilience',
    title: 'Resilience... Resilience...',
    category: 'Student Life',
    excerpt: 'What bamboo, pressure, and recovery teach students about bending without breaking.',
    image: '/Articles/images/newsletter/resilience-study.png',
    pageCount: 1,
    layout: 'text',
  },
];

const guides: Story[] = [
  {
    slug: 'changing-perspectives',
    title: 'How Changing Perspectives Unlocks Your Potential',
    category: 'Mindset',
    excerpt: 'A practical reminder that failure is not the end of ability; it can be the start of a stronger method.',
    image: '/Articles/images/newsletter/changing-perspectives-key.png',
    pageCount: 2,
    layout: 'wide',
  },
  {
    slug: 'inner-writer',
    title: "Unlocking Your Child's Inner Writer: Tips for Success",
    category: 'Parent Guide',
    excerpt: 'Research-backed ways to turn blank-page frustration into confidence, choice, and creative momentum.',
    image: '/Articles/images/newsletter/inner-writer-parent-child.png',
    pageCount: 3,
    layout: 'wide',
  },
  {
    slug: 'learning-styles',
    title: 'Find Out More About Your Learning Style',
    category: 'Guide',
    excerpt: 'Visual, auditory, and kinaesthetic strategies that help students study in a way that actually sticks.',
    image: '/Articles/images/newsletter/learning-style-student.png',
    pageCount: 1,
  },
  {
    slug: 'high-achiever',
    title: 'High Achiever: Want to Be the Best?',
    category: 'Learning Strategies',
    excerpt: 'What top-performing students do differently, and how consistency becomes a craft.',
    image: '/Articles/images/newsletter/high-achiever-trophy.png',
    pageCount: 11,
  },
];

const ArticleCard = ({
  story,
  variant = 'standard',
  onOpen,
}: {
  story: Story;
  variant?: 'standard' | 'feature' | 'compact' | 'text';
  onOpen: (story: Story) => void;
}) => {
  const isText = variant === 'text';

  return (
    <button
      type="button"
      className={`newsletter-card newsletter-card--${variant}`}
      aria-label={`Preview ${story.title}`}
      onClick={() => onOpen(story)}
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
      </div>
    </button>
  );
};

const ArticlePreview = ({ story, onClose }: { story: Story; onClose: () => void }) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const movePreviewPage = (direction: 1 | -1) => {
      const scroller = scrollRef.current;
      if (!scroller) return;

      const pages = Array.from(scroller.querySelectorAll<HTMLElement>('.article-preview__page'));
      if (!pages.length) return;

      const currentIndex = pages.reduce(
        (closest, page, index) => {
          const distance = Math.abs(page.offsetTop - scroller.scrollTop);
          return distance < closest.distance ? { index, distance } : closest;
        },
        { index: 0, distance: Number.POSITIVE_INFINITY },
      ).index;

      const nextIndex = Math.min(Math.max(currentIndex + direction, 0), pages.length - 1);
      pages[nextIndex]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        event.preventDefault();
        movePreviewPage(1);
      }

      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        event.preventDefault();
        movePreviewPage(-1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="article-preview" role="dialog" aria-modal="true" aria-label={`${story.title} preview`} onClick={onClose}>
      <div className="article-preview__chrome" onClick={(event) => event.stopPropagation()}>
        <button type="button" aria-label="Close preview" onClick={onClose}>
          <X size={24} />
        </button>
      </div>

      <div className="article-preview__scroll" ref={scrollRef}>
        {Array.from({ length: story.pageCount }, (_, index) => {
          const page = index + 1;
          return (
            <section className="article-preview__page" key={`${story.slug}-${page}`} aria-label={`${story.title} page ${page}`}>
              <div className="article-preview__sheet" onClick={(event) => event.stopPropagation()}>
                <img src={pageImage(story.slug, page, story.pageCount)} alt={`${story.title} page ${page}`} />
                <p>{page} of {story.pageCount}</p>
              </div>
            </section>
          );
        })}

        <section className="article-preview__page article-preview__end" aria-label="End of preview">
          <div onClick={(event) => event.stopPropagation()}>
            <i aria-hidden="true" />
            <span>End of Preview</span>
            <h3>Discover More<br />With DA Tuition</h3>
            <p>Explore the full DA Tuition experience and discover how we can help you achieve your academic goals.</p>
            <a href="/book-interview">Book a Consultation <ArrowRight size={24} /></a>
          </div>
        </section>
      </div>
    </div>
  );
};

const Articles = () => {
  const [previewStory, setPreviewStory] = useState<Story | null>(null);

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
          </div>
          <div className="featured-grid">
            {featuredStories.map((story, index) => (
              <ArticleCard key={story.title} story={story} variant={index === 0 ? 'feature' : 'standard'} onOpen={setPreviewStory} />
            ))}
          </div>
        </section>

        <section id="latest" className="newsletter-section">
          <div className="section-heading">
            <h2>Latest News</h2>
          </div>
          <div className="latest-layout">
            <ArticleCard story={latestStories[0]} variant="feature" onOpen={setPreviewStory} />
            <div className="latest-stack">
              {latestStories.slice(1).map((story) => (
                <ArticleCard key={story.title} story={story} variant="text" onOpen={setPreviewStory} />
              ))}
            </div>
          </div>
        </section>

        <section id="guides" className="newsletter-section">
          <div className="section-heading">
            <h2>Practical Guides</h2>
          </div>
          <div className="guides-grid">
            {guides.map((story, index) => (
              <ArticleCard
                key={story.title}
                story={story}
                variant={story.layout === 'wide' && index < 2 ? 'compact' : story.layout === 'text' ? 'text' : 'standard'}
                onOpen={setPreviewStory}
              />
            ))}
          </div>
        </section>

        <section id="community" className="community-banner" aria-labelledby="community-title">
          <div className="community-book" aria-hidden="true">
            <img src="/Articles/images/newsletter/hero-book-closed.png" alt="" />
          </div>
          <div className="community-copy">
            <span>Stay inspired. Stay ahead.</span>
            <h2 id="community-title">Join the DA Tuition Community</h2>
            <p>Subscribe for DA newsletter updates to support your child's learning journey.</p>
            <form className="community-form">
              <label htmlFor="newsletter-email">Email address</label>
              <input id="newsletter-email" type="email" placeholder="Enter your email address" />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </section>
      </main>

      {previewStory && <ArticlePreview story={previewStory} onClose={() => setPreviewStory(null)} />}

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
          padding: 96px 0 42px;
        }

        .newsletter-masthead {
          position: relative;
          border-bottom: 4px solid ${C.ink};
          padding-bottom: 18px;
        }

        .newsletter-masthead h1 {
          margin: 18px 0 12px;
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
          grid-template-columns: auto 1fr;
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
          text-align: left;
          cursor: pointer;
          font: inherit;
          padding: 0;
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
          background: rgba(255, 255, 255, 0.24);
        }

        .newsletter-card__imageWrap {
          min-height: 230px;
          background: ${C.paperDeep};
        }

        .newsletter-card--feature .newsletter-card__imageWrap {
          min-height: 330px;
        }

        .featured-grid .newsletter-card__imageWrap {
          height: 330px;
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
          filter: saturate(1.04) contrast(1.02);
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

        .guides-grid {
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }

        .guides-grid .newsletter-card--compact {
          grid-column: span 2;
        }

        .community-banner {
          position: relative;
          display: grid;
          grid-template-columns: minmax(210px, 0.72fr) minmax(320px, 1.45fr);
          align-items: center;
          gap: clamp(1.5rem, 4vw, 3rem);
          overflow: hidden;
          margin: clamp(34px, 5vw, 54px) 0 20px;
          padding: clamp(1.25rem, 2.8vw, 2rem) clamp(2rem, 4vw, 3.25rem);
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
          display: grid;
          place-items: center;
          min-height: 190px;
        }

        .community-book img {
          width: min(40vw, 540px);
          height: auto;
          max-width: none;
          max-height: 460px;
          object-fit: contain;
          filter: drop-shadow(0 24px 32px rgba(0, 0, 0, 0.36)) saturate(1.08) contrast(1.04);
          mix-blend-mode: lighten;
          transform: translateX(-25%);
        }

        .community-copy {
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

        .article-preview {
          position: fixed;
          inset: 0;
          z-index: 2000;
          background:
            radial-gradient(circle at 18% 16%, rgba(122, 78, 132, 0.2), transparent 32%),
            rgba(3, 10, 20, 0.9);
          color: #fffaf0;
          backdrop-filter: blur(18px);
        }

        .article-preview__chrome {
          position: fixed;
          top: 16px;
          right: clamp(16px, 4vw, 54px);
          z-index: 3;
        }

        .article-preview__chrome button {
          display: grid;
          place-items: center;
          width: 46px;
          height: 46px;
          border: 1px solid rgba(255, 255, 255, 0.24);
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.08);
          color: #fffaf0;
          cursor: pointer;
        }

        .article-preview__scroll {
          height: 100vh;
          overflow-y: auto;
          overscroll-behavior: contain;
          scroll-snap-type: y mandatory;
          padding: 0 18px;
        }

        .article-preview__page {
          min-height: 100vh;
          display: grid;
          align-content: center;
          justify-items: center;
          gap: 8px;
          padding: 8px 0 22px;
          scroll-snap-align: start;
        }

        .article-preview__sheet {
          display: grid;
          justify-items: center;
          gap: 10px;
        }

        .article-preview__page img {
          width: auto;
          max-width: min(94vw, 980px);
          max-height: calc(100vh - 76px);
          object-fit: contain;
          background: white;
          box-shadow: 0 26px 80px rgba(0, 0, 0, 0.38);
        }

        .article-preview__page p {
          margin: 0;
          color: rgba(255, 250, 240, 0.72);
          font: 800 0.76rem ${sans};
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .article-preview__end > div {
          display: grid;
          justify-items: center;
          gap: clamp(0.55rem, 1.2vw, 0.95rem);
          width: min(620px, 84vw);
          min-height: min(360px, calc(100vh - 136px));
          padding: clamp(1.5rem, 3vw, 2.7rem);
          box-sizing: border-box;
          border: 1.5px solid rgba(227, 187, 102, 0.82);
          border-radius: 18px;
          background:
            radial-gradient(circle at 72% 4%, rgba(98, 142, 202, 0.45), transparent 24%),
            radial-gradient(circle at 50% 18%, rgba(227, 187, 102, 0.14), transparent 24%),
            linear-gradient(135deg, rgba(2, 15, 31, 0.98), rgba(10, 33, 62, 0.98) 58%, rgba(3, 20, 40, 0.98));
          text-align: center;
          color: #fffaf0;
          box-shadow:
            inset 0 0 80px rgba(255, 255, 255, 0.03),
            0 30px 90px rgba(0, 0, 0, 0.38);
        }

        .article-preview__end i {
          position: relative;
          width: min(210px, 42vw);
          height: 1px;
          margin-bottom: 0.25rem;
          background: linear-gradient(90deg, transparent, rgba(227, 187, 102, 0.58), transparent);
        }

        .article-preview__end i::after {
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #f5d27a;
          box-shadow: 0 0 22px rgba(245, 210, 122, 0.92);
          transform: translate(-50%, -50%) rotate(45deg);
        }

        .article-preview__end span {
          color: ${C.goldSoft};
          font-weight: 900;
          letter-spacing: 0.22em;
          text-transform: uppercase;
        }

        .article-preview__end h3 {
          margin: 0;
          max-width: 100%;
          font-family: ${serif};
          font-size: clamp(2rem, 4.5vw, 3.6rem);
          line-height: 0.95;
          font-weight: 500;
          letter-spacing: 0;
        }

        .article-preview__end p {
          width: min(100%, 520px);
          margin: 0;
          color: rgba(255, 250, 240, 0.78);
          font-size: clamp(0.8rem, 1.18vw, 0.95rem);
          line-height: 1.5;
          letter-spacing: 0;
          overflow-wrap: break-word;
          text-transform: none;
          text-wrap: balance;
        }

        .article-preview__end a {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          min-width: min(310px, 76vw);
          min-height: 52px;
          padding: 0 28px;
          border-radius: 999px;
          background: linear-gradient(135deg, #f7d982, #d2a232 58%, #b9841c);
          color: ${C.ink};
          font-weight: 900;
          font-size: clamp(0.92rem, 1.35vw, 1.05rem);
          text-decoration: none;
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.42),
            0 0 26px rgba(227, 187, 102, 0.42),
            0 18px 42px rgba(0, 0, 0, 0.22);
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
        }

        @media (max-width: 760px) {
          .newsletter-shell {
            width: min(100% - 24px, 1240px);
            padding-top: 88px;
          }

          .newsletter-tabs,
          .featured-grid,
          .guides-grid,
          .latest-layout,
          .community-banner {
            grid-template-columns: 1fr;
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
          .community-copy {
            grid-column: auto;
            grid-template-columns: 1fr;
          }

          .community-form {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Articles;
