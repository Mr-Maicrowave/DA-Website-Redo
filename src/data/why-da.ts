export type FeaturedStudentStory = {
  src: string;
  title: string;
  summary: string;
  /** Optional external destination for a future collection of student films. */
  moreStudentStoriesUrl: string;
};

export type StudentStory = {
  id: string;
  /** The student journey this story belongs to. */
  journeyId: StartingPoint['id'];
  /** Local video path under /public. Leave empty until the file is ready, and the card renders as a coming-soon slot. */
  src: string;
  /** Optional poster frame shown before play and on the story card. */
  poster?: string;
  student: string;
  detail: string;
  /** One-line hook shown on the card, in the students' own words where possible. */
  hook: string;
};

export type StartingPoint = {
  id: 'confidence' | 'stuck' | 'challenge';
  title: string;
  responseHeading: string;
  response: string;
  image: string;
  alt: string;
};

/**
 * The Term 1 artifact shown beside the first chapter. Rendered as real HTML
 * rather than an image so the text stays full size, selectable and readable.
 */
export type JourneyArtifact =
  | {
      kind: 'observation';
      label: string;
      /** What the tutor wrote down after the first lesson. */
      items: readonly string[];
      footerLabel: string;
      footerLine: string;
    }
  | {
      kind: 'analysis';
      label: string;
      /** Where the marks were lost, largest last so the point lands. */
      rows: readonly { label: string; marks: number }[];
      footerLine: string;
    }
  | {
      kind: 'plan';
      label: string;
      steps: readonly { title: string; timing: string }[];
      footerLine: string;
    };

/** Per-child narrative for the chapters-of-a-year page. Keyed by StartingPoint id. */
export type Journey = {
  /** Short label for the sticky selector pill. */
  selectorLabel: string;

  term1Heading: string;
  term1Body: string;
  term1Image: string;
  term1ImageAlt: string;
  /** Designed artifact shown alongside Term 1: an observation card, exam analysis or extension plan. */
  term1Artifact: JourneyArtifact;
  term1ArtifactCaption: string;

  term2Heading: string;
  term2Body: string;
  /** The tutor's own words, shown as a handwritten tutor note. */
  term2Note: string;
  term2NoteWeek: string;
  term2NoteAuthor: string;
  /** What actually shifted that term, shown beside the note. */
  term2Signals: readonly { label: string; detail: string }[];

  term3Heading: string;
  term3Body: string;
  term3Image: string;
  term3ImageAlt: string;
  /** A student or parent voice specific to this journey. */
  term3Quote: string;
  term3QuoteAuthor: string;

  /** The student's own words that open Term 4, above the film slot. */
  term4Quote: string;
};

export const hasFeaturedVideo = (story: Pick<FeaturedStudentStory, 'src'>) => story.src.trim().length > 0;

export const hasStoryVideo = (story: Pick<StudentStory, 'src'>) => story.src.trim().length > 0;

export const featuredStudentStory: FeaturedStudentStory = {
  // Replace with the uploaded local video path when the selected student story is ready.
  src: '',
  title: 'Hear it from our students',
  summary: 'Students explain what makes DA feel different: the support, the friendships and the confidence to grow.',
  // Keep empty until DA has a real public destination for more student films.
  moreStudentStoriesUrl: '',
};

/**
 * Student testimonial films shown in the story wall beneath the featured player.
 * Order matters: the first entry with a video becomes the default film in the player.
 * To activate a slot, drop the compressed video into /public and set its `src`
 * (e.g. '/videos/stories/story-1.mp4'). Empty `src` renders as a coming-soon slot.
 */
export const studentStories: readonly StudentStory[] = [
  {
    id: 'story-1',
    journeyId: 'confidence',
    src: '/videos/stories/tahirah-elite.mp4',
    student: 'Tahirah',
    detail: 'DA student',
    hook: 'Not only have they helped me academically, they’ve helped me become a more confident person overall.',
  },
  {
    id: 'story-2',
    journeyId: 'stuck',
    src: '/videos/stories/jivanta-elite.mp4',
    student: 'Jivanta',
    detail: 'DA student',
    hook: 'I went from 40% to 90%.',
  },
  {
    id: 'story-3',
    journeyId: 'challenge',
    src: '/videos/stories/angela-elite.mp4',
    student: 'Angela',
    detail: 'DA student',
    hook: 'The tutors had a lot more passion than I have ever seen before … they wanted me to do good, they were almost hungry for it.',
  },
];

