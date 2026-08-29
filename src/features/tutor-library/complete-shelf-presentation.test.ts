import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { TUTORS } from "../../data/teacherCatalogue.ts";
import {
  createCompleteShelfPresentationForQuery,
  createCompleteShelfPresentation,
  selectCompleteShelfPresentationTutor,
} from "./complete-shelf-presentation.ts";

const jenny = TUTORS.find((tutor) => tutor.id === "T003")!;

test("selects canonical Jenny fields and uses Jenny for an absent presentation query", () => {
  const selected = selectCompleteShelfPresentationTutor(null);
  const explicit = selectCompleteShelfPresentationTutor("jenny");

  assert.equal(selected.id, "T003");
  assert.equal(explicit, jenny);
  assert.deepEqual(
    {
      name: explicit.name,
      designation: explicit.designation,
      tagline: explicit.tagline,
      motto: explicit.motto,
      subjects: explicit.subjects,
    },
    {
      name: "Mrs Jenny N.",
      designation: "The Excellence Standard",
      tagline: "She doesn't teach to the test. She teaches to last.",
      motto: "Every child deserves to know what excellent work feels like.",
      subjects: "Primary (English & Mathematics) / English (Yr 7–10) / English Standard / English Advanced",
    },
  );
});

test("derives Jenny's canonical portrait URL and a deterministic fallback", () => {
  const presentation = createCompleteShelfPresentation(jenny);

  assert.equal(presentation.portrait.url, "/teachers/jenny.png");
  assert.equal(presentation.portrait.fallbackUrl, "/teachers/jenny.png");
});

test("provides deterministic high-resolution canvas metadata for every presentation surface", () => {
  const presentation = createCompleteShelfPresentation(jenny);

  assert.deepEqual(presentation.canvasMetadata, {
    cover: { width: 1536, height: 2304 },
    spine: { width: 512, height: 2304 },
    back: { width: 1536, height: 2304 },
    endpaper: { width: 1024, height: 1536 },
    interiors: { count: 8, width: 1024, height: 1536 },
  });
  assert.equal(typeof presentation.createCanvasSources, "function");
});

test("rejects attempts to override the factory's physical dimensions or physics", () => {
  assert.throws(
    () => createCompleteShelfPresentation({ ...jenny, width: 99 } as typeof jenny),
    /physical.*width/i,
  );
  assert.throws(
    () => createCompleteShelfPresentation({ ...jenny, physics: { pageSegments: 1 } } as typeof jenny),
    /physical.*physics/i,
  );
});

test("exposes a presentation-only seam without accepting a replacement book model", () => {
  const rigSource = readFileSync(
    new URL("../../../public/dev/complete-shelf-rig/complete-shelf-book-rig.js", import.meta.url),
    "utf8",
  );

  assert.match(rigSource, /const presentation = config\.presentation/);
  assert.match(rigSource, /applyPresentation/);
  assert.doesNotMatch(rigSource, /config\.book/);
});

test("only supplies DA presentation canvases for the canonical Jenny query", () => {
  assert.equal(createCompleteShelfPresentationForQuery(null), undefined);
  assert.equal(createCompleteShelfPresentationForQuery("unexpected"), undefined);
  assert.equal(createCompleteShelfPresentationForQuery("jenny")?.tutorId, "T003");
});
