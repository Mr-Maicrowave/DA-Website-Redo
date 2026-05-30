import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Quote, Lightbulb } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface StudentStoryCardProps {
  name: string;
  appreciation?: string;
  advice?: string;
  slug: string;
}

const StudentStoryCard: React.FC<StudentStoryCardProps> = ({
  name,
  appreciation,
  advice,
  slug
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
  
  // Truncate text for preview
  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
  };
  
  return (
    <div className="group relative overflow-hidden rounded-xl bg-white shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Gradient border effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative bg-white m-[1px] rounded-xl p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
            {initials}
          </div>
          
          {/* Name */}
          <h3 className="text-lg font-semibold text-brand-midnight flex-1">{name}</h3>
        </div>
        
        {/* Content Preview/Full */}
        <div className="space-y-4">
          {/* Appreciation */}
          {appreciation && (
            <div className="relative">
              <div className="flex items-start gap-2 mb-2">
                <Quote className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-xs uppercase tracking-wide text-blue-600 font-medium mb-1">
                    Appreciation
                  </div>
                  <div className="prose prose-sm max-w-none text-brand-midnight/80">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                      {isExpanded ? appreciation : truncateText(appreciation)}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Advice */}
          {advice && (
            <div className="relative">
              <div className="flex items-start gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-purple-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-xs uppercase tracking-wide text-purple-600 font-medium mb-1">
                    Advice
                  </div>
                  <div className="prose prose-sm max-w-none text-brand-midnight/80">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                      {isExpanded ? advice : truncateText(advice, 100)}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Expand/Collapse Button */}
        {(appreciation && appreciation.length > 150) || (advice && advice.length > 100) ? (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-4 w-full flex items-center justify-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            {isExpanded ? (
              <>
                <span>Show less</span>
                <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Read more</span>
                <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default StudentStoryCard;