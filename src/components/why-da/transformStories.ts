export type TransformStory = {
  id: 'confidence' | 'foundations' | 'independence' | 'progress' | 'ambition';
  number: string;
  category: string;
  shortLine: string;
  quote: string;
  emphasis: string;
  videoSrc: string | null;
  poster: string | null;
  captions: string | null;
  duration: string | null;
  objectPositionDesktop: string;
  objectPositionTablet: string;
  objectPositionMobile: string;
};

export const transformStories: TransformStory[] = [
  { id: 'confidence', number: '01', category: 'CONFIDENCE', shortLine: 'From afraid to ask to willing to try.', quote: 'I’m not afraid to ask questions now.', emphasis: 'not afraid', videoSrc: '/videos/why-da-transform/ben-elite.mp4', poster: '/videos/why-da-transform/ben-elite.jpg', captions: null, duration: null, objectPositionDesktop: '50% 50%', objectPositionTablet: '50% 50%', objectPositionMobile: '50% 50%' },
  { id: 'foundations', number: '02', category: 'FOUNDATIONS', shortLine: 'From gaps to understanding.', quote: 'Maths finally makes sense.', emphasis: 'makes sense', videoSrc: '/videos/why-da-transform/dee-elite.mp4', poster: '/videos/why-da-transform/dee-elite.jpg', captions: null, duration: null, objectPositionDesktop: '50% 50%', objectPositionTablet: '50% 50%', objectPositionMobile: '50% 50%' },
  { id: 'independence', number: '03', category: 'INDEPENDENCE', shortLine: 'From quiet and unsure to confident, independent and excited to learn.', quote: 'She believes in herself now.', emphasis: 'believes in herself', videoSrc: '/videos/why-da-transform/hsc-transformation.mp4', poster: '/videos/why-da-transform/hsc-transformation.jpg', captions: null, duration: null, objectPositionDesktop: '50% 50%', objectPositionTablet: '50% 50%', objectPositionMobile: '50% 50%' },
  { id: 'progress', number: '04', category: 'PROGRESS', shortLine: 'From struggling to moving forward.', quote: 'My marks actually improved.', emphasis: 'actually improved', videoSrc: '/videos/why-da-transform/isabella-elite.mp4', poster: '/videos/why-da-transform/isabella-elite.jpg', captions: null, duration: null, objectPositionDesktop: '50% 50%', objectPositionTablet: '50% 50%', objectPositionMobile: '50% 50%' },
  { id: 'ambition', number: '05', category: 'AMBITION', shortLine: 'From just getting through it to wanting more.', quote: 'I want to keep going even further.', emphasis: 'keep going', videoSrc: '/videos/why-da-transform/jivanta-elite.mp4', poster: '/videos/why-da-transform/jivanta-elite.jpg', captions: null, duration: null, objectPositionDesktop: '50% 50%', objectPositionTablet: '50% 50%', objectPositionMobile: '50% 50%' },
];
