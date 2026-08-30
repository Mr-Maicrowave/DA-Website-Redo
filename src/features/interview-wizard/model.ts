import { GOALS_BY_STAGE, SUBJECT_AREAS_BY_STAGE, SUBJECTS_BY_STAGE } from './config.ts';
import type { InterviewFormData, SchoolStage } from './types.ts';

export function createInitialInterviewData(now = new Date().toISOString()): InterviewFormData {
  return {
    parentFirstName: '',
    parentLastName: '',
    email: '',
    mobile: '',
    studentFirstName: '',
    schoolYear: null,
    subjects: [],
    subjectAreas: {},
    currentSituations: [],
    behavioursObserved: [],
    learningChallenges: [],
    parentConcerns: [],
    goals: [],
    previousTutoringIssues: [],
    preferredFormats: [],
    tutorPreferences: [],
    startedAt: now,
  };
}

export function getSchoolStage(year: number | null): SchoolStage | null {
  if (year === null || !Number.isInteger(year)) return null;
  if (year >= 1 && year <= 6) return 'primary';
  if (year >= 7 && year <= 10) return 'high-school';
  if (year >= 11 && year <= 12) return 'hsc';
  return null;
}

export function toggleArrayValue<T>(values: readonly T[], value: T): T[] {
  return values.includes(value)
    ? values.filter(item => item !== value)
    : [...values, value];
}

export function toggleExclusiveValue(
  values: readonly string[],
  value: string,
  exclusiveValues: readonly string[],
): string[] {
  if (values.includes(value)) return values.filter(item => item !== value);
  if (exclusiveValues.includes(value)) return [value];
  return [...values.filter(item => !exclusiveValues.includes(item)), value];
}

export function toggleSubject(data: InterviewFormData, subject: string): InterviewFormData {
  if (data.subjects.includes(subject)) {
    const nextAreas = { ...data.subjectAreas };
    delete nextAreas[subject];
    return {
      ...data,
      subjects: data.subjects.filter(item => item !== subject),
      subjectAreas: nextAreas,
    };
  }
  return { ...data, subjects: [...data.subjects, subject] };
}

export function toggleSubjectArea(
  data: InterviewFormData,
  subject: string,
  area: string,
): InterviewFormData {
  if (!data.subjects.includes(subject)) return data;
  return {
    ...data,
    subjectAreas: {
      ...data.subjectAreas,
      [subject]: toggleArrayValue(data.subjectAreas[subject] ?? [], area),
    },
  };
}

export function setTutoringHistory(
  data: InterviewFormData,
  hasHadTutoringBefore: boolean,
): InterviewFormData {
  if (hasHadTutoringBefore) return { ...data, hasHadTutoringBefore: true };
  return {
    ...data,
    hasHadTutoringBefore: false,
    previousTutoringWorked: undefined,
    previousTutoringIssues: [],
  };
}

export function sanitiseDataForYear(
  data: InterviewFormData,
  year: number,
): InterviewFormData {
  const stage = getSchoolStage(year);
  if (!stage) {
    return {
      ...data,
      schoolYear: null,
      subjects: [],
      subjectAreas: {},
      goals: [],
      currentResults: undefined,
      currentResultsNotes: undefined,
      schoolworkDifficulty: undefined,
    };
  }

  const allowedSubjects = new Set(SUBJECTS_BY_STAGE[stage].map(option => option.value));
  const subjects = data.subjects.filter(subject => allowedSubjects.has(subject));
  const subjectAreas = Object.fromEntries(
    subjects.map(subject => {
      const allowedAreas = new Set(
        (SUBJECT_AREAS_BY_STAGE[stage][subject] ?? []).map(option => option.value),
      );
      return [subject, (data.subjectAreas[subject] ?? []).filter(area => allowedAreas.has(area))];
    }),
  );
  const allowedGoals = new Set(GOALS_BY_STAGE[stage].map(option => option.value));

  return {
    ...data,
    schoolYear: year,
    subjects,
    subjectAreas,
    goals: data.goals.filter(goal => allowedGoals.has(goal)),
    currentResults: stage === 'primary' ? undefined : data.currentResults,
    currentResultsNotes: stage === 'primary' ? undefined : data.currentResultsNotes,
    schoolworkDifficulty: stage === 'primary' ? data.schoolworkDifficulty : undefined,
  };
}
