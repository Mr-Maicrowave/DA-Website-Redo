import assert from "node:assert/strict";
import test from "node:test";

import { TUTORS } from "../../data/teacherCatalogue.ts";
import {
  createCompleteShelfPresentationForQuery,
  createCompleteShelfPresentation,
  getCompleteShelfPresentationQuery,
  selectCompleteShelfPresentationTutor,
} from "./complete-shelf-presentation.ts";
import { createTutorBookPages } from "./tutor-book-pages.ts";

const jenny = TUTORS.find((tutor) => tutor.id === "T003")!;
const adem = TUTORS.find((tutor) => tutor.id === "T019")!;

test("keeps a tutor book's shelf cloth colour when its physical rig is mounted", () => {
  const presentation = createCompleteShelfPresentation(jenny, {
    id: "T003:primary",
    tutorId: "T003",
    wallId: "primary",
    shelfIndex: 0,
    slotIndex: 0,
    materialVariant: 4,
  });

  assert.equal(presentation.colours.cloth, "#36533d");
});

class RecordingCanvas extends EventTarget {
  width = 0;
  height = 0;
  readonly commands: Array<{ name: string; args: unknown[]; font?: string }> = [];
  readonly context = {
    fillStyle: "",
    strokeStyle: "",
    lineWidth: 0,
    textAlign: "",
    font: "",
    globalAlpha: 1,
    fillRect: (...args: unknown[]) => this.commands.push({ name: "fillRect", args }),
    strokeRect: (...args: unknown[]) => this.commands.push({ name: "strokeRect", args }),
    fillText: (...args: unknown[]) => this.commands.push({ name: "fillText", args, font: this.context.font }),
    drawImage: (...args: unknown[]) => this.commands.push({ name: "drawImage", args }),
    beginPath: () => this.commands.push({ name: "beginPath", args: [] }),
    closePath: () => this.commands.push({ name: "closePath", args: [] }),
    rect: (...args: unknown[]) => this.commands.push({ name: "rect", args }),
    clip: () => this.commands.push({ name: "clip", args: [] }),
    save: () => this.commands.push({ name: "save", args: [] }),
    restore: () => this.commands.push({ name: "restore", args: [] }),
    stroke: () => this.commands.push({ name: "stroke", args: [] }),
    moveTo: (...args: unknown[]) => this.commands.push({ name: "moveTo", args }),
    lineTo: (...args: unknown[]) => this.commands.push({ name: "lineTo", args }),
    arc: (...args: unknown[]) => this.commands.push({ name: "arc", args }),
    translate: (...args: unknown[]) => this.commands.push({ name: "translate", args }),
    rotate: (...args: unknown[]) => this.commands.push({ name: "rotate", args }),
    clearRect: (...args: unknown[]) => this.commands.push({ name: "clearRect", args }),
    createLinearGradient: () => ({ addColorStop: () => undefined }),
    measureText: (value: string) => ({ width: realisticTextWidth(value, this.context.font) }),
  };

  getContext() {
    return this.context;
  }
}

