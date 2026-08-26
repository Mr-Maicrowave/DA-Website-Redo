import test from 'node:test';
import assert from 'node:assert/strict';
import {
  GRAPH_LAB_THEME_STORAGE_KEY,
  readGraphLabTheme,
  writeGraphLabTheme,
  type ThemeStorage,
} from './graph-lab-theme.ts';

const createStorage = (initial?: string) => {
  const values = new Map<string, string>();
  if (initial !== undefined) values.set(GRAPH_LAB_THEME_STORAGE_KEY, initial);
  const storage: ThemeStorage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => { values.set(key, value); },
  };
  return { storage, values };
};

test('defaults Graph Lab to light when no preference exists', () => {
  assert.equal(readGraphLabTheme(createStorage().storage), 'light');
  assert.equal(readGraphLabTheme(null), 'light');
});

test('restores only valid Graph Lab theme preferences', () => {
  assert.equal(readGraphLabTheme(createStorage('dark').storage), 'dark');
  assert.equal(readGraphLabTheme(createStorage('light').storage), 'light');
  assert.equal(readGraphLabTheme(createStorage('system').storage), 'light');
});

test('persists the choice under a Graph-Lab-specific key', () => {
  const { storage, values } = createStorage();
  writeGraphLabTheme(storage, 'dark');
  assert.equal(values.get(GRAPH_LAB_THEME_STORAGE_KEY), 'dark');
  assert.equal(values.size, 1);
});
