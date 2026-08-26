import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const root = new URL("./", import.meta.url);
const html = readFileSync(new URL("index.html", root), "utf8");
const css = readFileSync(new URL("styles.css", root), "utf8");
const js = readFileSync(new URL("script.js", root), "utf8");

test("ships as a framework-free standalone prototype", () => {
  assert.match(html, /styles\.css/);
  assert.match(html, /script\.js/);
  assert.match(html, /gsap@3/);
  assert.match(html, /ScrollTrigger/);
  assert.equal(/react|next\.js|three\.js|canvas/i.test(html), false);
});

test("uses one pinned camera world rather than slide sections", () => {
  assert.match(html, /class="final-ascent"/);
  assert.match(html, /class="sticky-stage"/);
  assert.match(html, /class="camera"/);
  assert.match(html, /class="world"/);
  assert.match(css, /\.final-ascent\s*\{[\s\S]*?height:\s*600svh/);
  assert.match(js, /gsap\.timeline\([\s\S]*?scrollTrigger:/);
  assert.match(js, /pin:\s*stage/);
  assert.equal((js.match(/gsap\.timeline\(/g) ?? []).length, 1);
});

test("contains the three depth layers and four drawn routes", () => {
  for (const layer of ["background", "midground", "foreground"]) {
    assert.match(html, new RegExp(`layer ${layer}`));
  }
  for (const route of ["private", "classes", "hsc-prep", "trial-prep"]) {
    assert.match(html, new RegExp(`data-route="${route}"`));
    assert.match(html, new RegExp(`data-marker="${route}"`));
  }
  assert.match(js, /strokeDashoffset/);
});

test("includes the approved opening, route, and final messages", () => {
  for (const message of [
    "The final ascent.",
    "No two students need the same route.",
    "Private tuition",
    "Classes",
    "HSC preparation",
    "Trial preparation",
    "Different paths.",
    "The right support for theirs.",
  ]) {
    assert.ok(html.includes(message), `missing copy: ${message}`);
  }
});

test("supports mobile and reduced-motion fallbacks", () => {
  assert.match(css, /@media \(max-width:\s*700px\)/);
  assert.match(css, /@media \(prefers-reduced-motion:\s*reduce\)/);
  assert.match(js, /prefers-reduced-motion/);
  assert.match(js, /pointer:\s*coarse/);
});

test("all required local assets exist", () => {
  for (const asset of [
    "hsc-world.webp",
    "desk-foreground.webp",
    "map-background.webp",
    "map-midground.webp",
    "map-foreground.webp",
    "private-marker.svg",
    "classes-marker.svg",
    "hsc-prep-marker.svg",
    "trial-prep-marker.svg",
    "compass.webp",
    "paper-texture.webp",
  ]) {
    assert.ok(existsSync(new URL(`assets/${asset}`, root)), `missing ${asset}`);
  }
});
