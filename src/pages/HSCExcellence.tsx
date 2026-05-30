import React from 'react';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, GraduationCap, TrendingUp, Clock, Target, BookOpen, Award, Users, Calculator, FileText, Microscope, Globe, ArrowRight, CheckCircle, Star, Sparkles } from 'lucide-react';
import reviewsData from '@/data/reviews.json';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';

const HSCExcellence = () => {
  const subjects = {
    mathematics: [
      { name: "Mathematics Standard 1", band6Rate: "15%", topTeacher: "Alex C. (Band 6)" },
      { name: "Mathematics Standard 2", band6Rate: "25%", topTeacher: "Sarah L. (Band 6)" },
      { name: "Mathematics Advanced", band6Rate: "35%", topTeacher: "Michael Z. (97/100)" },
      { name: "Mathematics Extension 1", band6Rate: "45%", topTeacher: "Jennifer K. (48/50)" },
      { name: "Mathematics Extension 2", band6Rate: "55%", topTeacher: "David W. (State Rank 5)" }
    ],
    english: [
      { name: "English Standard", band6Rate: "8%", topTeacher: "Emma T. (Band 6)" },
      { name: "English Advanced", band6Rate: "18%", topTeacher: "Oliver M. (96/100)" },
      { name: "English Extension 1", band6Rate: "35%", topTeacher: "Sophie R. (47/50)" },
      { name: "English Extension 2", band6Rate: "40%", topTeacher: "James H. (48/50)" }
    ],
    sciences: [
      { name: "Biology", band6Rate: "30%", topTeacher: "Dr. Lisa P. (98/100)" },
      { name: "Chemistry", band6Rate: "35%", topTeacher: "Ryan C. (State Rank 8)" },
      { name: "Physics", band6Rate: "32%", topTeacher: "Kevin L. (97/100)" },
      { name: "Earth & Environmental", band6Rate: "28%", topTeacher: "Amy S. (Band 6)" }
    ],
    hsie: [
      { name: "Business Studies", band6Rate: "20%", topTeacher: "Nathan B. (Band 6)" },
      { name: "Legal Studies", band6Rate: "25%", topTeacher: "Grace W. (95/100)" }
    ]
  };

  const atarGoals = [
    { range: "99+", description: "Medicine, Law at top unis", students: "12% of our cohort" },
    { range: "95+", description: "Engineering, Commerce", students: "28% of our cohort" },
    { range: "90+", description: "Most university courses", students: "45% of our cohort" },
    { range: "85+", description: "Wide range of options", students: "65% of our cohort" },
    { range: "80+", description: "Many degree programs", students: "82% of our cohort" }
  ];

  const timeline = [
    { term: "Term 4 (Year 11)", focus: "Foundation building", tasks: ["Content mastery", "Study habits", "Note-taking systems"] },
    { term: "Term 1 (Year 12)", focus: "Depth studies begin", tasks: ["First assessments", "Essay writing", "Time management"] },
    { term: "Term 2 (Year 12)", focus: "Trial preparation", tasks: ["Past papers", "Exam technique", "Stress management"] },
    { term: "Term 3 (Year 12)", focus: "Final push", tasks: ["Revision strategies", "Practice exams", "ATAR optimization"] },
    { term: "Term 4 (Year 12)", focus: "HSC Exams", tasks: ["Final preparation", "Exam execution", "University applications"] }
  ];

  const features = [
    {
      icon: Trophy,
      title: "Top-Achieving Teachers",
      description: "Learn from Band 6 Subject Teachers and recent HSC graduates"
    },
    {
      icon: Users,
      title: "Small Groups (3-5)",
      description: "Personalized attention ensures every question is answered and every concept understood"
    },
    {
      icon: Target,
      title: "ATAR Focused",
      description: "Strategic subject selection and study planning to maximize your ATAR"
    },
    {
      icon: Clock,
      title: "Flexible Scheduling",
      description: "Evening and weekend sessions to fit around school and extracurriculars"
    },
    {
      icon: BookOpen,
      title: "Proprietary Curriculum",
      description: "Specially created content for exam success - we teach concepts, not homework help"
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "Regular assessments and feedback to ensure continuous improvement"
    }
  ];




  return (
    <div className="min-h-screen bg-brand-canvas pt-[100px]">
      <SEO
        title="HSC Tutoring Sydney — ATAR Preparation"
        description="HSC preparation from Band 6 teachers across Maths, English, Sciences and HSIE. Proven ATAR results, small groups, and exam-focused curriculum in Canley Heights."
        canonicalUrl="/hsc-excellence"
      />
      <NavigationNew />

      {/* Hero Section */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <section className="relative rounded-[2.5rem] overflow-hidden shadow-2xl mt-6 mb-16">
          <div className="absolute inset-0">
            <img src="/images/v3/modern_classroom.jpg" alt="HSC Class" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-brand-navy/80 mix-blend-multiply"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/50 to-brand-navy/30"></div>
          </div>

          <div className="relative z-10 max-w-4xl mx-auto text-center py-12 sm:py-16 lg:py-24 px-6">
            <div className="inline-flex items-center justify-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-6 py-2 border border-white/20 mb-8">
              <GraduationCap className="w-5 h-5 text-brand-gold" />
              <span className="text-sm font-bold text-white tracking-wide uppercase">HSC 2026 & 2027 Enrollments Open</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight drop-shadow-lg">
              HSC Excellence <br />
              <span className="text-brand-gold">Program</span>
            </h1>

            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-12 leading-relaxed drop-shadow-md">
              Join hundreds of students who've achieved their dream ATARs through our specially
              designed examination-focused curriculum. We don't do homework help - we teach for
              understanding and exam excellence.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button 
                size="lg" 
                className="btn-primary group"
                onClick={() => window.location.href = '/#contact'}
              >
                Book Interview
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                onClick={() => window.location.href = '/#contact'}
              >
                Request HSC Guide
              </Button>
            </div>

            <p className="text-sm text-white/70">
              Limited spots • Small groups only • Taught by Band 6 achievers
            </p>
          </div>
        </section>


        {/* ATAR Calculator Widget */}
        <section className="relative max-w-4xl mx-auto px-4 mb-16">
          <div className="bg-white rounded-[2rem] shadow-xl shadow-brand-navy/5 p-8 border border-brand-navy/5">
            <h3 className="text-lg font-semibold mb-6 text-center text-brand-navy">Quick ATAR Goal Check</h3>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
              {atarGoals.map((goal, index) => (
                <div key={index} className="text-center p-4 rounded-xl hover:bg-brand-canvas cursor-pointer border border-transparent hover:border-brand-navy/10 transition-all">
                  <div className="text-2xl font-bold text-brand-blue">{goal.range}</div>
                  <div className="text-xs text-brand-navy/70 mt-2 leading-relaxed">{goal.description}</div>
                </div>
              ))}
            </div>
            <p className="text-sm text-brand-navy/60 mt-8 text-center font-medium">
              82% of our students achieve an ATAR of 80+
            </p>
          </div>
        </section>
      </div>

      {/* Why HSC Matters */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why Your HSC Result Matters</h2>
            <p className="text-xl text-brand-midnight/80">The gateway to your future opportunities</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <GraduationCap className="w-12 h-12 text-blue-500 mb-4" />
                <CardTitle>University Entry</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-brand-midnight/80 mb-4">
                  Your ATAR determines access to your preferred courses. Medicine requires 99+,
                  Law 95+, Engineering 85+. Every mark counts.
                </p>
                <Badge variant="secondary">Direct pathway to top unis</Badge>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <Trophy className="w-12 h-12 text-yellow-500 mb-4" />
                <CardTitle>Scholarships</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-brand-midnight/80 mb-4">
                  High ATARs unlock academic scholarships worth $10,000-$40,000.
                  Many unis offer automatic scholarships for 95+ ATARs.
                </p>
                <Badge variant="secondary">Financial rewards</Badge>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <Target className="w-12 h-12 text-green-500 mb-4" />
                <CardTitle>Career Options</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-brand-midnight/80 mb-4">
                  Top employers and graduate programs often have ATAR requirements.
                  A strong HSC opens doors throughout your career.
                </p>
                <Badge variant="secondary">Long-term advantage</Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Subject Coverage */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Comprehensive Subject Support</h2>
            <p className="text-xl text-brand-midnight/80">Expert tutoring across all HSC subjects</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Mathematics */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <Calculator className="w-8 h-8 text-blue-600" />
                  <Badge className="bg-blue-100 text-blue-800">Most Popular</Badge>
                </div>
                <CardTitle className="mt-3">Mathematics</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {subjects.mathematics.map((subj, idx) => (
                    <li key={idx} className="text-sm">
                      <div className="font-medium text-brand-midnight">{subj.name}</div>
                      <div className="text-xs text-brand-midnight/80 mt-1">
                        Teacher: {subj.topTeacher}
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* English */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <FileText className="w-8 h-8 text-green-600" />
                  <Badge className="bg-green-100 text-green-800">Compulsory</Badge>
                </div>
                <CardTitle className="mt-3">English</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {subjects.english.map((subj, idx) => (
                    <li key={idx} className="text-sm">
                      <div className="font-medium text-brand-midnight">{subj.name}</div>
                      <div className="text-xs text-brand-midnight/80 mt-1">
                        Teacher: {subj.topTeacher}
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Sciences */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <Microscope className="w-8 h-8 text-purple-600" />
                  <Badge className="bg-purple-100 text-purple-800">High Scaling</Badge>
                </div>
                <CardTitle className="mt-3">Sciences</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {subjects.sciences.map((subj, idx) => (
                    <li key={idx} className="text-sm">
                      <div className="font-medium text-brand-midnight">{subj.name}</div>
                      <div className="text-xs text-brand-midnight/80 mt-1">
                        Teacher: {subj.topTeacher}
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* HSIE */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <Globe className="w-8 h-8 text-orange-600" />
                  <Badge className="bg-orange-100 text-orange-800">Popular</Badge>
                </div>
                <CardTitle className="mt-3">Humanities</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {subjects.hsie.map((subj, idx) => (
                    <li key={idx} className="text-sm">
                      <div className="font-medium text-brand-midnight">{subj.name}</div>
                      <div className="text-xs text-brand-midnight/80 mt-1">
                        Teacher: {subj.topTeacher}
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">The DA Tuition HSC Advantage</h2>
            <p className="text-xl text-brand-midnight/80">What makes our program exceptional</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                    <p className="text-brand-midnight/80">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 bg-brand-navy text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Real Results from Real Students</h2>
            <p className="text-xl opacity-90">What our families say</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {reviewsData.reviews
              .filter(review => review.rating >= 4 && (review.tags.includes('HSC') || review.tags.includes('Year 12') || review.subject.includes('HSC') || review.text.includes('HSC')))
              .slice(0, 3)
              .map((review, index) => (
                <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 flex flex-col h-full">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-3">
                      <Badge className="bg-white/20 text-white">{review.subject !== 'General' ? review.subject : 'HSC Preparation'}</Badge>
                      <div className="flex">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <CardTitle className="text-white line-clamp-1">{review.author}</CardTitle>
                    <p className="text-white/80 text-sm">Class of {review.date.substring(0, 4)}</p>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col justify-between">
                    <p className="text-white/90 italic mb-4 line-clamp-4 relative">"{review.text}"</p>

                    {review.theme && (
                      <div className="mt-auto pt-4 border-t border-white/10">
                        <div className="text-white/80 text-sm font-medium">
                          Highlight: <span className="text-brand-gold">{review.theme}</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </section>

      {/* HSC Timeline */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Your HSC Journey with DA Tuition</h2>
            <p className="text-xl text-brand-midnight/80">Strategic support at every stage</p>
          </div>

          <div className="max-w-4xl mx-auto">
            {timeline.map((period, index) => (
              <div key={index} className="flex gap-4 mb-8">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                </div>
                <Card className="flex-grow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-lg">{period.term}</h3>
                        <p className="text-purple-600 font-medium">{period.focus}</p>
                      </div>
                      <Badge variant="outline">Term {index + 1}</Badge>
                    </div>
                    <ul className="space-y-2">
                      {period.tasks.map((task, idx) => (
                        <li key={idx} className="flex items-center text-brand-midnight/80">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          {task}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Teacher Spotlight */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="lg:grid lg:grid-cols-2">
                <div className="p-8 lg:p-12">
                  <Badge className="mb-4 bg-purple-100 text-purple-800">Our Teachers</Badge>
                  <h3 className="text-3xl font-bold mb-4">Learn from the Best</h3>
                  <p className="text-brand-midnight/80 mb-6">
                    What makes DA Tuition different? Our HSC teachers are recent graduates who achieved
                    exceptional results. They understand the current syllabus, know what markers want,
                    and remember exactly what it's like to be in your shoes.
                  </p>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-start">
                      <Trophy className="w-6 h-6 text-purple-600 mr-3 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold">Band 6 Subject Teachers</p>
                        <p className="text-sm text-brand-midnight/80">All teachers scored in top 5%</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Award className="w-6 h-6 text-purple-600 mr-3 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold">Subject Toppers</p>
                        <p className="text-sm text-brand-midnight/80">Band 6 and State Rankings</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Sparkles className="w-6 h-6 text-purple-600 mr-3 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold">Current & Relevant</p>
                        <p className="text-sm text-brand-midnight/80">Recent grads know the latest syllabus</p>
                      </div>
                    </div>
                  </div>

                  <Button className="btn-primary">
                    Meet Our HSC Teachers
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>

                <div className="bg-gradient-to-br from-purple-100 to-blue-100 p-8 lg:p-12">
                  <div className="space-y-4">
                    <div className="bg-white rounded-xl p-6 shadow-lg">
                      <p className="font-semibold mb-2">Michael Zhang</p>
                      <p className="text-sm text-brand-midnight/80 mb-3">ATAR 99.85 | James Ruse 2023</p>
                      <p className="text-sm italic">
                        "I topped Mathematics Extension 2 with 100/100. I know exactly what it takes
                        to achieve perfect marks and I pass on every strategy to my students."
                      </p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-lg">
                      <p className="font-semibold mb-2">Sophie Reynolds</p>
                      <p className="text-sm text-brand-midnight/80 mb-3">ATAR 99.45 | North Sydney Girls 2023</p>
                      <p className="text-sm italic">
                        "English Advanced was my strongest subject (97/100). I help students decode
                        what markers actually want and craft responses that stand out."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>



      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">HSC Program FAQs</h2>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-3">When should we start HSC tutoring?</h3>
                <p className="text-brand-midnight/80">
                  Ideally, start at the beginning of Year 11 to build strong foundations. However,
                  it's never too late - even students joining in Year 12 Term 2 see significant improvements.
                  The key is consistent support through to the HSC exams.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-3">How do you match students with teachers?</h3>
                <p className="text-brand-midnight/80">
                  We carefully match based on subject needs, learning style, and personality. All our
                  HSC teachers achieved Band 6 in the subjects they teach. We consider factors like
                  the student's current level, goals, and preferred teaching approach.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-3">What resources do you provide?</h3>
                <p className="text-brand-midnight/80">
                  Students receive comprehensive study notes from high-performing schools, past HSC papers
                  with worked solutions, practice questions sorted by topic, essay exemplars for English,
                  and access to our online resource portal with video explanations.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-3">Can you help with subject selection?</h3>
                <p className="text-brand-midnight/80">
                  Absolutely! Our teachers provide strategic advice on subject selection to maximize ATAR.
                  We consider scaling, your strengths, university prerequisites, and workload balance.
                  Many students gain 5-10 ATAR points through better subject choices.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Timetable Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-navy mb-4">HSC Class Timetable</h2>
            <p className="text-lg text-brand-midnight/70 italic">Intensive sessions designed for senior success</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-brand-blue/10">
              <CardContent className="p-8 text-center">
                <Clock className="w-10 h-10 text-brand-blue mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Weekday Intensive</h3>
                <p className="text-brand-blue font-bold text-lg mb-4">Tue – Fri</p>
                <p className="text-brand-midnight/70">Focus sessions from</p>
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
                <p className="text-brand-midnight/70">Weekend sessions from</p>
                <p className="text-2xl font-black text-brand-navy">10 AM – 7 PM</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 bg-white rounded-2xl p-6 text-center border border-brand-blue/10 max-w-2xl mx-auto">
            <p className="text-brand-midnight/80">
              <span className="font-bold text-brand-blue">Note:</span> Sessions are 2 hours.
              Contact us for subject-specific timetable details.
            </p>
          </div>
        </div>
      </section>

      {/* Discover More Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-brand-navy mb-8 text-center">Explore Our Other Programs</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link to="/programs/high-school" className="group">
              <Card className="hover:shadow-xl transition-all duration-300 border-brand-blue/10 h-full">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-emerald-500 transition-colors">
                    <Target className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-emerald-600 transition-colors">High School (7-10)</h3>
                  <p className="text-brand-navy/70 text-sm mb-4">Build strong fundamentals and develop confident learning habits for the junior high years.</p>
                  <div className="flex items-center text-emerald-600 font-bold text-sm">
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

      {/* CTA Section */}
      <section className="py-16 bg-brand-navy text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <GraduationCap className="w-16 h-16 mx-auto mb-6 opacity-80" />
          <h2 className="text-4xl font-bold mb-4">
            Your HSC Success Starts Here
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of students achieving their dream ATARs.
            Learn from teachers who've been exactly where you are and succeeded.
          </p>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8 max-w-2xl mx-auto">
            <p className="text-lg font-semibold mb-2">Limited Spots for 2026 HSC</p>
            <p className="opacity-90">Small groups filling fast • Enrolling now for Term 1</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100"
              onClick={() => window.location.href = '/#contact'}
            >
              Book Interview
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <a href="tel:0401940207">
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/20">
                Call 0401 940 207
              </Button>
            </a>
          </div>

          <p className="mt-6 text-sm opacity-75">
            Free trial lesson • ATAR improvement guaranteed • Taught by Band 6 achievers
          </p>
        </div>
      </section>

      <FooterNew />
    </div>
  );
};

export default HSCExcellence;