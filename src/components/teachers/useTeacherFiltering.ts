import { useMemo } from 'react';
import type { Teacher, TeachingStyles } from '@/data/teachers';

interface TeacherWithMatch extends Teacher {
  matchPercentage?: number;
}

export const useTeacherFiltering = (
  teachers: Teacher[],
  preferences: TeachingStyles
) => {
  const filteredAndSortedTeachers = useMemo(() => {
    // Check if preferences are all neutral (5) - show all teachers without scoring
    const isNeutralPreferences = Object.values(preferences).every(val => val === 5);
    
    if (isNeutralPreferences) {
      return teachers.map(teacher => ({ ...teacher, matchPercentage: undefined }));
    }

    // Calculate match scores for each teacher
    const teachersWithScores: TeacherWithMatch[] = teachers.map(teacher => {
      if (!teacher.teachingStyles) {
        return { ...teacher, matchPercentage: 0 };
      }

      // Calculate compatibility score for each dimension
      const structuredScore = 10 - Math.abs(preferences.structured - teacher.teachingStyles.structured);
      const patientScore = 10 - Math.abs(preferences.patient - teacher.teachingStyles.patient);
      const traditionalScore = 10 - Math.abs(preferences.traditional - teacher.teachingStyles.traditional);
      const supportiveScore = 10 - Math.abs(preferences.supportive - teacher.teachingStyles.supportive);

      // Average the scores and convert to percentage
      const averageScore = (structuredScore + patientScore + traditionalScore + supportiveScore) / 4;
      const matchPercentage = Math.round((averageScore / 10) * 100);

      return {
        ...teacher,
        matchPercentage: Math.max(matchPercentage, 0) // Ensure non-negative
      };
    });

    // Sort by match percentage (highest first)
    return teachersWithScores.sort((a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0));
  }, [teachers, preferences]);

  // Check if any filtering is active
  const isFilteringActive = !Object.values(preferences).every(val => val === 5);

  return {
    filteredTeachers: filteredAndSortedTeachers,
    isFilteringActive
  };
};