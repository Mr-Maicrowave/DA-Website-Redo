export type HscStreamId =
  | 'standard'
  | 'advanced'
  | 'extension-1'
  | 'extension-2';

export interface HscStream {
  id: HscStreamId;
  name: string;
  shortDescriptor: string;
  badge: string;
  availability: string;
  year12Only: boolean;
  prerequisites: string[];
  bestFit: string;
  whatChanges: string;
  helpNeeded: string;
  daSupport: string;
  topics: string[];
  color: string;
  vividColor: string;
}

const ACTIVE_PATHS: Record<HscStreamId, HscStreamId[]> = {
  standard: ['standard'],
  advanced: ['advanced'],
  'extension-1': ['advanced', 'extension-1'],
  'extension-2': ['advanced', 'extension-1', 'extension-2'],
};

export const HSC_STREAMS: HscStream[] = [
  {
    id: 'standard',
    name: 'Standard 1 & 2',
    shortDescriptor: 'No calculus',
    badge: 'Practical mathematics without calculus',
    availability: 'Years 11–12',
    year12Only: false,
    prerequisites: [],
    bestFit: 'Students who want practical mathematics and are heading towards study or work that does not require calculus.',
    whatChanges: 'The course emphasises financial mathematics, measurement, networks and statistics rather than abstract proof or calculus.',
    helpNeeded: 'Choosing efficient methods, interpreting unfamiliar contexts and avoiding small errors across multi-part questions.',
    daSupport: 'We connect each method to a real question type, then build accuracy and checking habits under assessment conditions.',
    topics: ['Financial mathematics', 'Statistical analysis', 'Networks and measurement'],
    color: '#c9921b',
    vividColor: '#f2a90d',
  },
  {
    id: 'advanced',
    name: 'Advanced',
    shortDescriptor: 'Calculus foundation',
    badge: 'Calculus for quantitative pathways',
    availability: 'Years 11–12',
    year12Only: false,
    prerequisites: [],
    bestFit: 'Students who are comfortable with algebra and want to keep quantitative university pathways open.',
    whatChanges: 'Calculus is introduced alongside more demanding work with functions, trigonometry, sequences and probability.',
    helpNeeded: 'Moving beyond memorised procedures, connecting representations and explaining why a method applies.',
    daSupport: 'We make calculus visual and structured, then develop the flexible problem-solving required for unfamiliar exam questions.',
    topics: ['Differential and integral calculus', 'Functions and trigonometry', 'Sequences and random variables'],
    color: '#2f8f69',
    vividColor: '#0aa876',
  },
  {
    id: 'extension-1',
    name: 'Extension 1',
    shortDescriptor: 'With Advanced',
    badge: 'Studied alongside Advanced',
    availability: 'Years 11–12 · with Advanced',
    year12Only: false,
    prerequisites: ['Advanced'],
    bestFit: 'Students who are confident in Advanced and want deeper problem-solving, proof and calculus.',
    whatChanges: 'Extension 1 adds proof, vectors, combinatorics and harder calculus while students continue the full Advanced course.',
    helpNeeded: 'Recognising hidden structures, sustaining multi-step reasoning and writing complete mathematical arguments.',
    daSupport: 'We teach the thinking between steps, not just the final technique, then refine proof and difficult-question strategy.',
    topics: ['Proof and vectors', 'Further calculus', 'Combinatorics and polynomials'],
    color: '#297dbf',
    vividColor: '#1c8ff2',
  },
  {
    id: 'extension-2',
    name: 'Extension 2',
    shortDescriptor: 'Year 12 only',
    badge: 'Requires Advanced + Extension 1',
    availability: 'Year 12 only',
    year12Only: true,
    prerequisites: ['Advanced', 'Extension 1'],
    bestFit: 'Students who already thrive in Extension 1 and genuinely enjoy abstract, rigorous mathematics.',
    whatChanges: 'Extension 2 begins in Year 12 and adds complex numbers, mechanics, deeper integration and more demanding proof.',
    helpNeeded: 'Turning insight into rigorous working, choosing a path through unfamiliar problems and maintaining precision under pressure.',
    daSupport: 'Specialist teachers make advanced ideas accessible, strengthen proof writing and build calm strategies for the hardest questions.',
    topics: ['Complex numbers', 'Proof and further integration', 'Vectors and mechanics'],
    color: '#8051bf',
    vividColor: '#9c4bea',
  },
];

export function getHscStream(id: HscStreamId): HscStream {
  const stream = HSC_STREAMS.find((candidate) => candidate.id === id);
  if (!stream) throw new Error(`Unknown HSC stream: ${id}`);
  return stream;
}

export function getActivePath(id: HscStreamId): HscStreamId[] {
  return [...ACTIVE_PATHS[id]];
}
