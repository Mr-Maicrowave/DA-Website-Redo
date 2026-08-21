type TutorProfileSource = {
  motto: string;
  profile?: {
    tags?: string[];
    goals?: string;
    remembered?: string;
    whyDA?: string;
  };
};

export const profileSubjectTone = (subject: 'math' | 'english' | 'science' | 'both') => subject;

export const profilePronounsFor = (name: string) => {
  if (/^Mr\.?\s/i.test(name)) return { subject: 'he', possessive: 'his' };
  if (/^(Ms|Mrs|Miss)\.?\s/i.test(name)) return { subject: 'she', possessive: 'her' };
  return { subject: 'they', possessive: 'their' };
};

type SubjectCategory = 'primary' | 'english' | 'math' | 'science' | 'business' | 'legal' | 'other';

const categoryForSubject = (subject: string): SubjectCategory => {
  if (/^Primary\b/i.test(subject)) return 'primary';
  if (/^English\b/i.test(subject)) return 'english';
  if (/^(Mathematics|Math)\b/i.test(subject)) return 'math';
  if (/^Science\b/i.test(subject)) return 'science';
  if (/^Business\b/i.test(subject)) return 'business';
  if (/^Legal\b/i.test(subject)) return 'legal';
  return 'other';
};

export const profileSubjectGroupsFor = (subjects: string[]) => {
  const groups = new Map<SubjectCategory, string[]>();
  subjects.forEach(subject => {
    const category = categoryForSubject(subject);
    groups.set(category, [...(groups.get(category) ?? []), subject]);
  });
  return [...groups].map(([category, labels]) => ({ category, label: labels.join(' · ') }));
};

export const profileContentFor = (teacher: TutorProfileSource) => ({
  strengths: teacher.profile?.tags?.slice(0, 3) ?? [],
  approach: teacher.profile?.goals ?? teacher.motto,
  remembered: teacher.profile?.remembered ?? teacher.motto,
  whyDA: teacher.profile?.whyDA ?? teacher.motto,
});
