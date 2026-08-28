import { getInterviewLabel, getInterviewLabels } from '../labels.ts';
import type { InterviewFormData } from '../types.ts';

export function StepReview({ data, onEdit }: { data: InterviewFormData; onEdit: (step: number) => void }) {
  const sections = [
    { step: 1, title: 'Parent', values: [`${data.parentFirstName} ${data.parentLastName}`.trim(), data.email, data.mobile].filter(Boolean) },
    { step: 1, title: 'Student', values: [data.studentFirstName, data.schoolYear ? `Year ${data.schoolYear}` : '', data.schoolName ?? '', data.suburb ?? ''].filter(Boolean) },
    { step: 2, title: 'Subjects', values: getInterviewLabels(data.subjects) },
    { step: 3, title: 'Current situation', values: getInterviewLabels(data.currentSituations) },
    { step: 3, title: 'Confidence', values: data.confidence ? [getInterviewLabel(data.confidence)] : [] },
    { step: 4, title: 'Parent concerns', values: [...getInterviewLabels(data.parentConcerns), data.parentConcernNotes ?? ''].filter(Boolean) },
    { step: 4, title: 'Goals', values: [...getInterviewLabels(data.goals), data.goalNotes ?? ''].filter(Boolean) },
    { step: 5, title: 'Learning considerations', values: getInterviewLabels(data.learningChallenges) },
    { step: 5, title: 'Previous tutoring', values: data.hasHadTutoringBefore === undefined ? [] : [data.hasHadTutoringBefore ? 'Yes' : 'No', ...getInterviewLabels(data.previousTutoringIssues)] },
    { step: 5, title: 'Preferred format', values: getInterviewLabels(data.preferredFormats) },
    { step: 5, title: 'Tutor preference', values: getInterviewLabels(data.tutorPreferences) },
    { step: 5, title: 'Additional notes', values: [data.anythingElse ?? ''].filter(Boolean) },
  ];
  return <div className="interview-review">
    {sections.map(section => <section key={section.title}><div><h3>{section.title}</h3><button type="button" onClick={() => onEdit(section.step)}>Edit</button></div>{section.values.length > 0 ? <ul>{section.values.map(value => <li key={value}>{value}</li>)}</ul> : <p>Not provided</p>}</section>)}
  </div>;
}
