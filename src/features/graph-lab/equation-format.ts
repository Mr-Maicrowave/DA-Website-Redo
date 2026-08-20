import type { ExprNode } from './types.ts';
import { parseExpression } from './parser.ts';

const FUNCTION_LATEX: Record<string, string> = {
  sin: '\\sin',
  cos: '\\cos',
  tan: '\\tan',
  cot: '\\cot',
  sec: '\\sec',
  cosec: '\\csc',
  ln: '\\ln',
  log: '\\log',
  exp: '\\exp',
};

const precedence = (node: ExprNode): number => {
  if (node.type === 'binary') {
    if (node.operator === '+' || node.operator === '-') return 1;
    if (node.operator === '*' || node.operator === '/') return 2;
    return 4;
  }
  if (node.type === 'unary') return 3;
  return 5;
};

const wrap = (latex: string) => `\\left(${latex}\\right)`;

const nodeToLatex = (node: ExprNode, parentPrecedence = 0, isRightChild = false): string => {
  if (node.type === 'number') return Number(node.value.toFixed(10)).toString();
  if (node.type === 'variable') return 'x';
  if (node.type === 'constant') return node.name === 'pi' ? '\\pi' : 'e';
  if (node.type === 'unary') {
    const rendered = `${node.operator}${nodeToLatex(node.argument, precedence(node))}`;
    return precedence(node) < parentPrecedence ? wrap(rendered) : rendered;
  }
  if (node.type === 'call') {
    const argument = nodeToLatex(node.argument);
    if (node.name === 'sqrt') return `\\sqrt{${argument}}`;
    if (node.name === 'abs') return `\\left|${argument}\\right|`;
    return `${FUNCTION_LATEX[node.name] ?? `\\operatorname{${node.name}}`}\\left(${argument}\\right)`;
  }

  const ownPrecedence = precedence(node);
  let rendered: string;
  if (node.operator === '/') {
    rendered = `\\frac{${nodeToLatex(node.left)}}{${nodeToLatex(node.right)}}`;
  } else if (node.operator === '^') {
    rendered = `{${nodeToLatex(node.left, ownPrecedence)}}^{${nodeToLatex(node.right)}}`;
  } else if (node.operator === '*') {
    const separator = node.right.type === 'number' || (node.left.type !== 'number' && ['variable', 'constant'].includes(node.right.type)) ? ' \\cdot ' : '';
    rendered = `${nodeToLatex(node.left, ownPrecedence)}${separator}${nodeToLatex(node.right, ownPrecedence)}`;
  } else {
    rendered = `${nodeToLatex(node.left, ownPrecedence)} ${node.operator} ${nodeToLatex(node.right, ownPrecedence, true)}`;
  }

  const needsParentheses = ownPrecedence < parentPrecedence
    || (isRightChild && node.operator === '-' && ownPrecedence === parentPrecedence);
  return needsParentheses ? wrap(rendered) : rendered;
};

export const expressionToLatex = (source: string) => {
  try {
    return `y = ${nodeToLatex(parseExpression(source))}`;
  } catch {
    return `y = \\text{${source.replace(/[{}\\]/g, '')}}`;
  }
};
