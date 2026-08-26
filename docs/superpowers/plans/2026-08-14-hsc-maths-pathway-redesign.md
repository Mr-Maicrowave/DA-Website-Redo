# HSC Mathematics Pathway Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current HSC stream selector with an accurate, high-contrast curved pathway on desktop and an accessible course accordion on mobile.

**Architecture:** Move the course truth and prerequisite-chain logic into a pure TypeScript model, then render it through one focused React feature component. `Mathematics.tsx` retains page composition only and mounts the feature where the old inline selector lives. Presentation uses semantic buttons, CSS positioning, and SVG paths; no raster UI or new dependency is introduced.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, Framer Motion, React Router, Lucide React, Node test runner.

## Global Constraints

- Preserve the approved polished museum-exhibit direction in `docs/design/hsc-maths-pathway-north-star.png`.
- Keep academic navy `#071629`, warm off-white `#fffdf8`, Standard ochre, Advanced jade, Extension 1 blue, and Extension 2 violet.
- All course names use high-contrast navy; colour identifies nodes, routes, and selected accents only.
- Standard is separate; Extension 1 is studied with Advanced; Extension 2 is Year 12 only and requires Advanced plus Extension 1.
- Desktop uses a vertically separated curved pathway; mobile uses a one-at-a-time accordion.
- Primary CTA links to `/book-interview`; secondary CTA links to `/hsc-excellence`.
- Use `aria-pressed` for desktop selection and `aria-expanded` plus `aria-controls` for mobile disclosure.
- Respect `prefers-reduced-motion`; do not add bounce, elastic motion, or layout-property animation.
- Do not add a dependency or change unrelated Mathematics-page sections.

---

## File Structure

- Create `src/features/hsc-maths-pathway/hsc-maths-pathway-model.ts`: typed course content, colour roles, and prerequisite-chain helper.
- Create `src/features/hsc-maths-pathway/HscMathsPathway.tsx`: desktop SVG pathway, mobile accordion, detail content, CTAs, and motion states.
- Create `src/features/hsc-maths-pathway/hsc-maths-pathway.test.ts`: model behaviour and semantic source-contract tests.
- Modify `src/pages/subjects/Mathematics.tsx`: import and mount the feature; remove old HSC selector data, state, measurement logic, SVG, and inline markup.

### Task 1: Course model and prerequisite truth

**Files:**
- Create: `src/features/hsc-maths-pathway/hsc-maths-pathway-model.ts`
- Create: `src/features/hsc-maths-pathway/hsc-maths-pathway.test.ts`

**Interfaces:**
- Produces: `HscStreamId`, `HscStream`, `HSC_STREAMS`, `getHscStream(id)`, and `getActivePath(id)`.
- `getActivePath(id: HscStreamId): HscStreamId[]` returns the ordered visible prerequisite route for the selected course.

- [ ] **Step 1: Write the failing model tests**

```ts
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getActivePath,
  getHscStream,
  type HscStreamId,
} from './hsc-maths-pathway-model.ts';

test('Standard remains separate from the Advanced extension pathway', () => {
  assert.deepEqual(getActivePath('standard'), ['standard']);
});

test('Extension 1 includes Advanced in its active prerequisite path', () => {
  assert.deepEqual(getActivePath('extension-1'), ['advanced', 'extension-1']);
});

test('Extension 2 includes both prerequisites and is Year 12 only', () => {
  assert.deepEqual(getActivePath('extension-2'), [
    'advanced',
    'extension-1',
    'extension-2',
  ] satisfies HscStreamId[]);
  assert.equal(getHscStream('extension-2').year12Only, true);
  assert.deepEqual(getHscStream('extension-2').prerequisites, [
    'Advanced',
    'Extension 1',
  ]);
});
```

- [ ] **Step 2: Run the test and verify RED**

Run:

```powershell
node --test --experimental-strip-types src/features/hsc-maths-pathway/hsc-maths-pathway.test.ts
```

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `hsc-maths-pathway-model.ts`.

- [ ] **Step 3: Implement the typed model**

Create these exact public types and helpers:

