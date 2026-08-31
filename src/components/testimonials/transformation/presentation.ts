import type { Testimonial } from '../../../data/testimonials';
import type {
  AchievementMomentData,
  ImpactMoment,
  StoryPhaseData,
  TestimonialAssetKey,
  TestimonialPalette,
  TestimonialPresentation,
} from './types';

const palettes: TestimonialPalette[] = [
  { primary: '#2563eb', secondary: '#ec4899', soft: '#eef5ff', glow: 'rgba(37, 99, 235, 0.22)' },
  { primary: '#059669', secondary: '#3b82f6', soft: '#ecfdf7', glow: 'rgba(5, 150, 105, 0.2)' },
  { primary: '#7c3aed', secondary: '#f97362', soft: '#f5f0ff', glow: 'rgba(124, 58, 237, 0.2)' },
  { primary: '#0284c7', secondary: '#f59e0b', soft: '#edf9ff', glow: 'rgba(2, 132, 199, 0.2)' },
  { primary: '#db2777', secondary: '#7c3aed', soft: '#fff0f7', glow: 'rgba(219, 39, 119, 0.18)' },
  { primary: '#0f9488', secondary: '#8b5cf6', soft: '#edfffc', glow: 'rgba(15, 148, 136, 0.2)' },
];

const labelAssetRules: Array<[RegExp, TestimonialAssetKey]> = [
  [/math|result|rank|atar|outcome|score|mark/i, 'trophy'],
  [/english|writing|essay|text/i, 'english'],
  [/science|biology|chemistry|physics/i, 'science'],
  [/confidence|belief|mindset|hope/i, 'wings'],
  [/teacher|tutor|support|care|changed|help/i, 'hands'],
  [/foundation|learning|study|process/i, 'books'],
  [/growth|progress|future/i, 'sprout'],
  [/turning|journey|starting|years/i, 'journey'],
  [/line|reflection|impression|quote/i, 'heart'],
];

const labelForPhase = (phaseIndex: number, phaseCount: number) => {
  if (phaseIndex === 0) return 'Where the journey began';
  if (phaseIndex === phaseCount - 1) return 'The lasting impact';
  return ['How DA responded', 'The turning point', 'What changed', 'The result'][Math.min(phaseIndex - 1, 3)];
};

const assetForLabel = (label: string): TestimonialAssetKey =>
  labelAssetRules.find(([pattern]) => pattern.test(label))?.[1] ?? 'sparkles';

const makeImpacts = (testimonial: Testimonial, palette: TestimonialPalette): ImpactMoment[] =>
  testimonial.calloutBoxes.map((callout, index) => ({
    id: `impact-${index + 1}`,
    label: callout.header,
    statement: callout.content,
    accent: index % 2 === 0 ? palette.primary : palette.secondary,
    assetKey: assetForLabel(callout.header),
    sourceCalloutIndex: index,
  }));

const makePhases = (testimonial: Testimonial, impacts: ImpactMoment[]): StoryPhaseData[] => {
  const paragraphCount = testimonial.bodyParagraphs.length;
  const phaseCount = Math.max(1, Math.min(5, Math.ceil(paragraphCount / 3)));
  const size = Math.ceil(paragraphCount / phaseCount);

  return Array.from({ length: phaseCount }, (_, phaseIndex) => {
    const paragraphIndexes = Array.from(
      { length: Math.max(0, Math.min(size, paragraphCount - phaseIndex * size)) },
      (__, offset) => phaseIndex * size + offset,
    );
    const impactIndexes = impacts
      .map((_, impactIndex) => impactIndex)
      .filter((impactIndex) => impactIndex % phaseCount === phaseIndex);
    const label = labelForPhase(phaseIndex, phaseCount);

    return {
      id: `phase-${phaseIndex + 1}`,
      label,
      paragraphIndexes,
      impactIndexes,
      assetKey: assetForLabel(label),
    };
  });
};

const curatedAchievements: Record<string, AchievementMomentData[]> = {
  'a-student-reflection-tu-nguyen': [
    { id: 'tu-maths', displayValue: '100%', context: 'First Year 12 mathematics assessment', accent: '#f59e0b', assetKey: 'trophy', sourceParagraphIndex: 3 },
    { id: 'tu-outcome', displayValue: 'ATAR 99.05', context: 'Ranked 1st in every subject throughout Year 12', accent: '#7c3aed', assetKey: 'star', sourceParagraphIndex: 9 },
  ],
  'my-journey-at-da-tuition-ruby-nguyen': [
    { id: 'ruby-hsc', displayValue: '97', context: 'HSC English mark and 2nd in the state', accent: '#2563eb', assetKey: 'medal', sourceParagraphIndex: 4 },
    { id: 'ruby-atar', displayValue: 'ATAR 99.85', context: 'Final ATAR', accent: '#ec4899', assetKey: 'star', sourceParagraphIndex: 4 },
  ],
};

export const getTestimonialPresentation = (testimonial: Testimonial, index: number): TestimonialPresentation => {
  const palette = palettes[index % palettes.length];
  const impacts = makeImpacts(testimonial, palette);
  const phases = makePhases(testimonial, impacts);
  const heroTags = impacts.slice(0, 3).map((impact) => impact.label.replace(/^(A|THE)\s+/i, ''));

  return {
    palette,
    heroTags,
    phases,
    impacts,
    achievements: curatedAchievements[testimonial.slug] ?? [],
    quoteAssetKeys: testimonial.pullQuotes.map((quote) => assetForLabel(quote.text)),
  };
};
