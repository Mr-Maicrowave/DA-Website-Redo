import { getInterviewLabels } from './labels.ts';
import { getSchoolStage, sanitiseDataForYear } from './model.ts';
import { buildInterviewSummary } from './summary.ts';
import type { InterviewFormData, InterviewSubmissionPayload } from './types.ts';

export function buildInterviewPayload(
  source: InterviewFormData,
  completedAt = new Date().toISOString(),
): InterviewSubmissionPayload {
  const data = source.schoolYear
    ? sanitiseDataForYear(source, source.schoolYear)
    : source;
  const schoolStage = getSchoolStage(data.schoolYear);

  return {
    parent: {
      title: data.parentTitle,
      firstName: data.parentFirstName,
      lastName: data.parentLastName,
      email: data.email,
      mobile: data.mobile,
      preferredContactMethod: data.preferredContactMethod,
      relationshipToStudent: data.relationshipToStudent,
    },
    student: {
      firstName: data.studentFirstName,
      schoolYear: data.schoolYear,
      schoolStage,
      schoolName: data.schoolName,
      suburb: data.suburb,
    },
    learningProfile: {
      subjects: [...data.subjects],
      subjectAreas: Object.fromEntries(
        Object.entries(data.subjectAreas).map(([key, values]) => [key, [...values]]),
      ),
      currentSituations: [...data.currentSituations],
      currentResults: data.currentResults,
      currentResultsNotes: data.currentResultsNotes,
      schoolworkDifficulty: data.schoolworkDifficulty,
      recentChanges: data.recentChanges,
      confidence: data.confidence,
      behavioursObserved: [...data.behavioursObserved],
      learningChallenges: [...data.learningChallenges],
      learningChallengesOther: data.learningChallengesOther,
    },
    parentPerspective: {
      concerns: [...data.parentConcerns],
      notes: data.parentConcernNotes,
      goals: [...data.goals],
      goalNotes: data.goalNotes,
    },
    previousTutoring: {
      hasHadTutoringBefore: data.hasHadTutoringBefore,
      workedWell: data.previousTutoringWorked,
      issues: [...data.previousTutoringIssues],
    },
    preferences: {
      formats: [...data.preferredFormats],
      tutorPreferences: [...data.tutorPreferences],
      tutorPreferenceNotes: data.tutorPreferenceNotes,
    },
    additionalNotes: data.anythingElse,
    metadata: {
      startedAt: data.startedAt,
      completedAt,
      schoolStage,
    },
    summary: buildInterviewSummary(data),
    title: data.parentTitle,
    firstName: data.parentFirstName,
    lastName: data.parentLastName,
    email: data.email,
    mobile: data.mobile,
    preferredContact: data.preferredContactMethod
      ? getInterviewLabels([data.preferredContactMethod]).join(', ')
      : '',
    relationship: data.relationshipToStudent ?? '',
    suburb: data.suburb ?? '',
    studentFirstName: data.studentFirstName,
    yearLevel: data.schoolYear ? `Year ${data.schoolYear}` : '',
    school: data.schoolName ?? '',
    subject: getInterviewLabels(data.subjects).join(', '),
    tutoringFormat: getInterviewLabels(data.preferredFormats).join(', '),
  };
}
