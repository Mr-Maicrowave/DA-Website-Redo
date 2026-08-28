import { CONTACT_METHODS } from '../config.ts';
import { SelectInput, TextInput } from '../fields.tsx';
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
  return <div className="interview-wizard-fields">
    <SelectInput id="parent-title" label="Parent title" value={data.parentTitle ?? ''} onChange={set('parentTitle')} options={TITLES} />
    <TextInput id="parent-first-name" label="Parent first name" value={data.parentFirstName} onChange={set('parentFirstName')} error={errors.parentFirstName} />
    <TextInput id="parent-last-name" label="Parent last name" value={data.parentLastName} onChange={set('parentLastName')} error={errors.parentLastName} />
    <TextInput id="parent-email" label="Email" type="email" value={data.email} onChange={set('email')} error={errors.email} />
    <TextInput id="parent-mobile" label="Mobile" type="tel" value={data.mobile} onChange={set('mobile')} error={errors.mobile} />
    <SelectInput id="contact-method" label="Preferred contact method" value={data.preferredContactMethod ?? ''} onChange={set('preferredContactMethod')} options={CONTACT_METHODS} />
    <SelectInput id="relationship" label="Relationship to student" value={data.relationshipToStudent ?? ''} onChange={set('relationshipToStudent')} options={RELATIONSHIPS} />
    <TextInput id="student-first-name" label="Student first name" value={data.studentFirstName} onChange={set('studentFirstName')} error={errors.studentFirstName} />
    <SelectInput id="school-year" label="School year" value={data.schoolYear ? String(data.schoolYear) : ''} onChange={value => onYearChange(Number(value))} options={SCHOOL_YEARS} error={errors.schoolYear} />
    <TextInput id="school-name" label="School name" value={data.schoolName ?? ''} onChange={set('schoolName')} />
    <TextInput id="suburb" label="Suburb" value={data.suburb ?? ''} onChange={set('suburb')} />
  </div>;
}
