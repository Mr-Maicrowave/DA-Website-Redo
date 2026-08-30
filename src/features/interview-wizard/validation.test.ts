import test from 'node:test';
import assert from 'node:assert/strict';
import { createInitialInterviewData } from './model.ts';
import { isValidAustralianMobile, validateStep } from './validation.ts';

test('step one requires contact and student basics only', () => {
  const errors = validateStep(1, createInitialInterviewData('start'));
  assert.deepEqual(
    Object.keys(errors).sort(),
    ['email', 'mobile', 'parentFirstName', 'parentLastName', 'schoolYear', 'studentFirstName'],
  );
});

test('accepts common Australian mobile formatting', () => {
  assert.equal(isValidAustralianMobile('0412 345 678'), true);
  assert.equal(isValidAustralianMobile('+61 412 345 678'), true);
  assert.equal(isValidAustralianMobile('02 1234 5678'), false);
});

test('step two requires at least one subject', () => {
  assert.deepEqual(validateStep(2, createInitialInterviewData('start')), {
    subjects: 'Please select at least one subject.',
  });
});

test('step three requires only a current situation', () => {
  assert.deepEqual(validateStep(3, createInitialInterviewData('start')), {
    currentSituations: 'Please tell us a little about their current situation.',
  });
});

test('step four accepts narrative notes instead of choices', () => {
  const data = {
    ...createInitialInterviewData('start'),
    parentConcernNotes: 'Marks dropped',
    goalNotes: 'Regain confidence',
  };
  assert.deepEqual(validateStep(4, data), {});
});

test('step five and review remain optional', () => {
  const data = createInitialInterviewData('start');
  assert.deepEqual(validateStep(5, data), {});
  assert.deepEqual(validateStep(6, data), {});
});
