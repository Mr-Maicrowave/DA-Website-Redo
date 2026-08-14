# DA Graph Lab — implementation handoff

## Objective

Turn the current `/maths-graph-lab` MVP into a polished, DA-branded graphing laboratory for Years 9–12 and HSC Mathematics.

The product should help students investigate how an equation becomes a graph, not simply reproduce a calculator. Every major control should answer a mathematical question and connect to a syllabus idea.

## Current implementation

Primary files:

- `src/pages/MathsGraphLab.tsx` — standalone page, expression parser, SVG renderer, controls and syllabus copy.
- `src/App.tsx` — route: `/maths-graph-lab`.
- `src/pages/subjects/Mathematics.tsx` — Mathematics page navigation link labelled “Graphing lab”.

Current capabilities:

- Multiple expression rows with colour-coded curves.
- Safe hand-written parser; do not replace it with `eval` or `new Function`.
- Operators: `+`, `-`, `*`, `/`, `^`.
- Values: `x`, `pi`, `e`, brackets and `sin`, `cos`, `tan`, `sqrt`, `abs`.
- SVG graph with configurable x/y ranges.
- Preset examples: parabola, sine, transformed sine and reciprocal.
- Reset view and invalid-expression feedback.
- Responsive layout and a basic syllabus connection panel.

Known current bug: the examples advertise `2sin(x)` and `2sin(2x)+1`, but the parser currently requires explicit multiplication. Add implicit multiplication before expanding the examples, or change the examples to `2*sin(x)` temporarily.

## Product direction

The Graph Lab should sit between a calculator and a guided lesson:

```text
enter an equation
→ see the graph
→ inspect what the numbers mean
→ change one parameter
→ explain the visual change
→ connect it to syllabus language
```

Do not attempt to clone every Desmos feature. Prioritise mathematical clarity, performance, accessibility and DA’s teaching voice.

## Phase 1 — graph quality and coordinate system

### Axes and labels

Replace the current grid-only presentation with a real coordinate system:

- Draw x- and y-axis arrows where the axes are visible.
- Add numeric tick labels on both axes.
- Choose tick spacing automatically from the viewport: `1`, `2`, `5`, `10`, `0.5`, etc.
- Avoid label collisions and hide labels that are too close together.
- Format values cleanly: `0`, `π`, `π/2`, `−1`, `1.5`; avoid long floating-point strings.
- Label the axes `x` and `y`.
- Keep the origin label from colliding with either axis.
- Add light major grid lines and optional lighter minor grid lines.
- Preserve a stable aspect ratio where appropriate so circles do not become ellipses.
- Ensure axes, labels and graph colours meet WCAG contrast requirements.

### Viewport

Replace four independent range sliders with a clearer viewport model:

- Numeric fields for `x_min`, `x_max`, `y_min`, `y_max`.
- Zoom in, zoom out and reset buttons.
- Optional drag-to-pan interaction on the plot.
- Prevent invalid ranges such as `x_min >= x_max`.
- Keep the graph frame a stable size while the viewport changes.

### Path rendering

- Sample adaptively rather than always using 480 points.
- Break paths at discontinuities and out-of-range values.
- Clip curves to the graph viewport.
- Detect near-vertical jumps so reciprocal and tangent graphs do not draw false connecting lines.
- Use `requestAnimationFrame` only for deliberate animations; normal graph edits should update synchronously.

## Phase 2 — equation understanding

### General-form visualiser

Add a mode that shows a general form beside the graph. The first target should be:

\[
y = A\sin(B(x-C))+D
\]

Show four parameter controls and animate only the relevant visual change:

| Parameter | Meaning | Visual effect |
|---|---|---|
| `A` | amplitude | vertical stretch/reflection |
| `B` | angular frequency | period changes: `T = 2π / |B|` |
| `C` | horizontal translation | phase/position shift |
| `D` | vertical translation | midline shifts |

Requirements:

- Highlight the changed letter in the equation when a slider moves.
- Show a dashed midline `y = D`.
- Show amplitude arrows and one period bracket where legible.
- Explain radians and period in plain language.
- Add a “predict first” prompt before revealing the change.

### Equation forms

Support structured forms rather than only raw text:

- Linear: `y = mx + b`.
- Quadratic: `y = a(x-h)^2+k`.
- Reciprocal: `y = a/(x-h)+k`.
- Exponential: `y = ab^x+k`.
- Sine/cosine: `y = A sin(B(x-C))+D`.
- Circle: `(x-h)^2+(y-k)^2=r^2` as a future implicit-graph feature.

For each form, provide a small “What the letters do” panel and a syllabus tag.

## Phase 3 — graph annotations and mathematical meaning

Add computed, inspectable features for the selected expression:

