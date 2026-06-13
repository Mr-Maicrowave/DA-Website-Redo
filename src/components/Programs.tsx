import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Book, CheckCircle, Calendar, UserCheck, UsersIcon, LucideIcon, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface Program {
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  subjects: string[];
  popular: boolean;
  color: string;
}

interface ClassFormat {
  type: 'large' | 'private';
  title: string;
  studentCount: string;
  benefits: string[];
  icon: LucideIcon;
  colorScheme: string;
}

const Programs = () => {
  const classFormats: ClassFormat[] = [
    {
      type: 'large',
      title: 'Small Group Tutoring',
      studentCount: '3-5 students',
      benefits: [
        'Personalized attention',
        'Peer motivation and support',
        'Tailored learning approach',
        'Accelerated learning pace',
        'Exam condition preparation'
      ],
      icon: UserCheck,
      colorScheme: 'blue'
    },
    {
      type: 'private',
      title: 'Classes',
      studentCount: '10-40 students',
      benefits: [
        'Collaborative learning environment',
        'Structured curriculum delivery',
        'Peer motivation and support',
        'Accelerated learning pace',
        'Exam condition preparation'
      ],
      icon: UsersIcon,
      colorScheme: 'orange'
    }
  ];

  // Streamlined program data (age-focused only)
  const programs: Program[] = [
    {
      title: "Primary Achiever",
      subtitle: "Years K-6",
      description: "Nurture love of learning and build essential academic foundations",
      features: [
        "Literacy & numeracy focus",
        "Creative learning approaches",
        "Positive reinforcement",
        "Parent communication",
        "Fun, engaging activities"
      ],
      subjects: ["English", "Mathematics", "Science", "Creative Arts"],
      popular: false,
      color: "bg-gradient-to-br from-orange-600 to-orange-400"
    },
    {
      title: "Foundation Builder",
      subtitle: "Years 7-10",
      description: "Build strong fundamentals and develop confident learning habits",
      features: [
        "Core concept mastery",
        "Study skills development",
        "Confidence building",
        "Learning style assessment",
        "Regular progress tracking"
      ],
      subjects: ["All Core Subjects", "Study Skills", "Critical Thinking"],
      popular: false, // User requested removal
      color: "bg-gradient-to-br from-emerald-600 to-emerald-400"
    },
    {
      title: "HSC Excellence Program",
      subtitle: "Years 11-12",
      description: "Intensive HSC preparation with proven strategies for maximum ATAR results",
      features: [
        "Comprehensive HSC syllabus coverage",
        "Exam technique mastery",
        "Past paper practice",
        "University preparation",
        "Progress tracking and assessments"
      ],
      subjects: ["Mathematics", "English", "Sciences", "Humanities"],
      popular: false,
      color: "bg-gradient-to-br from-brand-midnight to-brand-highlight"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section id="programs" className="py-12 md:py-20 overflow-hidden w-full max-w-[100vw] bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-block mb-3 px-4 py-1.5 rounded-full bg-brand-highlight/10 text-brand-highlight font-medium text-sm">
            Academic Pathways
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-heading text-brand-midnight">
            Programs Designed for <span className="text-brand-highlight">Every Learner</span>
          </h2>
          <p className="text-xl text-brand-midnight/70">
            From building foundational skills to HSC excellence, our programs are carefully crafted
            to meet students exactly where they are.
          </p>
        </motion.div>

        {/* Section 1: Choose Your Program (Age-Focused) */}
        <div className="mb-16 md:mb-32">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid lg:grid-cols-3 gap-8"
          >
            {programs.map((program, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className={`relative bg-white rounded-3xl shadow-xl overflow-hidden group border border-gray-100 ${program.popular ? 'ring-4 ring-brand-highlight/20 scale-105 z-10 lg:-translate-y-4' : ''}`}
              >
                {/* Popular Badge */}
                {program.popular && (
                  <div className="absolute top-6 right-6 z-20">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <Badge className="bg-yellow-400 text-yellow-900 font-bold px-3 py-1 shadow-lg flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Most Popular
                      </Badge>
                    </motion.div>
                  </div>
                )}

                {/* Program Header */}
                <div className={`${program.color} text-white p-8 pb-12 relative overflow-hidden`}>
                  {/* Abstract Background Shapes */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-white/20 transition-colors duration-500" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />

                  <div className="relative z-10">
                    <h4 className="text-2xl font-bold mb-2 font-heading">{program.title}</h4>
                    <p className="text-lg opacity-90 mb-4 font-medium">{program.subtitle}</p>
                    <p className="text-white/90 leading-relaxed text-sm min-h-[60px]">{program.description}</p>
                  </div>
                </div>

                {/* Program Details */}
                <div className="p-8 pt-10 bg-white relative z-10">

                  {/* Features */}
                  <div className="mb-6">
                    <h5 className="font-bold mb-4 text-brand-midnight flex items-center text-sm uppercase tracking-wider">
                      What's Included
                    </h5>
                    <ul className="space-y-3">
                      {program.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <div className="mt-0.5 mr-3 flex-shrink-0 w-5 h-5 rounded-full bg-green-50 flex items-center justify-center">
                            <CheckCircle size={12} className="text-green-500" />
                          </div>
                          <span className="text-sm text-brand-midnight/70 font-medium">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Subjects */}
                  <div className="mb-8">
                    <div className="flex flex-wrap gap-2">
                      {program.subjects.map((subject, i) => (
                        <Badge key={i} variant="secondary" className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button 
                    className="w-full group-hover:bg-brand-midnight group-hover:text-white transition-colors" 

                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Section 2: Choose Your Learning Format */}
        <div className="mb-16 md:mb-32 relative">
          <div className="absolute inset-0 bg-brand-pastel-sky/30 blur-[100px] rounded-full opacity-50" />

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16 relative z-10"
          >
            <h3 className="text-3xl md:text-4xl font-bold mb-4 font-heading text-brand-midnight">Choose Your Learning Format</h3>
            <p className="text-lg text-brand-midnight/70">Select the class size and teaching approach that works best for your child</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto relative z-10">
            {classFormats.map((format, index) => {
              const IconComponent = format.icon;
              const isBlue = format.colorScheme === 'blue';

              return (
                <motion.div
                  key={format.type}
                  initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 100 }}
                  className={`rounded-3xl p-8 md:p-10 border-2 transition-colors duration-300 ${isBlue
                    ? 'bg-blue-50/50 border-blue-100 hover:border-blue-300 hover:bg-blue-50'
                    : 'bg-orange-50/50 border-orange-100 hover:border-orange-300 hover:bg-orange-50'
                    }`}
                >
                  <div className="flex items-center mb-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mr-5 shadow-sm transform group-hover:rotate-6 transition-transform ${isBlue ? 'bg-white text-blue-600' : 'bg-white text-orange-600'}`}>
                      <IconComponent className="w-7 h-7" />
                    </div>
                    <h4 className={`text-3xl font-bold font-heading ${isBlue ? 'text-blue-900' : 'text-orange-900'
                      }`}>
                      {format.title}
                    </h4>
                  </div>

                  <div className="mb-8 pl-1">
                    <div className="text-4xl font-bold text-brand-midnight mb-1 font-heading">{format.studentCount}</div>
                    <div className="text-sm text-brand-midnight/60 font-medium uppercase tracking-wide">Class size limit</div>
                  </div>

                  <div className="mb-10">
                    <h5 className="font-bold mb-4 text-brand-midnight">Key Benefits:</h5>
                    <ul className="space-y-4">
                      {format.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start group">
                          <CheckCircle size={18} className={`mt-0.5 mr-3 flex-shrink-0 transition-transform group-hover:scale-110 ${isBlue ? 'text-blue-500' : 'text-orange-500'
                            }`} />
                          <span className="text-brand-midnight/80 font-medium">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    className={`w-full h-12 text-lg font-semibold shadow-lg transition-all hover:scale-[1.02] ${isBlue
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200'
                      : 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-200'
                      }`}
                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Select {format.title}
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Section 3: Term Structure & Next Steps */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.5 }}
            className="group bg-brand-midnight relative overflow-hidden text-white rounded-[2.5rem] p-8 md:p-12 mx-auto max-w-5xl shadow-2xl"
          >
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-highlight/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-brand-highlight/30 transition-colors duration-700" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10">
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-2xl mb-4 backdrop-blur-sm shadow-inner">
                  <Calendar className="w-8 h-8 text-brand-highlight" />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold font-heading mb-2">Structure that Breeds Success</h3>
                <p className="text-white/60 text-lg">Our proven 10-week cycle keeps students consistent and ahead of school.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { number: "10", label: "Weeks per Term", desc: "Focused learning blocks" },
                  { number: "4", label: "Terms per Year", desc: "Aligned with school terms" },
                  { number: "40", label: "Total Weeks", desc: "Comprehensive syllabus coverage" }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.15)" }}
                    className="bg-white/10 border border-white/5 rounded-3xl p-8 text-center backdrop-blur-md transition-colors"
                  >
                    <div className="text-5xl font-bold mb-2 font-heading text-transparent bg-clip-text bg-gradient-to-br from-white to-white/70">
                      {item.number}
                    </div>
                    <div className="text-lg font-bold text-white mb-1">{item.label}</div>
                    <div className="text-sm text-white/50">{item.desc}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default Programs;
