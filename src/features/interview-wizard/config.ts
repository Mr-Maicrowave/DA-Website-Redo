import type { ContactMethod, LearningFormat, Option, SchoolStage } from './types.ts';

const options = (entries: readonly (readonly [string, string])[]): readonly Option[] =>
  entries.map(([value, label]) => ({ value, label }));

export const STEP_META = [
  { step: 1, short: 'YOU', title: 'Who are we getting to know?' },
  { step: 2, short: 'SUBJECTS', title: 'What would you like help with?' },
  { step: 3, short: 'RIGHT NOW', title: 'What is happening right now?' },
  { step: 4, short: 'GOALS', title: 'What would you like to change?' },
  { step: 5, short: 'LEARNING', title: 'How do they learn best?' },
  { step: 6, short: 'REVIEW', title: 'Does this look right?' },
] as const;

export const CONTACT_METHODS: readonly Option<ContactMethod>[] = [
  { value: 'phone', label: 'Phone call' },
  { value: 'sms', label: 'SMS' },
  { value: 'email', label: 'Email' },
  { value: 'no-preference', label: 'No preference' },
];

export const SUBJECTS_BY_STAGE: Record<SchoolStage, readonly Option[]> = {
  primary: options([
    ['english', 'English'], ['mathematics', 'Mathematics'], ['creative-writing', 'Creative Writing'],
  ]),
  'high-school': options([
    ['mathematics', 'Mathematics'], ['english', 'English'], ['science', 'Science'],
    ['biology', 'Biology'], ['chemistry', 'Chemistry'], ['physics', 'Physics'],
    ['business-studies', 'Business Studies'], ['legal-studies', 'Legal Studies'],
  ]),
  hsc: options([
    ['mathematics', 'Mathematics'], ['english', 'English'], ['biology', 'Biology'],
    ['chemistry', 'Chemistry'], ['physics', 'Physics'], ['business-studies', 'Business Studies'],
    ['legal-studies', 'Legal Studies'],
  ]),
};

const PRIMARY_AREAS: Record<string, readonly Option[]> = {
  english: options([['reading', 'Reading'], ['comprehension', 'Comprehension'], ['writing', 'Writing'], ['spelling', 'Spelling'], ['grammar', 'Grammar'], ['vocabulary', 'Vocabulary'], ['school-english-generally', 'School English generally'], ['not-sure-yet', 'Not sure yet']]),
  mathematics: options([['number-skills', 'Number skills'], ['problem-solving', 'Problem solving'], ['fractions-and-decimals', 'Fractions and decimals'], ['measurement', 'Measurement'], ['school-mathematics-generally', 'School Mathematics generally'], ['extension', 'Extension'], ['not-sure-yet', 'Not sure yet']]),
  'creative-writing': options([['ideas-and-imagination', 'Ideas and imagination'], ['story-structure', 'Story structure'], ['vocabulary', 'Vocabulary'], ['sentence-construction', 'Sentence construction'], ['writing-confidence', 'Writing confidence'], ['advanced-writing', 'Advanced writing'], ['not-sure-yet', 'Not sure yet']]),
};

const SECONDARY_ENGLISH = options([['school-english', 'School English'], ['essay-writing', 'Essay writing'], ['creative-writing', 'Creative Writing'], ['comprehension', 'Comprehension'], ['gat-preparation', 'GAT preparation'], ['advanced-extension-english', 'Advanced / extension English'], ['not-sure-yet', 'Not sure yet']]);
const SECONDARY_MATHS = options([['school-mathematics', 'School Mathematics'], ['foundation-rebuilding', 'Foundation rebuilding'], ['assessment-preparation', 'Assessment preparation'], ['problem-solving', 'Problem solving'], ['advanced-mathematics', 'Advanced Mathematics'], ['extension', 'Extension'], ['not-sure-yet', 'Not sure yet']]);
const SCIENCE_AREAS = options([['school-content', 'School content'], ['foundation-gaps', 'Foundation gaps'], ['assessment-preparation', 'Assessment preparation'], ['exam-technique', 'Exam technique'], ['extension', 'Extension'], ['not-sure-yet', 'Not sure yet']]);
const HUMANITIES_AREAS = options([['content-understanding', 'Content understanding'], ['writing-responses', 'Writing responses'], ['case-studies', 'Case studies'], ['assessment-preparation', 'Assessment preparation'], ['exam-technique', 'Exam technique'], ['not-sure-yet', 'Not sure yet']]);
const HSC_AREAS = options([['understanding-content', 'Understanding content'], ['keeping-up-with-school', 'Keeping up with school'], ['assessments', 'Assessments'], ['exam-technique', 'Exam technique'], ['writing-stronger-responses', 'Writing stronger responses'], ['time-management', 'Time management'], ['past-papers', 'Past papers'], ['fixing-knowledge-gaps', 'Fixing knowledge gaps'], ['improving-marks', 'Improving marks'], ['band-6-preparation', 'Band 6 preparation'], ['advanced-high-achievement', 'Advanced / high achievement'], ['not-sure', 'Not sure — I want DA to advise']]);

