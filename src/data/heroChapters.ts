export type HeroChapter = {
  id: string;
  chapterLabel: string;
  shortTitle: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  targetSectionId: string;
  primaryCta?: {
    label: string;
    href: string;
  };
  secondaryCta?: {
    label: string;
    href: string;
  };
};

export const HERO_CHAPTERS = [
  {
    id: 'welcome',
    chapterLabel: 'Welcome',
    shortTitle: 'Welcome',
    title: 'Where Every Story Begins',
    description:
      'Every child arrives with a different story. At DA, we help them build confidence, discover their strengths and write what comes next.',
    image: '/images/community/0X1A7240.jpeg',
    imageAlt: 'A DA Tuition tutor guiding two students as they work together',
    targetSectionId: 'welcome',
    primaryCta: {
      label: 'Begin the Journey',
      href: '/book-interview',
    },
    secondaryCta: {
      label: 'Explore Our Programs',
      href: '#programs',
    },
  },
  {
    id: 'philosophy',
    chapterLabel: 'Our Philosophy',
    shortTitle: 'Philosophy',
    title: 'Students deserve to be known before they are judged.',
    description:
      'Every student arrives with a different story. We take the time to understand where they are — because the gap between their starting point and their potential is exactly where real growth lives.',
    image: '/images/philosophy/philhome.jpeg',
    imageAlt: 'A DA Tuition tutor teaching students at a classroom whiteboard',
    targetSectionId: 'philosophy',
  },
  {
    id: 'journey',
    chapterLabel: 'DA Journey',
    shortTitle: 'Journey',
    title: 'The Community Noticed What Families Already Knew.',
    description:
      'For more than twenty years, DA families have watched their children grow — in confidence first, then in results. This recognition reflects what those families experienced, and what the wider community came to see.',
    image: '/Photos and Videos/2025_FAIR_WINNER_LBA.jpg',
    imageAlt: 'Fairfield City Local Business Awards — Outstanding Education Service, Winner 2025',
    targetSectionId: 'journey',
  },
  {
    id: 'programs',
    chapterLabel: 'Programs',
    shortTitle: 'Programs',
    title: 'Tailored for Every Stage',
    description:
      'Building strong foundations in literacy, numeracy and confident learning.',
    image: '/primary-boy.png',
    imageAlt: 'A primary school student learning at DA Tuition',
    targetSectionId: 'programs',
  },
  {
    id: 'subjects',
    chapterLabel: 'Subjects',
    shortTitle: 'Subjects',
    title: 'Expert tuition in every subject',
    description:
      'From strong foundations to academic excellence through personalised learning.',
    image: '/images/community/subject_maths.jpg',
    imageAlt: 'Students learning mathematics at DA Tuition',
    targetSectionId: 'subjects',
  },
  {
    id: 'environment',
    chapterLabel: 'Environment',
    shortTitle: 'Environment',
    title: 'More than tutoring. A place where students feel known.',
    description:
      'Our students grow in a space where tutors care, questions are welcomed, and confidence is built one relationship at a time.',
    image: '/media/highfive.jpg',
    imageAlt: 'A DA Tuition student sharing a high five with a tutor',
    targetSectionId: 'environment',
  },
  {
    id: 'guides',
    chapterLabel: 'Tutors',
    shortTitle: 'Tutors',
    title: 'Expert Educators',
    description:
      'Teachers who care as much about who your child is becoming as they do about grades.',
    image: '/teachers/king.png',
    imageAlt: 'Mr King, a DA Tuition educator',
    targetSectionId: 'guides',
    primaryCta: {
      label: 'Meet All Our Teachers',
      href: '/find-teacher',
    },
  },
  {
    id: 'stories',
    chapterLabel: 'Success Stories',
    shortTitle: 'Stories',
    title: '450 Five-Star Reviews',
    description: 'Families Love DA',
    image: '/images/community/class_smiling_camera.jpg',
    imageAlt: 'DA Tuition students smiling together in class',
    targetSectionId: 'stories',
  },
  {
    id: 'contact',
    chapterLabel: 'Contact',
    shortTitle: 'Contact',
    title: 'Ready to find the right program for your child?',
    description:
      "Book an interview with our principal. In 30 minutes we will understand your child's needs and match them to the right class, teacher, and starting point.",
    image: '/images/community/tutor_one_on_one.jpg',
    imageAlt: 'A DA Tuition tutor supporting a student one-to-one',
    targetSectionId: 'contact',
    primaryCta: {
      label: 'Book an Interview',
      href: '/book-interview',
    },
  },
] as const satisfies readonly HeroChapter[];
