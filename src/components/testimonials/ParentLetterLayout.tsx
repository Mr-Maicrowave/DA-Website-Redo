import { Testimonial } from '@/data/testimonials';
import CalloutBox from '@/components/testimonials/CalloutBox';
import PullQuote from '@/components/testimonials/PullQuote';
import BottomBanner from '@/components/testimonials/BottomBanner';
import TestimonialHeader from '@/components/testimonials/TestimonialHeader';

interface Props {
  testimonial: Testimonial;
}

function interspersePullQuotes(
  paragraphs: string[],
  pullQuotes: { text: string }[]
) {
  const elements: React.ReactNode[] = [];
  let quoteIndex = 0;

  for (let i = 0; i < paragraphs.length; i++) {
    elements.push(
      <p key={`p-${i}`} className="text-gray-700 leading-relaxed mb-4">
        {paragraphs[i]}
      </p>
    );
    if ((i + 1) % 3 === 0 && quoteIndex < pullQuotes.length) {
      elements.push(
        <PullQuote key={`pq-${quoteIndex}`} text={pullQuotes[quoteIndex].text} />
      );
      quoteIndex++;
    }
  }

  return elements;
}

export default function ParentLetterLayout({ testimonial }: Props) {
  const { title, subtitle, label, bodyParagraphs, pullQuotes, calloutBoxes, bottomQuote, bottomAuthor } = testimonial;

  const heroCallout = calloutBoxes[0] ?? null;
  const remainingCallouts = calloutBoxes.slice(1);

  return (
    <article className="max-w-5xl mx-auto">
      <div className="rounded-xl overflow-hidden">
        <div className="h-1.5 bg-brand-navy rounded-t-lg" />

        <div className="p-6 md:p-10">
          <TestimonialHeader label={label} />

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{title}</h1>
          <p className="text-base text-stone-500 leading-relaxed mb-8">{subtitle}</p>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 lg:gap-12">
            <div>
              {interspersePullQuotes(bodyParagraphs, pullQuotes)}
            </div>

            <aside className="space-y-4">
              {heroCallout && (
                <div className="bg-brand-navy text-white p-6 rounded-lg">
                  <p className="uppercase tracking-wider text-xs font-semibold text-blue-300 mb-3">
                    {heroCallout.header}
                  </p>
                  <p className="text-base leading-relaxed">{heroCallout.content}</p>
                </div>
              )}
              {remainingCallouts.map((box, i) => (
                <CalloutBox key={i} header={box.header} content={box.content} />
              ))}
            </aside>
          </div>

          {bottomQuote && (
            <div className="mt-10">
              <BottomBanner quote={bottomQuote} author={bottomAuthor} />
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
