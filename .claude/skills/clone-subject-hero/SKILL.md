---
name: clone-subject-hero
description: Use when adding the shared SubjectHero banner (the English/Mathematics/Science/Legal Studies/Business Studies style full-bleed hero) to the top of a page that doesn't have it yet, e.g. a Programs page (Primary School, High School, HSC Excellence). Covers picking the background photo, matching copy, wiring the Explore scroll target, and rolling out to multiple pages one trial at a time.
user-invocable: true
argument-hint: "[target page, e.g. src/pages/programs/PrimarySchool.tsx]"
---

# Clone Subject Hero

## Overview

`SubjectHero` (`src/components/subjects/SubjectHero.tsx`) is the shared full-screen hero used at the top of every subject page (English, Mathematics, Science, Legal Studies, Business Studies — see `src/pages/subjects/*.tsx` for reference usage). It's one component driven entirely by props: copy and photo differ per page, but font, sizing, layout, and motion are identical everywhere it's used. This skill is the fast path for putting it on a page that doesn't have it yet, without disturbing anything else on that page.

## When to use

- User asks to clone/duplicate/match the English (or Math/Science/etc.) page's hero onto another page.
- User wants a page to get the same full-screen photo + white/gold two-line headline treatment as the subject pages.

## Steps

1. **Read the target page first.** Check whether it already has its own custom hero (e.g. `HighSchool.tsx` has a bespoke `Hero()` further down the page, unrelated to `SubjectHero`). Never delete, rewrite, or restyle an existing hero unless the user asks — add `SubjectHero` as a brand-new section above it and leave everything else untouched.

2. **Ask before writing any code — every time:**
   - **Background photo.** Never invent or introduce a new image on your own. Offer to reuse a photo already placed elsewhere on that page, or list unused photos already sitting in `public/` for that page's topic (e.g. `public/images/programs/*.jpg`). Only use a brand-new file if the user explicitly supplies or names one.
   - **Copy.** Eyebrow, two-line headline (white line + gold line), subtext, and exactly three `proofPills`. Ask whether to mirror wording from that page's existing hero/copy or write something new — mirroring risks the same headline appearing twice in a row if the old hero block stays on the page; say so.

3. **Wire it in** as the first thing after `<NavigationNew />`, before any existing content:
   ```tsx
   import SubjectHero from '@/components/subjects/SubjectHero';

   <NavigationNew />
   <SubjectHero
     eyebrow="..."
     icon={SomeLucideIcon}              // only rendered if backgroundImageSrc is omitted
     headlineWhite="..."
     headlineGold="..."
     subtext="..."
     proofPills={['...', '...', '...']} // exactly 3 — prop type is [string, string, string]
     exploreTargetId="<page>-page-content"
     placeholderLabel="..."
     backgroundImageSrc="/path/to/photo.jpg"
     backgroundImageAlt="..."
   />
   <div id="<page>-page-content">
     {/* everything that used to come right after <NavigationNew /> */}
   </div>
   ```
   The wrapping `<div id="...">` gives the hero's "Explore" button something to scroll to — mirrors the iframe-wrapper pattern in `src/pages/subjects/English.tsx`.

4. **Verify, then look past the fold.** Run `npm run lint` and `npm run build:dev`. Load the page in the browser, screenshot the hero, then scroll down and check for two known side effects before reporting done:
   - **Padding gap** — if the section right below used top padding sized to sit directly under the fixed nav (e.g. Programs pages' `TopBar` uses `pt-28 lg:pt-32`), that padding is now oversized and leaves a blank gap under the new hero.
   - **Duplicate copy** — if the page's existing hero already says something close to the new headline, it now repeats immediately below.

   Surface both to the user rather than silently fixing them — they're outside "just the hero" unless the user says otherwise.

5. **One page at a time.** Implement a single trial page, show the screenshot, and only move on to the remaining target pages after explicit approval. Don't batch multiple pages before the first is confirmed.

## Common mistakes

- Changing an image elsewhere on the page "to make things consistent" — don't, unless asked.
- Picking a background photo without asking first.
- `proofPills` with anything other than exactly 3 entries.
- Fixing the padding-gap or duplicate-copy side effects unasked instead of flagging them.
- Rolling out to every target page in one shot instead of trialing one first.
