import type { GraphAsymptote, Viewport } from './types.ts';

export type ParameterKey = 'a' | 'b' | 'c' | 'd' | 'h' | 'k' | 'r';

export type ParameterDefinition = {
  key: ParameterKey;
  label: string;
  meaning: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
};

export type EquationForm = {
  id: string;
  label: string;
  generalForm: string;
  explanation: string;
  parameters: ParameterDefinition[];
  buildExpressions: (values: Record<ParameterKey, number>) => string[];
  displayExpression?: (values: Record<ParameterKey, number>) => string;
  displayLatex?: (values: Record<ParameterKey, number>) => string;
  asymptotes?: (values: Record<ParameterKey, number>, viewport: Viewport) => GraphAsymptote[];
};

export type EquationFamily = {
  id: string;
  label: string;
  category: 'Polynomial' | 'Trigonometric' | 'Other functions';
  viewport: Viewport;
  forms: EquationForm[];
};

const p = (
  key: ParameterKey,
  label: string,
  meaning: string,
  min: number,
  max: number,
  step: number,
  defaultValue: number,
): ParameterDefinition => ({ key, label, meaning, min, max, step, defaultValue });

const cleanNumber = (value: number) => Number(value.toFixed(8)).toString();

const variableTerm = (coefficient: number, variable: string, first = false) => {
  if (coefficient === 0) return '';
  const sign = coefficient < 0 ? '-' : first ? '' : '+';
  const magnitude = Math.abs(coefficient);
  return `${sign}${magnitude === 1 ? '' : cleanNumber(magnitude)}${variable}`;
};

const constantTerm = (value: number, first = false) => (
  value === 0 ? '' : `${value < 0 ? '-' : first ? '' : '+'}${cleanNumber(Math.abs(value))}`
);

const shiftedX = (c: number) => (
  c === 0 ? 'x' : `(x${c < 0 ? '+' : '-'}${cleanNumber(Math.abs(c))})`
);

const circleShift = (variable: string, value: number) => (
  value === 0 ? variable : `(${variable}${value < 0 ? '+' : '-'}${cleanNumber(Math.abs(value))})`
);

const scaledArgument = (b: number, c: number) => `${b === 1 ? '' : cleanNumber(b)}${shiftedX(c)}`;

const transformed = (fn: string, values: Record<ParameterKey, number>) => {
  const core = `${fn}(${scaledArgument(values.b, values.c)})`;
  return `${variableTerm(values.a, core, true) || '0'}${constantTerm(values.d)}`;
};

const transformationParameters = (frequencyMeaning = 'horizontal scale') => [
  p('a', 'a', 'vertical scale or reflection', -5, 5, 0.25, 1),
  p('b', 'b', frequencyMeaning, 0.25, 4, 0.25, 1),
  p('c', 'c', 'horizontal translation', -5, 5, 0.25, 0),
  p('d', 'd', 'vertical translation', -5, 5, 0.25, 0),
];

const periodicAsymptotes = (
  values: Record<ParameterKey, number>,
  viewport: Viewport,
  offset: number,
  step: number,
) => {
  if (values.b === 0) return [];
  const minIndex = Math.floor((values.b * (viewport.xMin - values.c) - offset) / step) - 1;
  const maxIndex = Math.ceil((values.b * (viewport.xMax - values.c) - offset) / step) + 1;
  const asymptotes: GraphAsymptote[] = [];
  for (let index = minIndex; index <= maxIndex; index += 1) {
    const value = values.c + (offset + index * step) / values.b;
    if (value >= viewport.xMin && value <= viewport.xMax) {
      asymptotes.push({ orientation: 'vertical', value, latex: `x=${cleanNumber(value)}` });
    }
  }
  return asymptotes;
};

const trigFamily = (id: string, label: string, fn: string): EquationFamily => ({
  id,
  label,
  category: 'Trigonometric',
  viewport: { xMin: -7, xMax: 7, yMin: -6, yMax: 6 },
  forms: [{
    id: 'transformation',
    label: 'Transformation form',
    generalForm: `y=a\\${fn === 'cosec' ? 'csc' : fn}\\left(b(x-c)\\right)+d`,
    explanation: 'Change one coefficient at a time to inspect vertical scale, period, phase shift and midline.',
    parameters: transformationParameters('angular frequency and period'),
    buildExpressions: (values) => [transformed(fn, values)],
    asymptotes: ['tangent', 'cotangent', 'secant', 'cosecant'].includes(id)
      ? (values, viewport) => (
          id === 'tangent' || id === 'secant'
            ? periodicAsymptotes(values, viewport, Math.PI / 2, Math.PI)
            : periodicAsymptotes(values, viewport, 0, Math.PI)
        )
      : undefined,
  }],
});

