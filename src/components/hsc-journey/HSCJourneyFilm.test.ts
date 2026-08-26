import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const component = readFileSync(
  new URL("./HSCJourneyFilm.tsx", import.meta.url),
  "utf8",
);
const css = readFileSync(
  new URL("./hsc-journey-film.css", import.meta.url),
  "utf8",
);
const page = readFileSync(
  new URL("../../pages/HSCExcellence.tsx", import.meta.url),
  "utf8",
);

test("uses one reversible master timeline without a graduation cap", () => {
  assert.equal((component.match(/gsap\.timeline\(/g) ?? []).length, 1);
  assert.equal((component.match(/scrollTrigger:\s*\{/g) ?? []).length, 1);
  assert.equal(component.includes("MotionPathPlugin"), false);
  assert.equal(component.includes("hscjf-cap"), false);
  assert.equal(component.includes("/cap.png"), false);
  assert.equal(component.includes("crossFade"), false);
});

test("stacks nine scenes in one viewport without horizontal panel travel", () => {
  assert.match(component, /className="hscjf-scenes"/);
  assert.match(component, /data-scene=\{index \+ 1\}/);
  assert.match(css, /\.hscjf-scenes[\s\S]*position:\s*absolute/);
  assert.match(css, /\.hscjf-scene[\s\S]*inset:\s*0/);
  assert.equal(css.includes("width: 900vw"), false);
  assert.equal(css.includes("left: 100vw"), false);
  assert.equal(component.includes("window.innerWidth * (index + 1)"), false);
  assert.equal(
    component.includes('querySelector<HTMLElement>(".hscjf-world")'),
    false,
  );
});

test("renders physical transition surfaces without the synthetic desk bridge", () => {
  for (const surface of [
    "paper-cover",
    "cream-cover",
    "pigment-reveal",
    "cloud-cover",
  ]) {
    assert.match(component, new RegExp(`data-transition="${surface}"`));
    assert.match(css, new RegExp(`\\.hscjf-${surface}`));
  }

  assert.equal(component.includes('data-transition="desk-bridge"'), false);
  assert.equal(component.includes('surface("desk-bridge")'), false);
  assert.equal(css.includes(".hscjf-desk-bridge"), false);
});

test("cloud and pigment surfaces have opaque viewport backings", () => {
  assert.match(
    css,
    /\.hscjf-pigment-reveal[\s\S]*background:\s*#dce9ed/,
  );
  assert.match(css, /\.hscjf-cloud-cover[\s\S]*background:\s*#eef1ec/);
});

test("switches stacked scene visibility through master-timeline set operations", () => {
  assert.match(component, /const showScene\s*=\s*\(/);
  assert.match(component, /timeline\.set\(\s*scenes\[index\]/);
  assert.match(component, /visibility:\s*"hidden"/);
  assert.match(component, /visibility:\s*"visible"/);
});

test("defines all eight physical match-transition windows", () => {
  for (let index = 1; index <= 9; index += 1) {
    assert.match(component, new RegExp(`scene-${index}`));
  }
  for (let index = 1; index < 9; index += 1) {
    assert.match(component, new RegExp(`transition-${index}-${index + 1}`));
  }
  assert.equal((component.match(/gsap\.timeline\(/g) ?? []).length, 1);
});

test("uses nine complete backgrounds without layered scene assets", () => {
  assert.match(component, /Array\.from\([\s\S]*\{ length: 9 \}/);
  assert.match(component, /frames\/frame-/);
  assert.equal(component.includes("01-begin/"), false);
  assert.equal(component.includes("09-future/"), false);
  for (let index = 1; index <= 9; index += 1) {
    const name = `frame-${String(index).padStart(2, "0")}.png`;
    assert.equal(
      existsSync(
        new URL(`../../../public/hsc-journey/frames/${name}`, import.meta.url),
      ),
      true,
    );
  }
});

test("supports responsive and reduced-motion presentation", () => {
  assert.match(component, /prefers-reduced-motion/);
  assert.match(css, /@media\s*\(max-width:\s*768px\)/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /100svh/);
});

test("gates animation readiness and contains horizontal overflow", () => {
  assert.match(component, /aria-busy=\{!ready\}/);
  assert.match(component, /Promise\.all/);
  assert.match(component, /image\.decode/);
  assert.match(component, /context\.revert\(\)/);
  assert.match(component, /media\.revert\(\)/);
  assert.match(css, /\.hscjf-scenes[\s\S]*overflow-x:\s*clip/);
  assert.match(css, /max-width:\s*100%/);
});

test("is mounted below the existing HSC hero", () => {
  assert.match(page, /<SubjectHero[\s\S]*<HSCJourneyFilm\s*\/>/);
});

test("uses the approved editorial copy for all nine frames", () => {
  const requiredCopy = [
    "01 · START WITH THEM",
    "Every HSC journey",
    "starts somewhere different.",
    "We begin by understanding their subjects, their goals, their confidence, and where they need the most support.",
    "02 · BUILD THE PLAN",
    "We turn the year ahead",
    "into something they can manage.",
    "A clear plan for school, assessments, revision, Trials and the HSC — so every week moves them closer to their goal.",
    "03 · TEACH FOR THE MARK",
    "Knowing it",
    "isn’t enough.",
    "We teach students how to turn what they know into the responses, working and exam technique that earn marks.",
    "04 · WE’RE THERE",
    "Support shouldn’t disappear",
    "when class ends.",
    "We’re here for the questions, the worries, the setbacks and the breakthroughs.",
    "05 · FEEDBACK → ACTION",
    "Every mistake tells us",
    "what to work on next.",
    "Understand. Practise. Feedback. Improve. We close the gap, not just mark the work.",
    "06 · PRACTISE THE PRESSURE",
    "Practice before",
    "it counts.",
    "Timed work, past papers and exam conditions prepare them for the pressure of Trials and the HSC.",
    "07 · HSC",
    "By the time HSC arrives,",
    "they’ve done this before.",
    "They’ve practised the timing. The technique. The decisions. Now it’s time to trust the preparation.",
    "08 · MORE THAN A MARK",
    "We prepare for more",
    "than an exam.",
    "Independence. Confidence. Discipline. Resilience. The things they’ll need long after the final exam.",
    "09 · BEYOND HSC",
    "More choices for",
    "whatever comes next.",
    "University. A career. A different path entirely. Our job is to help them leave Year 12 ready to choose.",
  ];

  for (const text of requiredCopy) assert.equal(component.includes(text), true);
});

test("reveals each overlay in label heading body order", () => {
  assert.match(component, /data-copy-part="label"/);
  assert.match(component, /data-copy-part="heading"/);
  assert.match(component, /data-copy-part="body"/);
  assert.match(component, /copyParts\.label/);
  assert.match(component, /copyParts\.heading/);
  assert.match(component, /copyParts\.body/);
});

test("keeps the paintings unobstructed by copy-panel backgrounds", () => {
  const copyRule = css.match(/\.hscjf-copy\s*\{([\s\S]*?)\n\}/)?.[1] ?? "";

  assert.equal(copyRule.includes("background:"), false);
});

test("clears each copy overlay before its physical transition starts", () => {
  assert.match(component, /index \* 10 \+ 6\.1/);
  assert.match(component, /duration:\s*0\.4/);
  assert.equal(component.includes("at + 7.1"), false);
});

test("places a natural-height editorial message rail beneath the artwork", () => {
  assert.match(component, /className="hscjf-stage"[\s\S]*?<StoryCopy \/>/);
  assert.match(css, /\.hscjf-viewport\s*\{[\s\S]*?display:\s*flex;[\s\S]*?flex-direction:\s*column;/);
  assert.match(css, /\.hscjf-stage\s*\{[\s\S]*?flex:\s*1 1 auto;[\s\S]*?min-height:\s*0;/);
  assert.match(
    css,
    /\.hscjf-copy-track\s*\{[\s\S]*?position:\s*relative;[\s\S]*?display:\s*grid;/,
  );
  assert.match(
    css,
    /\.hscjf-copy\s*\{[\s\S]*?position:\s*relative;[\s\S]*?grid-area:\s*1 \/ 1;/,
  );
  assert.equal(css.includes(".hscjf-copy-1 {"), false);
});
