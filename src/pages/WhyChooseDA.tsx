import { Check, X, Award, Users, Target, Heart, BookOpen, TrendingUp, Star, Shield, ArrowRight, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import { Link } from 'react-router-dom';
import { siteStats } from '@/data/site-stats';
import SEO from '@/components/SEO';
import CTASection from '@/components/CTASection';

const WhyChooseDA = () => {
  const comparisons = [
    {
      feature: "Teaching Approach",
      datuition: "Specially created exam-focused curriculum",
      others: "Homework help and generic tutoring"
    },
    {
      feature: "Teacher Quality",
      datuition: "Band 6 Subject Teachers who understand current syllabuses",
      others: "Mixed quality, often university students"
    },
    {
      feature: "Class Size",
      datuition: "3-5 students for optimal learning",
      others: "Large classes or expensive 1-on-1"
    },
    {
      feature: "Progress Tracking",
      datuition: "Regular progress updates for parents",
      others: "Irregular or no formal reporting"
    },
    {
      feature: "Learning Philosophy",
      datuition: "Build understanding from foundations up",
      others: "Quick fixes for immediate homework"
    },
    {
      feature: "Student Support",
      datuition: "Holistic support including confidence building",
      others: "Academic support only"
    },
    {
      feature: "Results",
      datuition: "Proven HSC results with 5.0 Google rating",
      others: "No published success metrics"
    },
    {
      feature: "Recognition",
      datuition: "Award-winning education service",
      others: "No formal recognition"
    }
  ];

  const uniqueAdvantages = [
    {
      icon: <Target className="w-12 h-12 text-brand-blue" />,
      title: "Exam Excellence Focus",
      description: "We don't do homework help. Our specially created curriculum is designed for deep understanding and exam mastery.",
      benefits: [
        "Custom curriculum aligned to syllabus",
        "Past exam paper practice",
        "Exam technique training",
        "Time management strategies"
      ]
    },
    {
      icon: <Users className="w-12 h-12 text-orange-400" />,
      title: "Perfect Group Size",
      description: "3-5 students creates the ideal learning environment - personal attention with peer dynamics.",
      benefits: [
        "Individual attention when needed",
        "Learn from peer questions",
        "Healthy competition",
        "Collaborative problem-solving"
      ]
    },
    {
      icon: <Award className="w-12 h-12 text-yellow-500" />,
      title: "Proven Track Record",
      description: "20+ years of excellence with results that speak for themselves.",
      benefits: [
        "20+ years helping students succeed",
        "450+ five-star Google reviews",
        "Award-winning education service",
        "10,000+ students helped since 2005"
      ]
    },
    {
      icon: <Heart className="w-12 h-12 text-red-500" />,
      title: "Beyond Academics",
      description: "We nurture the whole child - building confidence, resilience, and a love for learning.",
      benefits: [
        "Confidence building",
        "Study skills development",
        "Stress management",
        "Growth mindset cultivation"
      ]
    }
  ];

  const testimonials = [
    {
      quote: "My eight year journey at DA transformed me - not only in my studies, but in my attitude and confidence. They allowed me to believe that hard work trumps all.",
      author: "Anna Pham",
      role: "Year 12 Student",
      rating: 5
    },
    {
      quote: "As a former student, I can confidently say that DA Tuition has one of the greatest teachers and support networks out there. Truly team work makes the dream work!",
      author: "Tammy Tran",
      role: "Former Student",
      rating: 5
    },
    {
      quote: "DA Tuition is not just an educational environment but also collectively, a place of upbringing and encouragement. The friendly atmosphere and positivity of staff have continuously supported me.",
      author: "Lisa Vu",
      role: "Year 12 Student",
      rating: 5
    }
  ];

  return (
    <>
      <SEO 
        title="Why Choose DA Tuition | Our Unique Educational Approach"
        description={`Discover what makes DA Tuition the preferred choice for over ${siteStats.reviewCount} families. Learn about our heart-centered education, Band 6 teachers, and small group dynamics.`}
      />
      <NavigationNew />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-[120px]">
        {/* Hero Section */}
        <section className="relative rounded-[2.5rem] overflow-hidden shadow-2xl mx-4 sm:mx-0 mt-6 mb-16">
          <div className="absolute inset-0">
            <img src="/images/v3/teacher_screen.jpg" alt="Why Choose DA Tuition" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-brand-navy/80 mix-blend-multiply"></div>
            {/* Vibrant warm pastel glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-navy/90 via-amber-500/20 to-orange-500/30 mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/60 to-transparent"></div>
          </div>

          <div className="relative z-10 max-w-6xl mx-auto text-center py-24 px-6 lg:py-32">
            <h1 className="text-5xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight drop-shadow-lg">
              Why Choose <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-300 to-yellow-300">DA Tuition?</span>
            </h1>
            <p className="text-xl text-white/95 mb-8 max-w-3xl mx-auto drop-shadow-md font-medium">
              Discover what makes us the trusted choice for over {siteStats.studentsHelped} families across Sydney.
            </p>

            {/* Key Stats */}
            <div className="grid md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center hover:bg-white/15 transition-colors">
                <div className="text-4xl font-extrabold text-blue-400 mb-2">{siteStats.yearsExperience}</div>
                <p className="text-white/80 font-medium">Years of Excellence</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center hover:bg-white/15 transition-colors">
                <div className="text-4xl font-extrabold text-green-400 mb-2">{siteStats.reviewCount}</div>
                <p className="text-white/80 font-medium">5-Star Reviews</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center hover:bg-white/15 transition-colors">
                <div className="text-4xl font-extrabold text-orange-400 mb-2">Band 6</div>
                <p className="text-white/80 font-medium">Subject Teachers</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="min-h-screen">

        {/* Comparison Table */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">See The Difference</h2>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="hidden md:grid grid-cols-3 bg-gradient-to-r from-brand-blue to-brand-blue-dark text-white">
                <div className="p-4 font-semibold">Feature</div>
                <div className="p-4 font-semibold border-l border-white/20">
                  <Award className="w-5 h-5 inline mr-2" />
                  DA Tuition
                </div>
                <div className="p-4 font-semibold border-l border-white/20">Other Tutoring</div>
              </div>

              {comparisons.map((item, index) => (
                <div key={index} className={`grid grid-cols-1 md:grid-cols-3 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                  <div className="p-4 font-medium text-brand-midnight md:border-b-0 border-b border-gray-100">{item.feature}</div>
                  <div className="p-4 md:border-l border-gray-200">
                    <div className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-brand-midnight/80">{item.datuition}</span>
                    </div>
                  </div>
                  <div className="p-4 md:border-l border-gray-200 border-t md:border-t-0 border-gray-100">
                    <div className="flex items-start gap-2">
                      <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <span className="text-brand-midnight/80">{item.others}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Unique Advantages */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Our Unique Advantages</h2>

            <div className="grid md:grid-cols-2 gap-8">
              {uniqueAdvantages.map((advantage, index) => (
                <Card key={index} className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">{advantage.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-3">{advantage.title}</h3>
                      <p className="text-brand-midnight/80 mb-4">{advantage.description}</p>
                      <ul className="space-y-2">
                        {advantage.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-brand-midnight/80">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>


        {/* The DA Difference */}
        <section className="py-16 px-4 bg-gradient-to-b from-blue-50 to-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">The DA Difference</h2>

            <div className="space-y-6">
              <Card className="p-6 border-l-4 border-brand-blue">
                <h3 className="font-bold text-lg mb-3">We Don't Just Teach - We Transform</h3>
                <p className="text-brand-midnight/80">
                  While others focus on quick homework fixes, we build deep understanding. Our students don't just improve their grades -
                  they develop a love for learning, gain confidence, and discover their true potential.
                </p>
              </Card>

              <Card className="p-6 border-l-4 border-brand-orange">
                <h3 className="font-bold text-lg mb-3">Teachers Who've Been There</h3>
                <p className="text-brand-midnight/80">
                  Our teachers aren't just qualified - they're recent high achievers (95+ ATARs) who understand the current syllabus,
                  exam pressures, and what it takes to excel. They're mentors who inspire because they've walked the same path.
                </p>
              </Card>

              <Card className="p-6 border-l-4 border-brand-green">
                <h3 className="font-bold text-lg mb-3">A Community of Excellence</h3>
                <p className="text-brand-midnight/80">
                  Join a community where excellence is expected and achieved. Our small groups create friendships, healthy competition,
                  and mutual support. Students motivate each other to reach higher.
                </p>
              </Card>
            </div>
          </div>
        </section>

      </div>

        {/* Testimonials */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">What Parents Say</h2>

            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="p-6 h-fit">
                  <div className="flex mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-brand-midnight/80 italic mb-4">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-brand-midnight/80">{testimonial.role}</p>
                  </div>
                </Card>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link to="/reviews">
                <Button variant="outline">Read All 450+ Reviews</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Our Promise */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center">
            <Shield className="w-16 h-16 text-brand-blue mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-6">Our Promise to You</h2>
            <p className="text-xl text-brand-midnight/80 mb-8">
              We promise to treat your child as our own. To celebrate their victories, support them through challenges,
              and never give up on their potential. We promise transparent communication, regular progress updates,
              and a partnership focused on your child's success.
            </p>

            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="font-bold text-lg mb-4">Start With Confidence</h3>
              <ul className="space-y-3 text-left max-w-2xl mx-auto mb-6">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Free comprehensive assessment to understand your child's needs</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Meet our teachers and see our facilities</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Personalized learning plan before you commit</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>No lock-in contracts - continue only if you're happy</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

      <CTASection 
        heading="Ready to Give Your Child the DA Advantage?"
        subheading={`Join the ${siteStats.reviewCount}+ families who've discovered what's possible with the right support. Your child's excellence starts with a professional assessment.`}
        className="bg-brand-navy"
      />

      <FooterNew />
    </>
  );
};

export default WhyChooseDA;