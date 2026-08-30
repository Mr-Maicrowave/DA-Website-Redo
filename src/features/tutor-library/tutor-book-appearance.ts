const TUTOR_BOOK_CLOTH_COLOURS = ['#203a57', '#6a3035', '#63462c', '#25465a', '#36533d', '#4f345c', '#6d4a2e', '#31535a', '#4d5663', '#743f2c'] as const;

export function getTutorBookClothColour(materialVariant: number) {
  const index = ((materialVariant % TUTOR_BOOK_CLOTH_COLOURS.length) + TUTOR_BOOK_CLOTH_COLOURS.length) % TUTOR_BOOK_CLOTH_COLOURS.length;
  return TUTOR_BOOK_CLOTH_COLOURS[index];
}
