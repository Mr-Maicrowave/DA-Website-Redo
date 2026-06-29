import { useState, useEffect, useRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, User, Search, ArrowRight, BookOpen } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SEO from '@/components/SEO';
import CTASection from '@/components/CTASection';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  category: string;
  publishedDate: string;
  readTime: string;
  featured: boolean;
  heroImage: string;
  tags: string[];
}

const C = {
  navy: '#0A1B34',
  navy2: '#0F2244',
  gold: '#D4AF37',
  goldL: '#F0C86A',
  cream: '#F7F4EE',
  cream2: '#EDE5D4',
  white: '#FAFAF8',
  muted: 'rgba(10,27,52,0.55)',
};

const serif = "'Cormorant Garamond', Georgia, serif";
const sans = "'DM Sans', 'Inter', sans-serif";
const goldRule = `linear-gradient(90deg,transparent,${C.gold},transparent)`;
const easeOut = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 34 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: easeOut } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const RevealGrid = ({ children, style }: { children: ReactNode; style: CSSProperties }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} variants={stagger} initial="hidden" animate={inView ? 'visible' : 'hidden'} style={style}>
      {children}
    </motion.div>
  );
};

const tagStyle = (light = false): CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  border: `1px solid ${light ? 'rgba(212,175,55,0.32)' : 'rgba(212,175,55,0.38)'}`,
  borderRadius: 999,
  color: light ? C.goldL : C.gold,
  fontFamily: sans,
  fontSize: '0.68rem',
  fontWeight: 700,
  letterSpacing: '0.12em',
  lineHeight: 1,
  padding: '0.48rem 0.7rem',
  textTransform: 'uppercase',
});

const metaStyle = (light = false): CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  color: light ? 'rgba(250,250,248,0.62)' : C.muted,
  fontFamily: sans,
  fontSize: '0.78rem',
});

