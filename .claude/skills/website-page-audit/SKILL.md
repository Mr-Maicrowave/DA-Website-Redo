---
name: website-page-audit
description: Use when asked to audit, review, critique, or score a specific page/route of this website (DA Tuition) — e.g. "audit /subjects/mathematics", "audit the homepage", "review /contact for mobile and accessibility". Also use when asked to audit an entire page family (e.g. "audit every Subject Landing Page"). Not for general frontend design work with no specific page/route named — see the impeccable skill for that.
user-invocable: true
argument-hint: "[route or URL] [Mode: quick|full|focused] [Page type: ...] [Focus: mobile,accessibility,conversion,...]"
---

# Website Page Audit

## Overview

A repo-calibrated audit system for this site. There is no single generic scorecard — every page is first classified into one of this repo's actual page-type families, then scored against that family's weighting profile across a shared 14-dimension rubric, with critical-failure gates that can force a FAIL independent of the numeric score. The framework was derived by reading `src/App.tsx`, `src/pages/**`, `src/components/NavigationNew.tsx`, and representative pages from every family — not assumed from generic web-audit conventions.

**Core principle:** evidence over vibes. No dimension may be scored without a specific, checkable reason ("hero H1 wraps to 4 lines on 375px, pushing the CTA below the fold" — not "layout could be tighter").

## Required reading order

Before scoring anything, load in this order:

1. **`references/site-page-types.md`** — the taxonomy. Use this to classify the target page.
2. **`references/page-weightings.md`** — the weight table for the classified type. Weights always sum to 100.
3. **`references/audit-rubric.md`** — the 14 dimensions, the 0–5 scale, and the evidence/defect/weakness/opportunity rules.
4. **`references/critical-gates.md`** — check these regardless of mode.
5. For Full or Focused(mobile) audits: **`references/responsive-audit.md`**.
6. **`references/output-format.md`** — the report skeleton. Always follow it; don't improvise structure.

Don't skip straight to scoring from memory of a prior audit in this conversation — reload the weighting table for *this* page's type; profiles differ enough (e.g. Interactive Tool weights Usability at 28%, Booking Form weights it 24%, most others omit it entirely) that guessing from a previous page's numbers will misscore.

## Workflow

```
1. Resolve the input to a route
   - Bare path ("/faq") or full URL → strip origin, keep path.
   - Redirect routes (/interview, /reviews, /appreciation-advice, /teachers,
     /our-teachers, /testimonials, /subjects) resolve to their destination
     — see redirect table in site-page-types.md. Audit the destination,
     note the redirect in the summary.
   - /book-intro-calibration is dev-only (import.meta.env.DEV-gated) —
     refuse to audit as a public page; say so.

2. Classify the page (site-page-types.md)
   - If the user stated a page type explicitly, use it unless the route's
     actual implementation (component file, H1, CTA target) strongly
     contradicts it — if it does, say so and ask before proceeding.
   - Otherwise infer from: route path, page component's structure/H1,
     primary CTA target, surrounding nav placement (which NavigationNew
     dropdown links to it, if any), and content shape.
   - Report classification confidence: High / Medium / Low.
   - Two genuinely blended purposes → build a hybrid profile per the
     "Hybrid profiles" rule in page-weightings.md. Don't invent a hybrid
     just because confidence is Medium instead of High.

3. Pick the audit mode (see Modes below). Default to Full if the user
   didn't specify and this is the first audit of that page in the
   conversation; default to Quick for a fast follow-up re-check.

4. Gather evidence
   - Read the actual page component (src/pages/... or src/pages/subjects/...
     etc.) and the shared components it composes (NavigationNew, FooterNew,
     SEO, SubjectHero, CTASection, forms...).
   - If browser tools are available (Claude in Chrome, or a Codex browser
     tool) and a dev server is reachable, drive the real page — this is
     required for Full audits' responsive/console/interaction checks and
     strongly preferred for Quick audits too. If no browser tool or no dev
     server is available, say so explicitly in the report and mark
     browser-only checks (console errors, live responsive behavior, actual
     click-through) as "not verified — static read only" rather than
     guessing at their outcome.
   - Never invent evidence. A dimension you couldn't actually check gets a
     note explaining why, not a filled-in score.

5. Check critical gates (critical-gates.md) — always, all modes.

6. Score every dimension the profile lists (audit-rubric.md scale).
   Each score needs: evidence, problems found, recommended change, severity.

7. Compute the weighted total with scripts/calculate_score.py — don't do
   the arithmetic by hand. Feed it the profile's weights and your raw
   scores; it returns weighted contributions, the /100 total, and flags
   whether any gate makes the status FAIL regardless of the number.

8. Write the report following output-format.md exactly, in that section
   order. Classify every finding as Defect / Weakness / Opportunity
   (definitions in audit-rubric.md) and prioritize P0–P3.

9. Save every report as a standalone .md file, not just when asked — this
   is default behavior. Check for a stored preference (memory/prior
   conversation) for where reports go for this project; if one exists,
   use it without asking again. Give the file light Obsidian-friendly
   frontmatter (page, route, page type, mode, status, score, date, tags).
   Say where it was saved in the reply so it stays visible. This skill
   deliberately does not hardcode the save path in this file — that's a
   personal/environment detail, not a repo convention, and could differ
   per machine/user. If no location is known yet, ask once, then treat
   the answer as the standing default from then on.
```

## Modes

- **Quick** — visual quality, responsive behavior, first impression, engagement, hierarchy, UX, conversion, trust, obvious accessibility/technical defects. Source read + browser pass if available; skip deep code/network/SEO inspection.
- **Full** — everything in Quick, plus: source code read of the page and its shared components, breakpoint-by-breakpoint responsive check (`responsive-audit.md`), form/interaction testing, console errors, broken links, semantic HTML, accessibility implementation (not just visual), metadata/JSON-LD correctness, asset/image loading, error states.
- **Focused** — user names one or more areas (mobile, accessibility, conversion, performance, design, SEO, usability). Score only the dimensions those areas touch, but still run the critical-gates check in full — a gate isn't optional just because the user asked for a mobile-only pass.

## Page-family batch audits

"Audit every Subject Landing Page" → resolve the family's route list from `site-page-types.md`, audit each with the same mode, then add a short cross-page comparison (which page in the family scores lowest and why, any near-duplicate-content risk for Location pages, any inconsistency in shared-component usage).

## Cross-references

Not a substitute for **impeccable** — reach for that skill instead when the ask is open-ended design/redesign work with no specific page to score. This skill is specifically for producing a comparable, evidence-scored audit report for a named page or page family.

## Codex / non-Claude usage

Everything here is plain Markdown plus one dependency-free Python 3 script — nothing here calls a Claude-specific tool. A Codex (or other agent) session can be pointed directly at this file's path and asked to follow it; there's no Skill-loading mechanism to rely on outside Claude Code, so state explicitly "read and follow `.claude/skills/website-page-audit/SKILL.md`" when invoking it that way.
