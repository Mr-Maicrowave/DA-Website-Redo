import assert from "node:assert/strict";
import test from "node:test";

import {
  clearJourneyResult,
  JOURNEY_SESSION_KEY,
  readJourneySession,
  writeJourneySession,
  type JourneyStorage,
} from "./recommendationStorage.ts";

const completeAnswers = {
  academicLevel: "year-level",
  confidence: "encouraged",
  learningHabits: "check-in",
  motivation: "persistent",
  goals: "steady-progress",
} as const;

class MemoryStorage implements JourneyStorage {
  private values = new Map<string, string>();

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }

  removeItem(key: string) {
    this.values.delete(key);
  }
}

test("round-trips only answer IDs and revealed state", () => {
  const storage = new MemoryStorage();
  writeJourneySession(storage, completeAnswers, true);

  assert.deepEqual(readJourneySession(storage), {
    answers: completeAnswers,
    revealed: true,
  });
  assert.deepEqual(
    Object.keys(JSON.parse(storage.getItem(JOURNEY_SESSION_KEY) ?? "{}" )).sort(),
    ["answers", "revealed", "version"],
  );
});

test("rejects malformed, unknown-version and invalid-answer payloads", () => {
  const storage = new MemoryStorage();
  const values = [
    "{",
    JSON.stringify({ version: 99, answers: completeAnswers, revealed: true }),
    JSON.stringify({
      version: 1,
      answers: { ...completeAnswers, goals: "unknown" },
      revealed: true,
    }),
    JSON.stringify({
      version: 1,
      answers: { ...completeAnswers, confidence: null },
      revealed: true,
    }),
  ];

  for (const value of values) {
    storage.setItem(JOURNEY_SESSION_KEY, value);
    assert.equal(readJourneySession(storage), null);
  }
});

test("allows incomplete assessment answers only before reveal", () => {
  const storage = new MemoryStorage();
  writeJourneySession(
    storage,
    { ...completeAnswers, goals: null },
    false,
  );
  assert.deepEqual(readJourneySession(storage), {
    answers: { ...completeAnswers, goals: null },
    revealed: false,
  });

  storage.setItem(
    JOURNEY_SESSION_KEY,
    JSON.stringify({
      version: 1,
      answers: { ...completeAnswers, goals: null },
      revealed: true,
    }),
  );
  assert.equal(readJourneySession(storage), null);
});

test("clearing a result preserves answers and resets revealed state", () => {
  const storage = new MemoryStorage();
  writeJourneySession(storage, completeAnswers, true);
  clearJourneyResult(storage);

  assert.deepEqual(readJourneySession(storage), {
    answers: completeAnswers,
    revealed: false,
  });
});

test("storage access failures are contained", () => {
  const throwing: JourneyStorage = {
    getItem: () => {
      throw new Error("blocked");
    },
    setItem: () => {
      throw new Error("blocked");
    },
    removeItem: () => {
      throw new Error("blocked");
    },
  };

  assert.equal(readJourneySession(throwing), null);
  assert.doesNotThrow(() => writeJourneySession(throwing, completeAnswers, true));
  assert.doesNotThrow(() => clearJourneyResult(throwing));
});
