export type FaqCategory = 'start' | 'programs' | 'fees' | 'classes' | 'teachers' | 'results' | 'safety';

export type FaqLink = { label: string; href: string };

export type FaqQuestion = {
  id: string;
  category: FaqCategory;
  question: string;
  shortAnswer: string;
  answer: string;
  keywords: string[];
  links?: FaqLink[];
  journeyType?: 'attention' | 'default';
};

export const journeyQuestions: FaqQuestion[] = [
  {
    id: 'cost', category: 'fees', question: 'How much does it cost?',
    shortAnswer: 'Fees depend on the year level, subject and program.',
    answer: 'Fees depend on the year level, subject and program. The simplest way to get an accurate answer is to book an interview so we can recommend the right class before discussing the fee.',
    keywords: ['fee', 'fees', 'price', 'pricing', 'cost', 'payment', 'how much'], links: [{ label: 'Book an interview', href: '/book-interview' }], journeyType: 'default',
  },
  {
    id: 'attention', category: 'classes', question: 'Will my child actually get attention?',
    shortAnswer: 'Yes. We intentionally keep our classes small and know every student.',
    answer: "It is not just about numbers — it is about knowing their strengths, understanding their gaps, and guiding them with the right support.",
    keywords: ['class', 'class size', 'small class', 'attention', 'support', 'individual', 'teacher'], journeyType: 'attention',
  },
  {
    id: 'progress', category: 'results', question: "How do I know they're improving?",
    shortAnswer: 'We track progress through class performance, feedback and parent communication.',
    answer: 'We look for stronger confidence, better habits, clearer understanding and better marks — not just one isolated test result. Parents receive feedback after lessons so progress stays visible.',
    keywords: ['progress', 'improving', 'report', 'reports', 'feedback', 'results', 'marks'], journeyType: 'default',
  },
  {
    id: 'ahead', category: 'programs', question: 'What if my child is already ahead?',
    shortAnswer: 'We extend students beyond their current level without rushing past understanding.',
    answer: 'A student who is already ahead still needs challenge. We use extension work, advanced problems and precise feedback to build accuracy, speed and deeper understanding.',
    keywords: ['ahead', 'advanced', 'extension', 'challenge', 'gifted'], journeyType: 'default',
  },
  {
    id: 'class-size', category: 'classes', question: 'Are the classes too big?',
    shortAnswer: 'Groups are intentionally kept small so every student can participate and ask questions.',
    answer: 'Students have room to ask questions and receive meaningful feedback while still benefiting from learning alongside peers.',
    keywords: ['class', 'class size', 'big', 'small group', 'students', 'one on one'], links: [{ label: 'Learning formats', href: '/learning-formats' }], journeyType: 'default',
  },
  {
    id: 'tutor-match', category: 'teachers', question: "What if my child doesn't like their tutor?",
    shortAnswer: 'A good match considers personality, learning style, subject and current level.',
    answer: 'Tell us early. We take the concern seriously and look at teaching style, personality, subject and class fit before recommending the most useful next step.',
    keywords: ['tutor', 'teacher', 'match', 'personality', 'learning style', 'change teacher'], journeyType: 'default',
  },
  {
    id: 'behind', category: 'results', question: 'Is my child behind?',
    shortAnswer: 'We begin by understanding the gap, then rebuild foundations without judgement.',
    answer: 'A learning check helps us find the right starting point. From there we build understanding, practice, confidence and progress at a pace your child can sustain.',
    keywords: ['behind', 'struggling', 'foundation', 'level', 'confidence', 'assessment'], journeyType: 'default',
  },
  {
    id: 'getting-started', category: 'start', question: 'Where should my child start?',
    shortAnswer: 'Start with an interview so we can understand the right subject, level and class fit.',
    answer: "You do not need to know the exact program before contacting us. Bring your child's school year, subjects, recent concerns and goals; we will help with the rest.",
    keywords: ['start', 'interview', 'subject', 'maths', 'english', 'science', 'primary', 'high school', 'hsc'], links: [{ label: 'Book an interview', href: '/book-interview' }], journeyType: 'default',
  },
];

