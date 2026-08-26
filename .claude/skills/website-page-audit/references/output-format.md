# Output Format

Follow this section order exactly so repeated audits (same page over time, or Claude vs. Codex on the same page) stay comparable. Don't pad with generic advice — every section should contain only what's actually true of this page.

## Audit Summary

```
- URL / route: [path]
- Page type: [family from site-page-types.md]  (+ redirect note if the input route redirected here)
- Classification confidence: High / Medium / Low
- Audit mode: Quick / Full / Focused ([areas] if Focused)
- Primary audience: [from the page type's writeup]
- Primary purpose: [from the page type's writeup]
- Primary conversion: [from the page type's writeup]
- Weighting profile used: [profile name] ([hybrid blend %, if applicable])
- Audit status: PASS / FAIL
- Overall score: XX/100
```

## Scorecard

Table, one row per scored dimension, in weight-descending order:

| Category | Raw /5 | Weight | Weighted contribution |
|---|---|---|---|
| ... | ... | ... | ... |
| **Total** | | **100** | **XX/100** |

Generate this from `calculate_score.py`'s output, not by re-typing numbers by hand.

## Critical Failures

**Omit this section entirely if none tripped** — don't write "none found." If any tripped, one entry per gate: name, evidence, and the FAIL line per `critical-gates.md`.

## Key Findings

3–6 bullets, the findings that actually matter most — not an exhaustive list (that's what Detailed Category Review and Defects/Weaknesses/Opportunities are for).

## Detailed Category Review

One subsection per scored dimension, each containing: evidence, problems found, recommendation. This is where the full per-dimension detail lives — Key Findings above should be a distillation of this, not a duplicate of it.

## Responsive Review

*(Full mode, or Focused with "mobile" — Quick mode may include a lighter version if a browser pass was done.)* Per-viewport notes from the set in `responsive-audit.md`, only for widths actually tested. State explicitly which viewports were tested via live browser vs. reasoned from Tailwind breakpoint classes in source.

## Defects

Objective failures only (see definition in `audit-rubric.md`). List format: `[Severity] Description — evidence — file/component if known`.

## Weaknesses

Functions but underperforms (see definition). Same list format.

## Opportunities

Non-deficient improvements (see definition). Same list format.

## Prioritised Action Plan

Group by severity, each item with: Problem, Why it matters, Recommended fix, Expected impact, Effort (Small/Medium/Large), and the likely file/component if identifiable.

- **P0 – Critical:** broken functionality or a severe blocker (usually mirrors a tripped gate).
- **P1 – High:** likely to materially hurt usability, conversion, accessibility, or credibility.
- **P2 – Medium:** meaningful improvement, not blocking.
- **P3 – Low:** polish, refinement, optional enhancement.

## Highest-Impact Improvements

3–5 changes likely to produce the greatest benefit, pulled from the action plan above — this is a "start here" pointer, not a new list of findings.

## Final Assessment

Short paragraph: what currently limits this page most. Not a summary of every section — the single clearest bottleneck.

---

## Notes on tone and length

- Every claim traces to evidence already stated in Detailed Category Review or Responsive Review — don't introduce a new unsupported claim in Key Findings or Final Assessment.
- If a browser tool/dev server wasn't available for part of the audit, say so at the point it matters (e.g. in Responsive Review: "not verified — static read only, reasoned from `sm:`/`lg:` classes in source") rather than silently guessing or silently omitting the section.
- Keep the report as long as the page's actual findings warrant — a simple page with few issues should produce a short report, not one padded to match a template's shape.
