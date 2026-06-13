import React, { useState } from 'react';
import SEO from '@/components/SEO';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle, School, DollarSign, Clock, Users, BookOpen, Shield, Award, ChevronRight, Search, Phone, MessageCircle } from 'lucide-react';
import { siteStats } from '@/data/site-stats';
import { faqPageSchema } from '@/lib/seo/schema';

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const faqCategories = [
    { id: 'all', label: 'All Questions', icon: HelpCircle },
    { id: 'enrollment', label: 'Enrollment & Getting Started', icon: School },
    { id: 'programs', label: 'Programs & Curriculum', icon: BookOpen },
    { id: 'pricing', label: 'Pricing & Payment', icon: DollarSign },
    { id: 'classes', label: 'Classes & Scheduling', icon: Clock },
    { id: 'teachers', label: 'Teachers & Teaching', icon: Users },
    { id: 'results', label: 'Results & Progress', icon: Award },
    { id: 'safety', label: 'Safety & Policies', icon: Shield }
  ];

  const faqs = [
    {
      category: 'enrollment',
      question: 'How do I enroll my child at DA Tuition?',
      answer: 'Enrollment is simple! Start with a free assessment where we evaluate your child\'s current level and learning needs. You can book online or call 0401 940 207. After the assessment, we\'ll recommend the best program and you can enroll immediately. There are no entrance exams or prerequisites - every student is welcome.',
      popular: true
    },
    {
      category: 'enrollment',
      question: 'Is there a free assessment? What does it involve?',
      answer: 'Yes! We offer a comprehensive free assessment for all new students. It takes about 60-90 minutes and covers key areas in your child\'s subjects of interest. The assessment helps us understand their current level, learning style, and areas for improvement. Parents receive a detailed report with recommendations.',
      popular: true
    },
    {
      category: 'enrollment',
      question: 'When can my child start?',
      answer: 'Students can start any time during the term, subject to availability. We don\'t make students wait for a new term - they can join existing classes immediately after assessment. Our curriculum is designed to accommodate new students seamlessly.'
    },
    {
      category: 'enrollment',
      question: 'Do you have entrance requirements?',
      answer: 'No entrance requirements! We welcome students of all abilities. Whether your child is struggling and needs support or excelling and wants extension, we have the right program. Our specially designed curriculum caters to different learning levels within the same class.'
    },
    {
      category: 'programs',
      question: 'What\'s different about DA Tuition\'s curriculum?',
      answer: `Our curriculum is specially designed for examination excellence, not homework help. We focus on deep understanding of concepts and exam technique mastery. Every lesson is structured to build knowledge systematically, with regular assessments to track progress. Our approach has produced ${siteStats.band6Results} Band 6 results and ${siteStats.atar95Plus} ATARs above 95.`,
      popular: true
    },
    {
      category: 'programs',
      question: 'Which subjects do you offer?',
      answer: 'We offer comprehensive tutoring in Mathematics (Standard to Extension 2), English (Standard to Extension 2), Sciences (Physics, Chemistry, Biology), primary school subjects, and HSC exam preparation across all subjects.'
    },
    {
      category: 'programs',
      question: 'Do you follow the NSW curriculum?',
      answer: 'Yes, our curriculum is fully aligned with the NSW Education Standards Authority (NESA) syllabus. However, we go beyond just covering content - we teach exam techniques, time management, and response structures that maximize marks. Our teachers stay updated with all syllabus changes.'
    },
    {
      category: 'pricing',
      question: 'How much does tutoring cost?',
      answer: 'Our pricing varies depending on the subject and program. We keep our fees competitive and transparent — all materials and resources are included. Book an interview and we\'ll discuss pricing based on your child\'s specific needs.',
      popular: true
    },
    {
      category: 'pricing',
      question: 'Are there any additional costs?',
      answer: 'Your fees cover everything — teaching, materials, practice papers, and progress reports. We don\'t charge extra for resources or assessment feedback.'
    },
    {
      category: 'classes',
      question: 'What are your class sizes?',
      answer: `We keep classes small for maximum effectiveness. Primary and high school classes have small groups of ${siteStats.studentsPerGroup} students ensuring personalized attention. For those wanting individual attention, we also offer one-on-one tutoring.`,
      popular: true
    },
    {
      category: 'classes',
      question: 'What are your operating hours?',
      answer: 'We\'re open Tuesday to Friday 5:00pm-9:00pm, Saturday 9:00am-6:00pm, and Sunday 10:00am-7:00pm. Classes run throughout school terms with special holiday programs available. We\'re closed Mondays for teacher training and curriculum development.'
    },
    {
      category: 'classes',
      question: 'How long are the classes?',
      answer: 'Class duration varies by program: Primary school classes are 1.5 hours, high school classes are 2 hours, and HSC classes are 2-2.5 hours. All classes include a short break.'
    },
    {
      category: 'classes',
      question: 'Can we change class times?',
      answer: 'Yes, we understand families have changing schedules. You can request to change class times subject to availability. We require 24 hours notice for single class changes and one week notice for permanent schedule changes. Make-up classes are available for missed sessions.'
    },
    {
      category: 'classes',
      question: 'Do you offer online classes?',
      answer: 'While our focus is on in-person teaching for maximum engagement, we can arrange online sessions for students who cannot attend in person due to illness or travel. Our physical center provides the best learning environment with immediate feedback and peer interaction.'
    },
    {
      category: 'teachers',
      question: 'What makes your teachers special?',
      answer: 'Our teachers are subject matter experts who have previously achieved a Band 6 in the subject they are teaching. They understand current syllabuses, exam formats, and marking criteria. Being closer in age to students, they\'re relatable mentors. All teachers undergo WWCC verification and intensive training in our teaching methodology.',
      popular: true
    },
    {
      category: 'teachers',
      question: 'How are teachers selected?',
      answer: 'We have a rigorous selection process. Teachers must have achieved Band 6 or equivalent in their teaching subjects, demonstrate excellent communication skills, pass a teaching demonstration, and complete our training program. Only 10% of applicants meet our standards.'
    },
    {
      category: 'teachers',
      question: 'Can we request a specific teacher?',
      answer: 'Yes, you can request a preferred teacher when enrolling, subject to availability. We also carefully match students with teachers based on learning style, personality, and goals. If you\'re not happy with your teacher, we\'ll arrange a change.'
    },
    {
      category: 'teachers',
      question: 'Do teachers stay long-term?',
      answer: 'Our teachers typically stay 2-4 years while completing their university studies. This means they\'re always current with recent HSC/curriculum changes. We ensure continuity by having detailed curriculum guides and regular teacher collaboration.'
    },
    {
      category: 'results',
      question: 'How do you track progress?',
      answer: 'We conduct assessments every 4-6 weeks to measure progress. Parents receive detailed reports showing improvement areas, current level, and next steps. Teachers also provide regular verbal feedback and are available for parent meetings. Our systematic tracking ensures no student falls behind.',
      popular: true
    },
    {
      category: 'results',
      question: 'How quickly will we see improvement?',
      answer: '95% of students show measurable improvement within the first term. Most see confidence boost within 2-3 weeks. Grade improvements typically occur within 6-8 weeks. However, we focus on long-term success - building deep understanding that lasts, not quick fixes.'
    },
    {
      category: 'results',
      question: 'What results do your students achieve?',
      answer: `Our track record speaks for itself: ${siteStats.band6Results} Band 6 HSC results and ${siteStats.atar95Plus} students achieving 95+ ATARs over our ${siteStats.yearsExperience} years. Visit our Success Stories page for detailed case studies from real families.`,
      popular: true
    },
    {
      category: 'results',
      question: 'Do you guarantee results?',
      answer: 'While we can\'t guarantee specific marks (as effort and practice at home matter), we guarantee quality teaching and measurable progress. If a student attends regularly and completes set work but doesn\'t improve, we provide additional support at no cost.'
    },
    {
      category: 'safety',
      question: 'What safety measures do you have?',
      answer: 'Student safety is paramount. All teachers have Working With Children Check clearance. Our center has CCTV monitoring, secure entry/exit procedures, and parent sign-in/out for younger students. We maintain comprehensive insurance and follow child protection protocols.'
    },
    {
      category: 'safety',
      question: 'How do you handle student behavior?',
      answer: 'We maintain a positive, respectful learning environment. Clear expectations are set from day one. Minor issues are addressed immediately with students. For persistent problems, we involve parents. Our small class sizes help maintain excellent behavior standards.'
    },
    {
      category: 'safety',
      question: 'What\'s your sick child policy?',
      answer: 'To protect all students and staff, we ask that sick children stay home. Missed classes can be made up when they return. We provide lesson materials for home study during absence. Online catch-up sessions may be arranged for extended absences.'
    },
    {
      category: 'safety',
      question: 'How do you protect student data?',
      answer: 'We take privacy seriously. Student records are securely stored and only accessed by authorized staff. We never share personal information with third parties. Progress reports are only sent to registered parent emails. We comply with all privacy legislation.'
    }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const popularFAQs = faqs.filter(faq => faq.popular);

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Frequently Asked Questions"
        description="Find answers to common questions about DA Tuition's K-12 programs, fees, class sizes, and our unique heart-centered teaching approach."
        canonicalUrl="/faq"
        jsonLd={faqPageSchema(faqs.map(({ question, answer }) => ({ question, answer })))}
      />
      <NavigationNew />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-[120px]">
        {/* Hero Section */}
        <section className="relative rounded-[2.5rem] overflow-hidden shadow-2xl mx-4 sm:mx-0 mt-6 mb-16">
          <div className="absolute inset-0">
            <img src="/images/v3/warm_interaction.jpg" alt="DA Tuition FAQ and Support" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-brand-navy/80 mix-blend-multiply"></div>
            {/* Friendly vibrant pastel glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-navy/90 via-sky-500/30 to-blue-400/40 mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/60 to-transparent"></div>
          </div>

          <div className="relative z-10 max-w-4xl mx-auto text-center py-12 sm:py-16 lg:py-24 px-6">
            <h1 className="text-3xl sm:text-4xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight drop-shadow-lg">
              Frequently Asked <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-blue-300 to-indigo-300">Questions</span>
            </h1>
            <p className="text-xl text-white/95 mb-10 max-w-2xl mx-auto drop-shadow-md font-medium">
              Find answers to common questions about our programs, teaching methodology, and enrollment process.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl text-brand-midnight text-lg focus:outline-none focus:ring-2 focus:ring-brand-blue shadow-xl bg-white/95 backdrop-blur-sm transition-all"
              />
            </div>

            {/* Quick Contact Cards */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <a href="tel:0401940207">
                <Button variant="outline" className="group bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <Phone className="w-4 h-4 mr-2" />
                  Call 0401 940 207
                </Button>
              </a>
              <a href="tel:0401940207">
                <Button variant="outline" className="group bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Direct Support
                </Button>
              </a>
            </div>
          </div>
        </section>
      </div>

      {/* Category-based FAQs */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Browse by Category</h2>
            <p className="text-lg text-brand-midnight/80">Find answers organized by topic</p>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {faqCategories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center px-5 py-3 rounded-full transition-all ${selectedCategory === category.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-brand-midnight/80 hover:bg-gray-200'
                    }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">{category.label}</span>
                </button>
              );
            })}
          </div>

          {/* FAQ Accordion */}
          <div className="max-w-4xl mx-auto">
            {filteredFAQs.length > 0 ? (
              <Accordion type="single" collapsible className="space-y-4">
                {filteredFAQs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6">
                    <AccordionTrigger className="hover:no-underline py-4">
                      <div className="flex items-start text-left">
                        <ChevronRight className="w-5 h-5 mt-0.5 mr-3 flex-shrink-0 text-blue-600" />
                        <span className="font-medium">{faq.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 pl-8 text-brand-midnight/80">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="text-center py-12">
                <p className="text-brand-midnight/70">No questions found matching your search.</p>
                <Button className="mt-4" variant="outline" onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Still Have Questions? */}
      <section className="py-16 bg-brand-navy text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-purple rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <HelpCircle className="w-16 h-16 mx-auto mb-6 opacity-80" />
          <h2 className="text-4xl font-bold mb-4">
            Still Have Questions?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Our friendly team is here to help. Get in touch and we'll answer any questions
            you have about DA Tuition.
          </p>

          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-8">
            <a href="tel:0401940207" className="block">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-colors h-full">
                <CardContent className="p-6 text-center">
                  <Phone className="w-8 h-8 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Call Us</h3>
                  <p className="text-sm opacity-90">0401 940 207</p>
                  <p className="text-xs opacity-75 mt-1">Tue-Sun</p>
                </CardContent>
              </Card>
            </a>

            <a href="tel:0401940207" className="block">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-colors h-full">
                <CardContent className="p-6 text-center">
                  <MessageCircle className="w-8 h-8 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Direct Message</h3>
                  <p className="text-sm opacity-90">Instant support</p>
                  <p className="text-xs opacity-75 mt-1">We'll get back to you</p>
                </CardContent>
              </Card>
            </a>

            <div className="block cursor-pointer" onClick={() => window.location.href = '/#contact'}>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-colors h-full">
                <CardContent className="p-6 text-center">
                  <School className="w-8 h-8 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Visit Us</h3>
                  <p className="text-sm opacity-90">Book a tour</p>
                  <p className="text-xs opacity-75 mt-1">See our center</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <Button 
            size="lg" 

        </div>
      </section>

      <FooterNew />
    </div>
  );
};

export default FAQ;