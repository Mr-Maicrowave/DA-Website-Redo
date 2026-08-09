import { HERO_CHAPTERS, type HeroChapter } from '@/data/heroChapters';

export type BookPageTemplate =
  | 'statement'
  | 'feature'
  | 'journey'
  | 'story'
  | 'trust'
  | 'closing';

const BOOK_PAGE_TEMPLATE_BY_ID = {
  welcome: 'statement',
  philosophy: 'statement',
  journey: 'trust',
  programs: 'feature',
  subjects: 'feature',
  environment: 'statement',
  guides: 'feature',
  stories: 'story',
  contact: 'closing',
} as const satisfies Record<(typeof HERO_CHAPTERS)[number]['id'], BookPageTemplate>;

export type BookPageDefinition = {
  id: HeroChapter['id'];
  pageNumber: number;
  sourceKey: HeroChapter['id'];
  source: HeroChapter;
  target: `#${string}`;
  image: HeroChapter['image'];
  navigationTabLabel: HeroChapter['chapterLabel'];
  template: BookPageTemplate;
  theme?: string;
};

/**
 * Presentation-only book metadata derived from the existing homepage summaries.
 * Written content and CTA definitions remain owned by HERO_CHAPTERS.
 */
export const BOOK_PAGE_DEFINITIONS: readonly BookPageDefinition[] = HERO_CHAPTERS.map(
  (source, index) => ({
    id: source.id,
    pageNumber: index + 1,
    sourceKey: source.id,
    source,
    target: `#${source.targetSectionId}`,
    image: source.image,
    navigationTabLabel: source.chapterLabel,
    template: BOOK_PAGE_TEMPLATE_BY_ID[source.id],
  }),
);

export const getBookPageDefinition = (id: HeroChapter['id']) =>
  BOOK_PAGE_DEFINITIONS.find(page => page.id === id);
