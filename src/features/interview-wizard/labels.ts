import {
  BEHAVIOURS_OBSERVED,
  CONFIDENCE_OPTIONS,
  CONTACT_METHODS,
  CURRENT_RESULTS,
  CURRENT_SITUATIONS,
  FORMAT_PREFERENCES,
  GOALS_BY_STAGE,
  LEARNING_CHALLENGES,
  PARENT_CONCERNS,
  PREVIOUS_TUTORING_ISSUES,
  SCHOOLWORK_DIFFICULTY,
  SUBJECT_AREAS_BY_STAGE,
  SUBJECTS_BY_STAGE,
  TUTOR_PREFERENCES,
} from './config.ts';
import type { Option } from './types.ts';

export function getOptionLabel(options: readonly Option[], value: string): string {
  return options.find(option => option.value === value)?.label ?? value;
}

const allOptions: Option[] = [
  ...CONTACT_METHODS,
  ...Object.values(SUBJECTS_BY_STAGE).flat(),
  ...Object.values(SUBJECT_AREAS_BY_STAGE).flatMap(subjects => Object.values(subjects).flat()),
  ...CURRENT_SITUATIONS,
  ...CURRENT_RESULTS,
  ...SCHOOLWORK_DIFFICULTY,
  ...CONFIDENCE_OPTIONS,
  ...BEHAVIOURS_OBSERVED,
  ...PARENT_CONCERNS,
  ...Object.values(GOALS_BY_STAGE).flat(),
  ...LEARNING_CHALLENGES,
  ...PREVIOUS_TUTORING_ISSUES,
  ...FORMAT_PREFERENCES,
  ...TUTOR_PREFERENCES,
];

const labels = new Map(allOptions.map(option => [option.value, option.label]));

export function getInterviewLabel(value: string): string {
  return labels.get(value) ?? value;
}

export function getInterviewLabels(values: readonly string[]): string[] {
  return values.map(getInterviewLabel);
}
