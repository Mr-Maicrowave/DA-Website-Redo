import { googleReviews } from './googleReviews';

export type ReviewCardData = {
  id: string;
  review: string;
  name: string;
  role: string;
  rating: number;
};

const reviewExcerpt = (text: string, maxLength = 210) => {
  const firstSentences = text.match(/[^.!?]+[.!?]+/g)?.slice(0, 2).join(' ').trim() ?? text;

  if (firstSentences.length <= maxLength) return firstSentences;

  const shortened = firstSentences.slice(0, maxLength).replace(/\s+\S*$/, '').trim();
  return `${shortened}…`;
};

const reviewFingerprint = (author: string, text: string) => `${author.trim().toLowerCase()}\u0000${text.trim().toLowerCase()}`;

const shortHash = (value: string) => {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
};

const toReviewId = (name: string, text: string) => {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  return `google-review-${slug}-${shortHash(reviewFingerprint(name, text))}`;
};

const uniqueGoogleReviews = googleReviews.filter((review, index, reviews) => {
  const fingerprint = reviewFingerprint(review.author, review.text);
  return reviews.findIndex((candidate) => reviewFingerprint(candidate.author, candidate.text) === fingerprint) === index;
});

// These entries are derived from the existing Google review source so the
// preview never substitutes invented testimonials or unverified roles.
export const successStoryReviewCards: ReviewCardData[] = uniqueGoogleReviews
  .slice(0, 8)
  .map((review) => ({
    id: toReviewId(review.author, review.text),
    review: reviewExcerpt(review.text),
    name: review.author,
    role: 'Google reviewer',
    rating: review.rating,
  }));
