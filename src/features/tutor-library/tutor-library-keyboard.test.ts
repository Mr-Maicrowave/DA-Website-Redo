import assert from 'node:assert/strict';
import test from 'node:test';
import { getTutorLibraryKeyboardAction } from './tutor-library-keyboard.ts';

test('maps room, cover and spread arrow keys without taking keys from text input', () => {
  assert.equal(getTutorLibraryKeyboardAction('ArrowRight', 'ROOM_IDLE', false), 'next-wall');
  assert.equal(getTutorLibraryKeyboardAction('ArrowLeft', 'BOOK_PREVIEW', false), 'return-book');
  assert.equal(getTutorLibraryKeyboardAction('ArrowRight', 'BOOK_PREVIEW', false), 'open-book');
  assert.equal(getTutorLibraryKeyboardAction('ArrowRight', 'BOOK_READING', false, 0), 'next-spread');
  assert.equal(getTutorLibraryKeyboardAction('ArrowLeft', 'PAGE_SETTLED', false, 1), 'previous-spread');
  assert.equal(getTutorLibraryKeyboardAction('ArrowRight', 'BOOK_READING', true, 0), undefined);
});
