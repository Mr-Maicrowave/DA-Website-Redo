export interface JourneyAssetManifest {
  character: { idle: string; walking: readonly string[] };
  path: readonly string[];
  flora: readonly string[];
  objects: readonly string[];
  trees: readonly string[];
  distance: readonly string[];
  classroom: readonly [string, string, string, string];
  results: Record<"private" | "smallGroup" | "classEnvironment", {
    src: string;
    webp: string;
    avif: string;
    width: number;
    height: number;
  }>;
}

export const walkingFrames = [
  "/learning-journey/character/walk-01.webp",
  "/learning-journey/character/walk-02.webp",
  "/learning-journey/character/walk-03.webp",
  "/learning-journey/character/walk-04.webp",
  "/learning-journey/character/walk-05.webp",
  "/learning-journey/character/walk-06.webp",
  "/learning-journey/character/walk-07.webp",
] as const;

export const journeyAssets: JourneyAssetManifest = {
  character: {
    idle: "/learning-journey/character/idle.webp",
    walking: walkingFrames,
  },
  path: [
    "/learning-journey/path/path-left.webp",
    "/learning-journey/path/path-stones.webp",
    "/learning-journey/path/path-right.webp",
  ],
  flora: [
    "/learning-journey/flora/wildflower-meadow.webp",
    "/learning-journey/flora/lavender-grass.webp",
    "/learning-journey/flora/rocks-and-flowers.webp",
  ],
  objects: [
    "/learning-journey/objects/signpost.webp",
    "/learning-journey/objects/books-and-daisy.webp",
    "/learning-journey/objects/open-book.webp",
  ],
  trees: [
    "/learning-journey/trees/oak-tree.webp",
    "/learning-journey/trees/daisy-tree.webp",
    "/learning-journey/trees/cypress-pair.webp",
  ],
  distance: ["/learning-journey/distance/academy-landscape.webp"],
  classroom: [
    "/learning-journey/classroom/seated-student.webp",
    "/learning-journey/classroom/bench.webp",
    "/learning-journey/classroom/lamp.webp",
    "/learning-journey/classroom/books.webp",
  ],
  results: {
    private: {
      src: "/learning-journey/results/private-learning-1536w.webp",
      webp: "/learning-journey/results/private-learning-768w.webp 768w, /learning-journey/results/private-learning-1536w.webp 1536w",
      avif: "/learning-journey/results/private-learning-768w.avif 768w, /learning-journey/results/private-learning-1536w.avif 1536w",
      width: 1536,
      height: 1024,
    },
    smallGroup: {
      src: "/learning-journey/results/small-group-learning-1536w.webp",
      webp: "/learning-journey/results/small-group-learning-768w.webp 768w, /learning-journey/results/small-group-learning-1536w.webp 1536w",
      avif: "/learning-journey/results/small-group-learning-768w.avif 768w, /learning-journey/results/small-group-learning-1536w.avif 1536w",
      width: 1536,
      height: 1024,
    },
    classEnvironment: {
      src: "/learning-journey/results/class-environment-1536w.webp",
      webp: "/learning-journey/results/class-environment-768w.webp 768w, /learning-journey/results/class-environment-1536w.webp 1536w",
      avif: "/learning-journey/results/class-environment-768w.avif 768w, /learning-journey/results/class-environment-1536w.avif 1536w",
      width: 1536,
      height: 1024,
    },
  },
};
