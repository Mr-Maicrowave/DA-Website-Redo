import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const source = readFileSync(new URL('./HSCWhyYearsMatter.tsx', import.meta.url), 'utf8');
const styles = readFileSync(new URL('./HSCWhyYearsMatter.css', import.meta.url), 'utf8');

test('includes the complete editorial story and all four explanations', () => {
  for (const phrase of [
    'The final two years',
    'navigate it alone.',
    'EVERY MARK',
    'THE RIGHT',
    'KNOWING IT',
    'THEY NEED TO',
    'Every internal assessment contributes',
    'Scaling, workload, strengths and future goals',
    'Strong knowledge does not always translate',
    'Year 12 is a marathon',
    'PRIVATE TUITION',
    'SMALL GROUP CLASSES',
    'HSC PREPARATION',
    'TRIAL PREPARATION',
    'THERE’S NO ONE WAY',
    'Different students need',
    'Focused on them.',
    'Learn together.',
    'Build depth.',
    'Sharpen skills.',
    'The question isn’t which option is best.',
    'It’s which one fits them.',
  ]) assert.match(source, new RegExp(phrase));
});

test('uses the generated editorial asset pack', () => {
  for (const asset of ['assessment-card-complete.png', 'subject-stack-complete.png', 'feedback-papers-transparent.png', 'year-journey-timeline-no-flowers.png']) {
    assert.match(source, new RegExp(asset.replace('.', '\\.')));
  }
  assert.doesNotMatch(source, /feedback-papers\.webp/);
  assert.doesNotMatch(source, /feedback-papers-v2\.png/);
  assert.doesNotMatch(source, /hsc-answer-sheet|hsc-feedback-note|hsc-feedback-pen/);
  assert.doesNotMatch(source, /year-journey-timeline-complete\.png/);
});

test('uses the pathway artwork without a section-specific background', () => {
  assert.match(source, /hsc-support-pathways\.png/);
  assert.doesNotMatch(styles, /hsc-support-meadow\.png/);
  assert.equal((source.match(/className="hsc-support-option"/g) ?? []).length, 1);
  assert.doesNotMatch(source, /So we don’t teach every|LEARN MORE/);
});

test('mounts the shared learning-formats explorer in place of the private-only panel', () => {
  assert.match(source, /<HSCLearningFormatsExplorer \/>/);
  assert.match(source, /<HSCCompleteStrategy \/>/);
  assert.match(source, /<HSCMethodInAction \/>/);
  assert.match(source, /<HSCSuccessStories \/>/);
  assert.doesNotMatch(source, /hsc-private-layout|private-tuition-best-for-paper|private-tuition-personalised-note/);
});

test('places the complete HSC strategy after the learning-formats explorer', () => {
  const explorerIndex = source.indexOf('<HSCLearningFormatsExplorer />');
  const strategyIndex = source.indexOf('<HSCCompleteStrategy />');
  assert.ok(explorerIndex >= 0 && strategyIndex > explorerIndex);
});

test('places the DA method section after the complete strategy', () => {
  const strategyIndex = source.indexOf('<HSCCompleteStrategy />');
  const methodIndex = source.indexOf('<HSCMethodInAction />');
  assert.ok(strategyIndex >= 0 && methodIndex > strategyIndex);
});

test('places success stories after the DA method section', () => {
  const methodIndex = source.indexOf('<HSCMethodInAction />');
  const storiesIndex = source.indexOf('<HSCSuccessStories />');
  assert.ok(methodIndex >= 0 && storiesIndex > methodIndex);
});

test('reveals all four editorial explanations without click controls', () => {
  assert.equal((source.match(/<EditorialExplanation lead=/g) ?? []).length, 4);
  assert.doesNotMatch(source, /Why this matters|aria-expanded=|<button/);
  assert.match(source, /useReducedMotion/);
});
