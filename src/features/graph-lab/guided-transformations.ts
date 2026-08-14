import type { ParameterKey } from './equation-presets.ts';

export const GUIDED_STORAGE_KEY = 'da-graph-lab-guided-v1';
export const GUIDED_SELECT_PLACEHOLDER = 'Choose an answer';

export type GraphLabMode = 'guided' | 'free';
export type GuidedPhase = 'predict' | 'experiment' | 'explain' | 'review';
export type MasteryStatus = 'secure' | 'developing' | 'revisit';

export type PredictionOption = { id: string; label: string };
export type ExplanationField = {
  id: string;
  prompt: string;
  options: PredictionOption[];
  correctId: string;
};

export type GuidedStep = {
  id: string;
  title: string;
  shortTitle: string;
  familyId: 'parabola' | 'absolute' | 'sine';
  formId: string;
  conceptId: MasteryConceptId;
  question: string;
  predictionOptions: PredictionOption[];
  correctPredictionId: string;
  hint: string;
  experimentInstruction: string;
  workedExplanation: string;
  unlockedParameters: ParameterKey[];
  targetValues: Partial<Record<ParameterKey, number>>;
  targetLatex?: string;
  explanationFields?: ExplanationField[];
};

export type StepResult = {
  attempts: number;
  predictionCorrect: boolean;
  explanationCorrect?: boolean;
};

export type GuidedProgress = {
  version: 1;
  hasChosenMode: boolean;
  lastMode: GraphLabMode;
  stepIndex: number;
  completed: boolean;
  results: Partial<Record<string, StepResult>>;
};

export type StorageLike = Pick<Storage, 'getItem' | 'setItem'>;

export type MasteryConceptId =
  | 'parent-functions'
  | 'vertical-translation'
  | 'dilation-reflection'
  | 'horizontal-translation'
  | 'combined-transformations'
  | 'transfer'
  | 'sine-language';

export type MasteryItem = {
  id: MasteryConceptId;
  label: string;
  status: MasteryStatus;
  note: string;
};

const prediction = (id: string, label: string): PredictionOption => ({ id, label });

