import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Heart, Lightbulb, Quote } from 'lucide-react';

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

/** A single note card — used for both the Appreciation and Advice excerpts */
function Note({
    icon: Icon,
    label,
    content,
    variant = 'gold',
}: {
    icon: React.ElementType;
    label: string;
    content?: string;
    variant?: 'gold' | 'green' | 'pink';
}) {
    const themes = {
        gold: { bg: 'bg-[#fff6e7]', accent: 'text-[#c9a227]', quote: 'text-[#c9a227]' },
        green: { bg: 'bg-[#eef6ec]', accent: 'text-[#3a8a55]', quote: 'text-[#3a8a55]' },
        pink: { bg: 'bg-[#fbeef1]', accent: 'text-[#b3637e]', quote: 'text-[#b3637e]' },
    } as const;
    const theme = themes[variant];

    return (
        <div className={`relative rounded-2xl border border-[#071629]/8 ${theme.bg} p-5 shadow-sm md:p-6`}>
            <Quote className={`pointer-events-none absolute right-4 top-3 h-10 w-10 opacity-[0.12] ${theme.quote}`} />
            <h3 className={`mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] ${theme.accent}`}>
                <Icon className="h-4 w-4" />
                {label}
            </h3>
            <div className="prose prose-sm relative z-10 max-w-none leading-relaxed text-[#61708a]">
                {content ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                        {content}
                    </ReactMarkdown>
                ) : (
                    <p className="italic text-[#61708a]/50">Not provided.</p>
                )}
            </div>
        </div>
    );
}

export const StudentAppreciationCard: React.FC<StudentAppreciationCardProps> = ({ student, index }) => {
    const isLeft = index % 2 === 0;

    return (
        <div className={`relative flex flex-col md:items-start gap-4 md:gap-0 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
            {/* timeline node — desktop only */}
            <div className="hidden md:flex absolute left-1/2 top-0 z-10 -translate-x-1/2 h-12 w-12 items-center justify-center rounded-full border-4 border-[#fffdf8] bg-[#071629] font-serif text-base font-medium text-[#f1df9a] shadow-md">
                {student.name.charAt(0)}
            </div>

            {/* mobile name row */}
            <div className="flex items-center gap-3 md:hidden">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#071629] font-serif text-sm font-medium text-[#f1df9a]">
                    {student.name.charAt(0)}
                </div>
                <h2 className="font-serif text-lg font-medium text-[#071629]">{student.name}</h2>
            </div>

            <div className={`w-full md:w-[calc(50%-2.25rem)] ${isLeft ? 'md:pr-9' : 'md:pl-9'}`}>
                <h2
                    className={`hidden md:block mb-4 font-serif text-xl font-medium text-[#071629] ${isLeft ? 'text-right' : 'text-left'}`}
                >
                    {student.name}
                </h2>
                <div className="space-y-4">
                    <Note icon={Heart} label="Appreciation" content={student.appreciation} variant={isLeft ? 'gold' : 'pink'} />
                    <Note icon={Lightbulb} label="Advice" content={student.advice} variant="green" />
                </div>
            </div>

            {/* spacer for the opposite half on desktop so the timeline stays centered */}
            <div className="hidden md:block w-[calc(50%-2.25rem)]" />
        </div>
    );
};