```ts
export type HscStreamId =
  | 'standard'
  | 'advanced'
  | 'extension-1'
  | 'extension-2';

export interface HscStream {
  id: HscStreamId;
  name: string;
  shortDescriptor: string;
  badge: string;
  availability: string;
  year12Only: boolean;
  prerequisites: string[];
  bestFit: string;
  whatChanges: string;
  helpNeeded: string;
  daSupport: string;
  topics: string[];
  color: string;
  vividColor: string;
}

const ACTIVE_PATHS: Record<HscStreamId, HscStreamId[]> = {
  standard: ['standard'],
  advanced: ['advanced'],
  'extension-1': ['advanced', 'extension-1'],
  'extension-2': ['advanced', 'extension-1', 'extension-2'],
};

export const HSC_STREAMS: HscStream[] = [
  {
    id: 'standard',
    name: 'Standard 1 & 2',
    shortDescriptor: 'No calculus',
    badge: 'Practical mathematics without calculus',
    availability: 'Years 11–12',
    year12Only: false,
    prerequisites: [],
    bestFit: 'Students who want practical mathematics and are heading towards study or work that does not require calculus.',
    whatChanges: 'The course emphasises financial mathematics, measurement, networks and statistics rather than abstract proof or calculus.',
    helpNeeded: 'Choosing efficient methods, interpreting unfamiliar contexts and avoiding small errors across multi-part questions.',
    daSupport: 'We connect each method to a real question type, then build accuracy and checking habits under assessment conditions.',
    topics: ['Financial mathematics', 'Statistical analysis', 'Networks and measurement'],
    color: '#c9921b',
    vividColor: '#f2a90d',
  },
  {
    id: 'advanced',
    name: 'Advanced',
    shortDescriptor: 'Calculus foundation',
    badge: 'Calculus for quantitative pathways',
    availability: 'Years 11–12',
    year12Only: false,
    prerequisites: [],
    bestFit: 'Students who are comfortable with algebra and want to keep quantitative university pathways open.',
    whatChanges: 'Calculus is introduced alongside more demanding work with functions, trigonometry, sequences and probability.',
    helpNeeded: 'Moving beyond memorised procedures, connecting representations and explaining why a method applies.',
    daSupport: 'We make calculus visual and structured, then develop the flexible problem-solving required for unfamiliar exam questions.',
    topics: ['Differential and integral calculus', 'Functions and trigonometry', 'Sequences and random variables'],
    color: '#2f8f69',
    vividColor: '#0aa876',
  },
  {
    id: 'extension-1',
    name: 'Extension 1',
    shortDescriptor: 'With Advanced',
    badge: 'Studied alongside Advanced',
    availability: 'Years 11–12 · with Advanced',
    year12Only: false,
    prerequisites: ['Advanced'],
    bestFit: 'Students who are confident in Advanced and want deeper problem-solving, proof and calculus.',
    whatChanges: 'Extension 1 adds proof, vectors, combinatorics and harder calculus while students continue the full Advanced course.',
    helpNeeded: 'Recognising hidden structures, sustaining multi-step reasoning and writing complete mathematical arguments.',
    daSupport: 'We teach the thinking between steps, not just the final technique, then refine proof and difficult-question strategy.',
    topics: ['Proof and vectors', 'Further calculus', 'Combinatorics and polynomials'],
    color: '#297dbf',
    vividColor: '#1c8ff2',
  },
  {
    id: 'extension-2',
    name: 'Extension 2',
    shortDescriptor: 'Year 12 only',
    badge: 'Requires Advanced + Extension 1',
    availability: 'Year 12 only',
    year12Only: true,
    prerequisites: ['Advanced', 'Extension 1'],
    bestFit: 'Students who already thrive in Extension 1 and genuinely enjoy abstract, rigorous mathematics.',
    whatChanges: 'Extension 2 begins in Year 12 and adds complex numbers, mechanics, deeper integration and more demanding proof.',
    helpNeeded: 'Turning insight into rigorous working, choosing a path through unfamiliar problems and maintaining precision under pressure.',
    daSupport: 'Specialist teachers make advanced ideas accessible, strengthen proof writing and build calm strategies for the hardest questions.',
    topics: ['Complex numbers', 'Proof and further integration', 'Vectors and mechanics'],
    color: '#8051bf',
    vividColor: '#9c4bea',
  },
];

export function getHscStream(id: HscStreamId): HscStream {
  const stream = HSC_STREAMS.find((candidate) => candidate.id === id);
  if (!stream) throw new Error(`Unknown HSC stream: ${id}`);
  return stream;
}

export function getActivePath(id: HscStreamId): HscStreamId[] {
  return [...ACTIVE_PATHS[id]];
}
```

