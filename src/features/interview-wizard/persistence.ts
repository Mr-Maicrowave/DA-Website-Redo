import { createInitialInterviewData, sanitiseDataForYear } from './model.ts';
import type { InterviewFormData, InterviewSessionState } from './types.ts';

export const STORAGE_KEY = 'da-interview-form';
export const STORAGE_VERSION = 1 as const;

type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

const arrayFields = [
  'subjects',
  'currentSituations',
  'behavioursObserved',
  'learningChallenges',
  'parentConcerns',
  'goals',
  'previousTutoringIssues',
  'preferredFormats',
  'tutorPreferences',
] as const satisfies readonly (keyof InterviewFormData)[];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function safeData(value: unknown, now: string): InterviewFormData {
  const initial = createInitialInterviewData(now);
  if (!isRecord(value)) return initial;

  const merged = { ...initial, ...value } as InterviewFormData;
  for (const field of arrayFields) {
    if (!Array.isArray(value[field])) {
      (merged[field] as string[]) = [];
    }
  }
  merged.subjectAreas = isRecord(value.subjectAreas)
    ? Object.fromEntries(
        Object.entries(value.subjectAreas)
          .filter((entry): entry is [string, string[]] => Array.isArray(entry[1]))
          .map(([key, areas]) => [key, areas.filter(area => typeof area === 'string')]),
      )
    : {};
  merged.schoolYear = typeof value.schoolYear === 'number' ? value.schoolYear : null;
  merged.startedAt = typeof value.startedAt === 'string' ? value.startedAt : now;

  return merged.schoolYear
    ? sanitiseDataForYear(merged, merged.schoolYear)
    : merged;
}

export function serialiseInterviewSession(state: InterviewSessionState): string {
  return JSON.stringify(state);
}

export function saveInterviewSession(storage: StorageLike, state: InterviewSessionState): void {
  storage.setItem(STORAGE_KEY, serialiseInterviewSession(state));
}

export function restoreInterviewSession(
  storage: StorageLike,
  now = new Date().toISOString(),
): InterviewSessionState {
  const fallback: InterviewSessionState = {
    version: STORAGE_VERSION,
    currentStep: 1,
    data: createInitialInterviewData(now),
  };

  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || parsed.version !== STORAGE_VERSION) return fallback;
    const candidateStep = typeof parsed.currentStep === 'number' ? parsed.currentStep : 1;
    return {
      version: STORAGE_VERSION,
      currentStep: Math.min(6, Math.max(1, Math.trunc(candidateStep))),
      data: safeData(parsed.data, now),
    };
  } catch {
    return fallback;
  }
}

export function clearInterviewSession(storage: StorageLike): void {
  storage.removeItem(STORAGE_KEY);
}
