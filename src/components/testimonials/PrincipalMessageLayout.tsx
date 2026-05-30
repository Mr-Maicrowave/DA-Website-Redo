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
  pullQuotes: { text: string }[],
  startIndex = 0
) {
  const elements: React.ReactNode[] = [];
  let quoteIndex = startIndex;

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

export default function PrincipalMessageLayout({ testimonial }: Props) {
  const { title, subtitle, label, bodyParagraphs, pullQuotes, calloutBoxes, bottomQuote, bottomAuthor } = testimonial;

  const featuredQuote = pullQuotes[0] ?? null;
  const remainingQuotes = pullQuotes.slice(1);

  return (
    <article className="max-w-5xl mx-auto">
      <div className="bg-amber-50/30 rounded-xl p-6 md:p-10">
        <TestimonialHeader label={label} />

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{title}</h1>
        <p className="text-base text-stone-500 leading-relaxed mb-8">{subtitle}</p>

        {featuredQuote && (
          <div className="bg-amber-50 border border-amber-200 p-6 rounded-lg my-8">
            <p className="text-xs uppercase tracking-widest font-semibold text-amber-700 mb-3">
              A Truth Worth Remembering
            </p>
            <p className="text-xl md:text-2xl font-bold text-gray-900 leading-relaxed">
              {featuredQuote.text}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 lg:gap-12">
          <div>
            {interspersePullQuotes(bodyParagraphs, remainingQuotes, 0)}
          </div>

          <aside className="space-y-4">
            {calloutBoxes.map((box, i) => (
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
    </article>
  );
}
