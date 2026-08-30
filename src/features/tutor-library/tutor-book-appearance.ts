export interface TutorBookCoverTheme {
  cloth: string;
  foil: string;
  accent: string;
}

const TUTOR_BOOK_COVER_THEMES: readonly TutorBookCoverTheme[] = [
  { cloth: '#315775', foil: '#d5b369', accent: '#d9c698' },
  { cloth: '#7a454c', foil: '#d8ad68', accent: '#e2c39c' },
  { cloth: '#76563a', foil: '#c9a66a', accent: '#dec6a2' },
  { cloth: '#366378', foil: '#c6ad73', accent: '#d7c8a6' },
  { cloth: '#486b4d', foil: '#cdb66f', accent: '#d9cda0' },
  { cloth: '#654676', foil: '#d3ae75', accent: '#dec6a8' },
  { cloth: '#805b3c', foil: '#c6a568', accent: '#ddc7a5' },
  { cloth: '#3c6d74', foil: '#c3b071', accent: '#d4cab0' },
  { cloth: '#65717d', foil: '#d1bc80', accent: '#ddd2b4' },
  { cloth: '#8a523c', foil: '#d5ad6d', accent: '#e1c39e' },
] as const;

export function getTutorBookClothColour(materialVariant: number) {
  return getTutorBookCoverTheme(materialVariant).cloth;
}

/**
 * A book's edition owns its palette. Keeping this independent of wall/subject
 * lets one coherent collection use several restrained academic cloth colours.
 */
export function getTutorBookCoverTheme(materialVariant: number): TutorBookCoverTheme {
  const index = ((materialVariant % TUTOR_BOOK_COVER_THEMES.length) + TUTOR_BOOK_COVER_THEMES.length) % TUTOR_BOOK_COVER_THEMES.length;
  return TUTOR_BOOK_COVER_THEMES[index]!;
}
