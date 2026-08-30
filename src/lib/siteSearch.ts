import { searchRecords, type SearchRecord } from './search.ts';

export type SiteSearchResult = SearchRecord & {
  href: string;
  kind: 'Programs' | 'Subjects' | 'FAQ' | 'About' | 'Resources' | 'Locations' | 'Stories';
  breadcrumb: string;
};

const siteIndex: SiteSearchResult[] = [
  { title: 'DA Tuition', body: 'Premium K-12 tutoring in Canley Heights.', category: 'About', keywords: ['home', 'tutoring', 'da tuition'], href: '/', kind: 'About', breadcrumb: 'Home' },
  { title: 'Primary School (K-6)', body: 'Building strong foundations in literacy and numeracy.', category: 'Programs', keywords: ['primary', 'year 3', 'year 4', 'year 5', 'year 6'], href: '/programs/primary-school', kind: 'Programs', breadcrumb: 'Programs' },
  { title: 'Early Years', body: 'A confident start to learning for younger students.', category: 'Programs', keywords: ['early learning', 'young learners', 'kindergarten'], href: '/programs/early-years', kind: 'Programs', breadcrumb: 'Programs' },
  { title: 'Years 3 and 4', body: 'Primary-school learning support for Years 3 and 4.', category: 'Programs', keywords: ['year 3', 'year 4', 'primary'], href: '/programs/year-3-4', kind: 'Programs', breadcrumb: 'Programs' },
  { title: 'Years 5 and 6', body: 'Primary-school learning support for Years 5 and 6.', category: 'Programs', keywords: ['year 5', 'year 6', 'primary'], href: '/programs/year-5-6', kind: 'Programs', breadcrumb: 'Programs' },
  { title: 'High School (7-10)', body: 'Core subject support and study skills development.', category: 'Programs', keywords: ['high school', 'year 7', 'year 8', 'year 9', 'year 10'], href: '/programs/high-school', kind: 'Programs', breadcrumb: 'Programs' },
  { title: 'HSC Excellence Program', body: 'Expert HSC preparation and exam technique.', category: 'Programs', keywords: ['hsc', 'year 11', 'year 12', 'atar'], href: '/hsc-excellence', kind: 'Programs', breadcrumb: 'Programs' },
  { title: 'Mathematics', body: 'Mathematics support from times tables to calculus.', category: 'Subjects', keywords: ['maths', 'math', 'calculus'], href: '/subjects/mathematics', kind: 'Subjects', breadcrumb: 'Subjects' },
  { title: 'English', body: 'Reading, writing and critical analysis.', category: 'Subjects', keywords: ['english', 'writing', 'reading'], href: '/subjects/english', kind: 'Subjects', breadcrumb: 'Subjects' },
  { title: 'Science', body: 'Physics, Chemistry and Biology tuition.', category: 'Subjects', keywords: ['sciences', 'physics', 'chemistry', 'biology'], href: '/subjects/science', kind: 'Subjects', breadcrumb: 'Subjects' },
  { title: 'Business Studies', body: 'Case studies, reports and strategic thinking.', category: 'Subjects', keywords: ['business', 'commerce'], href: '/subjects/business-studies', kind: 'Subjects', breadcrumb: 'Subjects' },
  { title: 'Legal Studies', body: 'Case law, statutory interpretation and essay technique.', category: 'Subjects', keywords: ['legal', 'law'], href: '/subjects/legal-studies', kind: 'Subjects', breadcrumb: 'Subjects' },
  { title: 'Meet our teachers', body: 'Meet the tutors behind student progress.', category: 'About', keywords: ['teacher', 'teachers', 'tutor', 'tutors', 'staff'], href: '/tutors', kind: 'About', breadcrumb: 'About' },
  { title: 'The DA Difference', body: 'Our approach and why parents trust DA Tuition.', category: 'About', keywords: ['why da', 'approach', 'difference'], href: '/why-choose-da', kind: 'About', breadcrumb: 'About' },
  { title: 'Principal’s Reflection', body: 'The values and thinking behind the DA Tuition experience.', category: 'About', aliases: ["Principal's Reflection", 'Principal Reflection', 'Principals Reflection', 'Principal'], headings: ['A Child’s Starting Point Should Never Define Their Future'], keywords: ['founder', 'principal', 'reflection'], href: '/principal-reflections', kind: 'About', breadcrumb: 'About' },
  { title: 'Principal’s Interview', body: 'Questions, answers and the story behind DA Tuition.', category: 'About', aliases: ["Principal's Interview", 'Principal Interview', 'Principals Interview'], keywords: ['principal', 'interview', 'founder'], href: '/principal-interview-paper', kind: 'About', breadcrumb: 'About' },
  { title: 'Learning Formats', body: 'Small-group learning formats and class fit explained.', category: 'About', keywords: ['classes', 'small groups', 'learning'], href: '/learning-formats', kind: 'About', breadcrumb: 'About' },
  { title: 'Book a consultation', body: 'Talk through the right class, program and next step.', category: 'Resources', keywords: ['interview', 'interveiw', 'consultation', 'book', 'enrolment'], href: '/book-interview', kind: 'Resources', breadcrumb: 'Start here' },
  { title: 'Success Stories', body: 'Real families and student outcomes at DA Tuition.', category: 'Stories', keywords: ['results', 'reviews', 'testimonials', 'atar'], href: '/success-stories', kind: 'Stories', breadcrumb: 'Stories' },
  { title: 'Articles and Guides', body: 'Educational insights and practical study guidance.', category: 'Resources', keywords: ['articles', 'guides', 'newsletters'], href: '/articles', kind: 'Resources', breadcrumb: 'Resources' },
  { title: 'Contact DA Tuition', body: 'Get in touch with DA Tuition.', category: 'Resources', keywords: ['contact', 'phone', 'email'], href: '/contact', kind: 'Resources', breadcrumb: 'Resources' },
  { title: 'Privacy Policy', body: 'How DA Tuition handles personal information.', category: 'Resources', keywords: ['privacy', 'policy', 'data'], href: '/privacy-policy', kind: 'Resources', breadcrumb: 'Resources' },
  { title: 'DA Tuition Canley Heights', body: 'Visit DA Tuition in Canley Heights.', category: 'Locations', keywords: ['location', 'address', 'canley heights'], href: '/tutoring-canley-heights', kind: 'Locations', breadcrumb: 'Locations' },
  { title: 'Tutoring in Cabramatta', body: 'DA Tuition service information for Cabramatta families.', category: 'Locations', keywords: ['cabramatta', 'location'], href: '/tutoring-cabramatta', kind: 'Locations', breadcrumb: 'Locations' },
  { title: 'Tutoring in Fairfield', body: 'DA Tuition service information for Fairfield families.', category: 'Locations', keywords: ['fairfield', 'location'], href: '/tutoring-fairfield', kind: 'Locations', breadcrumb: 'Locations' },
  { title: 'Tutoring in Canley Vale', body: 'DA Tuition service information for Canley Vale families.', category: 'Locations', keywords: ['canley vale', 'location'], href: '/tutoring-canley-vale', kind: 'Locations', breadcrumb: 'Locations' },
  { title: 'Tutoring in Smithfield', body: 'DA Tuition service information for Smithfield families.', category: 'Locations', keywords: ['smithfield', 'location'], href: '/tutoring-smithfield', kind: 'Locations', breadcrumb: 'Locations' },
  { title: 'Tutoring in Lansvale', body: 'DA Tuition service information for Lansvale families.', category: 'Locations', keywords: ['lansvale', 'location'], href: '/tutoring-lansvale', kind: 'Locations', breadcrumb: 'Locations' },
  { title: 'How much does tutoring cost?', body: 'Fees depend on year level, subject and program. Book an interview for an accurate fee.', category: 'FAQ', keywords: ['fee', 'fees', 'cost', 'pricing', 'payment', 'how much'], concepts: ['pricing'], href: '/faq#faq-how-much-does-tutoring-cost', kind: 'FAQ', breadcrumb: 'FAQ · Fees and payments' },
  { title: 'Who teaches the classes?', body: 'Classes are taught by trained tutors who understand the subject, syllabus and student experience.', category: 'FAQ', keywords: ['teacher', 'teachers', 'tutor', 'tutors', 'staff'], href: '/faq#faq-who-teaches-the-classes', kind: 'FAQ', breadcrumb: 'FAQ · Teachers' },
  { title: 'What subjects are available?', body: 'Mathematics, English, Science, Business Studies, Legal Studies and HSC preparation.', category: 'FAQ', keywords: ['subjects', 'maths', 'mathematics', 'english', 'science'], href: '/faq#faq-what-subjects-are-available', kind: 'FAQ', breadcrumb: 'FAQ · Programs' },
];

export const searchSite = (query: string) => searchRecords(siteIndex, query);
