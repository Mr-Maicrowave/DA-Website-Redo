import { Check } from 'lucide-react';
import { BEHAVIOURS_OBSERVED, CONFIDENCE_OPTIONS, CURRENT_RESULTS, CURRENT_SITUATIONS, SCHOOLWORK_DIFFICULTY } from '../config.ts';
import { FieldError, TextArea } from '../fields.tsx';
import { getInterviewLabel, getInterviewLabels } from '../labels.ts';
import { getSchoolStage, toggleArrayValue, toggleExclusiveValue } from '../model.ts';
import { buildDirectSummary, groupOptions } from '../presentation.ts';
import type { ConfidenceLevel, InterviewFormData, Option } from '../types.ts';
import type { FormErrors } from '../validation.ts';
import './StepsConversation.css';

const CONFIDENCE_HELP: Record<string, string> = {
  'avoids-subject': 'The subject may currently feel easier to avoid than approach.',
  'very-unsure': 'They may need reassurance and a clearer starting point.',
  mixed: 'Confidence seems to change depending on the topic or task.',
  'generally-confident': 'They generally feel capable, even if there may still be areas to strengthen.',
  'very-confident': 'They feel ready to engage and may benefit from continued challenge.',
};

function Scale({ id, options, value, onChange, quietValue }: { id: string; options: readonly Option[]; value?: string; onChange: (value: string) => void; quietValue?: string }) {
  const main = options.filter(option => option.value !== quietValue);
  const quiet = options.find(option => option.value === quietValue);
  return <div className="conversation-scale-wrap">
    <div className="conversation-scale" role="group" aria-label={id}>{main.map(option => <button type="button" key={option.value} aria-pressed={value === option.value} onClick={() => onChange(option.value)}><span aria-hidden="true">{value === option.value ? <Check /> : null}</span><b>{option.label}</b></button>)}</div>
    {value ? <p className="conversation-scale-selection">Selected: <strong>{getInterviewLabel(value)}</strong></p> : null}
    {quiet ? <button type="button" className="conversation-quiet-choice" aria-pressed={value === quiet.value} onClick={() => onChange(quiet.value)}>{quiet.label}{value === quiet.value ? <Check aria-hidden="true" /> : null}</button> : null}
  </div>;
}

export function StepCurrentSituation({ data, errors, onChange, studentName }: { data: InterviewFormData; errors: FormErrors; onChange: (next: InterviewFormData) => void; studentName: string }) {
  const stage = getSchoolStage(data.schoolYear);
  const summary = buildDirectSummary(studentName, [...getInterviewLabels(data.currentSituations), ...(data.schoolworkDifficulty ? [getInterviewLabel(data.schoolworkDifficulty)] : []), ...(data.currentResults ? [getInterviewLabel(data.currentResults)] : []), ...(data.confidence ? [getInterviewLabel(data.confidence)] : []), ...getInterviewLabels(data.behavioursObserved)].slice(0, 4));
  return <div className="conversation-step conversation-step--right-now">
    <section className="conversation-section"><header><span>01</span><div><h3>What sounds most like {studentName}?</h3><p>Choose anything that feels familiar.</p></div></header>
      <div className="conversation-statement-grid">{CURRENT_SITUATIONS.map(option => { const selected = data.currentSituations.includes(option.value); return <button type="button" key={option.value} aria-pressed={selected} onClick={() => onChange({ ...data, currentSituations: toggleArrayValue(data.currentSituations, option.value) })}><span aria-hidden="true">{selected ? <Check /> : null}</span><b>{option.label}</b></button>; })}</div><FieldError id="current-situations-error" error={errors.currentSituations} />
    </section>
    <section className="conversation-section"><header><span>02</span><div><h3>{stage === 'primary' ? `How does schoolwork usually feel for ${studentName}?` : `Where are ${studentName}’s results sitting?`}</h3><p>{stage === 'primary' ? 'Choose the point that feels closest.' : 'If you know, choose the closest current range.'}</p></div></header>
      {stage === 'primary' ? <Scale id="Schoolwork difficulty" options={SCHOOLWORK_DIFFICULTY} quietValue="not-sure" value={data.schoolworkDifficulty} onChange={value => onChange({ ...data, schoolworkDifficulty: value })} /> : <><Scale id="Current results" options={CURRENT_RESULTS} quietValue="not-sure" value={data.currentResults} onChange={value => onChange({ ...data, currentResults: value })} /><TextArea id="current-results-notes" label="Anything useful about their recent results?" value={data.currentResultsNotes ?? ''} onChange={value => onChange({ ...data, currentResultsNotes: value })} placeholder="Usually around 75%, but the last two Maths tests were closer to 55%." /></>}
    </section>
    <section className="conversation-section"><header><span>03</span><div><h3>How confident does {studentName} feel right now?</h3><p>Choose the point that best reflects how they usually feel.</p></div></header><Scale id="Confidence" options={CONFIDENCE_OPTIONS} value={data.confidence} onChange={value => onChange({ ...data, confidence: value as ConfidenceLevel })} />{data.confidence ? <p className="conversation-dynamic-help">{studentName} — {CONFIDENCE_HELP[data.confidence]}</p> : null}</section>
    <section className="conversation-section"><header><span>04</span><div><h3>What do you notice outside the classroom?</h3><p>Choose any observations that feel familiar.</p></div></header><div className="conversation-choice-groups">{groupOptions(BEHAVIOURS_OBSERVED).map(group => <div key={group.heading}><h4>{group.heading}</h4><div>{group.options.map(option => { const selected = data.behavioursObserved.includes(option.value); return <button type="button" key={option.value} aria-pressed={selected} onClick={() => onChange({ ...data, behavioursObserved: toggleExclusiveValue(data.behavioursObserved, option.value, ['none']) })}>{option.label}{selected ? <Check aria-hidden="true" /> : null}</button>; })}</div></div>)}</div></section>
    <aside className="conversation-listening-summary"><span>WHAT WE’RE HEARING SO FAR</span><p>{summary}</p></aside>
  </div>;
}
