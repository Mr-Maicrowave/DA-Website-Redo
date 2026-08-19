# Critical Gates

Checked on **every** audit, every mode, regardless of which page type or focus areas were requested — a gate isn't optional because the user asked for a "quick" or "mobile-only" pass. If any gate trips, the report shows both the numeric weighted score **and** `Audit status: FAIL` with the specific reason. A page can score high numerically and still FAIL — that's the point of a gate: the weighted score can't hide a catastrophic problem.

Only mark a gate as tripped from **direct evidence** (something read in source or observed live) — never speculate one might be tripped.

## Universal gates (any page)

| Gate | Trip condition |
|---|---|
| Core navigation broken | `NavigationNew` hamburger doesn't open `MobileNavSheet`, a dropdown (Programs/Subjects/About/Resources) doesn't reveal its links, or a nav link doesn't navigate. |
| Major rendering/JS failure | React error boundary shown, blank page, or a console error that visibly breaks layout/interaction (not a benign warning). |
| Mobile content inaccessible | Horizontal scroll/overflow, clipped/cut-off text, or content unreachable due to a fixed/sticky element (`StickyBookButton`, the adaptive nav bar) permanently covering it. |
| Severe responsive layout failure | Any tested breakpoint (see `responsive-audit.md`) renders overlapping, illegible, or unusably cramped content — not just "could be tighter." |
| Major accessibility barrier | A barrier that actually **prevents** completing the page's primary task — e.g. a focus trap with no escape, an interactive control with no accessible name, contrast so low required text is unreadable. (A moderate contrast miss on decorative text is a Defect, not a gate — reserve gates for task-blocking severity.) |
| Misleading/contradictory critical info | Content on the page contradicts verifiable source-of-truth data in this repo — e.g. business hours/phone/address shown differs from `src/data/business-info.ts`; a claim contradicted elsewhere on the same page. |
| Severe performance | Page is practically unusable — animation/scroll janks so badly interaction is blocked, or a resource fails to load such that core content never appears. |

## Page-type-specific gates

| Page type | Gate | Trip condition |
|---|---|---|
| Homepage, Service Landing Page, About/Trust, Social Proof | Primary CTA dead | The path to `/book-interview` (button/link) is missing, unstyled-as-non-interactive, or doesn't navigate. |
| Booking / Enquiry Form Page | Form cannot be completed, or completion is fake | `/book-interview`: step navigation traps the user; no confirmation state after submit; **or a confirmation state exists but no data-transmission call backs it** — grep the file for `fetch`/`axios`/an API call before trusting a "Thank You" screen, since a confirmation UI with no send/persist behind it is a trip, not a pass. `/contact`: `submitEnquiry`'s error path (`submitError`) isn't actually surfaced to the user, or a successful submit doesn't flip `submitted` visibly. |
| Interactive Tool Page | Core task cannot be completed | `/find-teacher`: a valid filter selection returns zero results for a subject that has tutors in `teacherCatalogue.ts`, or pagination doesn't advance. `/maths-graph-lab`: a syntactically valid expression fails to render, or viewport zoom/pan controls don't respond. |
| FAQ Page | Schema/content contradiction | `faqPageSchema`'s `schemaAnswer` text materially contradicts the visible accordion answer for the same question. |
| Local SEO Location Page | Local info contradiction | Suburb-specific content (schools/transport/address) is factually implausible for that suburb, or business address/phone contradicts `business-info.ts`. |
| Legal / Policy Page | Contradicts actual practice | Privacy Policy claims contradicted by the site's actual data collection (e.g. a form field the policy doesn't mention, or a stated retention/contact process not matched by `contactInfo`). |
| Error Page | No recovery path | The 404 page offers no way back to the site at all (currently it has exactly one plain-text home link and no `NavigationNew` — verify this is still true and score/gate accordingly; don't assume it's fixed without checking). |

## Reporting a gate

```
**Numeric score: 62/100**
**Audit status: FAIL**
**Reason:** [gate name] — [one-sentence specific evidence]
```

If no gate trips: `**Audit status: PASS**` with the numeric score, no further gate section in the report (per `output-format.md`, the Critical Failures section is omitted entirely when empty — don't write "No critical failures found," just leave the section out).
