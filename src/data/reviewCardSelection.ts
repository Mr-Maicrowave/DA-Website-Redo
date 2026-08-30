export type ReviewChartEntry = {
  id: string;
  author: string;
  rating: number;
  text: string;
};

export type ReviewCardData = {
  id: string;
  review: string;
  name: string;
  role: string;
  rating: number;
};

const selectedReviewIds = [
  'review-359', 'review-089', 'review-108', 'review-262', 'review-246', 'review-079',
  'review-278', 'review-240', 'review-202', 'review-342', 'review-352', 'review-386',
  'review-069', 'review-034', 'review-194', 'review-217', 'review-042', 'review-378',
  'review-033', 'review-147', 'review-039', 'review-344', 'review-213', 'review-349',
] as const;

const reviewExcerpt = (text: string, maxLength = 210) => {
  const trimmed = text.trim();
  if (trimmed.length <= maxLength) return trimmed;

  const shortened = trimmed.slice(0, maxLength).replace(/\s+\S*$/, '').trim();
  return `${shortened}…`;
};

export const selectSuccessStoryReviewCards = (reviews: ReviewChartEntry[]): ReviewCardData[] => {
  const reviewsById = new Map(reviews.map((review) => [review.id, review]));

  return selectedReviewIds.flatMap((id) => {
    const source = reviewsById.get(id);
    if (!source) return [];

    return [{
      id: `google-${source.id}`,
      review: reviewExcerpt(source.text),
      name: source.author,
      role: 'Google reviewer',
      rating: source.rating,
    }];
  });
};
