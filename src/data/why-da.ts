export type FeaturedStudentStory = {
  src: string;
  title: string;
  summary: string;
  /** Optional external destination for a future collection of student films. */
  moreStudentStoriesUrl: string;
};

export type StartingPoint = {
  id: 'confidence' | 'stuck' | 'challenge';
  title: string;
  responseHeading: string;
  response: string;
  image: string;
  alt: string;
};

export const hasFeaturedVideo = (story: Pick<FeaturedStudentStory, 'src'>) => story.src.trim().length > 0;

export const featuredStudentStory: FeaturedStudentStory = {
  // Replace with the uploaded local video path when the selected student story is ready.
  src: '',
  title: 'Hear it from our students',
  summary: 'Students explain what makes DA feel different: the support, the friendships and the confidence to grow.',
  // Keep empty until DA has a real public destination for more student films.
  moreStudentStoriesUrl: '',
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
