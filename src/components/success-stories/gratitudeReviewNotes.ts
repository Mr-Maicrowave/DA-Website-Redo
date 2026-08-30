export type GratitudeReviewNote = {
  author: string;
  initial: string;
  quote: string;
  tone: 'gold' | 'coral' | 'sage' | 'blue' | 'lavender';
  mobile: boolean;
};

export const gratitudeReviewNotes: readonly GratitudeReviewNote[] = [
  { author: 'Lisa Vu', initial: 'L', quote: 'I am now looking forward to a bright future', tone: 'gold', mobile: true },
  { author: 'Chau Ho', initial: 'C', quote: 'My English has improved significantly', tone: 'sage', mobile: true },
  { author: 'Florence Nguyen', initial: 'F', quote: 'it’s helped raise my grades tremendously !!', tone: 'coral', mobile: false },
  { author: 'Khushleen Kaur', initial: 'K', quote: 'I went from a 60% in math to a 97%.', tone: 'blue', mobile: true },
  { author: 'Harry Kha', initial: 'H', quote: 'They always had my back whenever I needed them', tone: 'lavender', mobile: false },
  { author: 'Charlie Kien', initial: 'C', quote: 'They have made me believe in myself', tone: 'sage', mobile: true },
  { author: 'Jessica La', initial: 'J', quote: 'My marks went from low to the top of the class.', tone: 'blue', mobile: true },
  { author: 'Jenny Nguyen', initial: 'J', quote: 'I like da because we can learn and teacher is so kind.', tone: 'coral', mobile: true },
] as const;
