import React from 'react';
import { Quote, Trophy, TrendingUp, Star } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface FeaturedStoryProps {
  name: string;
  appreciation?: string;
  advice?: string;
  achievements?: string[];
}

const FeaturedStory: React.FC<FeaturedStoryProps> = ({
  name,
  appreciation,
  advice,
  achievements = []
}) => {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
  
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-1">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 md:p-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left side - Student info */}
          <div className="md:w-1/3">
            <div className="flex flex-col items-center text-center">
              {/* Avatar */}
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl md:text-4xl font-bold mb-4 shadow-lg">
                {initials}
              </div>
              
              {/* Name */}
              <h3 className="text-2xl font-bold text-brand-midnight mb-2">{name}</h3>
              
              {/* Featured badge */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Star className="w-4 h-4 fill-current" />
                Featured Student
              </div>
              
              {/* Achievements */}
              {achievements.length > 0 && (
                <div className="space-y-2 w-full">
                  {achievements.map((achievement, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg text-sm">
                      <Trophy className="w-4 h-4 text-blue-600" />
                      <span className="text-brand-midnight/80">{achievement}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Right side - Content */}
          <div className="md:w-2/3 space-y-6">
            {/* Appreciation Section */}
            {appreciation && (
              <div className="relative">
                <div className="absolute -top-4 -left-2 text-6xl text-blue-200 opacity-50">
                  <Quote className="w-12 h-12" />
                </div>
                <div className="relative bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    <h4 className="text-lg font-semibold text-brand-midnight">What I Appreciate About DA Tuition</h4>
                  </div>
                  <div className="prose prose-base max-w-none text-brand-midnight/80">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                      {appreciation}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            )}
            
            {/* Advice Section */}
            {advice && (
              <div className="relative bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                    <Star className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-brand-midnight">My Advice for Current Students</h4>
                </div>
                <div className="prose prose-base max-w-none text-brand-midnight/80">
                  <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                    {advice}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedStory;