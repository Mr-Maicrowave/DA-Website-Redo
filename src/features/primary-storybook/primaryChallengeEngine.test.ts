import test from 'node:test';
import assert from 'node:assert/strict';
import { primaryQuestionBank } from './primaryQuestionBank.ts';
import {
  createChallenge,
  createInitialLearningState,
  reduceLearningState,
  shuffleQuestionOptions,
  type LearningState,
  type RecentQuestionStore,
} from './primaryChallengeEngine.ts';

const sequenceRandom = (...values: number[]) => {
  let index = 0;
  return () => values[index++ % values.length];
};

test('every year and subject exposes at least thirty structured questions', () => {
  for (let year = 1; year <= 6; year += 1) {
    const level = primaryQuestionBank[year as keyof typeof primaryQuestionBank];
    for (const subject of ['maths', 'english'] as const) {
      assert.equal(level[subject].length >= 30, true, `Year ${year} ${subject}`);
      assert.equal(new Set(level[subject].map((question) => question.id)).size, level[subject].length);
      for (const question of level[subject]) {
        assert.ok(question.topic);
        assert.ok(question.subtopic);
        assert.ok(question.explanation.steps.length >= 2);
        assert.ok(question.followUp.options.includes(question.followUp.correctAnswer));
      }
    }
  }
});

test('challenge generation returns six unique, difficulty-shaped, topic-varied questions', () => {
  const challenge = createChallenge({
    year: 4,
    subject: 'maths',
    random: sequenceRandom(.13, .72, .41, .96, .28),
  });

  assert.equal(challenge.length, 6);
  assert.deepEqual(challenge.map((question) => question.difficulty), [1, 2, 2, 3, 4, 5]);
  assert.equal(new Set(challenge.map((question) => question.id)).size, 6);
  assert.equal(new Set(challenge.map((question) => question.topic)).size >= 4, true);
});

test('recently seen questions are avoided when enough unseen questions remain', () => {
  const recentIds = primaryQuestionBank[3].english.slice(0, 18).map((question) => question.id);
  const memory: string[] = [...recentIds];
  const store: RecentQuestionStore = {
    read: () => memory,
    write: (ids) => memory.splice(0, memory.length, ...ids),
  };

  const challenge = createChallenge({ year: 3, subject: 'english', store, random: () => .1 });

  assert.equal(challenge.some((question) => recentIds.includes(question.id)), false);
  assert.equal(memory.slice(-6).every((id) => challenge.some((question) => question.id === id)), true);
});

test('answer shuffling never mutates the authored question', () => {
  const authored = primaryQuestionBank[2].maths[0];
  const originalOptions = [...authored.options];
  const shuffled = shuffleQuestionOptions(authored, sequenceRandom(.8, .1, .6, .2));

  assert.deepEqual(authored.options, originalOptions);
  assert.notEqual(shuffled.options, authored.options);
  assert.deepEqual([...shuffled.options].sort(), [...authored.options].sort());
  assert.equal(shuffled.options.includes(shuffled.correctAnswer), true);
});

test('an incorrect answer enters teaching, then follow-up understanding earns growth', () => {
  const question = primaryQuestionBank[3].maths[0];
  let state = createInitialLearningState();

  state = reduceLearningState(state, { type: 'answer', answer: '10', question });
  assert.equal(state.mode, 'teaching');
  assert.equal(state.explanationStep, 0);

  state = reduceLearningState(state, { type: 'show-next-step', question });
  state = reduceLearningState(state, { type: 'show-next-step', question });
  assert.equal(state.explanationStep, 2);

  state = reduceLearningState(state, { type: 'begin-follow-up', question });
  assert.equal(state.mode, 'follow-up');

  state = reduceLearningState(state, { type: 'answer-follow-up', answer: question.followUp.correctAnswer, question });
  assert.equal(state.mode, 'ready-to-grow');
});

test('a second follow-up mistake reveals the answer and permits progression', () => {
  const question = primaryQuestionBank[3].english[0];
  let state: LearningState = { ...createInitialLearningState(), mode: 'follow-up' };

  state = reduceLearningState(state, { type: 'answer-follow-up', answer: 'wrong-one', question });
  assert.equal(state.mode, 'follow-up-support');
  state = reduceLearningState(state, { type: 'answer-follow-up', answer: 'wrong-two', question });
  assert.equal(state.mode, 'ready-to-grow');
  assert.equal(state.revealedAnswer, question.followUp.correctAnswer);
});
