import type { CatalogueTutor } from '../../data/teacherCatalogue.ts';
import { profileContentFor } from '../../pages/profileContent.ts';

export const TUTOR_BOOK_PAGE_COUNT = 6 as const;
/**
 * The physical book retains all six leaves, but the reader deliberately offers
 * one turn only: the opening profile and one follow-up page. Full detail stays
 * available from the tutor profile rather than asking visitors to page through
 * a miniature book.
 */
export const TUTOR_BOOK_PAGINATED_LEAF_COUNT = 1 as const;
export const TUTOR_BOOK_READING_STATE_COUNT = TUTOR_BOOK_PAGINATED_LEAF_COUNT + 1;

export type TutorBookPageId = 'identity' | 'approach' | 'why-da' | 'goals' | 'remembered' | 'subjects';
export type TutorBookPageTurnDirection = -1 | 1;

export interface TutorBookPage {
  readonly id: TutorBookPageId;
  readonly folio: number;
  readonly label: string;
  /** Canonical tutor fields only. Labels and DA furniture are kept separate. */
  readonly sourceText: readonly string[];
}

export interface TutorBookSpread {
  readonly id: string;
  readonly pages: readonly [TutorBookPage, TutorBookPage];
}

export function createTutorBookPages(tutor: CatalogueTutor): readonly TutorBookPage[] {
  const profile = profileContentFor(tutor);
  return [
    {
      id: 'identity',
      folio: 1,
      label: 'Profile',
      sourceText: [tutor.name, tutor.designation, tutor.tagline, tutor.subjects],
    },
    {
      id: 'approach',
      folio: 2,
      label: 'Approach & strengths',
      sourceText: [tutor.motto, ...profile.strengths],
    },
    {
      id: 'why-da',
      folio: 3,
      label: 'Why DA',
      sourceText: [profile.whyDA],
    },
    {
      id: 'goals',
      folio: 4,
      label: 'Teaching goals',
      sourceText: [profile.approach],
    },
    {
      id: 'remembered',
      folio: 5,
      label: 'What students remember',
      sourceText: [profile.remembered],
    },
    {
      id: 'subjects',
      folio: 6,
      label: 'Subjects & strengths',
      sourceText: [tutor.subjects, ...profile.strengths],
    },
  ];
}

export function createTutorBookSpreads(tutor: CatalogueTutor): readonly TutorBookSpread[] {
  const pages = createTutorBookPages(tutor);
  return [
    { id: 'profile-approach', pages: [pages[0], pages[1]] },
    { id: 'why-da-goals', pages: [pages[2], pages[3]] },
    { id: 'remembered-subjects', pages: [pages[4], pages[5]] },
  ];
}

export function getPageTurnDirectionForKey(key: string): TutorBookPageTurnDirection | undefined {
  if (key === 'ArrowLeft' || key === 'PageUp') return -1;
  if (key === 'ArrowRight' || key === 'PageDown') return 1;
  return undefined;
}

export function getPageTurnDirectionForSwipe(deltaX: number, deltaY: number): TutorBookPageTurnDirection | undefined {
  if (Math.abs(deltaX) < 48 || Math.abs(deltaX) <= Math.abs(deltaY)) return undefined;
  return deltaX < 0 ? 1 : -1;
}

export function getTutorBookPageTarget(
  settledPages: number,
  direction: TutorBookPageTurnDirection,
  maximumSettledPages: number = TUTOR_BOOK_PAGINATED_LEAF_COUNT,
): number | undefined {
  const current = Math.max(0, Math.min(maximumSettledPages, Math.trunc(settledPages)));
  const target = current + direction;
  return target >= 0 && target <= maximumSettledPages ? target : undefined;
}

export function advanceTutorBookPageTurn(current: number, deltaSeconds: number, durationMs: number) {
  const progress = Number.isFinite(current) ? Math.max(0, Math.min(1, current)) : 0;
  if (!Number.isFinite(deltaSeconds) || deltaSeconds <= 0) return progress;
  if (!Number.isFinite(durationMs) || durationMs <= 0) return 1;
  return Math.min(1, progress + deltaSeconds / (durationMs / 1000));
}
