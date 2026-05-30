import React from 'react';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import StickyBookButton from '@/components/StickyBookButton';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, Target, Brain, Award, CheckCircle, ArrowRight, Quote, Clock, BookOpen, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import { siteStats } from '@/data/site-stats';

const HighSchool = () => {
  const features = [
    {
      icon: Brain,
      title: "Critical Thinking",
      description: "Developing analytical skills for complex problem solving"
    },
    {
      icon: Target,
      title: "Exam Excellence",
      description: "Strategic preparation for assessments and yearly exams"
    },
    {
      icon: GraduationCap,
      title: "HSC Foundation",
      description: "Building skills essential for senior success"
    },
    {
      icon: Award,
      title: "Study Skills",
      description: "Time management and effective learning techniques"
    }
  ];

  const yearLevels = [
    {
      year: "Year 7",
      focus: ["Transition support from primary", "Organization skills", "Research methods", "Essay foundations"],
      color: "bg-accent-yellow/10 border-accent-yellow/20",
      iconColor: "text-accent-yellow"
    },
    {
      year: "Year 8",
      focus: ["Advanced algebra", "Science report writing", "Critical analysis", "Study routines"],
      color: "bg-accent-pink/10 border-accent-pink/20",
      iconColor: "text-accent-pink"
    },
    {
      year: "Year 9",
      focus: ["Subject selection guidance", "Extended responses", "Advanced mathematics", "Exam techniques"],
      color: "bg-accent-teal/10 border-accent-teal/20",
      iconColor: "text-accent-teal"
    },
    {
      year: "Year 10",
      focus: ["RoSA preparation", "HSC subject selection", "Advanced writing", "Career exploration"],
      color: "bg-accent-purple/10 border-accent-purple/20",
      iconColor: "text-accent-purple"
    }
  ];

  const subjects = [
    "Mathematics (Core & Advanced)",
    "English (Standard & Advanced)",
    "Sciences (Physics, Chemistry, Biology)",
    "Commerce & Economics"
  ];

  return (
    <div className="min-h-screen bg-brand-canvas overflow-x-hidden pt-[120px]">
      <SEO
        title="High School Tutoring (Years 7-10)"
        description="Empowering students through the crucial middle years with confidence, clarity, and academic excellence at DA Tuition."
        canonicalUrl="/programs/high-school"
      />
      <NavigationNew />
      <StickyBookButton />

      <main className="max-w-[1400px] mx-auto space-y-24 lg:space-y-32 pb-32 px-4 sm:px-6 lg:px-8">

        {/* Hero Section */}
        <section className="relative rounded-[2.5rem] overflow-hidden shadow-2xl mx-4 sm:mx-0 mt-6 mb-16">
          <div className="absolute inset-0">
            <img src="/images/v3/high_energy_class.jpg" alt="High School Class" className="w-full h-full object-cover" />
            {/* Beautiful dark navy wash for perfect text readability */}
            <div className="absolute inset-0 bg-brand-navy/80 mix-blend-multiply"></div>
            {/* Optional gradient for extra text pop */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/50 to-brand-navy/30"></div>
          </div>

          <div className="relative z-10 max-w-4xl mx-auto text-center py-12 sm:py-16 lg:py-24 px-6">
            <div className="inline-flex items-center justify-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-6 py-2 border border-white/20 mb-8">
              <GraduationCap className="w-5 h-5 text-brand-gold" />
              <span className="text-sm font-bold text-white tracking-wide uppercase">Years 7 to 10</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight drop-shadow-lg">
              High School <br />
              <span className="text-brand-gold">Tutoring</span>
            </h1>

            <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
              Empowering students through the crucial middle years with confidence, clarity, and academic excellence.
            </p>
          </div>
        </section>

        {/* Intro Bento Box */}
        <section className="relative">
          <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-xl shadow-brand-navy/5 border border-brand-navy/5">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-extrabold text-brand-navy mb-6">Navigating the Journey Together</h2>
                <div className="space-y-4 text-lg text-brand-navy/70 leading-relaxed">
                  <p>
                    The transition to high school brings new challenges: multiple teachers, increased workload, and growing
                    academic expectations. At DA Tuition, we understand these pressures and provide the support system every
                    teenager needs to thrive, not just survive.
                  </p>
                  <p>
                    Our high school program isn't about overwhelming students with more work. It's about working smarter,
                    building confidence, and developing the skills that will serve them throughout their academic career and beyond.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="bg-brand-canvas rounded-2xl p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                    <feature.icon className="w-8 h-8 text-brand-blue mb-4" />
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
          <div className="rounded-[2rem] overflow-hidden shadow-xl h-[300px] md:h-[450px] relative group border border-brand-navy/5">
            <img src="/images/v3/mission_plaque.jpg" alt="DA Tuition Mission Statement" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-brand-navy/5 mix-blend-overlay"></div>
          </div>
        </section>

        {/* Year Level Breakdown - Bento Grid */}
        <section>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-navy mb-4">
              Year-by-Year Support
            </h2>
            <p className="text-lg text-brand-navy/70">
              Each year brings unique challenges and opportunities. Our curriculum adapts to meet students exactly where they are.
            </p>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
            {yearLevels.map((level, index) => (
              <div key={index} className={`rounded-3xl p-8 border ${level.color} transition-all duration-300 hover:shadow-lg`}>
                <h3 className="text-2xl font-black text-brand-navy mb-6">{level.year}</h3>
                <ul className="space-y-4">
                  {level.focus.map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle className={`w-5 h-5 ${level.iconColor} mt-0.5 mr-3 flex-shrink-0`} />
                      <span className="text-brand-navy font-medium leading-tight">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Study Skills & Support / Testimonial Combo */}
        <section>
          <div className="grid lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-brand-navy rounded-[2rem] p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent-teal/20 rounded-full blur-[60px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
              <h3 className="text-3xl font-extrabold mb-4 relative z-10">Beyond Subject Tutoring</h3>
              <p className="text-white/80 mb-8 relative z-10 text-lg">
                High school success requires more than just subject knowledge. We equip students with essential skills to excel independently.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 relative z-10">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h4 className="font-bold text-accent-yellow mb-2">Time Management</h4>
                  <p className="text-sm text-white/80">Balancing multiple subjects and extracurriculars effectively.</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h4 className="font-bold text-accent-pink mb-2">Note-Taking</h4>
                  <p className="text-sm text-white/80">Effective structuring methods tailored for different subjects.</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h4 className="font-bold text-brand-blue mb-2">Exam Preparation</h4>
                  <p className="text-sm text-white/80">Strategic revision techniques and intelligent stress management.</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h4 className="font-bold text-accent-teal mb-2">RoSA Preparation</h4>
                  <p className="text-sm text-white/80">Crucial Year 10 milestone guidance and HSC pathing.</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white rounded-[2rem] p-8 md:p-12 border border-brand-navy/5 shadow-xl shadow-brand-navy/5 flex flex-col justify-center relative overflow-hidden">
              <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-accent-purple/10 rounded-full blur-[40px] pointer-events-none"></div>

              <Quote className="w-12 h-12 text-brand-blue/20 mb-6" />
              <blockquote className="text-xl text-brand-navy font-medium italic leading-relaxed mb-8 relative z-10">
                "My marks have been extremely excellent because she encourages us to try and do well. She makes any problem that we have so much easier to understand, which helps to improve our work... She will listen to any questions that I have, which makes it easier for me to improve because she gives me helpful advice that will benefit me during the exam, or in school."
              </blockquote>
              <div className="flex items-center space-x-4 relative z-10">
                <div className="w-12 h-12 bg-accent-pink/20 rounded-full flex items-center justify-center text-accent-pink font-bold text-xl">C</div>
                <div>
                  <p className="font-bold text-brand-navy">Chau Ho</p>
                  <p className="text-sm text-brand-navy/60 font-medium">Year 10 Student</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Subject Coverage */}
        <section>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-navy mb-4">
              Comprehensive Subject Support
            </h2>
            <p className="text-lg text-brand-navy/70">
              Expert tutoring across all core subjects, meticulously aligned with the NSW curriculum.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
            {subjects.map((subject, index) => (
              <div key={index} className="bg-white rounded-[1.5rem] p-6 text-center border border-brand-navy/5 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-bold text-brand-navy">{subject}</h3>
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

        {/* Timetable Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-brand-navy mb-4">Class Timetable</h2>
              <p className="text-lg text-brand-midnight/70 italic">Convenient sessions for busy high school students</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-brand-blue/10">
                <CardContent className="p-8 text-center">
                  <Clock className="w-10 h-10 text-brand-blue mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Weekday Evenings</h3>
                  <p className="text-brand-blue font-bold text-lg mb-4">Tue – Fri</p>
                  <p className="text-brand-midnight/70">Study sessions from</p>
                  <p className="text-2xl font-black text-brand-navy">5:00 PM – 9:00 PM</p>
                </CardContent>
              </Card>

              <Card className="border-brand-blue/10 shadow-xl scale-105 relative z-10">
                <div className="absolute top-0 inset-x-0 h-1.5 bg-brand-blue rounded-t-xl"></div>
                <CardContent className="p-8 text-center">
                  <Clock className="w-10 h-10 text-brand-blue mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Saturdays</h3>
                  <p className="text-brand-blue font-bold text-lg mb-4">Full Day Sessions</p>
                  <p className="text-brand-midnight/70">Full day availability</p>
                  <p className="text-2xl font-black text-brand-navy">9 AM – 6 PM</p>
                </CardContent>
              </Card>

              <Card className="border-brand-blue/10">
                <CardContent className="p-8 text-center">
                  <Clock className="w-10 h-10 text-brand-blue mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Sundays</h3>
                  <p className="text-brand-blue font-bold text-lg mb-4">Weekend Sessions</p>
                  <p className="text-brand-midnight/70">Sessions available</p>
                  <p className="text-2xl font-black text-brand-navy">10 AM – 7 PM</p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12 bg-white rounded-2xl p-6 text-center border border-brand-blue/10 max-w-2xl mx-auto">
              <p className="text-brand-midnight/80">
                <span className="font-bold text-brand-blue">Note:</span> Class durations for Years 7-10 are typically 2 hours. 
                Contact us to check availability for specific subjects and year levels.
              </p>
            </div>
          </div>
        </section>

        {/* Discover More Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-brand-navy mb-8 text-center">Explore Our Other Programs</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Link to="/programs/primary-school" className="group">
                <Card className="hover:shadow-xl transition-all duration-300 border-brand-blue/10 h-full">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-orange-500 transition-colors">
                      <BookOpen className="w-6 h-6 text-orange-600 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-orange-600 transition-colors">Primary School (K-6)</h3>
                    <p className="text-brand-navy/70 text-sm mb-4">Nurture a love of learning and build essential academic foundations for the primary years.</p>
                    <div className="flex items-center text-orange-600 font-bold text-sm">
                      Learn More <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/hsc-excellence" className="group">
                <Card className="hover:shadow-xl transition-all duration-300 border-brand-blue/10 h-full">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-brand-midnight/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-brand-midnight transition-colors">
                      <GraduationCap className="w-6 h-6 text-brand-midnight group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-brand-midnight transition-colors">HSC Excellence (11-12)</h3>
                    <p className="text-brand-navy/70 text-sm mb-4">Intensive HSC preparation with proven strategies for maximum ATAR results.</p>
                    <div className="flex items-center text-brand-midnight font-bold text-sm">
                      Learn More <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/find-teacher" className="group">
                <Card className="hover:shadow-xl transition-all duration-300 border-brand-blue/10 h-full">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-accent-pink/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-accent-pink transition-colors">
                      <Users className="w-6 h-6 text-accent-pink group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-accent-pink transition-colors">Find a Teacher</h3>
                    <p className="text-brand-navy/70 text-sm mb-4">Meet our team of exceptional educators and find the perfect match for your child.</p>
                    <div className="flex items-center text-accent-pink font-bold text-sm">
                      Meet the Team <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </section>

        {/* Pathway to HSC / CTA Combo Section */}
        <section>
          <div className="bg-brand-blue rounded-[2rem] p-12 md:p-16 text-center shadow-2xl relative overflow-hidden">
            {/* Abstract background shapes */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-navy/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/3"></div>

            <div className="relative z-10 max-w-3xl mx-auto">
              <div className="inline-flex items-center justify-center space-x-2 bg-white/10 rounded-full px-6 py-2 border border-white/20 mb-8 backdrop-blur-sm">
                <Award className="w-5 h-5 text-brand-gold" />
                <span className="text-sm font-bold text-white tracking-wide">Pathway to HSC Success</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
                Ready to Unlock Your Teen's Potential?
              </h2>
              <p className="text-xl text-white/90 mb-10 font-medium max-w-2xl mx-auto">
                Years 7-10 lay the foundation for HSC success. Join hundreds of students achieving their personal best with DA Tuition.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
                <Button 
                  size="lg" 
                  className="bg-brand-gold text-brand-navy hover:bg-yellow-400 font-bold px-8 h-14 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all w-full sm:w-auto"
                  onClick={() => window.location.href = '/#contact'}
                >
                  Book Interview
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-brand-navy font-bold px-8 h-14 rounded-xl transition-all w-full sm:w-auto"
                  onClick={() => window.location.href = '/#contact'}
                >
                  Request Program Guide
                </Button>
              </div>

              <div className="pt-8 border-t border-white/20 flex flex-col md:flex-row items-center justify-center gap-6">
                <Link to="/hsc-excellence">
                  <span className="text-white/90 hover:text-white font-bold underline underline-offset-4 decoration-white/40 hover:decoration-white transition-all flex items-center">
                    Learn about our specialized HSC Program <ArrowRight className="ml-2 w-4 h-4" />
                  </span>
                </Link>
                <span className="hidden md:inline text-white/30">•</span>
                <span className="text-white/80 font-medium tracking-wide">
                  Call us at <a href="tel:0401940207" className="text-white hover:text-brand-gold transition-colors">0401 940 207</a>
                </span>
              </div>
            </div>
          </div>
        </section>

      </main>

      <FooterNew />
    </div>
  );
};

export default HighSchool;