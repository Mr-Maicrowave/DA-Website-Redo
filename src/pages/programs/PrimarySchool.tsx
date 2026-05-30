import React from 'react';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import StickyBookButton from '@/components/StickyBookButton';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Sparkles, Trophy, Heart, CheckCircle, ArrowRight, Quote, Clock, GraduationCap, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import { siteStats } from '@/data/site-stats';

const PrimarySchool = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Strong Foundations",
      description: "Building essential literacy and numeracy skills that last a lifetime"
    },
    {
      icon: Trophy,
      title: "Academic Excellence",
      description: "Building strong foundations in all core subjects"
    },
    {
      icon: Sparkles,
      title: "Critical Thinking",
      description: "Developing problem-solving and analytical skills for future success"
    },
    {
      icon: Heart,
      title: "Confidence Building",
      description: "Nurturing self-belief and a love for learning in every child"
    }
  ];

  const yearLevels = [
    {
      year: "Kindergarten",
      focus: ["Letter recognition", "Basic counting", "Fine motor skills", "Reading readiness"],
      color: "bg-accent-yellow/10 border-accent-yellow/20",
      iconColor: "text-accent-yellow"
    },
    {
      year: "Years 1-2",
      focus: ["Phonics mastery", "Addition & subtraction", "Reading comprehension", "Writing sentences"],
      color: "bg-accent-pink/10 border-accent-pink/20",
      iconColor: "text-accent-pink"
    },
    {
      year: "Years 3-4",
      focus: ["Times tables", "Paragraph writing", "Reading skills", "Problem solving"],
      color: "bg-accent-teal/10 border-accent-teal/20",
      iconColor: "text-accent-teal"
    },
    {
      year: "Years 5-6",
      focus: ["Fractions & decimals", "Essay structure", "Advanced writing", "Critical thinking"],
      color: "bg-accent-purple/10 border-accent-purple/20",
      iconColor: "text-accent-purple"
    }
  ];

  const benefits = [
    "Small group tutoring (3-5 students) or classes matched to your child's needs",
    "Specially designed curriculum for examination excellence",
    "Regular progress reports to keep parents informed",
    "Assessment preparation and exam technique mastery",
    "Fun, engaging lessons that make learning enjoyable",
    "No entrance exams - every child is welcome"
  ];

  return (
    <div className="min-h-screen bg-brand-canvas overflow-x-hidden pt-[120px]">
      <SEO
        title="Primary School Tutoring (K-6)"
        description="Build strong foundations in literacy and numeracy with our specialized K-6 primary school tutoring program at DA Tuition."
        canonicalUrl="/programs/primary-school"
      />
      <NavigationNew />
      <StickyBookButton />

      <main className="max-w-[1400px] mx-auto space-y-24 lg:space-y-32 pb-32 px-4 sm:px-6 lg:px-8">

        {/* Hero Section */}
        <section className="relative rounded-[2.5rem] overflow-hidden shadow-2xl mx-4 sm:mx-0 mt-6 mb-16">
          <div className="absolute inset-0">
            <img src="/images/v3/primary_school.jpg" alt="Primary School Class" className="w-full h-full object-cover" />
            {/* Beautiful dark navy wash for perfect text readability */}
            <div className="absolute inset-0 bg-brand-navy/80 mix-blend-multiply"></div>
            {/* Optional gradient for extra text pop */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/50 to-brand-navy/30"></div>
          </div>

          <div className="relative z-10 max-w-4xl mx-auto text-center py-12 sm:py-16 lg:py-24 px-6">
            <div className="inline-flex items-center justify-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-6 py-2 border border-white/20 mb-8">
              <Sparkles className="w-5 h-5 text-brand-gold" />
              <span className="text-sm font-bold text-white tracking-wide uppercase">Kindergarten to Year 6</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight drop-shadow-lg">
              Primary School <br />
              <span className="text-brand-gold">Tutoring</span>
            </h1>

            <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
              Building strong foundations with joy, confidence, and care—because every child deserves to love learning.
            </p>
          </div>
        </section>

        {/* Intro Bento Box */}
        <section className="relative">
          <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-xl shadow-brand-navy/5 border border-brand-navy/5">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-extrabold text-brand-navy mb-6">Where Every Child's Potential Blooms</h2>
                <div className="space-y-4 text-lg text-brand-navy/70 leading-relaxed">
                  <p>
                    At DA Tuition, we believe the primary years are the most crucial for building a strong educational foundation.
                    These formative years shape not just academic skills, but also a child's confidence, curiosity, and love for learning.
                  </p>
                  <p>
                    Our primary school program goes beyond worksheets and rote learning. We create a nurturing environment where
                    children feel safe to make mistakes, ask questions, and discover their unique strengths. With no entrance exams
                    and a heart-centered approach, we welcome every child exactly where they are.
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
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-[2rem] overflow-hidden shadow-xl aspect-video md:aspect-auto md:h-[400px] border border-brand-navy/5">
              <img src="/images/v3/primary_school.jpg" alt="Active Primary School Class" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="rounded-[2rem] overflow-hidden shadow-xl aspect-video md:aspect-auto md:h-[400px] border border-brand-navy/5">
              <img src="/images/v3/small_group_tutoring.jpg" alt="Small Group Tutoring" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
          </div>
        </section>

        {/* Year Level Breakdown - Bento Grid */}
        <section>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-navy mb-4">
              Tailored Support for Every Level
            </h2>
            <p className="text-lg text-brand-navy/70">
              Our curriculum is carefully aligned with NSW standards while providing enrichment and support where your child needs it most.
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

        {/* The DA Difference & Testimonial */}
        <section>
          <div className="grid lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-brand-navy rounded-[2rem] p-8 md:p-12 text-white shadow-xl">
              <h2 className="text-3xl font-extrabold mb-8">The DA Tuition Difference</h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start bg-white/5 rounded-xl p-4 border border-white/10">
                    <Heart className="w-5 h-5 text-accent-pink mt-0.5 mr-4 flex-shrink-0" />
                    <span className="font-medium text-white/90">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 bg-white rounded-[2rem] p-8 md:p-12 border border-brand-navy/5 shadow-xl shadow-brand-navy/5 flex flex-col justify-center relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-accent-yellow/20 rounded-full blur-[40px] pointer-events-none"></div>

              <Quote className="w-12 h-12 text-brand-blue/20 mb-6" />
              <blockquote className="text-xl text-brand-navy font-medium italic leading-relaxed mb-8 relative z-10">
                "Having gone to many other tutoring places before DA tuition, I have seen my results improved in my 4 years of being here... Providing me with the support and knowledge for me to excel in my subjects, as well as making my time here the most enjoying and memory making worthy."
              </blockquote>
              <div className="flex items-center space-x-4 relative z-10">
                <div className="w-12 h-12 bg-accent-teal rounded-full flex items-center justify-center text-brand-navy font-bold text-xl">T</div>
                <div>
                  <p className="font-bold text-brand-navy">Tiffany Lang</p>
                  <p className="text-sm text-brand-navy/60 font-medium">DA Tuition Student</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Timetable Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-brand-navy mb-4">Class Timetable</h2>
              <p className="text-lg text-brand-midnight/70 italic">Flexible sessions to fit your family's schedule</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-brand-blue/10">
                <CardContent className="p-8 text-center">
                  <Clock className="w-10 h-10 text-brand-blue mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">After School</h3>
                  <p className="text-brand-blue font-bold text-lg mb-4">Tue – Fri</p>
                  <p className="text-brand-midnight/70">Sessions starting from</p>
                  <p className="text-2xl font-black text-brand-navy">5:00 PM</p>
                </CardContent>
              </Card>

              <Card className="border-brand-blue/10 shadow-xl scale-105 relative z-10">
                <div className="absolute top-0 inset-x-0 h-1.5 bg-brand-blue rounded-t-xl"></div>
                <CardContent className="p-8 text-center">
                  <Clock className="w-10 h-10 text-brand-blue mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Saturdays</h3>
                  <p className="text-brand-blue font-bold text-lg mb-4">Full Day</p>
                  <p className="text-brand-midnight/70">Sessions available</p>
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
                <span className="font-bold text-brand-blue">Note:</span> Individual class times vary by grade and subject. 
                Contact us for current availability and to find the perfect slot for your child.
              </p>
            </div>
          </div>
        </section>

        {/* Discover More Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-brand-navy mb-8 text-center">Explore Our Other Programs</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Link to="/programs/high-school" className="group">
                <Card className="hover:shadow-xl transition-all duration-300 border-brand-blue/10 h-full">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-brand-blue/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-brand-blue transition-colors">
                      <GraduationCap className="w-6 h-6 text-brand-blue group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-brand-blue transition-colors">High School (7-10)</h3>
                    <p className="text-brand-navy/70 text-sm mb-4">Build strong fundamentals and develop confident learning habits for the junior high years.</p>
                    <div className="flex items-center text-brand-blue font-bold text-sm">
                      Learn More <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/subjects" className="group">
                <Card className="hover:shadow-xl transition-all duration-300 border-brand-blue/10 h-full">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-accent-teal/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-accent-teal transition-colors">
                      <BookOpen className="w-6 h-6 text-accent-teal group-hover:text-brand-navy transition-colors" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-accent-teal transition-colors">Our Subjects</h3>
                    <p className="text-brand-navy/70 text-sm mb-4">From creative writing to advanced calculus, explore the full range of subjects we offer.</p>
                    <div className="flex items-center text-accent-teal font-bold text-sm">
                      View Subjects <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
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

        {/* CTA Section - Fixed Contrast */}
        <section>
          <div className="bg-brand-blue rounded-[2rem] p-12 md:p-16 text-center shadow-2xl relative overflow-hidden">
            {/* Abstract background shapes */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-navy/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/3"></div>

            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
                Give Your Child the Foundation They Deserve
              </h2>
              <p className="text-xl text-white/90 mb-10 font-medium max-w-2xl mx-auto">
                Join {siteStats.reviewCount} families who've discovered the joy of learning with DA Tuition.
                No entrance exams, just genuine care for your child's success.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  size="lg" 
                  className="bg-brand-gold text-brand-navy hover:bg-yellow-400 font-bold px-8 h-14 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
                  onClick={() => window.location.href = '/#contact'}
                >
                  Book Interview
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-brand-navy font-bold px-8 h-14 rounded-xl transition-all"
                  onClick={() => window.location.href = '/#contact'}
                >
                  Request Program Guide
                </Button>
              </div>

              <p className="mt-8 text-white/80 font-medium tracking-wide">
                Or call us at <a href="tel:0401940207" className="underline hover:text-white transition-colors">0401 940 207</a>
              </p>
            </div>
          </div>
        </section>

      </main>

      <FooterNew />
    </div>
  );
};

export default PrimarySchool;