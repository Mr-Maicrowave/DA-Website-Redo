import { ClipboardCheck, MessageCircle, Pencil, Search, Send } from 'lucide-react';

export type MethodId = 'diagnose' | 'explain' | 'practise' | 'apply' | 'review';
export type MethodAction = { title: string; body: string; annotation: string };

export type MethodItem = {
  id: MethodId;
  number: '01' | '02' | '03' | '04' | '05';
  label: string;
  emotionalSubheading: string;
  introduction: readonly [string, string];
  actions: readonly [MethodAction, MethodAction, MethodAction, MethodAction];
  closingLines: readonly string[];
  accent: string;
  textAccent: string;
  atmosphere: string;
  bloom: string;
  card: string;
  cardAvifSmall: string;
  cardAvifLarge: string;
  cardWebpSmall: string;
  cardWebpLarge: string;
  Icon: typeof Search;
};

export const methodItems: MethodItem[] = [
  {
    id: 'diagnose',
    number: '01',
    label: 'Diagnose',
    emotionalSubheading: 'We pay attention first.',
    introduction: [
      'Before we teach more, we take the time to understand the student as they are right now.',
      'We look at what they already know, where understanding starts to break down, and what may be holding them back.',
    ],
    actions: [
      { title: 'Understand the student', body: 'We talk, listen and learn how they think and learn.', annotation: 'get to know them' },
      { title: 'Identify gaps and priorities', body: 'We look at what’s missing, what’s confusing and what matters most.', annotation: 'what will help most' },
      { title: 'Review work and mistakes', body: 'We look through previous work to understand recurring patterns, not just individual marks.', annotation: 'patterns tell the story' },
      { title: 'Plan the right learning path', body: 'We decide where to focus first and how to support them best.', annotation: 'a plan, not a guess' },
    ],
    closingLines: ['Every student is different.', 'So we start differently.'],
    accent: '#1f766d',
    textAccent: '#1f766d',
    atmosphere: '#e4f0e9',
    bloom: '/images/programs/high-school-method-transition/method-bloom-diagnose-teal-v1.png',
    card: '/images/programs/high-school-method-transition/method-card-diagnose-forest-v1.png',
    cardAvifSmall: '/images/programs/high-school-method-transition/method-card-diagnose-forest-v1-512w.avif',
    cardAvifLarge: '/images/programs/high-school-method-transition/method-card-diagnose-forest-v1-1024w.avif',
    cardWebpSmall: '/images/programs/high-school-method-transition/method-card-diagnose-forest-v1-512w.webp',
    cardWebpLarge: '/images/programs/high-school-method-transition/method-card-diagnose-forest-v1-1024w.webp',
    Icon: Search,
  },
  {
    id: 'explain',
    number: '02',
    label: 'Explain',
    emotionalSubheading: 'We find the explanation that clicks.',
    introduction: [
      'If a student doesn’t understand something the first way, we don’t simply repeat the same explanation.',
      'We slow down, change the example, approach the idea differently and keep working until it makes sense.',
    ],
    actions: [
      { title: 'Break ideas into manageable steps', body: 'Complex concepts become smaller, clearer pieces.', annotation: 'one step at a time' },
      { title: 'Explain in different ways', body: 'We adjust the explanation to suit the student.', annotation: 'try another way' },
      { title: 'Use examples that make sense', body: 'We connect abstract ideas to examples students can actually follow.', annotation: 'make it relatable' },
      { title: 'Check understanding as we go', body: 'We don’t assume a nod means understanding.', annotation: 'does it really click?' },
    ],
    closingLines: ['The explanation can change.', 'The goal stays the same: understanding.'],
    accent: '#1f5d89',
    textAccent: '#1f5d89',
    atmosphere: '#e6f0f7',
    bloom: '/images/programs/high-school-method-transition/method-bloom-explain-green-v1.png',
    card: '/images/programs/high-school-method-transition/method-card-explain-blue-v1.png',
    cardAvifSmall: '/images/programs/high-school-method-transition/method-card-explain-blue-v1-512w.avif',
    cardAvifLarge: '/images/programs/high-school-method-transition/method-card-explain-blue-v1-1024w.avif',
    cardWebpSmall: '/images/programs/high-school-method-transition/method-card-explain-blue-v1-512w.webp',
    cardWebpLarge: '/images/programs/high-school-method-transition/method-card-explain-blue-v1-1024w.webp',
    Icon: MessageCircle,
  },
  {
    id: 'practise',
    number: '03',
    label: 'Practise',
    emotionalSubheading: 'We stay with it.',
    introduction: [
      'Understanding something once is only the beginning.',
      'We help students practise at the right level, correct mistakes as they happen and gradually build the accuracy and confidence to work independently.',
    ],
    actions: [
      { title: 'Start with supported practice', body: 'We guide students through the first attempts.', annotation: 'do it together first' },
      { title: 'Target the right questions', body: 'Practice focuses on what the student actually needs.', annotation: 'not just more questions' },
      { title: 'Correct mistakes immediately', body: 'We use mistakes as information, not failure.', annotation: 'learn from this one' },
      { title: 'Gradually remove support', body: 'As confidence grows, the student takes over.', annotation: 'now try it yourself' },
    ],
    closingLines: ['Practice should build independence,', 'not dependence.'],
    accent: '#7652a8',
    textAccent: '#7652a8',
    atmosphere: '#eee8f5',
    bloom: '/images/programs/high-school-method-transition/method-bloom-practise-lavender-v1.png',
    card: '/images/programs/high-school-method-transition/method-card-practise-purple-v1.png',
    cardAvifSmall: '/images/programs/high-school-method-transition/method-card-practise-purple-v1-512w.avif',
    cardAvifLarge: '/images/programs/high-school-method-transition/method-card-practise-purple-v1-1024w.avif',
    cardWebpSmall: '/images/programs/high-school-method-transition/method-card-practise-purple-v1-512w.webp',
    cardWebpLarge: '/images/programs/high-school-method-transition/method-card-practise-purple-v1-1024w.webp',
    Icon: Pencil,
  },
  {
    id: 'apply',
    number: '04',
    label: 'Apply',
    emotionalSubheading: 'We make sure they can do it themselves.',
    introduction: [
      'Knowing how to follow an example is not the same as knowing how to solve a new problem.',
      'We help students transfer their skills into unfamiliar questions, assessments and exam-style tasks.',
    ],
    actions: [
      { title: 'Introduce unfamiliar questions', body: 'Students learn to recognise what they know in a new context.', annotation: 'different question, same thinking' },
      { title: 'Build multi-step problem solving', body: 'We help students plan before jumping into an answer.', annotation: 'think before solving' },
      { title: 'Practise assessment-style tasks', body: 'Students learn how to use their knowledge under realistic conditions.', annotation: 'ready when it counts' },
      { title: 'Encourage independent decisions', body: 'Students learn when and how to use a method without being prompted.', annotation: 'you choose the approach' },
    ],
    closingLines: ['The goal is not remembering the example.', 'It is knowing what to do next.'],
    accent: '#cf6f35',
    textAccent: '#9a471f',
    atmosphere: '#f8ebe2',
    bloom: '/images/programs/high-school-method-transition/method-bloom-apply-peach-v1.png',
    card: '/images/programs/high-school-method-transition/method-card-apply-orange-v1.png',
    cardAvifSmall: '/images/programs/high-school-method-transition/method-card-apply-orange-v1-512w.avif',
    cardAvifLarge: '/images/programs/high-school-method-transition/method-card-apply-orange-v1-1024w.avif',
    cardWebpSmall: '/images/programs/high-school-method-transition/method-card-apply-orange-v1-512w.webp',
    cardWebpLarge: '/images/programs/high-school-method-transition/method-card-apply-orange-v1-1024w.webp',
    Icon: Send,
  },
  {
    id: 'review',
    number: '05',
    label: 'Review',
    emotionalSubheading: 'We notice what happens next.',
    introduction: [
      'We don’t treat a lesson as finished simply because the hour is over.',
      'We look back at mistakes, corrections and progress to understand what should be revisited and what the student is ready for next.',
    ],
    actions: [
      { title: 'Review mistakes and corrections', body: 'We make sure students understand why something was wrong.', annotation: 'understand the correction' },
      { title: 'Look for recurring weaknesses', body: 'Patterns help us decide what needs more attention.', annotation: 'what keeps coming back?' },
      { title: 'Recognise improvement', body: 'Progress should be noticed, not just problems.', annotation: 'look how far you’ve come' },
      { title: 'Decide what comes next', body: 'We adjust the next learning focus based on what we see.', annotation: 'ready to move on?' },
    ],
    closingLines: ['The pace changes.', 'The explanation changes.', 'The goal doesn’t:', 'genuine understanding.'],
    accent: '#ad7414',
    textAccent: '#80530b',
    atmosphere: '#f7efdb',
    bloom: '/images/programs/high-school-method-transition/method-bloom-review-gold-v1.png',
    card: '/images/programs/high-school-method-transition/method-card-review-gold-v1.png',
    cardAvifSmall: '/images/programs/high-school-method-transition/method-card-review-gold-v1-512w.avif',
    cardAvifLarge: '/images/programs/high-school-method-transition/method-card-review-gold-v1-1024w.avif',
    cardWebpSmall: '/images/programs/high-school-method-transition/method-card-review-gold-v1-512w.webp',
    cardWebpLarge: '/images/programs/high-school-method-transition/method-card-review-gold-v1-1024w.webp',
    Icon: ClipboardCheck,
  },
];
