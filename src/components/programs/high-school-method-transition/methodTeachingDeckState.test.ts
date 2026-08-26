import assert from 'node:assert/strict';
import test from 'node:test';
import { methodItems, type MethodId } from './methodTransitionData.ts';
import { getAdjacentMethodId, getInactiveMethods } from './methodTeachingDeckState.ts';

test('inactive methods preserve canonical order', () => {
  assert.deepEqual(getInactiveMethods('practise'), ['diagnose', 'explain', 'apply', 'review']);
});

test('navigation wraps', () => {
  assert.equal(getAdjacentMethodId('review', 1), 'diagnose');
  assert.equal(getAdjacentMethodId('diagnose', -1), 'review');
});

const getMethod = (id: MethodId) => {
  const method = methodItems.find((item) => item.id === id);
  assert.ok(method, `expected ${id} method content`);
  return method;
};

test('diagnose retains its approved editorial copy', () => {
  const method = getMethod('diagnose');
  assert.equal(method.emotionalSubheading, 'We pay attention first.');
  assert.deepEqual(method.introduction, [
    'Before we teach more, we take the time to understand the student as they are right now.',
    'We look at what they already know, where understanding starts to break down, and what may be holding them back.',
  ]);
  assert.deepEqual(method.actions[2], {
    title: 'Review work and mistakes',
    body: 'We look through previous work to understand recurring patterns, not just individual marks.',
    annotation: 'patterns tell the story',
  });
  assert.deepEqual(method.closingLines, ['Every student is different.', 'So we start differently.']);
});

test('explain retains its approved editorial copy', () => {
  const method = getMethod('explain');
  assert.equal(method.emotionalSubheading, 'We find the explanation that clicks.');
  assert.deepEqual(method.introduction, [
    'If a student doesn’t understand something the first way, we don’t simply repeat the same explanation.',
    'We slow down, change the example, approach the idea differently and keep working until it makes sense.',
  ]);
  assert.deepEqual(method.actions[3], {
    title: 'Check understanding as we go',
    body: 'We don’t assume a nod means understanding.',
    annotation: 'does it really click?',
  });
  assert.deepEqual(method.closingLines, ['The explanation can change.', 'The goal stays the same: understanding.']);
});

test('practise retains its approved editorial copy', () => {
  const method = getMethod('practise');
  assert.equal(method.emotionalSubheading, 'We stay with it.');
  assert.deepEqual(method.introduction, [
    'Understanding something once is only the beginning.',
    'We help students practise at the right level, correct mistakes as they happen and gradually build the accuracy and confidence to work independently.',
  ]);
  assert.deepEqual(method.actions[3], {
    title: 'Gradually remove support',
    body: 'As confidence grows, the student takes over.',
    annotation: 'now try it yourself',
  });
  assert.deepEqual(method.closingLines, ['Practice should build independence,', 'not dependence.']);
});

test('apply retains its approved editorial copy', () => {
  const method = getMethod('apply');
  assert.equal(method.emotionalSubheading, 'We make sure they can do it themselves.');
  assert.deepEqual(method.introduction, [
    'Knowing how to follow an example is not the same as knowing how to solve a new problem.',
    'We help students transfer their skills into unfamiliar questions, assessments and exam-style tasks.',
  ]);
  assert.deepEqual(method.actions[3], {
    title: 'Encourage independent decisions',
    body: 'Students learn when and how to use a method without being prompted.',
    annotation: 'you choose the approach',
  });
  assert.deepEqual(method.closingLines, ['The goal is not remembering the example.', 'It is knowing what to do next.']);
});

test('review retains its approved editorial copy', () => {
  const method = getMethod('review');
  assert.equal(method.emotionalSubheading, 'We notice what happens next.');
  assert.deepEqual(method.introduction, [
    'We don’t treat a lesson as finished simply because the hour is over.',
    'We look back at mistakes, corrections and progress to understand what should be revisited and what the student is ready for next.',
  ]);
  assert.deepEqual(method.actions[2], {
    title: 'Recognise improvement',
    body: 'Progress should be noticed, not just problems.',
    annotation: 'look how far you’ve come',
  });
  assert.deepEqual(method.closingLines, ['The pace changes.', 'The explanation changes.', 'The goal doesn’t:', 'genuine understanding.']);
});
