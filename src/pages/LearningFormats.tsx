import React from 'react';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import { Button } from '@/components/ui/button';
import { Users, Clock, Trophy, MessageCircle, Target, Brain, Sparkles, CheckCircle, ArrowRight, School } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';

const LearningFormats = () => {
  const smallGroupBenefits = [
    {
      icon: Users,
      title: "Peer Learning",
      description: "Students learn from each other's perspectives and approaches to problem-solving"
    },
    {
      icon: MessageCircle,
      title: "Active Discussion",
      description: "Every voice is heard in our small groups, building confidence and communication skills"
    },
    {
      icon: Brain,
      title: "Personalized Attention",
      description: "Teachers can address individual needs while maintaining group dynamics"
    },
    {
      icon: Target,
      title: "Collaborative Problem Solving",
      description: "Work through challenges together, learning multiple solution strategies"
    }
  ];

  const classBenefits = [
    {
      icon: Clock,
      title: "Exam Condition Practice",
      description: "Regular practice in a real classroom environment builds exam readiness"
    },
    {
      icon: Trophy,
      title: "Healthy Competition",
      description: "In-class competitions and challenges motivate students to excel"
    },
    {
      icon: School,
      title: "Real-World Environment",
      description: "Simulates actual school and HSC exam conditions for better preparation"
    },
    {
      icon: Sparkles,
      title: "Group Energy",
      description: "The energy of a larger group creates momentum and motivation"
    }
  ];

  const matchingProcess = [
    {
      step: "1",
      title: "Initial Assessment",
      description: "We evaluate each student's current level, learning style, and goals"
    },
    {
      step: "2",
      title: "Format Selection",
      description: "Based on assessment, we recommend small groups, classes, or accelerated programs"
    },
    {
      step: "3",
      title: "Teacher Matching",
      description: "We match students with teachers whose style aligns with their learning needs"
    },
    {
      step: "4",
      title: "Ongoing Adjustment",
      description: "We continuously monitor progress and adjust placement as needed"
    }
  ];

  const comparisonData = [
    {
      aspect: "Class Size",
      smallGroup: "3-5 students",
      classes: "10-40 students"
    },
    {
      aspect: "Best For",
      smallGroup: "Students needing focused support and confidence building",
      classes: "Students ready for exam practice and competitive environment"
    },
    {
      aspect: "Teaching Style",
      smallGroup: "Highly personalized, discussion-based",
      classes: "Structured lessons with varied activities"
    },
    {
      aspect: "Interaction",
      smallGroup: "Intimate discussions, everyone participates",
      classes: "Mix of individual work and group activities"
    },
    {
      aspect: "Pace",
      smallGroup: "Adapted to group's needs",
      classes: "Consistent curriculum pace"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Small Groups & Classes — DA Tuition Learning Formats"
        description="Discover our small group (3–5 students) and class-based learning formats. We match every student to the perfect setting and teacher for their learning style."
        canonicalUrl="/learning-formats"
      />
      <NavigationNew />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-[120px]">
        {/* Hero Section */}
        <section className="relative rounded-[2.5rem] overflow-hidden shadow-2xl mx-4 sm:mx-0 mt-6 mb-16">
          <div className="absolute inset-0">
            <img src="/images/v3/collaborative_learning.jpg" alt="DA Tuition Learning Formats" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-brand-navy/80 mix-blend-multiply"></div>
            {/* Friendly vibrant pastel overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-navy/90 via-cyan-500/30 to-blue-500/30 mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/60 to-transparent"></div>
          </div>

          <div className="relative z-10 max-w-4xl mx-auto text-center py-12 sm:py-16 lg:py-24 px-6">
            <h1 className="text-3xl sm:text-4xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight drop-shadow-lg">
              Learning <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300">Formats</span>
            </h1>
            <p className="text-xl text-cyan-100 mb-2 drop-shadow-md font-semibold tracking-wide uppercase">Small Groups & Classes</p>
            <p className="text-lg text-white/95 max-w-2xl mx-auto drop-shadow-md font-medium">
              We match every student to the perfect learning environment and teacher for their unique needs.
            </p>
          </div>
        </section>
      </div>

      {/* Introduction */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pastel-card pastel-blue">
            <h2 className="text-2xl font-bold text-brand-midnight mb-4">Personalized Learning at DA Tuition</h2>
            <p className="text-brand-midnight/80 leading-relaxed mb-4">
              At DA Tuition, we understand that every student learns differently. That's why we offer both small group
              tutoring (3-5 students) and classes to ensure each student receives the right level of support, challenge,
              and interaction for their learning style. Our careful matching process considers not just the format, but
              also pairs students with the most suitable teacher.
            </p>
            <p className="text-brand-midnight/80 leading-relaxed">
              Whether your child thrives in intimate small groups where every voice is heard, or performs better in
              a classroom environment with structured lessons and healthy competition, we have the perfect setting for
              their success. Our experienced team assesses each student individually to recommend the optimal learning
              environment.
            </p>
          </div>
        </div>
      </section>

      {/* Small Groups Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-midnight mb-4">
              Small Group Tutoring (3-5 Students)
            </h2>
            <p className="text-lg text-brand-midnight/80 max-w-3xl mx-auto">
              The perfect balance between personalized attention and peer learning
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {smallGroupBenefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-brand-midnight mb-2">{benefit.title}</h3>
                <p className="text-brand-midnight/80 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-brand-midnight mb-4">Why Small Groups Work</h3>
            <div className="prose prose-lg text-brand-midnight/80 max-w-none">
              <p className="mb-4">
                Research consistently shows that small group learning produces superior outcomes compared to both
                large classes and one-on-one tutoring. In our groups of 3-5 students, learners benefit from:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span><strong>Multiple perspectives:</strong> Hearing different approaches to the same problem deepens understanding</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span><strong>Reduced anxiety:</strong> Learning alongside peers creates a supportive, less intimidating environment</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span><strong>Active participation:</strong> Small size ensures every student engages and contributes</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span><strong>Peer teaching:</strong> Explaining concepts to others reinforces learning</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Classes Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-midnight mb-4">
              Classes
            </h2>
            <p className="text-lg text-brand-midnight/80 max-w-3xl mx-auto">
              Real-world classroom environment for exam preparation and competitive learning
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {classBenefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-indigo-100"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-brand-midnight mb-2">{benefit.title}</h3>
                <p className="text-brand-midnight/80 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-brand-midnight mb-4">Why Classes Excel</h3>
            <div className="prose prose-lg text-brand-midnight/80 max-w-none">
              <p className="mb-4">
                Our classes provide the authentic classroom experience essential for exam success. Students benefit from:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span><strong>Exam simulation:</strong> Regular practice under timed conditions builds confidence and speed</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span><strong>Competitive spirit:</strong> Healthy competition motivates students to push their boundaries</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span><strong>Mental preparation:</strong> Familiarity with classroom settings reduces exam anxiety</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span><strong>Group energy:</strong> The buzz of a full class creates momentum and engagement</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-brand-midnight mb-12">
            Compare Learning Formats
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow-lg">
              <thead>
                <tr className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                  <th className="px-6 py-4 text-left font-semibold"></th>
                  <th className="px-6 py-4 text-left font-semibold">Small Groups</th>
                  <th className="px-6 py-4 text-left font-semibold">Classes</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-6 py-4 font-semibold text-brand-midnight">{row.aspect}</td>
                    <td className="px-6 py-4 text-brand-midnight/80">{row.smallGroup}</td>
                    <td className="px-6 py-4 text-brand-midnight/80">{row.classes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Matching Process */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-brand-midnight mb-4">
            Our Personalized Matching Process
          </h2>
          <p className="text-center text-brand-midnight/80 mb-12 max-w-2xl mx-auto">
            We don't just randomly place students - we carefully match them to the right format and teacher
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {matchingProcess.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-lg font-bold text-brand-midnight mb-2">{step.title}</h3>
                  <p className="text-brand-midnight/80 text-sm">{step.description}</p>
                </div>
                {index < matchingProcess.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-gray-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Programs */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-brand-midnight mb-12">
            Specialized Learning Options
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-brand-midnight mb-3">Accelerated Programs</h3>
              <p className="text-brand-midnight/80 mb-4">
                For high-achieving students ready to work ahead of their grade level. Small groups of similarly
                advanced students tackling challenging material.
              </p>
              <Link to="/hsc-excellence">
                <Button variant="outline" size="sm" className="group">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-brand-midnight mb-3">HSC Intensive</h3>
              <p className="text-brand-midnight/80 mb-4">
                Combination of small group workshops for difficult concepts and larger classes for exam practice
                and timed assessments.
              </p>
              <Link to="/hsc-excellence">
                <Button variant="outline" size="sm" className="group">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-brand-midnight mb-3">Foundation Building</h3>
              <p className="text-brand-midnight/80 mb-4">
                For students needing extra support, our smallest groups (3 students) provide maximum attention
                and confidence building.
              </p>
              <Link to="/programs/primary-school">
                <Button variant="outline" size="sm" className="group">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-brand-midnight mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-brand-midnight mb-2">
                How do you decide if my child needs small groups or classes?
              </h3>
              <p className="text-brand-midnight/80">
                We conduct an initial assessment that evaluates your child's current level, confidence, learning style,
                and goals. Based on this comprehensive evaluation, we recommend the most suitable format. We also
                consider factors like exam readiness, peer interaction preferences, and specific subject requirements.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-brand-midnight mb-2">
                Can students switch between formats?
              </h3>
              <p className="text-brand-midnight/80">
                Absolutely! As students progress and their needs change, we regularly review their placement. Many
                students start in small groups to build confidence, then transition to classes for exam preparation.
                The flexibility ensures optimal learning at every stage.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-brand-midnight mb-2">
                How do you match students with teachers?
              </h3>
              <p className="text-brand-midnight/80">
                We consider multiple factors including teaching style preferences, personality compatibility, subject
                expertise, and specific learning needs. Our experienced team knows each teacher's strengths and can
                match them with students who will benefit most from their approach.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-brand-midnight mb-2">
                What if the initial placement isn't working?
              </h3>
              <p className="text-brand-midnight/80">
                We monitor all students' progress closely and maintain open communication with parents. If a placement
                isn't optimal, we'll work with you to adjust the format, change the teacher, or modify the approach.
                Your child's success is our priority.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-brand-navy text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-teal rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-blue rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl font-bold text-white mb-4">
            Find Your Perfect Learning Format
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Book a consultation to discover whether small groups or classes will best support your child's success
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-brand-navy hover:bg-gray-100">
              Book Interview
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10 bg-transparent">
              Call 0401 940 207
            </Button>
          </div>
        </div>
      </section>

      <FooterNew />
    </div>
  );
};

export default LearningFormats;