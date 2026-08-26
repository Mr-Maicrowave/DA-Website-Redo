import { parseExpression } from './parser.ts';
import type { ExprNode, GraphAsymptote, Viewport } from './types.ts';

type Affine = { slope: number; intercept: number };

const cleanNumber = (value: number) => Number(value.toFixed(8)).toString();

const constantValue = (node: ExprNode): number | null => {
  if (node.type === 'number') return node.value;
  if (node.type === 'constant') return node.name === 'pi' ? Math.PI : Math.E;
  if (node.type === 'unary') {
    const value = constantValue(node.argument);
    return value === null ? null : node.operator === '-' ? -value : value;
  }
  if (node.type !== 'binary') return null;
  const left = constantValue(node.left);
  const right = constantValue(node.right);
  if (left === null || right === null) return null;
  if (node.operator === '+') return left + right;
  if (node.operator === '-') return left - right;
  if (node.operator === '*') return left * right;
  if (node.operator === '/') return left / right;
  return left ** right;
};

const affine = (node: ExprNode): Affine | null => {
  if (node.type === 'variable') return { slope: 1, intercept: 0 };
  const constant = constantValue(node);
  if (constant !== null) return { slope: 0, intercept: constant };
  if (node.type === 'unary') {
    const value = affine(node.argument);
    if (!value) return null;
    return node.operator === '-' ? { slope: -value.slope, intercept: -value.intercept } : value;
  }
  if (node.type !== 'binary') return null;
  const left = affine(node.left);
  const right = affine(node.right);
  if (node.operator === '+' || node.operator === '-') {
    if (!left || !right) return null;
    const direction = node.operator === '+' ? 1 : -1;
    return { slope: left.slope + direction * right.slope, intercept: left.intercept + direction * right.intercept };
  }
  if (node.operator === '*') {
    const leftConstant = constantValue(node.left);
    const rightConstant = constantValue(node.right);
    if (leftConstant !== null && right) return { slope: leftConstant * right.slope, intercept: leftConstant * right.intercept };
    if (rightConstant !== null && left) return { slope: rightConstant * left.slope, intercept: rightConstant * left.intercept };
  }
  if (node.operator === '/') {
    const divisor = constantValue(node.right);
    if (divisor !== null && divisor !== 0 && left) return { slope: left.slope / divisor, intercept: left.intercept / divisor };
  }
  return null;
};

const translation = (node: ExprNode) => {
  if (node.type !== 'binary' || (node.operator !== '+' && node.operator !== '-')) return { core: node, value: 0 };
  const right = constantValue(node.right);
  if (right === null) return { core: node, value: 0 };
  return { core: node.left, value: node.operator === '+' ? right : -right };
};

const unwrapScale = (node: ExprNode) => {
  if (node.type === 'binary' && node.operator === '*') {
    if (constantValue(node.left) !== null) return node.right;
    if (constantValue(node.right) !== null) return node.left;
  }
  return node;
};

const vertical = (value: number): GraphAsymptote => ({
  orientation: 'vertical',
  value,
  latex: `x=${cleanNumber(value)}`,
});

const horizontal = (value: number): GraphAsymptote => ({
  orientation: 'horizontal',
  value,
  latex: `y=${cleanNumber(value)}`,
});

const periodic = (argument: Affine, viewport: Viewport, offset: number, step: number) => {
  if (argument.slope === 0) return [];
  const atMin = argument.slope * viewport.xMin + argument.intercept;
  const atMax = argument.slope * viewport.xMax + argument.intercept;
  const argumentMin = Math.min(atMin, atMax);
  const argumentMax = Math.max(atMin, atMax);
  const firstIndex = Math.ceil((argumentMin - offset) / step);
  const lastIndex = Math.floor((argumentMax - offset) / step);
  const result: GraphAsymptote[] = [];
  for (let index = firstIndex; index <= lastIndex && result.length < 40; index += 1) {
    result.push(vertical((offset + index * step - argument.intercept) / argument.slope));
  }
  return result;
};

const uniqueVisible = (asymptotes: GraphAsymptote[], viewport: Viewport) => {
  const seen = new Set<string>();
  return asymptotes.filter((asymptote) => {
    const visible = asymptote.orientation === 'vertical'
      ? asymptote.value >= viewport.xMin && asymptote.value <= viewport.xMax
      : asymptote.value >= viewport.yMin && asymptote.value <= viewport.yMax;
    const key = `${asymptote.orientation}-${asymptote.value.toFixed(7)}`;
    if (!visible || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export const inferAsymptotes = (source: string, viewport: Viewport): GraphAsymptote[] => {
  let ast: ExprNode;
  try {
    ast = parseExpression(source);
  } catch {
    return [];
  }

  const shifted = translation(ast);
  const core = unwrapScale(shifted.core);
  const result: GraphAsymptote[] = [];

  if (core.type === 'call') {
    const argument = affine(core.argument);
    if (argument) {
      if (core.name === 'tan' || core.name === 'sec') result.push(...periodic(argument, viewport, Math.PI / 2, Math.PI));
      if (core.name === 'cot' || core.name === 'cosec') result.push(...periodic(argument, viewport, 0, Math.PI));
      if ((core.name === 'ln' || core.name === 'log') && argument.slope !== 0) result.push(vertical(-argument.intercept / argument.slope));
    }
  }

  if (core.type === 'binary' && core.operator === '/') {
    const numerator = affine(core.left);
    const denominator = affine(core.right);
    if (denominator?.slope) {
      result.push(vertical(-denominator.intercept / denominator.slope));
      if (numerator) result.push(horizontal(shifted.value + numerator.slope / denominator.slope));
    }
  }

  if (core.type === 'binary' && core.operator === '^' && constantValue(core.left) !== null) {
    result.push(horizontal(shifted.value));
  }

  return uniqueVisible(result, viewport);
};