- [ ] **Step 4: Run the model tests and verify GREEN**

Run the same Node test command. Expected: 3 passing tests, 0 failures.

- [ ] **Step 5: Commit the model**

```powershell
git add -- src/features/hsc-maths-pathway/hsc-maths-pathway-model.ts src/features/hsc-maths-pathway/hsc-maths-pathway.test.ts
git commit -m "feat: model HSC maths course pathways"
```

### Task 2: Accessible responsive pathway component

**Files:**
- Create: `src/features/hsc-maths-pathway/HscMathsPathway.tsx`
- Modify: `src/features/hsc-maths-pathway/hsc-maths-pathway.test.ts`

**Interfaces:**
- Consumes: `HSC_STREAMS`, `HscStream`, `HscStreamId`, `getActivePath`, and `getHscStream` from Task 1.
- Produces: named export `HscMathsPathway(): JSX.Element` with no required props.

- [ ] **Step 1: Add failing semantic source-contract tests**

```ts
import { readFileSync } from 'node:fs';

const componentUrl = new URL('./HscMathsPathway.tsx', import.meta.url);

test('pathway exposes selection, accordion, focus, and reduced-motion semantics', () => {
  const source = readFileSync(componentUrl, 'utf8');
  assert.match(source, /aria-pressed=\{isSelected\}/);
  assert.match(source, /aria-expanded=\{isSelected\}/);
  assert.match(source, /aria-controls=\{panelId\}/);
  assert.match(source, /focus-visible:ring-2/);
  assert.match(source, /useReducedMotion/);
  assert.doesNotMatch(source, /role="tab"/);
});

test('pathway presents the approved decision content and actions', () => {
  const source = readFileSync(componentUrl, 'utf8');
  assert.match(source, /Best fit when/);
  assert.match(source, /What changes/);
  assert.match(source, /Where students need help/);
  assert.match(source, /How DA helps/);
  assert.match(source, /Talk through your child/);
  assert.match(source, /to="\/book-interview"/);
  assert.match(source, /to="\/hsc-excellence"/);
  assert.match(source, /See topics covered/);
});
```

- [ ] **Step 2: Run the feature test and verify RED**

Run the Node test command from Task 1. Expected: FAIL because `HscMathsPathway.tsx` does not exist.

- [ ] **Step 3: Implement the shared detail renderer**

At module scope, create `StreamDetails({ stream, compact = false })` so React does not recreate it inside the parent component. Use this structure, with a small `DETAIL_ITEMS` array pairing the four labels with Lucide icons and stream fields:

```tsx
const DETAIL_ITEMS = [
  { label: 'Best fit when', field: 'bestFit', icon: Target },
  { label: 'What changes', field: 'whatChanges', icon: TrendingUp },
  { label: 'Where students need help', field: 'helpNeeded', icon: HelpCircle },
  { label: 'How DA helps', field: 'daSupport', icon: Compass },
] as const;

function StreamDetails({ stream, compact = false }: { stream: HscStream; compact?: boolean }) {
  return (
    <div className={compact ? 'px-4 pb-5 pt-2' : 'lg:pl-10'}>
      <p className="text-xs font-black uppercase tracking-[0.12em]" style={{ color: stream.color }}>
        {stream.badge}
      </p>
      <h3 className="mt-2 font-serif text-3xl font-medium tracking-[-0.03em] text-[#071629]">
        {stream.name} at a glance
      </h3>
      <dl className="mt-6 grid gap-5">
        {DETAIL_ITEMS.map(({ label, field, icon: Icon }) => (
          <div key={field} className="grid grid-cols-[1.5rem_1fr] gap-3">
            <Icon className="mt-0.5 h-5 w-5 text-[#40516b]" aria-hidden="true" />
            <div>
              <dt className="text-xs font-black uppercase tracking-[0.1em] text-[#071629]">{label}</dt>
              <dd className="mt-1 text-sm leading-6 text-[#40516b]">{stream[field]}</dd>
            </div>
          </div>
        ))}
      </dl>
      <details className="group mt-6 border-y border-[#071629]/15 py-4">
        <summary className="cursor-pointer text-sm font-black text-[#071629] focus-visible:outline-none focus-visible:ring-2">
          See topics covered
        </summary>
        <ul className="mt-3 grid gap-2 text-sm leading-6 text-[#40516b]">
          {stream.topics.map((topic) => <li key={topic}>{topic}</li>)}
        </ul>
      </details>
      <Link to="/book-interview" className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 bg-[#071629] px-5 text-center text-sm font-black text-white">
        Talk through your child's course choice <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
      <Link to="/hsc-excellence" className="mt-3 inline-flex min-h-11 w-full items-center justify-center text-sm font-black text-[#071629]">
        Explore HSC program <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </div>
  );
}
```

