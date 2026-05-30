import React from "react";
import { cn } from "@/lib/utils";
import { User, Quote } from "lucide-react";

interface InterviewQAProps extends React.HTMLAttributes<HTMLDivElement> {
  number?: number;
  question: string;
  answer: string | React.ReactNode;
  pullQuote?: string;
}

const InterviewQA: React.FC<InterviewQAProps> = ({ number, question, answer, pullQuote, className, ...props }) => {
  return (
    <article className={cn("grid lg:grid-cols-12 gap-6 lg:gap-8 items-start", className)} {...props}>
      <div className="lg:col-span-5">
        <div className="sticky lg:top-24">
          {typeof number === "number" && (
            <div className="text-5xl lg:text-7xl font-bold text-brand-blue-light/20 leading-none mb-2">
              {String(number).padStart(2, "0")}
            </div>
          )}
          <h3 className="text-lg lg:text-2xl font-semibold text-brand-midnight leading-snug">
            {question}
          </h3>
        </div>
      </div>
      <div className="lg:col-span-7">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 sm:p-6 lg:p-8 shadow-sm border border-white/50">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-brand-blue-dark to-brand-blue-light rounded-full flex items-center justify-center mr-3 sm:mr-4 shadow-md">
              <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <p className="font-semibold text-brand-midnight text-sm sm:text-base">Response</p>
              <p className="text-xs sm:text-sm text-brand-midnight/80">DA Tuition Principal & Founder</p>
            </div>
          </div>
          <div className="prose prose-sm sm:prose lg:prose-lg max-w-none">
            <p className="text-brand-midnight/80 leading-relaxed">{answer}</p>
          </div>
          {pullQuote && (
            <div className="mt-5 sm:mt-6 pl-5 sm:pl-6 border-l-4 border-orange-300">
              <Quote className="text-orange-300 mb-2" size={22} />
              <p className="text-base sm:text-lg font-medium text-brand-midnight/80 italic">{pullQuote}</p>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default InterviewQA;
