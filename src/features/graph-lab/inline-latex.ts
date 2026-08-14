export type InlineLatexSegment = {
  type: 'text' | 'math';
  value: string;
};

export const splitInlineLatex = (content: string): InlineLatexSegment[] => {
  const segments: InlineLatexSegment[] = [];
  const pattern = /\\\((.+?)\\\)/g;
  let cursor = 0;

  for (const match of content.matchAll(pattern)) {
    const index = match.index ?? 0;
    if (index > cursor) segments.push({ type: 'text', value: content.slice(cursor, index) });
    segments.push({ type: 'math', value: match[1] });
    cursor = index + match[0].length;
  }

  if (cursor < content.length) segments.push({ type: 'text', value: content.slice(cursor) });
  return segments.length ? segments : [{ type: 'text', value: content }];
};
