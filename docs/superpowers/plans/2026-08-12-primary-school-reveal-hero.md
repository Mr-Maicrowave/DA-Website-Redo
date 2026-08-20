# RevealHero Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a reusable `RevealHero` component that transitions from a full-screen photo hero straight into the next section via a scroll-driven horizontal slide (hero slides off, next section slides in), and use it to replace the current static hero + color-matched bridge on the Primary School page.

**Architecture:** A tall wrapper (`100svh` + a configurable pin range, default `35svh`) holds a `position: sticky` hero stage. While the wrapper's extra height scrolls past, the hero stage stays pinned to the top of the viewport and the hero content translates out horizontally while the next section — pulled up into the same viewport slot via a negative `margin-top`, the same technique `Index.tsx`'s `.hero-philosophy-pullup` already uses in this codebase — translates in from the opposite side. Both transforms are driven by one `framer-motion` `useScroll`/`useTransform` pair. The next section is a single real DOM instance (passed as `children`), never duplicated.

**Tech Stack:** React + TypeScript, Tailwind CSS, `framer-motion` (`useScroll`, `useTransform`, `useReducedMotion`) — all already used elsewhere in this codebase, no new dependencies.

## Global Constraints

- This codebase has **no automated test framework** (confirmed in `CLAUDE.md`). Every task's verification step is: `npm run lint`, `npm run build:dev`, and a manual check in the dev server (screenshot where visual behavior is being verified). Do not introduce a test runner or write `*.test.ts` files — that would be inconsistent with the rest of the project.
- `src/components/subjects/SubjectHero.tsx` must **not** be modified. It stays exactly as-is for English/Mathematics/Science/Legal Studies/Business Studies. `RevealHero` is a new, separate component.
- New component file: `src/components/RevealHero.tsx` (top-level, alongside `NavigationNew.tsx` / `StickyBookButton.tsx` / `SEO.tsx` — not under `components/subjects/`, since it isn't subject-specific).
- The revealed section (`children`) must be a single real DOM instance — never rendered twice.
- `prefers-reduced-motion: reduce` must fall back to a plain static stack: no sticky pin, no transform, hero then children in normal flow.
- Height units follow this codebase's existing mobile-safe convention: `svh`, not `vh` (see `.ps-opening`/`.hero-philosophy-pullup` precedent in `Index.tsx` and the old `PrimarySchool.tsx`).
- Work happens on the `phil-work` branch (already checked out). Commit after each task, as instructed per-task below.

---

### Task 1: `RevealHero` static shell, wired into Primary School

**Files:**
- Create: `src/components/RevealHero.tsx`
- Modify: `src/pages/programs/PrimarySchool.tsx:1-7` (imports), `src/pages/programs/PrimarySchool.tsx:357-374` (hero usage), `src/pages/programs/PrimarySchool.tsx:552-554` (remove now-dead mist-band CSS)

**Interfaces:**
- Produces: `RevealHeroProps` interface and default-exported `RevealHero` component, with props `eyebrow: string`, `icon: LucideIcon`, `headlineWhite: string`, `headlineGold: string`, `subtext: string`, `proofPills: [string, string, string]`, `placeholderLabel: string`, `backgroundImageSrc?: string`, `backgroundImageAlt?: string`, `pinRangeVh?: number` (default `35`), `children: ReactNode`.
- This task's version has no scroll/motion behavior yet — it renders identically to a static hero followed by its children in normal document flow. Tasks 2–5 build the reveal behavior on top of this same file without changing this prop signature.

- [ ] **Step 1: Create `src/components/RevealHero.tsx`**

```tsx
import type { ReactNode } from 'react';
import { ArrowRight, Image as ImageIcon, type LucideIcon } from 'lucide-react';

export interface RevealHeroProps {
  /** Small uppercase badge above the headline, e.g. "Primary School · Years 1-6" */
  eyebrow: string;
  /** Icon watermarked into the placeholder background when no real photo is supplied */
  icon: LucideIcon;
  /** First line of the motto, rendered in white */
  headlineWhite: string;
  /** Second line of the motto, rendered in gold */
  headlineGold: string;
  /** Supporting paragraph under the motto */
  subtext: string;
  /** Three short proof points shown as a pill row */
  proofPills: [string, string, string];
  /** Short label describing what photo should eventually replace the placeholder */
  placeholderLabel: string;
  /** Real photo to use as the hero background. Omit to show the placeholder instead. */
  backgroundImageSrc?: string;
  backgroundImageAlt?: string;
  /** Extra scroll distance (in vh) the reveal transition consumes, beyond the hero's own 100svh. Default 35. */
  pinRangeVh?: number;
  /** The section to reveal — rendered once, in normal document flow, right after the hero. */
  children: ReactNode;
}

const RevealHeroPhoto = ({
  icon: Icon,
  placeholderLabel,
  backgroundImageSrc,
  backgroundImageAlt,
}: Pick<RevealHeroProps, 'icon' | 'placeholderLabel' | 'backgroundImageSrc' | 'backgroundImageAlt'>) => (
  <div className="absolute inset-0">
    {backgroundImageSrc ? (
      <img
        src={backgroundImageSrc}
        alt={backgroundImageAlt ?? ''}
        className="h-full w-full object-cover"
      />
    ) : (
      <>
        <div
          className="h-full w-full"
          style={{
            background: 'repeating-linear-gradient(135deg, #0c2038 0px, #0c2038 22px, #0f2745 22px, #0f2745 44px)',
          }}
        />
        <div className="absolute inset-0 flex items-center justify-end pr-6 opacity-[0.06] lg:pr-16">
          <Icon className="h-[62%] w-auto text-white" strokeWidth={0.5} />
        </div>
        <div className="absolute bottom-5 right-5 z-10 flex items-center gap-2 rounded-full border border-dashed border-white/30 bg-black/30 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white/70 backdrop-blur-sm">
          <ImageIcon className="h-3 w-3" />
          Photo placeholder — {placeholderLabel}
        </div>
      </>
    )}
    <div
      className="absolute inset-0"
      style={{
        background: 'linear-gradient(90deg, rgba(4,11,23,.86) 0%, rgba(4,11,23,.66) 46%, rgba(4,11,23,.22) 100%)',
      }}
    />
  </div>
);

const RevealHeroCopy = ({
  eyebrow,
  headlineWhite,
  headlineGold,
  subtext,
  proofPills,
  onExplore,
}: Pick<RevealHeroProps, 'eyebrow' | 'headlineWhite' | 'headlineGold' | 'subtext' | 'proofPills'> & { onExplore: () => void }) => (
  <div className="relative z-10 mx-auto w-full max-w-7xl px-5 lg:px-8">
    <div className="max-w-3xl">
      <div className="mb-5 inline-flex items-center gap-2.5 text-xs font-black uppercase tracking-[0.18em] text-[#f1df9a]">
        <span className="h-[2px] w-7 bg-[#c9a227]" />
        {eyebrow}
      </div>

      <h1
        className="text-white"
        style={{
          fontFamily: '"Playfair Display", Georgia, serif',
          fontSize: 'clamp(3rem, 6.5vw, 6.6rem)',
          lineHeight: 0.96,
          letterSpacing: '-0.01em',
          margin: 0,
        }}
      >
        {headlineWhite}
        <span className="block text-[#c9a227]">{headlineGold}</span>
      </h1>

      <p className="mt-7 max-w-[54ch] text-lg leading-[1.75] text-white/85">{subtext}</p>

      <div className="mt-8">
        <button
          type="button"
          onClick={onExplore}
          className="inline-flex h-12 items-center rounded-full bg-[#c9a227] px-7 font-black text-[#101521] shadow-xl shadow-[#c9a227]/25 transition hover:bg-[#e0bd4b]"
        >
          Explore
          <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </div>

      <div className="mt-9 flex flex-wrap gap-x-5 gap-y-2 text-[13px] font-black uppercase tracking-[0.06em] text-white">
        {proofPills.map((pill) => (
          <span key={pill} className="border-l-2 border-[#c9a227] pl-3">
            {pill}
          </span>
        ))}
      </div>
    </div>
  </div>
);

const RevealHero = ({
  eyebrow,
  icon,
  headlineWhite,
  headlineGold,
  subtext,
  proofPills,
  placeholderLabel,
  backgroundImageSrc,
  backgroundImageAlt,
  children,
}: RevealHeroProps) => {
  return (
    <>
      <section className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-[#071629] py-28">
        <RevealHeroPhoto
          icon={icon}
          placeholderLabel={placeholderLabel}
          backgroundImageSrc={backgroundImageSrc}
          backgroundImageAlt={backgroundImageAlt}
        />
        <RevealHeroCopy
          eyebrow={eyebrow}
          headlineWhite={headlineWhite}
          headlineGold={headlineGold}
          subtext={subtext}
          proofPills={proofPills}
          onExplore={() => {}}
        />
      </section>
      {children}
    </>
  );
};

export default RevealHero;
```

- [ ] **Step 2: Update imports in `src/pages/programs/PrimarySchool.tsx`**

Change line 7 from:

```tsx
import SubjectHero from '@/components/subjects/SubjectHero';
```

to:

```tsx
import RevealHero from '@/components/RevealHero';
```

- [ ] **Step 3: Replace the hero usage in `src/pages/programs/PrimarySchool.tsx`**

Find this block (currently lines 361–374):

```tsx
    <SubjectHero
      eyebrow="Primary School · Years 1–6"
      icon={GraduationCap}
      headlineWhite="Every Stage."
      headlineGold="Every Child."
      subtext="From strong foundations to lifelong confidence, we guide your child through every critical stage of primary school."
      proofPills={['Years 1–6 journey', 'Small-group attention', 'NAPLAN ready']}
      exploreTargetId="primary-page-content"
      placeholderLabel="Primary school classroom"
      backgroundImageSrc="/images/programs/primary-hero-tutor-two-students.png"
      backgroundImageAlt="A DA Tuition tutor working warmly with two primary school students on their schoolwork"
    />
    <div className="ps-hero-mist" aria-hidden="true" />
    <div id="primary-page-content">
```

Replace with:

```tsx
    <RevealHero
      eyebrow="Primary School · Years 1–6"
      icon={GraduationCap}
      headlineWhite="Every Stage."
      headlineGold="Every Child."
      subtext="From strong foundations to lifelong confidence, we guide your child through every critical stage of primary school."
      proofPills={['Years 1–6 journey', 'Small-group attention', 'NAPLAN ready']}
      placeholderLabel="Primary school classroom"
      backgroundImageSrc="/images/programs/primary-hero-tutor-two-students.png"
      backgroundImageAlt="A DA Tuition tutor working warmly with two primary school students on their schoolwork"
    >
    <div id="primary-page-content">
```

Note: `exploreTargetId` is dropped (it was `SubjectHero`-specific scroll-to-anchor behavior; `RevealHero`'s Explore button gets its own behavior in Task 5). The opening `<RevealHero ...>` tag now wraps everything that used to follow it — its matching closing tag goes where the old closing `</div>` (for `id="primary-page-content"`) currently sits, which does **not** move; only add a new `</RevealHero>` right after that existing `</div>`. Find:

```tsx
    </div>
    <style>{`
```

(this is the `</div>` that closes `id="primary-page-content"`, immediately before the page's `<style>` block). Replace with:

```tsx
    </div>
    </RevealHero>
    <style>{`
```

- [ ] **Step 4: Remove the now-dead `.ps-hero-mist` CSS**

Find and delete these two lines from the `<style>` block in `src/pages/programs/PrimarySchool.tsx` (currently lines 552–554, keep the `@media(prefers-reduced-motion:reduce)` line above them):

```css
      .ps-hero-mist{position:relative;z-index:1;width:100%;height:clamp(11rem,17vw,16rem);margin-top:clamp(-7rem,-9vw,-5rem);background:linear-gradient(180deg,rgba(139,202,240,0) 0%,rgba(139,202,240,0) 66%,#8bcaf0 94%,#8bcaf0 100%),url('/images/programs/primary-school-staircase-landscape-v3.png') center top/cover no-repeat;-webkit-mask-image:linear-gradient(180deg,transparent 0%,rgba(0,0,0,.4) 42%,#000 78%,#000 100%);mask-image:linear-gradient(180deg,transparent 0%,rgba(0,0,0,.4) 42%,#000 78%,#000 100%);pointer-events:none}
      @media(max-width:720px){.ps-hero-mist{height:clamp(8rem,20vw,11rem);margin-top:clamp(-4.5rem,-8vw,-3rem)}}
```

- [ ] **Step 5: Verify**

Run: `npm run lint` — expect 0 errors (pre-existing warnings elsewhere are fine, unrelated to this file).
Run: `npm run build:dev` — expect a clean build.
Run: `npm run dev`, open `http://localhost:8080/programs/primary-school`. Expect the page to look exactly as it did before this change (hero photo, headline, pills, then straight into the pathway section) — no reveal animation yet, that comes in later tasks. The Explore button will not do anything yet (empty `onClick`) — that's expected at this stage.

- [ ] **Step 6: Commit**

```bash
git add src/components/RevealHero.tsx src/pages/programs/PrimarySchool.tsx
git commit -m "Add static RevealHero shell, wire into Primary School page

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01TbfkCaF6enKidvLwGw7HvA"
```

---

### Task 2: Sticky pin mechanics (no slide yet)

**Files:**
- Modify: `src/components/RevealHero.tsx`

**Interfaces:**
- Consumes: everything from Task 1 (`RevealHeroPhoto`, `RevealHeroCopy`, `RevealHeroProps`) unchanged.
- Produces: the hero is now wrapped in a pinned scroll container. `pinRangeVh` (already in the prop type from Task 1, default `35`) now actually controls how much scroll distance the pin consumes. No horizontal transform yet — this task only proves the pin/release mechanics work before Task 3 adds motion on top.

- [ ] **Step 1: Wrap the hero markup in the pinned stage**

In `src/components/RevealHero.tsx`, replace the `RevealHero` component body with:

```tsx
const RevealHero = ({
  eyebrow,
  icon,
  headlineWhite,
  headlineGold,
  subtext,
  proofPills,
  placeholderLabel,
  backgroundImageSrc,
  backgroundImageAlt,
  pinRangeVh = 35,
  children,
}: RevealHeroProps) => {
  return (
    <>
      <div className="reveal-hero-wrapper" style={{ height: `calc(100svh + ${pinRangeVh}svh)` }}>
        <div className="reveal-hero-stage">
          <div className="reveal-hero-slide">
            <RevealHeroPhoto
              icon={icon}
              placeholderLabel={placeholderLabel}
              backgroundImageSrc={backgroundImageSrc}
              backgroundImageAlt={backgroundImageAlt}
            />
            <RevealHeroCopy
              eyebrow={eyebrow}
              headlineWhite={headlineWhite}
              headlineGold={headlineGold}
              subtext={subtext}
              proofPills={proofPills}
              onExplore={() => {}}
            />
          </div>
        </div>
      </div>
      {children}
      <style>{`
        .reveal-hero-wrapper { position: relative; width: 100%; }
        .reveal-hero-stage { position: sticky; top: 0; height: 100svh; overflow: hidden; z-index: 5; background: #071629; }
        .reveal-hero-slide { position: relative; height: 100%; width: 100%; }
      `}</style>
    </>
  );
};
```

- [ ] **Step 2: Verify**

Run: `npm run lint` — expect 0 errors.
Run: `npm run build:dev` — expect a clean build.
Run: `npm run dev`, open `http://localhost:8080/programs/primary-school`. Scroll down slowly from the top. Expect: the hero photo stays glued to the top of the viewport (doesn't scroll away) for roughly the first third of a screen's worth of extra scrolling, then releases and the pathway section scrolls up normally underneath it. Take a screenshot at scroll position 0 and at roughly the midpoint of the pin range to confirm the hero visually holds still between them.

- [ ] **Step 3: Commit**

```bash
git add src/components/RevealHero.tsx
git commit -m "Add sticky pin mechanics to RevealHero

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01TbfkCaF6enKidvLwGw7HvA"
```

---

### Task 3: Horizontal slide choreography

**Files:**
- Modify: `src/components/RevealHero.tsx`

**Interfaces:**
- Consumes: the pinned wrapper/stage structure from Task 2.
- Produces: the hero now slides fully off-screen to the left and `children` slides in from the right, in sync, as the user scrolls through the pin range. `children` is pulled up via `margin-top` (matching the `.hero-philosophy-pullup` technique already in `Index.tsx`) so it occupies the same viewport slot as the pinned hero during the transition, then continues in completely normal flow once the pin range ends.

- [ ] **Step 1: Add scroll progress and transforms**

Replace the full contents of `src/components/RevealHero.tsx` with:

```tsx
import { useRef, type ReactNode } from 'react';
import { ArrowRight, Image as ImageIcon, type LucideIcon } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

export interface RevealHeroProps {
  /** Small uppercase badge above the headline, e.g. "Primary School · Years 1-6" */
  eyebrow: string;
  /** Icon watermarked into the placeholder background when no real photo is supplied */
  icon: LucideIcon;
  /** First line of the motto, rendered in white */
  headlineWhite: string;
  /** Second line of the motto, rendered in gold */
  headlineGold: string;
  /** Supporting paragraph under the motto */
  subtext: string;
  /** Three short proof points shown as a pill row */
  proofPills: [string, string, string];
  /** Short label describing what photo should eventually replace the placeholder */
  placeholderLabel: string;
  /** Real photo to use as the hero background. Omit to show the placeholder instead. */
  backgroundImageSrc?: string;
  backgroundImageAlt?: string;
  /** Extra scroll distance (in vh) the reveal transition consumes, beyond the hero's own 100svh. Default 35. */
  pinRangeVh?: number;
  /** The section to reveal — rendered once, in normal document flow, right after the hero. */
  children: ReactNode;
}

const RevealHeroPhoto = ({
  icon: Icon,
  placeholderLabel,
  backgroundImageSrc,
  backgroundImageAlt,
}: Pick<RevealHeroProps, 'icon' | 'placeholderLabel' | 'backgroundImageSrc' | 'backgroundImageAlt'>) => (
  <div className="absolute inset-0">
    {backgroundImageSrc ? (
      <img
        src={backgroundImageSrc}
        alt={backgroundImageAlt ?? ''}
        className="h-full w-full object-cover"
      />
    ) : (
      <>
        <div
          className="h-full w-full"
          style={{
            background: 'repeating-linear-gradient(135deg, #0c2038 0px, #0c2038 22px, #0f2745 22px, #0f2745 44px)',
          }}
        />
        <div className="absolute inset-0 flex items-center justify-end pr-6 opacity-[0.06] lg:pr-16">
          <Icon className="h-[62%] w-auto text-white" strokeWidth={0.5} />
        </div>
        <div className="absolute bottom-5 right-5 z-10 flex items-center gap-2 rounded-full border border-dashed border-white/30 bg-black/30 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white/70 backdrop-blur-sm">
          <ImageIcon className="h-3 w-3" />
          Photo placeholder — {placeholderLabel}
        </div>
      </>
    )}
    <div
      className="absolute inset-0"
      style={{
        background: 'linear-gradient(90deg, rgba(4,11,23,.86) 0%, rgba(4,11,23,.66) 46%, rgba(4,11,23,.22) 100%)',
      }}
    />
  </div>
);

const RevealHeroCopy = ({
  eyebrow,
  headlineWhite,
  headlineGold,
  subtext,
  proofPills,
  onExplore,
}: Pick<RevealHeroProps, 'eyebrow' | 'headlineWhite' | 'headlineGold' | 'subtext' | 'proofPills'> & { onExplore: () => void }) => (
  <div className="relative z-10 mx-auto w-full max-w-7xl px-5 lg:px-8">
    <div className="max-w-3xl">
      <div className="mb-5 inline-flex items-center gap-2.5 text-xs font-black uppercase tracking-[0.18em] text-[#f1df9a]">
        <span className="h-[2px] w-7 bg-[#c9a227]" />
        {eyebrow}
      </div>

      <h1
        className="text-white"
        style={{
          fontFamily: '"Playfair Display", Georgia, serif',
          fontSize: 'clamp(3rem, 6.5vw, 6.6rem)',
          lineHeight: 0.96,
          letterSpacing: '-0.01em',
          margin: 0,
        }}
      >
        {headlineWhite}
        <span className="block text-[#c9a227]">{headlineGold}</span>
      </h1>

      <p className="mt-7 max-w-[54ch] text-lg leading-[1.75] text-white/85">{subtext}</p>

      <div className="mt-8">
        <button
          type="button"
          onClick={onExplore}
          className="inline-flex h-12 items-center rounded-full bg-[#c9a227] px-7 font-black text-[#101521] shadow-xl shadow-[#c9a227]/25 transition hover:bg-[#e0bd4b]"
        >
          Explore
          <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </div>

      <div className="mt-9 flex flex-wrap gap-x-5 gap-y-2 text-[13px] font-black uppercase tracking-[0.06em] text-white">
        {proofPills.map((pill) => (
          <span key={pill} className="border-l-2 border-[#c9a227] pl-3">
            {pill}
          </span>
        ))}
      </div>
    </div>
  </div>
);

const RevealHero = ({
  eyebrow,
  icon,
  headlineWhite,
  headlineGold,
  subtext,
  proofPills,
  placeholderLabel,
  backgroundImageSrc,
  backgroundImageAlt,
  pinRangeVh = 35,
  children,
}: RevealHeroProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end end'],
  });

  const heroX = useTransform(scrollYProgress, [0, 1], ['0%', '-100%']);
  const nextX = useTransform(scrollYProgress, [0, 1], ['100%', '0%']);

  const scrollThroughReveal = () => {};

  return (
    <>
      <div ref={wrapperRef} className="reveal-hero-wrapper" style={{ height: `calc(100svh + ${pinRangeVh}svh)` }}>
        <div className="reveal-hero-stage">
          <motion.div className="reveal-hero-slide" style={{ x: heroX }}>
            <RevealHeroPhoto
              icon={icon}
              placeholderLabel={placeholderLabel}
              backgroundImageSrc={backgroundImageSrc}
              backgroundImageAlt={backgroundImageAlt}
            />
            <RevealHeroCopy
              eyebrow={eyebrow}
              headlineWhite={headlineWhite}
              headlineGold={headlineGold}
              subtext={subtext}
              proofPills={proofPills}
              onExplore={scrollThroughReveal}
            />
          </motion.div>
        </div>
      </div>
      <motion.div className="reveal-hero-next" style={{ x: nextX }}>
        {children}
      </motion.div>
      <style>{`
        .reveal-hero-wrapper { position: relative; width: 100%; }
        .reveal-hero-stage { position: sticky; top: 0; height: 100svh; overflow: hidden; z-index: 5; background: #071629; }
        .reveal-hero-slide { position: relative; height: 100%; width: 100%; }
        .reveal-hero-next { position: relative; margin-top: -100svh; overflow-x: clip; isolation: isolate; }
        @media (min-width: 768px) and (max-width: 1024px) {
          .reveal-hero-next { margin-top: -95svh; }
        }
        @media (max-width: 767px) {
          .reveal-hero-next { margin-top: -80svh; }
        }
      `}</style>
    </>
  );
};

export default RevealHero;
```

Note: `scrollThroughReveal` is an intentional empty stub in this task (Task 5 fills it in) — kept as a named function rather than an inline no-op so the `onExplore` wiring doesn't need to change again in Task 5, only its body does.

- [ ] **Step 2: Verify**

Run: `npm run lint` — expect 0 errors.
Run: `npm run build:dev` — expect a clean build.
Run: `npm run dev`, open `http://localhost:8080/programs/primary-school` at a desktop width (e.g. 1440×900). Scroll slowly through the pin range and confirm:
- At scroll position 0: identical to Task 2 (hero fully visible, nothing sliding).
- At roughly the midpoint of the pin range: hero is partway off-screen to the left, pathway section is partway in from the right, both visible simultaneously with no gap of blank space between them and no double-rendered content.
- At the end of the pin range: hero is fully gone, pathway section fills the screen exactly as it did before this change, and scrolling continues completely normally from there (no jump, no residual transform).
- No horizontal scrollbar appears at any point during the transition.

Then repeat at a mobile width (375×812) and confirm the same three checkpoints, and check whether the `-80svh` margin value leaves a gap or causes overlap — if either happens, note the actual pixel discrepancy but do not change the CSS values yet; that tuning happens in Step 3 based on what's observed here.

- [ ] **Step 3: Tune the pull-up margin if needed**

Based on Step 2's observation: if there was a visible gap (blank space) between the sliding-out hero and the sliding-in pathway section at the end of the transition, increase the relevant breakpoint's `margin-top` magnitude (e.g. `-100svh` → `-102svh`) by roughly the observed gap size. If there was overlap (pathway section's content clipped or hero and pathway both partially visible past the pin range's end), decrease the magnitude instead (e.g. `-100svh` → `-98svh`). Re-run the Step 2 checks after any change until there's no gap and no overlap at both desktop and mobile widths.

- [ ] **Step 4: Commit**

```bash
git add src/components/RevealHero.tsx
git commit -m "Add horizontal slide transition to RevealHero

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01TbfkCaF6enKidvLwGw7HvA"
```

---

### Task 4: Reduced-motion fallback

**Files:**
- Modify: `src/components/RevealHero.tsx`

**Interfaces:**
- Consumes: `RevealHeroPhoto`, `RevealHeroCopy`, `RevealHeroProps`, and the animated `RevealHero` body from Task 3.
- Produces: when `prefers-reduced-motion: reduce` is set, `RevealHero` renders a plain static stack instead — no wrapper, no sticky, no transform. Same pattern as the existing `VisualIntro.tsx`'s reduced-motion branch in this codebase.

- [ ] **Step 1: Add the `useReducedMotion` import and branch**

In `src/components/RevealHero.tsx`, change the import line:

```tsx
import { motion, useScroll, useTransform } from 'framer-motion';
```

to:

```tsx
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
```

Then, inside the `RevealHero` component, immediately after the `scrollThroughReveal` function and before the final `return`, add:

```tsx
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <>
        <section className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-[#071629] py-28">
          <RevealHeroPhoto
            icon={icon}
            placeholderLabel={placeholderLabel}
            backgroundImageSrc={backgroundImageSrc}
            backgroundImageAlt={backgroundImageAlt}
          />
          <RevealHeroCopy
            eyebrow={eyebrow}
            headlineWhite={headlineWhite}
            headlineGold={headlineGold}
            subtext={subtext}
            proofPills={proofPills}
            onExplore={scrollThroughReveal}
          />
        </section>
        {children}
      </>
    );
  }
```

- [ ] **Step 2: Verify**

Run: `npm run lint` — expect 0 errors.
Run: `npm run build:dev` — expect a clean build.
Run: `npm run dev`, open `http://localhost:8080/programs/primary-school` in Chrome DevTools with the "Emulate CSS prefers-reduced-motion: reduce" rendering setting enabled (Rendering tab). Confirm: hero renders as a plain static section, pathway section follows directly beneath it, no pin/slide behavior, no console errors. Then disable the emulation and confirm the animated version from Task 3 still works exactly as before.

- [ ] **Step 3: Commit**

```bash
git add src/components/RevealHero.tsx
git commit -m "Add reduced-motion fallback to RevealHero

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01TbfkCaF6enKidvLwGw7HvA"
```

---

### Task 5: Explore button scrolls through the reveal

**Files:**
- Modify: `src/components/RevealHero.tsx`

**Interfaces:**
- Consumes: the `scrollThroughReveal` stub introduced in Task 3 and referenced by `onExplore` in both the animated and reduced-motion render paths (Task 4).
- Produces: no new props or exports — `scrollThroughReveal`'s body is filled in; its signature (`() => void`, no arguments) does not change.

- [ ] **Step 1: Implement `scrollThroughReveal`**

In `src/components/RevealHero.tsx`, replace:

```tsx
  const scrollThroughReveal = () => {};
```

with:

```tsx
  const scrollThroughReveal = () => {
    window.scrollBy({ top: window.innerHeight * (pinRangeVh / 100), behavior: 'smooth' });
  };
```

- [ ] **Step 2: Verify**

Run: `npm run lint` — expect 0 errors.
Run: `npm run build:dev` — expect a clean build.
Run: `npm run dev`, open `http://localhost:8080/programs/primary-school`, and click the "Explore" button without scrolling first. Confirm the page smooth-scrolls through the same reveal transition observed in Task 3, ending with the pathway section in view. Then check the reduced-motion case again (DevTools emulation) — clicking Explore there should just do a plain smooth scroll of the same distance, since there's no pin to play through.

- [ ] **Step 3: Commit**

```bash
git add src/components/RevealHero.tsx
git commit -m "Wire Explore button to scroll through the RevealHero transition

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01TbfkCaF6enKidvLwGw7HvA"
```

---

### Task 6: Full-page verification and cleanup pass

**Files:**
- Modify: none expected (this task is verification-only; only touch files if a real defect is found, per Step 4)

**Interfaces:**
- Consumes: the complete `RevealHero` component and its integration into `PrimarySchool.tsx` from Tasks 1–5.
- Produces: nothing new — this is the final gate confirming the whole feature works end-to-end and the old mist-band code is fully gone.

- [ ] **Step 1: Confirm no leftover references to the old approach**

Run: `grep -rn "SubjectHero\|ps-hero-mist" src/pages/programs/PrimarySchool.tsx`
Expected: no matches (both were fully removed in Task 1).

- [ ] **Step 2: Full lint and build**

Run: `npm run lint` — expect 0 errors.
Run: `npm run build:dev` — expect a clean build with no new warnings beyond the pre-existing ones already present before this feature (see Task 1's baseline).

- [ ] **Step 3: End-to-end manual pass in the browser**

Run: `npm run dev`, open `http://localhost:8080/programs/primary-school`, and check:
- Page loads with no console errors.
- Mouse-wheel scroll, trackpad scroll, and keyboard (Page Down, Space, arrow keys, Tab to the Explore button then Enter) all correctly move through the reveal and into the rest of the page.
- Scroll all the way through the entire page (past Foundation/Growth/Mastery sections) — confirm nothing below the reveal transition is visually broken by the `margin-top` pull-up (it should only affect the very top of the pathway section's position, not push or misalign anything further down the page).
- Resize the browser between desktop, tablet (`768–1024px`), and mobile (`<767px`) widths and re-check the transition has no gap or overlap at each (this repeats Task 3 Step 2/3's check as a final confirmation after all later tasks' changes).
- Confirm the `StickyBookButton` (rendered inside `children`) still appears and functions normally once scrolled into view.

- [ ] **Step 4: Fix anything broken**

If Steps 1–3 surface a real defect (not a pre-existing, unrelated issue), fix it directly in `src/components/RevealHero.tsx` or `src/pages/programs/PrimarySchool.tsx`, re-run Steps 2–3, and commit the fix with a message describing what was wrong. If everything passes, skip this step.

- [ ] **Step 5: Final commit (only if Step 4 made changes)**

```bash
git add src/components/RevealHero.tsx src/pages/programs/PrimarySchool.tsx
git commit -m "Fix issues found in RevealHero end-to-end verification

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01TbfkCaF6enKidvLwGw7HvA"
```
