import React from 'react';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import { Button } from '@/components/ui/button';
import { Scale, Gavel, BookOpen, CheckCircle, ArrowRight, Quote, Shield, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';

const LegalStudies = () => {
  const topics = [
    {
      module: "Crime",
      content: [
        "Nature of crime",
        "Criminal investigation process",
        "Criminal trial process",
        "Sentencing and punishment"
      ]
    },
    {
      module: "Human Rights",
      content: [
        "Nature and development of human rights",
        "Promoting and enforcing human rights",
        "Contemporary human rights issues",
        "International instruments"
      ]
    },
    {
      module: "Family",
      content: [
        "Nature of family law",
        "Legal rights and obligations",
        "Alternative family arrangements",
        "Contemporary family issues"
      ]
    },
    {
      module: "Workplace",
      content: [
        "Employment contracts",
        "Rights and obligations",
        "Workplace disputes",
        "Work health and safety"
      ]
    }
  ];

  const legalSkills = [
    "Legal reasoning and analysis",
    "Case law interpretation",
    "Statutory interpretation",
    "Legal essay writing",
    "Evaluation of effectiveness",
    "Critical thinking"
  ];

  const assessmentFocus = [
    {
      type: "Legal Essays",
      tips: "LCMR structure, integrated case studies, evaluation of effectiveness"
    },
    {
      type: "Case Studies",
      tips: "Apply legislation, analyze precedents, consider multiple perspectives"
    },
    {
      type: "Research Tasks",
      tips: "Current legal issues, media articles, law reform recommendations"
    },
    {
      type: "Oral Presentations",
      tips: "Legal arguments, mock trials, parliamentary debates"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="HSC Legal Studies Tutoring"
        description="Master the Australian legal system through case analysis and critical evaluation at DA Tuition."
        canonicalUrl="/subjects/legal-studies"
      />
      <NavigationNew />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-[120px]">
        {/* Hero Section */}
        <section className="relative rounded-[2.5rem] overflow-hidden shadow-2xl mx-4 sm:mx-0 mt-6 mb-16">
          <div className="absolute inset-0">
            <img src="/images/programs/highschool-peer-notes.jpg" alt="Legal Studies Tutoring" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-brand-navy/80 mix-blend-multiply"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/50 to-brand-navy/30"></div>
          </div>

          <div className="relative z-10 max-w-4xl mx-auto text-center py-12 sm:py-16 lg:py-24 px-6">
            <div className="inline-flex items-center justify-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-6 py-2 border border-white/20 mb-8">
              <Scale className="w-5 h-5 text-purple-400" />
              <span className="text-sm font-bold text-white tracking-wide uppercase">Years 11 & 12</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight drop-shadow-lg">
              Legal <br />
              <span className="text-purple-400">Studies</span>
            </h1>

            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow-md">
              HSC Legal Excellence. Master the Australian legal system through case analysis and critical evaluation.
            </p>

            <div className="flex justify-center">
              <Button size="lg" className="bg-purple-500 text-white hover:bg-purple-600 font-bold px-8 h-14 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
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
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-8 border border-purple-200">
            <div className="flex items-start">
              <Info className="w-6 h-6 text-purple-600 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-brand-midnight mb-2">Available in Small Groups & Classes</h3>
                <p className="text-brand-midnight/80 mb-4">
                  Legal Studies at DA Tuition is offered in both small group tutoring (3-5 students) and classes.
                  Small groups excel for mock trials and case debates, while classes provide moot court competitions
                  and timed legal essay practice under exam conditions.
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

      {/* HSC Legal Studies Topics */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-brand-midnight mb-4">
            HSC Legal Studies Core & Options
          </h2>
          <p className="text-center text-brand-midnight/80 mb-12 max-w-2xl mx-auto">
            Comprehensive coverage of core crime module and popular option topics
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topics.map((topic, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-purple-600 mb-4">{topic.module}</h3>
                <ul className="space-y-2">
                  {topic.content.map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-sm text-brand-midnight/80">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Legal Skills & LCMR Method */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-brand-midnight mb-12">
            Legal Thinking & Essay Excellence
          </h2>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-brand-midnight mb-6">Master the LCMR Method</h3>
              <p className="text-brand-midnight/80 mb-6">
                The key to Band 6 Legal Studies essays is the LCMR structure - Legislation, Cases, Media, and
                Reform. We teach students to seamlessly integrate these elements for sophisticated legal analysis.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-purple-600 font-bold">L</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-midnight">Legislation</h4>
                    <p className="text-brand-midnight/80 text-sm">Cite relevant statutes and explain their application</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-purple-600 font-bold">C</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-midnight">Cases</h4>
                    <p className="text-brand-midnight/80 text-sm">Use landmark cases to illustrate legal principles</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-purple-600 font-bold">M</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-midnight">Media</h4>
                    <p className="text-brand-midnight/80 text-sm">Incorporate current examples and contemporary issues</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-purple-600 font-bold">R</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-midnight">Reform</h4>
                    <p className="text-brand-midnight/80 text-sm">Evaluate effectiveness and suggest improvements</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h4 className="text-xl font-bold text-brand-midnight mb-4">Essential Legal Skills</h4>
                <ul className="space-y-2">
                  {legalSkills.map((skill, index) => (
                    <li key={index} className="flex items-start">
                      <Scale className="w-5 h-5 text-purple-600 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-brand-midnight/80">{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Assessment Types */}
      <section className="py-16 bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-brand-midnight mb-12">
            HSC Assessment Preparation
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {assessmentFocus.map((assessment, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                <Gavel className="w-8 h-8 text-purple-600 mb-3" />
                <h3 className="text-lg font-bold text-brand-midnight mb-2">{assessment.type}</h3>
                <p className="text-sm text-brand-midnight/80">{assessment.tips}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Law Focus */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-brand-midnight mb-12">
            Landmark Cases & Legal Principles
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <Shield className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold text-brand-midnight mb-3">Criminal Law</h3>
              <p className="text-brand-midnight/80">
                Master key cases like R v Blaue, Dietrich v The Queen, and understand principles of criminal
                responsibility, defences, and sentencing.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <BookOpen className="w-12 h-12 text-indigo-600 mb-4" />
              <h3 className="text-xl font-bold text-brand-midnight mb-3">Human Rights</h3>
              <p className="text-brand-midnight/80">
                Explore international instruments, Australian cases, and contemporary issues in asylum seekers,
                Indigenous rights, and civil liberties.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <Scale className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-brand-midnight mb-3">Law Reform</h3>
              <p className="text-brand-midnight/80">
                Evaluate the effectiveness of law reform agencies, understand the process of legal change,
                and analyze contemporary reform issues.
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
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Quote className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-brand-midnight mb-2">From Confusion to Clarity</h3>
            </div>
            <blockquote className="text-lg text-brand-midnight/80 italic text-center mb-6">
              "Legal Studies seemed overwhelming until I joined DA Tuition. The LCMR method transformed my
              essay writing, and the mock trials made law come alive. I went from struggling with 60s to
              achieving Band 6. The systematic approach to case analysis was a game-changer."
            </blockquote>
            <p className="text-center text-brand-midnight/80">
              <strong>Sarah Mitchell</strong> - Band 6 in Legal Studies, now studying Law at USYD
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-brand-navy text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-purple rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-blue rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl font-bold text-white mb-4">
            Excel in HSC Legal Studies
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Master legal thinking and achieve the Band 6 results you deserve
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-purple-50">
              Book Interview
            </Button>
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

export default LegalStudies;