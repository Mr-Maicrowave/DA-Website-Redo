import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter, X } from 'lucide-react';

interface TeacherFiltersProps {
  subjects: string[];
  yearLevels: string[];
  selectedSubjects: string[];
  selectedYearLevels: string[];
  onSubjectToggle: (subject: string) => void;
  onYearLevelToggle: (yearLevel: string) => void;
  onClearAll: () => void;
}

export const TeacherFilters: React.FC<TeacherFiltersProps> = ({
  subjects,
  yearLevels,
  selectedSubjects,
  selectedYearLevels,
  onSubjectToggle,
  onYearLevelToggle,
  onClearAll
}) => {
  const hasActiveFilters = selectedSubjects.length > 0 || selectedYearLevels.length > 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Filter className="w-5 h-5 mr-2 text-brand-blue-dark" />
          <h3 className="text-lg font-semibold">Filter Teachers</h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="text-brand-midnight/70 hover:text-brand-midnight/80"
          >
            <X className="w-4 h-4 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      {/* Subject Filters */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-brand-midnight/80 mb-3">By Subject</h4>
        <div className="flex flex-wrap gap-2">
          {subjects.map((subject) => (
            <Badge
              key={subject}
              variant={selectedSubjects.includes(subject) ? "default" : "outline"}
              className={cn(
                "cursor-pointer transition-colors",
                selectedSubjects.includes(subject) 
                  ? "bg-brand-blue-dark hover:bg-brand-blue-dark/90" 
                  : "hover:bg-gray-100"
              )}
              onClick={() => onSubjectToggle(subject)}
            >
              {subject}
            </Badge>
          ))}
        </div>
      </div>

      {/* Year Level Filters */}
      <div>
        <h4 className="text-sm font-medium text-brand-midnight/80 mb-3">By Year Level</h4>
        <div className="flex flex-wrap gap-2">
          {yearLevels.map((yearLevel) => (
            <Badge
              key={yearLevel}
              variant={selectedYearLevels.includes(yearLevel) ? "default" : "outline"}
              className={cn(
                "cursor-pointer transition-colors",
                selectedYearLevels.includes(yearLevel) 
                  ? "bg-brand-blue-dark hover:bg-brand-blue-dark/90" 
                  : "hover:bg-gray-100"
              )}
              onClick={() => onYearLevelToggle(yearLevel)}
            >
              {yearLevel}
            </Badge>
          ))}
        </div>
      </div>

      {/* Active Filter Count */}
      {hasActiveFilters && (
        <div className="mt-4 text-sm text-brand-midnight/80">
          {selectedSubjects.length + selectedYearLevels.length} filter{selectedSubjects.length + selectedYearLevels.length !== 1 ? 's' : ''} active
        </div>
      )}
    </div>
  );
};

// Import cn utility
import { cn } from '@/lib/utils';