- [ ] **Step 4: Implement desktop course buttons and SVG route**

Inside `HscMathsPathway`:

```ts
const [activeStreamId, setActiveStreamId] = useState<HscStreamId>('standard');
const [hasSelected, setHasSelected] = useState(false);
const prefersReducedMotion = useReducedMotion();
const activeStream = getHscStream(activeStreamId);
const activePath = getActivePath(activeStreamId);
```

Render the desktop panel with `hidden lg:grid`. Use one non-interactive SVG beneath four absolutely positioned native buttons. Draw muted available paths first, then mount active coloured paths whose `pathLength` animates from 0 to 1 unless reduced motion is enabled. The SVG is `aria-hidden="true"`; all meaning also appears in button copy.

Each desktop button must use this state contract:

```tsx
<button
  type="button"
  aria-pressed={isSelected}
  onClick={() => {
    setActiveStreamId(stream.id);
    setHasSelected(true);
  }}
  className="group min-h-14 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-4"
>
  <span className="flex items-center gap-3">
    <span className="h-4 w-4 rounded-full border-[3px] bg-[#fffdf8]" style={{ borderColor: stream.color }} aria-hidden="true" />
    <span>
      <span className="block font-serif text-2xl font-medium text-[#071629]">{stream.name}</span>
      <span className="mt-1 block text-sm text-[#40516b]">{stream.shortDescriptor}</span>
    </span>
    {isSelected ? <span className="ml-auto text-xs font-black uppercase tracking-[0.08em]" style={{ color: stream.color }}>Selected</span> : null}
    <ChevronRight className="h-4 w-4 text-[#40516b]" aria-hidden="true" />
  </span>
</button>
```

Place the `Year 12` threshold between Extension 1 and Extension 2, plus the visible phrases `Extension 2 becomes available`, `Year 12 only`, and `Requires Advanced + Extension 1`.

- [ ] **Step 5: Implement the mobile accordion**

Render `lg:hidden` course rows. For each stream, set `panelId = \`hsc-stream-panel-${stream.id}\`` and connect the button and region:

