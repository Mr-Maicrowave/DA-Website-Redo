import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, User, Search, ArrowRight, BookOpen } from 'lucide-react';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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

const Articles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('/articles/articles-index.json');
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
      <div className="min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-50">
        <NavigationNew />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-stone-200 border-t-brand-navy rounded-full animate-spin mx-auto mb-4" />
            <p className="text-stone-500">Loading articles...</p>
          </div>
        </div>
        <FooterNew />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-50">
      <SEO
        title="Articles & Insights"
        description="Expert educational guidance, ATAR strategies, and proven methodologies for academic excellence from DA Tuition."
        canonicalUrl="/articles"
      />
      <NavigationNew />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-[120px]">
        {/* Hero */}
        <section className="relative rounded-[2.5rem] overflow-hidden shadow-2xl mx-4 sm:mx-0 mt-6 mb-20">
          <div className="absolute inset-0">
            <img src="/images/programs/highschool-classroom-wide-1.jpg" alt="DA Tuition Articles" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-brand-navy/80 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-navy/90 via-amber-500/20 to-orange-500/30 mix-blend-overlay" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/60 to-transparent" />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto text-center py-12 sm:py-16 lg:py-24 px-6">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
              <BookOpen className="w-4 h-4 text-amber-300" />
              <span className="text-sm text-white/80 font-medium">{articles.length} Articles Published</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight drop-shadow-lg">
              Articles & <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-400">Insights</span>
            </h1>
            <p className="text-xl text-white/95 mb-6 max-w-2xl mx-auto drop-shadow-md font-medium">
              Expert educational guidance, ATAR strategies, and proven methodologies for academic excellence.
            </p>
          </div>
        </section>

        {/* ── Featured Hero Article ── */}
        {heroArticle && (
          <section className="mb-12 px-4 sm:px-0">
            <Link to={`/articles/${heroArticle.slug}`} className="block group">
              <div className="relative bg-brand-navy rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500 rounded-full blur-[100px]" />
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-blue rounded-full blur-[80px]" />
                </div>
                <div className="relative z-10 p-8 sm:p-10 lg:p-14">
                  <div className="flex items-center gap-3 mb-6">
                    <Badge className="bg-amber-400/20 text-amber-300 border-amber-400/30 text-xs">Featured</Badge>
                    <Badge className="bg-white/10 text-white/70 border-white/20 text-xs">{heroArticle.category}</Badge>
                    <span className="text-xs text-white/50 flex items-center gap-1"><Clock className="w-3 h-3" /> {heroArticle.readTime}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-4 leading-tight max-w-3xl group-hover:text-amber-100 transition-colors">
                    {heroArticle.title}
                  </h2>
                  <p className="text-white/70 text-base sm:text-lg max-w-2xl mb-6 leading-relaxed">{heroArticle.excerpt}</p>
                  <div className="flex items-center gap-6">
                    <span className="text-xs text-white/50 flex items-center gap-1"><User className="w-3 h-3" /> {heroArticle.author}</span>
                    <span className="text-xs text-white/50 flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(heroArticle.publishedDate).toLocaleDateString()}</span>
                    <span className="inline-flex items-center text-sm font-semibold text-amber-300 group-hover:text-amber-200 transition-colors ml-auto">
                      Read Article <ArrowRight className="ml-1.5 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* ── Secondary Featured (2-3 col, text-only cards with accent) ── */}
        {secondaryFeatured.length > 0 && (
          <section className="mb-16 px-4 sm:px-0">
            <div className="grid md:grid-cols-3 gap-6">
              {secondaryFeatured.map((article) => (
                <Link key={article.id} to={`/articles/${article.slug}`} className="block group">
                  <div className="relative h-full bg-white rounded-2xl border border-stone-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-stone-300">
                    <div className="h-1.5 bg-gradient-to-r from-brand-navy to-brand-blue" />
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Badge className="bg-stone-100 text-stone-600 border-stone-200/60 text-[10px] font-medium">{article.category}</Badge>
                        <span className="text-[10px] text-stone-400 ml-auto">{article.readTime}</span>
                      </div>
                      <h3 className="text-lg font-bold text-stone-900 mb-2 group-hover:text-brand-navy transition-colors leading-snug line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-stone-500 text-sm leading-relaxed mb-4 line-clamp-3">{article.excerpt}</p>
                      <div className="flex items-center justify-between text-xs text-stone-400 pt-3 border-t border-stone-100">
                        <span>{article.author}</span>
                        <span className="inline-flex items-center font-semibold text-brand-navy/70 group-hover:text-brand-navy transition-colors">
                          Read <span className="ml-1 group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── Divider ── */}
        <div className="my-16 flex items-center gap-4 px-4 sm:px-0">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent" />
          <span className="text-xs text-stone-400 font-medium uppercase tracking-widest">Browse All</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent" />
        </div>

        {/* ── Search and Category Filter ── */}
        <section className="mb-10 px-4 sm:px-0">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stone-400" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border-stone-200 rounded-xl focus:border-brand-navy/30"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-brand-navy text-white shadow-sm'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── Articles Grid (clean text-only cards) ── */}
        <section className="mb-16 px-4 sm:px-0">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-stone-400 text-lg mb-2">No articles found</p>
              <p className="text-stone-400 text-sm mb-6">Try adjusting your search terms or filter criteria</p>
              <Button onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }} variant="outline" className="rounded-xl">
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <Link key={article.id} to={`/articles/${article.slug}`} className="block group">
                  <div className="relative h-full bg-white rounded-xl border border-stone-200/80 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-stone-300">
                    <div className="h-1 bg-gradient-to-r from-brand-navy to-brand-blue" />
                    <div className="p-5 md:p-6 flex flex-col h-full">
                      <div className="flex items-center justify-between mb-3">
                        <Badge className="bg-stone-100 text-stone-500 border-stone-200/60 text-[10px] font-medium">{article.category}</Badge>
                        <span className="text-[11px] text-stone-400">{article.readTime}</span>
                      </div>
                      <h3 className="text-lg font-bold text-stone-900 mb-2 line-clamp-2 group-hover:text-brand-navy transition-colors leading-snug">
                        {article.title}
                      </h3>
                      <p className="text-stone-500 text-sm mb-4 line-clamp-2 flex-grow">{article.excerpt}</p>
                      <div className="flex items-center gap-2 flex-wrap mb-3">
                        {article.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="text-[10px] text-stone-400 bg-stone-50 px-2 py-0.5 rounded-full">#{tag}</span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-xs text-stone-400 pt-3 border-t border-stone-100">
                        <span className="flex items-center gap-1"><User className="w-3 h-3" /> {article.author}</span>
                        <span>{new Date(article.publishedDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>

      <CTASection
        heading="Need Personalized Educational Support?"
        subheading="Our experienced tutors provide personalized guidance tailored to your child's specific learning needs."
        className="bg-brand-navy"
      />

      <FooterNew />
    </div>
  );
};

export default Articles;
