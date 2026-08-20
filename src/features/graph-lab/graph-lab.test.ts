import assert from 'node:assert/strict';
import test from 'node:test';
import { evaluateAst } from './evaluator.ts';
import { parseExpression } from './parser.ts';
import { sampleExpression } from './sampling.ts';
import { EQUATION_FAMILIES, initialParameters } from './equation-presets.ts';
import { expressionToLatex } from './equation-format.ts';
import { inferAsymptotes } from './asymptotes.ts';
import { formatViewportBound, panViewport, zoomViewport } from './viewport.ts';

const evaluate = (source: string, x: number) => evaluateAst(parseExpression(source), x);

test('supports common implicit multiplication forms', () => {
  assert.equal(evaluate('2sin(pi/2)', 0), 2);
  assert.equal(evaluate('2x', 3), 6);
  assert.equal(evaluate('3(x+1)', 3), 12);
  assert.equal(evaluate('(x+1)(x-1)', 3), 8);
  assert.equal(evaluate('2x   ', 3), 6);
});

test('uses conventional unary-minus and exponent precedence', () => {
  assert.equal(evaluate('-x^2', 3), -9);
  assert.equal(evaluate('(-x)^2', 3), 9);
  assert.equal(evaluate('2^-2', 0), 0.25);
  assert.equal(evaluate('2^3^2', 0), 512);
});

test('rejects incomplete and ambiguous expressions', () => {
  assert.throws(() => parseExpression('2 3'));
  assert.throws(() => parseExpression('sin x'));
  assert.throws(() => parseExpression('(x+1'));
});

test('breaks a shifted reciprocal at its vertical asymptote', () => {
  const asymptote = 0.03;
  const graph = sampleExpression(parseExpression('1/(x-0.03)'), { xMin: -2, xMax: 2, yMin: -6, yMax: 6 }, 700, 400);
  assert.ok(graph.segments.length >= 2);
  assert.equal(graph.segments.some((segment) => segment.some((point) => point.x < asymptote) && segment.some((point) => point.x > asymptote)), false);
});

test('breaks tangent at pi over two', () => {
  const asymptote = Math.PI / 2;
  const graph = sampleExpression(parseExpression('tan(x)'), { xMin: -Math.PI, xMax: Math.PI, yMin: -6, yMax: 6 }, 700, 400);
  assert.ok(graph.segments.length >= 3);
  assert.equal(graph.segments.some((segment) => segment.some((point) => point.x < asymptote) && segment.some((point) => point.x > asymptote)), false);
});

test('supports reciprocal trigonometric, exponential and logarithmic functions', () => {
  assert.ok(Math.abs(evaluate('sec(0)', 0) - 1) < 1e-10);
  assert.ok(Math.abs(evaluate('cosec(pi/2)', 0) - 1) < 1e-10);
  assert.ok(Math.abs(evaluate('cot(pi/4)', 0) - 1) < 1e-10);
  assert.ok(Math.abs(evaluate('ln(e)', 0) - 1) < 1e-10);
  assert.ok(Math.abs(evaluate('log(100)', 0) - 2) < 1e-10);
  assert.ok(Math.abs(evaluate('exp(1)', 0) - Math.E) < 1e-10);
});

test('every known equation family produces valid graph expressions', () => {
  EQUATION_FAMILIES.forEach((family) => {
    family.forms.forEach((form) => {
      const expressions = form.buildExpressions(initialParameters(form));
      assert.ok(expressions.length >= 1, `${family.label} should produce an expression`);
      expressions.forEach((source) => {
        const ast = parseExpression(source);
        const graph = sampleExpression(ast, family.viewport, 678, 406);
        assert.ok(graph.segments.length >= 1, `${family.label} should plot ${source}`);
        assert.equal(graph.hitBudget, false, `${family.label} should stay inside the sample budget`);
      });
    });
  });
});

test('preset expressions use natural student-facing notation', () => {
  const parabola = EQUATION_FAMILIES.find((family) => family.id === 'parabola');
  const tangent = EQUATION_FAMILIES.find((family) => family.id === 'tangent');
  assert.ok(parabola && tangent);
  assert.equal(parabola.forms[0].buildExpressions(initialParameters(parabola.forms[0]))[0], 'x^2-3');
  assert.equal(tangent.forms[0].buildExpressions(initialParameters(tangent.forms[0]))[0], 'tan(x)');
});

