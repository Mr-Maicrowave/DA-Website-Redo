import { useCallback, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Quote, X } from 'lucide-react';

type Subject = 'maths' | 'science';

type Review = {
  author: string;
  quote: string;
  source: string;
};

// Curated verbatim from src/data/DA Tuition Testimonials - Sheet1.csv.
const mathsReviews: Review[] = [
  {
    author: 'Albert Tran',
    source: 'Baulkham Hills High School · Year 12',
    quote: "Mr Bunsea is an awesome tutor who I was lucky enough to have to help me throughout the course of year 12 and the HSC. He is an extremely friendly and approachable tutor who was able to guide me through some of the most tedious and conceptually confusing 4U topics like conics and harder 3U, and even made me enjoy learning them. Whenever I was stuck on a difficult question in class, Mr Bunsea would always be able to help me understand it in a clear manner, allowing me to approach future questions in the same way. Even out of class he offered his help, as I was able to message him if I had any trouble with any questions, which was really useful especially during exam season and I greatly appreciated this. So it was with his help that I was actually able to get 100% on one of my 4U exams in year 12 at Baulkham Hills, as well as get the highest bands in both 3U and 4U for the HSC; and I can't thank him enough.",
  },
  {
    author: 'Amanda Vu',
    source: 'Student review',
    quote: "I have been attending DA tuition for almost 4 years now, and I have never felt more accomplished. Throughout these years, I have seen immense improvement in my schooling results. Originally I attended DA’s selective training class through years 5 - 6, then made my way up to GAT class through year 7. Then, I climbed my way up to ET class through years 8 and currently 9, proving my abilities with top marks and satisfactory results. ET class with Miss Linda is by far the best class I’ve been a part of because of the comfortable environment, and having a knowledgeable teacher that encourages me to do well. Miss Linda’s teaching style is extremely clear and easy to perceive, allowing me to understand content easily, and to apply it tangibly. I love how motivational she is too, encouraging us students to strive to accomplish academic goals as well as enjoying our years of youth. Thanks to Miss Linda, I have become more confident in my abilities and have been more motivated in DA and at school, due to the satisfying results I have accomplished through her guidance. In school I have been able to rank top 5 in the grade for every maths test this year (95% and above) and I couldn't be happier :). As for DA, I have been improving each week, ranking high for homework results as well as in class quizzes. I'm excited for another year at DA!",
  },
  {
    author: 'Andrew Nguyen',
    source: 'Student review',
    quote: 'da tuition is a place that really helped me improve. I went from not being able to do well on my maths test to getting over 80% each time. I am grateful for DA Tuition for helping me improve',
  },
];

const scienceReviews: Review[] = [
  {
    author: 'Huyen Nguyen',
    source: 'Student review',
    quote: 'I have had Mr Danny as my science teacher for about a year and a term now. Mr Danny is a helpful teacher and if I never turned to him for any of my assignments I’d probably fail science in general. Whenever I walk into class every Wednesday I come with a smile on my face expecting him to syringe me with helpful information.',
  },
  {
    author: 'Cindy Nguyen',
    source: 'Student review',
    quote: 'DA tuition has improved my marks drastically during a short amount of time. The teachers here give out very helpful resources such as detailed notes and practice questions and exams. They are also great at explaining complex ideas and concepts which I struggled to grasp before.\n\nI’ve been scoring higher marks in my Chemistry assessment tasks lately with the help of Mr Danny, who is a very friendly and funny teacher. :)\n\nAlso, Mr Bunsea, who is my Ext 2 Math teacher, explains difficult math concepts and questions very well. There’s not a single question he can’t answer!',
  },
  {
    author: 'Ashlee Nguyen',
    source: 'Student review',
    quote: 'Attending DA tuition was one of the best decisions as they are a friendly group of teachers who genuinely cares for the well being and education of their students. Their support has allowed me to achieve the best possible marks as they pushed me to reach my goals in my senior years. I attended their private maths, chemistry and physics classes where the teachers provided tips and tricks to answer complex questions which I was able to utilise during exams, resulting in better marks. I recommend attending this tutoring centre as they would provide good support to students wanting good atar.',
  },
];

const reviewSets = { maths: mathsReviews, science: scienceReviews } as const;

