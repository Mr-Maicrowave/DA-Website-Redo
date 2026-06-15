import { ArrowRight, Heart, Trophy, Target, Sparkles, Users, BookOpen, GraduationCap, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import { Link } from 'react-router-dom';

const OurApproach = () => {
  const coreValues = [
    {
      icon: <Heart className="w-8 h-8 text-orange-400" />,
      title: "Heart-Centered Education",
      description: "We believe education is more than grades. It's about nurturing confidence, fostering curiosity, and building character that lasts a lifetime."
    },
    {
      icon: <Target className="w-8 h-8 text-brand-blue" />,
      title: "Exam-Focused Excellence",
      description: "Our specially created curriculum targets examination requirements. We don't do homework help - we build deep understanding for exam success."
    },
    {
      icon: <Users className="w-8 h-8 text-brand-green" />,
      title: "Small Group Dynamics",
      description: "Groups of 3-5 students create the perfect environment: personal attention with peer learning, building confidence through collaboration."
    },
    {
      icon: <Trophy className="w-8 h-8 text-yellow-500" />,
      title: "Top-Achieving Teachers",
      description: "Our teachers aren't just qualified - they're Band 6 Subject Teachers who understand current syllabuses and exam techniques."
    }
  ];

  const methodology = [
    {
      step: "1",
      title: "Diagnostic Assessment",
      description: "We identify knowledge gaps and learning styles through comprehensive testing",
      details: [
        "Academic baseline assessment",
        "Learning style identification",
        "Goal setting session",
        "Personalized learning plan creation"
      ]
    },
    {
      step: "2",
      title: "Foundation Building",
      description: "Systematically address gaps while advancing current curriculum understanding",
      details: [
        "Fill prerequisite knowledge gaps",
        "Build core concept mastery",
        "Develop problem-solving strategies",
        "Strengthen exam techniques"
      ]
    },
    {
      step: "3",
      title: "Accelerated Learning",
      description: "Move beyond school pace with advanced content and exam preparation",
      details: [
        "Study ahead of school curriculum",
        "Practice past exam questions",
        "Master time management",
        "Build exam confidence"
      ]
    },
    {
      step: "4",
      title: "Continuous Excellence",
      description: "Regular assessments and adjustments ensure consistent improvement",
      details: [
        "Weekly progress tracking",
        "Monthly parent reports",
        "Quarterly assessments",
        "Annual achievement celebrations"
      ]
    }
  ];

  const uniqueDifferences = [
    {
      title: "Curriculum-Driven, Not Homework-Driven",
      traditional: "Other tutoring centers help with homework",
      ourApproach: "We teach our own exam-focused curriculum for deep understanding"
    },
    {
      title: "Recent High Achievers as Teachers",
      traditional: "Often use university students or retired teachers",
      ourApproach: "Band 6 Subject Teachers who recently excelled in current syllabuses"
    },
    {
      title: "Small Groups of 3-5",
      traditional: "Large classes or expensive 1-on-1",
      ourApproach: "Perfect balance of attention and peer learning dynamics"
    },
    {
      title: "Continuous Assessment & Feedback",
      traditional: "Sporadic or no formal assessment",
      ourApproach: "Weekly tracking with monthly parent reports"
    },
    {
      title: "Beyond Academic Support",
      traditional: "Focus only on grades",
      ourApproach: "Build confidence, resilience, and love for learning"
    }
  ];

  return (
    <>
      <NavigationNew />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-[120px]">
        {/* Hero Section */}
        <section className="relative rounded-[2.5rem] overflow-hidden shadow-2xl mx-4 sm:mx-0 mt-6 mb-16">
          <div className="absolute inset-0">
            <img src="/images/v3/hallway_students.jpg" alt="Active Student Life" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-brand-navy/80 mix-blend-multiply"></div>
            {/* Friendly and warm pastel glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-navy/90 via-emerald-500/20 to-teal-400/30 mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/50 to-transparent"></div>
          </div>

          <div className="relative z-10 max-w-4xl mx-auto text-center py-12 sm:py-16 lg:py-24 px-6">
            <h1 className="text-3xl sm:text-4xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight drop-shadow-lg">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300">Approach</span> <br />
              to Excellence
            </h1>

            <p className="text-xl text-white/95 max-w-2xl mx-auto mb-10 leading-relaxed font-medium drop-shadow-md">
              A proven methodology that transforms students into confident, high-achieving learners.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-left flex-1 hover:bg-white/15 transition-all hover:-translate-y-1 hover:shadow-lg">
                <Sparkles className="w-8 h-8 text-emerald-300 mb-3 drop-shadow-sm" />
                <h3 className="font-bold text-lg text-white mb-2">Beyond Tutoring</h3>
                <p className="text-white/90">
                  We don't just help with homework - we build understanding from the ground up
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-left flex-1 hover:bg-white/15 transition-colors hover:-translate-y-1 hover:shadow-lg">
                <GraduationCap className="w-8 h-8 text-teal-300 mb-3 drop-shadow-sm" />
                <h3 className="font-bold text-lg text-white mb-2">Exam Excellence</h3>
                <p className="text-white/90">
                  Our curriculum is designed specifically for examination success
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="min-h-screen">

        {/* Core Values */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {coreValues.map((value, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="mb-4">{value.icon}</div>
                  <h3 className="font-bold text-lg mb-3">{value.title}</h3>
                  <p className="text-brand-midnight/80">{value.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Our Methodology */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">The DA Tuition Method</h2>
            <p className="text-xl text-brand-midnight/80 text-center mb-12 max-w-3xl mx-auto">
              A systematic approach that has helped thousands of students achieve their academic goals
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              {methodology.map((phase, index) => (
                <Card key={index} className="p-8 relative overflow-hidden">
                  <div className="absolute top-4 right-4 text-6xl font-bold text-gray-100">
                    {phase.step}
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-3 text-brand-blue-dark">
                      {phase.title}
                    </h3>
                    <p className="text-brand-midnight/80 mb-4">{phase.description}</p>
                    <ul className="space-y-2">
                      {phase.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-brand-green mt-0.5 flex-shrink-0" />
                          <span className="text-brand-midnight/80">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* What Makes Us Different */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">What Makes Us Different</h2>

            <div className="space-y-6">
              {uniqueDifferences.map((diff, index) => (
                <Card key={index} className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-brand-blue-dark">{diff.title}</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-red-50 p-4 rounded-lg">
                      <p className="font-semibold text-red-700 mb-2">Traditional Approach:</p>
                      <p className="text-brand-midnight/80">{diff.traditional}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="font-semibold text-green-700 mb-2">Our Approach:</p>
                      <p className="text-brand-midnight/80">{diff.ourApproach}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Student Journey */}
        <section className="py-16 px-4 bg-gradient-to-b from-blue-50 to-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Your Child's Journey to Excellence</h2>

            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-brand-orange rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Week 1-2: Settling In</h3>
                  <p className="text-brand-midnight/80">Building rapport, understanding learning style, establishing goals</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-brand-blue rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Month 1-3: Foundation</h3>
                  <p className="text-brand-midnight/80">Addressing gaps, building core skills, developing study habits</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Month 3-6: Acceleration</h3>
                  <p className="text-brand-midnight/80">Moving ahead of school, mastering exam techniques, building confidence</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Ongoing: Excellence</h3>
                  <p className="text-brand-midnight/80">Consistent top performance, leadership skills, future readiness</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Visual Proof / Authentic Environment */}
        <section className="pb-16 px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
            <div className="rounded-[2rem] overflow-hidden shadow-2xl aspect-video md:aspect-[4/3] border border-brand-navy/5">
              <img src="/images/v3/hallway_students.jpg" alt="Active Student Life" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="rounded-[2rem] overflow-hidden shadow-2xl aspect-video md:aspect-[4/3] border border-brand-navy/5">
              <img src="/images/v3/teacher_screen.jpg" alt="Technology Integrated Learning" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
          </div>
        </section>

        {/* Success Metrics */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Proven Results</h2>

            <div className="grid md:grid-cols-3 gap-6 text-center">
              <Card className="p-6">
                <div className="text-4xl font-bold text-orange-400 mb-2">95+</div>
                <p className="text-brand-midnight/80">Band 6</p>
              </Card>
              <Card className="p-6">
                <div className="text-4xl font-bold text-brand-green mb-2">3-5</div>
                <p className="text-brand-midnight/80">Students Per Group</p>
              </Card>
              <Card className="p-6">
                <div className="text-4xl font-bold text-yellow-500 mb-2">450+</div>
                <p className="text-brand-midnight/80">Five-Star Reviews</p>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-brand-highlight to-brand-midnight">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Experience the DA Tuition Difference?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of successful students who've transformed their academic journey
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/book-interview">
                <Button size="lg" className="w-full sm:w-auto bg-white text-brand-navy hover:bg-white/90">
                  Book an Interview
                </Button>
              </Link>
              <Link to="/success-stories">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto bg-transparent border-white text-white hover:bg-white/10"
                >
                  Read Success Stories
                </Button>
              </Link>
            </div>

            <div className="mt-8 text-lg">
              <p className="mb-2">Call us today: <span className="font-bold">0401 940 207</span></p>
              <p className="opacity-90">Canley Heights • Tue-Fri 5pm-9pm • Sat 9am-6pm • Sun 10am-7pm</p>
            </div>
          </div>
        </section>
      </div>

      <FooterNew />
    </>
  );
};

export default OurApproach;