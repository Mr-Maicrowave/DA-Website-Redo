import { getPhotoUrl, TUTORS, type CatalogueTutor } from "../../data/teacherCatalogue.ts";
import { createTutorBookPages, type TutorBookPage } from "./tutor-book-pages.ts";
import type { TutorBookEdition } from "./tutor-library-data.ts";
import { getTutorBookCoverTheme } from "./tutor-book-appearance.ts";

export const COMPLETE_SHELF_PRESENTATION_NAMES = ["jenny"] as const;
export type CompleteShelfPresentationName = typeof COMPLETE_SHELF_PRESENTATION_NAMES[number];

const CANVAS_METADATA = {
  cover: { width: 768, height: 1152 },
  spine: { width: 256, height: 1152 },
  back: { width: 768, height: 1152 },
  endpaper: { width: 512, height: 768 },
  interiors: { count: 6, width: 1024, height: 1365 },
} as const;

const JENNY_FALLBACK_PORTRAIT = "/teachers/jenny.png";
const PRESENTATION_UPDATE_EVENT = "complete-shelf-presentation-update";
const PHYSICAL_OVERRIDE_KEYS = new Set([
  "width", "height", "depth", "board", "coverRadius", "pageRadius", "spineRadius",
  "spineBoardThickness", "spineWidth", "pageWidth", "pageHeight", "pageDepth", "physics",
  "controller", "timing", "deformation", "pageSegments", "pageVerticalSegments",
]);

export interface CompleteShelfPresentationCanvasSources {
  cover: HTMLCanvasElement;
  coverFoil: HTMLCanvasElement;
  spine: HTMLCanvasElement;
  spineFoil: HTMLCanvasElement;
  back: HTMLCanvasElement;
  backFoil: HTMLCanvasElement;
  openingEndpaper: HTMLCanvasElement;
  frontEndpaper: HTMLCanvasElement;
  interiors: HTMLCanvasElement[];
}

export interface DeferredCompleteShelfPresentationCanvasSources extends CompleteShelfPresentationCanvasSources {
  drawInterior(index: number): void;
}

export interface CompleteShelfPresentation {
  tutorId: string;
  portrait: { url: string; fallbackUrl: string };
  colours: { cloth: string; foil: string; accent: string; paper: string; ink: string; edge: string };
  canvasMetadata: typeof CANVAS_METADATA;
  createCanvasSources(canvasDocument?: Pick<Document, "createElement">): CompleteShelfPresentationCanvasSources;
  createInitialCanvasSources(canvasDocument?: Pick<Document, "createElement">): DeferredCompleteShelfPresentationCanvasSources;
}

function getJennyTutor() {
  // The adapter owns one approved presentation selector. It deliberately does
  // not choose a substitute tutor from non-canonical data.
  return TUTORS.find((tutor) => tutor.id === "T003")!;
}

function assertPresentationOnlyInput(tutor: CatalogueTutor) {
  for (const key of Object.keys(tutor)) {
    if (PHYSICAL_OVERRIDE_KEYS.has(key)) {
      throw new Error(`DA presentation cannot override physical rig ${key}`);
    }
  }
}

function getPortrait(tutor: CatalogueTutor) {
  const url = tutor.photo.trim() ? getPhotoUrl(tutor) : JENNY_FALLBACK_PORTRAIT;
  return { url, fallbackUrl: JENNY_FALLBACK_PORTRAIT };
}

function createCanvas(canvasDocument: Pick<Document, "createElement">, size: { width: number; height: number }) {
  const canvas = canvasDocument.createElement("canvas");
  canvas.width = size.width;
  canvas.height = size.height;
  return canvas;
}

function contextFor(canvas: HTMLCanvasElement) {
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Complete Shelf presentation canvas is unavailable");
  return context;
}

function notifyTextureUpdate(canvas: HTMLCanvasElement) {
  canvas.dispatchEvent(new Event(PRESENTATION_UPDATE_EVENT));
}

function drawRule(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement, colour: string) {
  context.strokeStyle = colour;
  context.lineWidth = Math.max(3, canvas.width * 0.003);
  context.strokeRect(canvas.width * 0.07, canvas.height * 0.055, canvas.width * 0.86, canvas.height * 0.89);
}

