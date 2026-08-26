export interface CoreTopic {
  id: string;
  label: string;
  blurb: string;
}

export interface DomainTopic {
  id: string;
  label: string;
  blurb: string;
  /** Fill used for this domain's node halo/bubble. */
  color: string;
  /** Fill used for this domain's (and its subtopics') solid dot. */
  dotColor: string;
  /** The one CoreTopic id this domain's edge connects back to. */
  corePrerequisite: string;
}

export interface Subtopic {
  id: string;
  parent: string;
  label: string;
  blurb: string;
}

export interface CrossLink {
  from: string; // Subtopic id
  to: string; // DomainTopic id
}

export const CORE_TOPICS: readonly CoreTopic[] = [
  { id: 'algebra', label: 'Algebra', blurb: 'The language every other branch is written in.' },
  { id: 'equations', label: 'Equations', blurb: 'Solving for the unknown — the core move behind almost every topic here.' },
  { id: 'integers', label: 'Integers', blurb: 'Whole numbers, positive and negative — the base number system.' },
  { id: 'directed-numbers', label: 'Directed Numbers', blurb: 'Sign rules used constantly from here out.' },
];

export const DOMAIN_TOPICS: readonly DomainTopic[] = [
  { id: 'functions', label: 'Functions', color: '#6fb3f0', dotColor: '#8ecdfb', corePrerequisite: 'equations', blurb: 'The bridge from algebra to calculus and graphing.' },
  { id: 'trig', label: 'Trigonometry', color: '#f2b25a', dotColor: '#f7c983', corePrerequisite: 'algebra', blurb: 'Angles, triangles and periodic behaviour.' },
  { id: 'calculus', label: 'Calculus', color: '#6fd6a8', dotColor: '#94e3c0', corePrerequisite: 'equations', blurb: 'Rates of change and accumulation.' },
  { id: 'probability', label: 'Probability', color: '#b48ef0', dotColor: '#c8aef7', corePrerequisite: 'directed-numbers', blurb: 'How likely events are.' },
  { id: 'statistics', label: 'Statistics', color: '#ef8fb0', dotColor: '#f4aec7', corePrerequisite: 'integers', blurb: 'Collecting, describing and interpreting data.' },
  { id: 'geometry', label: 'Geometry', color: '#5fd0d6', dotColor: '#8fe1e5', corePrerequisite: 'algebra', blurb: 'Shape, space and measurement.' },
  { id: 'financial', label: 'Financial Maths', color: '#e0c25a', dotColor: '#ecd587', corePrerequisite: 'directed-numbers', blurb: 'Interest, loans and growth.' },
];

export const SUBTOPICS: readonly Subtopic[] = [
  { id: 'venn-diagrams', parent: 'probability', label: 'Venn Diagrams', blurb: 'Visualising overlapping event sets.' },
  { id: 'tree-diagrams', parent: 'probability', label: 'Tree Diagrams', blurb: 'Mapping sequences of outcomes.' },
  { id: 'discrete-distributions', parent: 'probability', label: 'Discrete Distributions', blurb: 'Probability across countable outcomes.' },
  { id: 'continuous-distributions', parent: 'probability', label: 'Continuous Distributions', blurb: 'Probability across a continuous range.' },
  { id: 'differentiation', parent: 'calculus', label: 'Differentiation', blurb: 'Instantaneous rate of change.' },
  { id: 'integration', parent: 'calculus', label: 'Integration', blurb: 'Accumulating change.' },
  { id: 'polynomials', parent: 'functions', label: 'Polynomials', blurb: 'Functions built from powers of x.' },
  { id: 'exponentials-logs', parent: 'functions', label: 'Exponentials & Logs', blurb: 'Growth, decay, and their inverse.' },
  { id: 'trig-identities', parent: 'trig', label: 'Trig Identities', blurb: 'Relationships between sin, cos and tan.' },
  { id: 'non-right-angled-trig', parent: 'trig', label: 'Non-Right-Angled Trig', blurb: 'Sine and cosine rules.' },
  { id: 'bivariate-data', parent: 'statistics', label: 'Bivariate Data', blurb: 'Comparing two variables.' },
  { id: 'sampling', parent: 'statistics', label: 'Sampling', blurb: 'How data is collected.' },
  { id: 'circle-geometry', parent: 'geometry', label: 'Circle Geometry', blurb: 'Angle and chord properties.' },
  { id: 'similarity-congruence', parent: 'geometry', label: 'Similarity & Congruence', blurb: 'When shapes match in proportion.' },
  { id: 'compound-interest', parent: 'financial', label: 'Compound Interest', blurb: 'Growth applied repeatedly over time.' },
  { id: 'annuities-loans', parent: 'financial', label: 'Annuities & Loans', blurb: 'Regular payments modelled with equations.' },
];

export const CROSS_LINKS: readonly CrossLink[] = [
  { from: 'discrete-distributions', to: 'statistics' },
  { from: 'differentiation', to: 'trig' },
];