- x-intercepts / roots.
- y-intercept.
- Turning points for polynomials where reliably detected.
- Local maximum and minimum.
- Gradient at a selected point where a derivative method is available.
- Tangent line and secant line.
- Domain and range notes.
- Period, amplitude and midline for periodic functions.
- Asymptotes for reciprocal, rational, tangent and exponential forms.
- Intersections between two selected expressions.

Each annotation should be toggleable and keyboard accessible. Clicking a marked point should show its coordinate and a short explanation, for example:

> This point is an x-intercept because `y = 0` here.

For asymptotes, distinguish:

- Vertical asymptote: the graph approaches `x = a` but does not cross it in the model.
- Horizontal asymptote: the graph approaches `y = b` as `x` becomes very large or very small.
- Oblique/slant asymptote: defer until polynomial division is implemented correctly.

Do not infer asymptotes from visual proximity alone. Use the parsed expression type or a validated symbolic/numerical method.

## Phase 4 — interaction and learning design

Add a right-hand “Inspector” panel with tabs:

- **Graph** — viewport, labels, colours and visibility.
- **Equation** — general form and parameter meanings.
- **Features** — intercepts, turning points, asymptotes and period.
- **Syllabus** — relevant NSW outcome/topic and a short explanation.

Recommended activity prompts:

- “What will happen if the amplitude doubles?”
- “Which value controls the period?”
- “Where does the graph cross the x-axis?”
- “Why is there a break in the reciprocal graph?”
- “How does the graph change when `D` increases?”

Use a reveal pattern:

```text
Question → prediction → change the control → observe → explain
```

## Phase 5 — supported graph families

Prioritise these in order:

1. Linear and quadratic functions.
2. Sine and cosine functions.
3. Reciprocal and rational functions.
4. Exponential and logarithmic functions.
5. Piecewise functions.
6. Parametric curves.
7. Inequalities and shaded regions.
8. Implicit curves and circles.

Do not add a graph family until its parser, plotting, discontinuity handling, annotations and syllabus explanation are all defined.

## Parser and data architecture

Refactor the page into focused modules before adding many features:

```text
src/features/graph-lab/
  parser.ts              tokenizer and AST parser
  evaluator.ts           safe numerical evaluation
  sampling.ts            adaptive sampling and discontinuities
  viewport.ts            ranges, ticks and coordinate transforms
  annotations.ts         intercepts, extrema, asymptotes
  equation-presets.ts    structured equation families
  syllabus-data.ts       topic/outcome metadata
  GraphCanvas.tsx        SVG/canvas plot surface
  ExpressionList.tsx     expression rows
  GraphInspector.tsx     annotations and explanations
```

Use a typed AST rather than evaluating arbitrary JavaScript. The AST should make it possible to identify functions and parameters for annotations and explanations.

Suggested core types:

```ts
type Viewport = { xMin: number; xMax: number; yMin: number; yMax: number };
type GraphExpression = {
  id: string;
  source: string;
  ast?: ExprNode;
  color: string;
  visible: boolean;
  error?: string;
};
type Annotation = {
  kind: 'root' | 'intercept' | 'turning-point' | 'asymptote' | 'period' | 'tangent';
  x?: number;
  y?: number;
  equation?: string;
  explanation: string;
};
```

## Accessibility and responsive requirements

- Every control has a visible label and keyboard focus state.
- Expression errors are announced with `aria-live`.
- Graphs include a useful accessible description, not only “graph”.
- Do not rely on colour alone to distinguish functions; include expression labels and optional line styles.
- Reduced motion must disable animated graph transitions.
- On mobile, stack the expression list, graph and inspector; keep the graph readable at a fixed aspect ratio.
- Numeric inputs must remain usable without a mouse.

## Performance requirements

- Keep the current SVG approach for the first several graph families.
- Move to Canvas only if many expressions or dense sampling make SVG slow.
- Debounce expensive annotation calculations while typing.
- Never run symbolic analysis on every animation frame.
- Add a maximum sample budget and a friendly message when a graph is too complex.

## Acceptance criteria for the next model

- `npm run typecheck` passes.
- `npm run build` passes.
- `/maths-graph-lab` loads without console errors.
- `2sin(x)` either works correctly through implicit multiplication or is no longer advertised.
- Axes show correctly formatted numeric labels at multiple zoom levels.
- `1/x` and `tan(x)` render with visible breaks at discontinuities.
- A sine-form preset visibly identifies amplitude, period, phase shift and midline.
- At least one asymptote is calculated and explained correctly.
- At least one intercept and one turning point can be selected and explained.
- Changing a parameter updates the equation, graph and explanation together.
- The graph frame does not resize when expression count, term count or annotation count changes.
- Mobile and reduced-motion states are manually checked.

## Product guardrails

- This is an educational graphing lab, not a promise to replace Desmos immediately.
- Avoid copying Desmos branding, layout or proprietary interface details.
- Build DA’s differentiator around guided investigations, syllabus mapping and explanations.
- Keep the first public release small enough to test with students and tutors.