function drawWrappedText(context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number, maxLines: number) {
  const lines = wrapMeasuredText(context, text, maxWidth);
  lines.slice(0, maxLines).forEach((line, lineIndex) => context.fillText(line, x, y + lineIndex * lineHeight));
  return Math.min(lines.length, maxLines);
}

function wrapMeasuredText(context: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const words = text.trim().split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (context.measureText(next).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function drawFittedCanonicalText(
  context: CanvasRenderingContext2D,
  text: string,
  options: { x: number; firstBaseline: number; maxBaseline: number; maxWidth: number; initialFontSize: number; minimumFontSize: number },
) {
  for (let fontSize = options.initialFontSize; fontSize >= options.minimumFontSize; fontSize -= 1) {
    context.font = `${fontSize}px "Cormorant Garamond", serif`;
    const lineHeight = Math.round(fontSize * 1.42);
    const lines = wrapMeasuredText(context, text, options.maxWidth);
    const lastBaseline = options.firstBaseline + Math.max(0, lines.length - 1) * lineHeight;
    if (lastBaseline <= options.maxBaseline) {
      lines.forEach((line, lineIndex) => context.fillText(line, options.x, options.firstBaseline + lineIndex * lineHeight));
      return;
    }
  }
  throw new Error("Canonical tutor profile text cannot fit within the approved print-safe page at the legible font floor");
}

type PortraitFrame = { x: number; y: number; width: number; height: number; fit?: "cover" | "contain" };

function drawPortrait(
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  portrait: { url: string; fallbackUrl: string },
  colours: CompleteShelfPresentation["colours"],
  frame: PortraitFrame = { x: .145, y: .18, width: .71, height: .39, fit: "cover" },
) {
  if (typeof Image === "undefined") return;
  const image = new Image();
  image.decoding = "async";
  let triedFallback = false;
  const draw = () => {
    const x = canvas.width * frame.x;
    const y = canvas.height * frame.y;
    const width = canvas.width * frame.width;
    const height = canvas.height * frame.height;
    const scale = (frame.fit ?? "cover") === "contain"
      ? Math.min(width / image.naturalWidth, height / image.naturalHeight)
      : Math.max(width / image.naturalWidth, height / image.naturalHeight);
    const renderedWidth = image.naturalWidth * scale;
    const renderedHeight = image.naturalHeight * scale;
    context.save();
    context.beginPath();
    context.rect(x, y, width, height);
    context.clip();
    context.drawImage(image, x + (width - renderedWidth) / 2, y + (height - renderedHeight) / 2, renderedWidth, renderedHeight);
    context.restore();
    context.strokeStyle = colours.foil;
    context.lineWidth = Math.max(3, canvas.width * 0.003);
    context.strokeRect(x, y, width, height);
    notifyTextureUpdate(canvas);
  };
  image.onload = draw;
  image.onerror = () => {
    if (!triedFallback && portrait.url !== portrait.fallbackUrl) {
      triedFallback = true;
      image.src = portrait.fallbackUrl;
    }
  };
  image.src = portrait.url;
}

function traceIntegratedArch(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
  const radius = width / 2;
  const shoulder = y + radius;
  context.beginPath();
  context.moveTo(x, y + height);
  context.lineTo(x, shoulder);
  context.arc(x + radius, shoulder, radius, Math.PI, 0);
  context.lineTo(x + width, y + height);
  context.closePath();
}

function drawIntegratedArchPortrait(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, portrait: CompleteShelfPresentation["portrait"]) {
  if (typeof Image === "undefined") return;
  const image = new Image();
  image.decoding = "async";
  let triedFallback = false;
  const draw = () => {
    const width = canvas.width * .62;
    const height = canvas.height * .5;
    const x = (canvas.width - width) / 2;
    const y = canvas.height * .18;
    const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
    const renderedWidth = image.naturalWidth * scale;
    const renderedHeight = image.naturalHeight * scale;
    context.save(); traceIntegratedArch(context, x, y, width, height); context.clip();
    context.drawImage(image, x + (width - renderedWidth) / 2, y + (height - renderedHeight) / 2, renderedWidth, renderedHeight);
    context.restore();
    notifyTextureUpdate(canvas);
  };
  image.onload = draw;
  image.onerror = () => { if (!triedFallback && portrait.url !== portrait.fallbackUrl) { triedFallback = true; image.src = portrait.fallbackUrl; } };
  image.src = portrait.url;
}

function getCoverLabel(edition?: Pick<TutorBookEdition, "wallId"> | Pick<TutorBookEdition, "materialVariant">) {
  const labels: Record<string, string> = {
    primary: "PRIMARY",
    mathematics: "MATHEMATICS",
    english: "ENGLISH",
    "science-social": "SCIENCE & SOCIAL SCIENCE",
  };
  return edition && 'wallId' in edition ? (labels[edition.wallId] ?? "DA TUITION") : "DA TUITION";
}

function drawCrest(context: CanvasRenderingContext2D, x: number, y: number, size: number) {
  context.save();
  context.translate(x, y);
  context.beginPath();
  context.moveTo(0, -size * .52); context.lineTo(size * .43, -size * .3); context.lineTo(size * .34, size * .36); context.lineTo(0, size * .58); context.lineTo(-size * .34, size * .36); context.lineTo(-size * .43, -size * .3); context.closePath();
  context.stroke();
  context.font = `600 ${Math.round(size * .4)}px "Cormorant Garamond", serif`;
  context.textAlign = "center"; context.textBaseline = "middle";
  context.fillText("DA", 0, size * .03);
  context.restore();
}

function drawCover(canvas: HTMLCanvasElement, portrait: CompleteShelfPresentation["portrait"], colours: CompleteShelfPresentation["colours"]) {
  const context = contextFor(canvas);
  context.fillStyle = colours.cloth;
  context.fillRect(0, 0, canvas.width, canvas.height);
  const vignette = context.createLinearGradient(0, 0, canvas.width, canvas.height);
  vignette.addColorStop(0, "rgba(255,255,255,.055)"); vignette.addColorStop(.52, "rgba(255,255,255,0)"); vignette.addColorStop(1, "rgba(0,0,0,.14)");
  context.fillStyle = vignette; context.fillRect(0, 0, canvas.width, canvas.height);
  drawIntegratedArchPortrait(canvas, context, portrait);
}

function drawCoverFoil(canvas: HTMLCanvasElement, tutor: CatalogueTutor, colours: CompleteShelfPresentation["colours"], coverLabel: string) {
  const context = contextFor(canvas);
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = "#ffffff"; context.fillStyle = "#ffffff";
  context.lineWidth = Math.max(2, canvas.width * .0024);
  context.strokeRect(canvas.width * .07, canvas.height * .05, canvas.width * .86, canvas.height * .9);
  context.globalAlpha = .72; context.lineWidth = Math.max(1.5, canvas.width * .0015);
  context.strokeRect(canvas.width * .09, canvas.height * .07, canvas.width * .82, canvas.height * .86); context.globalAlpha = 1;
  drawCrest(context, canvas.width / 2, canvas.height * .125, canvas.width * .072);
  const width = canvas.width * .62; const height = canvas.height * .5; const x = (canvas.width - width) / 2; const y = canvas.height * .18;
  context.lineWidth = Math.max(3, canvas.width * .0034); traceIntegratedArch(context, x, y, width, height); context.stroke();
  context.globalAlpha = .66; context.lineWidth = Math.max(1.5, canvas.width * .0017); traceIntegratedArch(context, x - canvas.width * .018, y - canvas.width * .018, width + canvas.width * .036, height + canvas.width * .018); context.stroke(); context.globalAlpha = 1;
  context.fillStyle = colours.foil;
  context.textAlign = "center";
  context.font = `700 ${Math.round(canvas.width * .08)}px "Cormorant Garamond", serif`;
  drawWrappedText(context, tutor.name, canvas.width / 2, canvas.height * .75, canvas.width * .76, canvas.width * .078, 2);
  context.font = `700 ${Math.round(canvas.width * .027)}px Cabin, sans-serif`;
  context.fillText(coverLabel, canvas.width / 2, canvas.height * .858);
  context.globalAlpha = .72; context.fillRect(canvas.width * .25, canvas.height * .895, canvas.width * .5, Math.max(1.5, canvas.width * .0017)); context.globalAlpha = 1;
  context.font = `600 ${Math.round(canvas.width * .016)}px Cabin, sans-serif`; context.fillText("DA TUITION", canvas.width / 2, canvas.height * .925);
}

function drawSpine(canvas: HTMLCanvasElement, colours: CompleteShelfPresentation["colours"]) {
  const context = contextFor(canvas);
  context.fillStyle = colours.cloth; context.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSpineFoil(canvas: HTMLCanvasElement, tutor: CatalogueTutor, coverLabel: string) {
  const context = contextFor(canvas);
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = "#ffffff"; context.fillStyle = "#ffffff"; context.textAlign = "center"; context.textBaseline = "middle";
  context.lineWidth = 2.5; context.strokeRect(canvas.width * .13, canvas.height * .035, canvas.width * .74, canvas.height * .93);
  context.globalAlpha = .75; context.fillRect(canvas.width * .2, canvas.height * .12, canvas.width * .6, 2); context.fillRect(canvas.width * .2, canvas.height * .88, canvas.width * .6, 2); context.globalAlpha = 1;
  drawCrest(context, canvas.width / 2, canvas.height * .078, canvas.width * .18);
  context.save(); context.translate(canvas.width / 2, canvas.height / 2); context.rotate(Math.PI / 2);
  context.font = `600 ${Math.round(canvas.width * .18)}px "Cormorant Garamond", serif`; context.fillText(tutor.name.toUpperCase(), 0, 0, canvas.height * .7); context.restore();
  context.font = `700 ${Math.round(canvas.width * .05)}px Cabin, sans-serif`; context.fillText(coverLabel, canvas.width / 2, canvas.height * .92);
}

function drawBack(canvas: HTMLCanvasElement, tutor: CatalogueTutor, colours: CompleteShelfPresentation["colours"]) {
  const context = contextFor(canvas);
  context.fillStyle = colours.cloth;
  context.fillRect(0, 0, canvas.width, canvas.height);
  drawRule(context, canvas, colours.foil);
  context.fillStyle = "#ffffff";
  context.textAlign = "center";
  context.font = `italic ${Math.round(canvas.width * 0.047)}px "Cormorant Garamond", serif`;
  drawWrappedText(context, tutor.motto, canvas.width / 2, canvas.height * 0.43, canvas.width * 0.7, canvas.width * 0.066, 6);
  context.fillStyle = colours.foil;
  context.font = `600 ${Math.round(canvas.width * 0.03)}px Cabin, sans-serif`;
  context.fillText("DA TUITION", canvas.width / 2, canvas.height * 0.86);
}

function drawEndpaper(
  canvas: HTMLCanvasElement,
  tutor: CatalogueTutor,
  portrait: CompleteShelfPresentation["portrait"],
  colours: CompleteShelfPresentation["colours"],
  includePortrait: boolean,
) {
  const context = contextFor(canvas);
  context.fillStyle = colours.paper;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = colours.foil;
  context.globalAlpha = 0.32;
  context.lineWidth = Math.max(2, canvas.width * 0.002);
  for (let line = 0; line < 7; line += 1) {
    const inset = canvas.width * (0.08 + line * 0.04);
    context.strokeRect(inset, inset, canvas.width - inset * 2, canvas.height - inset * 2);
  }
  context.globalAlpha = 1;
  if (includePortrait) {
    drawPortrait(canvas, context, portrait, colours, { x: .14, y: .12, width: .72, height: .66, fit: "contain" });
    context.fillStyle = colours.ink;
    context.textAlign = "center";
    context.font = `600 ${Math.round(canvas.width * .052)}px "Cormorant Garamond", serif`;
    context.fillText(tutor.name, canvas.width / 2, canvas.height * .88);
  }
}

function drawInteriorHeader(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, page: TutorBookPage, colours: CompleteShelfPresentation["colours"]) {
  const marginX = canvas.width * .09;
  context.fillStyle = colours.ink;
  context.textAlign = "left";
  context.font = `600 ${Math.round(canvas.width * .027)}px Cabin, sans-serif`;
  context.fillText("DA TUITION / TUTOR PROFILE", marginX, canvas.height * .078);
  context.textAlign = "right";
  context.fillText(String(page.folio).padStart(2, "0"), canvas.width - marginX, canvas.height * .078);
  context.strokeStyle = colours.foil;
  context.lineWidth = Math.max(2, canvas.width * .0015);
  context.beginPath();
  context.moveTo(marginX, canvas.height * .1);
  context.lineTo(canvas.width - marginX, canvas.height * .1);
  context.stroke();
  context.textAlign = "left";
  context.fillStyle = colours.foil;
  context.font = `700 ${Math.round(canvas.width * .03)}px Cabin, sans-serif`;
  context.fillText(page.label.toUpperCase(), marginX, canvas.height * .15);
}

function drawTags(
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  tags: readonly string[],
  y: number,
  colours: CompleteShelfPresentation["colours"],
  lineGap = .072,
) {
  if (tags.length === 0) return;
  const marginX = canvas.width * .09;
  context.textAlign = "left";
  context.font = `600 ${Math.round(canvas.width * .032)}px Cabin, sans-serif`;
  tags.forEach((tag, index) => {
    const tagY = y + index * canvas.height * lineGap;
    context.fillStyle = colours.foil;
    context.fillRect(marginX, tagY - canvas.height * .027, canvas.width * .012, canvas.height * .012);
    context.fillStyle = colours.ink;
    context.fillText(tag, marginX + canvas.width * .035, tagY);
  });
}

function drawInterior(
  canvas: HTMLCanvasElement,
  page: TutorBookPage,
  portrait: CompleteShelfPresentation["portrait"],
  colours: CompleteShelfPresentation["colours"],
) {
  const context = contextFor(canvas);
  context.fillStyle = colours.paper;
  context.fillRect(0, 0, canvas.width, canvas.height);
  drawInteriorHeader(canvas, context, page, colours);
  const marginX = canvas.width * .09;
  const bodyWidth = canvas.width * .82;
  const [primary, ...rest] = page.sourceText;
  context.fillStyle = colours.ink;
  context.textAlign = "left";

  if (page.id === "identity") {
    const [name, designation, tagline, subjects, ...strengths] = page.sourceText;
    context.fillStyle = colours.foil;
    context.font = `700 ${Math.round(canvas.width * .03)}px Cabin, sans-serif`;
    context.fillText("MEET THE TUTOR", marginX, canvas.height * .25);
    context.fillStyle = colours.ink;
    context.font = `700 ${Math.round(canvas.width * .075)}px "Cormorant Garamond", serif`;
    const nameLines = drawWrappedText(context, name, marginX, canvas.height * .35, bodyWidth, canvas.height * .08, 2);
    context.fillStyle = colours.foil;
    context.font = `700 ${Math.round(canvas.width * .033)}px Cabin, sans-serif`;
    drawWrappedText(context, designation, marginX, canvas.height * (.43 + nameLines * .025), bodyWidth, canvas.height * .042, 2);
    context.fillStyle = colours.ink;
    context.font = `italic ${Math.round(canvas.width * .045)}px "Cormorant Garamond", serif`;
    drawWrappedText(context, tagline, marginX, canvas.height * .54, bodyWidth, canvas.height * .055, 3);
    context.fillStyle = colours.foil;
    context.font = `700 ${Math.round(canvas.width * .032)}px Cabin, sans-serif`;
    context.fillText("AT A GLANCE", marginX, canvas.height * .7);
    context.fillStyle = colours.ink;
    context.font = `500 ${Math.round(canvas.width * .037)}px Cabin, sans-serif`;
    drawWrappedText(context, subjects, marginX, canvas.height * .75, bodyWidth, canvas.height * .038, 2);
    drawTags(canvas, context, strengths, canvas.height * .84, colours, .035);
    return;
  }

  if (page.id === "approach") {
    context.font = `italic ${Math.round(canvas.width * .06)}px "Cormorant Garamond", serif`;
    drawWrappedText(context, primary, marginX, canvas.height * .27, bodyWidth, canvas.height * .071, 3);
    context.strokeStyle = colours.foil; context.lineWidth = Math.max(2, canvas.width * .0016); context.beginPath(); context.moveTo(marginX, canvas.height * .49); context.lineTo(canvas.width - marginX, canvas.height * .49); context.stroke();
    context.font = `700 ${Math.round(canvas.width * .029)}px Cabin, sans-serif`;
    rest.slice(0, 3).forEach((principle, index) => {
      const y = canvas.height * (.59 + index * .115);
      context.fillStyle = colours.foil; context.fillText(principle, marginX, y);
      context.fillStyle = colours.ink; context.font = `500 ${Math.round(canvas.width * .034)}px Cabin, sans-serif`;
      const detail = primary.length > 110 ? primary : `Their stated approach centres on ${principle.toLowerCase()}.`;
      drawWrappedText(context, detail, marginX, y + canvas.height * .04, bodyWidth, canvas.height * .03, 2);
      context.font = `700 ${Math.round(canvas.width * .029)}px Cabin, sans-serif`;
    });
    return;
  }

  if (page.id === "why-da") {
    const [credibility, subjects, ...remaining] = page.sourceText;
    const priorities = remaining.at(-1) ?? "";
    const strengths = remaining.slice(0, -1);
    context.font = `500 ${Math.round(canvas.width * .041)}px Cabin, sans-serif`;
    drawWrappedText(context, credibility, marginX, canvas.height * .27, bodyWidth, canvas.height * .051, 5);
    context.fillStyle = colours.foil; context.font = `700 ${Math.round(canvas.width * .03)}px Cabin, sans-serif`; context.fillText("ACADEMIC FOCUS", marginX, canvas.height * .61);
    context.fillStyle = colours.ink; context.font = `500 ${Math.round(canvas.width * .035)}px Cabin, sans-serif`; drawWrappedText(context, subjects, marginX, canvas.height * .66, bodyWidth, canvas.height * .04, 3);
    context.fillStyle = colours.foil; context.font = `700 ${Math.round(canvas.width * .03)}px Cabin, sans-serif`; context.fillText("TEACHING STRENGTHS", marginX, canvas.height * .82);
    drawTags(canvas, context, strengths, canvas.height * .85, colours, .03);
    if (priorities) {
      context.fillStyle = colours.foil; context.font = `700 ${Math.round(canvas.width * .026)}px Cabin, sans-serif`; context.fillText("WHAT THEY PRIORITISE", marginX, canvas.height * .91);
      context.fillStyle = colours.ink; context.font = `500 ${Math.round(canvas.width * .025)}px Cabin, sans-serif`; drawWrappedText(context, priorities, marginX, canvas.height * .945, bodyWidth, canvas.height * .027, 2);
    }
    return;
  }

  if (page.id === "goals") {
    context.font = `italic ${Math.round(canvas.width * .045)}px "Cormorant Garamond", serif`;
    drawWrappedText(context, primary, marginX, canvas.height * .25, bodyWidth, canvas.height * .052, 5);
    context.fillStyle = colours.foil; context.font = `700 ${Math.round(canvas.width * .03)}px Cabin, sans-serif`; context.fillText("GREAT FIT FOR STUDENTS WHO…", marginX, canvas.height * .6);
    context.font = `500 ${Math.round(canvas.width * .037)}px Cabin, sans-serif`;
    rest.slice(0, 3).forEach((strength, index) => {
      const y = canvas.height * (.68 + index * .075);
      context.fillStyle = colours.foil; context.fillRect(marginX, y - canvas.height * .024, canvas.width * .012, canvas.height * .012);
      context.fillStyle = colours.ink; context.fillText(strength, marginX + canvas.width * .035, y);
    });
    return;
  }

  if (page.id === "subjects") {
    context.font = `${Math.round(canvas.width * .032)}px "Cormorant Garamond", serif`;
    drawWrappedText(context, primary, marginX, canvas.height * .29, bodyWidth, canvas.height * .046, 8);
    drawTags(canvas, context, rest, canvas.height * .64, colours);
    return;
  }

  drawFittedCanonicalText(context, primary, {
    x: marginX,
    firstBaseline: canvas.height * .25,
    maxBaseline: rest.length > 0 ? canvas.height * .67 : canvas.height * .88,
    maxWidth: bodyWidth,
    initialFontSize: Math.round(canvas.width * .04),
    minimumFontSize: Math.round(canvas.width * .025),
  });
  drawTags(canvas, context, rest, canvas.height * .77, colours, .065);
}

function drawTransparentFoil(canvas: HTMLCanvasElement) {
  const context = contextFor(canvas);
  context.clearRect(0, 0, canvas.width, canvas.height);
}

export function selectCompleteShelfPresentationTutor(selection: string | null | undefined): CatalogueTutor {
  // Jenny is the sole approved Stage 3 presentation. Missing or hostile query
  // values fall back to that same canonical record deterministically.
  if (selection === "jenny" || selection === null || selection === undefined) return getJennyTutor();
  return getJennyTutor();
}

export function createCompleteShelfPresentation(tutor: CatalogueTutor, edition?: Pick<TutorBookEdition, "materialVariant"> | TutorBookEdition): CompleteShelfPresentation {
  assertPresentationOnlyInput(tutor);
  const portrait = getPortrait(tutor);
  const coverTheme = getTutorBookCoverTheme(edition?.materialVariant ?? 0);
  const coverLabel = getCoverLabel(edition);
  const colours = {
    cloth: coverTheme.cloth,
    foil: coverTheme.foil,
    accent: coverTheme.accent,
    paper: "#f2eadc",
    ink: "#1a314c",
    edge: "#e5d9c7",
  };

  return {
    tutorId: tutor.id,
    portrait,
    colours,
    canvasMetadata: CANVAS_METADATA,
    createCanvasSources(canvasDocument = document) {
      const cover = createCanvas(canvasDocument, CANVAS_METADATA.cover);
      const coverFoil = createCanvas(canvasDocument, CANVAS_METADATA.cover);
      const spine = createCanvas(canvasDocument, CANVAS_METADATA.spine);
      const spineFoil = createCanvas(canvasDocument, CANVAS_METADATA.spine);
      const back = createCanvas(canvasDocument, CANVAS_METADATA.back);
      const backFoil = createCanvas(canvasDocument, CANVAS_METADATA.back);
      const openingEndpaper = createCanvas(canvasDocument, CANVAS_METADATA.endpaper);
      const frontEndpaper = createCanvas(canvasDocument, CANVAS_METADATA.endpaper);
      const pages = createTutorBookPages(tutor);
      const interiors = pages.map(() => createCanvas(canvasDocument, CANVAS_METADATA.interiors));
      drawCover(cover, portrait, colours);
      drawCoverFoil(coverFoil, tutor, colours, coverLabel);
      drawSpine(spine, colours);
      drawSpineFoil(spineFoil, tutor, coverLabel);
      drawBack(back, tutor, colours);
      drawTransparentFoil(backFoil);
      drawEndpaper(openingEndpaper, tutor, portrait, colours, true);
      drawEndpaper(frontEndpaper, tutor, portrait, colours, false);
      interiors.forEach((canvas, pageNumber) => drawInterior(canvas, pages[pageNumber], portrait, colours));
      return { cover, coverFoil, spine, spineFoil, back, backFoil, openingEndpaper, frontEndpaper, interiors };
    },
    createInitialCanvasSources(canvasDocument = document) {
      const cover = createCanvas(canvasDocument, CANVAS_METADATA.cover);
      const coverFoil = createCanvas(canvasDocument, CANVAS_METADATA.cover);
      const spine = createCanvas(canvasDocument, CANVAS_METADATA.spine);
      const spineFoil = createCanvas(canvasDocument, CANVAS_METADATA.spine);
      const back = createCanvas(canvasDocument, CANVAS_METADATA.back);
      const backFoil = createCanvas(canvasDocument, CANVAS_METADATA.back);
      const openingEndpaper = createCanvas(canvasDocument, CANVAS_METADATA.endpaper);
      const frontEndpaper = createCanvas(canvasDocument, CANVAS_METADATA.endpaper);
      const pages = createTutorBookPages(tutor);
      const interiors = pages.map(() => createCanvas(canvasDocument, CANVAS_METADATA.interiors));
      const drawInteriorAt = (index: number) => {
        const canvas = interiors[index];
        const page = pages[index];
        if (!canvas || !page) return;
        drawInterior(canvas, page, portrait, colours);
        notifyTextureUpdate(canvas);
      };
      drawCover(cover, portrait, colours);
      drawCoverFoil(coverFoil, tutor, colours, coverLabel);
      drawSpine(spine, colours);
      drawSpineFoil(spineFoil, tutor, coverLabel);
      drawBack(back, tutor, colours);
      drawTransparentFoil(backFoil);
      drawEndpaper(openingEndpaper, tutor, portrait, colours, true);
      drawEndpaper(frontEndpaper, tutor, portrait, colours, false);
      drawInteriorAt(0);
      return { cover, coverFoil, spine, spineFoil, back, backFoil, openingEndpaper, frontEndpaper, interiors, drawInterior: drawInteriorAt };
    },
  };
}

export function createCompleteShelfPresentationForQuery(selection: string | null | undefined) {
  if (selection !== "jenny") return undefined;
  return createCompleteShelfPresentation(selectCompleteShelfPresentationTutor(selection));
}

export function getCompleteShelfPresentationQuery(search: string | URLSearchParams): CompleteShelfPresentationName | null {
  const params = typeof search === "string" ? new URLSearchParams(search) : search;
  return params.get("presentation") === "jenny" ? "jenny" : null;
}

export { PRESENTATION_UPDATE_EVENT };
