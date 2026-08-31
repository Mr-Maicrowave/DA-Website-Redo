export type ReviewAchievement = {
  before: string;
  after: string;
  strength: number;
};

const clean = (value: string) => value.replace(/\s+/g, ' ').trim();

export function extractReviewAchievement(testimonial: string): ReviewAchievement {
  const text = clean(testimonial);

  const rankTransition = text.match(
    /\b(?:jumped|moved|went|rose|climbed|progressed)?\s*(?:up\s+)?from\s+(?:being\s+)?(?:rank(?:ed|ing)?\s*)?(\d{1,3}(?:st|nd|rd|th))(?:\s+place)?\s+to\s+(?:being\s+)?(?:rank(?:ed|ing)?\s*)?(\d{1,3}(?:st|nd|rd|th))(?:\s+place)?\b/i,
  );
  if (rankTransition) {
    return { before: rankTransition[1], after: rankTransition[2], strength: 30 };
  }

  const percent =
    text.match(/\b(?:achieved|scored|received|got|earned|attained)\s+(?:a\s+)?(?:mark\s+of\s+)?(100%|9[0-9]%)\b/i)?.[1]
    ?? text.match(/\b(?:mark|result|score)\s+(?:of|was)\s+(100%|9[0-9]%)\b/i)?.[1]
    ?? text.match(/\b(100%|9[0-9]%)\s+(?:on|in|for)\s+(?:my|the|an?|one)\b/i)?.[1];

  const contextualRank =
    text.match(/\b(?:came|ranked|placed|finished|secured|achieved|became|becoming)\s+(?:the\s+)?(?:first|second|third|1st|2nd|3rd)(?:\s+place)?(?:\s+(?:in|out of|across)\s+[^,.!;]{1,32})?/i)?.[0]
    ?? text.match(/\b((?:first|second|third|1st|2nd|3rd)\s+place(?:\s+ranking(?:\s+(?:in|out of|across)\s+[^,.!;]{1,32})?|\s+(?:in|out of|across)\s+[^,.!;]{1,32}))/i)?.[1]
    ?? text.match(/\b((?:\d{1,3})(?:st|nd|rd|th)\s+(?:in|out of)\s+[^,.!;]{1,32})/i)?.[1]
    ?? text.match(/\b(top\s+\d{1,3}(?:\s+(?:in|out of)\s+[^,.!;]{1,32})?)/i)?.[1];

  const band = text.match(/\b(?:achieved|received|earned|got)\s+(?:a\s+)?(Band\s*[56])\b/i)?.[1]
    ?? text.match(/\b(highest bands?\s+in\s+[^,.!;]{1,40})/i)?.[1];

  const after = [percent, contextualRank, band].filter(Boolean).slice(0, 2).join(' · ');
  if (after) return { before: 'Before tuition', after, strength: (percent ? 20 : 0) + (contextualRank ? 18 : 0) + (band ? 16 : 0) };

  if (/\b(improv(?:e|ed|ement|ing)|boost(?:ed)?|progress(?:ed)?|higher marks|better marks)\b/i.test(text)) {
    return { before: 'Starting point', after: 'Documented improvement', strength: 6 };
  }

  return { before: 'Student experience', after: 'Strong DA recommendation', strength: 0 };
}
