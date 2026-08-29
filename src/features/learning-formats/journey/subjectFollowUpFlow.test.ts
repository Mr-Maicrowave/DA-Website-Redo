import assert from "node:assert/strict";
import test from "node:test";

import { selectedSubjectFollowUps } from "./subjectFollowUpFlow.ts";

test("only returns selected subjects with configured specialist questions", () => {
  const followUps = selectedSubjectFollowUps(["english", "maths", "science"], "high-school");
  assert.deepEqual(followUps.map((item) => item.subject), ["english", "maths"]);
});

test("primary maths and non-specialist subjects do not create unnecessary questions", () => {
  assert.deepEqual(selectedSubjectFollowUps(["maths"], "primary"), []);
  assert.deepEqual(selectedSubjectFollowUps(["physics", "chemistry"], "hsc"), []);
});
