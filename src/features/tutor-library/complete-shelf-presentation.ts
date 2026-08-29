import { getPhotoUrl, TUTORS, type CatalogueTutor } from "../../data/teacherCatalogue.ts";

export const COMPLETE_SHELF_PRESENTATION_NAMES = ["jenny"] as const;
export type CompleteShelfPresentationName = typeof COMPLETE_SHELF_PRESENTATION_NAMES[number];

const CANVAS_METADATA = {
  cover: { width: 1536, height: 2304 },
  spine: { width: 512, height: 2304 },
  back: { width: 1536, height: 2304 },
  endpaper: { width: 1024, height: 1536 },
  interiors: { count: 8, width: 1024, height: 1536 },
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
  endpaper: HTMLCanvasElement;
  interiors: HTMLCanvasElement[];
}

export interface CompleteShelfPresentation {
  tutorId: string;
  portrait: { url: string; fallbackUrl: string };
  colours: { cloth: string; foil: string; paper: string; ink: string; edge: string };
  canvasMetadata: typeof CANVAS_METADATA;
  createCanvasSources(canvasDocument?: Pick<Document, "createElement">): CompleteShelfPresentationCanvasSources;
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
  const words = text.split(/\s+/);
  let line = "";
  let lineIndex = 0;
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (context.measureText(next).width > maxWidth && line) {
      context.fillText(line, x, y + lineIndex * lineHeight);
      line = word;
      lineIndex += 1;
      if (lineIndex >= maxLines) return;
    } else {
      line = next;
    }
  }
  if (line && lineIndex < maxLines) context.fillText(line, x, y + lineIndex * lineHeight);
}