```tsx
<button
  type="button"
  aria-expanded={isSelected}
  aria-controls={panelId}
  onClick={() => setActiveStreamId(stream.id)}
>
  <span className="flex items-center gap-3">
    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: stream.color }} aria-hidden="true" />
    <span className="min-w-0 flex-1 text-left">
      <span className="block font-serif text-xl font-medium text-[#071629]">{stream.name}</span>
      <span className="block text-sm text-[#40516b]">{stream.shortDescriptor}</span>
    </span>
    <ChevronDown className={`h-4 w-4 text-[#40516b] ${isSelected ? 'rotate-180' : ''}`} aria-hidden="true" />
  </span>
</button>
{isSelected ? (
  <div id={panelId} role="region" aria-label={`${stream.name} course details`}>
    <StreamDetails stream={stream} compact />
  </div>
) : null}
```

Keep one item expanded at all times, with 48px-or-larger row targets and no hover-only information.

- [ ] **Step 6: Run feature tests and typecheck**

```powershell
node --test --experimental-strip-types src/features/hsc-maths-pathway/hsc-maths-pathway.test.ts
npm.cmd run typecheck
```

Expected: all feature tests pass and TypeScript exits 0.

- [ ] **Step 7: Commit the component**

```powershell
git add -- src/features/hsc-maths-pathway/HscMathsPathway.tsx src/features/hsc-maths-pathway/hsc-maths-pathway.test.ts
git commit -m "feat: build accessible HSC maths pathway"
```

### Task 3: Integrate the feature and remove the legacy selector

**Files:**
- Modify: `src/features/hsc-maths-pathway/hsc-maths-pathway.test.ts`
- Modify: `src/pages/subjects/Mathematics.tsx`

**Interfaces:**
- Consumes: `HscMathsPathway` from Task 2.
- Produces: the existing `/subjects/mathematics#hsc-maths` section with unchanged outer page order and a new feature mount.

- [ ] **Step 1: Add the failing integration test**

```ts
const mathematicsUrl = new URL('../../pages/subjects/Mathematics.tsx', import.meta.url);

test('Mathematics page mounts the feature and removes the incomplete tab selector', () => {
  const source = readFileSync(mathematicsUrl, 'utf8');
  assert.match(source, /import \{ HscMathsPathway \}/);
  assert.match(source, /<HscMathsPathway \/>/);
  assert.doesNotMatch(source, /role="tab"/);
  assert.doesNotMatch(source, /hscRoutePaths/);
  assert.doesNotMatch(source, /hscStreamButtonRefs/);
});
```

- [ ] **Step 2: Run the feature test and verify RED**

Run the Node test command. Expected: FAIL because Mathematics still contains the old inline selector.

- [ ] **Step 3: Replace the old inline section**

Add:

```ts
import { HscMathsPathway } from '@/features/hsc-maths-pathway/HscMathsPathway';
```

Replace only the `HSC pathway map` section with:

```tsx
<HscMathsPathway />
```

Remove the obsolete `hscStreams`, active-stream state, route colours, refs, measurement effect, computed SVG path constants, and old selector markup. Remove React imports only when no other code in `Mathematics.tsx` uses them.

- [ ] **Step 4: Run focused and existing maths tests**

```powershell
node --test --experimental-strip-types src/features/hsc-maths-pathway/hsc-maths-pathway.test.ts
npm.cmd run test:maths-motion
npm.cmd run test:graph-lab
npm.cmd run typecheck
```

Expected: every command exits 0.

- [ ] **Step 5: Commit the integration**

```powershell
git add -- src/pages/subjects/Mathematics.tsx src/features/hsc-maths-pathway/hsc-maths-pathway.test.ts
git commit -m "refactor: integrate HSC maths pathway feature"
```

### Task 4: Production and rendered verification

**Files:**
- Modify only if verification finds a concrete defect: `src/features/hsc-maths-pathway/HscMathsPathway.tsx`, `src/features/hsc-maths-pathway/hsc-maths-pathway-model.ts`, or `src/pages/subjects/Mathematics.tsx`.

**Interfaces:**
- Consumes the integrated feature from Task 3.
- Produces verified desktop, tablet, mobile, keyboard, and reduced-motion behaviour.

- [ ] **Step 1: Run production checks**

```powershell
npm.cmd run build
node .agents/skills/impeccable/scripts/detect.mjs --json src/features/hsc-maths-pathway/HscMathsPathway.tsx src/pages/subjects/Mathematics.tsx
```

Expected: build exits 0. Review detector findings manually; no current-surface side stripes, low-contrast opacity controls, or prohibited visual patterns remain.

- [ ] **Step 2: Inspect desktop at 1440px and 1900px**

Open `http://localhost:8080/subjects/mathematics#hsc-maths`. Confirm the route never crosses labels, each course selection updates content, prerequisite segments illuminate correctly, Extension 2 sits below the Year 12 threshold, focus is visible, and the detail CTA remains above the fold at the primary desktop size.

- [ ] **Step 3: Inspect tablet and mobile**

Check at 1024px, 768px, and 390x844. Confirm the breakpoint swaps cleanly from pathway to accordion, there is no horizontal overflow, rows are at least 48px tall, only one panel is expanded, the selected course remains obvious, and both CTA destinations are reachable.

- [ ] **Step 4: Verify input and motion modes separately**

Using keyboard only, activate every desktop course with Tab plus Enter/Space and every mobile row likewise. Verify `aria-pressed`/`aria-expanded` changes. Emulate reduced motion and confirm paths appear without tracing or spatial detail movement.

- [ ] **Step 5: Patch only observed defects, then rerun affected checks**

For every observed defect, first add a failing model or source-contract test when the behaviour is automatable, run it to confirm RED, apply the minimal fix, and rerun the focused test plus build.

- [ ] **Step 6: Final commit**

```powershell
git add -- src/features/hsc-maths-pathway src/pages/subjects/Mathematics.tsx
git commit -m "fix: polish HSC maths pathway interactions"
```

Skip this commit if verification required no source changes.
