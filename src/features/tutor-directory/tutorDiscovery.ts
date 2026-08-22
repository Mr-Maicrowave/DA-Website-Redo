import type { CatalogueTutor } from '../../data/teacherCatalogue.ts';

export type TutorSubject = 'english' | 'maths' | 'science' | 'primary';
export type TutorYearLevel = 'years-3-6' | 'years-7-10' | 'years-11-12';

export interface TutorDiscoveryRecord {
  tutor: CatalogueTutor;
  subjects: TutorSubject[];
  yearLevels: TutorYearLevel[];
}

export interface TutorDiscoveryFilters {
  query?: string;
  subjects: Set<TutorSubject>;
  yearLevels: Set<TutorYearLevel>;
}

const has = (value: string, pattern: RegExp): boolean => pattern.test(value);

export function toDiscoveryRecord(tutor: CatalogueTutor): TutorDiscoveryRecord {
  const rawSubjects = tutor.subjects;
  const subjects: TutorSubject[] = [];

  if (has(rawSubjects, /\benglish\b/i)) subjects.push('english');
  if (has(rawSubjects, /\bmathematics\b/i)) subjects.push('maths');
  if (has(rawSubjects, /\b(?:science|chemistry|biology|business studies)\b/i)) {
    subjects.push('science');
  }
  if (tutor.hasPrimary) subjects.push('primary');

  const yearLevels: TutorYearLevel[] = [];
  if (tutor.hasPrimary || has(rawSubjects, /\bprimary\b/i)) yearLevels.push('years-3-6');
  if (has(rawSubjects, /\(\s*yr\s*7\s*[–-]\s*10\s*\)/i)) yearLevels.push('years-7-10');
  if (has(rawSubjects, /\b(?:standard|advanced|extension(?:\s*\d)?)\b/i)) {
    yearLevels.push('years-11-12');
  }

  return {
    tutor,
    subjects,
    yearLevels,
  };
}

export function matchesDiscoveryFilters(
  record: TutorDiscoveryRecord,
  filters: TutorDiscoveryFilters,
): boolean {
  const query = filters.query?.trim().toLowerCase();
  const searchText = [record.tutor.name, record.tutor.designation, record.tutor.tagline, record.tutor.subjects]
    .join(' ')
    .toLowerCase();
  if (query && !searchText.includes(query)) return false;

  if (filters.subjects.size > 0 && ![...filters.subjects].some(subject => record.subjects.includes(subject))) {
    return false;
  }

  if (filters.yearLevels.size > 0 && ![...filters.yearLevels].some(level => record.yearLevels.includes(level))) {
    return false;
  }

  return true;
}
