import type { QuestionSlot } from "../logic/types.ts";

export function getCheckpointResumeIndex(
  slots: QuestionSlot[],
  answers: Partial<Record<QuestionSlot, string>>,
): number {
  const unanswered = slots.findIndex((slot) => !answers[slot]);
  return unanswered === -1 ? slots.length : unanswered;
}

export function getPreviousCheckpointIndex(current: number): number {
  return Math.max(0, current - 1);
}
