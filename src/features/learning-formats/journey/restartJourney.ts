export function getRestartedJourneyUiState() {
  return {
    phase: "education" as const,
    routeMode: "junction" as const,
    questionIndex: 0,
    specialistIndex: 0,
    transitioning: false,
    characterState: "idle" as const,
    characterTop: "82%" as const,
    initialStage: null,
  };
}
