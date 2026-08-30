export interface LearningFormatAttribute {
  title: string;
  description: string;
  icon: string;
}

export interface LearningFormatProcessStep {
  title: string;
  description: string;
  icon: string;
}

export interface ParentQuestion {
  question: string;
  answer: string;
  icon: string;
}

export interface LearningFormat {
  id: 'private' | 'group' | 'hsc' | 'trial';
  number: '01' | '02' | '03' | '04';
  title: string;
  shortTitle: string;
  navDescription: string;
  tagline: string;
  image: string;
  imageAlt: string;
  attributes: [LearningFormatAttribute, LearningFormatAttribute, LearningFormatAttribute];
  bestFor: [string, string, string, string, string];
  process: LearningFormatProcessStep[];
  parentQuestions: [ParentQuestion, ParentQuestion, ParentQuestion, ParentQuestion];
}

const root = '/media/hsc/editorial/explorer';

const privateFormat: LearningFormat = {
  id: 'private', number: '01', title: 'Private Tuition', shortTitle: 'Private',
  navDescription: 'One-to-one, completely personalised.', tagline: 'Built entirely around them.',
  image: `${root}/explorer-private-photo.png`, imageAlt: 'A tutor giving one-to-one guidance to an HSC student',
  attributes: [
    { title: 'One Student', description: 'All attention is on them.', icon: `${root}/explorer-private-attribute-one-student.png` },
    { title: 'One Tutor', description: 'A consistent guide who knows them.', icon: `${root}/explorer-private-attribute-one-tutor.png` },
    { title: 'Their Pace', description: 'We move as fast or slow as they need.', icon: `${root}/explorer-private-attribute-their-pace.png` },
  ],
  bestFor: ['Individual learning gaps', 'Students needing confidence', 'Different learning pace', 'Targeted subject support', 'Specific goals and improvement'],
  process: [
    { title: 'Understand', description: 'We explain clearly using examples.', icon: `${root}/explorer-private-process-understand.png` },
    { title: 'Practise', description: 'They practise with guided questions.', icon: `${root}/explorer-private-process-practise.png` },
    { title: 'Check & Correct', description: 'We check, correct and reinforce.', icon: `${root}/explorer-private-process-check-correct.png` },
    { title: 'Move Forward', description: 'They leave with clarity and a plan.', icon: `${root}/explorer-private-process-move-forward.png` },
  ],
  parentQuestions: [
    { question: 'What if my child is behind?', answer: 'We start from where they actually are. Foundations are rebuilt before we move forward.', icon: `${root}/explorer-private-faq-behind.png` },
    { question: 'What if they’re already ahead?', answer: 'We can extend and accelerate learning beyond their year level to keep challenging them.', icon: `${root}/explorer-private-faq-ahead.png` },
    { question: 'What if they don’t click with their tutor?', answer: 'Tutor fit matters. We aim to match students with someone whose teaching style works for them.', icon: `${root}/explorer-private-faq-tutor-fit.png` },
    { question: 'How will I know if they’re improving?', answer: 'You’ll see what was covered, how they performed, what was corrected and what needs attention next.', icon: `${root}/explorer-private-faq-progress.png` },
  ],
};

const groupFormat: LearningFormat = {
  id: 'group', number: '02', title: 'Small Group Classes', shortTitle: 'Group',
  navDescription: 'Structure, discussion and momentum.', tagline: 'Learn together. Grow together.',
  image: `${root}/explorer-small-group-photo.png`, imageAlt: 'A tutor guiding a focused small group of HSC students',
  attributes: [
    { title: 'Small Group', description: 'Focused learning without getting lost in a crowd.', icon: `${root}/explorer-group-attribute-small-group.png` },
    { title: 'Weekly Structure', description: 'Consistent lessons and momentum.', icon: `${root}/explorer-group-attribute-weekly-structure.png` },
    { title: 'Tutor Guidance', description: 'Students still receive direct guidance and feedback.', icon: `${root}/explorer-group-attribute-tutor-guidance.png` },
  ],
  bestFor: ['Students who benefit from routine', 'Students who like discussion', 'Students motivated by peers', 'Students who want weekly momentum', 'Students who enjoy learning collaboratively'],
  process: [
    { title: 'Teach', description: 'The tutor introduces ideas clearly.', icon: `${root}/explorer-group-process-teach.png` },
    { title: 'Discuss', description: 'Students question and learn together.', icon: `${root}/explorer-group-process-discuss.png` },
    { title: 'Practise', description: 'The group applies new learning.', icon: `${root}/explorer-group-process-practise.png` },
    { title: 'Feedback', description: 'The tutor corrects and guides.', icon: `${root}/explorer-group-process-feedback.png` },
    { title: 'Improve', description: 'Understanding grows each week.', icon: `${root}/explorer-group-process-improve.png` },
  ],
  parentQuestions: [
    { question: 'Will my child still get individual attention?', answer: 'Yes. Small groups should still allow tutors to notice mistakes, ask questions and guide each student.', icon: `${root}/explorer-group-faq-attention.png` },
    { question: 'What if my child is quiet?', answer: 'Students are not forced to compete for attention. Tutors can bring quieter students into the lesson naturally.', icon: `${root}/explorer-group-faq-quiet.png` },
    { question: 'What if the class is too fast or too slow?', answer: 'We aim to place students into the right level and learning environment so the pace is appropriate.', icon: `${root}/explorer-group-faq-pace.png` },
    { question: 'How large are the classes?', answer: 'We keep groups focused so tutors can still teach, question and respond to students directly.', icon: `${root}/explorer-group-faq-class-size.png` },
  ],
};

