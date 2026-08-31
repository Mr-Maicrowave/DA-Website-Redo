export type JourneyTheme = 'light' | 'dark';

export type JourneySection = {
  id: string;
  label: string;
  description?: string;
  theme?: JourneyTheme;
  longScroll?: boolean;
};

export type NormalisedJourneySection = Required<Pick<JourneySection, 'id' | 'label'>> & {
  description: string | undefined;
  theme: JourneyTheme;
  longScroll: boolean;
};

export const normaliseJourneySections = (sections: readonly JourneySection[]): NormalisedJourneySection[] => (
  sections.map((section) => ({
    id: section.id,
    label: section.label,
    description: section.description,
    theme: section.theme ?? 'light',
    longScroll: section.longScroll ?? false,
  }))
);

export const getJourneyScrollBehavior = ({
  reducedMotion,
  longScroll,
}: {
  reducedMotion: boolean;
  longScroll: boolean;
  distance: number;
}): ScrollBehavior => (reducedMotion || longScroll ? 'auto' : 'smooth');
