# Audit Rubric

## The 14 dimensions

Combined from the spec's 14 with one merge and one addition (see rationale below). Every weighting profile in `page-weightings.md` lists only the subset of these that actually applies to its page type — a dimension not listed for a profile is not scored for that page type at all (not scored-and-zeroed).

1. **Visual Design & Polish** — typography, spacing, color use, imagery quality, finishing detail.
2. **Responsive Design** — behavior across the viewport set in `responsive-audit.md`, not just "does it not break."
3. **First Impression / Wow Factor** — does the page create interest/memorability/perceived quality in the first few seconds, without delaying access to content. See "Wow factor" rules below.
4. **Engagement & Interaction** — does the page invite continued scrolling/interaction (carousels, animation, micro-interaction) in a way that serves the content rather than decorating it.
5. **Clarity & Information Hierarchy** *(merged)* — can a visitor tell, at a glance, what matters most and what to do next; is content structured (headings, chunking, visual weight) to support that. Merged from the spec's separate "Clarity & Comprehension" and "Information Hierarchy" — in practice they're the same failure mode (a visitor can't tell what matters) and splitting them produced duplicate evidence when dry-run against real pages on this site.
6. **Navigation & User Journey** — can the visitor get where they're trying to go, from this page, in the site's actual nav structure (`NavigationNew`'s Programs/Subjects/About/Resources dropdowns, breadcrumbs, in-page links).
7. **Conversion Effectiveness** — CTA visibility, placement, wording, friction, and whether it points at the page type's actual primary conversion (see `site-page-types.md` per type).
8. **Trust & Credibility** — social proof, specificity of claims, professional execution, third-party validation (reviews, awards, named results).
9. **Content Quality & Persuasion** — accuracy, specificity, genuine expertise vs. generic filler, persuasive structure. On non-sales pages (Legal, Error) this means accuracy/completeness rather than sales copy — see the page type's write-up for what "quality" means on that specific profile.
10. **Usability & Task Completion** *(added)* — for pages where the visitor must actually complete a task: fill a form, use a filter, operate a tool. Covers error handling, feedback states, friction, and whether the task can be completed at all. Justified by this repo's real functional surfaces: `MathsGraphLab`'s parsed-expression graphing tool, `FindTeacher`'s catalogue filter, and the `BookInterview`/`ContactUs` forms — none of the original 14 dimensions distinguish "delightful but broken" from "plain but functional" for these, which the spec explicitly calls out as a real risk (rewarding animation for existing).
11. **Accessibility** — semantic HTML, contrast, keyboard operability, focus management, labels/ARIA, `prefers-reduced-motion` handling (this codebase already checks `matchMedia('(prefers-reduced-motion: reduce)')` in `NavigationNew` — verify pages relying on animation respect it too).
12. **Performance & Technical Quality** — load behavior, animation smoothness (this site is framer-motion-heavy — check for jank, not just presence of animation), console errors, broken assets.
13. **SEO & Discoverability** — `SEO` component usage (title/description/canonical/OG/Twitter), JSON-LD correctness (and whether it matches visible content — a schema/content mismatch is a defect, not a nicety), heading structure, `noindex` correctness.
14. **Brand Consistency** — adherence to the site's actual established design language: navy/gold palette (`brand-navy`, `brand-gold` etc.), `'Cormorant Garamond'`/`'DM Sans'` or `'Libre Baskerville'` type pairing depending on section, the gradient-transition section system documented in this repo's `CLAUDE.md`. Judge against what this site actually does elsewhere, not generic "good design" preference. **Typography/font continuity is part of this dimension, not a separate one — always check it explicitly, not just palette.** This site has a confirmed, systemic font-consistency defect worth checking on every page: `tailwind.config.ts` maps `font-serif` → `Merriweather` and `font-heading` → `Outfit`, but neither font is ever loaded (no `<link>` in `index.html`, no `@import`/`@font-face` in any stylesheet) — both silently fall back to a generic system serif/sans wherever used. `font-serif` alone appears in 21+ files spanning nearly every page family (Subject, Program, FAQ, Booking, About pages). Separately, the site loads *ten-plus* distinct font families across two uncoordinated sources — `index.html`'s Google Fonts link (Anton, Inter, Baloo 2, Libre Baskerville, Playfair Display) and `src/styles/academy-theme.css`'s `@import` (Cinzel, Cormorant Garamond, EB Garamond, Marcellus, Playfair Display again) — with no single page expected to use anywhere near all of them. When scoring this dimension on any page: (1) list which font-family declarations actually appear in that page's source (Tailwind utility classes and inline `fontFamily` styles alike), (2) cross-check each against `tailwind.config.ts`'s `fontFamily` block and the two loading sources above to confirm the font is actually loaded, not just named, and (3) compare against the brand serif/sans pair (`'Cormorant Garamond'` + `'DM Sans'`) used on the site's more recently-built pages (e.g. `ContactUs.tsx`, which deliberately sets `fontFamily` inline instead of using `font-serif` for exactly this reason) to judge whether the page's fonts are on-brand or drifted.

## 0–5 scoring scale

| Score | Meaning |
|---|---|
| 0 | Fundamentally broken or absent where required |
| 1 | Severe problems |
| 2 | Clearly below acceptable standard |
| 3 | Acceptable / competent — the default assumption for something that works with no notable issue |
| 4 | Strong — requires specific evidence of why it exceeds competent |
| 5 | Exceptional — requires specific evidence; reserve for genuinely best-in-class execution, not "no complaints" |

**No inflation.** 3 means competent, not "somewhat bad." A page with no defects in a dimension and nothing exceptional about it scores 3, not 4. 4 and 5 require citing the specific thing that makes it strong/exceptional — if you can't name it, the score is 3.

## Scoring formula

```
weighted category score = (raw score / 5) × category weight
overall page score = sum of all weighted category scores   (max 100)
```

Always run `scripts/calculate_score.py` to compute this — don't do it by hand. See that script's `--help` for input format.

## Evidence requirement (mandatory per dimension)

Every scored dimension in the report must include all of:

- **Raw score** (0–5)
- **Weight** (from the page's profile)
- **Weighted contribution** (from the script)
- **Specific evidence** — cite the actual element/copy/component/behavior. "Hero H1 in `SubjectHero.tsx` renders `headlineWhite`/`headlineGold` at `clamp(2.2rem, 4.5vw, 3.8rem)`" not "the heading looks fine." If observed live in-browser, describe what was seen/clicked, not a generic claim.
- **Problems found** (if any)
- **Recommended change** (if any)
- **Severity** (if a problem was found)

Never write "Visual design: 4/5 — looks professional." That sentence contains no evidence and is not acceptable output.

**Mark confidence when evidence is calculated rather than measured.** A contrast ratio computed from a component's declared hex/alpha values, or a touch-target size read from CSS rather than a rendered/measured element, is legitimate evidence — but say so ("by calculation from the declared values, not live-measured") rather than presenting it with the same confidence as something directly observed in a browser. This keeps a plausible-but-unconfirmed risk from being silently indistinguishable from a verified one.

## Defects vs. Weaknesses vs. Opportunities

Every finding gets exactly one of these three labels — don't blend them.

- **Defect** — objectively broken, incorrect, or failing. Something a reasonable person would call a bug. *Examples: a CTA button that doesn't navigate; text that clips on a 375px viewport; body text under 4.5:1 contrast; a form that silently fails to submit; a console error that visibly affects behavior; a JSON-LD schema answer that contradicts the visible accordion text.*
- **Weakness** — the page functions, but materially underperforms what it could. Not a bug — a missed opportunity to do the job better. *Examples: CTA is present and works but has weak visual hierarchy against surrounding content; important trust signal (reviews, results) is present but appears far below the fold; hero messaging is technically readable but doesn't communicate the actual value prop in the first sentence.*
- **Opportunity** — the page isn't deficient here, but there's a substantive upgrade available. Never treat a speculative enhancement as a defect or weakness. *Examples: an interactive course/subject selector where a static list currently works fine; a richer result-visualization on a Service Landing Page; a more distinctive branded micro-interaction on a page that currently uses a generic pattern.*

If you're unsure whether something is a Weakness or an Opportunity: if removing it wouldn't make the page worse than it is today, it's an Opportunity, not a Weakness.