export const journeys: Record<StartingPoint['id'], Journey> = {
  confidence: {
    selectorLabel: 'Does not back themselves',

    term1Heading: 'The tutor notices what the marks never showed.',
    term1Body:
      'Week one: they know the content, but they wait to be asked. In a class of three to five that is visible in the first forty minutes, so the tutor starts with questions they can win.',
    term1Image: '/images/difference/confidence-term1-smiles.jpg',
    term1ImageAlt: 'A DA tutor sitting beside a student, working through a question together',
    term1Artifact: {
      kind: 'observation',
      label: 'First lesson observation',
      items: [
        'Knows the content. Waits to be asked.',
        'Erases correct working before showing it.',
        'Answers quietly, then checks a face for approval.',
        'Volunteers nothing in the first forty minutes.',
      ],
      footerLabel: 'Starting point',
      footerLine: 'Start with questions she can answer confidently, then give her time to put her hand up.',
    },
    term1ArtifactCaption: 'We write down what we notice about confidence, not only what we notice about marks.',

    term2Heading: 'A hand goes up before anyone asks.',
    term2Body:
      'It happens in week six, and it gets written down, because somebody was watching for it. Small wins that are seen start to stack.',
    term2Note: 'She answered first today. Twice. Did not look at me for permission either time.',
    term2NoteWeek: 'Term 2, week 6',
    term2NoteAuthor: 'Ms Christina, English',
    term2Signals: [
      { label: 'In class', detail: 'Answers without being called on, and stops looking for approval afterwards.' },
      { label: 'On paper', detail: 'Working is left visible instead of erased the moment it looks wrong.' },
      { label: 'At home', detail: 'Starts talking about the lesson before being asked how it went.' },
    ],

    term3Heading: 'The voice carries into the classroom at school.',
    term3Body:
      'Speaking up stops being a risk. Teachers at school start reporting the same student we see on a Tuesday night, and the habit travels.',
    term3Image: '/images/difference/confidence-term3.jpg',
    term3ImageAlt: 'Two DA students smiling confidently at their desk',
    term3Quote:
      'She used to sit at the back of every class. Last week she asked to come in early so she could try the harder questions with someone there.',
    term3QuoteAuthor: 'Parent, Year 9',

    term4Quote: 'Not only have they helped me academically, they’ve helped me become a more confident person overall.',
  },

  stuck: {
    selectorLabel: 'Working hard, stuck',

    term1Heading: 'The wrong answers were never the problem.',
    term1Body:
      'Week one: we mark a past paper together and read where the marks actually went. The effort was real. The gap underneath it was years older than this year.',
    term1Image: '/images/difference/stuck-term1.jpg',
    term1ImageAlt: 'A DA tutor marking a student paper with them, explaining as they go',
    term1Artifact: {
      kind: 'analysis',
      label: 'Exam paper analysis',
      rows: [
        { label: 'Careless slips', marks: 2 },
        { label: 'Current topic', marks: 4 },
        { label: 'Exam technique', marks: 6 },
        { label: 'Foundation gap', marks: 14 },
      ],
      footerLine: 'The effort was never the problem. The gap was three years old.',
    },
    term1ArtifactCaption: 'Every lost mark gets a reason. Usually the biggest one is not the topic being taught.',

    term2Heading: 'The method finally clicks.',
    term2Body:
      'With the foundation repaired, the same practice starts producing marks instead of just hours. The work begins to feel different to do.',
    term2Note: 'He got through the whole set without asking me to start it for him. First time this year.',
    term2NoteWeek: 'Term 2, week 7',
    term2NoteAuthor: 'Mr Danny, Biology',
    term2Signals: [
      { label: 'In class', detail: 'Starts a question alone instead of waiting for the first line to be given.' },
      { label: 'On paper', detail: 'Method is written out fully, so partial marks stop being lost.' },
      { label: 'At home', detail: 'Study time drops, and the marks go up anyway.' },
    ],

    term3Heading: 'Effort starts paying its way.',
    term3Body:
      'The same hours now compound. Exam technique, working shown properly and time management turn understanding into results on paper.',
    term3Image: '/images/difference/stuck-term3.jpg',
    term3ImageAlt: 'A DA tutor working through a method on the whiteboard with students',
    term3Quote: 'The tutoring did not add more hours. It made the hours he was already doing count.',
    term3QuoteAuthor: 'Parent, Year 11',

    term4Quote: 'I went from 40% to 90%.',
  },

  challenge: {
    selectorLabel: 'Ready for more',

    term1Heading: 'The bar moves up in the first lesson.',
    term1Body:
      'Week one: we secure the course work, then set a plan that goes past it. Stretch is only useful when someone is standing close enough to catch it.',
    term1Image: '/images/difference/challenge-term1.jpg',
    term1ImageAlt: 'A DA teacher working through advanced material at the whiteboard',
    term1Artifact: {
      kind: 'plan',
      label: 'Extension plan',
      steps: [
        { title: 'Secure the course work first. No gaps left behind.', timing: 'Weeks 1 to 3' },
        { title: 'Harder problem sets, chosen rather than invented.', timing: 'Weeks 4 to 8' },
        { title: 'Explain a method to the group, out loud.', timing: 'Ongoing' },
        { title: 'Past papers under time, then competition style questions.', timing: 'Term 2 onwards' },
      ],
      footerLine: 'Stretch, with someone standing close enough to catch it.',
    },
    term1ArtifactCaption: 'A plan set above the syllabus, not just through it, with the timing written down.',

    term2Heading: 'Stretch becomes something they enjoy.',
    term2Body:
      'They learn to sit with a hard problem long enough to solve it, and the small group turns that into something competitive in the healthiest way.',
    term2Note: 'He asked for the harder set today. I did not offer it. He asked.',
    term2NoteWeek: 'Term 2, week 5',
    term2NoteAuthor: 'Miss Serina',
    term2Signals: [
      { label: 'In class', detail: 'Chooses the harder question first, then explains the method to the table.' },
      { label: 'On paper', detail: 'Solutions get shorter and cleaner as the shortcuts become understood.' },
      { label: 'At home', detail: 'Brings problems in that nobody set, just to see if they can be solved.' },
    ],

    term3Heading: 'Ambition finds its footing.',
    term3Body:
      'Goals sharpen into something specific: subject choices, honest targets, and a clear picture of the work required to reach them.',
    term3Image: '/images/difference/challenge-term3.jpg',
    term3ImageAlt: 'Two DA students working through a problem together at a table',
    term3Quote: 'He explains the method to the rest of the table now. That is when I knew he understood it.',
    term3QuoteAuthor: 'DA tutor, Extension Mathematics',

    term4Quote: 'The tutors had a lot more passion than I have ever seen before. They wanted me to do good. They were almost hungry for it.',
  },
};

export const startingPoints: readonly StartingPoint[] = [
  {
    id: 'confidence',
    title: 'They know the work, but do not back themselves.',
    responseHeading: 'Confidence grows through small, seen wins.',
    response: 'A tutor makes room for a student to explain their thinking, try before being rescued and recognise the progress they are making. Over time, speaking up feels less risky.',
    image: '/images/community/student_attentive.jpg',
    alt: 'A student listening attentively during a DA lesson',
  },
  {
    id: 'stuck',
    title: 'They are working hard, but feel stuck.',
    responseHeading: 'First, find the real point of difficulty.',
    response: 'DA tutors look beyond a wrong answer. Together, they identify the missing foundation, practise a clearer method and leave with a next step that feels possible.',
    image: '/images/community/tutor_one_on_one.jpg',
    alt: 'A DA tutor working one-on-one with a student',
  },
  {
    id: 'challenge',
    title: 'They are ready to be challenged further.',
    responseHeading: 'Challenge feels better with the right support nearby.',
    response: 'Students are invited into deeper questions, stronger habits and higher expectations without having to carry that pressure alone. They learn to stretch their thinking and enjoy the process.',
    image: '/images/community/student_raising_hand.jpg',
    alt: 'A student raising their hand while learning at DA',
  },
];
