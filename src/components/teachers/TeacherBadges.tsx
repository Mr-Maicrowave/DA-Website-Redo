import React from 'react';
import { Badge } from '@/components/ui/badge';
import type { Badge as TeacherBadge } from '@/data/teachers';

interface TeacherBadgesProps {
  badges: TeacherBadge[];
  maxDisplay?: number;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}

export const TeacherBadges: React.FC<TeacherBadgesProps> = ({
  badges,
  maxDisplay = 3,
  size = 'sm',
  showTooltip = true
}) => {
  if (!badges || badges.length === 0) return null;

  const displayBadges = badges.slice(0, maxDisplay);
  const hasMore = badges.length > maxDisplay;

  const getBadgeSize = () => {
    switch (size) {
      case 'lg':
        return 'px-3 py-2 text-sm';
      case 'md':
        return 'px-2 py-1 text-xs';
      case 'sm':
      default:
        return 'px-2 py-1 text-xs';
    }
  };

  return (
    <div className="flex flex-wrap gap-1">
      {displayBadges.map((badge) => (
        <div
          key={badge.id}
          className="group relative"
          title={showTooltip ? badge.description : undefined}
        >
          <Badge
            variant="secondary"
            className={`${badge.color} ${getBadgeSize()} font-medium border-0 hover:scale-105 transition-transform cursor-help`}
          >
            <span className="mr-1">{badge.icon}</span>
            {badge.title}
          </Badge>
          
          {/* Tooltip */}
          {showTooltip && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
              {badge.description}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-l-transparent border-r-transparent border-t-gray-900"></div>
            </div>
          )}
        </div>
      ))}
      
      {hasMore && (
        <Badge
          variant="outline"
          className={`${getBadgeSize()} text-brand-midnight/70 border-gray-300`}
        >
          +{badges.length - maxDisplay}
        </Badge>
      )}
    </div>
  );
};