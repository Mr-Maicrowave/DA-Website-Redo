import reviewChart from './reviews.json';
import { selectSuccessStoryReviewCards, type ReviewChartEntry } from './reviewCardSelection';

export type { ReviewCardData } from './reviewCardSelection';

export const successStoryReviewCards = selectSuccessStoryReviewCards(
  reviewChart.reviews as ReviewChartEntry[],
);
