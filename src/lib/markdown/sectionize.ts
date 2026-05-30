/*
  Markdown sectionizer utility
  - Splits markdown into logical sections based on headings (## or ###)
  - Optionally merges the preface (content before the first heading) with the first section
  - Provides a paragraph-based fallback chunking helper for long prose without headings
*/

export type SplitBy = 'h2' | 'h3' | 'auto' | 'none'

export interface SectionizeOptions {
  splitBy?: SplitBy
  mergePrefaceWithFirst?: boolean
  maxCharsPerCard?: number
  maxParasPerCard?: number
}

/** Returns true if line starts a code fence ``` or ~~~ */
function isFenceStart(line: string): boolean {
  const trimmed = line.trim()
  return /^(```|~~~)/.test(trimmed)
}

/** Detect headings outside code fences */
function countHeadings(markdown: string) {
  const lines = markdown.replace(/\r\n?/g, '\n').split('\n')
  let inFence = false
  let h2 = 0
  let h3 = 0
  for (const line of lines) {
    if (isFenceStart(line)) {
      inFence = !inFence
      continue
    }
    if (inFence) continue
    if (/^##\s+/.test(line)) h2++
    else if (/^###\s+/.test(line)) h3++
  }
  return { h2, h3 }
}

/** Paragraph chunking fallback (keeps paragraph boundaries) */
function chunkParagraphs(
  markdown: string,
  maxParasPerCard?: number,
  maxCharsPerCard?: number,
): string[] {
  const text = markdown.trim()
  if (!text) return []
  const rawParas = text
    .replace(/\r\n?/g, '\n')
    .split(/\n\s*\n/) // split on blank line
    .map((p) => p.trim())
    .filter(Boolean)

  // Glue subheading-like lines to the following block to preserve logical units
  // Examples: "**Preparation Tips:**" + bullet list, or "#### Building Skills" + list/text
  const paras: string[] = []
  for (let i = 0; i < rawParas.length; i++) {
    const cur = rawParas[i]
    const next = rawParas[i + 1]
    const isBoldLabel = /^\*\*[^\n]+:\*\*\s*$/.test(cur)
    const isColonLabel = /:\s*$/.test(cur) && cur.length <= 120 && !/^#{1,6}\s+/.test(cur)
    const isH4Plus = /^#{4,6}\s+.+$/.test(cur)
    const nextIsList = !!next && /^(?:-|\*|\d+\.)\s+/.test(next)
    const nextIsAnyContent = !!next && !/^#{1,6}\s+/.test(next)
    const shouldGlue = (isBoldLabel || isColonLabel || isH4Plus) && (nextIsList || nextIsAnyContent)
    if (shouldGlue && next) {
      paras.push(`${cur}\n\n${next}`)
      i++ // skip next; it's glued
    } else {
      paras.push(cur)
    }
  }

  // If no limits provided, return a single chunk
  if (!maxParasPerCard && !maxCharsPerCard) return [paras.join('\n\n')]

  const out: string[] = []
  let buf: string[] = []
  let charCount = 0
  const pushBuf = () => {
    if (buf.length) out.push(buf.join('\n\n'))
    buf = []
    charCount = 0
  }

  for (const p of paras) {
    const nextChars = charCount + (buf.length ? 2 : 0) + p.length // +2 for the blank line join
    const exceedParas = maxParasPerCard ? buf.length >= maxParasPerCard : false
    const exceedChars = maxCharsPerCard ? nextChars > maxCharsPerCard : false
    if (exceedParas || exceedChars) pushBuf()
    buf.push(p)
    charCount = (buf.join('\n\n')).length
  }
  pushBuf()
  return out
}

/** Pick effective split mode based on content when splitBy='auto' */
function resolveSplitMode(markdown: string, requested: SplitBy): Exclude<SplitBy, 'auto'> {
  if (requested !== 'auto') return requested
  const { h2, h3 } = countHeadings(markdown)
  if (h2 > 0) return 'h2'
  if (h3 > 0) return 'h3'
  return 'none'
}

/** Split markdown by heading level, ignoring headings inside code fences */
function splitByHeading(markdown: string, level: 'h2' | 'h3'): string[] {
  const lines = markdown.replace(/\r\n?/g, '\n').split('\n')
  const out: string[] = []
  let buf: string[] = []
  let inFence = false
  const headingRegex = level === 'h2' ? /^##\s+/ : /^###\s+/

  const pushBuf = () => {
    if (buf.length) out.push(buf.join('\n'))
    buf = []
  }

  for (const line of lines) {
    if (isFenceStart(line)) {
      inFence = !inFence
      buf.push(line)
      continue
    }
    if (!inFence && headingRegex.test(line)) {
      // new section starts -> flush previous
      pushBuf()
      buf.push(line)
    } else {
      buf.push(line)
    }
  }
  pushBuf()

  // Drop empty/whitespace-only sections
  return out.map((s) => s.trim()).filter(Boolean)
}

export function sectionizeMarkdown(markdown: string, options: SectionizeOptions = {}): string[] {
  const {
    splitBy = 'auto',
    mergePrefaceWithFirst = false,
    maxCharsPerCard,
    maxParasPerCard,
  } = options

  const mode = resolveSplitMode(markdown, splitBy)

  if (mode === 'none') {
    // If thresholds provided, chunk; otherwise single section
    if (maxCharsPerCard || maxParasPerCard) {
      return chunkParagraphs(markdown, maxParasPerCard, maxCharsPerCard)
    }
    return [markdown]
  }

  const sections = splitByHeading(markdown, mode)
  if (!sections.length) return [markdown]

  // Handle preface (content before the first heading)
  // splitByHeading includes only sections starting with the chosen heading level.
  // Extract preface by removing everything up to the first matching heading from the original text.
  const normalized = markdown.replace(/\r\n?/g, '\n')
  const headingRegex = mode === 'h2' ? /^##\s+/m : /^###\s+/m
  const firstHeadingIndex = normalized.search(headingRegex)
  const preface = firstHeadingIndex > 0 ? normalized.slice(0, firstHeadingIndex).trim() : ''

  // Helper to chunk a single section while keeping the heading with the first chunk
  const headingLineRegex = mode === 'h2' ? /^##\s+.*$/m : /^###\s+.*$/m
  const chunkOneSection = (section: string): string[] => {
    if (!(maxCharsPerCard || maxParasPerCard)) return [section]
    const lines = section.replace(/\r\n?/g, '\n').split('\n')
    // Find first non-empty line
    const firstIdx = lines.findIndex((l) => l.trim().length > 0)
    if (firstIdx === -1) return [section]
    const firstLine = lines[firstIdx]
    if (!headingLineRegex.test(firstLine)) {
      // No heading at top; chunk entire section
      return chunkParagraphs(section, maxParasPerCard, maxCharsPerCard)
    }
    // Keep heading with first chunk and prefer splitting body by H3/H4 boundaries
    const bodyLines = lines.slice(firstIdx + 1)
    let inFence = false
    const blocks: string[] = []
    let buf: string[] = []
    const pushBlock = () => {
      if (buf.length) blocks.push(buf.join('\n').trim())
      buf = []
    }
    for (const ln of bodyLines) {
      if (isFenceStart(ln)) {
        inFence = !inFence
        buf.push(ln)
        continue
      }
      if (!inFence && (/^###\s+/.test(ln) || /^####\s+/.test(ln))) {
        // New sub-section boundary (H3/H4)
        pushBlock()
        buf.push(ln)
      } else {
        buf.push(ln)
      }
    }
    pushBlock()

    const nonEmptyBlocks = blocks.map((b) => b.trim()).filter(Boolean)
    if (!nonEmptyBlocks.length) {
      // Fallback to paragraph-based chunking of the body
      const chunks = chunkParagraphs(bodyLines.join('\n'), maxParasPerCard, maxCharsPerCard)
      if (!chunks.length) return [section]
      const [first, ...rest] = chunks
      const firstWithHeading = `${firstLine}\n\n${first}`
      return [firstWithHeading, ...rest]
    }

    // Atomic behavior: one card per H3/H4 block. If a single block exceeds thresholds,
    // split within that block by paragraphs. This ensures e.g. each "### Year X NAPLAN"
    // renders as its own card.
    const outChunks: string[] = []
    for (const block of nonEmptyBlocks) {
      const paraCount = block.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean).length
      const overParas = maxParasPerCard ? paraCount > maxParasPerCard : false
      const overChars = maxCharsPerCard ? block.length > maxCharsPerCard : false
      if (overParas || overChars) {
        outChunks.push(...chunkParagraphs(block, maxParasPerCard, maxCharsPerCard))
      } else {
        outChunks.push(block)
      }
    }

    if (!outChunks.length) return [section]
    const [firstChunk, ...restChunks] = outChunks
    const firstWithHeading = `${firstLine}\n\n${firstChunk}`
    return [firstWithHeading, ...restChunks]
  }

  let finalSections = sections

  if (preface) {
    if (mergePrefaceWithFirst) {
      finalSections[0] = `${preface}\n\n${finalSections[0]}`
    } else {
      finalSections = [preface, ...finalSections]
    }
  }

  // Apply within-section chunking when thresholds present
  if (maxCharsPerCard || maxParasPerCard) {
    const expanded: string[] = []
    for (const s of finalSections) {
      const parts = chunkOneSection(s)
      expanded.push(...parts)
    }
    return expanded
  }

  return finalSections
}

export const __private = { countHeadings, chunkParagraphs, splitByHeading, resolveSplitMode }
