import { ArrowLeft, ArrowRight, Quote, User, Star, MessageCircle, ChevronRight, Mic } from 'lucide-react';
import { Link } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import SEO from '@/components/SEO';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import { siteStats } from '@/data/site-stats';
import { cn } from '@/lib/utils';

const Interview = () => {
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const questions = [
    {
      question: "What inspired you to start this tutoring school, and what is the school's mission?",
      answer: `From the very beginning, my vision has always been to create a sanctuary where every child feels seen, valued, and capable of achieving their fullest potential. Witnessing so many children lose confidence due to feeling unsupported or overwhelmed inspired me to establish a school that goes beyond academics.

I dreamed of a nurturing environment where students could rediscover their voice, believe in themselves, and transform impossibilities into achievements. Through love, care and devotion, we strive to show that with the right emotional guidance, every goal is attainable.

Our mission has always been to walk alongside students on their journey, helping them overcome challenges while knowing they are never alone.`,
      pullQuote: "Every child deserves to feel seen, valued, and capable of achieving their fullest potential."
    },
    {
      question: "What sets this tutoring school apart from others?",
      answer: `What makes our tutoring school truly special is the heart behind everything we do. We have incredible teachers and genuine care we pour into every single child's journey.

With over 20 years of teaching experience, I've learnt that every child is unique. We meet them where they are, celebrate their wins, guide them through challenges, and remind them every day that they're capable of extraordinary things.

There are no entrance exams here, no barriers about who can or can't learn with us.

If a child wants to grow, succeed, and needs support, they are always welcome. This commitment means we take on challenges and help those who have lost hope or feel like giving up. It's a responsibility we embrace, and it fills me with pride to see the dedication of our team.

Our tutors work tirelessly, and their talent shines through in every success, whether it's a perfect HSC score, a state ranking, or a child discovering a newfound confidence they never thought possible.

We don't believe in one-size-fits-all methods because every child's journey is different. Instead, we personalise every class to address their specific needs, helping them build a strong foundation and lasting confidence. Each lesson is crafted with care, ensuring it's not only useful but also inspiring and engaging. And when it comes to school assessments, it's a partnership between teacher and student that leads to outstanding results.`,
      pullQuote: "We meet them where they are, celebrate their wins, and guide them through challenges."
    },
    {
      question: "How do you ensure the quality of teaching at your school?",
      answer: `I make sure that we all hold ourselves to the highest standards. Our teachers are the backbone of our school, and they undergo an extensive screening and training process before joining us. But beyond their qualifications, it's their heart and dedication that shine. They go above and beyond to ensure each child feels supported and challenged in the right way. We also provide continuous professional development and encourage collaboration among our staff to keep our methods fresh and effective.`,
      pullQuote: "Beyond qualifications, it's their heart and dedication that shine."
    },
    {
      question: "Can you share a success story of a student who achieved their dreams with your help?",
      answer: `One story that still brings me to tears is a student who came to us struggling with self-doubt and low grades. He felt defeated, like he couldn't measure up to his peers. Through consistent guidance, encouragement, and a lot of heart-to-heart conversations, we began to see a transformation. That student not only improved academically but also blossomed into a confident, motivated individual. Today, he's a specialist doctor, and his parents still write to us, thanking our team for believing in their child when it mattered most. Stories like these remind us why we do what we do.`,
      pullQuote: "Stories like these remind us why we do what we do."
    },
    {
      question: "What role do values like empathy and encouragement play in your approach to education?",
      answer: `Empathy is at the heart of everything we do. We recognise that academic challenges can be overwhelming, and students need a safe space to express their worries. Encouragement helps them see that mistakes are part of growth, building resilience and self-belief.

We often remind our students that stumbling is okay, rather it's about how you rise afterward. By focusing on their strengths and helping them tackle weaknesses with patience, we instil confidence and optimism that extend far beyond the classroom.`,
      pullQuote: "Empathy is at the heart of everything we do."
    },
    {
      question: "How does your school help students manage the stress of academic pressure?",
      answer: `We know how heavy academic pressure can feel, and that's why we work hard to make our school a haven for students. We teach them strategies to manage their workload, break tasks into achievable steps, and focus on progress rather than perfection. But more than that, we listen. Through classes, extra help outside of class, or simply being there for any student who needs to talk, we ensure they know they're never alone in this journey. Sometimes, all a child needs is someone to remind them that they're enough just as they are. Sometimes, just knowing someone believes in them is enough to lighten the load.`,
      pullQuote: "Sometimes, all a child needs is someone to remind them that they're enough just as they are."
    },
    {
      question: "What does a typical student journey look like at your school?",
      answer: `When a student joins our school, we take the time to really get to know them, in terms of their strengths, challenges, and goals. It's not just about academics; we want them to feel confident, curious, and excited to learn. Together, we set realistic milestones and work towards them step by step.

As students grow, we adapt to their needs, making sure they stay on track and continue to succeed. By the time students leave, they're not only better learners but also more confident and motivated individuals, ready to tackle whatever comes next.`,
      pullQuote: "We want them to feel confident, curious, and excited to learn."
    },
    {
      question: "Your school has received an incredible number of heartfelt Google reviews. What do you think resonates most with students and parents?",
      answer: `Honestly, it's deeply humbling and joyous to read the heartfelt words of gratitude from our students and their families. Seeing how much they appreciate the dedication and sacrifices of their tutors is a profound reminder of why we do what we do. It fills me with pride to witness the difference our team makes. For us, these students are never just numbers or grades. They are individuals with dreams, fears, and limitless potential. Helping them unlock that potential is a privilege and an honour.

Parents often share how their children have become happier, more motivated, and more confident since joining us, and knowing we've had such a positive impact on their lives is the most meaningful reward we could ever ask for.`,
      pullQuote: "These students are never just numbers or grades. They are individuals with dreams, fears, and limitless potential."
    },
    {
      question: "What challenges do students face today, and how does your school help them overcome these?",
      answer: `Today's students face immense pressure to perform: high expectations, comparisons to others, limited time. Many struggle with self-doubt, fear of failure and distractions such as social media, gaming, and phones.

We address these by teaching focus, resilience, and healthy habits. We help students break challenges into smaller steps and view setbacks as learning opportunities. Most importantly, we remind them they're never judged or alone, ensuring they feel supported at every step.`,
      pullQuote: "We remind them they're never judged or alone."
    },
    {
      question: "What does it take to be a successful student in 2026?",
      answer: `To be successful in 2026, I believe students need to be adaptable and think critically, but above all, they need to be emotionally and mentally strong. It's not easy to juggle everything that comes their way such as pressure from studies, friends and family concerns, but being able to stay steady through it all makes a huge difference.

We know that emotions can sometimes take over and affect focus and motivation. That's why we make it a point in every lesson to help our students build the confidence and resilience they need to tackle challenges head-on and ultimately be successful and proud of themselves.`,
      pullQuote: "Above all, they need to be emotionally and mentally strong."
    },
    {
      question: "How do you think the students will perform in the HSC this year?",
      answer: `We're genuinely proud of how hard our students and teachers have worked this year. So, we are confident about our students' performances in the HSC this year. We've seen their dedication and growth, and it's been incredible to watch them develop the confidence and study habits they needed to succeed.

Every year, we reflect on how we can do better, tweaking our teaching methods and adapting to what students need most. So, with this experience, we are looking forward to hearing about this year's HSC results.

Seeing the success of past years gives us even more reason to believe that this year's students are on track to achieve something truly special.`,
      pullQuote: "This year's students are on track to achieve something truly special."
    },
    {
      question: "What kind of feedback do you receive from parents and students, and how does it guide your work?",
      answer: `I hold feedback in the highest regard. It's how we grow. We are truly fortunate to receive such open and honest insights from both parents and students. To us, feedback is our promise to continuously create the best possible learning environment for every child. While we initially relied on handwritten forms, I often worried some feedback might be overlooked or that students might feel hesitant to share openly. To address this, we introduced a seamless digital system where students can scan a QR code and share their thoughts directly with me - promptly and confidentially.

Parents often share how their children have become more confident, focused and happy. Students share heartfelt experiences, offering insights or suggestions for adjustments that align with their learning styles. Knowing that they feel truly cared for and understood is the greatest compliment we could ever receive. Each piece of feedback guides us to refine our methods and explore innovative ways to serve our students better.`,
      pullQuote: "Knowing that they feel truly cared for and understood is the greatest compliment we could ever receive."
    },
    {
      question: "How can parents and teachers work together with students to achieve the best outcomes?",
      answer: `Education works best when parents, teachers, and students collaborate as a team. Regular parent-teacher meetings and honest communication helps everyone stay aligned on goals and strategies, creating a strong foundation for success. Whether it's tackling academic struggles or celebrating progress, this shared effort creates a clear path forward.

By sharing insights and celebrating progress together, we ensure students feel supported and encouraged to reach their full potential. Our focus is always on what's best for the child, and this teamwork makes all the difference.`,
      pullQuote: "Education works best when parents, teachers, and students collaborate as a team."
    },
    {
      question: "What are your long-term goals for the school?",
      answer: `Our long-term goal is to grow without losing the personal touch that makes our school special. We aim to reach more students, expand programs, and stay adaptable to the evolving needs of education. But above all, our goal remains the same: to make a lasting difference in the lives of every child who walks through our doors.`,
      pullQuote: "To make a lasting difference in the lives of every child who walks through our doors."
    },
    {
      question: "What do you find most rewarding about leading this school?",
      answer: `If you ask our teachers, they will all say the same thing: the most rewarding part of our work is witnessing the transformation in a child's eyes when they realise they are capable, valued and supported. Watching students grow, overcome their fears, and achieve their dreams fills my heart with profound gratitude. Knowing that we've been even a small part of their journey, and that the lessons they've learned will guide them for a lifetime, is a privilege we cherish deeply.

There are moments when I hear about our staff staying up late into the night, tirelessly helping a student prepare for an assessment. While I gently remind them to focus on teaching time management, their willingness to go the extra mile fills me with immense pride. It's not uncommon for them to set aside their own work to prioritise their students' needs. These selfless acts reflect the extraordinary love they have for their students and the genuine joy they find in making a difference.

It's moments like these that remind me why I treasure this team so much and why this work holds such profound meaning and fulfilment for all of us.`,
      pullQuote: "The most rewarding part is witnessing the transformation in a child's eyes when they realise they are capable."
    },
    {
      question: "What do you want people to remember most about the tutoring centre in 50 years?",
      answer: `I don't expect anyone to remember me personally or the effort and dedication I've poured into this school. What I hope they'll remember is the heart of this place—the team of incredible teachers who came together with a shared belief in the right cause: to help children grow, overcome challenges, and discover the best in themselves.

I hope the devotion, time, and care that every teacher has put into this school will be remembered and appreciated. That, to me, is the greatest reward for our team—to know that what we've done has mattered.

Fifty years from now, I dream that the children we've helped will go out into the world as compassionate individuals, carrying with them the same values we've tried to instil: a big heart, a willingness to make a difference, and the courage to help those who need it wholeheartedly and proudly, just as we once did.

And lastly, I hope the parents who entrusted us with their children will, when they look back, smile and remember this place as somewhere their child was truly happy, cared for, and taught not just with knowledge but with heart. That is the legacy we aspire to leave behind.`,
      pullQuote: "That is the legacy we aspire to leave behind."
    }
  ];

  const testimonialCards = [
    {
      id: 1,
      name: "Bryant Lam",
      role: "HSC Student",
      quote: "Ms Amanda's passion for mathematics was infectious and it made me more hungry to be faster and accurate in the subject.",
      rating: 5,
      color: "from-blue-400 to-blue-600",
      position: { top: "15%", right: "-10px" }
    },
    {
      id: 2,
      name: "Melissa Ly",
      role: "St Johns Park High School",
      quote: "I entered GAT class with Miss Amanda, this moment was a turning point for me, in my mind it allowed me to see that this was another chance to achieve my goals.",
      rating: 5,
      color: "from-orange-400 to-orange-600",
      position: { top: "40%", left: "-10px" }
    },
    {
      id: 3,
      name: "Katelin Trinh",
      role: "HSC Student",
      quote: "The staff are incredibly friendly and supportive. The learning environment is excellent and allowed me to feel comfortable asking questions.",
      rating: 5,
      color: "from-green-400 to-green-600",
      position: { top: "65%", right: "-10px" }
    }
  ];

  interface TestimonialCard {
    id: number;
    name: string;
    role: string;
    quote: string;
    rating: number;
    color: string;
    position: { top: string; right?: string; left?: string };
  }

  const mixedContent: Array<{ type: 'testimonial'; content: TestimonialCard } | { type: 'quote'; content: string }> = [
    { type: 'testimonial', content: testimonialCards[0] },
    { type: 'quote', content: "It's not easy but it's worth it" },
    { type: 'testimonial', content: testimonialCards[1] },
    { type: 'quote', content: "Knowing that they feel truly cared for and understood is the greatest compliment we could ever receive." },
    { type: 'testimonial', content: testimonialCards[2] },
    { type: 'quote', content: "Their voices and the joy we see in their progress inspire everything we do." },
    { type: 'quote', content: "Knowing that we've been even a small part of their journey, and that the lessons they've learned will guide them for a lifetime, is a privilege we cherish deeply." }
  ];

  // Handle scroll progress and active question
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Calculate scroll progress
      const progress = (scrollPosition / (documentHeight - windowHeight)) * 100;
      setScrollProgress(Math.min(progress, 100));

      // Determine active question based on scroll position
      let currentActive = 0;
      questionRefs.current.forEach((ref, index) => {
        if (ref && ref.offsetTop <= scrollPosition + windowHeight / 3) {
          currentActive = index;
        }
      });
      setActiveQuestion(currentActive);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToQuestion = (index: number) => {
    questionRefs.current[index]?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  const highlights = [
    "It's not easy but it's worth it",
    "Knowing that they feel truly cared for and understood is the greatest compliment we could ever receive.",
    "Their voices and the joy we see in their progress inspire everything we do.",
    "Knowing that we've been even a small part of their journey, and that the lessons they've learned will guide them for a lifetime, is a privilege we cherish deeply."
  ];

  return (
    <div className="min-h-screen">
      <SEO 
        title="Principal's Interview: Our Vision & Philosophy | DA Tuition"
        description="Read an exclusive interview with the Principal of DA Tuition about our 'Beyond Academic Excellence' philosophy and our mission to build student confidence."
      />
      <NavigationNew />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-[120px]">
        {/* Header Section */}
        <section className="relative rounded-[2.5rem] overflow-hidden shadow-2xl mx-4 sm:mx-0 mt-6 mb-16">
          <div className="absolute inset-0">
            <img src="/images/v3/teacher_screen.jpg" alt="DA Tuition Interview" className="w-full h-full object-cover object-top" />
            <div className="absolute inset-0 bg-brand-navy/80 mix-blend-multiply"></div>
            {/* Vibrant warm pastel glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-navy/90 via-amber-500/20 to-orange-400/30 mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/60 to-transparent"></div>
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20 lg:py-28">
            <Link
              to="/"
              className="inline-flex items-center text-white/80 hover:text-white transition-colors mb-8"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Home
            </Link>

            <h1 className="text-3xl sm:text-4xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight drop-shadow-lg">
              Exclusive <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-300 to-yellow-300">Interview</span>
            </h1>

            <p className="text-xl text-white/95 max-w-2xl mx-auto drop-shadow-md font-medium">
              An intimate conversation with DA Tuition's Principal about education, empathy, and excellence.
            </p>
          </div>
        </section>
      </div>

      {/* Magazine Layout Content */}
      <section className="relative bg-white">
        {/* Progress Bar */}
        <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
          <div
            className="h-full bg-gradient-to-r from-brand-blue-light to-brand-orange transition-all duration-300"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>


        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
          {/* Questions and Answers */}
          <div className="space-y-16">
            {questions.map((item, index) => (
              <React.Fragment key={index}>
                <div
                  ref={el => questionRefs.current[index] = el}
                  className="scroll-mt-24"
                >
                  <article className="grid lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
                    {/* Question Column */}
                    <div className="lg:col-span-5">
                      <div className="sticky top-32">
                        <div className="flex items-center mb-4">
                          <span className="text-6xl lg:text-8xl font-bold text-brand-blue-light/20 mr-4">
                            {(index + 1).toString().padStart(2, '0')}
                          </span>
                        </div>
                        <h3 className="text-xl lg:text-2xl font-bold text-brand-midnight leading-tight">
                          {item.question}
                        </h3>
                      </div>
                    </div>

                    {/* Answer Column */}
                    <div className="lg:col-span-7">
                      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 border border-white/50">
                        {/* Principal Avatar */}
                        <div className="flex items-center mb-6">
                          <div className="w-12 h-12 bg-gradient-to-br from-brand-blue-dark to-brand-blue-light rounded-full flex items-center justify-center mr-4 shadow-md">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-brand-midnight">Miss Amanda's Response</p>
                            <p className="text-sm text-brand-midnight/80">DA Tuition Principal & Founder</p>
                          </div>
                        </div>

                        {/* Answer with Drop Cap */}
                        <div className="prose prose-lg max-w-none">
                          <p className="text-brand-midnight/80 leading-relaxed first-letter:text-6xl first-letter:font-bold first-letter:text-brand-blue-dark first-letter:float-left first-letter:mr-3 first-letter:mt-1">
                            {item.answer.split('\n\n').map((paragraph, pIndex) => (
                              <span key={pIndex}>
                                {pIndex === 0 ? paragraph : <><br /><br />{paragraph}</>}
                              </span>
                            ))}
                          </p>
                        </div>

                        {/* Pull Quote */}
                        {item.pullQuote && (
                          <div className="mt-8 pl-8 border-l-4 border-orange-300">
                            <Quote className="text-orange-300 mb-2" size={24} />
                            <p className="text-xl font-medium text-brand-midnight/80 italic">
                              {item.pullQuote}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                </div>

                {/* Mid-page CTA every 5 questions */}
                {(index + 1) % 5 === 0 && index !== questions.length - 1 && (
                  <div className="max-w-4xl mx-auto py-12">
                    <div className="bg-gradient-to-r from-brand-blue to-brand-blue-dark rounded-3xl p-10 text-center text-white shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                      <h3 className="text-2xl font-bold mb-4 relative z-10">Inspired by our vision?</h3>
                      <p className="mb-8 opacity-90 relative z-10">Discover how our heart-centered approach can help your child thrive.</p>
                      <Link
                        to="/#contact"
                        className="inline-flex items-center bg-white text-brand-blue-dark px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all relative z-10 shadow-lg"
                      >
                        Book Interview <ArrowRight className="ml-2 w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Mixed Testimonials and Quotes Section */}
          <div className="mt-20 space-y-12">
            <div className="text-center mb-16">
              <h3 className="text-2xl font-bold text-brand-midnight mb-3">Voices from Our Community</h3>
              <div className="w-16 h-0.5 bg-gradient-to-r from-brand-blue-light to-brand-orange mx-auto rounded-full"></div>
            </div>

            {mixedContent.map((item, index) => (
              <div key={index}>
                {item.type === 'quote' ? (
                  // Heart Quote
                  <div className="group relative bg-gradient-to-r from-blue-50/80 to-orange-50/40 hover:from-blue-50/90 hover:to-orange-50/60 rounded-2xl p-8 border-l-4 border-orange-300/60 hover:border-orange-400/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-500 hover:-translate-y-1 max-w-4xl mx-auto">
                    <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-blue-200/30 to-orange-200/30 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-0 group-hover:scale-100"></div>

                    <div className="flex items-start">
                      <Quote className="text-orange-400/80 group-hover:text-orange-500 mr-6 mt-1 flex-shrink-0 transition-all duration-300 group-hover:scale-110" size={28} />
                      <div className="flex-1">
                        <p className="text-lg font-medium text-brand-midnight/80 group-hover:text-brand-midnight/80 italic leading-relaxed transition-colors duration-300">
                          {item.content as string}
                        </p>

                        <div className="mt-4 h-0.5 w-0 group-hover:w-24 bg-gradient-to-r from-brand-blue-light to-orange-300 rounded-full transition-all duration-500 ease-out"></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Testimonial Card
                  <div className="max-w-3xl mx-auto">
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-8 hover:scale-105 transition-transform duration-300 border border-gray-100">
                      <div className="flex items-center mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-br ${(item.content as TestimonialCard).color} rounded-full flex items-center justify-center text-white font-bold mr-4`}>
                          {(item.content as TestimonialCard).name.charAt(0)}
                        </div>
                        <div>
                          <h5 className="font-semibold text-brand-midnight">{(item.content as TestimonialCard).name}</h5>
                          <p className="text-sm text-brand-midnight/80">{(item.content as TestimonialCard).role}</p>
                        </div>
                      </div>
                      <p className="text-brand-midnight/80 italic mb-4 text-lg">"{(item.content as TestimonialCard).quote}"</p>
                      <div className="flex">
                        {[...Array((item.content as TestimonialCard).rating)].map((_, i) => (
                          <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-20 text-center">
            <div className="group relative bg-gradient-to-br from-white/95 to-blue-50/60 backdrop-blur-sm rounded-3xl p-12 shadow-lg hover:shadow-xl border border-white/50 hover:border-blue-200/60 transition-all duration-500 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-orange-200/20 to-transparent rounded-full transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-blue-200/15 to-transparent rounded-full transform -translate-x-10 translate-y-10 group-hover:scale-125 transition-transform duration-700"></div>

              <div className="relative z-10">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-brand-blue-light to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1L9 7V9L15 15L21 9Z" />
                    </svg>
                  </div>
                </div>

                <h3 className="text-3xl font-bold mb-6 text-brand-midnight group-hover:text-brand-blue-dark transition-colors duration-300">
                  Ready to Join the <span className="gradient-text">DA Family</span>?
                </h3>

                <p className="text-lg text-brand-midnight/80 group-hover:text-brand-midnight/80 mb-8 max-w-2xl mx-auto leading-relaxed transition-colors duration-300">
                  Let us help you choose the perfect program and learning format that matches your child's unique needs and learning style.
                </p>

                <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
                  <Link
                    to="/#contact"
                    className="btn-primary inline-flex items-center group-hover:scale-105 transition-transform duration-300 px-8 py-4 text-lg"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Book Interview
                  </Link>

                  <Link
                    to="/"
                    className="inline-flex items-center px-8 py-4 text-lg font-medium text-brand-blue-dark hover:text-brand-blue-light border-2 border-brand-blue-light hover:border-brand-blue-dark rounded-xl transition-all duration-300 hover:bg-blue-50/30"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Visit Home Page
                  </Link>
                </div>

                <div className="mt-8 text-sm text-brand-midnight/70">
                  <p>Join {siteStats.reviewCount}+ families who've already discovered the DA difference</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FooterNew />
    </div>
  );
};

export default Interview;