export const TRANSFORMATION_JOURNEY: GuidedStep[] = [
  {
    id: 'parent',
    title: 'Start with the parent function',
    shortTitle: 'Parent graph',
    familyId: 'parabola',
    formId: 'vertex',
    conceptId: 'parent-functions',
    question: 'Which equation produces the basic parabola with its turning point at the origin?',
    predictionOptions: [prediction('x-squared', '\\(y=x^2\\)'), prediction('x-cubed', '\\(y=x^3\\)'), prediction('absolute-x', '\\(y=|x|\\)')],
    correctPredictionId: 'x-squared',
    hint: 'Look for the U-shaped parent graph with a smooth turning point.',
    experimentInstruction: 'Study the parent graph before any transformations are applied.',
    workedExplanation: 'The parent quadratic is \\(y=x^2\\). It has a turning point at \\((0,0)\\) and is symmetric about the \\(y\\)-axis.',
    unlockedParameters: [],
    targetValues: { a: 1, b: 1, c: 0, d: 0 },
  },
  {
    id: 'vertical-shift',
    title: 'Move the graph vertically',
    shortTitle: 'Vertical translation',
    familyId: 'parabola',
    formId: 'vertex',
    conceptId: 'vertical-translation',
    question: 'If \\(d\\) changes from \\(0\\) to \\(3\\) in \\(y=x^2+d\\), what happens to the graph?',
    predictionOptions: [prediction('up-three', 'It moves 3 units up'), prediction('right-three', 'It moves 3 units right'), prediction('narrower', 'It becomes narrower')],
    correctPredictionId: 'up-three',
    hint: '\\(d\\) is added after the function has produced its output. Think vertically.',
    experimentInstruction: 'Move \\(d\\) from \\(0\\) to \\(3\\) and watch the turning point.',
    workedExplanation: 'Adding \\(3\\) to every output translates the entire graph 3 units upward. Its turning point moves from \\((0,0)\\) to \\((0,3)\\).',
    unlockedParameters: ['d'],
    targetValues: { a: 1, b: 1, c: 0, d: 3 },
    targetLatex: 'y=x^2+3',
    explanationFields: [
      { id: 'direction', prompt: 'The graph translates', options: [prediction('up', 'up'), prediction('right', 'right'), prediction('down', 'down')], correctId: 'up' },
      { id: 'cause', prompt: 'because the change is', options: [prediction('outside', 'outside the squared expression'), prediction('inside', 'inside the squared expression')], correctId: 'outside' },
    ],
  },
  {
    id: 'dilation-reflection',
    title: 'Stretch and reflect the graph',
    shortTitle: 'Dilation & reflection',
    familyId: 'parabola',
    formId: 'vertex',
    conceptId: 'dilation-reflection',
    question: 'What will \\(a=-2\\) do to the parent parabola?',
    predictionOptions: [prediction('reflect-narrower', 'Reflect it and make it narrower'), prediction('up-two', 'Move it 2 units up'), prediction('right-two', 'Move it 2 units right')],
    correctPredictionId: 'reflect-narrower',
    hint: 'The sign controls orientation and \\(|a|\\) controls the vertical dilation.',
    experimentInstruction: 'Move \\(a\\) through \\(0.5\\), \\(2\\) and \\(-2\\). Compare width and opening direction.',
    workedExplanation: 'The negative sign reflects the graph in the \\(x\\)-axis. Since \\(|a|=2\\), every output doubles, producing a vertical dilation and a visually narrower parabola.',
    unlockedParameters: ['a'],
    targetValues: { a: -2, b: 1, c: 0, d: 0 },
    targetLatex: 'y=-2x^2',
    explanationFields: [
      { id: 'orientation', prompt: 'The negative sign causes', options: [prediction('reflection', 'reflection in the x-axis'), prediction('translation', 'vertical translation')], correctId: 'reflection' },
      { id: 'scale', prompt: 'and \\(|a|=2\\) causes', options: [prediction('vertical-dilation', 'a vertical dilation by factor 2'), prediction('horizontal-shift', 'a horizontal shift of 2')], correctId: 'vertical-dilation' },
    ],
  },
  {
    id: 'horizontal-shift',
    title: 'Read an inside transformation',
    shortTitle: 'Horizontal translation',
    familyId: 'parabola',
    formId: 'vertex',
    conceptId: 'horizontal-translation',
    question: 'In \\(y=(x-4)^2\\), which way does the graph move?',
    predictionOptions: [prediction('right-four', '4 units right'), prediction('left-four', '4 units left'), prediction('up-four', '4 units up')],
    correctPredictionId: 'right-four',
    hint: 'Inside transformations appear to work in the opposite direction to the sign you see.',
    experimentInstruction: 'Move \\(c\\) from \\(0\\) to \\(4\\) and follow the \\(x\\)-coordinate of the turning point.',
    workedExplanation: 'The graph moves 4 units right. The squared input becomes zero when \\(x=4\\), so the turning point is \\((4,0)\\).',
    unlockedParameters: ['c'],
    targetValues: { a: 1, b: 1, c: 4, d: 0 },
    targetLatex: 'y=(x-4)^2',
    explanationFields: [
      { id: 'direction', prompt: 'The graph moves', options: [prediction('right', 'right'), prediction('left', 'left')], correctId: 'right' },
      { id: 'cause', prompt: 'because', options: [prediction('inside-subtraction', 'x − 4 becomes zero at x = 4'), prediction('outside-addition', '4 is added to every output')], correctId: 'inside-subtraction' },
    ],
  },
  {
    id: 'combined',
    title: 'Combine transformations',
    shortTitle: 'Combined change',
    familyId: 'parabola',
    formId: 'vertex',
    conceptId: 'combined-transformations',
    question: 'For \\(y=-2(x-3)^2+1\\), where is the turning point and which way does it open?',
    predictionOptions: [prediction('three-one-down', '\\((3,1)\\), opening down'), prediction('minus-three-one-up', '\\((-3,1)\\), opening up'), prediction('three-minus-one-down', '\\((3,-1)\\), opening down')],
    correctPredictionId: 'three-one-down',
    hint: 'Read the translation from the bracket and final constant, then use the sign of a.',
    experimentInstruction: 'Use \\(a\\), \\(c\\) and \\(d\\) together to reproduce \\(y=-2(x-3)^2+1\\).',
    workedExplanation: '\\(c=3\\) and \\(d=1\\) place the turning point at \\((3,1)\\). The negative \\(a\\) reflects the graph, so it opens downward; \\(|a|=2\\) makes it narrower.',
    unlockedParameters: ['a', 'c', 'd'],
    targetValues: { a: -2, b: 1, c: 3, d: 1 },
    targetLatex: 'y=-2(x-3)^2+1',
    explanationFields: [
      { id: 'turning-point', prompt: 'The turning point is', options: [prediction('three-one', '(3, 1)'), prediction('minus-three-one', '(−3, 1)'), prediction('three-minus-one', '(3, −1)')], correctId: 'three-one' },
      { id: 'orientation', prompt: 'and the graph opens', options: [prediction('down', 'down because a is negative'), prediction('up', 'up because c is positive')], correctId: 'down' },
    ],
  },
  {
    id: 'absolute-transfer',
    title: 'Transfer the rules to a new parent graph',
    shortTitle: 'Absolute-value transfer',
    familyId: 'absolute',
    formId: 'transformation',
    conceptId: 'transfer',
    question: 'Will \\(y=-|x-2|+3\\) use the same translation and reflection rules?',
    predictionOptions: [prediction('same-rules', 'Yes—the parent shape changes, but the rules remain'), prediction('new-rules', 'No—absolute value reverses every rule'), prediction('no-translation', 'Only dilation works for absolute value')],
    correctPredictionId: 'same-rules',
    hint: 'The transformation structure \\(a f(x-c)+d\\) works for many parent functions.',
    experimentInstruction: 'Create the transformed V-shape and locate its sharp turning point.',
    workedExplanation: 'The same structure applies. The turning point is \\((2,3)\\), the negative sign reflects the V in the \\(x\\)-axis, and the parent shape remains recognisably absolute value.',
    unlockedParameters: ['a', 'c', 'd'],
    targetValues: { a: -1, b: 1, c: 2, d: 3 },
    targetLatex: 'y=-|x-2|+3',
    explanationFields: [
      { id: 'turning-point', prompt: 'The turning point is', options: [prediction('two-three', '(2, 3)'), prediction('minus-two-three', '(−2, 3)'), prediction('two-minus-three', '(2, −3)')], correctId: 'two-three' },
      { id: 'transfer-rule', prompt: 'The transformation rules are', options: [prediction('same', 'the same as for the parabola'), prediction('reversed', 'reversed for absolute value')], correctId: 'same' },
    ],
  },
  {
    id: 'sine-bridge',
    title: 'Same transformations, senior terminology',
    shortTitle: 'Sine language',
    familyId: 'sine',
    formId: 'transformation',
    conceptId: 'sine-language',
    question: 'For sine graphs, what is the familiar vertical dilation \\(|a|\\) called?',
    predictionOptions: [prediction('amplitude', 'Amplitude'), prediction('period', 'Period'), prediction('phase-shift', 'Phase shift')],
    correctPredictionId: 'amplitude',
    hint: 'It measures the vertical distance from the midline to a maximum or minimum.',
    experimentInstruction: 'Use \\(a\\), \\(b\\), \\(c\\) and \\(d\\) to connect dilation, horizontal scaling and translations to sine terminology.',
    workedExplanation: 'For sine graphs, \\(|a|\\) is the amplitude, \\(b\\) controls the period, \\(c\\) is the phase shift and \\(d\\) moves the midline. These are the same transformation ideas with specialised names.',
    unlockedParameters: ['a', 'b', 'c', 'd'],
    targetValues: { a: 2, b: 2, c: 1, d: 1 },
    targetLatex: 'y=2\\sin(2(x-1))+1',
    explanationFields: [
      { id: 'vertical', prompt: 'Vertical dilation changes', options: [prediction('amplitude', 'amplitude'), prediction('period', 'period')], correctId: 'amplitude' },
      { id: 'horizontal', prompt: 'Horizontal dilation changes', options: [prediction('period', 'period'), prediction('midline', 'midline')], correctId: 'period' },
      { id: 'translation', prompt: 'Horizontal translation is called', options: [prediction('phase', 'phase shift'), prediction('amplitude', 'amplitude')], correctId: 'phase' },
    ],
  },
];

