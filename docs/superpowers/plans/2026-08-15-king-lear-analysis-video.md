# King Lear Analysis Video Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render a 40-second 1920×1080 female-narrated Remotion video that teaches students how to improve a King Lear quotation analysis.

**Architecture:** A standalone Remotion project lives in the visualization workspace, not the DA Tuition website. A single composition owns deterministic scene timing, storm background treatment, editable instructional copy, and audio mixing; local asset files are resolved before rendering so the render has no network dependency.

**Tech Stack:** Remotion, React, TypeScript, FFmpeg, local MP3/WAV/MP4 assets.

## Global Constraints

- Output is a 1920×1080 MP4 of approximately 40 seconds.
- Use a calm, clear female voice and retain the user-provided wording verbatim.
- Display the opening quotation as from *King Lear*, Act III.
- Hold each requested teaching paragraph for at least three seconds and the final assembled paragraph for at least five seconds.
- Bold “pathetic fallacy”, “soliloquy”, and “the weather being a physical manifestation of his internal conflict”.
- Storm visuals and rain/thunder SFX support, never mask, the narration.
- Keep all source and generated video assets outside `C:\Projects\DA-Website-Redo`.

---

## File structure

- `C:\Users\phill\.codex\visualizations\2026\08\15\01a00402-fad1-7aa3-90f7-4ab46552c60a\king-lear-analysis\package.json` — standalone render scripts and dependencies.
- `...\king-lear-analysis\src\Root.tsx` — Remotion composition registration.
- `...\king-lear-analysis\src\KingLearAnalysis.tsx` — scene timeline, typography, transitions, and audio placement.
- `...\king-lear-analysis\src\copy.tsx` — exact screen copy and emphasis spans.
- `...\king-lear-analysis\public\audio\narration.mp3` — female narration.
- `...\king-lear-analysis\public\audio\storm.mp3` — rain, wave, and thunder sound bed.
- `...\king-lear-analysis\public\video\ocean.mp4` — looping crashing-wave background.
- `...\king-lear-analysis\out\king-lear-analysis.mp4` — rendered deliverable.

### Task 1: Scaffold a deterministic Remotion composition

**Files:**
- Create: `...\king-lear-analysis\package.json`
- Create: `...\king-lear-analysis\src\index.ts`
- Create: `...\king-lear-analysis\src\Root.tsx`
- Create: `...\king-lear-analysis\src\KingLearAnalysis.tsx`

**Interfaces:**
- Produces: `KingLearAnalysis` composition with `id="KingLearAnalysis"`, `fps=30`, `durationInFrames=1200`, `width=1920`, `height=1080`.

- [ ] **Step 1: Initialise the project and install exact render dependencies**

Run: `npm init -y; npm install remotion @remotion/cli @remotion/media-utils react react-dom`

- [ ] **Step 2: Register the fixed-duration composition**

```tsx
<Composition id="KingLearAnalysis" component={KingLearAnalysis} durationInFrames={1200} fps={30} width={1920} height={1080} />
```

- [ ] **Step 3: Implement the base storm stage**

```tsx
export const KingLearAnalysis: React.FC = () => (
  <AbsoluteFill className="storm-stage">
    <OffthreadVideo src={staticFile('video/ocean.mp4')} />
    <AbsoluteFill className="storm-overlay" />
  </AbsoluteFill>
);
```

- [ ] **Step 4: Render a 1-second smoke test**

Run: `npx remotion render src/index.ts KingLearAnalysis out/smoke.mp4 --frames=0-29`

Expected: an H.264 1920×1080 MP4 with no missing-media error.

### Task 2: Add exact teaching copy and timed scenes

**Files:**
- Create: `...\king-lear-analysis\src\copy.tsx`
- Modify: `...\king-lear-analysis\src\KingLearAnalysis.tsx`

**Interfaces:**
- Consumes: `KingLearAnalysis` composition from Task 1.
- Produces: `copy` constants and `TextBlock` scenes driven by the composition frame number.

- [ ] **Step 1: Add typed copy exports**

```tsx
export const quote = '“Rage, blow, spit, fire; spout, rain! I tax not you, you elements with unkindness. I never gave you kingdom, called you children.”';
export const source = 'King Lear, Act III';
```

- [ ] **Step 2: Add sequenced scene boundaries**

```ts
const beats = { quote: [0, 180], weak: [180, 360], diagnostics: [360, 420], da: [420, 510], embed: [510, 660], layer: [660, 870], audience: [870, 1020], final: [1020, 1200] } as const;
```

- [ ] **Step 3: Implement the diagnostic labels**

