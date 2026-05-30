import React from 'react';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import { Button } from '@/components/ui/button';
import { BookOpen, PenTool, MessageCircle, CheckCircle, ArrowRight, Quote, Sparkles, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';

const English = () => {
  const courses = [
    {
      level: "Primary School",
      subjects: [
        "K-6 English & Literacy",
        "Reading Comprehension",
        "Creative Writing",
        "Grammar & Spelling"
      ]
    },
    {
      level: "Years 7-10",
      subjects: [
        "Core English",
        "Essay Writing",
        "Text Analysis",
        "Creative Writing"
      ]
    },
    {
      level: "HSC - Year 11 & 12",
      subjects: [
        "English Standard",
        "English Advanced",
        "English Extension 1",
        "English Extension 2"
      ]
    }
  ];

  const hscModules = {
    standard: [
      "Contemporary Possibilities",
      "Close Study of Literature",
      "Language, Identity & Culture",
      "Craft of Writing"
    ],
    advanced: [
      "Textual Conversations",
      "Critical Study of Literature",
      "Texts & Human Experiences",
      "Craft of Writing"
    ],
    extension1: [
      "Literary Worlds",
      "Literary Homelands",
      "Intersecting Worlds",
      "Reimagined Worlds"
    ],
    extension2: [
      "Major Work Development",
      "Critical Response",
      "Imaginative Portfolio",
      "Research & Reflection"
    ]
  };

  const writingSkills = [
    "Essay structure and argumentation",
    "Creative writing techniques",
    "Critical analysis and evaluation",
    "Textual evidence integration",
    "Sophisticated vocabulary development",
    "Grammar and syntax mastery"
  ];

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="English Tutoring (K-12 & HSC)"
        description="From Literacy Foundations to Extension 2. Developing confident communicators through expert teaching and comprehensive support at DA Tuition."
        canonicalUrl="/subjects/english"
      />
      <NavigationNew />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-[120px]">
        {/* Hero Section */}
        <section className="relative rounded-[2.5rem] overflow-hidden shadow-2xl mx-4 sm:mx-0 mt-6 mb-16">
          <div className="absolute inset-0">
            <img src="/images/v3/teacher_screen.jpg" alt="English Tutoring" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-brand-navy/80 mix-blend-multiply"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/50 to-brand-navy/30"></div>
          </div>

          <div className="relative z-10 max-w-4xl mx-auto text-center py-12 sm:py-16 lg:py-24 px-6">
            <div className="inline-flex items-center justify-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-6 py-2 border border-white/20 mb-8">
              <BookOpen className="w-5 h-5 text-pink-400" />
              <span className="text-sm font-bold text-white tracking-wide uppercase">Years K to 12</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight drop-shadow-lg">
              English <br />
              <span className="text-pink-400">Excellence</span>
            </h1>

            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow-md">
              From Literacy Foundations to Extension 2. Developing confident communicators through expert teaching and comprehensive support.
            </p>

            <div className="flex justify-center">
              <Button size="lg" className="bg-pink-500 text-white hover:bg-pink-600 font-bold px-8 h-14 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                Book Interview
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </section>
      </div>

      {/* Learning Formats Callout */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-200">
            <div className="flex items-start">
              <Info className="w-6 h-6 text-purple-600 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-brand-midnight mb-2">Available in Small Groups & Classes</h3>
                <p className="text-brand-midnight/80 mb-4">
                  English at DA Tuition is offered in both small group tutoring (3-5 students) and classes.
                  Small groups foster rich discussions and peer feedback, while classes provide exam practice
                  and structured essay competitions. We match each student to their ideal learning environment.
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

      {/* Course Offerings */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-brand-midnight mb-4">
            Comprehensive English Programs
          </h2>
          <p className="text-center text-brand-midnight/80 mb-12 max-w-2xl mx-auto">
            From early literacy to HSC Extension 2, we nurture every student's communication skills
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {courses.map((level, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-purple-600 mb-4">{level.level}</h3>
                <ul className="space-y-2">
                  {level.subjects.map((subject, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-brand-midnight/80">{subject}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HSC English Focus */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-brand-midnight mb-12">
            HSC English Mastery
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Standard English */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-brand-midnight mb-3">English Standard</h3>
              <ul className="space-y-1">
                {hscModules.standard.map((module, idx) => (
                  <li key={idx} className="text-sm text-brand-midnight/80">• {module}</li>
                ))}
              </ul>
              <div className="mt-4 text-sm font-semibold text-purple-600">Band 6 Achievable</div>
            </div>

            {/* Advanced English */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-brand-midnight mb-3">English Advanced</h3>
              <ul className="space-y-1">
                {hscModules.advanced.map((module, idx) => (
                  <li key={idx} className="text-sm text-brand-midnight/80">• {module}</li>
                ))}
              </ul>
              <div className="mt-4 text-sm font-semibold text-pink-600">Critical Thinking</div>
            </div>

            {/* Extension 1 */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-brand-midnight mb-3">Extension 1</h3>
              <ul className="space-y-1">
                {hscModules.extension1.map((module, idx) => (
                  <li key={idx} className="text-sm text-brand-midnight/80">• {module}</li>
                ))}
              </ul>
              <div className="mt-4 text-sm font-semibold text-indigo-600">Literary Analysis</div>
            </div>

            {/* Extension 2 */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-brand-midnight mb-3">Extension 2</h3>
              <ul className="space-y-1">
                {hscModules.extension2.map((module, idx) => (
                  <li key={idx} className="text-sm text-brand-midnight/80">• {module}</li>
                ))}
              </ul>
              <div className="mt-4 text-sm font-semibold text-purple-600">Major Work</div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-brand-midnight/80 mb-6">
              Our English teachers are published writers and Band 6/E4 achievers who understand the nuances of HSC success
            </p>
            <Link to="/hsc-excellence">
              <Button variant="outline" size="lg" className="group">
                Explore HSC Program
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Writing Skills Development */}
      <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-brand-midnight mb-6">Building Strong Writers</h3>
              <p className="text-brand-midnight/80 mb-6">
                Writing is a craft that improves through practice, feedback, and exposure to different styles.
                Our comprehensive approach develops confident, articulate writers.
              </p>
              <ul className="space-y-3">
                {writingSkills.map((skill, index) => (
                  <li key={index} className="flex items-start">
                    <PenTool className="w-5 h-5 text-purple-600 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-brand-midnight/80">{skill}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <div className="pastel-card pastel-pink-soft">
                <h4 className="text-xl font-bold text-brand-midnight mb-3">Essay Excellence</h4>
                <p className="text-brand-midnight/80">
                  Master the art of essay writing with structured approaches, sophisticated analysis,
                  and compelling arguments that earn top marks.
                </p>
              </div>

              <div className="pastel-card pastel-purple-soft">
                <h4 className="text-xl font-bold text-brand-midnight mb-3">Creative Voice</h4>
                <p className="text-brand-midnight/80">
                  Develop your unique creative voice through workshops, peer feedback, and exposure
                  to diverse writing styles and genres.
                </p>
              </div>

              <div className="pastel-card pastel-indigo-soft">
                <h4 className="text-xl font-bold text-brand-midnight mb-3">Text Analysis</h4>
                <p className="text-brand-midnight/80">
                  Learn to decode complex texts, identify techniques, and craft insightful responses
                  that demonstrate deep understanding.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reading & Comprehension */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-brand-midnight mb-12">
            Developing Lifelong Readers
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <BookOpen className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold text-brand-midnight mb-3">Text Analysis</h3>
              <p className="text-brand-midnight/80">
                Students learn to decode complex texts, identify techniques, and understand authorial purpose
                through systematic exploration.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <MessageCircle className="w-12 h-12 text-pink-600 mb-4" />
              <h3 className="text-xl font-bold text-brand-midnight mb-3">Critical Discussion</h3>
              <p className="text-brand-midnight/80">
                Develop critical thinking through discussions where students challenge ideas, defend interpretations,
                and explore multiple perspectives.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <Sparkles className="w-12 h-12 text-indigo-600 mb-4" />
              <h3 className="text-xl font-bold text-brand-midnight mb-3">Creative Response</h3>
              <p className="text-brand-midnight/80">
                Students respond to texts creatively through writing, presentations, and projects that
                demonstrate deep engagement with literature.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Success Story */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Quote className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-brand-midnight mb-2">Finding My Voice</h3>
            </div>
            <blockquote className="text-lg text-brand-midnight/80 italic text-center mb-6">
              "I was terrified of English - especially essay writing and analysis. But DA Tuition's systematic
              approach and supportive teachers transformed my confidence. By Year 12, I was writing sophisticated
              essays and achieved an E4 in Extension 2. The structured feedback and regular practice made all
              the difference."
            </blockquote>
            <p className="text-center text-brand-midnight/80">
              <strong>Sophie Chen</strong> - Now studying Creative Writing at UTS
            </p>
          </div>
        </div>
      </section>

      {/* Special Programs */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-brand-midnight mb-12">
            Specialized English Support
          </h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="pastel-card pastel-purple-soft">
              <h3 className="text-xl font-bold text-brand-midnight mb-4">Essay Writing Workshops</h3>
              <p className="text-brand-midnight/80 mb-4">
                Intensive workshops focusing on essay structure, argumentation, and sophisticated analysis
                for HSC success.
              </p>
              <ul className="space-y-2">
                <li className="text-brand-midnight/80">• Introduction and thesis development</li>
                <li className="text-brand-midnight/80">• Body paragraph structure (PEEL/TEEL)</li>
                <li className="text-brand-midnight/80">• Evidence integration</li>
                <li className="text-brand-midnight/80">• Conclusion techniques</li>
              </ul>
            </div>

            <div className="pastel-card pastel-pink-soft">
              <h3 className="text-xl font-bold text-brand-midnight mb-4">Creative Writing Circle</h3>
              <p className="text-brand-midnight/80 mb-4">
                A supportive environment where students develop their creative voice through workshops
                and collaborative storytelling.
              </p>
              <ul className="space-y-2">
                <li className="text-brand-midnight/80">• Character development</li>
                <li className="text-brand-midnight/80">• Plot and structure</li>
                <li className="text-brand-midnight/80">• Descriptive techniques</li>
                <li className="text-brand-midnight/80">• Genre exploration</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-brand-navy text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-pink rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-blue rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl font-bold text-white mb-4">
            Discover Your English Potential
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join our comprehensive English programs and develop the skills for academic success
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-pink-600 hover:bg-pink-50">
              Book Interview
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
              View Writing Samples
            </Button>
          </div>
          <p className="mt-6 text-sm text-purple-100">
            Call <a href="tel:0401940207" className="underline">0401 940 207</a> to discuss your needs
          </p>
        </div>
      </section>

      <FooterNew />
    </div>
  );
};

export default English;