export const SUBJECT_AREAS_BY_STAGE: Record<SchoolStage, Record<string, readonly Option[]>> = {
  primary: PRIMARY_AREAS,
  'high-school': {
    english: SECONDARY_ENGLISH,
    mathematics: SECONDARY_MATHS,
    science: SCIENCE_AREAS,
    biology: SCIENCE_AREAS,
    chemistry: SCIENCE_AREAS,
    physics: SCIENCE_AREAS,
    'business-studies': HUMANITIES_AREAS,
    'legal-studies': HUMANITIES_AREAS,
  },
  hsc: Object.fromEntries(SUBJECTS_BY_STAGE.hsc.map(subject => [subject.value, HSC_AREAS])),
};

export const CURRENT_SITUATIONS = options([
  ['struggling-and-falling-behind', 'They’re struggling and falling behind.'],
  ['noticeable-foundation-gaps', 'They understand some topics but have noticeable gaps.'],
  ['doing-okay-but-could-do-better', 'Their marks are okay, but I think they can do better.'],
  ['understands-content-but-loses-marks', 'They know the content but lose marks in assessments.'],
  ['low-confidence', 'They lack confidence.'], ['rushes-and-makes-mistakes', 'They rush and make avoidable mistakes.'],
  ['needs-more-challenge', 'They need more challenge than school is giving them.'],
  ['performing-strongly-wants-more', 'They’re performing strongly and want to go further.'],
  ['results-have-dropped', 'Their results have recently dropped.'],
  ['important-assessment-coming', 'They have an important exam or assessment coming up.'],
  ['not-sure-what-problem-is', 'I’m not sure what the problem is yet.'],
]);

export const CURRENT_RESULTS = options([['below-50', 'Below 50%'], ['50-59', '50–59%'], ['60-69', '60–69%'], ['70-79', '70–79%'], ['80-89', '80–89%'], ['90-plus', '90%+'], ['school-does-not-use-percentages', 'School does not use percentages'], ['not-sure', 'Not sure']]);
export const SCHOOLWORK_DIFFICULTY = options([['very-difficult', 'Very difficult'], ['often-difficult', 'Often difficult'], ['depends-on-topic', 'It depends on the topic'], ['generally-manageable', 'Generally manageable'], ['comfortable', 'Comfortable'], ['too-easy', 'Too easy'], ['not-sure', 'Not sure']]);
export const CONFIDENCE_OPTIONS = options([['avoids-subject', 'Avoids the subject'], ['very-unsure', 'Very unsure'], ['mixed', 'Mixed'], ['generally-confident', 'Generally confident'], ['very-confident', 'Very confident']]);
export const BEHAVIOURS_OBSERVED = options([['says-they-are-bad-at-it', 'Says they are bad at it'], ['avoids-homework', 'Avoids homework'], ['gets-frustrated-easily', 'Gets frustrated easily'], ['needs-someone-beside-them', 'Needs someone beside them'], ['gives-up-quickly', 'Gives up quickly'], ['hesitates-to-ask-questions', 'Hesitates to ask questions'], ['rushes-to-finish', 'Rushes to finish'], ['studies-but-results-dont-improve', 'Studies but results don’t improve'], ['works-independently', 'Works independently'], ['enjoys-being-challenged', 'Enjoys being challenged'], ['none', 'None of these'], ['not-sure', 'Not sure']]);
export const PARENT_CONCERNS = options([['falling-behind', 'Falling behind'], ['lost-confidence', 'Lost confidence'], ['works-hard-but-marks-not-improving', 'Works hard but marks are not improving'], ['dont-know-where-gaps-are', 'I don’t know where the gaps are'], ['capable-of-more', 'Capable of more'], ['needs-better-study-habits', 'Needs better study habits'], ['needs-different-explanations', 'Needs different explanations'], ['school-moves-too-fast', 'School moves too fast'], ['school-not-challenging-enough', 'School is not challenging enough'], ['important-exam-coming', 'Important exam coming'], ['needs-better-preparation', 'Needs better preparation'], ['other', 'Other']]);

const COMMON_GOALS = options([['stronger-foundations', 'Stronger foundations'], ['better-understanding', 'Better understanding'], ['higher-school-marks', 'Higher school marks'], ['more-confidence', 'More confidence'], ['better-assessment-performance', 'Better assessment performance'], ['less-schoolwork-stress', 'Less schoolwork stress'], ['better-study-habits', 'Better study habits'], ['greater-independence', 'Greater independence'], ['catch-up-to-year-level', 'Catch up to year level'], ['move-ahead-of-year-level', 'Move ahead of year level'], ['advanced-extension-work', 'Advanced / extension work'], ['build-interest-in-subject', 'Build interest in the subject']]);
const PRIMARY_GOALS = [...COMMON_GOALS, ...options([['selective-gat-scholarship-preparation', 'Selective / GAT / scholarship preparation']])];
const HSC_GOALS = [...COMMON_GOALS, ...options([['strong-hsc-preparation', 'Strong HSC preparation'], ['band-6-goal', 'Band 6 goal']])];
export const GOALS_BY_STAGE: Record<SchoolStage, readonly Option[]> = { primary: PRIMARY_GOALS, 'high-school': COMMON_GOALS, hsc: HSC_GOALS };

