import { BEHAVIOURS_OBSERVED, CONFIDENCE_OPTIONS, CURRENT_RESULTS, CURRENT_SITUATIONS, SCHOOLWORK_DIFFICULTY } from '../config.ts';
import { MultiChoice, SingleChoice, TextArea } from '../fields.tsx';
import { getSchoolStage, toggleArrayValue, toggleExclusiveValue } from '../model.ts';
import type { ConfidenceLevel, InterviewFormData } from '../types.ts';
import type { FormErrors } from '../validation.ts';

export function StepCurrentSituation({ data, errors, onChange }: { data: InterviewFormData; errors: FormErrors; onChange: (next: InterviewFormData) => void }) {
  const stage = getSchoolStage(data.schoolYear);
  return <div className="interview-wizard-stack">
    <MultiChoice id="current-situations" label="What is happening right now?" options={CURRENT_SITUATIONS} values={data.currentSituations} onToggle={value => onChange({ ...data, currentSituations: toggleArrayValue(data.currentSituations, value) })} error={errors.currentSituations} />
    {stage === 'primary'
      ? <SingleChoice id="schoolwork-difficulty" label="How do they currently find schoolwork?" options={SCHOOLWORK_DIFFICULTY} value={data.schoolworkDifficulty} onChange={value => onChange({ ...data, schoolworkDifficulty: value })} />
      : <><SingleChoice id="current-results" label="If you know, what are they currently achieving?" options={CURRENT_RESULTS} value={data.currentResults} onChange={value => onChange({ ...data, currentResults: value })} /><TextArea id="current-results-notes" label="Anything useful about their recent results?" value={data.currentResultsNotes ?? ''} onChange={value => onChange({ ...data, currentResultsNotes: value })} placeholder="Usually around 75%, but the last two Maths tests were closer to 55%." /></>}
    <TextArea id="recent-changes" label="Has anything changed recently?" value={data.recentChanges ?? ''} onChange={value => onChange({ ...data, recentChanges: value })} />
    <SingleChoice id="confidence" label="How confident do they currently feel?" options={CONFIDENCE_OPTIONS} value={data.confidence} onChange={value => onChange({ ...data, confidence: value as ConfidenceLevel })} />
    <MultiChoice id="behaviours" label="What do you notice?" options={BEHAVIOURS_OBSERVED} values={data.behavioursObserved} onToggle={value => onChange({ ...data, behavioursObserved: toggleExclusiveValue(data.behavioursObserved, value, ['none']) })} />
  </div>;
}
