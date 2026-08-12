import React from 'react';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import SubjectHero from '@/components/subjects/SubjectHero';
import SubjectTypedBanner from '@/components/subjects/SubjectTypedBanner';
import TrustedSchoolsStrip from '@/components/subjects/TrustedSchoolsStrip';
import { Button } from '@/components/ui/button';
import { TrendingUp, Briefcase, LineChart, CheckCircle, ArrowRight, Quote, Target, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';

const businessTrustedSchools = [
  { name: 'Freeman Catholic College', logoSrc: '/images/schools/freeman-catholic-college.png' },
  { name: 'Mary MacKillop Catholic College', logoSrc: '/images/schools/mary-mackillop-catholic-college.png' },
  { name: 'Canley Vale High School', logoSrc: '/images/schools/canley-vale-high-school.png' },
  { name: 'Fairvale High School', logoSrc: '/images/schools/fairvale-high-school.png' },
  { name: 'Patrician Brothers Catholic College Fairfield', logoSrc: '/images/schools/patrician-brothers-fairfield.png' },
  { name: "St John's Park High School", logoSrc: '/images/schools/st-johns-park-high-school.png' },
  { name: 'Al-Faisal College', logoSrc: '/images/schools/al-faisal-college.png' },
];

const BusinessStudies = () => {
  const topics = [
    {
      module: "Operations",
      content: [
        "Operations strategies",
        "Supply chain management",
        "Quality management",
        "Technology in operations"
      ]
    },
    {
      module: "Marketing",
      content: [
        "Marketing strategies",
        "Market research",
        "Consumer behaviour",
        "Global marketing"
      ]
    },
    {
      module: "Finance",
      content: [
        "Financial management",
        "Working capital",
        "Profitability management",
        "Financial planning"
      ]
    },
    {
      module: "Human Resources",
      content: [
        "HR strategies",
        "Leadership styles",
        "Motivation theories",
        "Training & development"
      ]
    }
  ];

  const assessmentTypes = [
    "Business reports",
    "Case study analysis",
    "Extended response essays",
    "Financial calculations",
    "Marketing plans",
    "Strategic recommendations"
  ];

  const careerPaths = [
    "Business Management",
    "Marketing & Advertising",
    "Accounting & Finance",
    "Human Resources",
    "Entrepreneurship",
    "International Business"
  ];

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="HSC Business Studies Tutoring"
        description="Master business concepts through case studies and real-world applications at DA Tuition."
        canonicalUrl="/subjects/business-studies"
      />
      <NavigationNew />

      <SubjectHero
        eyebrow="Years 11-12 Business Studies"
        icon={Briefcase}
        headlineWhite="From Business Knowledge to"
        headlineGold="HSC Mastery."
        subtext="Understand the syllabus. Apply real case studies. Analyse business strategy. Write responses built for the HSC."
        proofPills={['Real case studies', 'Marked feedback', 'Clear HSC pathway']}
        exploreTargetId="business-modules"
        placeholderLabel="Business Studies classroom"
        backgroundImageSrc="/images/subjects/business-studies/hero-background.png"
        backgroundImageAlt="DA Tuition Business Studies classroom"
      />

      <TrustedSchoolsStrip schools={businessTrustedSchools} className="subject-school-strip-compact" />
      <SubjectTypedBanner
        imageSrc="/images/subjects/business-studies/master-business-studies-banner.png"
        imageAlt="Business Studies banner with business books, a globe, stationery, and a growth chart"
        headline="Master Business Studies."
        emphasis="Think strategically. Lead with insight."
      />

      {/* Learning Formats Callout */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
            <div className="flex items-start">
              <Info className="w-6 h-6 text-blue-600 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-brand-midnight mb-2">Available in Small Groups & Classes</h3>
                <p className="text-brand-midnight/80 mb-4">
                  Business Studies at DA Tuition is offered in both small group tutoring (3-5 students) and classes.
                  Small groups excel for case study discussions and collaborative strategy development, while classes
                  provide competitive business simulations and timed case analysis practice.
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

      {/* HSC Business Studies Modules */}
      <section id="business-modules" className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-brand-midnight mb-4">
            HSC Business Studies Syllabus
          </h2>
          <p className="text-center text-brand-midnight/80 mb-12 max-w-2xl mx-auto">
            Comprehensive coverage of all HSC modules with real-world applications
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topics.map((topic, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-blue-600 mb-4">{topic.module}</h3>
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

      {/* Case Study Approach */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-brand-midnight mb-12">
            Real-World Business Learning
          </h2>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-brand-midnight mb-6">Case Study Excellence</h3>
              <p className="text-brand-midnight/80 mb-6">
                Business Studies is brought to life through real case studies of Australian and global companies.
                Students learn to apply theoretical concepts to actual business scenarios, developing critical
                analysis skills essential for Band 6 achievement.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Briefcase className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-brand-midnight/80">Qantas operations strategies</span>
                </li>
                <li className="flex items-start">
                  <Briefcase className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-brand-midnight/80">Apple's marketing innovations</span>
                </li>
                <li className="flex items-start">
                  <Briefcase className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-brand-midnight/80">Google's HR management</span>
                </li>
                <li className="flex items-start">
                  <Briefcase className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-brand-midnight/80">Commonwealth Bank finance</span>
                </li>
              </ul>
            </div>

            <div className="space-y-6">
              <div className="pastel-card pastel-blue-soft">
                <h4 className="text-xl font-bold text-brand-midnight mb-3">Business Report Writing</h4>
                <p className="text-brand-midnight/80">
                  Master the art of business report writing with structured approaches, professional language,
                  and strategic recommendations that demonstrate sophisticated understanding.
                </p>
              </div>

              <div className="pastel-card pastel-indigo-soft">
                <h4 className="text-xl font-bold text-brand-midnight mb-3">Financial Analysis</h4>
                <p className="text-brand-midnight/80">
                  Develop confidence in financial calculations, ratio analysis, and interpretation of business
                  performance metrics essential for the finance module.
                </p>
              </div>

              <div className="pastel-card pastel-purple-soft">
                <h4 className="text-xl font-bold text-brand-midnight mb-3">Strategic Thinking</h4>
                <p className="text-brand-midnight/80">
                  Learn to think like a business manager, evaluating strategies, identifying opportunities,
                  and making recommendations based on business theory.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Assessment Preparation */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-brand-midnight mb-12">
            HSC Assessment Excellence
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-brand-midnight mb-4">Assessment Types</h3>
              <p className="text-brand-midnight/80 mb-4">
                We prepare students for all HSC Business Studies assessment formats
              </p>
              <ul className="space-y-2">
                {assessmentTypes.map((type, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-brand-midnight/80">{type}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-brand-midnight mb-4">Career Pathways</h3>
              <p className="text-brand-midnight/80 mb-4">
                Business Studies opens doors to diverse career opportunities
              </p>
              <ul className="space-y-2">
                {careerPaths.map((path, index) => (
                  <li key={index} className="flex items-start">
                    <Target className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-brand-midnight/80">{path}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Success Story */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Quote className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-brand-midnight mb-2">From Theory to Practice</h3>
            </div>
            <blockquote className="text-lg text-brand-midnight/80 italic text-center mb-6">
              "Business Studies at DA Tuition made complex concepts simple. The case study approach and
              real-world applications helped me understand how businesses actually work. I achieved Band 6
              and now use these skills daily in my Commerce degree at UNSW."
            </blockquote>
            <p className="text-center text-brand-midnight/80">
              <strong>Alex Thompson</strong> - Band 6 in Business Studies, Commerce/Law at UNSW
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-brand-navy text-white relative overflow-hidden">
        {/* Subtle Background Blooms */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-purple rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl font-bold text-white mb-4">
            Master HSC Business Studies
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join our comprehensive program and achieve the Band 6 results you deserve
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
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

export default BusinessStudies;