export const LEARNING_CHALLENGES = options([['gaps-from-earlier-years', 'Gaps from earlier years'], ['difficulty-concentrating', 'Difficulty concentrating'], ['works-slowly', 'Works slowly'], ['rushes', 'Rushes'], ['instructions-can-be-confusing', 'Instructions can be confusing'], ['difficulty-remembering-concepts', 'Difficulty remembering concepts'], ['difficulty-applying-knowledge-in-tests', 'Difficulty applying knowledge in tests'], ['written-responses-are-difficult', 'Written responses are difficult'], ['assessment-anxiety', 'Assessment anxiety'], ['needs-more-repetition', 'Needs more repetition'], ['gets-bored-when-work-too-easy', 'Gets bored when work is too easy'], ['inconsistent-past-support', 'Inconsistent past support'], ['nothing-specific', 'Nothing specific'], ['not-sure', 'Not sure'], ['other', 'Other']]);
export const PREVIOUS_TUTORING_ISSUES = options([['class-too-big', 'Class was too big'], ['moved-too-quickly', 'Moved too quickly'], ['moved-too-slowly', 'Moved too slowly'], ['explanations-not-clear', 'Explanations were not clear'], ['student-did-not-connect-with-tutor', 'Student did not connect with the tutor'], ['too-much-homework', 'Too much homework'], ['not-enough-challenge', 'Not enough challenge'], ['work-not-aligned-with-school', 'Work was not aligned with school'], ['not-enough-feedback', 'Not enough feedback'], ['worked-well-changing-for-another-reason', 'It worked well; changing for another reason'], ['other', 'Other']]);
export const FORMAT_PREFERENCES: readonly Option<LearningFormat>[] = [{ value: 'private', label: 'Private' }, { value: 'small-group', label: 'Small Group' }, { value: 'class', label: 'Class' }, { value: 'advanced', label: 'Advanced / specialised program' }, { value: 'not-sure', label: 'Not sure — please recommend what suits my child' }];
export const TUTOR_PREFERENCES = options([['patient-and-reassuring', 'Patient and reassuring'], ['energetic-and-motivating', 'Energetic and motivating'], ['calm-and-structured', 'Calm and structured'], ['direct-and-accountable', 'Direct and accountable'], ['strong-at-rebuilding-confidence', 'Strong at rebuilding confidence'], ['strong-at-challenging-advanced-students', 'Strong at challenging advanced students'], ['explains-concepts-different-ways', 'Explains concepts in different ways'], ['strong-at-organisation', 'Strong at organisation'], ['no-preference', 'No preference']]);

export const CONSULTATION_STEPS = [
  { key: 'listen', title: 'Listen', description: 'We hear your concerns, what’s happening now and what matters most to you.' },
  { key: 'understand', title: 'Understand', description: 'We look at their current level, confidence, school demands, strengths and gaps.' },
  { key: 'recommend', title: 'Recommend', description: 'We suggest the subject, starting point and learning format that make sense.' },
  { key: 'match', title: 'Match', description: 'We consider teaching style, subject expertise and personality when matching a tutor or class.' },
  { key: 'begin', title: 'Begin', description: 'Your child starts with a clear direction, and we adjust as we understand them better.' },
] as const;

export const DURING_CONSULTATION = [
  { title: 'We start with what you’ve told us', description: 'We review your submission before speaking with you, so you should not have to repeat everything from the beginning.' },
  { title: 'We ask about the student behind the marks', description: 'We talk about school performance, confidence, learning habits, strengths, gaps, assessments and what you have noticed at home.' },
  { title: 'We clarify what actually needs to change', description: 'Sometimes the issue is content knowledge. Sometimes it is exam technique, confidence, pace, organisation or the learning environment.' },
  { title: 'We discuss the appropriate starting point', description: 'This could mean rebuilding foundations, supporting current schoolwork, working ahead, assessment preparation or extension.' },
  { title: 'We recommend a pathway', description: 'We discuss the subject, level, format and tutor profile we believe are appropriate and explain why.' },
] as const;

export const AFTER_CONSULTATION = [
  { key: 'recommend', title: 'Recommend', description: 'We identify the most appropriate starting pathway.' },
  { key: 'match', title: 'Match', description: 'We consider subject expertise, teaching style, personality and availability.' },
  { key: 'begin', title: 'Begin', description: 'Your child starts with a clearer direction rather than being placed blindly.' },
  { key: 'observe', title: 'Observe', description: 'The tutor learns how your child responds, where the gaps are and how quickly they progress.' },
  { key: 'adjust', title: 'Adjust', description: 'The work, pace, level or learning format can change as we understand the student better.' },
] as const;
