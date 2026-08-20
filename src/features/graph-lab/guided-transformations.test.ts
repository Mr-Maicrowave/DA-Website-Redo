import test from 'node:test';
import assert from 'node:assert/strict';
import {
  GUIDED_STORAGE_KEY,
  GUIDED_SELECT_PLACEHOLDER,
  TRANSFORMATION_JOURNEY,
  evaluateExplanation,
  evaluatePrediction,
  hasReachedExperimentTarget,
  readGuidedState,
  summariseMastery,
  writeGuidedState,
  type GuidedProgress,
  type StorageLike,
} from './guided-transformations.ts';

test('orders the seven transformation challenges from quadratic foundations to sine language', () => {
  assert.deepEqual(
    TRANSFORMATION_JOURNEY.map((step) => step.id),
    ['parent', 'vertical-shift', 'dilation-reflection', 'horizontal-shift', 'combined', 'absolute-transfer', 'sine-bridge'],
  );
  assert.equal(TRANSFORMATION_JOURNEY.at(-1)?.familyId, 'sine');
});

test('every slider activity shows a target equation to reproduce', () => {
  const sliderSteps = TRANSFORMATION_JOURNEY.filter((step) => step.unlockedParameters.length > 0);
  assert.equal(sliderSteps.length, 6);
  assert.equal(sliderSteps.every((step) => Boolean(step.targetLatex)), true);
  assert.equal(TRANSFORMATION_JOURNEY.at(-1)?.targetLatex, 'y=2\\sin(2(x-1))+1');
});

test('combined and transfer challenges include an explanation stage', () => {
  for (const id of ['combined', 'absolute-transfer']) {
    const step = TRANSFORMATION_JOURNEY.find((candidate) => candidate.id === id)!;
    assert.ok(step.explanationFields && step.explanationFields.length >= 2);
  }
});

test('the explanation select placeholder fits the narrow guided panel', () => {
  assert.equal(GUIDED_SELECT_PLACEHOLDER, 'Choose an answer');
  assert.ok(GUIDED_SELECT_PLACEHOLDER.length <= 16);
});

test('gives one targeted retry before revealing the worked explanation', () => {
  const step = TRANSFORMATION_JOURNEY[1];
  assert.deepEqual(evaluatePrediction(step, 'wrong-answer', 0), {
    correct: false,
    nextPhase: 'predict',
    attempts: 1,
    message: step.hint,
  });
  assert.deepEqual(evaluatePrediction(step, 'wrong-answer', 1), {
    correct: false,
    nextPhase: 'experiment',
    attempts: 2,
    message: step.workedExplanation,
  });
  assert.equal(evaluatePrediction(step, step.correctPredictionId, 0).correct, true);
});

test('marks a structured explanation only when every selected clause is correct', () => {
  const step = TRANSFORMATION_JOURNEY.find((candidate) => candidate.id === 'horizontal-shift')!;
  assert.equal(evaluateExplanation(step, { direction: 'right', cause: 'inside-subtraction' }), true);
  assert.equal(evaluateExplanation(step, { direction: 'left', cause: 'inside-subtraction' }), false);
  assert.equal(evaluateExplanation(step, { direction: 'right' }), false);
});

test('requires the unlocked parameters to reach the experiment target', () => {
  const parent = TRANSFORMATION_JOURNEY[0];
  const verticalShift = TRANSFORMATION_JOURNEY[1];
  const baseValues = { a: 1, b: 1, c: 0, d: 0, h: 0, k: 0, r: 4 };

  assert.equal(hasReachedExperimentTarget(parent, baseValues), true);
  assert.equal(hasReachedExperimentTarget(verticalShift, baseValues), false);
  assert.equal(hasReachedExperimentTarget(verticalShift, { ...baseValues, d: 3 }), true);
});

test('summarises concepts as secure, developing or revisit without a percentage', () => {
  const results: GuidedProgress['results'] = {
    parent: { attempts: 1, predictionCorrect: true },
    'vertical-shift': { attempts: 1, predictionCorrect: true, explanationCorrect: true },
    'dilation-reflection': { attempts: 2, predictionCorrect: true, explanationCorrect: true },
    'horizontal-shift': { attempts: 2, predictionCorrect: false, explanationCorrect: false },
  };
  const summary = summariseMastery(results);
  assert.equal(summary.find((item) => item.id === 'vertical-translation')?.status, 'secure');
  assert.equal(summary.find((item) => item.id === 'dilation-reflection')?.status, 'developing');
  assert.equal(summary.find((item) => item.id === 'horizontal-translation')?.status, 'revisit');
  assert.equal('percentage' in summary[0], false);
});

test('persists a versioned state and falls back safely when storage is malformed', () => {
  const values = new Map<string, string>();
  const storage: StorageLike = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => { values.set(key, value); },
  };
  const progress: GuidedProgress = {
    version: 1,
    hasChosenMode: true,
    lastMode: 'guided',
    stepIndex: 3,
    completed: false,
    results: {},
  };
  writeGuidedState(storage, progress);
  assert.deepEqual(readGuidedState(storage), progress);
  values.set(GUIDED_STORAGE_KEY, '{broken');
  assert.equal(readGuidedState(storage), null);
  values.set(GUIDED_STORAGE_KEY, JSON.stringify({ ...progress, version: 99 }));
  assert.equal(readGuidedState(storage), null);
});
