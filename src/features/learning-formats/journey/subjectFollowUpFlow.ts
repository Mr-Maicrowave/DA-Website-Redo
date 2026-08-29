import { getSubjectFollowUp } from "../config/subjects.ts";
import type { LearningStage, SubjectFollowUpConfig, SubjectId } from "../logic/types.ts";

export function selectedSubjectFollowUps(subjects: SubjectId[], stage: LearningStage): SubjectFollowUpConfig[] {
  return subjects.flatMap((subject) => {
    const followUp = getSubjectFollowUp(subject, stage);
    return followUp ? [followUp] : [];
  });
}
