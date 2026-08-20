import type { ExprNode } from './types.ts';

export const evaluateAst = (node: ExprNode, x: number): number => {
  switch (node.type) {
    case 'number':
      return node.value;
    case 'variable':
      return x;
    case 'constant':
      return node.name === 'pi' ? Math.PI : Math.E;
    case 'unary': {
      const value = evaluateAst(node.argument, x);
      return node.operator === '-' ? -value : value;
    }
    case 'binary': {
      const left = evaluateAst(node.left, x);
      const right = evaluateAst(node.right, x);
      if (node.operator === '+') return left + right;
      if (node.operator === '-') return left - right;
      if (node.operator === '*') return left * right;
      if (node.operator === '/') return left / right;
      return left ** right;
    }
    case 'call': {
      const value = evaluateAst(node.argument, x);
      if (node.name === 'sin') return Math.sin(value);
      if (node.name === 'cos') return Math.cos(value);
      if (node.name === 'tan') return Math.tan(value);
      if (node.name === 'cot') return 1 / Math.tan(value);
      if (node.name === 'sec') return 1 / Math.cos(value);
      if (node.name === 'cosec') return 1 / Math.sin(value);
      if (node.name === 'sqrt') return Math.sqrt(value);
      if (node.name === 'abs') return Math.abs(value);
      if (node.name === 'exp') return Math.exp(value);
      if (node.name === 'log') return Math.log10(value);
      return Math.log(value);
    }
  }
};
