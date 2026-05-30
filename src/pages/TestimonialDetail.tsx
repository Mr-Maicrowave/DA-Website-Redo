import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import { Link, useParams } from 'react-router-dom';
import SEO from '@/components/SEO';
import { testimonials } from '@/data/testimonials';
import PrincipalMessageLayout from '@/components/testimonials/PrincipalMessageLayout';
import ParentLetterLayout from '@/components/testimonials/ParentLetterLayout';
import StudentReviewLayout from '@/components/testimonials/StudentReviewLayout';

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

  const prev = index > 0 ? testimonials[index - 1] : null;
  const next = index < testimonials.length - 1 ? testimonials[index + 1] : null;

  return (
    <>
      <SEO
        title={testimonial.title}
        description={testimonial.subtitle}
        canonicalUrl={`/testimonials/${slug}`}
        ogType="article"
      />
      <NavigationNew />

      <div className="mt-[120px]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            to="/testimonials"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-800 transition-colors mb-8"
          >
            ← Back to Testimonials
          </Link>

          {testimonial.type === 'principal-message' && (
            <PrincipalMessageLayout testimonial={testimonial} />
          )}
          {testimonial.type === 'parent-letter' && (
            <ParentLetterLayout testimonial={testimonial} />
          )}
          {testimonial.type === 'student-review' && (
            <StudentReviewLayout testimonial={testimonial} />
          )}

          {(prev || next) && (
            <nav className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between gap-4">
              {prev ? (
                <Link
                  to={`/testimonials/${prev.slug}`}
                  className="text-sm text-gray-500 hover:text-gray-900 transition-colors max-w-xs"
                >
                  <span className="block text-xs uppercase tracking-wide text-gray-400 mb-1">Previous</span>
                  ← {prev.title}
                </Link>
              ) : (
                <div />
              )}
              {next ? (
                <Link
                  to={`/testimonials/${next.slug}`}
                  className="text-sm text-gray-500 hover:text-gray-900 transition-colors text-right max-w-xs"
                >
                  <span className="block text-xs uppercase tracking-wide text-gray-400 mb-1">Next</span>
                  {next.title} →
                </Link>
              ) : (
                <div />
              )}
            </nav>
          )}
        </div>
      </div>

      <FooterNew />
    </>
  );
};

export default TestimonialDetail;