function realisticTextWidth(value: string, font: string) {
  const fontSize = Number(/(\d+(?:\.\d+)?)px/.exec(font)?.[1] ?? 16);
  return [...value].reduce((width, character) => {
    if (/\s/.test(character)) return width + fontSize * .25;
    if (/[ilI1.,'’]/.test(character)) return width + fontSize * .28;
    if (/[mwMW@%]/.test(character)) return width + fontSize * .82;
    if (/[A-Z0-9]/.test(character)) return width + fontSize * .62;
    return width + fontSize * .5;
  }, 0);
}

class RecordingImage {
  static instances: RecordingImage[] = [];
  decoding = "";
  naturalWidth = 800;
  naturalHeight = 1200;
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  private value = "";

  constructor() {
    RecordingImage.instances.push(this);
  }

  set src(value: string) {
    this.value = value;
  }

  get src() {
    return this.value;
  }
}

function createRecordingDocument() {
  const canvases: RecordingCanvas[] = [];
  return {
    canvases,
    document: {
      createElement: () => {
        const canvas = new RecordingCanvas();
        canvases.push(canvas);
        return canvas;
      },
    },
  };
}

test("selects canonical Jenny fields through the adapter's internal default selector", () => {
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

test("defines deterministic high-resolution metadata for every presentation surface", () => {
  const presentation = createCompleteShelfPresentation(jenny);

  assert.deepEqual(presentation.canvasMetadata, {
    cover: { width: 768, height: 1152 },
    spine: { width: 256, height: 1152 },
    back: { width: 768, height: 1152 },
    endpaper: { width: 512, height: 768 },
    interiors: { count: 6, width: 1024, height: 1365 },
  });
  assert.equal(typeof presentation.createCanvasSources, "function");
});

test("draws every Jenny presentation canvas and refreshes the cover after the portrait becomes ready", () => {
  const originalImage = globalThis.Image;
  Object.assign(globalThis, { Image: RecordingImage });
  RecordingImage.instances.length = 0;

  try {
    const { canvases, document } = createRecordingDocument();
    const presentation = createCompleteShelfPresentation(jenny);
    const sources = presentation.createCanvasSources(document as unknown as Document);
    const cover = sources.cover as unknown as RecordingCanvas;
    const coverFoil = sources.coverFoil as unknown as RecordingCanvas;
    const back = sources.back as unknown as RecordingCanvas;
    let coverRefreshes = 0;
    sources.cover.addEventListener("complete-shelf-presentation-update", () => { coverRefreshes += 1; });

    assert.equal(canvases.length, 14, "cover, foil layers, separate endpapers, and six physical profile pages are all canvas-backed");
    assert.deepEqual([sources.cover.width, sources.cover.height], [768, 1152]);
    assert.deepEqual([sources.spine.width, sources.spine.height], [256, 1152]);
    assert.deepEqual([sources.openingEndpaper.width, sources.openingEndpaper.height], [512, 768]);
    assert.deepEqual([sources.frontEndpaper.width, sources.frontEndpaper.height], [512, 768]);
    assert.equal(sources.interiors.length, 6);
    assert.ok(coverFoil.commands.some(command => command.name === "fillText" && command.args[0] === "DA TUITION"));
    assert.equal(
      cover.commands.some(command => command.name === "fillRect" && command.args[0] === cover.width * .11 && command.args[1] === cover.height * .08),
      false,
      "the cloth cover must not be covered by a cream-paper panel",
    );
    assert.ok(coverFoil.commands.some(command => command.name === "arc"), "the reusable arch linework lives on the metallic foil layer");
    assert.ok(back.commands.some(command => command.name === "fillText" && command.args[0] === "DA TUITION"));

    const coverPortrait = RecordingImage.instances[0]!;
    const openingPagePortrait = RecordingImage.instances[1]!;
    assert.equal(coverPortrait.src, "/teachers/jenny.png");
    assert.equal(openingPagePortrait.src, "/teachers/jenny.png");
    coverPortrait.onload?.();
    openingPagePortrait.onload?.();
    RecordingImage.instances[2]?.onload?.();

    assert.equal(coverRefreshes, 1);
    assert.ok(cover.commands.some(command => command.name === "drawImage"));
    assert.ok(cover.commands.some(command => command.name === "arc"), "the closed cover frames the portrait in the DA arch motif");
    const openingEndpaper = sources.openingEndpaper as unknown as RecordingCanvas;
    const frontEndpaper = sources.frontEndpaper as unknown as RecordingCanvas;
    assert.ok(openingEndpaper.commands.some(command => command.name === "drawImage"), "the portrait appears on the opening left-hand page");
    assert.equal(frontEndpaper.commands.some(command => command.name === "drawImage"), false, "the front endpaper must not duplicate the opening portrait at the binding");
    assert.equal((sources.interiors[0] as unknown as RecordingCanvas).commands.some(command => command.name === "drawImage"), false, "the Meet the Tutor page must not repeat the formal cover portrait");
  } finally {
    Object.assign(globalThis, { Image: originalImage });
  }
});

test("builds only the first profile page before the interactive rig mounts", () => {
  const { document } = createRecordingDocument();
  const presentation = createCompleteShelfPresentation(jenny);
  const sources = presentation.createInitialCanvasSources(document as unknown as Document);

  const first = sources.interiors[0] as unknown as RecordingCanvas;
  const deferred = sources.interiors[1] as unknown as RecordingCanvas;
  assert.ok(first.commands.some(command => command.name === "fillText"));
  assert.equal(deferred.commands.length, 0);

  sources.drawInterior(1);
  assert.ok(deferred.commands.some(command => command.name === "fillText"));
});

test("prints one larger Meet the Tutor heading and never generates tag-based filler answers", () => {
  const { document } = createRecordingDocument();
  const sources = createCompleteShelfPresentation(adem).createCanvasSources(document as unknown as Document);
  const identity = sources.interiors[0] as unknown as RecordingCanvas;
  const approach = sources.interiors[1] as unknown as RecordingCanvas;
  const meetHeadings = identity.commands.filter(command => command.name === "fillText" && command.args[0] === "MEET THE TUTOR");
  const approachText = approach.commands.filter(command => command.name === "fillText").map(command => String(command.args[0])).join(" ");

  assert.equal(meetHeadings.length, 1);
  assert.ok(Number(/(\d+(?:\.\d+)?)px/.exec(meetHeadings[0]?.font ?? "")?.[1] ?? 0) >= 40);
  assert.doesNotMatch(approachText, /Their stated approach centres on/i);
  assert.match(approachText, /Not only do I want to see my students unlock their academic potential/i);
});

test("uses the tutor-name serif consistently across every interior page", () => {
  const { document } = createRecordingDocument();
  const sources = createCompleteShelfPresentation(adem).createCanvasSources(document as unknown as Document);
  const interiorText = sources.interiors.flatMap(source => (source as unknown as RecordingCanvas).commands)
    .filter(command => command.name === "fillText");

  assert.ok(interiorText.length > 0);
  assert.ok(interiorText.every(command => command.font?.includes('"Cormorant Garamond"')), "every interior text run uses the same family as the tutor name");
});

test("prints every canonical Jenny page within the high-resolution safe area", () => {
  const { document } = createRecordingDocument();
  const sources = createCompleteShelfPresentation(jenny).createCanvasSources(document as unknown as Document);
  const canonicalPages = createTutorBookPages(jenny);

  sources.interiors.forEach((source, index) => {
    const canvas = source as unknown as RecordingCanvas;
    const textCommands = canvas.commands.filter(command => command.name === "fillText");
    const printed = textCommands.map(command => String(command.args[0])).join(" ").replace(/\s+/g, " ");

    for (const canonicalText of canonicalPages[index].sourceText) {
      assert.ok(printed.includes(canonicalText.replace(/\s+/g, " ")), `${canonicalPages[index].id} prints canonical source text: ${canonicalText}`);
    }
    assert.ok(textCommands.every(command => {
      const x = Number(command.args[1]);
      const y = Number(command.args[2]);
      return x >= canvas.width * .08 && x <= canvas.width * .92
        && y >= canvas.height * .06 && y <= canvas.height * .94;
    }), `${canonicalPages[index].id} stays within print-safe margins`);
  });
});

test("prints the authored teaching approach instead of generic tag-derived filler", () => {
  const { document } = createRecordingDocument();
  const sources = createCompleteShelfPresentation(jenny).createCanvasSources(document as unknown as Document);
  const canvas = sources.interiors[1] as unknown as RecordingCanvas;
  const printed = canvas.commands
    .filter(command => command.name === "fillText")
    .map(command => String(command.args[0]))
    .join(" ")
    .replace(/\s+/g, " ");
  const authoredApproach = createTutorBookPages(jenny)[1].sourceText[1]!;

  assert.ok(printed.includes(authoredApproach));
  assert.doesNotMatch(printed, /Their stated approach centres on/i);
});

test("fits Jenny's readable Why Trust Them excerpt and evidence using realistic Georgia metrics", () => {
  const { document } = createRecordingDocument();
  const sources = createCompleteShelfPresentation(jenny).createCanvasSources(document as unknown as Document);
  const canvas = sources.interiors[2] as unknown as RecordingCanvas;
  const bodyCommands = canvas.commands.filter(command => command.name === "fillText" && Number(command.args[2]) >= canvas.height * .2 && Number(command.args[2]) < canvas.height * .72);
  const printed = bodyCommands.map(command => String(command.args[0])).join(" ").replace(/\s+/g, " ").trim();
  const canonical = createTutorBookPages(jenny)[2].sourceText;
  const allPrinted = canvas.commands.filter(command => command.name === "fillText").map(command => String(command.args[0])).join(" ");

  assert.ok(printed.includes(canonical[0]!), "the readable excerpt remains visible");
  assert.ok(canonical.slice(1).every(text => allPrinted.includes(text)), "the real evidence remains visible");
  assert.ok(bodyCommands.every(command => Number(command.args[2]) <= canvas.height * .92), "every baseline stays inside the bottom print-safe bound");
  assert.ok(bodyCommands.every(command => Number(/(\d+(?:\.\d+)?)px/.exec(command.font ?? "")?.[1] ?? 0) >= 25), "the deterministic fit never drops below the readable raster floor");
  assert.ok(bodyCommands.every(command => realisticTextWidth(String(command.args[0]), command.font ?? "") <= canvas.width * .82), "every measured line stays within the body width");
  assert.ok(bodyCommands.length >= 2, "the regression exercises a wrapped reading excerpt, not a one-word fixture");
});

test("flows Why Trust Them sections without colliding at the bottom of the page", () => {
  const { document } = createRecordingDocument();
  const sources = createCompleteShelfPresentation(jenny).createCanvasSources(document as unknown as Document);
  const canvas = sources.interiors[2] as unknown as RecordingCanvas;
  const pages = createTutorBookPages(jenny);
  const strengths = pages[2].sourceText.slice(2, -1);
  const yFor = (text: string) => canvas.commands
    .filter(command => command.name === "fillText" && command.args[0] === text)
    .map(command => Number(command.args[2]));
  const lastStrengthY = Math.max(...strengths.flatMap(yFor));
  const priorityHeadingY = yFor("WHAT THEY PRIORITISE")[0]!;
  const priorityLineYs = canvas.commands
    .filter(command => command.name === "fillText" && Number(command.args[2]) > priorityHeadingY)
    .map(command => Number(command.args[2]));
  const firstPriorityLineY = Math.min(...priorityLineYs);

  assert.ok(Number.isFinite(lastStrengthY));
  assert.ok(priorityHeadingY >= lastStrengthY + canvas.height * .045, "the next section begins after the final strength");
  assert.ok(firstPriorityLineY >= priorityHeadingY + canvas.height * .035, "priority copy begins below its heading");
  assert.ok(priorityLineYs.every(y => y <= canvas.height * .94), "priority copy remains inside the print-safe bottom margin");
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

test("only supplies DA presentation canvases for the canonical Jenny query", () => {
  assert.equal(createCompleteShelfPresentationForQuery(null), undefined);
  assert.equal(createCompleteShelfPresentationForQuery("unexpected"), undefined);
  assert.equal(createCompleteShelfPresentationForQuery("jenny")?.tutorId, "T003");
});

test("maps only the explicit Jenny query value to a DA presentation", () => {
  assert.equal(getCompleteShelfPresentationQuery(""), null);
  assert.equal(getCompleteShelfPresentationQuery("presentation=unknown"), null);
  assert.equal(getCompleteShelfPresentationQuery("presentation=jenny"), "jenny");
});
