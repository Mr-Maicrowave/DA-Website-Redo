export type BinaryOperator = '+' | '-' | '*' | '/' | '^';
export type UnaryOperator = '+' | '-';
export type FunctionName = 'sin' | 'cos' | 'tan' | 'cot' | 'sec' | 'cosec' | 'sqrt' | 'abs' | 'ln' | 'log' | 'exp';
export type ConstantName = 'pi' | 'e';

export type ExprNode =
  | { type: 'number'; value: number }
  | { type: 'variable'; name: 'x' }
  | { type: 'constant'; name: ConstantName }
  | { type: 'unary'; operator: UnaryOperator; argument: ExprNode }
  | { type: 'binary'; operator: BinaryOperator; left: ExprNode; right: ExprNode }
  | { type: 'call'; name: FunctionName; argument: ExprNode };

export type Viewport = {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
};

export type GraphExpression = {
  id: string;
  source: string;
  color: string;
  visible: boolean;
  lineStyle?: number;
  groupId?: string;
  isInternalBranch?: boolean;
  displayLatex?: string;
};

export type GraphAsymptote = {
  orientation: 'vertical' | 'horizontal';
  value: number;
  latex: string;
};

export type GraphPoint = { x: number; y: number };

export type SampledGraph = {
  segments: GraphPoint[][];
  sampleCount: number;
  hitBudget: boolean;
};
