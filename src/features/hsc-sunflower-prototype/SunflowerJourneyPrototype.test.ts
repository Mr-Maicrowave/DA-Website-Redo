import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const app = readFileSync(new URL("../../App.tsx", import.meta.url), "utf8");
const model = readFileSync(new URL("./sunflowerJourneyModel.ts", import.meta.url), "utf8");
const component = readFileSync(new URL("./SunflowerJourneyPrototype.tsx", import.meta.url), "utf8");
const css = readFileSync(new URL("./sunflower-journey-prototype.css", import.meta.url), "utf8");

test("registers an isolated development-only prototype route", () => {
  assert.match(app, /path="\/hsc-sunflower-prototype"/);
  assert.match(app, /import\.meta\.env\.DEV/);
});

test("defines ten backgrounds, twelve foregrounds, and twenty camera beats", () => {
  assert.equal((model.match(/sunflower-bg-/g) ?? []).length, 10);
  assert.equal((model.match(/sunflower-fg-/g) ?? []).length, 12);
  assert.match(model, /Array\.from\(\{ length: 20 \}/);
});

test("renders the required layered stage with no copy or controls", () => {
  for (const name of ["backgroundLayer", "midgroundLayer", "foregroundLayer", "atmosphereLayer", "storyLayer"]) {
    assert.match(component, new RegExp(name));
  }
  assert.doesNotMatch(component, /<h[1-6]|<button|<nav/);
  assert.match(css, /height:\s*800vh/);
  assert.match(css, /height:\s*100svh/);
  assert.match(css, /overflow:\s*hidden/);
});

test("uses one master timeline for twenty camera beats", () => {
  assert.equal((component.match(/gsap\.timeline\(/g) ?? []).length, 1);
  assert.equal((component.match(/scrollTrigger:\s*\{/g) ?? []).length, 1);
  assert.match(component, /scrub:\s*1\.2/);
  assert.match(component, /pin:/);
  assert.match(component, /camera-20/);
});

test("changes environments beneath varied foreground occlusion", () => {
  assert.match(component, /close-right/);
  assert.match(component, /close-left/);
  assert.match(component, /bottom-leaves/);
  assert.match(component, /cluster-five/);
  assert.doesNotMatch(component, /scrollSnap|snap:/);
});

test("adds independent breeze, lighting progression, and reduced motion", () => {
  assert.match(component, /repeat:\s*-1/);
  assert.match(component, /yoyo:\s*true/);
  assert.match(component, /prefers-reduced-motion/);
  assert.match(component, /data-atmosphere/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
});

test("keeps the opening wide before progressively introducing plant layers", () => {
  assert.match(component, /gsap\.set\(midground,\s*\{ autoAlpha: 0 \}\)/);
  assert.match(component, /const plantRevealBeats/);
  assert.match(css, /\.midgroundLayer \.sunflowerPlant[\s\S]*opacity:\s*0/);
});
