export type CarePhoto = {
  image: string | null;
  alt: string;
  objectPositionDesktop: string;
  objectPositionTablet: string;
  objectPositionMobile: string;
};

export type CareMoment = CarePhoto & {
  id: 'listen' | 'notice' | 'reassure' | 'encourage' | 'celebrate';
  number: string;
  title: string;
  quote: string;
};

export const careMoments: CareMoment[] = [
  { id: 'listen', number: '01', title: 'LISTEN', quote: '“She knows it.\nShe just needs confidence.”', image: '/assets/why-da/care-listen.png', alt: 'Tutor listening while a student works through a lesson', objectPositionDesktop: '50% 52%', objectPositionTablet: '50% 52%', objectPositionMobile: '50% 52%' },
  { id: 'notice', number: '02', title: 'NOTICE', quote: '“He needs\nanother minute.”', image: '/assets/why-da/care-notice.png', alt: 'Tutor noticing where a student needs support', objectPositionDesktop: '50% 52%', objectPositionTablet: '50% 52%', objectPositionMobile: '50% 52%' },
  { id: 'reassure', number: '03', title: 'REASSURE', quote: '“Let’s try it\na different way.”', image: '/assets/why-da/care-reassure.png', alt: 'Tutor reassuring a student during a lesson', objectPositionDesktop: '50% 50%', objectPositionTablet: '50% 50%', objectPositionMobile: '50% 50%' },
  { id: 'encourage', number: '04', title: 'ENCOURAGE', quote: '“That attempt\nmattered too.”', image: '/assets/why-da/care-encourage.png', alt: 'Student working independently with encouragement nearby', objectPositionDesktop: '58% 50%', objectPositionTablet: '58% 50%', objectPositionMobile: '58% 50%' },
  { id: 'celebrate', number: '05', title: 'CELEBRATE', quote: '“You did it.”', image: '/assets/why-da/care-celebrate.png', alt: 'Tutor and student celebrating progress together', objectPositionDesktop: '50% 50%', objectPositionTablet: '50% 50%', objectPositionMobile: '50% 50%' },
];

export const finalCarePhoto: CarePhoto = {
  image: '/assets/why-da/care-final-tutor-student.png',
  alt: 'Tutor supporting a student during a DA Tuition lesson',
  objectPositionDesktop: '50% 50%',
  objectPositionTablet: '50% 50%',
  objectPositionMobile: '52% 50%',
};
