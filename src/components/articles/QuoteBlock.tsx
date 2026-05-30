import React from "react";
import { cn } from "@/lib/utils";
import { Quote } from "lucide-react";

interface QuoteBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: boolean;
}

const QuoteBlock: React.FC<QuoteBlockProps> = ({ icon = true, className, children, ...props }) => {
  return (
    <div
      className={cn(
        "quote-callout rounded-r-xl",
        "bg-blue-50 border-l-4 border-blue-500 pl-5 sm:pl-6 py-3 sm:py-4 pr-4 sm:pr-5",
        "text-brand-midnight italic",
        className
      )}
      {...props}
    >
      <div className="flex items-start gap-3">
        {icon && <Quote className="h-5 w-5 mt-0.5 text-blue-400 flex-shrink-0" />}
        <div className="text-sm sm:text-base leading-relaxed">{children}</div>
      </div>
    </div>
  );
};

export default QuoteBlock;