export function SubjectReviewCarousel({ subject }: { subject: Subject }) {
  const reviews = reviewSets[subject];
  const [activeIndex, setActiveIndex] = useState(0);
  const [isReading, setIsReading] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const review = reviews[activeIndex];
  const subjectLabel = subject === 'maths' ? 'Maths' : 'Science';

  const move = useCallback((offset: number) => {
    setIsReading(false);
    setActiveIndex((current) => (current + offset + reviews.length) % reviews.length);
  }, [reviews.length]);

  return (
    <section className="relative isolate overflow-hidden bg-[#041326] px-5 py-14 text-[#f7f5ef] sm:py-16 lg:px-8 lg:py-20" aria-labelledby={`${subject}-reviews-heading`}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(230,190,98,0.12),transparent_28%),linear-gradient(180deg,#041326_0%,#06182c_55%,#041326_100%)]" />
      <div className="relative mx-auto flex min-h-[min(44rem,calc(100svh-8rem))] max-w-[94rem] flex-col justify-center">
        <header className="mb-8 text-center sm:mb-10">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-[#d6a83e]">Real student reviews</p>
          <h2 id={`${subject}-reviews-heading`} className="font-serif text-[clamp(2.5rem,5vw,4.75rem)] font-medium leading-[1.04] tracking-[-0.04em]">
            Progress you can <em className="font-normal text-[#d6a83e]">see.</em><br />
            Confidence you can <em className="font-normal text-[#d6a83e]">feel.</em>
          </h2>
        </header>

        <div
          className="relative mx-auto flex w-full max-w-4xl items-center justify-center sm:px-12"
          aria-label={`${subjectLabel} student reviews`}
          onKeyDown={(event) => {
            if (event.key === 'ArrowLeft') move(-1);
            if (event.key === 'ArrowRight') move(1);
          }}
          onTouchStart={(event) => { touchStartX.current = event.touches[0]?.clientX ?? null; }}
          onTouchEnd={(event) => {
            const startX = touchStartX.current;
            const endX = event.changedTouches[0]?.clientX;
            touchStartX.current = null;
            if (startX !== null && endX !== undefined && Math.abs(startX - endX) > 44) move(startX > endX ? 1 : -1);
          }}
          tabIndex={0}
        >
          <button type="button" onClick={() => move(-1)} aria-label="Previous student review" className="absolute left-0 z-10 grid h-11 w-11 place-items-center rounded-full border border-[#d6a83e] bg-[#06182c] text-[#d6a83e] transition hover:scale-105 hover:text-[#e6be62] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e6be62] sm:h-14 sm:w-14">
            <ChevronLeft aria-hidden="true" />
          </button>

          <article className="relative flex min-h-[clamp(29rem,48svh,39rem)] w-[calc(100%-3rem)] flex-col rounded-2xl border border-[#d6a83e] bg-[linear-gradient(180deg,rgba(13,42,73,.98),rgba(8,28,52,.98))] px-7 py-9 text-center shadow-2xl shadow-black/30 sm:w-full sm:px-14 sm:py-12">
            <div className="pointer-events-none absolute inset-3 rounded-xl border border-[#e6be62]/75" />
            {isReading ? (
              <div className="relative flex h-full flex-1 flex-col text-left">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#d6a83e]">Full {subjectLabel} review</p>
                  <button type="button" onClick={() => setIsReading(false)} className="grid h-10 w-10 place-items-center rounded-full border border-[#d6a83e]/60 text-[#f7f5ef] hover:border-[#e6be62] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#e6be62]" aria-label="Back to review preview"><X aria-hidden="true" /></button>
                </div>
                <blockquote className="overflow-y-auto pr-2 font-serif text-lg leading-relaxed text-[#f7f5ef] sm:text-xl">“{review.quote}”</blockquote>
                <ReviewMeta review={review} />
              </div>
            ) : (
              <>
                <div className="relative flex justify-center"><Quote className="h-12 w-12 fill-[#d6a83e] text-[#d6a83e]" aria-hidden="true" /></div>
                <blockquote className="relative mx-auto mt-6 line-clamp-6 max-w-[32ch] font-serif text-[clamp(1.35rem,2.35vw,2rem)] italic leading-[1.38]">“{review.quote}”</blockquote>
                <button type="button" onClick={() => setIsReading(true)} className="relative mt-6 text-sm font-black uppercase tracking-[0.11em] text-[#d6a83e] transition hover:text-[#e6be62] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e6be62]">Read full review <span aria-hidden="true">→</span></button>
                <ReviewMeta review={review} />
              </>
            )}
          </article>

          <button type="button" onClick={() => move(1)} aria-label="Next student review" className="absolute right-0 z-10 grid h-11 w-11 place-items-center rounded-full border border-[#d6a83e] bg-[#06182c] text-[#d6a83e] transition hover:scale-105 hover:text-[#e6be62] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e6be62] sm:h-14 sm:w-14">
            <ChevronRight aria-hidden="true" />
          </button>
        </div>

        <div className="mt-7 flex justify-center gap-2" aria-label="Select a student review">
          {reviews.map((item, index) => <button key={item.author} type="button" onClick={() => { setIsReading(false); setActiveIndex(index); }} aria-label={`Show review from ${item.author}`} aria-current={index === activeIndex} className={`h-2.5 rounded-full transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e6be62] ${index === activeIndex ? 'w-7 bg-[#d6a83e]' : 'w-2.5 bg-[#6e87a5]'}`} />)}
        </div>
      </div>
    </section>
  );
}

function ReviewMeta({ review }: { review: Review }) {
  return <footer className="relative mt-auto pt-7 text-center"><div className="mx-auto mb-4 h-px w-12 bg-[#d6a83e]" /><p className="text-sm font-black uppercase tracking-[0.1em] text-[#d6a83e]">{review.author}</p><p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-[#f7f5ef]/65">{review.source}</p></footer>;
}
