import { GraduationCap, Users } from 'lucide-react';
import { CONTACT_METHODS } from '../config.ts';
import { SelectInput, SingleChoice, TextInput } from '../fields.tsx';
import type { InterviewFormData } from '../types.ts';
import type { FormErrors } from '../validation.ts';

const TITLES = ['Mr', 'Mrs', 'Ms', 'Miss', 'Dr', 'Prof'].map(value => ({ value, label: value }));
const RELATIONSHIPS = ['Mother', 'Father', 'Guardian', 'Grandparent', 'Other'].map(label => ({ value: label.toLowerCase(), label }));
const SCHOOL_YEARS = Array.from({ length: 12 }, (_, index) => ({ value: String(index + 1), label: `Year ${index + 1}` }));

export function StepParentStudent({ data, errors, onChange, onYearChange }: {
  data: InterviewFormData;
  errors: FormErrors;
  onChange: (next: InterviewFormData) => void;
  onYearChange: (year: number) => void;
}) {
  const set = (key: keyof InterviewFormData) => (value: string) => onChange({ ...data, [key]: value || undefined });
  return <div className="interview-wizard-stack">
    <section className="interview-family-panel interview-family-panel--parent"><header><span><Users aria-hidden="true" /></span><div><p className="interview-wizard-section-label">ABOUT YOU</p><h3>Who should we contact?</h3></div></header><div className="interview-wizard-fields">
    <SelectInput id="parent-title" label="Parent title" value={data.parentTitle ?? ''} onChange={set('parentTitle')} options={TITLES} />
    <TextInput id="parent-first-name" label="Parent first name" placeholder="e.g. Sarah" value={data.parentFirstName} onChange={set('parentFirstName')} error={errors.parentFirstName} />
    <TextInput id="parent-last-name" label="Parent last name" placeholder="e.g. Nguyen" value={data.parentLastName} onChange={set('parentLastName')} error={errors.parentLastName} />
    <TextInput id="parent-email" label="Email" type="email" placeholder="e.g. sarah@email.com" value={data.email} onChange={set('email')} error={errors.email} />
    <TextInput id="parent-mobile" label="Mobile" type="tel" placeholder="e.g. 0412 345 678" value={data.mobile} onChange={set('mobile')} error={errors.mobile} />
    <SelectInput id="relationship" label="Relationship to student" value={data.relationshipToStudent ?? ''} onChange={set('relationshipToStudent')} options={RELATIONSHIPS} />
    <SelectInput id="contact-method" label="Preferred contact method" placeholder="Select your preference…" value={data.preferredContactMethod ?? ''} onChange={set('preferredContactMethod')} options={CONTACT_METHODS} />
    </div></section>
    <section className="interview-family-panel interview-family-panel--student"><header><span><GraduationCap aria-hidden="true" /></span><div><p className="interview-wizard-section-label">ABOUT YOUR CHILD</p><h3>Who are we helping?</h3></div></header><div className="interview-wizard-fields">
    <TextInput id="student-first-name" label="Student first name" placeholder="e.g. Sophie" value={data.studentFirstName} onChange={set('studentFirstName')} error={errors.studentFirstName} />
    <SingleChoice id="school-year" label="School year" value={data.schoolYear ? String(data.schoolYear) : undefined} onChange={value => onYearChange(Number(value))} options={SCHOOL_YEARS} error={errors.schoolYear} />
    <TextInput id="school-name" label="School name" placeholder="e.g. Canley Heights Public School" value={data.schoolName ?? ''} onChange={set('schoolName')} />
    <TextInput id="suburb" label="Suburb" placeholder="e.g. Canley Heights" value={data.suburb ?? ''} onChange={set('suburb')} />
    </div></section>
  </div>;
}
