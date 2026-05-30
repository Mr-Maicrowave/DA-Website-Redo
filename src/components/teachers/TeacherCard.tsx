import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Teacher } from '@/data/teachers';

export interface TeacherCardProps {
  teacher: Teacher;
  variant?: 'showcase' | 'discovery';
  className?: string;
  onSelect?: (teacher: Teacher) => void;
  style?: React.CSSProperties;
}

import { motion } from 'framer-motion';

export const TeacherCard: React.FC<TeacherCardProps> = ({
  teacher,
  variant = 'showcase',
  className,
  onSelect,
  style
}) => {
  const handleClick = () => {
    if (onSelect) {
      onSelect(teacher);
    }
  };

  if (variant === 'discovery') {
    return (
      <div
        className={cn("group h-[500px] w-full [perspective:1000px]", className)}
        style={style}
      >
        <motion.div
          className="relative h-full w-full transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]"
        >
          {/* FRONT FACE */}
          <div className="absolute inset-0 h-full w-full rounded-2xl bg-white shadow-lg [backface-visibility:hidden] overflow-hidden">
            {/* Image Container */}
            <div className="relative h-56 overflow-hidden">
              <img
                src={teacher.image}
                alt={teacher.name}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-xl font-bold text-white">{teacher.name}</h3>
                <p className="text-blue-100 text-sm">{teacher.subject}</p>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-5 flex flex-col h-[calc(100%-14rem)] justify-between">
              <div>
                {/* Teaching Attributes */}
                {teacher.teachingAttributes && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {teacher.teachingAttributes.map((attr, i) => (
                      <Badge key={i} variant="secondary" className="text-xs bg-brand-soft text-brand-midnight">
                        {attr}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Student Review */}
                <div className="bg-blue-50 rounded-lg p-3 mb-4">
                  <div className="flex items-center mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-brand-spark fill-brand-spark mr-1" />
                    ))}
                  </div>
                  <p className="text-xs italic text-brand-midnight/80 line-clamp-3">
                    "{teacher.testimonial}"
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center text-sm text-brand-highlight font-medium">
                Hover to reveal profile <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </div>

          {/* BACK FACE */}
          <div className="absolute inset-0 h-full w-full rounded-2xl bg-brand-midnight text-white shadow-xl [transform:rotateY(180deg)] [backface-visibility:hidden] overflow-hidden flex flex-col">
            <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
              <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
                <h3 className="text-xl font-bold">{teacher.name}</h3>
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <span className="text-xl">🎓</span>
                </div>
              </div>

              {/* Philosophy */}
              <div className="mb-6">
                <h4 className="text-xs uppercase tracking-widest text-brand-highlight mb-2 font-bold">Teaching Philosophy</h4>
                <p className="text-sm text-gray-300 leading-relaxed italic">
                  "{teacher.philosophy}"
                </p>
              </div>

              {/* Achievements */}
              {teacher.achievements && (
                <div className="mb-6">
                  <h4 className="text-xs uppercase tracking-widest text-brand-highlight mb-2 font-bold">Key Achievements</h4>
                  <ul className="space-y-2">
                    {teacher.achievements.map((item, i) => (
                      <li key={i} className="flex items-start text-sm text-gray-300">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-spark mt-1.5 mr-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Badges */}
              {teacher.badges && (
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-brand-highlight mb-2 font-bold">Expertise</h4>
                  <div className="flex flex-wrap gap-2">
                    {teacher.badges.map((badge) => (
                      <div key={badge.id} className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1 text-xs">
                        <span>{badge.icon}</span>
                        <span>{badge.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-white/5 border-t border-white/10">
              <Button
                className="w-full bg-brand-highlight hover:bg-brand-highlight/90 text-white group"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick();
                }}
              >
                Book Interview
                <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // For showcase variant, return null as it will be handled by the existing Teachers component
  // This allows gradual migration
  return null;
};