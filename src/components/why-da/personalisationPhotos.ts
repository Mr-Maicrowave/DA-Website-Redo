export type PersonalisationPhoto = {
  src: string | null;
  alt: string;
  objectPositionDesktop: string;
  objectPositionTablet: string;
  objectPositionMobile: string;
};

export type PersonalisationFrame = PersonalisationPhoto & {
  id: 'level' | 'pace' | 'support' | 'goals';
  number: string;
  title: string;
  body: string;
};

export const heroPersonalisationPhoto: PersonalisationPhoto = {
  src: '/assets/why-da/personalise-main.png',
  alt: 'A DA tutor and student reviewing schoolwork together',
  objectPositionDesktop: '50% 54%',
  objectPositionTablet: '50% 52%',
  objectPositionMobile: '50% 50%',
};

export const personalisationFrames: PersonalisationFrame[] = [
  { id: 'level', number: '01', title: 'RIGHT LEVEL', body: 'We assess their real understanding, identify gaps and build from the true starting point.', src: '/assets/why-da/personalise-level.png', alt: 'A DA student working independently at the right level', objectPositionDesktop: '50% 51%', objectPositionTablet: '50% 50%', objectPositionMobile: '50% 48%' },
  { id: 'pace', number: '02', title: 'RIGHT PACE', body: 'We adjust the pace to suit how they learn best — fast when ready, slow when needed.', src: '/assets/why-da/personalise-pace.png', alt: 'A DA tutor guiding a student through an exercise', objectPositionDesktop: '52% 50%', objectPositionTablet: '50% 50%', objectPositionMobile: '52% 50%' },
  { id: 'support', number: '03', title: 'RIGHT SUPPORT', body: 'We provide the right teaching, guidance and feedback at every step of the journey.', src: '/assets/why-da/personalise-support.png', alt: 'A DA tutor preparing personalised support on a laptop', objectPositionDesktop: '64% 50%', objectPositionTablet: '61% 50%', objectPositionMobile: '65% 50%' },
  { id: 'goals', number: '04', title: 'RIGHT GOALS', body: 'We set clear goals together and continuously adjust the plan to help them grow further.', src: '/assets/why-da/personalise-goals.png', alt: 'A DA student celebrating progress during a tutoring session', objectPositionDesktop: '56% 48%', objectPositionTablet: '55% 50%', objectPositionMobile: '54% 50%' },
];
