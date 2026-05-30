import React from 'react';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import { Button } from '@/components/ui/button';
import { Calculator, CheckCircle, ArrowRight, Quote, Sparkles, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';

const Mathematics = () => {
  const courses = [
    {
      level: "Primary School",
      subjects: [
        "K-6 Mathematics",
        "Problem Solving",
        "Mental Maths",
        "Times Tables Mastery"
      ]
    },
    {
      level: "Years 7-10",
      subjects: [
        "Core Mathematics",
        "Advanced Mathematics",
        "Mathematical Methods",
        "Problem Solving & Enrichment"
      ]
    },
    {
      level: "HSC - Year 11 & 12",
      subjects: [
        "Mathematics Standard 1 & 2",
        "Mathematics Advanced",
        "Mathematics Extension 1",
        "Mathematics Extension 2"
      ]
    }
  ];

  const topics = {
    standard: [
      "Algebra & Equations",
      "Measurement & Geometry",
      "Statistics & Probability",
      "Financial Mathematics",
      "Networks & Paths"
    ],
    advanced: [
      "Functions & Relations",
      "Trigonometry",
      "Calculus",
      "Statistical Analysis",
      "Financial Modelling"
    ],
    extension1: [
      "Further Calculus",
      "Polynomials",
      "Combinatorics",
      "Proof by Induction",
      "Vectors"
    ],
    extension2: [
      "Complex Numbers",
      "Further Integration",
      "Mechanics",
      "Statistical Inference",
      "Advanced Proof"
    ]
  };

  const skills = [
    "Problem-solving strategies",
    "Mathematical reasoning",
    "Algebraic manipulation",
    "Geometric visualization",
    "Statistical interpretation",
    "Exam technique"
  ];

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Mathematics Tutoring (K-12 & HSC)"
        description="From foundational numeracy to advanced HSC mathematics, we build confidence through expert guidance and proven teaching methods at DA Tuition."
        canonicalUrl="/subjects/mathematics"
      />
      <NavigationNew />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-[120px]">
        {/* Hero Section */}
        <section className="relative rounded-[2.5rem] overflow-hidden shadow-2xl mx-4 sm:mx-0 mt-6 mb-16">
          <div className="absolute inset-0">
            <img src="/images/v3/teacher_whiteboard.jpg" alt="Mathematics Tutoring" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-brand-navy/80 mix-blend-multiply"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/50 to-brand-navy/30"></div>
          </div>

          <div className="relative z-10 max-w-4xl mx-auto text-center py-12 sm:py-16 lg:py-24 px-6">
            <div className="inline-flex items-center justify-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-6 py-2 border border-white/20 mb-8">
              <Calculator className="w-5 h-5 text-accent-teal" />
              <span className="text-sm font-bold text-white tracking-wide uppercase">Years K to 12</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight drop-shadow-lg">
              Mathematics <br />
              <span className="text-accent-teal">Mastery</span>
            </h1>

            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow-md">
              From foundational numeracy to advanced HSC mathematics, we build confidence through expert guidance and proven teaching methods.
            </p>

            <div className="flex justify-center">
              <Button size="lg" className="bg-accent-teal text-white hover:bg-teal-600 font-bold px-8 h-14 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                Book Interview
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </section>
      </div>

      {/* Learning Formats Callout */}
      < section className="py-12" >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
            <div className="flex items-start">
              <Info className="w-6 h-6 text-blue-600 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-brand-midnight mb-2">Available in Small Groups & Classes</h3>
                <p className="text-brand-midnight/80 mb-4">
                  Mathematics at DA Tuition is offered in both small group tutoring (3-5 students) and classes.
                  We carefully match each student to the format that best suits their learning style, confidence level,
                  and goals - whether they need focused support or exam-style practice.
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
      </section >

      {/* Course Offerings */}
      < section className="py-16 bg-gray-50" >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-brand-midnight mb-4">
            Comprehensive Mathematics Programs
          </h2>
          <p className="text-center text-brand-midnight/80 mb-12 max-w-2xl mx-auto">
            From foundational numeracy to advanced HSC mathematics, we support every student's journey
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {courses.map((level, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-blue-600 mb-4">{level.level}</h3>
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
      </section >

      {/* HSC Mathematics Focus */}
      < section className="py-16" >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-brand-midnight mb-12">
            HSC Mathematics Excellence
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Standard Mathematics */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-brand-midnight mb-3">Standard</h3>
              <ul className="space-y-1">
                {topics.standard.map((topic, idx) => (
                  <li key={idx} className="text-sm text-brand-midnight/80">• {topic}</li>
                ))}
              </ul>
              <div className="mt-4 text-sm font-semibold text-blue-600">Band 6 Achievable</div>
            </div>

            {/* Advanced Mathematics */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-brand-midnight mb-3">Advanced</h3>
              <ul className="space-y-1">
                {topics.advanced.map((topic, idx) => (
                  <li key={idx} className="text-sm text-brand-midnight/80">• {topic}</li>
                ))}
              </ul>
              <div className="mt-4 text-sm font-semibold text-indigo-600">Most Popular</div>
            </div>

            {/* Extension 1 */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-brand-midnight mb-3">Extension 1</h3>
              <ul className="space-y-1">
                {topics.extension1.map((topic, idx) => (
                  <li key={idx} className="text-sm text-brand-midnight/80">• {topic}</li>
                ))}
              </ul>
              <div className="mt-4 text-sm font-semibold text-purple-600">High Scaling</div>
            </div>

            {/* Extension 2 */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-brand-midnight mb-3">Extension 2</h3>
              <ul className="space-y-1">
                {topics.extension2.map((topic, idx) => (
                  <li key={idx} className="text-sm text-brand-midnight/80">• {topic}</li>
                ))}
              </ul>
              <div className="mt-4 text-sm font-semibold text-pink-600">Elite Level</div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-brand-midnight/80 mb-6">
              Our mathematics teachers include Engineering graduates, actuaries, and Band 6/E4 achievers
            </p>
            <Link to="/hsc-excellence">
              <Button variant="outline" size="lg" className="group">
                Explore HSC Program
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section >

      {/* Problem-Solving Approach */}
      < section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50" >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-brand-midnight mb-6">Building Problem-Solving Skills</h3>
              <p className="text-brand-midnight/80 mb-6">
                Mathematics is more than memorizing formulas - it's about developing logical thinking and
                problem-solving strategies that apply to real-world situations. Our approach focuses on deep
                understanding rather than rote learning.
              </p>
              <ul className="space-y-3">
                {skills.map((skill, index) => (
                  <li key={index} className="flex items-start">
                    <Calculator className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-brand-midnight/80">{skill}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <div className="pastel-card pastel-blue-soft">
                <h4 className="text-xl font-bold text-brand-midnight mb-3">Step-by-Step Methods</h4>
                <p className="text-brand-midnight/80">
                  We break down complex problems into manageable steps, ensuring students understand each part
                  of the solution process. This methodical approach builds confidence and reduces errors.
                </p>
              </div>

              <div className="pastel-card pastel-indigo-soft">
                <h4 className="text-xl font-bold text-brand-midnight mb-3">Multiple Approaches</h4>
                <p className="text-brand-midnight/80">
                  We teach various methods for solving problems, allowing students to choose the approach that
                  makes most sense to them. This flexibility is crucial for exam success.
                </p>
              </div>

              <div className="pastel-card pastel-purple-soft">
                <h4 className="text-xl font-bold text-brand-midnight mb-3">Real-World Applications</h4>
                <p className="text-brand-midnight/80">
                  We connect mathematical concepts to real-life scenarios, making abstract ideas concrete and
                  showing students why mathematics matters beyond the classroom.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section >

      {/* Foundation Building */}
      < section className="py-16" >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-brand-midnight mb-12">
            Strong Foundations for Every Level
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <Calculator className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-brand-midnight mb-3">Primary Foundation</h3>
              <p className="text-brand-midnight/80 mb-4">
                Building strong numeracy skills through engaging activities, games, and practical applications.
                We make times tables fun and develop mental math strategies.
              </p>
              <ul className="space-y-2 text-sm text-brand-midnight/80">
                <li>• Number sense development</li>
                <li>• Problem-solving strategies</li>
                <li>• Confidence building</li>
                <li>• Advanced problem-solving</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <Sparkles className="w-12 h-12 text-indigo-600 mb-4" />
              <h3 className="text-xl font-bold text-brand-midnight mb-3">High School Excellence</h3>
              <p className="text-brand-midnight/80 mb-4">
                Mastering algebra, geometry, and trigonometry while developing critical thinking skills.
                We prepare students for advanced mathematics.
              </p>
              <ul className="space-y-2 text-sm text-brand-midnight/80">
                <li>• Algebraic mastery</li>
                <li>• Geometric reasoning</li>
                <li>• Assessment preparation</li>
                <li>• Study skills development</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <CheckCircle className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-xl font-bold text-brand-midnight mb-3">HSC Success</h3>
              <p className="text-brand-midnight/80 mb-4">
                Achieving Band 6 results through strategic exam preparation, past paper practice, and
                mastery of complex topics.
              </p>
              <ul className="space-y-2 text-sm text-brand-midnight/80">
                <li>• Trial exam preparation</li>
                <li>• Past paper mastery</li>
                <li>• Time management</li>
                <li>• Scaling optimization</li>
              </ul>
            </div>
          </div>
        </div>
      </section >

      {/* Success Story */}
      < section className="py-16 bg-gray-50" >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Quote className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-brand-midnight mb-2">From Struggling to State Ranking</h3>
            </div>
            <blockquote className="text-lg text-brand-midnight/80 italic text-center mb-6">
              "I started Year 11 failing Advanced Mathematics. DA Tuition matched me with the perfect teacher
              and learning format. Their systematic approach and patient guidance transformed my understanding.
              By Year 12, I was topping Extension 1 and achieved 96 in Extension 2. The small group environment
              made complex topics accessible, and the exam practice in classes prepared me perfectly for the HSC."
            </blockquote>
            <p className="text-center text-brand-midnight/80">
              <strong>James Liu</strong> - State Rank in Mathematics Extension 2, now studying Engineering at UNSW
            </p>
          </div>
        </div>
      </section >

      {/* Special Programs */}
      < section className="py-16" >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-brand-midnight mb-12">
            Specialized Mathematics Support
          </h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="pastel-card pastel-blue-soft">
              <h3 className="text-xl font-bold text-brand-midnight mb-4">Problem-Solving Workshops</h3>
              <p className="text-brand-midnight/80 mb-4">
                Intensive sessions focusing on challenging problems, competition mathematics, and extension topics.
                Perfect for students aiming for top bands.
              </p>
              <Link to="/hsc-excellence">
                <Button variant="outline" size="sm" className="group">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            <div className="pastel-card pastel-indigo-soft">
              <h3 className="text-xl font-bold text-brand-midnight mb-4">Accelerated Mathematics</h3>
              <p className="text-brand-midnight/80 mb-4">
                For gifted students ready to work ahead of their grade. We offer pathways to complete HSC
                mathematics early and pursue university-level content.
              </p>
              <Link to="/hsc-excellence">
                <Button variant="outline" size="sm" className="group">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section >

      {/* CTA Section */}
      < section className="py-16 bg-brand-navy text-white relative overflow-hidden" >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-teal rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl font-bold text-white mb-4">
            Start Your Mathematics Journey Today
          </h2>
          <p className="text-xl text-white mb-8">
            Join hundreds of students who've conquered their fear of maths and achieved excellence
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
      </section >

      <FooterNew />
    </div >
  );
};

export default Mathematics;