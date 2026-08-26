import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(new URL("./HSCExcellence.tsx", import.meta.url), "utf8");

test("uses one shared living-landscape video below the hero", () => {
  assert.equal((source.match(/<video/g) ?? []).length, 1);
  assert.match(source, /<SubjectHero[\s\S]*<div id="hsc-excellence-page-content"/);
  assert.match(source, /className="hsc-landscape-video"/);
  assert.match(source, /autoPlay/);
  assert.match(source, /muted/);
  assert.match(source, /loop/);
  assert.match(source, /playsInline/);
});

test("provides a poster and reduced-motion static fallback", () => {
  assert.match(source, /poster="\/media\/hsc\/living-landscape-poster\.jpg"/);
  assert.match(source, /source src="\/media\/hsc\/living-landscape\.mp4" type="video\/mp4"/);
  assert.match(source, /@media \(prefers-reduced-motion: reduce\)[\s\S]*\.hsc-landscape-video\s*\{[\s\S]*display:\s*none/);
});

test("renders only the video canvas below the hero", () => {
  assert.match(source, /className="hsc-landscape-shell hsc-video-only"/);
  assert.match(source, /\.hsc-video-only\s*\{[\s\S]*min-height:\s*100svh/);
  assert.match(source, /height:\s*100svh/);
  assert.match(source, /object-fit:\s*cover/);
  assert.match(source, /pointer-events:\s*none/);
  assert.doesNotMatch(source, /<div className="hsc-landscape-overlay"/);
  assert.match(source, /<main className="hsc-landscape-content" hidden>/);
  assert.match(source, /className="hsc-video-only-footer" hidden/);
});
