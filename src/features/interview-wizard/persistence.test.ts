import test from 'node:test';
import assert from 'node:assert/strict';
import { createInitialInterviewData } from './model.ts';
import {
  clearInterviewSession,
  restoreInterviewSession,
  saveInterviewSession,
  STORAGE_KEY,
} from './persistence.ts';

class MemoryStorage {
  private values = new Map<string, string>();
  getItem(key: string) { return this.values.get(key) ?? null; }
  setItem(key: string, value: string) { this.values.set(key, value); }
  removeItem(key: string) { this.values.delete(key); }
}

test('saves and restores versioned progress including startedAt', () => {
  const storage = new MemoryStorage();
  const data = { ...createInitialInterviewData('original-start'), schoolYear: 8, subjects: ['english'] };
  saveInterviewSession(storage, { version: 1, currentStep: 3, data });
  const restored = restoreInterviewSession(storage, 'fallback-start');
  assert.equal(restored.currentStep, 3);
  assert.equal(restored.data.startedAt, 'original-start');
  assert.deepEqual(restored.data.subjects, ['english']);
});

test('ignores invalid JSON and incompatible versions', () => {
  const storage = new MemoryStorage();
  storage.setItem(STORAGE_KEY, '{broken');
  assert.equal(restoreInterviewSession(storage, 'fresh').data.startedAt, 'fresh');
  storage.setItem(STORAGE_KEY, JSON.stringify({ version: 2, currentStep: 4, data: {} }));
  assert.equal(restoreInterviewSession(storage, 'newer').currentStep, 1);
});

test('clamps restored steps and sanitises stale year data', () => {
  const storage = new MemoryStorage();
  saveInterviewSession(storage, {
    version: 1,
    currentStep: 99,
    data: {
      ...createInitialInterviewData('start'),
      schoolYear: 3,
      subjects: ['physics', 'english'],
      subjectAreas: { physics: ['past-papers'], english: ['comprehension'] },
      goals: ['band-6-goal', 'more-confidence'],
      currentResults: '90-plus',
    },
  });
  const restored = restoreInterviewSession(storage, 'fallback');
  assert.equal(restored.currentStep, 6);
  assert.deepEqual(restored.data.subjects, ['english']);
  assert.deepEqual(restored.data.goals, ['more-confidence']);
  assert.equal(restored.data.currentResults, undefined);
});

test('clears saved progress explicitly', () => {
  const storage = new MemoryStorage();
  saveInterviewSession(storage, { version: 1, currentStep: 1, data: createInitialInterviewData('start') });
  clearInterviewSession(storage);
  assert.equal(storage.getItem(STORAGE_KEY), null);
});
