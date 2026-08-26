# Graph Lab Light and Dark Theme Design

## Scope

The theme system belongs only to `/maths-graph-lab`. It must not alter the Mathematics subject page, Fourier visualisation, shared navigation, shared footer, or any other website route.

## Behaviour

- A first-time visitor starts in light mode.
- A visible Light/Dark control sits in the Graph Lab header beside the Guided Learning/Free Graph control.
- A manual choice is stored in `localStorage` under a Graph-Lab-specific key.
- Returning visitors resume their saved Graph Lab theme.
- Changing theme never changes expressions, viewport, selected equation family, parameter values, mode, lesson step, answers, or mastery progress.
- Both Guided Learning and Free Graph use the selected theme.

## Visual Direction

Both modes use the same layout and interaction vocabulary.

### Light

A precise, layered study workspace. Cool pale-blue background, white instrument panels, clearer borders, stronger active-state depth, navy typography, violet learning progress, and gold reserved for the current target or important mathematical state.

### Dark

A focused mathematical instrument. Deep ink-navy workspace and panels, crisp pale text, fine technical grid, restrained gold glow on the active graph and target equation, and violet for guided progress and secondary state. Decorative atmosphere remains subtle and stays behind the graph.

## Accessibility

- All body text and controls must retain WCAG AA contrast.
- Focus indicators remain visible in both themes.
- Disabled, error, success, selected, and hover states must not rely on colour alone.
- Mathematical grid lines remain subordinate to axes and plotted curves.
- Reduced-motion users receive no decorative animation.

## Architecture

- `graph-lab-theme.ts` owns the theme type, storage key, safe reading, and safe writing.
- `MathsGraphLab.tsx` owns theme state and places `data-graph-lab-theme` on the route root.
- `graph-lab-theme.css` defines scoped semantic tokens and component treatments.
- Graph Lab components use semantic classes or CSS variables rather than a second duplicated component tree.
- `GraphCanvas` receives the theme so plotted colours and SVG grid/axis colours can adapt without mutating expression data.

## Acceptance Criteria

1. Clearing Graph Lab theme storage and loading the route shows light mode.
2. Choosing dark mode updates only the Graph Lab surface and saves the choice.
3. Reloading restores dark mode.
4. Switching theme preserves the current graph and guided step.
5. Navigation and footer remain on their existing website styling.
6. Graph labels, axes, equations, controls, asymptotes, errors, and focus states remain readable in both themes.
7. Graph Lab tests, focused ESLint, typecheck, and production build pass.
