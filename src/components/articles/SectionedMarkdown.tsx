import React from 'react'
import ReactMarkdown, { Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { sectionizeMarkdown, SectionizeOptions } from '@/lib/markdown/sectionize'

export type SectionedTheme = 'study' | 'english' | 'science' | 'math' | 'parenting' | 'neutral'
export type SectionedMode = 'cards' | 'flow'

export interface SectionedMarkdownProps {
  markdown: string
  splitBy?: SectionizeOptions['splitBy']
  mergePrefaceWithFirst?: boolean
  maxCharsPerCard?: number
  maxParasPerCard?: number
  mode?: SectionedMode
  theme?: SectionedTheme
  variants?: string[]
  components?: Partial<Components>
}

const defaultVariantsByTheme: Record<SectionedTheme, string[]> = {
  study: ['study-card-mint', 'study-card-blue', 'study-card-cream'],
  english: ['english-card-lilac', 'english-card-peach', 'english-card-sky'],
  science: ['science-card-mint', 'science-card-lime', 'science-card-ice'],
  math: ['math-card-ivory', 'math-card-slate', 'math-card-sky'],
  parenting: ['parenting-card-blush', 'parenting-card-sand', 'parenting-card-sky'],
  neutral: ['neutral-card'],
}

export default function SectionedMarkdown({
  markdown,
  splitBy = 'auto',
  mergePrefaceWithFirst = false,
  maxCharsPerCard,
  maxParasPerCard,
  mode = 'cards',
  theme = 'neutral',
  variants,
  components,
}: SectionedMarkdownProps) {
  const sections = sectionizeMarkdown(markdown, {
    splitBy,
    mergePrefaceWithFirst,
    maxCharsPerCard,
    maxParasPerCard,
  })

  if (mode === 'flow') {
    return (
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={components}>
        {markdown}
      </ReactMarkdown>
    )
  }

  const usedVariants = variants && variants.length > 0 ? variants : defaultVariantsByTheme[theme]

  return (
    <div className="space-y-6">
      {sections.map((section, idx) => (
        <div key={idx} className={`rounded-2xl p-6 md:p-8 border shadow-sm ${usedVariants[idx % usedVariants.length]}`}>
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={components}>
            {section}
          </ReactMarkdown>
        </div>
      ))}
    </div>
  )
}
