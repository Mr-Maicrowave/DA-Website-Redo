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
  atmosphere: string;
  bloom: string;
  card: string;
  Icon: typeof Search;
};

export const methodItems: MethodItem[] = [
  {
    id: 'diagnose',
    number: '01',
    label: 'Diagnose',
    emotionalSubheading: 'Before we teach, we listen.',
    introduction: [
      'Every student arrives with a different mix of strengths, habits and questions.',
      'We take the time to understand what is working, where the gaps are, and what will help them move forward.',
    ],
    actions: [
      { title: 'Start with the student', body: 'We ask about their subjects, goals and how learning feels right now.', annotation: 'Their starting point matters.' },
      { title: 'Look beneath the result', body: 'We notice the patterns behind a wrong answer, not just the answer itself.', annotation: 'Find the reason, not the symptom.' },
      { title: 'Identify what is already strong', body: 'Strengths give us something real to build from.', annotation: 'Build on what is there.' },
      { title: 'Choose the next right step', body: 'Together, we focus on the most useful place to begin.', annotation: 'A clear place to start.' },
    ],
    closingLines: ['A student is more than a mark.', 'That is where we begin.'],
    accent: '#1f766d',
    atmosphere: '#e4f0e9',
    bloom: '/images/programs/high-school-method-transition/method-bloom-diagnose-teal-v1.png',
    card: '/images/programs/high-school-method-transition/method-card-diagnose-forest-v1.png',
    Icon: Search,
  },
  {
    id: 'explain',
    number: '02',
    label: 'Explain',
    emotionalSubheading: 'Understanding changes everything.',
    introduction: [
      'When something finally makes sense, a student can breathe again.',
      'We explain ideas clearly, patiently and in the way that helps each student connect the dots.',
    ],
    actions: [
      { title: 'Make the idea clear', body: 'We break complex ideas into smaller, manageable parts.', annotation: 'One idea at a time.' },
      { title: 'Use the right example', body: 'Examples make abstract concepts feel concrete and familiar.', annotation: 'Make it make sense.' },
      { title: 'Invite questions', body: 'Students are encouraged to pause, ask and test their understanding.', annotation: 'Questions are welcome here.' },
      { title: 'Check the connection', body: 'We listen for the moment a student can explain the idea in their own words.', annotation: 'Can they tell it back?' },
    ],
    closingLines: ['Clarity creates confidence.', 'And confidence makes room for progress.'],
    accent: '#1f5d89',
    atmosphere: '#e6f0f7',
    bloom: '/images/programs/high-school-method-transition/method-bloom-explain-green-v1.png',
    card: '/images/programs/high-school-method-transition/method-card-explain-blue-v1.png',
    Icon: MessageCircle,
  },
  {
    id: 'practise',
    number: '03',
    label: 'Practise',
    emotionalSubheading: 'Confidence grows through doing.',
    introduction: [
      'Understanding is only the beginning. Students need room to try, make mistakes and try again.',
      'We make practice purposeful, so each effort strengthens both skill and self-belief.',
    ],
    actions: [
      { title: 'Try it together', body: 'We begin with guided practice so students can settle into a new skill.', annotation: 'A steady first try.' },
      { title: 'Make mistakes useful', body: 'Errors become information we can use for the next attempt.', annotation: 'Mistakes show us where to go.' },
      { title: 'Build independence', body: 'Support gradually steps back as students learn to trust their own process.', annotation: 'More of it is theirs.' },
      { title: 'Notice progress', body: 'We make growth visible, including the small wins that often go unnoticed.', annotation: 'Look how far they have come.' },
    ],
    closingLines: ['Practice is not about perfection.', 'It is how confidence becomes dependable.'],
    accent: '#7652a8',
    atmosphere: '#eee8f5',
    bloom: '/images/programs/high-school-method-transition/method-bloom-practise-lavender-v1.png',
    card: '/images/programs/high-school-method-transition/method-card-practise-purple-v1.png',
    Icon: Pencil,
  },
  {
    id: 'apply',
    number: '04',
    label: 'Apply',
    emotionalSubheading: 'Learning matters when students can use it.',
    introduction: [
      'A skill becomes powerful when a student knows when and how to use it.',
      'We help them carry their learning into unfamiliar questions, schoolwork and real assessment conditions.',
    ],
    actions: [
      { title: 'Connect ideas', body: 'We show how knowledge from one lesson can support the next.', annotation: 'Nothing is learned in isolation.' },
      { title: 'Tackle unfamiliar problems', body: 'Students learn to recognise what a new question is really asking.', annotation: 'A new question, not a new fear.' },
      { title: 'Choose a strategy', body: 'We practise deciding which method is most useful before starting.', annotation: 'Pause. Choose. Begin.' },
      { title: 'Use it with confidence', body: 'Students apply their learning with growing calm in class and assessments.', annotation: 'Ready for the next room.' },
    ],
    closingLines: ['Learning should travel with them.', 'Beyond the worksheet, into what comes next.'],
    accent: '#cf6f35',
    atmosphere: '#f8ebe2',
    bloom: '/images/programs/high-school-method-transition/method-bloom-apply-peach-v1.png',
    card: '/images/programs/high-school-method-transition/method-card-apply-orange-v1.png',
    Icon: Send,
  },
  {
    id: 'review',
    number: '05',
    label: 'Review',
    emotionalSubheading: 'We keep noticing what they need next.',
    introduction: [
      'Learning is not a straight line, and what helps a student today may change tomorrow.',
      'We revisit progress often so support stays personal, responsive and useful.',
    ],
    actions: [
      { title: 'Look back together', body: 'We reflect on what has become easier and what still needs attention.', annotation: 'Progress deserves noticing.' },
      { title: 'Use feedback well', body: 'Specific feedback gives students a practical way to improve.', annotation: 'Useful, kind and clear.' },
      { title: 'Adjust the plan', body: 'We change the next step when new evidence tells us to.', annotation: 'The plan can grow with them.' },
      { title: 'Keep moving forward', body: 'Every review becomes a thoughtful starting point for what comes next.', annotation: 'Then, the next right step.' },
    ],
    closingLines: ['We do not wait for students to fall behind.', 'We stay attentive as they grow.'],
    accent: '#ad7414',
    atmosphere: '#f7efdb',
    bloom: '/images/programs/high-school-method-transition/method-bloom-review-gold-v1.png',
    card: '/images/programs/high-school-method-transition/method-card-review-gold-v1.png',
    Icon: ClipboardCheck,
  },
];
