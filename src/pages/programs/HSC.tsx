import React from 'react';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import StickyBookButton from '@/components/StickyBookButton';
import { Button } from '@/components/ui/button';
import { Trophy, TrendingUp, Clock, Users, CheckCircle, ArrowRight, Quote, Star, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import { siteStats } from '@/data/site-stats';

const HSC = () => {
  const features = [
    {
      icon: Trophy,
      title: "ATAR Maximization",
      description: "Strategic focus on scaling and band optimization"
    },
    {
      icon: TrendingUp,
      title: "Band 6 Strategies",
      description: "Proven techniques from past high achievers"
    },
    {
      icon: Clock,
      title: "Time Management",
      description: "Balancing study, assessments, and wellbeing"
    },
    {
      icon: Users,
      title: "Small Groups",
      description: "Matched to small groups (3-5), classes, or accelerated programs"
    }
  ];

  const subjects = [
    {
      category: "Mathematics",
      courses: ["Mathematics Standard", "Mathematics Advanced", "Mathematics Extension 1", "Mathematics Extension 2"]
    },
    {
      category: "English",
      courses: ["English Standard", "English Advanced", "English Extension 1", "English Extension 2"]
    },
    {
      category: "Sciences",
      courses: ["Physics", "Chemistry", "Biology", "Earth & Environmental Science"]
    },
    {
      category: "Commerce",
      courses: ["Business Studies", "Legal Studies"]
    }
  ];

  const timeline = [
    {
      term: "Year 11 - Term 1",
      focus: "Foundation building, study habits, subject mastery"
    },
    {
      term: "Year 11 - Terms 2-3",
      focus: "Preliminary exams, assessment preparation, skill refinement"
    },
    {
      term: "Year 11 - Term 4",
      focus: "HSC course transition and preparation"
    },
    {
      term: "Year 12 - Term 1",
      focus: "HSC content mastery, trial preparation begins"
    },
    {
      term: "Year 12 - Term 2",
      focus: "Trial exams, intensive revision, Band 6 techniques"
    },
    {
      term: "Year 12 - Term 3",
      focus: "Final HSC preparation, exam strategies, stress management"
    }
  ];

  const results = [
    { year: "2024", stat: "94%", description: "of students achieved Band 5 or 6" },
    { year: "2024", stat: "15", description: "students achieved ATAR 95+" },
    { year: "2023", stat: "87%", description: "improved by 2+ bands" },
    { year: "2023", stat: "100%", description: "university placement rate" }
  ];

  return (
    <div className="min-h-screen bg-brand-canvas overflow-x-hidden pt-[120px]">
      <SEO
        title="HSC Tutoring & Excellence Program"
        description={`Your pathway to Band 6 results and the ATAR you deserve—with proven strategies from ${siteStats.yearsExperience} years of HSC success at DA Tuition.`}
        canonicalUrl="/hsc-excellence"
      />
      <NavigationNew />
      <StickyBookButton />

      <main className="max-w-[1400px] mx-auto space-y-24 lg:space-y-32 pb-32 px-4 sm:px-6 lg:px-8">

        {/* Hero Section */}
        <section className="relative rounded-[2.5rem] overflow-hidden shadow-2xl mx-4 sm:mx-0 mt-6 mb-16">
          <div className="absolute inset-0">
            <img src="/images/v3/teacher_whiteboard.jpg" alt="HSC Classroom" className="w-full h-full object-cover" />
            {/* Beautiful dark navy wash for perfect text readability */}
            <div className="absolute inset-0 bg-brand-navy/80 mix-blend-multiply"></div>
            {/* Optional gradient for extra text pop */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/50 to-brand-navy/30"></div>
          </div>

          <div className="relative z-10 max-w-4xl mx-auto text-center py-12 sm:py-16 lg:py-24 px-6">
            <div className="inline-flex items-center justify-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-6 py-2 border border-white/20 mb-8">
              <Star className="w-5 h-5 text-brand-gold fill-brand-gold" />
              <span className="text-sm font-bold text-white tracking-wide uppercase">Years 11 & 12</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight drop-shadow-lg">
              HSC Excellence <br />
              <span className="text-brand-gold">Program</span>
            </h1>

            <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
              Your pathway to Band 6 results and the ATAR you deserve—with proven strategies from {siteStats.yearsExperience} years of HSC success.
            </p>
          </div>
        </section>

        {/* Results Banner */}
        <section>
          <div className="bg-brand-navy rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden text-white">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/20 rounded-full blur-[60px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative z-10">
              {results.map((result, index) => (
                <div key={index} className="space-y-2">
                  <div className="text-4xl md:text-5xl font-black text-brand-gold">{result.stat}</div>
                  <div className="text-sm md:text-base text-white/80 font-medium">{result.description}</div>
                  <div className="text-xs text-white/40 font-bold tracking-wider">{result.year}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Intro Bento Box */}
        <section className="relative">
          <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-xl shadow-brand-navy/5 border border-brand-navy/5">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-extrabold text-brand-navy mb-6">The Most Important Two Years</h2>
                <div className="space-y-4 text-lg text-brand-navy/70 leading-relaxed">
                  <p>
                    The HSC isn't just about memorizing content - it's about mastering the art of high-level thinking,
                    effective communication, and strategic exam performance. At DA Tuition, we've guided hundreds of students
                    to HSC success with a proven formula.
                  </p>
                  <p>
                    Our HSC program goes beyond traditional tutoring. We become your academic partners, providing not just
                    subject expertise but also mentorship, motivation, and the confidence needed to perform at your best.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="bg-brand-canvas rounded-2xl p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-1 border border-black/5">
                    <feature.icon className="w-8 h-8 text-brand-gold mb-4" />
                    <h3 className="font-bold text-brand-navy mb-2">{feature.title}</h3>
                    <p className="text-sm text-brand-navy/70 leading-snug">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Visual Proof / Authentic Environment */}
        <section>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-[2rem] overflow-hidden shadow-xl h-[280px] md:h-[380px] relative group border border-brand-navy/5">
              <img src="/images/programs/hsc-maths.jpg" alt="HSC Mathematics tutoring at DA Tuition" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-brand-navy/70 to-transparent p-6">
                <span className="text-white font-bold text-sm tracking-wide uppercase">HSC Mathematics</span>
              </div>
            </div>
            <div className="rounded-[2rem] overflow-hidden shadow-xl h-[280px] md:h-[380px] relative group border border-brand-navy/5">
              <img src="/images/programs/hsc-physics.jpg" alt="HSC Sciences tutoring at DA Tuition" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-brand-navy/70 to-transparent p-6">
                <span className="text-white font-bold text-sm tracking-wide uppercase">HSC Sciences</span>
              </div>
            </div>
          </div>
        </section>

        {/* Band 6 Strategies + Testimonial Combo */}
        <section>
          <div className="grid lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-white rounded-[2rem] p-8 md:p-12 border border-brand-navy/5 shadow-xl shadow-brand-navy/5">
              <h3 className="text-3xl font-extrabold text-brand-navy mb-8">Band 6 Success Strategies</h3>
              <div className="space-y-4">
                <div className="bg-brand-canvas rounded-2xl p-6 border border-brand-navy/5">
                  <h4 className="font-bold text-accent-pink mb-2 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" /> Assessment Task Excellence
                  </h4>
                  <p className="text-brand-navy/70">Master every assessment with detailed feedback, exemplar responses, and strategic planning for maximum marks.</p>
                </div>
                <div className="bg-brand-canvas rounded-2xl p-6 border border-brand-navy/5">
                  <h4 className="font-bold text-accent-purple mb-2 flex items-center">
                    <Award className="w-5 h-5 mr-2" /> Exam Technique Mastery
                  </h4>
                  <p className="text-brand-navy/70">Learn time management, question analysis, and response structuring from teachers who've achieved Band 6 themselves.</p>
                </div>
                <div className="bg-brand-canvas rounded-2xl p-6 border border-brand-navy/5">
                  <h4 className="font-bold text-brand-blue mb-2 flex items-center">
                    <Trophy className="w-5 h-5 mr-2" /> Scaling Optimization
                  </h4>
                  <p className="text-brand-navy/70">Strategic advice on subject selection and performance targets to maximize your ATAR through smart scaling.</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-brand-navy rounded-[2rem] p-8 md:p-12 text-white shadow-xl flex flex-col justify-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent-pink/20 rounded-full blur-[60px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

              <Quote className="w-12 h-12 text-brand-gold/40 mb-6" />
              <blockquote className="text-xl text-white font-medium italic leading-relaxed mb-8 relative z-10">
                "DA Tuition is not just an educational environment but also collectively, a place of upbringing and encouragement. As a committed student of 8 years, DA staff are not just teachers but considered as family and also promoters of success for students to bring out the best of each individual's potentials."
              </blockquote>
              <div className="flex items-center space-x-4 relative z-10">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-brand-navy font-bold text-xl">L</div>
                <div>
                  <p className="font-bold text-brand-gold">Lisa Vu</p>
                  <p className="text-sm text-white/60 font-medium">Year 12 Student, Cecil Hills High School</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HSC Timeline Grid */}
        <section>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-navy mb-4">
              Your Timeline to Success
            </h2>
            <p className="text-lg text-brand-navy/70">
              Strategic planning across two years to maximize your ATAR potential.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {timeline.map((period, index) => (
              <div key={index} className="bg-white rounded-[1.5rem] p-8 shadow-sm border border-brand-navy/5 hover:border-brand-blue/30 transition-colors">
                <div className="flex items-center mb-4">
                  <Clock className="w-6 h-6 text-brand-gold mr-3" />
                  <h3 className="font-bold text-brand-navy text-lg">{period.term}</h3>
                </div>
                <p className="text-brand-navy/70 font-medium">{period.focus}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Subject Coverage */}
        <section>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-navy mb-4">
              Comprehensive Support
            </h2>
            <p className="text-lg text-brand-navy/70">
              Expert tutoring from teachers who achieved Band 6 in their subjects and understand the latest syllabus requirements.
            </p>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
            {subjects.map((subject, index) => (
              <div key={index} className="bg-white rounded-[1.5rem] p-6 text-center border border-brand-navy/5 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-bold text-brand-blue mb-4 text-xl">{subject.category}</h3>
                <ul className="space-y-2 text-left">
                  {subject.courses.map((course, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-accent-green mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-brand-navy/80 font-medium text-sm">{course}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/subjects">
              <Button size="lg" className="bg-white text-brand-navy border-2 border-brand-navy/10 hover:border-brand-navy/20 hover:bg-brand-canvas transition-all rounded-xl font-bold">
                Explore All Subjects
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </section>

        {/* CTA Section */}
        <section>
          <div className="bg-brand-blue rounded-[2rem] p-12 md:p-16 text-center shadow-2xl relative overflow-hidden">
            {/* Abstract background shapes */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-navy/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/3"></div>

            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
                Your Band 6 Journey Starts Here
              </h2>
              <p className="text-xl text-white/90 mb-10 font-medium max-w-2xl mx-auto">
                Join the hundreds of students who've achieved their dream ATAR with DA Tuition.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link to="/book-interview">
                  <Button size="lg" className="bg-white text-brand-navy hover:bg-white/90 font-bold px-8 h-14 rounded-xl">
                    Book an Interview
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-brand-navy font-bold px-8 h-14 rounded-xl transition-all"
                  onClick={() => window.location.href = '/#contact'}
                >
                  Request HSC Guide
                </Button>
              </div>

              <p className="mt-8 text-white/80 font-medium tracking-wide">
                Limited spots available. Call us at <a href="tel:0401940207" className="underline hover:text-white transition-colors">0401 940 207</a>
              </p>
            </div>
          </div>
        </section>

      </main>

      <FooterNew />
    </div>
  );
};

export default HSC;