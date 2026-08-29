import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve("public/assets/learning-formats");
const sources = {
  character: "/var/folders/gj/z74cxtfd16j6cq1z5br_8hlc0000gn/T/codex-clipboard-3e7a29f5-7254-4de6-9c61-f8ae522ef1e9.png",
  stages: "/var/folders/gj/z74cxtfd16j6cq1z5br_8hlc0000gn/T/codex-clipboard-1007a30c-e7b3-42d7-a312-210af3b5fe52.png",
  sharedLabelled: "/var/folders/gj/z74cxtfd16j6cq1z5br_8hlc0000gn/T/codex-clipboard-164bc394-c30a-4d67-9ca0-1fbc18c8bf57.png",
  shared: "/var/folders/gj/z74cxtfd16j6cq1z5br_8hlc0000gn/T/codex-clipboard-18839f47-106e-4665-b2b0-1a20c61f0816.png",
  hsc: "/var/folders/gj/z74cxtfd16j6cq1z5br_8hlc0000gn/T/codex-clipboard-918fc54d-1e39-4127-b48d-aafc460d3014.png",
};

const crops = [
  // Character sheet: six walking frames followed by five poses.
  ...[0, 1, 2, 3, 4, 5].map((i) => ({ src: "character", out: `character/walk-${i + 1}.png`, box: [i * 256, 0, i === 5 ? 255 : 256, 550] })),
  { src: "character", out: "character/idle-right.png", box: [85, 548, 220, 476] },
  { src: "character", out: "character/back.png", box: [342, 548, 235, 476] },
  { src: "character", out: "character/front.png", box: [620, 548, 220, 476] },
  { src: "character", out: "character/facing-left.png", box: [885, 548, 220, 476] },
  { src: "character", out: "character/thinking.png", box: [1170, 548, 340, 476] },

  // Shared environmental sheet.
  { src: "shared", out: "shared/junction-signpost-blank.png", box: [0, 0, 300, 475] },
  { src: "shared", out: "shared/bench.png", box: [300, 75, 480, 350] },
  { src: "shared", out: "shared/street-lamp.png", box: [750, 0, 260, 455] },
  { src: "shared", out: "shared/books.png", box: [930, 135, 300, 260] },
  { src: "shared", out: "shared/da-flag.png", box: [1210, 0, 325, 390] },
  { src: "shared", out: "shared/paper-plane.png", box: [350, 390, 310, 240] },
  { src: "shared", out: "shared/open-book.png", box: [620, 420, 360, 235] },
  { src: "shared", out: "shared/da-cup.png", box: [980, 395, 235, 300] },
  { src: "shared", out: "shared/backpack.png", box: [1210, 365, 326, 355] },
  { src: "shared", out: "shared/tree.png", box: [0, 395, 365, 470] },
  { src: "shared", out: "shared/books-stationery.png", box: [330, 625, 390, 245] },
  { src: "shared", out: "shared/flowers.png", box: [0, 850, 365, 174] },
  { src: "shared", out: "shared/shrub-flowers.png", box: [330, 845, 390, 179] },
  { src: "shared", out: "shared/stepping-stones.png", box: [0, 835, 390, 189] },
  { src: "shared", out: "shared/flower-sprig.png", box: [710, 650, 180, 374] },
  { src: "shared", out: "shared/leaves.png", box: [890, 705, 165, 319] },
  { src: "shared", out: "shared/butterfly.png", box: [1040, 715, 180, 250] },
  { src: "shared", out: "shared/cloud.png", box: [1200, 825, 335, 198] },

  // Labelled/alternate shared props.
  { src: "sharedLabelled", out: "shared/junction-signpost.png", box: [0, 0, 390, 600] },
  { src: "sharedLabelled", out: "shared/bench-with-clock.png", box: [390, 105, 470, 315] },
  { src: "sharedLabelled", out: "shared/street-lamp-glow.png", box: [875, 0, 290, 480] },
  { src: "sharedLabelled", out: "shared/da-flag-wide.png", box: [1170, 0, 365, 345] },
  { src: "sharedLabelled", out: "shared/keep-going-sign.png", box: [1190, 330, 345, 285] },
  { src: "sharedLabelled", out: "shared/next-stop-sign.png", box: [1080, 595, 330, 330] },
  { src: "sharedLabelled", out: "shared/tree-large.png", box: [0, 550, 390, 473] },
  { src: "sharedLabelled", out: "shared/books-small.png", box: [335, 390, 300, 230] },
  { src: "sharedLabelled", out: "shared/daisies.png", box: [635, 420, 260, 250] },
  { src: "sharedLabelled", out: "shared/rocks.png", box: [770, 650, 330, 185] },
  { src: "sharedLabelled", out: "shared/path-stone.png", box: [650, 820, 340, 203] },
  { src: "sharedLabelled", out: "shared/butterfly-trail.png", box: [1380, 600, 156, 310] },

  // Stage identity and scenery rows.
  { src: "stages", out: "primary/stage-label.png", box: [0, 75, 310, 285] },
  { src: "stages", out: "primary/school.png", box: [285, 70, 370, 315] },
  { src: "stages", out: "primary/books-stationery.png", box: [650, 90, 320, 280] },
  { src: "stages", out: "primary/paper-plane.png", box: [955, 80, 250, 275] },
  { src: "stages", out: "primary/plant.png", box: [1160, 80, 210, 290] },
  { src: "stages", out: "primary/backpack.png", box: [1330, 80, 205, 310] },
  { src: "stages", out: "high-school/stage-label.png", box: [0, 390, 300, 295] },
  { src: "stages", out: "high-school/locker-backpack.png", box: [285, 390, 340, 320] },
  { src: "stages", out: "high-school/desk-lamp-books.png", box: [605, 390, 270, 320] },
  { src: "stages", out: "high-school/geometry-set.png", box: [830, 390, 260, 310] },
  { src: "stages", out: "high-school/laptop-bottle.png", box: [1060, 390, 265, 310] },
  { src: "stages", out: "high-school/headphones.png", box: [1305, 390, 230, 310] },
  { src: "stages", out: "hsc/stage-label.png", box: [0, 690, 300, 333] },
  { src: "stages", out: "hsc/past-papers-cup.png", box: [285, 690, 300, 333] },
  { src: "stages", out: "hsc/exam-paper.png", box: [565, 690, 285, 333] },
  { src: "stages", out: "hsc/timer.png", box: [835, 690, 220, 333] },
  { src: "stages", out: "hsc/calculator-stationery.png", box: [1030, 690, 250, 333] },
  { src: "stages", out: "hsc/university-graduation.png", box: [1240, 675, 295, 348] },

  // Additional HSC study props.
  { src: "hsc", out: "hsc/hsc-books.png", box: [0, 0, 420, 380] },
  { src: "hsc", out: "hsc/da-cup.png", box: [390, 0, 220, 370] },
  { src: "hsc", out: "hsc/exam-work.png", box: [600, 0, 410, 400] },
  { src: "hsc", out: "hsc/timer-large.png", box: [980, 70, 270, 310] },
  { src: "hsc", out: "hsc/calculator.png", box: [1220, 40, 315, 340] },
  { src: "hsc", out: "hsc/progress-laptop.png", box: [0, 365, 455, 335] },
  { src: "hsc", out: "hsc/study-plan.png", box: [430, 380, 300, 320] },
  { src: "hsc", out: "hsc/stationery.png", box: [720, 395, 220, 300] },
  { src: "hsc", out: "hsc/headphones.png", box: [915, 380, 330, 315] },
  { src: "hsc", out: "hsc/encouragement-notes.png", box: [1240, 385, 296, 310] },
  { src: "hsc", out: "hsc/desk-lamp.png", box: [0, 690, 390, 333] },
  { src: "hsc", out: "hsc/graduation.png", box: [350, 700, 410, 323] },
  { src: "hsc", out: "hsc/university.png", box: [775, 690, 475, 333] },
  { src: "hsc", out: "hsc/plant-books.png", box: [1240, 680, 295, 343] },
];

await Promise.all(["character", "shared", "primary", "high-school", "hsc"].map((dir) => fs.mkdir(path.join(root, dir), { recursive: true })));

for (const { src, out, box: [left, top, width, height] } of crops) {
  const target = path.join(root, out);
  try {
    const extracted = await sharp(sources[src])
      .extract({ left, top, width, height })
      .png()
      .toBuffer();
    await sharp(extracted)
      .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ compressionLevel: 9, adaptiveFiltering: true })
      .toFile(target);
  } catch (error) {
    throw new Error(`Failed crop ${out} (${left},${top},${width},${height})`, { cause: error });
  }
}

console.log(`Created ${crops.length} lossless assets in ${root}`);
