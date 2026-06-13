import React from 'react';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import { Button } from '@/components/ui/button';
import { Atom, Beaker, Zap, CheckCircle, ArrowRight, Quote, Sparkles, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';

const Science = () => {
  const courses = [
    {
      level: "Year 11 & 12 Physics",
      topics: [
        "Kinematics & Dynamics",
        "Waves & Thermodynamics",
        "Electricity & Magnetism",
        "Light & Quantum Theory",
        "From the Universe to the Atom"
      ],
      focus: "Mathematical problem-solving and conceptual understanding"
    },
    {
      level: "Year 11 & 12 Chemistry",
      topics: [
        "Properties & Structure of Matter",
        "Chemical Reactions & Stoichiometry",
        "Organic Chemistry",
        "Acid-Base Reactions",
        "Applied Chemistry & Equilibrium"
      ],
      focus: "Laboratory skills and chemical calculations"
    }
  ];

  const practicalSkills = [
    "First-hand investigation design",
    "Data collection and analysis",
    "Scientific report writing",
    "Error analysis and evaluation",
    "Depth study development",
    "Practical assessment preparation"
  ];

  const examPrep = [
    "Past HSC paper practice",
    "Multiple choice strategies",
    "Extended response techniques",
    "Calculation methods",
    "Graph interpretation",
    "Time management skills"
  ];

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="HSC Science Tutoring (Physics & Chemistry)"
        description="Master complex scientific concepts in Physics and Chemistry through expert guidance and systematic learning at DA Tuition."
        canonicalUrl="/subjects/science"
      />
      <NavigationNew />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-[120px]">
        {/* Hero Section */}
        <section className="relative rounded-[2.5rem] overflow-hidden shadow-2xl mx-4 sm:mx-0 mt-6 mb-16">
          <div className="absolute inset-0">
            <img src="/images/v3/collaborative_learning.jpg" alt="Science Tutoring" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-brand-navy/80 mix-blend-multiply"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/50 to-brand-navy/30"></div>
          </div>

          <div className="relative z-10 max-w-4xl mx-auto text-center py-12 sm:py-16 lg:py-24 px-6">
            <div className="inline-flex items-center justify-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-6 py-2 border border-white/20 mb-8">
              <Atom className="w-5 h-5 text-green-400" />
              <span className="text-sm font-bold text-white tracking-wide uppercase">Years 11 & 12</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight drop-shadow-lg">
              Science <br />
              <span className="text-green-400">Excellence</span>
            </h1>

            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow-md">
              Master complex scientific concepts in Physics and Chemistry through expert guidance and systematic learning.
            </p>


          </div>
        </section>
      </div>

      {/* Learning Formats Callout */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200">
            <div className="flex items-start">
              <Info className="w-6 h-6 text-green-600 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-brand-midnight mb-2">Available in Small Groups & Classes</h3>
                <p className="text-brand-midnight/80 mb-4">
                  Science at DA Tuition is offered in both small group tutoring (3-5 students) and classes.
                  Small groups allow for collaborative problem-solving and peer learning, while classes provide
                  exam practice and practical demonstrations. We match each student to their optimal learning format.
                </p>
                <Link to="/learning-formats">
                  <Button variant="outline" className="group">
                    Learn About Our Learning Formats
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Details */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-brand-midnight mb-4">
            HSC Physics & Chemistry Programs
          </h2>
          <p className="text-center text-brand-midnight/80 mb-12 max-w-2xl mx-auto">
            Comprehensive Year 11 & 12 support for both Physics and Chemistry with expert teachers
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {courses.map((course, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center mb-4">
                  {index === 0 ? (
                    <Zap className="w-8 h-8 text-blue-600 mr-3" />
                  ) : (
                    <Beaker className="w-8 h-8 text-purple-600 mr-3" />
                  )}
                  <h3 className="text-2xl font-bold text-brand-midnight">{course.level}</h3>
                </div>
                <p className="text-brand-midnight/80 mb-4 italic">{course.focus}</p>
                <ul className="space-y-2">
                  {course.topics.map((topic, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-brand-midnight/80">{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Practical Skills & Exam Prep */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-brand-midnight mb-12">
            HSC Science Success Formula
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center mb-4">
                <Beaker className="w-8 h-8 text-green-600 mr-3" />
                <h3 className="text-2xl font-bold text-brand-midnight">Practical Skills</h3>
              </div>
              <p className="text-brand-midnight/80 mb-4">
                Master the essential practical and analytical skills required for HSC Science success
              </p>
              <ul className="space-y-2">
                {practicalSkills.map((skill, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-brand-midnight/80">{skill}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center mb-4">
                <Zap className="w-8 h-8 text-blue-600 mr-3" />
                <h3 className="text-2xl font-bold text-brand-midnight">Exam Preparation</h3>
              </div>
              <p className="text-brand-midnight/80 mb-4">
                Develop the strategies and techniques needed to excel in HSC Science examinations
              </p>
              <ul className="space-y-2">
                {examPrep.map((technique, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-brand-midnight/80">{technique}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Scientific Method Approach */}
      <section className="py-16 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-brand-midnight mb-12">
            Our Scientific Approach
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <Atom className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-brand-midnight mb-3">Conceptual Understanding</h3>
              <p className="text-brand-midnight/80">
                We focus on deep understanding of scientific principles, not just memorization. Students learn
                the 'why' behind phenomena, making complex topics accessible and memorable.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <Beaker className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-xl font-bold text-brand-midnight mb-3">Problem-Solving Skills</h3>
              <p className="text-brand-midnight/80">
                Master systematic approaches to solving complex physics and chemistry problems. Learn to break
                down questions, identify key information, and apply appropriate formulas.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <Sparkles className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold text-brand-midnight mb-3">Exam Excellence</h3>
              <p className="text-brand-midnight/80">
                Strategic exam preparation with past paper practice, time management techniques, and marking
                criteria analysis ensures students maximize their HSC marks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Success Story */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Quote className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-brand-midnight mb-2">From Confusion to Clarity</h3>
            </div>
            <blockquote className="text-lg text-brand-midnight/80 italic text-center mb-6">
              "Physics was my weakest subject until I joined DA Tuition. The systematic approach to problem-solving
              and the patient explanations transformed my understanding. I went from barely passing to achieving
              Band 6 in both Physics and Chemistry. The exam techniques and past paper practice were invaluable."
            </blockquote>
            <p className="text-center text-brand-midnight/80">
              <strong>Michael Zhang</strong> - Band 6 in Physics & Chemistry, now studying Medicine at UNSW
            </p>
          </div>
        </div>
      </section>

      {/* Topics Coverage */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-brand-midnight mb-12">
            Comprehensive Topic Coverage
          </h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="pastel-card pastel-blue-soft">
              <h3 className="text-xl font-bold text-brand-midnight mb-4">Physics Deep Dives</h3>
              <p className="text-brand-midnight/80 mb-4">
                From motion and forces to quantum physics and special relativity, we cover every HSC topic
                with clarity and depth.
              </p>
              <Link to="/hsc-excellence">
                <Button variant="outline" size="sm" className="group">
                  View HSC Program
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            <div className="pastel-card pastel-green-soft">
              <h3 className="text-xl font-bold text-brand-midnight mb-4">Chemistry Mastery</h3>
              <p className="text-brand-midnight/80 mb-4">
                Master chemical calculations, organic reactions, and equilibrium concepts with our structured
                approach and extensive practice.
              </p>
              <Link to="/hsc-excellence">
                <Button variant="outline" size="sm" className="group">
                  View HSC Program
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-brand-navy text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-green rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-blue rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl font-bold text-white mb-4">
            Excel in HSC Sciences
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Join our comprehensive science programs and achieve the Band 6 results you deserve
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
<Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
              Call 0401 940 207
            </Button>
          </div>
        </div>
      </section>

      <FooterNew />
    </div>
  );
};

export default Science;