export const EQUATION_FAMILIES: EquationFamily[] = [
  {
    id: 'linear',
    label: 'Linear',
    category: 'Polynomial',
    viewport: { xMin: -10, xMax: 10, yMin: -10, yMax: 10 },
    forms: [{
      id: 'slope-intercept',
      label: 'Slope-intercept form',
      generalForm: 'y=mx+b',
      explanation: 'The gradient controls steepness and direction; the intercept moves the line vertically.',
      parameters: [
        p('a', 'm', 'gradient', -5, 5, 0.25, 1),
        p('b', 'b', 'y-intercept', -8, 8, 0.5, 0),
      ],
      buildExpressions: (values) => [`${variableTerm(values.a, 'x', true) || '0'}${constantTerm(values.b)}`],
    }],
  },
  {
    id: 'parabola',
    label: 'Parabola',
    category: 'Polynomial',
    viewport: { xMin: -10, xMax: 10, yMin: -10, yMax: 10 },
    forms: [
      {
        id: 'general',
        label: 'General form',
        generalForm: 'y=ax^2+bx+c',
        explanation: 'a controls opening and width, while b and c change the position of the turning point and intercepts.',
        parameters: [
          p('a', 'a', 'opening, width and reflection', -4, 4, 0.25, 1),
          p('b', 'b', 'linear coefficient', -8, 8, 0.5, 0),
          p('c', 'c', 'constant and y-intercept', -8, 8, 0.5, -3),
        ],
        buildExpressions: (values) => {
          const expression = `${variableTerm(values.a, 'x^2', true)}${variableTerm(values.b, 'x', values.a === 0)}${constantTerm(values.c, values.a === 0 && values.b === 0)}`;
          return [expression || '0'];
        },
      },
      {
        id: 'vertex',
        label: 'Vertex / transformation form',
        generalForm: 'y=a(bx-c)^2+d',
        explanation: 'This form makes the turning point, reflection and horizontal or vertical scale easier to see.',
        parameters: transformationParameters(),
        buildExpressions: (values) => {
          const inside = `${values.b === 1 ? '' : cleanNumber(values.b)}x${values.c === 0 ? '' : `${values.c < 0 ? '+' : '-'}${cleanNumber(Math.abs(values.c))}`}`;
          return [`${variableTerm(values.a, `(${inside})^2`, true) || '0'}${constantTerm(values.d)}`];
        },
      },
    ],
  },
  {
    id: 'cubic',
    label: 'Cubic',
    category: 'Polynomial',
    viewport: { xMin: -8, xMax: 8, yMin: -10, yMax: 10 },
    forms: [{
      id: 'transformation',
      label: 'Transformation form',
      generalForm: 'y=a\\left(b(x-c)\\right)^3+d',
      explanation: 'Use a and b to stretch or reflect the curve, then c and d to move its centre.',
      parameters: transformationParameters(),
      buildExpressions: (values) => [`${variableTerm(values.a, `(${scaledArgument(values.b, values.c)})^3`, true) || '0'}${constantTerm(values.d)}`],
    }],
  },
  trigFamily('sine', 'Sine', 'sin'),
  trigFamily('cosine', 'Cosine', 'cos'),
  trigFamily('tangent', 'Tangent', 'tan'),
  trigFamily('cotangent', 'Cotangent', 'cot'),
  trigFamily('secant', 'Secant', 'sec'),
  trigFamily('cosecant', 'Cosecant', 'cosec'),
  {
    id: 'reciprocal',
    label: 'Reciprocal / hyperbola',
    category: 'Other functions',
    viewport: { xMin: -8, xMax: 8, yMin: -8, yMax: 8 },
    forms: [{
      id: 'transformation',
      label: 'Transformation form',
      generalForm: 'y=\\frac{a}{b(x-c)}+d',
      explanation: 'c and d locate the vertical and horizontal asymptotes; a and b alter the branches.',
      parameters: transformationParameters(),
      buildExpressions: (values) => [`${cleanNumber(values.a)}/(${scaledArgument(values.b, values.c)})${constantTerm(values.d)}`],
      asymptotes: (values) => [
        { orientation: 'vertical', value: values.c, latex: `x=${cleanNumber(values.c)}` },
        { orientation: 'horizontal', value: values.d, latex: `y=${cleanNumber(values.d)}` },
      ],
    }],
  },
  {
    id: 'absolute',
    label: 'Absolute value',
    category: 'Other functions',
    viewport: { xMin: -10, xMax: 10, yMin: -6, yMax: 10 },
    forms: [{
      id: 'transformation',
      label: 'Transformation form',
      generalForm: 'y=a\\left|b(x-c)\\right|+d',
      explanation: 'The absolute value folds negative outputs upward, producing a sharp turning point.',
      parameters: transformationParameters(),
      buildExpressions: (values) => [transformed('abs', values)],
    }],
  },
  {
    id: 'square-root',
    label: 'Square root',
    category: 'Other functions',
    viewport: { xMin: -6, xMax: 14, yMin: -6, yMax: 10 },
    forms: [{
      id: 'transformation',
      label: 'Transformation form',
      generalForm: 'y=a\\sqrt{b(x-c)}+d',
      explanation: 'c controls where the real-valued graph begins; a, b and d control its direction and scale.',
      parameters: transformationParameters(),
      buildExpressions: (values) => [transformed('sqrt', values)],
    }],
  },
  {
    id: 'circle',
    label: 'Circle',
    category: 'Other functions',
    viewport: { xMin: -10, xMax: 10, yMin: -10, yMax: 10 },
    forms: [{
      id: 'centre-radius',
      label: 'Centre-radius form',
      generalForm: '(x-h)^2+(y-k)^2=r^2',
      explanation: 'h and k move the centre; r changes the radius. Both y-branches are plotted together.',
      parameters: [
        p('h', 'h', 'horizontal centre', -5, 5, 0.25, 0),
        p('k', 'k', 'vertical centre', -5, 5, 0.25, 0),
        p('r', 'r', 'radius', 0.5, 8, 0.25, 4),
      ],
      buildExpressions: (values) => [
        `${values.k === 0 ? '' : `${cleanNumber(values.k)}+`}sqrt(${cleanNumber(values.r)}^2-${shiftedX(values.h)}^2)`,
        `${values.k === 0 ? '-' : `${cleanNumber(values.k)}-`}sqrt(${cleanNumber(values.r)}^2-${shiftedX(values.h)}^2)`,
      ],
      displayExpression: (values) => `${circleShift('x', values.h)}^2+${circleShift('y', values.k)}^2=${cleanNumber(values.r ** 2)}`,
      displayLatex: (values) => `${circleShift('x', values.h)}^2+${circleShift('y', values.k)}^2=${cleanNumber(values.r ** 2)}`,
    }],
  },
  {
    id: 'exponential',
    label: 'Exponential',
    category: 'Other functions',
    viewport: { xMin: -8, xMax: 8, yMin: -5, yMax: 12 },
    forms: [{
      id: 'base',
      label: 'Base form',
      generalForm: 'y=ab^{x-c}+d',
      explanation: 'The positive base b controls growth or decay; d gives the horizontal asymptote.',
      parameters: [
        p('a', 'a', 'vertical scale or reflection', -5, 5, 0.25, 1),
        p('b', 'b', 'growth or decay base', 0.25, 4, 0.25, 2),
        p('c', 'c', 'horizontal translation', -5, 5, 0.25, 0),
        p('d', 'd', 'horizontal asymptote', -5, 5, 0.25, 0),
      ],
      buildExpressions: (values) => [`${variableTerm(values.a, `${cleanNumber(values.b)}^${shiftedX(values.c)}`, true) || '0'}${constantTerm(values.d)}`],
      asymptotes: (values) => [{ orientation: 'horizontal', value: values.d, latex: `y=${cleanNumber(values.d)}` }],
    }],
  },
  {
    id: 'logarithm',
    label: 'Logarithm',
    category: 'Other functions',
    viewport: { xMin: -6, xMax: 14, yMin: -8, yMax: 8 },
    forms: [{
      id: 'base',
      label: 'Base form',
      generalForm: 'y=a\\log_b(x-c)+d',
      explanation: 'c gives the vertical asymptote. The base controls whether the graph increases or decreases.',
      parameters: [
        p('a', 'a', 'vertical scale or reflection', -5, 5, 0.25, 1),
        p('b', 'b', 'logarithm base', 1.25, 5, 0.25, 2),
        p('c', 'c', 'vertical asymptote x = c', -5, 5, 0.25, 0),
        p('d', 'd', 'vertical translation', -5, 5, 0.25, 0),
      ],
      buildExpressions: (values) => [`${variableTerm(values.a, `(ln(${shiftedX(values.c)})/ln(${cleanNumber(values.b)}))`, true) || '0'}${constantTerm(values.d)}`],
      asymptotes: (values) => [{ orientation: 'vertical', value: values.c, latex: `x=${cleanNumber(values.c)}` }],
    }],
  },
];

export const getFamily = (familyId: string) => EQUATION_FAMILIES.find((family) => family.id === familyId) ?? EQUATION_FAMILIES[0];

export const initialParameters = (form: EquationForm) => Object.fromEntries(
  form.parameters.map((parameter) => [parameter.key, parameter.defaultValue]),
) as Record<ParameterKey, number>;
