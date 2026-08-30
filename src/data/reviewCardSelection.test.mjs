import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { selectSuccessStoryReviewCards } from './reviewCardSelection.ts';

const reviewChart = JSON.parse(await readFile(new URL('./reviews.json', import.meta.url), 'utf8')).reviews;
const normalize = (text) => text.replace(/\s+/g, ' ').trim();

const reviewersUsedElsewhere = new Set([
  'ngoc pham', 'emily tran', 'andrew', 'anthony nguyen', 'fif ian', 'danny trinh', 'aabid degia', 'tu nguyen', 'dinhdung ly', 'jayden nguyen',
  'katelin trinh', 'emily nguyen', 'melissa ly', 'bryant lam', 'joie lim',
  'lisa vu', 'chau ho', 'florence nguyen', 'khushleen kaur', 'harry kha', 'charlie kien',
  'jenny’s cakery', 'ms amanda', 'a grateful da parent', 'parent google review', 'angelina nguyen', 'damien do', 'christine phung', 'diana el safadi', 'ruby nguyen', 'ellie dang', 'madison eung', 'kassandra bulaong', 'ryan ly', 'marcus nguyen', 'jamine nguyen', 'emma thomas', 'nhem ottara', 'joshua ung', 'rosalind bui', 'selene dixon', 'khoa nguyen', 'elaine nguyen', 'ryan tchan', 'christina van', 'teresa pham', 'jad karaki', 'lauren pham', 'helen au', 'joyce nguyen', 'khushi kaur', 'jacob danh', 'milith dheerasekara', 'sasha cio', 'jocelyn huynh',
]);

test('selects more than 20 unique verified reviews unused by other Success Stories sections', () => {
  const cards = selectSuccessStoryReviewCards(reviewChart);
  const names = cards.map((card) => card.name.trim().toLowerCase());

  assert.ok(cards.length > 20, `expected more than 20 cards, received ${cards.length}`);
  assert.equal(new Set(cards.map((card) => card.id)).size, cards.length, 'review ids are unique');
  assert.equal(new Set(names).size, cards.length, 'reviewer names are unique');
  assert.ok(names.every((name) => !reviewersUsedElsewhere.has(name)), 'carousel reviewers do not appear in other sections');

  for (const card of cards) {
    const source = reviewChart.find((review) => `google-${review.id}` === card.id);
    assert.ok(source, `${card.id} exists in the review chart`);
    assert.ok(normalize(source.text).includes(normalize(card.review.replace(/…$/, ''))), `${card.id} uses verified review wording`);
  }
});
