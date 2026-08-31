export type TestimonialAssetKey =
  | 'trophy' | 'medal' | 'star' | 'chart' | 'wings' | 'heart' | 'sunrise'
  | 'hands' | 'journey' | 'mountain' | 'plane' | 'milestone' | 'books'
  | 'lightbulb' | 'mathematics' | 'english' | 'science' | 'sprout' | 'flowers'
  | 'gemstone' | 'sparkles';

export type TestimonialPalette = {
  primary: string;
  secondary: string;
  soft: string;
  glow: string;
};

export type StoryPhaseData = {
  id: string;
  label: string;
  paragraphIndexes: number[];
  impactIndexes: number[];
  assetKey: TestimonialAssetKey;
};

export type ImpactMoment = {
  id: string;
  label: string;
  statement: string;
  accent: string;
  assetKey: TestimonialAssetKey;
  sourceCalloutIndex: number;
};

export type AchievementMomentData = {
  id: string;
  displayValue: string;
  context: string;
  accent: string;
  assetKey: TestimonialAssetKey;
  sourceParagraphIndex: number;
};

export type TestimonialPresentation = {
  palette: TestimonialPalette;
  heroTags: string[];
  phases: StoryPhaseData[];
  impacts: ImpactMoment[];
  achievements: AchievementMomentData[];
  quoteAssetKeys: TestimonialAssetKey[];
};