const hscFormat: LearningFormat = {
  id: 'hsc', number: '03', title: 'HSC Preparation', shortTitle: 'HSC Prep',
  navDescription: 'Turn knowledge into exam performance.', tagline: 'Turn knowledge into exam performance.',
  image: `${root}/explorer-hsc-prep-photo.png`, imageAlt: 'A tutor reviewing an HSC response with a student',
  attributes: [
    { title: 'Content Mastery', description: 'Build strong subject understanding.', icon: `${root}/explorer-hsc-attribute-content-mastery.png` },
    { title: 'Exam Technique', description: 'Learn how to earn the marks.', icon: `${root}/explorer-hsc-attribute-exam-technique.png` },
    { title: 'Feedback', description: 'Know exactly what to improve.', icon: `${root}/explorer-hsc-attribute-feedback.png` },
  ],
  bestFor: ['Students who know content but lose marks', 'Students needing stronger response structure', 'Students preparing for HSC-style questions', 'Students who need more past-paper exposure', 'Students needing detailed feedback'],
  process: [
    { title: 'Understand', description: 'Build secure subject knowledge.', icon: `${root}/explorer-hsc-process-understand.png` },
    { title: 'Apply', description: 'Use knowledge in HSC-style questions.', icon: `${root}/explorer-hsc-process-apply.png` },
    { title: 'Past Papers', description: 'Practise authentic exam demands.', icon: `${root}/explorer-hsc-process-past-papers.png` },
    { title: 'Feedback', description: 'See exactly where marks are lost.', icon: `${root}/explorer-hsc-process-feedback.png` },
    { title: 'Refine', description: 'Improve structure and technique.', icon: `${root}/explorer-hsc-process-refine.png` },
  ],
  parentQuestions: [
    { question: 'Is this only for struggling students?', answer: 'No. Strong students can also lose marks through weak exam technique, timing or response structure.', icon: `${root}/explorer-hsc-faq-struggling.png` },
    { question: 'How is this different from normal tutoring?', answer: 'The focus is specifically on HSC performance: exam requirements, past-paper application, response technique and feedback.', icon: `${root}/explorer-hsc-faq-difference.png` },
    { question: 'Do students work on past papers?', answer: 'Yes. Past-paper style practice should form part of preparation once the relevant content is understood.', icon: `${root}/explorer-hsc-faq-past-papers.png` },
    { question: 'How do students know what to improve?', answer: 'Tutors provide targeted feedback on working, structure, technique and where marks are being lost.', icon: `${root}/explorer-hsc-faq-improve.png` },
  ],
};

const trialFormat: LearningFormat = {
  id: 'trial', number: '04', title: 'Trial Preparation', shortTitle: 'Trial Prep',
  navDescription: 'Focused preparation when Trials approach.', tagline: 'When Trials get closer, the preparation gets sharper.',
  image: `${root}/explorer-trial-prep-photo.png`, imageAlt: 'An HSC student completing timed Trial preparation with tutor guidance',
  attributes: [
    { title: 'Target Weak Areas', description: 'Focus on what is costing marks.', icon: `${root}/explorer-trial-attribute-weak-areas.png` },
    { title: 'Timed Practice', description: 'Train under realistic pressure.', icon: `${root}/explorer-trial-attribute-timed-practice.png` },
    { title: 'Exam Readiness', description: 'Build confidence before Trials.', icon: `${root}/explorer-trial-attribute-exam-readiness.png` },
  ],
  bestFor: ['Students approaching Trials', 'Students needing focused revision', 'Students with identifiable weak areas', 'Students needing timed exam practice', 'Students wanting confidence under pressure'],
  process: [
    { title: 'Identify Gaps', description: 'Find where marks are being lost.', icon: `${root}/explorer-trial-process-identify-gaps.png` },
    { title: 'Target', description: 'Prioritise the highest-value work.', icon: `${root}/explorer-trial-process-target.png` },
    { title: 'Timed Practice', description: 'Work under realistic conditions.', icon: `${root}/explorer-trial-process-timed-practice.png` },
    { title: 'Correct', description: 'Address mistakes precisely.', icon: `${root}/explorer-trial-process-correct.png` },
    { title: 'Repeat', description: 'Reinforce progress under pressure.', icon: `${root}/explorer-trial-process-repeat.png` },
  ],
  parentQuestions: [
    { question: 'When should Trial preparation start?', answer: 'The exact timing depends on the student, subject and current level. Earlier identification of weak areas gives more time to improve them.', icon: `${root}/explorer-trial-faq-when.png` },
    { question: 'What if Trials are already close?', answer: 'Focused support can still help prioritise the areas most likely to improve performance.', icon: `${root}/explorer-trial-faq-close.png` },
    { question: 'Is it just more past papers?', answer: 'No. Practice should be targeted. We identify weak areas, practise under realistic conditions, correct mistakes and repeat.', icon: `${root}/explorer-trial-faq-past-papers.png` },
    { question: 'How do you know what to focus on?', answer: 'We use performance, past work, tutor observations and exam-style practice to identify where the student is losing marks.', icon: `${root}/explorer-trial-faq-focus.png` },
  ],
};

export const classFormats: LearningFormat[] = [privateFormat, groupFormat, hscFormat, trialFormat];
