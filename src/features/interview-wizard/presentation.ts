import type { Option } from './types.ts';

type GroupDefinition = Readonly<{ heading: string; values: readonly string[] }>;
export type OptionGroup = Readonly<{ heading: string; options: readonly Option[] }>;

export const BEHAVIOUR_GROUPS: readonly GroupDefinition[] = [
  { heading: 'Confidence', values: ['says-they-are-bad-at-it', 'gets-frustrated-easily', 'gives-up-quickly', 'hesitates-to-ask-questions'] },
  { heading: 'Study habits', values: ['avoids-homework', 'rushes-to-finish', 'studies-but-results-dont-improve'] },
  { heading: 'Independence', values: ['needs-someone-beside-them', 'works-independently', 'enjoys-being-challenged'] },
  { heading: 'Other', values: ['none', 'not-sure'] },
] as const;

export const CONCERN_GROUPS: readonly GroupDefinition[] = [
  { heading: 'Progress', values: ['falling-behind', 'works-hard-but-marks-not-improving', 'dont-know-where-gaps-are', 'capable-of-more'] },
  { heading: 'Confidence', values: ['lost-confidence'] },
  { heading: 'Learning', values: ['needs-better-study-habits', 'needs-different-explanations', 'school-moves-too-fast', 'school-not-challenging-enough'] },
  { heading: 'Preparation', values: ['important-exam-coming', 'needs-better-preparation'] },
  { heading: 'Other', values: ['other'] },
] as const;

export const LEARNING_GROUPS: readonly GroupDefinition[] = [
  { heading: 'Foundations', values: ['gaps-from-earlier-years', 'difficulty-remembering-concepts', 'needs-more-repetition'] },
  { heading: 'Focus & pace', values: ['difficulty-concentrating', 'works-slowly', 'rushes', 'gets-bored-when-work-too-easy'] },
  { heading: 'Understanding', values: ['instructions-can-be-confusing', 'difficulty-applying-knowledge-in-tests', 'written-responses-are-difficult'] },
  { heading: 'Confidence / assessment', values: ['assessment-anxiety'] },
  { heading: 'History', values: ['inconsistent-past-support'] },
  { heading: 'Other', values: ['nothing-specific', 'not-sure', 'other'] },
] as const;

export const GOAL_GROUPS: readonly GroupDefinition[] = [
  { heading: 'Foundation', values: ['stronger-foundations', 'better-understanding', 'catch-up-to-year-level'] },
  { heading: 'Results', values: ['higher-school-marks', 'better-assessment-performance', 'strong-hsc-preparation', 'band-6-goal'] },
  { heading: 'Confidence', values: ['more-confidence', 'less-schoolwork-stress', 'build-interest-in-subject'] },
  { heading: 'Independence', values: ['better-study-habits', 'greater-independence'] },
  { heading: 'Advancement', values: ['move-ahead-of-year-level', 'advanced-extension-work', 'selective-gat-scholarship-preparation'] },
] as const;

export const TUTOR_GROUPS: readonly GroupDefinition[] = [
  { heading: 'Personality', values: ['patient-and-reassuring', 'energetic-and-motivating', 'calm-and-structured', 'direct-and-accountable'] },
  { heading: 'Teaching strength', values: ['strong-at-rebuilding-confidence', 'strong-at-challenging-advanced-students', 'explains-concepts-different-ways', 'strong-at-organisation'] },
] as const;

function definitionsFor(options: readonly Option[]): readonly GroupDefinition[] {
  const values = new Set(options.map(option => option.value));
  if (values.has('says-they-are-bad-at-it')) return BEHAVIOUR_GROUPS;
  if (values.has('falling-behind')) return CONCERN_GROUPS;
  if (values.has('gaps-from-earlier-years')) return LEARNING_GROUPS;
  if (values.has('stronger-foundations')) return GOAL_GROUPS;
  if (values.has('patient-and-reassuring')) return TUTOR_GROUPS;
  return [];
}

export function groupOptions(options: readonly Option[], definitions = definitionsFor(options)): OptionGroup[] {
  const byValue = new Map(options.map(option => [option.value, option]));
  return definitions.map(group => ({ heading: group.heading, options: group.values.flatMap(value => byValue.get(value) ?? []) })).filter(group => group.options.length > 0);
}

export function buildDirectSummary(studentName: string, labels: readonly string[]): string {
  if (labels.length === 0) return 'Choose any answers that feel familiar and we’ll reflect them here.';
  return `What we’re hearing: ${studentName} — ${labels.join('; ')}.`;
}

export const REVIEW_PROCESS = [
  { label: 'Listen', status: 'complete' },
  { label: 'Understand', status: 'current' },
  { label: 'Recommend', status: 'future' },
  { label: 'Match', status: 'future' },
  { label: 'Begin', status: 'future' },
] as const;
