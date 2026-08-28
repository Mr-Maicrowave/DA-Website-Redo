export type SchoolStage = 'primary' | 'high-school' | 'hsc';
export type ContactMethod = 'phone' | 'sms' | 'email' | 'no-preference';
export type LearningFormat = 'private' | 'small-group' | 'class' | 'advanced' | 'not-sure';
export type ConfidenceLevel =
  | 'avoids-subject'
  | 'very-unsure'
  | 'mixed'
  | 'generally-confident'
  | 'very-confident';
export type SubmissionStatus = 'idle' | 'submitting' | 'success' | 'error';

export type Option<T extends string = string> = Readonly<{
  value: T;
  label: string;
}>;

export interface InterviewFormData {
  parentTitle?: string;
  parentFirstName: string;
  parentLastName: string;
  email: string;
  mobile: string;
  preferredContactMethod?: ContactMethod;
  relationshipToStudent?: string;
  studentFirstName: string;
  schoolYear: number | null;
  schoolName?: string;
  suburb?: string;
  subjects: string[];
  subjectAreas: Record<string, string[]>;
  currentSituations: string[];
  currentResults?: string;
  currentResultsNotes?: string;
  schoolworkDifficulty?: string;
  recentChanges?: string;
  confidence?: ConfidenceLevel;
  behavioursObserved: string[];
  learningChallenges: string[];
  learningChallengesOther?: string;
  parentConcerns: string[];
  parentConcernNotes?: string;
  goals: string[];
  goalNotes?: string;
  hasHadTutoringBefore?: boolean;
  previousTutoringWorked?: string;
  previousTutoringIssues: string[];
  preferredFormats: LearningFormat[];
  tutorPreferences: string[];
  tutorPreferenceNotes?: string;
  anythingElse?: string;
  startedAt?: string;
  completedAt?: string;
}

export interface InterviewSessionState {
  version: 1;
  currentStep: number;
  data: InterviewFormData;
}

export interface InterviewSubmissionPayload {
  parent: {
    title?: string;
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    preferredContactMethod?: ContactMethod;
    relationshipToStudent?: string;
  };
  student: {
    firstName: string;
    schoolYear: number | null;
    schoolStage: SchoolStage | null;
    schoolName?: string;
    suburb?: string;
  };
  learningProfile: {
    subjects: string[];
    subjectAreas: Record<string, string[]>;
    currentSituations: string[];
    currentResults?: string;
    currentResultsNotes?: string;
    schoolworkDifficulty?: string;
    recentChanges?: string;
    confidence?: ConfidenceLevel;
    behavioursObserved: string[];
    learningChallenges: string[];
    learningChallengesOther?: string;
  };
  parentPerspective: {
    concerns: string[];
    notes?: string;
    goals: string[];
    goalNotes?: string;
  };
  previousTutoring: {
    hasHadTutoringBefore?: boolean;
    workedWell?: string;
    issues: string[];
  };
  preferences: {
    formats: LearningFormat[];
    tutorPreferences: string[];
    tutorPreferenceNotes?: string;
  };
  additionalNotes?: string;
  metadata: {
    startedAt?: string;
    completedAt: string;
    schoolStage: SchoolStage | null;
  };
  summary: string;
  title?: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  preferredContact: string;
  relationship: string;
  suburb: string;
  studentFirstName: string;
  yearLevel: string;
  school: string;
  subject: string;
  tutoringFormat: string;
}

export type SubmitInterview = (
  payload: InterviewSubmissionPayload,
) => Promise<{ ok: true; submissionId?: string }>;

export interface StageConfig {
  subjects: readonly Option[];
  goals: readonly Option[];
}
