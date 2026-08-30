import test from 'node:test';
import assert from 'node:assert/strict';
import { getCentreStatus } from './centre-status.ts';
import { CANLEY_HEIGHTS_GROUP } from '../../data/physical-centres.ts';

test('uses supplied Sydney time to report open hours', () => {
  const result = getCentreStatus(CANLEY_HEIGHTS_GROUP.hours!, CANLEY_HEIGHTS_GROUP.timezone, new Date('2026-08-28T08:00:00.000Z'));
  assert.equal(result.kind, 'open');
  assert.match(result.detail, /9:30 pm/);
});

test('reports a later same-day opening without browser local time', () => {
  const result = getCentreStatus(CANLEY_HEIGHTS_GROUP.hours!, CANLEY_HEIGHTS_GROUP.timezone, new Date('2026-08-28T02:00:00.000Z'));
  assert.equal(result.kind, 'opens-later');
  assert.match(result.detail, /4:30 pm/);
});
