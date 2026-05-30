import { useEffect } from 'react';

interface NewsletterSEOProps {
  title: string;
  content: string;
  excerpt: string;
  date: string;
  topics: string[];
  author: string;
}

const NewsletterSEO = ({ title, content, excerpt, date, topics, author }: NewsletterSEOProps) => {
  useEffect(() => {
    // Add structured data for SEO
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": title,
      "description": excerpt,
      "datePublished": date,
      "author": {
        "@type": "Organization",
        "name": author
      },
      "publisher": {
        "@type": "Organization",
        "name": "DA Tuition",
        "logo": {
          "@type": "ImageObject",
          "url": "https://da-tuition.com/logo.png"
        }
      },
      "keywords": topics.join(", "),
      "articleBody": content
    });
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [title, content, excerpt, date, topics, author]);

  return (
    <>
      {/* SEO-friendly content (hidden visually but readable by search engines) */}
      <div className="sr-only" aria-hidden="false">
        <h1>{title}</h1>
        <p>{excerpt}</p>
        <div>{content}</div>
        <div>Topics: {topics.join(', ')}</div>
        <div>Published: {date}</div>
        <div>Author: {author}</div>
      </div>

      {/* Meta tags for SEO */}
      <meta name="description" content={excerpt} />
      <meta name="keywords" content={topics.join(', ')} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={excerpt} />
      <meta property="og:type" content="article" />
      <meta property="article:published_time" content={date} />
      <meta property="article:author" content={author} />
      {topics.map((topic, index) => (
        <meta key={index} property="article:tag" content={topic} />
      ))}
    </>
  );
};

export default NewsletterSEO;