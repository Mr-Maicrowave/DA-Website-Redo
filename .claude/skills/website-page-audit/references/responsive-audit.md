# Responsive & Wow-Factor Audit

## Viewport set

Test these five when browser tooling is available; when it isn't, read the Tailwind breakpoints actually used in the component (`sm:`/`md:`/`lg:`/`xl:` classes) and reason from those instead of guessing — say explicitly which approach was used.

| Viewport | Width | Notes |
|---|---|---|
| Large desktop | 1920px | |
| Typical laptop | 1440px | |
| Tablet | 820px | This site's `NavigationNew` switches to the mobile header pattern below `lg:` (1024px) — tablet lands in the mobile-nav regime, not desktop. That's intentional; don't penalize it for using the mobile nav here. |
| Typical mobile | 390px | |
| Narrow mobile | 360px | Tightest real-device width worth checking; catches text-wrap and touch-target failures the 390px pass misses. |

**Don't penalize a page for a breakpoint intentionally reusing its neighbor's layout** (e.g. tablet using the mobile nav) — only penalize if the *result* is actually poor at that width.

## What to look for at each width

- Layout breakpoints firing correctly (nothing straddling an awkward in-between state)
- Overflow / horizontal scroll
- Text wrapping (headline line breaks, orphaned words, `line-clamp` truncation)
- Image cropping / focal point (several pages use `backgroundPosition`/`mobileBackgroundPosition` props — e.g. `SubjectHero` — specifically to art-direct mobile crops; check the mobile crop actually preserves the subject)
- Navigation changes (desktop hover-cards → mobile sheet — does `MobileNavSheet` present the same Programs/Subjects/About items cleanly)
- Touch target size (44×44px practical minimum) — especially `MathsGraphLab`'s zoom/pan controls and `FindTeacher`'s filter chips
- Sticky/fixed elements (`StickyBookButton`, the adaptive collapsing nav bar) — do they obstruct content or a CTA at any width
- Spacing/typography scale (many pages use `clamp()` — verify the clamped range doesn't collapse to illegible at 360px or absurdly large at 1920px)
- Modal/sheet behavior (`MobileNavSheet`, any dialog)
- Animation behavior on resize/orientation change
- CTA visibility — is the primary CTA reachable without excessive scrolling at each width
- Content reordering between breakpoints (does anything end up in a confusing order)
- Sections that become excessively long on mobile (long-form pages like Mathematics.tsx's ~1,800 lines are a specific risk here)
- Elements hidden at a breakpoint that shouldn't be (check for `hidden lg:block` etc. patterns hiding something load-bearing on mobile)

## Wow-factor evaluation

Don't reward animation/motion for merely existing — this codebase uses framer-motion extensively (`AnimatePresence`, `useInView`, `useScroll`/`useTransform`, `useSpring`) and it's easy to mistake "a lot of motion" for "good motion."

**Evaluate whether the page creates:** immediate interest, curiosity, memorability, perceived quality, emotional impact, desire to keep scrolling/interacting.

**Penalize effects that:** delay access to content (an intro animation gating the real page — e.g. check `VisualIntro` on the homepage and `MathsIntroVideoGate` on Mathematics specifically for this), harm performance (janky scroll-linked transforms), obscure the message, repeat excessively, interfere with accessibility (not respecting `prefers-reduced-motion` — `NavigationNew` already checks this via `matchMedia`; verify heavier animated pages do too), distract from conversion, or feel generic/gimmicky (a fade-up on every single section with no variation reads as templated, not crafted).

**A functional page should not be penalized for restraint.** `/find-teacher` and `/maths-graph-lab` are scored under the Interactive Tool profile specifically because cinematic spectacle isn't their job — see `page-weightings.md` profile 5, where First Impression/Wow Factor is weighted at only 3%.

## Brand consistency baseline

Judge against what this site actually does, not generic taste:

- Palette: navy (`brand-navy`, `#0A1B34`/`#0F2244`) + gold (`brand-gold`, `#D4AF37`/`#F0C86A`) + cream (`#F7F4EE`/`#EDE5D4`)
- Type pairing: serif display (`'Cormorant Garamond'` on most inner pages, `'Libre Baskerville'` in the nav logo) + sans body (`'DM Sans'`/`'Inter'`)
- **Known site-wide font-consistency defect — check every page against this, it's confirmed to recur:**
  - `tailwind.config.ts`'s `fontFamily` block maps `font-serif` → `Merriweather` and `font-heading` → `Outfit`. **Neither font is loaded anywhere in this codebase** (no `<link>` in `index.html`, no `@import`/`@font-face` in any CSS file) — both classes silently render a generic system fallback. `font-serif` alone is used in 21+ files across nearly every page family as of this analysis (grep `font-serif` under `src/` to get the current list — it changes as pages are edited).
  - Beyond that specific trap, the site as a whole loads an unusually wide font inventory from two uncoordinated places: `index.html`'s Google Fonts `<link>` (Anton, Inter, Baloo 2, Libre Baskerville, Playfair Display) and `src/styles/academy-theme.css`'s `@import` (Cinzel, Cormorant Garamond, EB Garamond, Marcellus, Playfair Display again). No single page should reasonably use more than 2-3 of these; a page pulling in several is itself worth flagging even if every one of them happens to be actually loaded.
  - The fix pattern already exists on this site — `ContactUs.tsx` sets `fontFamily: "'Cormorant Garamond', Georgia, serif"` inline instead of the broken `font-serif` utility. Point to it as the reference pattern when recommending a fix.
- The gradient-transition section system between page sections (documented in this repo's root `CLAUDE.md` under "Section Transition System") — sections should hand off gradient colors at their boundaries, not hard-cut
- `SubjectHero`'s shared layout/type/spacing across all five subject pages — only copy and photo should differ; a subject page that reimplements its own hero instead of using the shared component is itself a brand-consistency finding worth surfacing

A page that deviates from these (e.g. `PrivacyPolicy.tsx`'s plain `bg-white` wrapper with none of the gradient system) isn't automatically wrong — decide whether the deviation is a deliberate, appropriate choice for that page type (per its weighting profile's rationale) or genuine neglect, and say which.
