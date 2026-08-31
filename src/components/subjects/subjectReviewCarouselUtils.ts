export type ReviewPosition = 'previous' | 'active' | 'next' | 'off-left' | 'off-right';

export function getReviewPosition(index: number, activeIndex: number, total: number): ReviewPosition {
  const normalize = (value: number) => (value + total) % total;

  if (index === activeIndex) return 'active';
  if (index === normalize(activeIndex - 1)) return 'previous';
  if (index === normalize(activeIndex + 1)) return 'next';

  const forwardDistance = normalize(index - activeIndex);
  return forwardDistance < total / 2 ? 'off-right' : 'off-left';
}

export function getReviewPreview(quote: string, maxCharacters: number): string {
  const normalized = quote.replace(/\s+/g, ' ').trim();
  if (normalized.length <= maxCharacters) return normalized;

  const candidate = normalized.slice(0, maxCharacters + 1);
  const sentenceMatches = [...candidate.matchAll(/[.!?](?=\s|$)/g)];
  const sentenceEnd = sentenceMatches.at(-1)?.index;

  if (sentenceEnd !== undefined && sentenceEnd + 1 >= maxCharacters * .55) {
    return candidate.slice(0, sentenceEnd + 1).trim();
  }

  const wordEnd = candidate.lastIndexOf(' ', maxCharacters);
  return `${candidate.slice(0, wordEnd > 0 ? wordEnd : maxCharacters).trimEnd()}…`;
}
