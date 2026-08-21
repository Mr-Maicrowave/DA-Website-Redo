import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const component = readFileSync(new URL("./FinaleScene.tsx", import.meta.url), "utf8");
const styles = readFileSync(new URL("./FinaleScene.css", import.meta.url), "utf8");

test("year decoration is grouped behind a dedicated foreground copy layer", () => {
  assert.match(component, /className="hs-finale__year-decoration"/);
  assert.match(component, /className="hs-finale__year-copy-content"/);
  assert.match(
    component,
    /hs-finale__year-decoration[\s\S]*hs-finale__content-wash[\s\S]*hs-finale__ghost-number/,
  );
});

test("the shared year background is enlarged and shifted left in CSS", () => {
  assert.match(styles, /\.hs-journey \.hs-finale__year-decoration\s*\{[^}]*left:-5%/s);
  assert.match(styles, /\.hs-journey \.hs-finale__year-decoration\s*\{[^}]*right:-5%/s);
  assert.match(styles, /\.hs-journey \.hs-finale__content-wash\s*\{[^}]*object-position:center/s);
});
