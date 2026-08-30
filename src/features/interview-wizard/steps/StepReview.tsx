import { ArrowRight, Check, Mail, Phone, UserRound } from 'lucide-react';
import { getInterviewLabel, getInterviewLabels } from '../labels.ts';
import { REVIEW_PROCESS } from '../presentation.ts';
import type { InterviewFormData } from '../types.ts';
import './StepsConversation.css';

function EditButton({ step, onEdit }: { step: number; onEdit: (step: number) => void }) {
  return <button type="button" className="snapshot-edit" onClick={() => onEdit(step)}>Edit</button>;
}

function Values({ values, empty }: { values: readonly string[]; empty?: string }) {
  return values.length ? <ul>{values.map(value => <li key={value}>{value}</li>)}</ul> : <p className="snapshot-empty">{empty ?? 'We’ll discuss this with you.'}</p>;
}

export function StepReview({ data, onEdit }: { data: InterviewFormData; onEdit: (step: number) => void }) {
  const studentName = data.studentFirstName.trim() || 'Your child';
  const subjects = getInterviewLabels(data.subjects);
  const rightNow = [...getInterviewLabels(data.currentSituations), ...(data.schoolworkDifficulty ? [getInterviewLabel(data.schoolworkDifficulty)] : []), ...(data.currentResults ? [getInterviewLabel(data.currentResults)] : []), ...(data.confidence ? [getInterviewLabel(data.confidence)] : []), ...getInterviewLabels(data.behavioursObserved)];
  const priorities = [...getInterviewLabels(data.parentConcerns), ...(data.parentConcernNotes ? [data.parentConcernNotes] : [])];
  const goals = [...getInterviewLabels(data.goals), ...(data.goalNotes ? [data.goalNotes] : [])];
  const learning = [...getInterviewLabels(data.learningChallenges), ...(data.learningChallengesOther ? [data.learningChallengesOther] : [])];
  const tutor = [...getInterviewLabels(data.tutorPreferences), ...(data.tutorPreferenceNotes ? [data.tutorPreferenceNotes] : [])];
  const formats = getInterviewLabels(data.preferredFormats);
  return <div className="consultation-snapshot">
    <header className="snapshot-title"><span>{studentName.toUpperCase()}’S CONSULTATION SNAPSHOT</span><h3>{data.schoolYear ? `Year ${data.schoolYear}` : 'School year to discuss'}</h3><p>{subjects.length ? subjects.join(' + ') : 'Subjects to discuss'}</p></header>
    <div className="snapshot-story">
      <section><div><span>WHERE {studentName.toUpperCase()} IS NOW</span><EditButton step={3} onEdit={onEdit} /></div><h4>Right now</h4><Values values={rightNow} /></section>
      <section><div><span>WHAT YOU’D LIKE TO CHANGE</span><EditButton step={4} onEdit={onEdit} /></div><h4>Your priority</h4><Values values={priorities} /><h4>Goals</h4><Values values={goals} /></section>
      <section><div><span>HOW {studentName.toUpperCase()} LEARNS</span><EditButton step={5} onEdit={onEdit} /></div><h4>Learning considerations</h4><Values values={learning} empty="No specific consideration provided — we’ll discuss this with you." /><h4>Tutor preferences</h4><Values values={tutor} empty="No preference provided — we’ll recommend a suitable match." /><h4>Format preference</h4><Values values={formats} empty="No preference provided — we’ll discuss the options." /></section>
    </div>
    <section className="snapshot-subjects"><div><span>SUBJECTS AND AREAS</span><EditButton step={2} onEdit={onEdit} /></div><Values values={data.subjects.flatMap(subject => { const areas = getInterviewLabels(data.subjectAreas[subject] ?? []); return [`${getInterviewLabel(subject)}${areas.length ? ` — ${areas.join(', ')}` : ''}`]; })} /></section>
    <section className="snapshot-details"><div className="snapshot-details-heading"><span>YOUR DETAILS</span><EditButton step={1} onEdit={onEdit} /></div><div><UserRound aria-hidden="true" /><p><strong>{`${data.parentFirstName} ${data.parentLastName}`.trim()}</strong>{data.relationshipToStudent ? <small>{getInterviewLabel(data.relationshipToStudent)}</small> : null}</p></div><div><Phone aria-hidden="true" /><p>{data.preferredContactMethod ? `${getInterviewLabel(data.preferredContactMethod)} · ` : ''}{data.mobile}</p></div><div><Mail aria-hidden="true" /><p>{data.email}</p></div><p className="snapshot-student-line">{studentName}{data.schoolYear ? ` · Year ${data.schoolYear}` : ''}{data.schoolName ? ` · ${data.schoolName}` : ''}{data.suburb ? ` / ${data.suburb}` : ''}</p></section>
    {data.hasHadTutoringBefore !== undefined || data.previousTutoringWorked || data.previousTutoringIssues.length ? <section className="snapshot-previous"><span>PREVIOUS TUTORING</span><p>{data.hasHadTutoringBefore ? 'Yes' : 'No'}{data.previousTutoringWorked ? ` — ${data.previousTutoringWorked}` : ''}</p><Values values={getInterviewLabels(data.previousTutoringIssues)} /></section> : null}
    {data.anythingElse ? <section className="snapshot-additional"><span>ADDITIONAL NOTES</span><p>{data.anythingElse}</p></section> : null}
    <section className="snapshot-process"><span>WHAT HAPPENS NEXT</span><div>{REVIEW_PROCESS.map((item, index) => <div key={item.label} data-status={item.status}><i>{item.status === 'complete' ? <Check /> : item.status === 'current' ? '•' : '○'}</i><b>{item.label}</b>{index < REVIEW_PROCESS.length - 1 ? <ArrowRight aria-hidden="true" /> : null}</div>)}</div><p>You’ve given us the context. Next, we’ll speak with you, understand the details and recommend the most suitable starting point.</p></section>
  </div>;
}
