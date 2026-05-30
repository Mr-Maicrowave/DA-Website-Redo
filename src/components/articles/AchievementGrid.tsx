import React from "react";
import { cn } from "@/lib/utils";

export interface AchievementItem {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

interface AchievementGridProps extends React.HTMLAttributes<HTMLDivElement> {
  items: AchievementItem[];
}

const AchievementGrid: React.FC<AchievementGridProps> = ({ items, className, ...props }) => {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6", className)} {...props}>
      {items.map((item, idx) => (
        <div
          key={idx}
          className="rounded-xl border bg-white p-4 sm:p-5 shadow-sm flex items-start gap-3"
        >
          {item.icon && <div className="text-2xl sm:text-3xl">{item.icon}</div>}
          <div>
            <div className="text-base sm:text-lg font-semibold text-brand-midnight">{item.title}</div>
            {item.subtitle && (
              <div className="text-sm text-brand-midnight/80 mt-1">{item.subtitle}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AchievementGrid;
