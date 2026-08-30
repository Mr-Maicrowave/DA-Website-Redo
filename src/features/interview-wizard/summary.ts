import { getInterviewLabel, getInterviewLabels } from './labels.ts';
import type { InterviewFormData } from './types.ts';

function bulletSection(title: string, values: readonly string[]): string | null {
  if (values.length === 0) return null;
  return `${title}:\n${getInterviewLabels(values).map(value => `• ${value}`).join('\n')}`;
}

export function buildInterviewSummary(data: InterviewFormData): string {
  const sections: Array<string | null | undefined> = [
    `Student: ${data.studentFirstName || 'Not provided'}${data.schoolYear ? ` — Year ${data.schoolYear}` : ''}`,
    data.subjects.length > 0 ? `Subjects: ${getInterviewLabels(data.subjects).join(', ')}` : null,
    bulletSection('Current situation', data.currentSituations),
    data.confidence ? `Confidence: ${getInterviewLabel(data.confidence)}` : null,
    data.currentResults ? `Current result: ${getInterviewLabel(data.currentResults)}` : null,
    data.schoolworkDifficulty ? `Schoolwork: ${getInterviewLabel(data.schoolworkDifficulty)}` : null,
    bulletSection('What the parent notices', data.behavioursObserved),
    bulletSection('Parent concerns', data.parentConcerns),
    bulletSection('Goals', data.goals),
    bulletSection('Learning considerations', data.learningChallenges),
    data.hasHadTutoringBefore === undefined
      ? null
      : `Previous tutoring: ${data.hasHadTutoringBefore ? 'Yes' : 'No'}`,
    bulletSection('Previous tutoring issues', data.previousTutoringIssues),
    data.preferredFormats.length > 0
      ? `Preferred format:\n${getInterviewLabels(data.preferredFormats).map(value => `• ${value}`).join('\n')}`
      : null,
    bulletSection('Tutor preference', data.tutorPreferences),
    data.parentConcernNotes ? `Parent notes:\n“${data.parentConcernNotes.trim()}”` : null,
    data.goalNotes ? `Goal notes:\n“${data.goalNotes.trim()}”` : null,
    data.anythingElse ? `Additional notes:\n“${data.anythingElse.trim()}”` : null,
  ];

  return sections.filter(Boolean).join('\n\n');
}
