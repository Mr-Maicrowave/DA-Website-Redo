export interface DaMethodStep {
  id: string;
  num: string;
  node: string;
  cx: number;
  cy: number;
  title: string;
  sentence: string;
  bullets: string[];
  result: string;
}

/**
 * Reusable DA Method copy. The standalone method section consumes this now;
 * the Science scroll story can reuse individual steps when it is expanded.
 */
export const DA_METHOD_STEPS: DaMethodStep[] = [
  {
    id: 'decode',
    num: '01',
    node: 'Decode',
    cx: 250,
    cy: 68,
    title: 'Decode the Question',
    sentence: 'Students learn what the exam is actually asking before they attempt to answer it.',
    bullets: [
      'Identify command words (describe, explain, evaluate, assess)',
      'Locate exactly where marks are allocated in the question',
      'Understand what the marker expects to see — before writing a word',
    ],
    result: 'Answer with precision, not assumption.',
  },
  {
    id: 'understand',
    num: '02',
    node: 'Understand',
    cx: 432,
    cy: 240,
    title: 'Build Real Understanding',
    sentence: 'We teach the reasoning behind every concept — not just the steps to follow.',
    bullets: [
      'Connect new ideas to what students already know',
      'Ask "why" before memorising "how"',
      'Build knowledge that holds under exam pressure',
    ],
    result: 'Content that stays — even inside the exam room.',
  },
  {
    id: 'practise',
    num: '03',
    node: 'Practise',
    cx: 250,
    cy: 412,
    title: 'Deliberate Practice',
    sentence: 'Students practise exactly the problems they will face — under exam conditions.',
    bullets: [
      'Timed exam-style questions in every session',
      'Targeted feedback on each attempt, not just a mark',
      'Build speed without sacrificing accuracy',
    ],
    result: 'Exam readiness — not just topic familiarity.',
  },
  {
    id: 'refine',
    num: '04',
    node: 'Refine',
    cx: 68,
    cy: 240,
    title: 'Refine Until Reliable',
    sentence: 'Gaps are found, addressed, and retested until performance is consistent.',
    bullets: [
      'Identify which topics cost the most marks',
      'Close specific gaps with targeted review',
      'Confirm improvement before moving forward',
    ],
    result: 'Marks that improve — and stay improved.',
  },
];
