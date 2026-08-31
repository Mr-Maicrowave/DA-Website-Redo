import type { TestimonialAssetKey } from './types';

type TestimonialAssetDefinition = { src: string; width: number; height: number };

const mountain = (index: string, name: string): TestimonialAssetDefinition => ({
  src: `/images/success-stories/story-mountain-${index}-${name}-v1.png`,
  width: 1536,
  height: 1024,
});

export const testimonialAssetRegistry: Record<TestimonialAssetKey, TestimonialAssetDefinition> = {
  trophy: { src: '/images/testimonials/transformation/achievement-trophy-v1.png', width: 1230, height: 1278 },
  medal: { src: '/images/testimonials/transformation/achievement-trophy-v1.png', width: 1230, height: 1278 },
  star: { src: '/images/testimonials/transformation/achievement-trophy-v1.png', width: 1230, height: 1278 },
  chart: mountain('02', 'green-forest'),
  wings: { src: '/images/testimonials/transformation/confidence-wings-v1.png', width: 1536, height: 1024 },
  heart: { src: '/images/testimonials/transformation/confidence-wings-v1.png', width: 1536, height: 1024 },
  sunrise: mountain('04', 'amber-sunset'),
  hands: { src: '/images/testimonials/transformation/confidence-wings-v1.png', width: 1536, height: 1024 },
  journey: mountain('01', 'blue-snow'),
  mountain: mountain('01', 'blue-snow'), plane: mountain('05', 'pale-sky'), milestone: mountain('06', 'deep-navy'),
  books: mountain('02', 'green-forest'), lightbulb: mountain('04', 'amber-sunset'), mathematics: mountain('02', 'green-forest'),
  english: mountain('01', 'blue-snow'), science: mountain('03', 'violet-lavender'), sprout: mountain('02', 'green-forest'),
  flowers: mountain('04', 'amber-sunset'), gemstone: mountain('03', 'violet-lavender'), sparkles: mountain('06', 'deep-navy'),
};
