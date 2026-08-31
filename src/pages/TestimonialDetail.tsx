import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import { Link, useParams } from 'react-router-dom';
import SEO from '@/components/SEO';
import { testimonials } from '@/data/testimonials';
import TestimonialStoryView from '@/components/testimonials/transformation/TestimonialStoryView';
import { useEffect } from 'react';

const TestimonialDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const index = testimonials.findIndex(t => t.slug === slug);
  const testimonial = index !== -1 ? testimonials[index] : null;

  if (!testimonial) {
    return (
      <>
        <NavigationNew />
        <div className="mt-[120px] max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Testimonial not found</h1>
          <p className="text-gray-600 mb-8">We could not find the testimonial you were looking for.</p>
          <Link to="/testimonials" className="text-brand-navy font-medium hover:underline">
            ← Back to Testimonials
          </Link>
        </div>
        <FooterNew />
      </>
    );
  }

  const prev = testimonials[(index - 1 + testimonials.length) % testimonials.length];
  const next = testimonials[(index + 1) % testimonials.length];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [slug]);

  return (
    <>
      <SEO
        title={testimonial.title}
        description={testimonial.subtitle}
        canonicalUrl={`/testimonials/${slug}`}
        ogType="article"
      />
      <NavigationNew />

      <div className="mt-[96px]">
        <div className="mx-auto px-3 sm:px-6 py-6">
          <Link
            to="/testimonials"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-800 transition-colors mb-8"
          >
            ← Back to Testimonials
          </Link>

          <TestimonialStoryView testimonial={testimonial} index={index} total={testimonials.length} previous={prev} next={next} />
        </div>
      </div>

      <FooterNew />
    </>
  );
};

export default TestimonialDetail;
