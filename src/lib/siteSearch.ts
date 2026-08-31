import { searchRecords, type SearchRecord } from './search.ts';

export type SiteSearchResult = SearchRecord & {
  href: string;
  kind: 'Programs' | 'Subjects' | 'FAQ' | 'About' | 'Resources';
  breadcrumb: string;
};

const siteIndex: SiteSearchResult[] = [
  { title: 'Primary School (K-6)', body: 'Building strong foundations in literacy and numeracy.', category: 'Programs', keywords: ['primary', 'year 3', 'year 4', 'year 5', 'year 6'], href: '/programs/primary-school', kind: 'Programs', breadcrumb: 'Programs' },
  { title: 'High School (7-10)', body: 'Core subject support and study skills development.', category: 'Programs', keywords: ['high school', 'year 7', 'year 8', 'year 9', 'year 10'], href: '/programs/high-school', kind: 'Programs', breadcrumb: 'Programs' },
  { title: 'HSC Excellence Program', body: 'Expert HSC preparation and exam technique.', category: 'Programs', keywords: ['hsc', 'year 11', 'year 12', 'atar'], href: '/hsc-excellence', kind: 'Programs', breadcrumb: 'Programs' },
  { title: 'Mathematics', body: 'Mathematics support from times tables to calculus.', category: 'Subjects', keywords: ['maths', 'math', 'calculus'], href: '/subjects/mathematics', kind: 'Subjects', breadcrumb: 'Subjects' },
  { title: 'English', body: 'Reading, writing and critical analysis.', category: 'Subjects', keywords: ['english', 'writing', 'reading'], href: '/subjects/english', kind: 'Subjects', breadcrumb: 'Subjects' },
  { title: 'Science', body: 'Physics, Chemistry and Biology tuition.', category: 'Subjects', keywords: ['sciences', 'physics', 'chemistry', 'biology'], href: '/subjects/science', kind: 'Subjects', breadcrumb: 'Subjects' },
  { title: 'Meet our teachers', body: 'Meet the tutors behind student progress.', category: 'About', keywords: ['teacher', 'teachers', 'tutor', 'tutors', 'staff'], href: '/tutors', kind: 'About', breadcrumb: 'About' },
  { title: 'The DA Difference', body: 'Our approach and why parents trust DA Tuition.', category: 'About', keywords: ['why da', 'approach', 'difference'], href: '/why-choose-da', kind: 'About', breadcrumb: 'About' },
  { title: 'Book a consultation', body: 'Talk through the right class, program and next step.', category: 'Resources', keywords: ['interview', 'interveiw', 'consultation', 'book', 'enrolment'], href: '/book-interview', kind: 'Resources', breadcrumb: 'Start here' },
  { title: 'How much does tutoring cost?', body: 'Fees depend on year level, subject and program. Book an interview for an accurate fee.', category: 'FAQ', keywords: ['fee', 'fees', 'cost', 'pricing', 'payment', 'how much'], href: '/faq#faq-how-much-does-tutoring-cost', kind: 'FAQ', breadcrumb: 'FAQ · Fees and payments' },
  { title: 'Who teaches the classes?', body: 'Classes are taught by trained tutors who understand the subject, syllabus and student experience.', category: 'FAQ', keywords: ['teacher', 'teachers', 'tutor', 'tutors', 'staff'], href: '/faq#faq-who-teaches-the-classes', kind: 'FAQ', breadcrumb: 'FAQ · Teachers' },
  { title: 'What subjects are available?', body: 'Mathematics, English, Science, Business Studies, Legal Studies and HSC preparation.', category: 'FAQ', keywords: ['subjects', 'maths', 'mathematics', 'english', 'science'], href: '/faq#faq-what-subjects-are-available', kind: 'FAQ', breadcrumb: 'FAQ · Programs' },
];

export const searchSite = (query: string) => searchRecords(siteIndex, query);