```tsx
{['Too broad', 'Too brief', 'No context'].map((label, index) => (
  <Diagnostic key={label} label={label} start={360 + index * 15} duration={15} />
))}
```

- [ ] **Step 4: Implement semantic emphasis in the layered paragraph**

```tsx
<strong>pathetic fallacy</strong>
<strong>soliloquy</strong>
<strong>the weather being a physical manifestation of his internal conflict</strong>
```

- [ ] **Step 5: Capture scene midpoint frames**

Run: `npx remotion still src/index.ts KingLearAnalysis out/quote.png --frame=90` and repeat for frames `270`, `585`, `765`, and `1110`.

Expected: all wording is readable at 1920×1080, source label is present, and requested phrases are bold.

### Task 3: Resolve and mix narration and storm media

**Files:**
- Create: `...\king-lear-analysis\public\audio\narration.mp3`
- Create: `...\king-lear-analysis\public\audio\storm.mp3`
- Create: `...\king-lear-analysis\public\video\ocean.mp4`
- Modify: `...\king-lear-analysis\src\KingLearAnalysis.tsx`

**Interfaces:**
- Consumes: scene timing from Task 2.
- Produces: local media paths referenced with `staticFile()`.

- [ ] **Step 1: Produce a female narration file from the timed teaching script**

The spoken script includes the Act III quote, weak analysis, DA proposition, embed instruction and sentence, layer instruction and paragraph, audience-link instruction and sentence. Time it to fit within frames 0–1020.

- [ ] **Step 2: Obtain local ocean and storm assets with reuse rights**

Use an ocean clip that can loop for 40 seconds and an effects bed that contains rain, waves, and occasional distant thunder. Record asset source URLs in `ASSETS.md`.

- [ ] **Step 3: Mix audio at readable levels**

```tsx
<Audio src={staticFile('audio/storm.mp3')} volume={0.14} />
<Audio src={staticFile('audio/narration.mp3')} volume={1} />
```

- [ ] **Step 4: Render an audio check**

Run: `npx remotion render src/index.ts KingLearAnalysis out/audio-check.mp4 --frames=0-1020`

Expected: speech is intelligible over the storm at normal desktop volume.

### Task 4: Add continuous motion and final synthesis

**Files:**
- Modify: `...\king-lear-analysis\src\KingLearAnalysis.tsx`

**Interfaces:**
- Consumes: completed text scenes and local media from Tasks 2–3.
- Produces: a gold-streak transition into a five-second final assembled paragraph.

- [ ] **Step 1: Use leftward scene exits and matching leftward entries**

```tsx
const slideX = interpolate(frame - start, [0, 18], [90, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
```

- [ ] **Step 2: Add the single gold streak at frame 1020**

```tsx
const streakX = interpolate(frame, [1020, 1050], [-2200, 2200], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
```

- [ ] **Step 3: Assemble the three teaching blocks into the final paragraph**

Use the embedded quotation sentence, layered deconstruction paragraph, and audience link in one readable final editorial composition from frame 1050 through 1200.

- [ ] **Step 4: Render and inspect the final-hold frame**

Run: `npx remotion still src/index.ts KingLearAnalysis out/final-hold.png --frame=1125`

Expected: the complete paragraph is visible and the gold transition has cleared.

### Task 5: Render and verify the deliverable

**Files:**
- Create: `...\king-lear-analysis\out\king-lear-analysis.mp4`
- Create: `...\king-lear-analysis\out\contact-sheet.png`

**Interfaces:**
- Consumes: final Remotion composition.
- Produces: deliverable MP4 and visual review evidence.

- [ ] **Step 1: Render the complete composition**

Run: `npx remotion render src/index.ts KingLearAnalysis out/king-lear-analysis.mp4 --codec=h264`

- [ ] **Step 2: Confirm file metadata**

Run: `ffprobe -v error -show_entries format=duration -show_entries stream=codec_name,width,height -of default=noprint_wrappers=1 out/king-lear-analysis.mp4`

Expected: H.264 video, 1920×1080, duration approximately 40 seconds.

- [ ] **Step 3: Create a review contact sheet**

Run: `ffmpeg -i out/king-lear-analysis.mp4 -vf "fps=1/5,scale=480:-1,tile=4x2" -frames:v 1 out/contact-sheet.png`

Expected: eight labelled temporal snapshots suitable for visual review.

- [ ] **Step 4: Review against acceptance criteria**

Inspect the contact sheet and rendered audio/video. Confirm the Act III source, all required copy, 0.5-second diagnostic sequence, bold technique phrases, three-second teaching holds, five-second final hold, female narration, and storm ambience.