function drawPortrait(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, portrait: { url: string; fallbackUrl: string }, colours: CompleteShelfPresentation["colours"]) {
  if (typeof Image === "undefined") return;
  const image = new Image();
  image.decoding = "async";
  let triedFallback = false;
  const draw = () => {
    const x = canvas.width * 0.145;
    const y = canvas.height * 0.18;
    const width = canvas.width * 0.71;
    const height = canvas.height * 0.39;
    const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
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

function drawCover(canvas: HTMLCanvasElement, tutor: CatalogueTutor, portrait: CompleteShelfPresentation["portrait"], colours: CompleteShelfPresentation["colours"]) {
  const context = contextFor(canvas);
  context.fillStyle = colours.cloth;
  context.fillRect(0, 0, canvas.width, canvas.height);
  drawRule(context, canvas, colours.foil);
  context.fillStyle = colours.foil;
  context.textAlign = "center";
  context.font = `600 ${Math.round(canvas.width * 0.04)}px Arial, sans-serif`;
  context.fillText("DA TUITION", canvas.width / 2, canvas.height * 0.105);
  drawPortrait(canvas, context, portrait, colours);
  context.fillStyle = "#ffffff";
  context.font = `600 ${Math.round(canvas.width * 0.074)}px Georgia, serif`;
  drawWrappedText(context, tutor.name.replace(/^(Mr|Ms|Mrs)\s+/i, ""), canvas.width / 2, canvas.height * 0.68, canvas.width * 0.78, canvas.width * 0.087, 2);
  context.fillStyle = colours.foil;
  context.font = `600 ${Math.round(canvas.width * 0.027)}px Arial, sans-serif`;
  drawWrappedText(context, tutor.designation.toUpperCase(), canvas.width / 2, canvas.height * 0.84, canvas.width * 0.72, canvas.width * 0.04, 2);
}

function drawSpine(canvas: HTMLCanvasElement, tutor: CatalogueTutor, colours: CompleteShelfPresentation["colours"]) {
  const context = contextFor(canvas);
  context.fillStyle = colours.cloth;
  context.fillRect(0, 0, canvas.width, canvas.height);
  drawRule(context, canvas, colours.foil);
  context.fillStyle = colours.foil;
  context.textAlign = "center";
  context.save();
  context.translate(canvas.width / 2, canvas.height / 2);
  context.rotate(Math.PI / 2);
  context.font = `600 ${Math.round(canvas.width * 0.12)}px Georgia, serif`;
  context.fillText(tutor.name.replace(/^(Mr|Ms|Mrs)\s+/i, ""), 0, 0, canvas.height * 0.78);
  context.restore();
  context.font = `600 ${Math.round(canvas.width * 0.075)}px Arial, sans-serif`;
  context.fillText("DA TUITION", canvas.width / 2, canvas.height * 0.1);
}

function drawBack(canvas: HTMLCanvasElement, tutor: CatalogueTutor, colours: CompleteShelfPresentation["colours"]) {
  const context = contextFor(canvas);
  context.fillStyle = colours.cloth;
  context.fillRect(0, 0, canvas.width, canvas.height);
  drawRule(context, canvas, colours.foil);
  context.fillStyle = "#ffffff";
  context.textAlign = "center";
  context.font = `italic ${Math.round(canvas.width * 0.047)}px Georgia, serif`;
  drawWrappedText(context, tutor.motto, canvas.width / 2, canvas.height * 0.43, canvas.width * 0.7, canvas.width * 0.066, 6);
  context.fillStyle = colours.foil;
  context.font = `600 ${Math.round(canvas.width * 0.03)}px Arial, sans-serif`;
  context.fillText("DA TUITION", canvas.width / 2, canvas.height * 0.86);
}

function drawEndpaper(canvas: HTMLCanvasElement, tutor: CatalogueTutor, colours: CompleteShelfPresentation["colours"]) {
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
  context.fillStyle = colours.ink;
  context.textAlign = "center";
  context.font = `600 ${Math.round(canvas.width * 0.045)}px Arial, sans-serif`;
  context.fillText(tutor.name, canvas.width / 2, canvas.height * 0.5);
}

function drawInterior(canvas: HTMLCanvasElement, tutor: CatalogueTutor, pageNumber: number, colours: CompleteShelfPresentation["colours"]) {
  const context = contextFor(canvas);
  context.fillStyle = colours.paper;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = colours.ink;
  context.textAlign = "left";
  context.font = `600 ${Math.round(canvas.width * 0.026)}px Arial, sans-serif`;
  context.fillText("DA TUITION / TUTOR PROFILE", canvas.width * 0.09, canvas.height * 0.09);
  context.textAlign = "right";
  context.fillText(String(pageNumber + 1).padStart(2, "0"), canvas.width * 0.91, canvas.height * 0.09);
  context.strokeStyle = colours.foil;
  context.lineWidth = Math.max(2, canvas.width * 0.002);
  context.beginPath();
  context.moveTo(canvas.width * 0.09, canvas.height * 0.12);
  context.lineTo(canvas.width * 0.91, canvas.height * 0.12);
  context.stroke();
  context.textAlign = "left";
  context.font = `600 ${Math.round(canvas.width * 0.06)}px Georgia, serif`;
  drawWrappedText(context, pageNumber === 0 ? tutor.name : tutor.designation, canvas.width * 0.09, canvas.height * 0.26, canvas.width * 0.8, canvas.width * 0.075, 3);
  context.font = `${Math.round(canvas.width * 0.032)}px Georgia, serif`;
  drawWrappedText(context, pageNumber % 2 === 0 ? tutor.tagline : tutor.motto, canvas.width * 0.09, canvas.height * 0.52, canvas.width * 0.8, canvas.width * 0.046, 6);
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

export function createCompleteShelfPresentation(tutor: CatalogueTutor): CompleteShelfPresentation {
  assertPresentationOnlyInput(tutor);
  const portrait = getPortrait(tutor);
  const colours = {
    cloth: "#1b3858",
    foil: "#d5b369",
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
      const endpaper = createCanvas(canvasDocument, CANVAS_METADATA.endpaper);
      const interiors = Array.from({ length: CANVAS_METADATA.interiors.count }, (_, pageNumber) => createCanvas(canvasDocument, CANVAS_METADATA.interiors));
      drawCover(cover, tutor, portrait, colours);
      drawTransparentFoil(coverFoil);
      drawSpine(spine, tutor, colours);
      drawTransparentFoil(spineFoil);
      drawBack(back, tutor, colours);
      drawTransparentFoil(backFoil);
      drawEndpaper(endpaper, tutor, colours);
      interiors.forEach((canvas, pageNumber) => drawInterior(canvas, tutor, pageNumber, colours));
      return { cover, coverFoil, spine, spineFoil, back, backFoil, endpaper, interiors };
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
