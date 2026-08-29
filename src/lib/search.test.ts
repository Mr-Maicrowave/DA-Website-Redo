import test from 'node:test';
import assert from 'node:assert/strict';
import { searchRecords } from './search.ts';

const records = [
  { title: 'Fees and payments', body: 'Tuition cost and payment options', concepts: ['pricing'] },
  { title: 'Interview', body: 'A guided conversation', concepts: ['interview'] },
  { title: 'Confidence', body: 'Students should not feel lost' },
  { title: 'Who teaches classes?', body: 'Our trained tutors help students', concepts: ['teachers'] },
  { title: 'Missed classes', body: 'Contact us if a student is sick or absent', concepts: ['absence'] },
];
test('uses token-aware synonyms without fee-feeling false positives', () => { const results = searchRecords(records, 'fee'); assert.equal(results[0].title, 'Fees and payments'); assert.equal(results.some(x => x.title === 'Confidence'), false); });
test('supports controlled synonyms and typo fallback', () => { assert.equal(searchRecords(records, 'cost')[0].title, 'Fees and payments'); assert.equal(searchRecords(records, 'teacher')[0].title, 'Who teaches classes?'); assert.equal(searchRecords(records, 'interveiw')[0].title, 'Interview'); assert.equal(searchRecords(records, 'miss class')[0].title, 'Missed classes'); });
test('does not use weak body fuzziness as a fallback', () => { assert.equal(searchRecords(records, 'money')[0].title, 'Fees and payments'); assert.equal(searchRecords(records, 'nonsense123').length, 0); });
