import SEO from '@/components/SEO';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import FAQAnswerDesk from '@/features/faq-answer-desk/FAQAnswerDesk';
import { allFaqQuestions } from '@/features/faq-answer-desk/faqData';
import { faqPageSchema } from '@/lib/seo/schema';

export default function FAQ() {
  return <div className="min-h-screen bg-brand-ivory">
    <SEO title="Frequently Asked Questions | DA Tuition" description="Clear answers about DA Tuition classes, fees, teachers, subjects, progress and getting started." canonicalUrl="/faq" jsonLd={faqPageSchema(allFaqQuestions.map(({ question, answer }) => ({ question, answer })))} />
    <NavigationNew />
    <FAQAnswerDesk />
    <FooterNew />
  </div>;
}
