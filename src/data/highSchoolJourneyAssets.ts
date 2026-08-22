export type JourneyAssetStatus = "ready" | "missing";

export interface JourneyAsset {
  src: string | null;
  status: JourneyAssetStatus;
  kind: "png" | "jpg" | "svg";
  alpha: boolean;
  note?: string;
}

const ready = (
  src: string,
  kind: JourneyAsset["kind"],
  alpha: boolean,
  note?: string,
): JourneyAsset => ({ src, status: "ready", kind, alpha, note });

const missing = (note: string): JourneyAsset => ({
  src: null,
  status: "missing",
  kind: "png",
  alpha: true,
  note,
});

export const highSchoolJourneyAssets = {
  background: {
    entrancePlate: ready(
      "/high-school-journey/entrance-calm-ai.png",
      "png",
      false,
      "Calm, wide watercolor desk-and-landscape entrance generated from the supplied reference.",
    ),
    paperTexture: ready(
      "/images/paper-texture.png",
      "png",
      false,
      "Reuse existing warm paper texture.",
    ),
    distantMountains: ready(
      "/images/programs/highschool-layer-1-mountains.png",
      "png",
      true,
      "Existing entrance composition; usable for the opening scene.",
    ),
    haze: ready(
      "/images/programs/highschool-layer-2-water-mist.png",
      "png",
      true,
      "Existing water and mist composite; entrance-only until separated artwork is supplied.",
    ),
  },
  blue: {
    largeWash: ready(
      "/high-school-journey/watercolour/blue-world-ai.png",
      "png",
      false,
      "Full-width blue mountain-and-river world plate generated from the storyboard.",
    ),
    foregroundEdge: ready(
      "/high-school-journey/watercolour/blue-foreground-ai.png",
      "png",
      true,
    ),
    droplets: ready(
      "/high-school-journey/watercolour/pigment-droplets-ai.png",
      "png",
      true,
    ),
    backgroundPigment: ready(
      "/high-school-journey/watercolour/blue-foreground-ai.png",
      "png",
      true,
    ),
  },
  green: {
    largeWash: ready(
      "/high-school-journey/watercolour/green-world-ai.png",
      "png",
      false,
      "Full-width green mountain-and-river world plate generated from the storyboard.",
    ),
    foregroundEdge: ready(
      "/high-school-journey/watercolour/green-foreground-ai.png",
      "png",
      true,
    ),
    droplets: ready(
      "/high-school-journey/watercolour/pigment-droplets-ai.png",
      "png",
      true,
    ),
    backgroundPigment: ready(
      "/high-school-journey/watercolour/green-foreground-ai.png",
      "png",
      true,
    ),
  },
  purple: {
    largeWash: ready(
      "/high-school-journey/watercolour/purple-world-ai.png",
      "png",
      false,
      "Full-width purple valley world plate generated from the storyboard.",
    ),
    foregroundStroke: ready(
      "/high-school-journey/watercolour/purple-foreground-ai.png",
      "png",
      true,
    ),
    droplets: ready(
      "/high-school-journey/watercolour/pigment-droplets-ai.png",
      "png",
      true,
    ),
    backgroundPigment: ready(
      "/high-school-journey/watercolour/purple-foreground-ai.png",
      "png",
      true,
    ),
  },
  orange: {
    largeWash: ready(
      "/high-school-journey/watercolour/orange-world-ai.png",
      "png",
      false,
      "Full-width warm orange valley world plate generated from the storyboard.",
    ),
    foregroundEdge: ready(
      "/high-school-journey/watercolour/orange-foreground-ai.png",
      "png",
      true,
    ),
    droplets: ready(
      "/high-school-journey/watercolour/pigment-droplets-ai.png",
      "png",
      true,
    ),
    backgroundPigment: ready(
      "/high-school-journey/watercolour/orange-foreground-ai.png",
      "png",
      true,
    ),
  },
  plane: {
    primary: ready("/high-school-journey/plane/paper-plane.svg", "svg", true),
    path: ready("/high-school-journey/plane/flight-path.svg", "svg", true),
    alternateAngle: missing(
      "Optional alternate paper-plane angle; only create if rotation cannot sell the turn.",
    ),
  },
  objects: {
    entranceComposite: ready(
      "/images/programs/highschool-layer-4-foreground.png",
      "png",
      true,
      "Existing desk, books, pencils and plant composite.",
    ),
    floatingComposite: ready(
      "/images/programs/highschool-layer-3-floating-objects.png",
      "png",
      true,
      "Existing floating-object composite.",
    ),
    stars: ready("/high-school-journey/objects/stars.svg", "svg", true),
    geometry: ready(
      "/high-school-journey/objects/geometry-lines.svg",
      "svg",
      true,
    ),
    books: ready("/high-school-journey/objects/books-ai.png", "png", true),
    pencilCup: ready(
      "/high-school-journey/objects/pencil-cup-ai.png",
      "png",
      true,
    ),
    plant: ready("/high-school-journey/objects/plant-ai.png", "png", true),
    pages: ready("/high-school-journey/objects/pages-ai.png", "png", true),
    graduationCap: ready(
      "/high-school-journey/objects/graduation-cap-ai.png",
      "png",
      true,
    ),
  },
  textures: {
    paperGrain: ready(
      "/images/paper-texture.png",
      "png",
      false,
      "Apply once as a low-opacity scene overlay.",
    ),
    watercolourEdge: missing(
      "Optional monochrome alpha mask for breaking up large wash edges.",
    ),
  },
  finale: {
    composite: ready(
      "/high-school-journey/finale/student-watercolour-composite.png",
      "png",
      false,
      "Supplied combined student and multicolour watercolour artwork.",
    ),
    year07Bubble: ready(
      "/high-school-journey/finale/year-07-blue-bubble-ai.png",
      "png",
      true,
    ),
    year08Bubble: ready(
      "/high-school-journey/finale/year-08-green-bubble-ai.png",
      "png",
      true,
    ),
    year09Bubble: ready(
      "/high-school-journey/finale/year-09-purple-bubble-ai.png",
      "png",
      true,
    ),
    year10Bubble: ready(
      "/high-school-journey/finale/year-10-orange-bubble-ai.png",
      "png",
      true,
    ),
    year07Icon: ready(
      "/high-school-journey/finale/year-07-paper-plane-ai.png",
      "png",
      true,
    ),
    year08Icon: ready(
      "/high-school-journey/finale/year-08-magnifying-glass-ai.png",
      "png",
      true,
    ),
    year09Icon: ready(
      "/high-school-journey/finale/year-09-star-ai.png",
      "png",
      true,
    ),
    year10Icon: ready(
      "/high-school-journey/finale/year-10-target-ai.png",
      "png",
      true,
    ),
    journeyArrow: ready(
      "/high-school-journey/finale/year-journey-arrow-ai.png",
      "png",
      true,
    ),
  },
} as const;

export type HighSchoolJourneyAssets = typeof highSchoolJourneyAssets;