const Articles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('/Articles/articles-index.json');
        const data = await response.json();
        const nonNewsletter = (data as Article[]).filter(a => a.category !== 'Newsletter');
        const cleaned = nonNewsletter.filter(a => a.slug !== 'high-achiever');
        cleaned.sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());
        setArticles(cleaned);
        setFilteredArticles(cleaned);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching articles:', error);
        setArticles([]);
        setFilteredArticles([]);
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  useEffect(() => {
    let filtered = articles;
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }
    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    setFilteredArticles(filtered);
  }, [articles, selectedCategory, searchTerm]);

  const categories = ['All', ...Array.from(new Set(articles.map(article => article.category)))];
  const featuredArticles = articles.filter(article => article.featured);
  const heroArticle = featuredArticles[0];
  const secondaryFeatured = featuredArticles.slice(1, 4);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: C.navy, color: C.white, fontFamily: sans }}>
        <NavigationNew />
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 120 }}>
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                border: `4px solid rgba(250,250,248,0.18)`,
                borderTopColor: C.gold,
                margin: '0 auto 18px',
                animation: 'spin 0.9s linear infinite',
              }}
            />
            <p style={{ color: 'rgba(250,250,248,0.72)', margin: 0 }}>Loading articles...</p>
          </div>
        </div>
        <style>{'@keyframes spin{to{transform:rotate(360deg)}}'}</style>
        <FooterNew />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: C.cream, color: C.navy, fontFamily: sans }}>
      <SEO
        title="Articles & Insights"
        description="Expert educational guidance, ATAR strategies, and proven methodologies for academic excellence from DA Tuition."
        canonicalUrl="/articles"
      />
      <NavigationNew />
      <style>{`
        @media (max-width: 640px) {
          [data-featured-article] { padding-right: 4.75rem !important; }
        }
      `}</style>

      <main style={{ maxWidth: 1400, margin: '0 auto', padding: '132px clamp(1rem,3vw,2rem) 0' }}>
        <section
          style={{
            position: 'relative',
            overflow: 'hidden',
            background: C.navy,
            borderRadius: 18,
            marginBottom: 'clamp(3.5rem,7vw,6rem)',
            padding: 'clamp(4.5rem,9vw,7.5rem) clamp(1.25rem,5vw,5rem)',
          }}
        >
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 38%, rgba(212,175,55,0.12), transparent 44%)' }} />
          <div style={{ position: 'absolute', inset: '0 0 auto', height: 1, background: goldRule }} />
          <div style={{ position: 'absolute', inset: 'auto 0 0', height: 1, background: goldRule }} />
          <div style={{ position: 'relative', zIndex: 1, maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
            <div style={{ ...tagStyle(true), gap: 8, marginBottom: 24 }}>
              <BookOpen size={15} />
              {articles.length} Articles Published
            </div>
            <h1
              style={{
                margin: '0 0 22px',
                color: C.white,
                fontFamily: serif,
                fontSize: 'clamp(3.4rem,8vw,6rem)',
                fontWeight: 500,
                letterSpacing: '-0.03em',
                lineHeight: 0.95,
                textWrap: 'balance',
              }}
            >
              Articles &{' '}
              <em style={{ color: C.gold, fontStyle: 'italic', fontWeight: 400 }}>Insights</em>
            </h1>
            <p style={{ maxWidth: 660, margin: '0 auto', color: 'rgba(250,250,248,0.76)', fontSize: '1.12rem', lineHeight: 1.75 }}>
              Expert educational guidance, ATAR strategies, and proven methodologies for academic excellence.
            </p>
          </div>
        </section>

        {heroArticle && (
          <section style={{ marginBottom: 48 }}>
            <Link to={`/articles/${heroArticle.slug}`} style={{ color: 'inherit', display: 'block', textDecoration: 'none' }}>
              <motion.article
                data-featured-article
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  background: C.navy2,
                  border: '1px solid rgba(212,175,55,0.18)',
                  borderRadius: 14,
                  padding: 'clamp(2rem,5vw,4rem)',
                }}
              >
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 84% 12%, rgba(212,175,55,0.11), transparent 34%)' }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 26 }}>
                    <span style={tagStyle(true)}>Featured</span>
                    <span style={tagStyle(true)}>{heroArticle.category}</span>
                    <span style={metaStyle(true)}><Clock size={13} /> {heroArticle.readTime}</span>
                  </div>
                  <h2
                    style={{
                      maxWidth: 860,
                      margin: '0 0 18px',
                      color: C.white,
                      fontFamily: serif,
                      fontSize: 'clamp(2rem,5vw,4rem)',
                      fontWeight: 500,
                      letterSpacing: '-0.02em',
                      lineHeight: 1.04,
                    }}
                  >
                    {heroArticle.title}
                  </h2>
                  <p style={{ maxWidth: 760, margin: '0 0 30px', color: 'rgba(250,250,248,0.7)', fontSize: '1.05rem', lineHeight: 1.75 }}>
                    {heroArticle.excerpt}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                    <span style={metaStyle(true)}><User size={13} /> {heroArticle.author}</span>
                    <span style={metaStyle(true)}><Calendar size={13} /> {new Date(heroArticle.publishedDate).toLocaleDateString()}</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: C.goldL, fontFamily: serif, fontSize: '1.2rem', fontStyle: 'italic', marginLeft: 'auto' }}>
                      Read Article <ArrowRight size={17} />
                    </span>
                  </div>
                </div>
              </motion.article>
            </Link>
          </section>
        )}

        {secondaryFeatured.length > 0 && (
          <section style={{ marginBottom: 'clamp(3.5rem,6vw,5rem)' }}>
            <RevealGrid style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 24 }}>
              {secondaryFeatured.map((article) => (
                <motion.div key={article.id} variants={fadeUp}>
                  <Link to={`/articles/${article.slug}`} style={{ color: 'inherit', display: 'block', height: '100%', textDecoration: 'none' }}>
                    <motion.article
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.2 }}
                      style={{ height: '100%', background: C.white, border: `1px solid rgba(212,175,55,0.16)`, borderRadius: 12, overflow: 'hidden' }}
                    >
                      <div style={{ height: 1, background: C.gold }} />
                      <div style={{ padding: 26 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                          <span style={tagStyle()}>{article.category}</span>
                          <span style={{ ...metaStyle(), marginLeft: 'auto', fontSize: '0.72rem' }}>{article.readTime}</span>
                        </div>
                        <h3 style={{ margin: '0 0 10px', fontFamily: serif, fontSize: '1.55rem', fontWeight: 600, lineHeight: 1.12, color: C.navy }}>
                          {article.title}
                        </h3>
                        <p style={{ margin: '0 0 20px', color: C.muted, fontSize: '0.95rem', lineHeight: 1.65 }}>
                          {article.excerpt}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, borderTop: `1px solid ${C.cream2}`, paddingTop: 16 }}>
                          <span style={metaStyle()}>{article.author}</span>
                          <span style={{ color: C.gold, fontFamily: serif, fontStyle: 'italic', fontWeight: 600 }}>Read <ArrowRight size={13} style={{ display: 'inline', verticalAlign: -2 }} /></span>
                        </div>
                      </div>
                    </motion.article>
                  </Link>
                </motion.div>
              ))}
            </RevealGrid>
          </section>
        )}

        <div style={{ margin: 'clamp(3.5rem,6vw,5rem) 0 34px', textAlign: 'center' }}>
          <div style={{ width: 52, height: 1, background: goldRule, margin: '0 auto 18px' }} />
          <span style={{ color: C.gold, fontFamily: sans, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
            Browse All
          </span>
        </div>

        <section style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 18, flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', width: 'min(100%, 360px)' }}>
              <Search size={17} style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: C.gold }} />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = C.gold;
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.18)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(212,175,55,0.22)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                style={{
                  height: 46,
                  width: '100%',
                  background: C.cream,
                  border: '1px solid rgba(212,175,55,0.22)',
                  borderRadius: 12,
                  color: C.navy,
                  fontFamily: sans,
                  paddingLeft: 42,
                }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              {categories.map((category) => {
                const isActive = selectedCategory === category;
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    type="button"
                    style={{
                      minHeight: 42,
                      border: `1px solid ${isActive ? C.navy : 'rgba(212,175,55,0.35)'}`,
                      borderRadius: 999,
                      background: isActive ? C.navy : C.cream,
                      color: isActive ? C.white : C.navy,
                      cursor: 'pointer',
                      fontFamily: sans,
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      padding: '0.65rem 1rem',
                    }}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section style={{ marginBottom: 'clamp(4rem,7vw,6rem)' }}>
          {filteredArticles.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4.5rem 1rem' }}>
              <p style={{ margin: '0 0 8px', color: C.navy, fontFamily: serif, fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: 500 }}>
                No articles found
              </p>
              <p style={{ margin: '0 0 28px', color: C.muted }}>Try adjusting your search terms or filter criteria.</p>
              <Button
                onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
                variant="outline"
                style={{ borderColor: C.gold, borderRadius: 999, color: C.navy, fontFamily: sans, fontWeight: 700 }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <RevealGrid style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 24 }}>
              {filteredArticles.map((article) => (
                <motion.div key={article.id} variants={fadeUp}>
                  <Link to={`/articles/${article.slug}`} style={{ color: 'inherit', display: 'block', height: '100%', textDecoration: 'none' }}>
                    <motion.article
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        background: C.white,
                        border: '1px solid rgba(212,175,55,0.2)',
                        borderRadius: 12,
                        overflow: 'hidden',
                      }}
                    >
                      <div style={{ height: 1, background: C.gold }} />
                      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: 24 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
                          <span style={tagStyle()}>{article.category}</span>
                          <span style={{ ...metaStyle(), fontSize: '0.72rem' }}>{article.readTime}</span>
                        </div>
                        <h3 style={{ margin: '0 0 10px', color: C.navy, fontFamily: serif, fontSize: '1.48rem', fontWeight: 600, lineHeight: 1.14 }}>
                          {article.title}
                        </h3>
                        <p style={{ flex: 1, margin: '0 0 18px', color: C.muted, fontSize: '0.95rem', lineHeight: 1.65 }}>
                          {article.excerpt}
                        </p>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                          {article.tags.slice(0, 2).map((tag) => (
                            <span key={tag} style={{ color: C.muted, fontSize: '0.72rem' }}>#{tag}</span>
                          ))}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, borderTop: `1px solid ${C.cream2}`, paddingTop: 14 }}>
                          <span style={metaStyle()}><User size={13} /> {article.author}</span>
                          <span style={{ ...metaStyle(), fontSize: '0.72rem' }}>{new Date(article.publishedDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </motion.article>
                  </Link>
                </motion.div>
              ))}
            </RevealGrid>
          )}
        </section>
      </main>

      <CTASection
        heading="Need guidance for your child?"
        subheading="Book an interview and we will help you find the right starting point."
        className="bg-brand-navy"
      />

      <FooterNew />
    </div>
  );
};

export default Articles;