export const evaluatePrediction = (step: GuidedStep, answerId: string, previousAttempts: number) => {
  const correct = answerId === step.correctPredictionId;
  const attempts = previousAttempts + 1;
  if (correct) return { correct, nextPhase: 'experiment' as const, attempts, message: 'Good prediction. Now test it on the graph.' };
  if (attempts === 1) return { correct, nextPhase: 'predict' as const, attempts, message: step.hint };
  return { correct, nextPhase: 'experiment' as const, attempts, message: step.workedExplanation };
};

export const evaluateExplanation = (step: GuidedStep, answers: Record<string, string>) => (
  Boolean(step.explanationFields?.length)
  && step.explanationFields!.every((field) => answers[field.id] === field.correctId)
);

export const hasReachedExperimentTarget = (
  step: GuidedStep,
  values: Record<ParameterKey, number>,
) => step.unlockedParameters.every((key) => {
  const target = step.targetValues[key];
  return target === undefined || Math.abs(values[key] - target) < 0.001;
});

const CONCEPTS: Array<{ id: MasteryConceptId; label: string }> = [
  { id: 'parent-functions', label: 'Parent functions' },
  { id: 'vertical-translation', label: 'Vertical translation' },
  { id: 'dilation-reflection', label: 'Reflection and dilation' },
  { id: 'horizontal-translation', label: 'Horizontal translation' },
  { id: 'combined-transformations', label: 'Combined transformations' },
  { id: 'transfer', label: 'Transferring rules between functions' },
  { id: 'sine-language', label: 'Sine terminology' },
];

