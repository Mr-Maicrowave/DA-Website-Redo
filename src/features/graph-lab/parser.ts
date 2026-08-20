import type {
  BinaryOperator,
  ConstantName,
  ExprNode,
  FunctionName,
  UnaryOperator,
} from './types.ts';

type TokenKind =
  | 'number'
  | 'variable'
  | 'constant'
  | 'function'
  | 'operator'
  | 'left-paren'
  | 'right-paren'
  | 'eof';

type Token = {
  kind: TokenKind;
  value?: number | string;
  position: number;
};

const FUNCTION_NAMES = new Set<FunctionName>(['sin', 'cos', 'tan', 'cot', 'sec', 'cosec', 'sqrt', 'abs', 'ln', 'log', 'exp']);
const TOKEN_PATTERN = /\s*(cosec|sqrt|sin|cos|tan|cot|sec|abs|ln|log|exp|pi|[xe]|\d*\.?\d+(?:e[+-]?\d+)?|[()+\-*/^])/gy;

const canEndValue = (token: Token) =>
  token.kind === 'number'
  || token.kind === 'variable'
  || token.kind === 'constant'
  || token.kind === 'right-paren';

const canStartImplicitValue = (token: Token) =>
  token.kind === 'variable'
  || token.kind === 'constant'
  || token.kind === 'function'
  || token.kind === 'left-paren';

const normaliseSource = (input: string) => input
  .toLowerCase()
  .replace(/^\s*y\s*=\s*/, '')
  .replace(/π/g, 'pi')
  .replace(/×|·/g, '*')
  .replace(/÷/g, '/')
  .replace(/[−–—]/g, '-')
  .trim();

const rawTokens = (input: string): Token[] => {
  const source = normaliseSource(input);
  const tokens: Token[] = [];
  let position = 0;

  while (position < source.length) {
    TOKEN_PATTERN.lastIndex = position;
    const match = TOKEN_PATTERN.exec(source);
    if (!match) {
      const unsupported = source.slice(position).trimStart()[0] ?? '';
      throw new Error(unsupported
        ? `I could not read “${unsupported}”. Use x, numbers, brackets and the supported functions.`
        : 'Enter an expression to draw.');
    }

    const value = match[1];
    const tokenPosition = match.index + match[0].indexOf(value);
    if (/^\d/.test(value) || value.startsWith('.')) {
      tokens.push({ kind: 'number', value: Number(value), position: tokenPosition });
    } else if (value === 'x') {
      tokens.push({ kind: 'variable', value, position: tokenPosition });
    } else if (value === 'pi' || value === 'e') {
      tokens.push({ kind: 'constant', value, position: tokenPosition });
    } else if (FUNCTION_NAMES.has(value as FunctionName)) {
      tokens.push({ kind: 'function', value, position: tokenPosition });
    } else if (value === '(') {
      tokens.push({ kind: 'left-paren', value, position: tokenPosition });
    } else if (value === ')') {
      tokens.push({ kind: 'right-paren', value, position: tokenPosition });
    } else {
      tokens.push({ kind: 'operator', value, position: tokenPosition });
    }
    position = TOKEN_PATTERN.lastIndex;
  }

  if (tokens.length === 0) throw new Error('Enter an expression to draw.');
  return tokens;
};

const insertImplicitMultiplication = (tokens: Token[]) => {
  const expanded: Token[] = [];
  tokens.forEach((token, index) => {
    const previous = tokens[index - 1];
    if (previous && canEndValue(previous) && canStartImplicitValue(token)) {
      expanded.push({ kind: 'operator', value: '*', position: token.position });
    }
    expanded.push(token);
  });
  return expanded;
};

class Parser {
  private position = 0;
  private readonly tokens: Token[];

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  parse(): ExprNode {
    const expression = this.parseAddSubtract();
    const remaining = this.peek();
    if (remaining.kind !== 'eof') {
      throw new Error(`Check the expression near position ${remaining.position + 1}.`);
    }
    return expression;
  }

  private peek(): Token {
    return this.tokens[this.position] ?? { kind: 'eof', position: this.tokens.at(-1)?.position ?? 0 };
  }

  private take(): Token {
    const token = this.peek();
    this.position += 1;
    return token;
  }

  private parseAddSubtract(): ExprNode {
    let node = this.parseMultiplyDivide();
    while (this.peek().kind === 'operator' && (this.peek().value === '+' || this.peek().value === '-')) {
      const operator = this.take().value as BinaryOperator;
      node = { type: 'binary', operator, left: node, right: this.parseMultiplyDivide() };
    }
    return node;
  }

  private parseMultiplyDivide(): ExprNode {
    let node = this.parseUnary();
    while (this.peek().kind === 'operator' && (this.peek().value === '*' || this.peek().value === '/')) {
      const operator = this.take().value as BinaryOperator;
      node = { type: 'binary', operator, left: node, right: this.parseUnary() };
    }
    return node;
  }

  private parseUnary(): ExprNode {
    if (this.peek().kind === 'operator' && (this.peek().value === '+' || this.peek().value === '-')) {
      const operator = this.take().value as UnaryOperator;
      return { type: 'unary', operator, argument: this.parseUnary() };
    }
    return this.parsePower();
  }

  private parsePower(): ExprNode {
    const left = this.parsePrimary();
    if (this.peek().kind === 'operator' && this.peek().value === '^') {
      this.take();
      return { type: 'binary', operator: '^', left, right: this.parseUnary() };
    }
    return left;
  }

  private parsePrimary(): ExprNode {
    const token = this.take();
    if (token.kind === 'number') return { type: 'number', value: token.value as number };
    if (token.kind === 'variable') return { type: 'variable', name: 'x' };
    if (token.kind === 'constant') return { type: 'constant', name: token.value as ConstantName };

    if (token.kind === 'left-paren') {
      const expression = this.parseAddSubtract();
      if (this.take().kind !== 'right-paren') throw new Error('Check that every opening bracket has a closing bracket.');
      return expression;
    }

    if (token.kind === 'function') {
      if (this.take().kind !== 'left-paren') {
        throw new Error(`${token.value} needs brackets, for example ${token.value}(x).`);
      }
      const argument = this.parseAddSubtract();
      if (this.take().kind !== 'right-paren') throw new Error('Check that every opening bracket has a closing bracket.');
      return { type: 'call', name: token.value as FunctionName, argument };
    }

    if (token.kind === 'eof') throw new Error('The expression ends too soon.');
    throw new Error(`Check the expression near position ${token.position + 1}.`);
  }
}

export const parseExpression = (input: string): ExprNode => {
  const tokens = insertImplicitMultiplication(rawTokens(input));
  return new Parser(tokens).parse();
};
