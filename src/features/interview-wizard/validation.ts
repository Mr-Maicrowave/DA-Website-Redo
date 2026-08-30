import type { InterviewFormData } from './types.ts';

export type FormErrors = Record<string, string>;

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function isValidAustralianMobile(value: string): boolean {
  const normalised = value.replace(/[\s()\-]/g, '');
  return /^04\d{8}$/.test(normalised) || /^\+614\d{8}$/.test(normalised);
}

export function validateStep(step: number, data: InterviewFormData): FormErrors {
  const errors: FormErrors = {};

  switch (step) {
    case 1:
      if (!data.parentFirstName.trim()) errors.parentFirstName = 'Please enter your first name.';
      if (!data.parentLastName.trim()) errors.parentLastName = 'Please enter your last name.';
      if (!isValidEmail(data.email)) errors.email = 'Please enter a valid email address.';
      if (!isValidAustralianMobile(data.mobile)) errors.mobile = 'Please enter a valid mobile number.';
      if (!data.studentFirstName.trim()) errors.studentFirstName = 'Please enter your child’s first name.';
      if (!data.schoolYear || data.schoolYear < 1 || data.schoolYear > 12) {
        errors.schoolYear = 'Please select a school year.';
      }
      break;
    case 2:
      if (data.subjects.length === 0) errors.subjects = 'Please select at least one subject.';
      break;
    case 3:
      if (data.currentSituations.length === 0) {
        errors.currentSituations = 'Please tell us a little about their current situation.';
      }
      break;
    case 4:
      if (data.parentConcerns.length === 0 && !data.parentConcernNotes?.trim()) {
        errors.parentConcerns = 'Please tell us what prompted you to reach out.';
      }
      if (data.goals.length === 0 && !data.goalNotes?.trim()) {
        errors.goals = 'Please tell us what you would like to see improve.';
      }
      break;
    default:
      break;
  }

  return errors;
}