export const summariseMastery = (results: GuidedProgress['results']): MasteryItem[] => CONCEPTS.map((concept) => {
  const related = TRANSFORMATION_JOURNEY.filter((step) => step.conceptId === concept.id).map((step) => results[step.id]).filter(Boolean) as StepResult[];
  const allFirstTry = related.length > 0 && related.every((result) => result.predictionCorrect && result.attempts === 1 && result.explanationCorrect !== false);
  const allEventuallyCorrect = related.length > 0 && related.every((result) => result.predictionCorrect && result.explanationCorrect !== false);
  const status: MasteryStatus = allFirstTry ? 'secure' : allEventuallyCorrect ? 'developing' : 'revisit';
  const note = status === 'secure'
    ? 'You predicted and explained this confidently.'
    : status === 'developing'
      ? 'You reached the correct idea after a hint or retry.'
      : 'Review the worked explanation, then try this concept again.';
  return { id: concept.id, label: concept.label, status, note };
});

export const readGuidedState = (storage: StorageLike | null | undefined): GuidedProgress | null => {
  if (!storage) return null;
  try {
    const raw = storage.getItem(GUIDED_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<GuidedProgress>;
    if (parsed.version !== 1 || (parsed.lastMode !== 'guided' && parsed.lastMode !== 'free')) return null;
    if (typeof parsed.stepIndex !== 'number' || typeof parsed.completed !== 'boolean' || !parsed.results) return null;
    return parsed as GuidedProgress;
  } catch {
    return null;
  }
};

export const writeGuidedState = (storage: StorageLike | null | undefined, state: GuidedProgress) => {
  if (!storage) return;
  try {
    storage.setItem(GUIDED_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Progress persistence is an enhancement; the activity remains usable without it.
  }
};

export const createInitialGuidedProgress = (): GuidedProgress => ({
  version: 1,
  hasChosenMode: false,
  lastMode: 'guided',
  stepIndex: 0,
  completed: false,
  results: {},
});
