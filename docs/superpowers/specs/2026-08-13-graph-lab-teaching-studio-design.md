# Graph Lab Teaching Studio Design

## Approved outcome

The Graph Lab workspace becomes a three-column teaching studio on desktop: expressions and examples on the left, the graph and viewport controls in the centre, and the selected equation form with parameter sliders on the right. Below 1180px the existing stacked flow remains so controls do not become cramped.

## Behaviour

- Viewport fields show no more than two decimal places and omit trailing zeros.
- Dragging rounds the translated viewport to two decimal places, without altering zoom span unexpectedly.
- Asymptotes use a light underlay, a stronger dashed gold foreground, and direct on-graph labels so they remain visible when coincident with an axis.
- A circle remains two sampled y-branches internally because the safe parser graphs functions of x, but the expression list and legend expose one logical centre-radius equation only.
- Circle visibility and removal operate on both internal branches together. Circle parameters remain editable through the right-side sliders.

## Layout

- At 1180px and wider: `260px / flexible graph / 340px`, with 16px gaps and a wider workspace maximum.
- The graph is the primary visual surface. Viewport controls sit directly beneath it.
- The parameter inspector removes its redundant top divider when placed in the right panel and uses a compact two-column slider grid where space permits.
- Tablet and mobile remain vertically stacked; no horizontal page overflow is allowed.

## Verification

- Unit tests cover two-decimal viewport formatting and the single logical circle display contract.
- Rendered QA covers desktop three-column placement, asymptote contrast/labels, circle grouping, drag rounding, and a 390x844 mobile viewport.

