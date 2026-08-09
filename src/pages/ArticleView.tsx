import { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Calendar, Clock, User, ArrowLeft, Share2, BookOpen } from 'lucide-react';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import SectionedMarkdown from '@/components/articles/SectionedMarkdown';
import SEO from '@/components/SEO';


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

const ArticleView = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);

  const onImgError = (e: any) => {
    const img = e.currentTarget as HTMLImageElement;
    if (!img || img.src.includes('/images/v3/collaborative_learning.jpg')) return;
    img.src = '/images/v3/collaborative_learning.jpg';
  };

  useEffect(() => {
    const fetchArticle = async () => {
      if (!slug) return;

      try {

        const indexResponse = await fetch('/Articles/articles-index.json');
        const articles: Article[] = await indexResponse.json();
        const foundArticle = articles.find(article => article.slug === slug);

        if (!foundArticle) {
          setError('Article not found');
          setLoading(false);
          return;
        }

        setArticle(foundArticle);

        const contentResponse = await fetch(`/Articles/${foundArticle.slug}.md`);
        const markdownContent = await contentResponse.text();
        setContent(markdownContent);

        const related = articles
          .filter(a => a.category === foundArticle.category && a.id !== foundArticle.id)
          .slice(0, 3);
        setRelatedArticles(related);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching article:', error);
        setError('Failed to load article');
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article?.title,
        text: article?.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Article link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <NavigationNew />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-brand-midnight/80">Loading article...</p>
          </div>
        </div>
        <FooterNew />
      </div>
    );
  }

  const StudyTipsHero = ({ title }: { title: string }) => (
    <div className="p-6 lg:p-10 font-fun">
      {/* Title stack */}
      <div className="text-center">
        <div className="text-xs sm:text-sm uppercase tracking-widest text-brand-midnight/80">STUDY SMARTER</div>
        <div className="text-4xl lg:text-5xl text-brand-midnight font-semibold mt-2">
          {title}
        </div>
        <div className="text-xl lg:text-2xl mt-1 text-brand-midnight/80">
          <span className="study-subhead-teal">Not Harder</span>
        </div>
      </div>

      {/* Tips banner */}
      <div className="study-banner rounded-xl py-3 text-center text-sm sm:text-base tracking-widest mt-6">
        TOP STRATEGIES TO BOOST RESULTS 📚
      </div>

      {/* Tip cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="rounded-2xl p-6 md:p-8 border shadow-sm study-card-blue">
          <h3 className="text-center font-semibold underline text-brand-midnight/80 mb-3">PLAN WITH INTENT</h3>
          <p className="text-brand-midnight">Chunk topics. Set small goals. Timebox with short breaks.</p>
        </div>
        <div className="rounded-2xl p-6 md:p-8 border shadow-sm study-card-mint">
          <h3 className="text-center font-semibold underline text-brand-midnight/80 mb-3">ACTIVE RECALL</h3>
          <p className="text-brand-midnight">Quiz yourself, teach a friend, and practise past papers.</p>
        </div>
        <div className="rounded-2xl p-6 md:p-8 border shadow-sm study-card-cream">
          <h3 className="text-center font-semibold underline text-brand-midnight/80 mb-3">CONSISTENCY</h3>
          <p className="text-brand-midnight">Short daily reps beat random cram sessions. Build momentum.</p>
        </div>
      </div>
    </div>
  );

  if (error || !article) {
    return <Navigate to="/articles" replace />;
  }

  const isAllOrNothing = article.slug === 'all-or-nothing';
  const isStudyTips = article.category === 'Study Tips' || (article as any)?.heroVariant === 'study-tips';

  // Generalized layout defaults by category
  const resolveLayoutDefaults = (category: string) => {
    switch (category) {
      case 'Study Tips':
        return { mode: 'cards' as const, theme: 'study' as const, splitBy: 'auto' as const, mergePrefaceWithFirst: true, maxParasPerCard: 2, maxCharsPerCard: 900 };
      case 'Mathematics':
        return { mode: 'cards' as const, theme: 'math' as const, splitBy: 'h2' as const, mergePrefaceWithFirst: false, maxParasPerCard: 2, maxCharsPerCard: 900 };
      case 'English':
        return { mode: 'cards' as const, theme: 'english' as const, splitBy: 'h2' as const, mergePrefaceWithFirst: false, maxParasPerCard: 3, maxCharsPerCard: 1200 };
      case 'Science':
        return { mode: 'cards' as const, theme: 'science' as const, splitBy: 'h2' as const, mergePrefaceWithFirst: false, maxParasPerCard: 2, maxCharsPerCard: 1000 };
      case 'Test Preparation':
        return { mode: 'cards' as const, theme: 'english' as const, splitBy: 'h2' as const, mergePrefaceWithFirst: false, maxParasPerCard: 6, maxCharsPerCard: 1800 };
      case 'Parenting Tips':
        return { mode: 'cards' as const, theme: 'parenting' as const, splitBy: 'auto' as const, mergePrefaceWithFirst: false, maxParasPerCard: 2, maxCharsPerCard: 1000 };
      case 'Mindset':
        return { mode: 'cards' as const, theme: 'english' as const, splitBy: 'auto' as const, mergePrefaceWithFirst: false, maxParasPerCard: 2, maxCharsPerCard: 900 };
      case 'Study Skills':
        return { mode: 'cards' as const, theme: 'english' as const, splitBy: 'h2' as const, mergePrefaceWithFirst: false, maxParasPerCard: 3, maxCharsPerCard: 1200 };
      case 'Reading Skills':
        return { mode: 'cards' as const, theme: 'english' as const, splitBy: 'h2' as const, mergePrefaceWithFirst: false, maxParasPerCard: 3, maxCharsPerCard: 1200 };
      case 'Project-Based Learning':
        return { mode: 'cards' as const, theme: 'science' as const, splitBy: 'h2' as const, mergePrefaceWithFirst: false, maxParasPerCard: 2, maxCharsPerCard: 1000 };
      case 'Student Transitions':
        return { mode: 'cards' as const, theme: 'parenting' as const, splitBy: 'h2' as const, mergePrefaceWithFirst: false, maxParasPerCard: 2, maxCharsPerCard: 1000 };
      default:
        return { mode: 'flow' as const, theme: 'neutral' as const, splitBy: 'auto' as const, mergePrefaceWithFirst: false };
    }
  };

  const layout = resolveLayoutDefaults(article.category);
  const hideTopMeta = !!layout.mergePrefaceWithFirst;

  // Reuse markdown renderers
  const markdownComponents = {
    h1: ({ children }: any) => (
      <h1 className="text-3xl font-bold text-brand-midnight mb-6 mt-8 first:mt-0">{children}</h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-2xl font-bold text-brand-midnight mb-4 mt-8">{children}</h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-xl font-bold text-brand-midnight mb-3 mt-6">{children}</h3>
    ),
    h4: ({ children }: any) => (
      <h4 className="text-lg font-bold text-brand-midnight mb-2 mt-4">{children}</h4>
    ),
    p: ({ children }: any) => (
      <p className="text-brand-midnight/80 leading-relaxed mb-4">{children}</p>
    ),
    ul: ({ children }: any) => (
      <ul className="list-disc list-outside ml-6 space-y-2 mb-6 text-brand-midnight/80">{children}</ul>
    ),
    ol: ({ children }: any) => (
      <ol className="list-decimal list-outside ml-6 space-y-2 mb-6 text-brand-midnight/80">{children}</ol>
    ),
    li: ({ children }: any) => <li className="leading-relaxed">{children}</li>,
    blockquote: ({ children }: any) => (
      <blockquote className="quote-callout">
        <div className="italic text-brand-midnight">{children}</div>
      </blockquote>
    ),
    code: ({ children }: any) => (
      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-brand-midnight">{children}</code>
    ),
    pre: ({ children }: any) => (
      <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-6">{children}</pre>
    ),
    strong: ({ children }: any) => <strong className="font-semibold text-brand-midnight">{children}</strong>,
    em: ({ children }: any) => <em className="italic text-brand-midnight">{children}</em>,
    a: ({ href, children }: any) => (
      <a
        href={href}
        className="text-blue-600 hover:text-blue-800 underline"
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    ),
    img: ({ src, alt }: React.PropsWithChildren<{ src?: string; alt?: string }>) => (
      <img src={src || ''} alt={alt || ''} className="w-full h-auto rounded-lg my-6" loading="lazy" onError={onImgError} />
    ),
    hr: () => <hr className="border-gray-200 my-8" />,
  } as const;

  const AllOrNothingContent = () => (
    <div className="p-6 lg:p-10 font-fun">
      {/* Title and quote */}
      <div className="relative text-center">
        <div className="absolute right-0 -top-2 text-xs sm:text-sm uppercase tracking-widest text-brand-midnight/80">“ALL THE BEST ART COMES FROM COLOURING OUTSIDE THE LINES”</div>
        <div className="text-5xl lg:text-6xl aon-green-text leading-none">THE</div>
        <div className="text-5xl lg:text-6xl text-brand-midnight italic mt-2">‘All or Nothing’</div>
        <div className="text-5xl lg:text-6xl aon-green-text mt-2">MENTALITY</div>
      </div>

      {/* Two columns section */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column: STUCK */}
        <div>
          <div className="text-3xl aon-subhead-blue mb-3">STUCK…</div>
          <div className="rounded-2xl p-6 md:p-8 border shadow-sm mb-6 aon-card-pink">
            <p className="text-brand-midnight leading-relaxed">
              Mistake, after mistake, after mistake. You pick yourself up again, and again. But still, you fall once more.
            </p>
            <p className="text-brand-midnight leading-relaxed mt-4">
              It becomes this cycle that has only one end in sight. In big, bolded letters at the very front of your mind, it shouts 'GIVE UP'. And so, like an easy escape, you do. You give up. You are only left to wonder what you have learnt or what you will do next. You feel empty, don't you?
            </p>
          </div>
        </div>

        {/* Right column: MEET NOVA */}
        <div>
          <div className="text-3xl aon-subhead-purple mb-3">MEET NOVA</div>
          <div className="rounded-2xl p-6 md:p-8 border shadow-sm mb-6 aon-card-yellow">
            <p className="text-brand-midnight leading-relaxed">
              My friend, Nova, loves to colour. In fact, she considers herself a professional!
            </p>
            <p className="text-brand-midnight leading-relaxed mt-4">
              However, one thing about Nova is that she follows a strict technique to avoid colouring out the lines. Nova always perfectly outlines her drawings first then colours in the gaps. Outline. Colour. Outline. Colour. Outline. Col-
            </p>
            <p className="text-brand-midnight leading-relaxed italic mt-4">
              ‘My image is ruined’. ‘I should never colour again’. ‘I am the worst artist in the world’.
            </p>
            <p className="text-brand-midnight leading-relaxed mt-4">
              These are the same exact thoughts that run through my head and most likely yours when we can’t seem to get something right. From there, we just want to give up.
            </p>
            <p className="text-brand-midnight leading-relaxed mt-4">
              But Nova realised that restarting her artwork would take longer than trying to find a quick solution to her issue.
            </p>
            <p className="text-brand-midnight leading-relaxed mt-4">
              Instead, with a few strokes, the red streak became the feature of her artwork. It was special!
            </p>
          </div>
        </div>
      </div>

      {/* Growing section */}
      <div className="mt-4 text-3xl aon-green-text">GROWING… 🐝</div>
      <div className="rounded-2xl p-6 md:p-8 border shadow-sm mb-6 aon-card-yellow mt-3">
        <p className="text-brand-midnight leading-relaxed">
          Just like Nova, the most talented people around you don't just make mistakes. They do not remain trapped in the 'All or Nothing' mindset. They make an effort to escape, embracing the small setbacks as a chance to learn so that the same mistake won’t happen again.
        </p>
        <p className="text-brand-midnight font-semibold text-center mt-4">Believe it or not, this can be YOU!</p>
      </div>

      {/* Escape banner */}
      <div className="text-center text-2xl tracking-widest text-blue-900/90 mb-4 aon-banner rounded-xl py-3">
        HOW YOU CAN ESCAPE THE ‘ALL OR NOTHING’ MENTALITY
      </div>

      {/* Four cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl p-6 md:p-8 border shadow-sm aon-card-pink">
          <h3 className="text-center font-semibold underline text-brand-midnight/80 mb-3">PRACTICE SELF-COMPASSION</h3>
          <p className="text-brand-midnight">It’s crucial to be kind to the people around you but don’t forget yourself.</p>
          <p className="text-brand-midnight mt-3">Allow yourself to make those mistakes without judgment or negative self-talk.</p>
        </div>
        <div className="rounded-2xl p-6 md:p-8 border shadow-sm aon-card-yellow">
          <h3 className="text-center font-semibold underline text-brand-midnight/80 mb-3">SPEAK TO THE PEOPLE AROUND YOU</h3>
          <p className="text-brand-midnight">A strong support network that recognises the ‘All or Nothing’ mentality is a barrier to success will assist you in detaching from such.</p>
          <p className="text-brand-midnight mt-3">I promise you that all tutors at DA make mistakes every single day, myself included, and from their personal experience, these mistakes have allowed them to grow into the incredible people they are.</p>
          <p className="text-brand-midnight mt-3">You are not defined by your mistakes.</p>
          <p className="text-brand-midnight mt-3">You are defined by the growth that comes from embracing and learning from them!</p>
        </div>
        <div className="rounded-2xl p-6 md:p-8 border shadow-sm aon-card-yellow">
          <h3 className="text-center font-semibold underline text-brand-midnight/80 mb-3">SHIFT YOUR FOCUS</h3>
          <p className="text-brand-midnight">It should never be ‘It’s too hard’, ‘I already suck at this’.</p>
          <p className="text-brand-midnight mt-3">Rather, focus on accepting your mistakes as you practice positive self-talk e.g. ‘With time & hard work, I will be able to achieve this’, ‘I just need more practice’.</p>
          <p className="text-brand-midnight mt-3">The way in which you speak to yourself before proceeding with something alters how your brain will think going into the activity. Thus, if you go into something already telling yourself that you can’t do it, your brain is ready to do so.</p>
        </div>
        <div className="rounded-2xl p-6 md:p-8 border shadow-sm aon-card-pink">
          <h3 className="text-center font-semibold underline text-brand-midnight/80 mb-3">SET SMALL GOALS</h3>
          <p className="text-brand-midnight">The harsh reality is that 99% of the time, you will never get things right the first go. So, you must <span className="font-semibold">aim for progress, not perfection.</span></p>
        </div>
      </div>

      {/* Footer bars */}
      <div className="text-center text-xl text-blue-900/90 mt-8">BECAUSE AT THE END OF THE DAY,</div>
      <div className="text-center text-2xl tracking-widest text-blue-900/90 mt-3 aon-footer-bar rounded-xl py-3">
        ALL THE BEST ART COMES FROM COLOURING OUTSIDE THE LINES.
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      {article && (
        <SEO
          title={article.title}
          description={article.excerpt}
          canonicalUrl={`/articles/${article.slug}`}
          ogType="article"
          ogImage={article.heroImage || undefined}
        />
      )}
      <NavigationNew />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link to="/articles" className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Articles</span>
          </Link>
        </div>

        <div className="mb-8">
          {!hideTopMeta && (
            <div className="flex items-center space-x-4 text-sm text-brand-midnight/70 mb-4">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">{article.category}</span>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(article.publishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{article.readTime}</span>
              </div>
            </div>
          )}

          {!isAllOrNothing && !hideTopMeta && (
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-4 text-brand-midnight">{article.title}</h1>
          )}

          {!hideTopMeta && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-brand-midnight/80">
                <User className="h-5 w-5" />
                <span className="font-medium">{article.author}</span>
              </div>

              <Button onClick={handleShare} variant="outline" size="sm" className="flex items-center space-x-2">
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </Button>
            </div>
          )}
        </div>

        <div className={`rounded-2xl shadow-sm border p-0 overflow-hidden ${isAllOrNothing ? 'border-blue-100 bg-white' : 'bg-white border-gray-100 p-8 lg:p-12'}`}>
          {!isAllOrNothing && !isStudyTips && article.heroImage && (
            <div className="mb-0">
              <img src={article.heroImage} alt={article.title} className="w-full h-auto object-cover" loading="eager" onError={onImgError} />
            </div>
          )}

          {isAllOrNothing ? (
            <AllOrNothingContent />
          ) : (
            <div className="prose prose-lg max-w-none p-8 lg:p-12 fade-in">
              {isStudyTips && <StudyTipsHero title={article.title} />}
              <SectionedMarkdown
                markdown={content}
                splitBy={layout.splitBy}
                mergePrefaceWithFirst={layout.mergePrefaceWithFirst}
                mode={layout.mode}
                theme={layout.theme}
                maxParasPerCard={(layout as any).maxParasPerCard}
                maxCharsPerCard={(layout as any).maxCharsPerCard}
                components={markdownComponents}
              />
            </div>
          )}
        </div>

        {article.tags.length > 0 && (
          <div className="mt-8">
            <h3 className="text-sm font-medium text-brand-midnight mb-3">Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span key={tag} className="bg-gray-100 text-brand-midnight/80 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-blue-200" />
          <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Our experienced tutors can help you apply these strategies and achieve your academic goals.
            Book an interview to create a personalized learning plan.
          </p>
          <Link to="/contact">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">Book Interview</Button>
          </Link>
        </div>
      </article>

      {relatedArticles.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-3xl font-bold text-brand-midnight mb-8">Related Articles</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedArticles.map((relatedArticle) => (
              <Link
                key={relatedArticle.id}
                to={`/articles/${relatedArticle.slug}`}
                className="group block bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <div className="text-3xl">
                    {relatedArticle.category === 'Mathematics' && '🧮'}
                    {relatedArticle.category === 'Study Tips' && '📚'}
                    {relatedArticle.category === 'Parenting Tips' && '👨‍👩‍👧‍👦'}
                    {!['Mathematics', 'Study Tips', 'Parenting Tips'].includes(relatedArticle.category) && '📄'}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between text-xs text-brand-midnight/70 mb-3">
                    <span className="bg-gray-100 text-brand-midnight/80 px-2 py-1 rounded-full font-medium">{relatedArticle.category}</span>
                    <span>{relatedArticle.readTime}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-brand-midnight mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">{relatedArticle.title}</h3>
                  <p className="text-brand-midnight/80 text-sm line-clamp-2">{relatedArticle.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <FooterNew />
    </div>
  );
};

export default ArticleView;
