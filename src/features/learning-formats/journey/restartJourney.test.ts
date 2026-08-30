import assert from "node:assert/strict";
import test from "node:test";

import { getRestartedJourneyUiState } from "./restartJourney.ts";

test("restores every local journey control to the opening scene", () => {
  assert.deepEqual(getRestartedJourneyUiState(), {
    phase: "education",
    routeMode: "junction",
    questionIndex: 0,
    specialistIndex: 0,
    transitioning: false,
    characterState: "idle",
    characterTop: "82%",
    initialStage: null,
  });
});
