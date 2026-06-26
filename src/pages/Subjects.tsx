import { BookOpen, Calculator, Beaker, Clock, PenTool, Briefcase, Scale, Trophy, Users, Target, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';

const Subjects = () => {
  const primarySubjects = [
    {
      icon: <Calculator className="w-8 h-8" />,
      name: "Mathematics",
      levels: "K-6",
      description: "Building strong foundations in numeracy, problem-solving, and mathematical thinking",
      topics: ["Times tables mastery", "Problem solving strategies", "Mental arithmetic", "Geometry basics"],
      link: "/subjects/mathematics"
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      name: "English",
      levels: "K-6",
      description: "Developing literacy, comprehension, and creative expression",
      topics: ["Reading comprehension", "Creative writing", "Grammar & spelling", "Speaking skills"],
      link: "/subjects/english"
    },
    {
      icon: <Beaker className="w-8 h-8" />,
      name: "Science",
      levels: "K-6",
      description: "Fostering curiosity and scientific thinking",
      topics: ["Scientific method", "Natural world", "Basic experiments", "Critical thinking"],
      link: "/subjects/science"
    }
  ];

  const highSchoolSubjects = [
    {
      icon: <Calculator className="w-8 h-8" />,
      name: "Mathematics",
      levels: "7-12",
      description: "From algebra to calculus, preparing for HSC success",
      topics: ["Algebra & equations", "Trigonometry", "Calculus", "Statistics"],
      variants: ["Standard", "Advanced", "Extension 1", "Extension 2"],
      link: "/subjects/mathematics"
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      name: "English",
      levels: "7-12",
      description: "Critical analysis, essay writing, and exam techniques",
      topics: ["Text analysis", "Essay structure", "Creative writing", "Shakespeare"],
      variants: ["Standard", "Advanced", "Extension 1", "Extension 2"],
      link: "/subjects/english"
    },
    {
      icon: <Beaker className="w-8 h-8" />,
      name: "Sciences",
      levels: "7-12",
      description: "Deep understanding of scientific principles and applications",
      topics: ["Physics", "Chemistry", "Biology", "Earth & Environmental"],
      link: "/subjects/science"
    },
    {
      icon: <Briefcase className="w-8 h-8" />,
      name: "Business Studies",
      levels: "11-12",
      description: "Understanding business operations and management",
      topics: ["Business operations", "Marketing", "Finance", "Human resources"],
      link: "/subjects/business-studies"
    },
    {
      icon: <Scale className="w-8 h-8" />,
      name: "Legal Studies",
      levels: "11-12",
      description: "Australian legal system and contemporary issues",
      topics: ["Legal system", "Crime", "Human rights", "Consumer law"],
      link: "/subjects/legal-studies"
    }
  ];

  const specialPrograms = [
    {
      icon: <TrendingUp className="w-8 h-8 text-brand-green" />,
      name: "HSC Excellence",
      description: "Maximize ATAR with strategic HSC preparation",
      features: ["Past paper practice", "Study techniques", "Exam strategies", "Stress management"],
      link: "/hsc-excellence"
    }
  ];

  const teachingApproach = [
    {
      title: "Curriculum-Aligned",
      description: "All subjects follow NSW Education Standards Authority (NESA) syllabus requirements"
    },
    {
      title: "Exam-Focused",
      description: "We teach for understanding and exam excellence, not just homework completion"
    },
    {
      title: "Small Groups",
      description: "3-5 students per class ensures personal attention with peer learning benefits"
    },
    {
      title: "Expert Teachers",
      description: "Band 6 Subject Teachers who understand current syllabuses"
    }
  ];

  return (
    <>
      <SEO
        title="K-12 Subjects We Tutor — Maths, English, Science, HSC"
        description="Expert tutoring across Mathematics, English, Science, Business and Legal Studies from Kindergarten to Year 12. NSW syllabus, small groups, Band 6 teachers."
        canonicalUrl="/subjects"
      />
      <NavigationNew />

      <div className="min-h-screen pt-24">
        {/* Hero Section */}
        <section className="py-20 px-4 bg-gradient-to-b from-blue-50 to-white">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-6 text-brand-midnight">
              Comprehensive Subject Coverage
            </h1>
            <p className="text-xl text-brand-midnight/80 mb-8 max-w-3xl mx-auto">
              From Kindergarten to Year 12, we offer expert tutoring across all core subjects and specialized programs
            </p>

            <div className="grid md:grid-cols-4 gap-4 mt-8">
              {teachingApproach.map((item, index) => (
                <Card key={index} className="p-4 text-center">
                  <h3 className="font-bold text-brand-blue mb-2">{item.title}</h3>
                  <p className="text-sm text-brand-midnight/80">{item.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Primary School Subjects */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Primary School (K-6)</h2>
              <p className="text-xl text-brand-midnight/80">Building strong foundations for lifelong learning</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {primarySubjects.map((subject, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="text-brand-blue mb-4">{subject.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{subject.name}</h3>
                  <p className="text-sm text-brand-midnight/70 mb-3">Years {subject.levels}</p>
                  <p className="text-brand-midnight/80 mb-4">{subject.description}</p>

                  <div className="mb-4">
                    <p className="font-semibold text-sm mb-2">Key Topics:</p>
                    <ul className="text-sm text-brand-midnight/80 space-y-1">
                      {subject.topics.map((topic, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-brand-green mt-1">•</span>
                          <span>{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {subject.link && (
                    <Link to={subject.link}>
                      <Button variant="outline" className="w-full">
                        Learn More
                      </Button>
                    </Link>
                  )}
                </Card>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link to="/programs/primary-school">
                <Button size="lg" className="bg-brand-blue hover:bg-brand-blue-dark">
                  Explore Primary Programs
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* High School Subjects */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">High School (7-12)</h2>
              <p className="text-xl text-brand-midnight/80">Excellence in every subject, from junior high to HSC</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {highSchoolSubjects.map((subject, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="text-brand-blue mb-4">{subject.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{subject.name}</h3>
                  <p className="text-sm text-brand-midnight/70 mb-3">Years {subject.levels}</p>
                  <p className="text-brand-midnight/80 mb-4">{subject.description}</p>

                  {subject.variants && (
                    <div className="mb-4">
                      <p className="font-semibold text-sm mb-2">HSC Levels:</p>
                      <div className="flex flex-wrap gap-2">
                        {subject.variants.map((variant, idx) => (
                          <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {variant}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mb-4">
                    <p className="font-semibold text-sm mb-2">Coverage:</p>
                    <ul className="text-sm text-brand-midnight/80 space-y-1">
                      {subject.topics.map((topic, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-brand-green mt-1">•</span>
                          <span>{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {subject.link && (
                    <Link to={subject.link}>
                      <Button variant="outline" className="w-full">
                        Learn More
                      </Button>
                    </Link>
                  )}
                </Card>
              ))}
            </div>

            <div className="text-center mt-8 space-x-4">
              <Link to="/programs/high-school">
                <Button size="lg" variant="outline">
                  Junior High Programs
                </Button>
              </Link>
              <Link to="/hsc-excellence">
                <Button size="lg" className="bg-brand-blue hover:bg-brand-blue-dark">
                  HSC Programs
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Special Programs */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Specialized Programs</h2>
              <p className="text-xl text-brand-midnight/80">Targeted preparation for specific academic goals</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {specialPrograms.map((program, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow border-2 hover:border-brand-blue/30">
                  <div className="mb-4">{program.icon}</div>
                  <h3 className="text-xl font-bold mb-3">{program.name}</h3>
                  <p className="text-brand-midnight/80 mb-4">{program.description}</p>

                  <ul className="space-y-2 mb-6">
                    {program.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-brand-green mt-1">✓</span>
                        <span className="text-sm text-brand-midnight/80">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link to={program.link}>
                    <Button className="w-full bg-brand-blue hover:bg-brand-blue-dark">
                      Learn More
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Subject Selection Help */}
        <section className="py-16 px-4 bg-gradient-to-b from-blue-50 to-white">
          <div className="max-w-4xl mx-auto">
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-center">Need Help Choosing Subjects?</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-lg mb-3">For Primary Students (K-6)</h3>
                  <p className="text-brand-midnight/80 mb-3">
                    We recommend a balanced approach covering Mathematics and English as core subjects,
                    with Science to develop critical thinking skills.
                  </p>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-900">
                      <strong>Recommended:</strong> 2 sessions per week focusing on areas needing most support
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-3">For High School Students (7-10)</h3>
                  <p className="text-brand-midnight/80 mb-3">
                    Focus on core subjects (Mathematics, English, Science) while building strength
                    in elective subjects that align with future HSC choices.
                  </p>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-900">
                      <strong>Recommended:</strong> 2-3 sessions per week, increasing in Years 9-10
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-3">For HSC Students (11-12)</h3>
                  <p className="text-brand-midnight/80 mb-3">
                    Intensive support in chosen HSC subjects with focus on exam techniques,
                    past papers, and maximizing ATAR potential.
                  </p>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <p className="text-sm text-orange-900">
                      <strong>Recommended:</strong> 3-4 sessions per week across key subjects
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <p className="text-brand-midnight/80 mb-4">
                  Our education consultants can create a personalized subject plan for your child
                </p>
                <Button size="lg" className="bg-brand-blue hover:bg-brand-blue-dark">
                  Get Personalized Advice
                </Button>
              </div>
            </Card>
          </div>
        </section>

        {/* Teacher Quality */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Subject Specialist Teachers</h2>
              <p className="text-xl text-brand-midnight/80">Every teacher is an expert in their field</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 text-center">
                <Users className="w-12 h-12 text-brand-blue mx-auto mb-4" />
                <h3 className="font-bold mb-2">Band 6 Subject Teachers</h3>
                <p className="text-brand-midnight/80">Recent graduates who excelled in current syllabuses</p>
              </Card>

              <Card className="p-6 text-center">
                <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="font-bold mb-2">State Rankers</h3>
                <p className="text-brand-midnight/80">Many teachers achieved state rankings in their subjects</p>
              </Card>

              <Card className="p-6 text-center">
                <Target className="w-12 h-12 text-brand-green mx-auto mb-4" />
                <h3 className="font-bold mb-2">Ongoing Training</h3>
                <p className="text-brand-midnight/80">Regular professional development and syllabus updates</p>
              </Card>
            </div>

            <div className="text-center mt-8">
              <Link to="/our-teachers">
                <Button size="lg" variant="outline">
                  Meet Our Teachers
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-brand-navy relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-accent-teal rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-brand-blue rounded-full blur-3xl"></div>
          </div>
          <div className="max-w-4xl mx-auto text-center text-white relative z-10">
            <h2 className="text-3xl font-bold mb-6 text-white">
              Ready to Excel in Every Subject?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Book an interview and get personalized subject recommendations
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-white text-brand-navy hover:bg-gray-100"
              >
                Book Interview
              </Button>
              <a href="tel:0401940207">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-white text-white bg-transparent hover:bg-white/10"
                >
                  Call 0401 940 207
                </Button>
              </a>
            </div>

            <p className="mt-8 text-sm text-white/80">
              Available: Tue-Fri 5pm-9pm • Sat 9am-6pm • Sun 10am-7pm
            </p>
          </div>
        </section>
      </div>

      <FooterNew />
    </>
  );
};

export default Subjects;