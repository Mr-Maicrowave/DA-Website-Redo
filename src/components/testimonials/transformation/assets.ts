import type { TestimonialAssetKey } from './types';

type TestimonialAssetDefinition = { src: string; width: number; height: number };

const mountain = (index: string, name: string): TestimonialAssetDefinition => ({
  src: `/images/success-stories/story-mountain-${index}-${name}-v1.png`,
  width: 1536,
  height: 1024,
});

export const testimonialAssetRegistry: Record<TestimonialAssetKey, TestimonialAssetDefinition> = {
  trophy: mountain('04', 'amber-sunset'), medal: mountain('04', 'amber-sunset'), star: mountain('06', 'deep-navy'),
  chart: mountain('02', 'green-forest'), wings: mountain('05', 'pale-sky'), heart: mountain('03', 'violet-lavender'),
  sunrise: mountain('04', 'amber-sunset'), hands: mountain('05', 'pale-sky'), journey: mountain('01', 'blue-snow'),
  mountain: mountain('01', 'blue-snow'), plane: mountain('05', 'pale-sky'), milestone: mountain('06', 'deep-navy'),
  books: mountain('02', 'green-forest'), lightbulb: mountain('04', 'amber-sunset'), mathematics: mountain('02', 'green-forest'),
  english: mountain('01', 'blue-snow'), science: mountain('03', 'violet-lavender'), sprout: mountain('02', 'green-forest'),
  flowers: mountain('04', 'amber-sunset'), gemstone: mountain('03', 'violet-lavender'), sparkles: mountain('06', 'deep-navy'),
};

