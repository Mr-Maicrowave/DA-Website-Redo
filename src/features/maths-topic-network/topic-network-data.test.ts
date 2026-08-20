import test from 'node:test';
import assert from 'node:assert/strict';
import { CORE_TOPICS, DOMAIN_TOPICS, SUBTOPICS, CROSS_LINKS } from './topic-network-data.ts';

test("every domain's corePrerequisite references a real core topic id", () => {
  const coreIds = new Set(CORE_TOPICS.map((c) => c.id));
  for (const domain of DOMAIN_TOPICS) {
    assert.ok(coreIds.has(domain.corePrerequisite), `${domain.id} references missing core topic "${domain.corePrerequisite}"`);
  }
});

test("every subtopic's parent references a real domain id", () => {
  const domainIds = new Set(DOMAIN_TOPICS.map((d) => d.id));
  for (const sub of SUBTOPICS) {
    assert.ok(domainIds.has(sub.parent), `${sub.id} references missing domain "${sub.parent}"`);
  }
});

test('every cross link references a real subtopic and a real domain', () => {
  const subIds = new Set(SUBTOPICS.map((s) => s.id));
  const domainIds = new Set(DOMAIN_TOPICS.map((d) => d.id));
  for (const link of CROSS_LINKS) {
    assert.ok(subIds.has(link.from), `cross link references missing subtopic "${link.from}"`);
    assert.ok(domainIds.has(link.to), `cross link references missing domain "${link.to}"`);
  }
});

test('all topic ids are unique across every tier', () => {
  const allIds = [
    ...CORE_TOPICS.map((c) => c.id),
    ...DOMAIN_TOPICS.map((d) => d.id),
    ...SUBTOPICS.map((s) => s.id),
  ];
  assert.equal(allIds.length, new Set(allIds).size, 'duplicate topic id found');
});

test('every domain has at least one subtopic', () => {
  const parentsWithKids = new Set(SUBTOPICS.map((s) => s.parent));
  for (const domain of DOMAIN_TOPICS) {
    assert.ok(parentsWithKids.has(domain.id), `${domain.id} has no subtopics`);
  }
});