export const allFaqQuestions: FaqQuestion[] = [
  ...journeyQuestions,
  { id: 'interview-test', category: 'start', question: 'Is the interview a test?', shortAnswer: 'No. It is a guided conversation and learning check.', answer: 'The interview is not a pass-or-fail exam. Its purpose is to place your child where they can improve without feeling lost or held back.', keywords: ['test', 'assessment', 'interview', 'nervous'] },
  { id: 'mid-term', category: 'start', question: 'Can my child join during the term?', shortAnswer: 'Usually, if there is a suitable class and place available.', answer: 'We will not place a student simply to fill a seat. The interview helps us choose the right level and timing before they start.', keywords: ['join', 'mid term', 'availability', 'start date'] },
  { id: 'year-levels', category: 'programs', question: 'Which year levels do you teach?', shortAnswer: 'DA teaches primary school through high school and HSC.', answer: 'Programs support students from primary school through HSC, with teaching and expectations appropriate to each stage.', keywords: ['year', 'primary', 'high school', 'hsc', 'k-6', 'year 12'] },
  { id: 'subjects', category: 'programs', question: 'What subjects are available?', shortAnswer: 'Core subjects include Mathematics, English, Science, Business Studies and Legal Studies.', answer: 'DA offers primary and high-school support plus HSC preparation across its current subject programs.', keywords: ['subjects', 'maths', 'english', 'science', 'business', 'legal'], links: [{ label: 'View all subjects', href: '/subjects' }] },
  { id: 'curriculum', category: 'programs', question: 'Do you follow the NSW curriculum?', shortAnswer: 'Yes. Lessons align with NSW syllabus expectations.', answer: 'Students also learn exam technique, response structure and why a method works — not only how to repeat it.', keywords: ['nsw', 'nesa', 'curriculum', 'syllabus'] },
  { id: 'materials', category: 'fees', question: 'Are learning materials included?', shortAnswer: 'Regular class materials are included unless an exception is explained before enrolment.', answer: 'Parents should not be surprised by hidden resource charges. Any specific exception will be explained before enrolment.', keywords: ['materials', 'resources', 'books', 'extra costs'] },
  { id: 'class-times', category: 'classes', question: 'When are classes held?', shortAnswer: 'Classes run after school and on weekends.', answer: 'Exact times depend on subject, year level and current availability. Contact us if timing is your main concern.', keywords: ['time', 'schedule', 'weekend', 'after school'] },
  { id: 'online', category: 'classes', question: 'Do you offer online classes?', shortAnswer: 'DA is primarily an in-person centre.', answer: 'The teaching style depends on close feedback, attention and classroom energy. Ask us directly if your family has a specific access issue.', keywords: ['online', 'zoom', 'remote', 'in person'] },
  { id: 'who-teaches', category: 'teachers', question: 'Who teaches the classes?', shortAnswer: 'Trained tutors who understand the subject, syllabus and student experience.', answer: 'Teacher matching depends on the subject, year level and student needs. Families value teachers who are relatable mentors as well as strong content specialists.', keywords: ['teacher', 'tutor', 'staff', 'mentor'], links: [{ label: 'Find a tutor', href: '/find-teacher' }] },
  { id: 'specific-teacher', category: 'teachers', question: 'Can we request a specific teacher?', shortAnswer: 'You can ask, subject to availability and class fit.', answer: 'We also consider level, subject and personality. The best teacher on paper is not always the best match for every student.', keywords: ['request', 'specific teacher', 'choose tutor'] },
  { id: 'guarantee', category: 'results', question: 'Do you guarantee marks?', shortAnswer: 'No specific mark can be guaranteed.', answer: 'Effort, attendance, practice and school assessment conditions matter. We do commit to quality teaching, honest feedback and support.', keywords: ['guarantee', 'marks', 'promise'] },
  { id: 'safety', category: 'safety', question: 'Is DA Tuition safe for younger students?', shortAnswer: 'Student safety is treated seriously.', answer: 'Staff expectations, supervision, parent communication and Working With Children Check requirements are part of how the centre operates.', keywords: ['safe', 'safety', 'younger', 'wwcc'] },
  { id: 'absence', category: 'safety', question: 'What if my child is sick or misses class?', shortAnswer: 'Keep sick children home and contact DA as early as possible.', answer: 'The centre can advise what catch-up support or materials are available for the situation.', keywords: ['sick', 'miss class', 'absence', 'catch up'] },
];

const normalise = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

export function rankJourneyQuestions(query: string, questions: FaqQuestion[] = journeyQuestions) {
  const normalizedQuery = normalise(query);
  if (!normalizedQuery) return [];
  const terms = normalizedQuery.split(' ').filter((term) => term.length > 1);

  return questions
    .map((question) => {
      const normalizedQuestion = normalise(question.question);
      const normalizedKeywords = question.keywords.map(normalise);
      let score = 0;
      if (normalizedQuestion.includes(normalizedQuery)) score += 12;
      if (normalizedKeywords.includes(normalizedQuery)) score += 10;
      for (const term of terms) {
        if (normalizedQuestion.includes(term)) score += 3;
        if (normalizedKeywords.some((keyword) => keyword.includes(term))) score += 2;
      }
      if (normalizedQuery === 'class size' && question.id === 'attention') score += 14;
      return { question, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);
}
