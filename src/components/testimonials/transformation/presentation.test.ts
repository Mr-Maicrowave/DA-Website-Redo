import assert from 'node:assert/strict';
import test from 'node:test';
import { testimonials } from '../../../data/testimonials.ts';
import { getTestimonialPresentation } from './presentation.ts';

test('presentation is deterministic and covers every original paragraph once', () => {
  for (const [index, testimonial] of testimonials.entries()) {
    const first = getTestimonialPresentation(testimonial, index);
    const second = getTestimonialPresentation(testimonial, index);
    assert.deepEqual(first.palette, second.palette);
    assert.deepEqual(first.phases.flatMap((phase) => phase.paragraphIndexes), testimonial.bodyParagraphs.map((_, paragraphIndex) => paragraphIndex));
  }
});

test('fallback stories do not receive fabricated achievements', () => {
  const principal = testimonials.find((testimonial) => testimonial.slug === 'message-of-gratitude-from-the-principal');
  assert.ok(principal);
  assert.deepEqual(getTestimonialPresentation(principal, 0).achievements, []);
});

test('impacts are adapted only from existing structured callouts', () => {
  const testimonial = testimonials[4];
  const presentation = getTestimonialPresentation(testimonial, 4);
  assert.equal(presentation.impacts.length, testimonial.calloutBoxes.length);
  assert.deepEqual(presentation.impacts.map((impact) => impact.statement), testimonial.calloutBoxes.map((callout) => callout.content));
});