test('formats editable expressions as LaTeX', () => {
  assert.equal(expressionToLatex('x^2-3'), 'y = {x}^{2} - 3');
  assert.match(expressionToLatex('1/(x-2)'), /\\frac/);
  assert.match(expressionToLatex('sqrt(x)'), /\\sqrt/);
});

test('known asymptotes follow transformations and the viewport', () => {
  const reciprocal = EQUATION_FAMILIES.find((family) => family.id === 'reciprocal');
  const tangent = EQUATION_FAMILIES.find((family) => family.id === 'tangent');
  assert.ok(reciprocal && tangent);
  const reciprocalValues = { ...initialParameters(reciprocal.forms[0]), c: 2, d: -1 };
  assert.deepEqual(reciprocal.forms[0].asymptotes?.(reciprocalValues, reciprocal.viewport), [
    { orientation: 'vertical', value: 2, latex: 'x=2' },
    { orientation: 'horizontal', value: -1, latex: 'y=-1' },
  ]);
  const tangentAsymptotes = tangent.forms[0].asymptotes?.(initialParameters(tangent.forms[0]), tangent.viewport) ?? [];
  assert.ok(tangentAsymptotes.some((asymptote) => Math.abs(asymptote.value - Math.PI / 2) < 1e-10));
  assert.ok(tangentAsymptotes.every((asymptote) => asymptote.value >= tangent.viewport.xMin && asymptote.value <= tangent.viewport.xMax));
});

test('infers asymptotes for common user-entered functions', () => {
  const viewport = { xMin: -8, xMax: 8, yMin: -8, yMax: 8 };
  assert.deepEqual(inferAsymptotes('2/(x-3)+1', viewport), [
    { orientation: 'vertical', value: 3, latex: 'x=3' },
    { orientation: 'horizontal', value: 1, latex: 'y=1' },
  ]);
  assert.deepEqual(inferAsymptotes('log(x+2)', viewport), [
    { orientation: 'vertical', value: -2, latex: 'x=-2' },
  ]);
  assert.ok(inferAsymptotes('tan(x)', viewport).some((asymptote) => Math.abs(asymptote.value - Math.PI / 2) < 1e-7));
  assert.deepEqual(inferAsymptotes('x^2-3', viewport), []);
});

test('circle form produces upper and lower branches', () => {
  const family = EQUATION_FAMILIES.find((candidate) => candidate.id === 'circle');
  assert.ok(family);
  const form = family.forms[0];
  const expressions = form.buildExpressions(initialParameters(form));
  assert.equal(expressions.length, 2);
  assert.equal(form.displayExpression?.(initialParameters(form)), 'x^2+y^2=16');
  assert.equal(evaluate(expressions[0], 0), 4);
  assert.equal(evaluate(expressions[1], 0), -4);
});

test('viewport fields and panning use no more than two decimal places', () => {
  assert.equal(formatViewportBound(-6.7478266), '-6.75');
  assert.equal(formatViewportBound(8), '8');
  assert.equal(formatViewportBound(0.20946928), '0.21');
  assert.deepEqual(
    panViewport({ xMin: -10, xMax: 10, yMin: -6, yMax: 6 }, 3.2521734, 6.20946928),
    { xMin: -6.75, xMax: 13.25, yMin: 0.21, yMax: 12.21 },
  );
});

test('zooming uses clean, predictable viewport bounds', () => {
  const start = { xMin: -10, xMax: 10, yMin: -6, yMax: 6 };
  assert.deepEqual(zoomViewport(start, 'out'), { xMin: -20, xMax: 20, yMin: -10, yMax: 10 });
  assert.deepEqual(zoomViewport(start, 'in'), { xMin: -5, xMax: 5, yMin: -5, yMax: 5 });
  assert.deepEqual(zoomViewport(zoomViewport(start, 'out'), 'in'), { xMin: -10, xMax: 10, yMin: -5, yMax: 5 });
});
