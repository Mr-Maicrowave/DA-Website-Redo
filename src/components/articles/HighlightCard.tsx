import React from "react";
import { cn } from "@/lib/utils";

interface HighlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  eyebrow?: string;
  imageSrc?: string;
  imageAlt?: string;
  gradientTop?: boolean;
}

const HighlightCard: React.FC<HighlightCardProps> = ({
  title,
  eyebrow,
  imageSrc,
  imageAlt,
  gradientTop = true,
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        "relative rounded-2xl border bg-white shadow-sm overflow-hidden",
        "p-5 sm:p-6 md:p-8",
        className
      )}
      {...props}
    >
      {gradientTop && (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-blue-500/70 to-purple-500/70" />
      )}

      {(eyebrow || title) && (
        <div className="mb-3">
          {eyebrow && (
            <div className="text-xs uppercase tracking-wider text-brand-midnight/70 mb-1">{eyebrow}</div>
          )}
          {title && (
            <h3 className="text-lg sm:text-xl font-semibold text-brand-midnight">{title}</h3>
          )}
        </div>
      )}

      {imageSrc && (
        <div className="mb-4 -mx-5 sm:-mx-6 md:-mx-8">
          <img src={imageSrc} alt={imageAlt || ""} className="w-full h-auto object-cover" loading="lazy" />
        </div>
      )}

      <div className="text-brand-midnight/80 leading-relaxed text-sm sm:text-base">{children}</div>
    </div>
  );
};

export default HighlightCard;
