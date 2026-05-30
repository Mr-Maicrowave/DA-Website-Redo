import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Heart, Lightbulb } from 'lucide-react';

interface StudentData {
    slug: string;
    name: string;
    appreciation?: string;
    advice?: string;
}

interface StudentAppreciationCardProps {
    student: StudentData;
    index: number;
}

export const StudentAppreciationCard: React.FC<StudentAppreciationCardProps> = ({ student }) => {
    return (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-stone-300">
            <div className="h-1 bg-gradient-to-r from-amber-400 via-rose-300 to-purple-400" />

            <div className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-stone-900">{student.name}</h2>
                    <span className="uppercase tracking-[0.15em] text-[10px] font-semibold text-stone-400">
                        Student Wisdom
                    </span>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Appreciation */}
                    <div className="bg-stone-50 rounded-xl p-5 border border-stone-100">
                        <h3 className="text-sm font-semibold text-stone-700 mb-3 flex items-center gap-2">
                            <Heart className="w-4 h-4 text-amber-500" />
                            Appreciation
                        </h3>
                        <div className="prose max-w-none prose-sm text-stone-600 leading-relaxed">
                            {student.appreciation ? (
                                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                                    {student.appreciation}
                                </ReactMarkdown>
                            ) : (
                                <p className="text-stone-400 italic">No appreciation provided.</p>
                            )}
                        </div>
                    </div>

                    {/* Advice */}
                    <div className="bg-stone-50 rounded-xl p-5 border border-stone-100">
                        <h3 className="text-sm font-semibold text-stone-700 mb-3 flex items-center gap-2">
                            <Lightbulb className="w-4 h-4 text-amber-500" />
                            Advice
                        </h3>
                        <div className="prose max-w-none prose-sm text-stone-600 leading-relaxed">
                            {student.advice ? (
                                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                                    {student.advice}
                                </ReactMarkdown>
                            ) : (
                                <p className="text-stone-400 italic">No advice provided.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
