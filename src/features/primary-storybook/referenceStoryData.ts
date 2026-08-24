import { primaryAssetManifest } from './primaryAssetManifest';

type CommunityPhotoPath = `/images/community/${string}`;

type Outcome = {
  number: '01' | '02' | '03' | '04';
  title: string;
  body: string;
};

type CurriculumItem = {
  title: string;
  detail: string;
  accent: 'blue' | 'pink' | 'green';
};

type CurriculumBand = {
  years: 'Years 1–2' | 'Years 3–4' | 'Years 5–6';
  title: string;
  illustration: string;
  items: readonly [CurriculumItem, CurriculumItem, CurriculumItem];
};

type TeachingStep = {
  number: '01' | '02' | '03' | '04';
  title: string;
  body: string;
  photo: { src: CommunityPhotoPath; alt: string };
};

type ProgramChoice = {
  id: 'small-group' | 'private-tuition' | 'creative-writing';
  title: string;
  description: string;
  asset: string;
};

type FamilyReason = {
  title: string;
  body: string;
};

export const referenceStoryAssets = {
  foundationDecor: primaryAssetManifest.foundations,
  curriculumHouse: primaryAssetManifest.curriculumHouse,
  teachingPath: '/primary-reference/decor/how-we-teach-path-set.png',
  growthDecor: '/primary-reference/decor/growth-crayon-set.png',
  masteryDecor: '/primary-reference/decor/mastery-crayon-set.png',
  programHelpers: '/primary-reference/decor/program-helper-icons.png',
  familyIcons: '/primary-reference/decor/family-icons.png',
  closingLandscape: primaryAssetManifest.closingLandscape,
} as const satisfies Record<string, `/primary-reference/${string}`>;

export const foundationOutcomes = [
  {
    number: '01',
    title: 'Core reading and number skills',
    body: 'We build strong foundations in reading, decoding and number sense through engaging, hands-on learning.',
  },
  {
    number: '02',
    title: 'Confidence through small wins',
    body: 'Every small achievement builds confidence and helps our students believe they can do more.',
  },
  {
    number: '03',
    title: 'Individual attention every lesson',
    body: 'Our small class sizes mean every child gets the guidance they need to grow at their own pace.',
  },
  {
    number: '04',
    title: 'Loved by parents for real results',
    body: 'We partner with parents and celebrate progress together—because consistency drives results.',
  },
] as const satisfies readonly [Outcome, Outcome, Outcome, Outcome];

export const growthOutcomes = [
  {
    number: '01',
    title: 'Independence and responsibility',
    body: 'We encourage students to take ownership of their learning and develop strong habits for success.',
  },
  {
    number: '02',
    title: 'Stronger thinking and problem solving',
    body: 'We develop logical thinking and apply strategies to solve problems with confidence.',
  },
  {
    number: '03',
    title: 'Collaborative learning',
    body: 'We learn together, share ideas and build the communication skills needed for the future.',
  },
  {
    number: '04',
    title: 'NAPLAN readiness',
    body: 'We build the skills and stamina needed for NAPLAN and future academic challenges.',
  },
] as const satisfies readonly [Outcome, Outcome, Outcome, Outcome];

export const masteryOutcomes = [
  {
    number: '01',
    title: 'Advanced literacy & comprehension',
    body: 'We develop strong analytical reading skills and deeper understanding across a wide range of texts.',
  },
  {
    number: '02',
    title: 'Mathematical reasoning & problem solving',
    body: 'We strengthen mathematical thinking and apply strategies to solve complex problems with accuracy and confidence.',
  },
  {
    number: '03',
    title: 'Independent study & organisation',
    body: 'We build effective study habits, time management and the independence needed to thrive in high school and beyond.',
  },
  {
    number: '04',
    title: 'High school readiness',
    body: 'We prepare students for Year 7 transition, selective schools and future academic challenges.',
  },
] as const satisfies readonly [Outcome, Outcome, Outcome, Outcome];

export const curriculumBands = {
  foundation: {
    years: 'Years 1–2',
    title: 'Curriculum',
    illustration: primaryAssetManifest.curriculumHouse,
    items: [
      { title: 'Phonics & Reading', detail: 'Phonics, decoding and reading fluency', accent: 'blue' },
      { title: 'Writing & Language', detail: 'Sentence construction, handwriting and vocabulary', accent: 'pink' },
      { title: 'Number Sense', detail: 'Number sense, place value and mathematical reasoning', accent: 'green' },
    ],
  },
  growth: {
    years: 'Years 3–4',
    title: 'Curriculum',
    illustration: referenceStoryAssets.growthDecor,
    items: [
      { title: 'Reading to learn', detail: 'Reading to learn through comprehension and inference', accent: 'blue' },
      { title: 'Writing with purpose', detail: 'Narrative and informative writing with language conventions', accent: 'pink' },
      { title: 'Applied numeracy', detail: 'NAPLAN-aligned numeracy, data and multi-step problem solving', accent: 'green' },
    ],
  },
  mastery: {
    years: 'Years 5–6',
    title: 'Curriculum',
    illustration: referenceStoryAssets.masteryDecor,
    items: [
      { title: 'High-level writing', detail: 'Persuasive and narrative writing at a high level', accent: 'blue' },
      { title: 'Reasoning with accuracy', detail: 'Selective-school reasoning, speed and accuracy', accent: 'pink' },
      { title: 'Ready for Year 7', detail: 'Independent study habits, organisation and Year 7 preparation', accent: 'green' },
    ],
  },
} as const satisfies Record<'foundation' | 'growth' | 'mastery', CurriculumBand>;

export const teachingSteps = [
  {
    number: '01',
    title: 'We explain',
    body: 'Clear explanations help each child see the next achievable step.',
    photo: { src: '/images/community/teacher_kids_warmth.jpg', alt: 'A DA Tuition tutor explaining a concept to primary students' },
  },
  {
    number: '02',
    title: 'We practise together',
    body: 'Guided practice gives students time to try new skills with support close by.',
    photo: { src: '/images/community/student_attentive.jpg', alt: 'A primary student concentrating during guided practice' },
  },
  {
    number: '03',
    title: 'They try independently',
    body: 'Independent work turns understanding into confidence and lasting habits.',
    photo: { src: '/images/community/student_typing_laptop.jpg', alt: 'A DA Tuition student working independently' },
  },
  {
    number: '04',
    title: 'We celebrate progress',
    body: 'Positive review makes progress visible and shows every child what comes next.',
    photo: { src: '/images/community/class_smiling_camera.jpg', alt: 'DA Tuition students celebrating a positive learning moment' },
  },
] as const satisfies readonly [TeachingStep, TeachingStep, TeachingStep, TeachingStep];

export const programChoices = [
  {
    id: 'small-group',
    title: 'Small Group Tuition',
    description: 'A focused small-group environment where students learn alongside peers and receive individual guidance.',
    asset: primaryAssetManifest.smallGroup,
  },
  {
    id: 'private-tuition',
    title: 'Private Tuition',
    description: 'One-to-one support shaped around your child’s goals, pace and learning needs.',
    asset: primaryAssetManifest.privateTuition,
  },
  {
    id: 'creative-writing',
    title: 'Creative Writing',
    description: 'A dedicated space to develop voice, imagination and confident written expression.',
    asset: primaryAssetManifest.creativeWriting,
  },
] as const satisfies readonly [ProgramChoice, ProgramChoice, ProgramChoice];

export const familyReasons = [
  { title: 'Small classes, real attention', body: 'Every child is known, supported and encouraged to ask questions.' },
  { title: 'A clear Years 1–6 pathway', body: 'Skills build deliberately from strong foundations to Year 7 readiness.' },
  { title: 'Confidence that carries forward', body: 'We celebrate progress so students feel capable of the next challenge.' },
  { title: 'Families as partners', body: 'We share progress and work alongside parents at every stage.' },
] as const satisfies readonly [FamilyReason, FamilyReason, FamilyReason, FamilyReason];

export const stagePhotos = {
  foundation: {
    src: '/images/community/tutor_one_on_one.jpg',
    alt: 'A DA Tuition tutor supporting a young primary student with her work',
  },
  growth: {
    src: '/images/community/tutor_mentor_girls.jpg',
    alt: 'A DA Tuition tutor guiding a small group of upper-primary students',
  },
  mastery: {
    src: '/images/community/0X1A7290.jpeg',
    alt: 'Upper-primary DA Tuition students engaged in classroom learning',
  },
} as const satisfies Record<'foundation' | 'growth' | 'mastery', { src: CommunityPhotoPath; alt: string }>;
