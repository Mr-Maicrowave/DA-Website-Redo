export type JourneyAsset = { src: string; alt: string };

const asset = (src: string, alt = ""): JourneyAsset => ({
  src: `/assets/learning-formats/${src}`,
  alt,
});

export const journeyAssets = {
  character: {
    walking: Array.from({ length: 6 }, (_, index) => asset(`character/walk-${index + 1}.png`)),
    idle: asset("character/idle-right.png"),
    front: asset("character/front.png"),
    back: asset("character/back.png"),
    facingLeft: asset("character/facing-left.png"),
    thinking: asset("character/thinking.png"),
  },
  shared: {
    junctionSignpost: asset("shared/junction-signpost.png"),
    junctionSignpostBlank: asset("shared/junction-signpost-blank.png"),
    bench: asset("shared/bench.png"),
    streetLamp: asset("shared/street-lamp.png"),
    streetLampGlow: asset("shared/street-lamp-glow.png"),
    daFlag: asset("shared/da-flag.png"),
    daFlagWide: asset("shared/da-flag-wide.png"),
    nextStopSign: asset("shared/next-stop-sign.png"),
    tree: asset("shared/tree.png"),
    books: asset("shared/books.png"),
    paperPlane: asset("shared/paper-plane.png"),
    flowers: asset("shared/flowers.png"),
    rocks: asset("shared/rocks.png"),
    shrubs: asset("shared/shrub-flowers.png"),
    steppingStones: asset("shared/stepping-stones.png"),
    backpack: asset("shared/backpack.png"),
    openBook: asset("shared/open-book.png"),
    daCup: asset("shared/da-cup.png"),
    stationery: asset("shared/books-stationery.png"),
    butterfly: asset("shared/butterfly.png"),
    cloud: asset("shared/cloud.png"),
  },
  primary: {
    stageLabel: asset("primary/stage-label.png"),
    school: asset("primary/school.png"),
    booksStationery: asset("primary/books-stationery.png"),
    paperPlane: asset("primary/paper-plane.png"),
    plant: asset("primary/plant.png"),
    backpack: asset("primary/backpack.png"),
  },
  highSchool: {
    stageLabel: asset("high-school/stage-label.png"),
    lockerBackpack: asset("high-school/locker-backpack.png"),
    deskLampBooks: asset("high-school/desk-lamp-books.png"),
    geometrySet: asset("high-school/geometry-set.png"),
    laptopBottle: asset("high-school/laptop-bottle.png"),
    headphones: asset("high-school/headphones.png"),
  },
  hsc: {
    stageLabel: asset("hsc/stage-label.png"),
    books: asset("hsc/hsc-books.png"),
    examPaper: asset("hsc/exam-paper.png"),
    examWork: asset("hsc/exam-work.png"),
    timer: asset("hsc/timer-large.png"),
    calculator: asset("hsc/calculator.png"),
    progressLaptop: asset("hsc/progress-laptop.png"),
    studyPlan: asset("hsc/study-plan.png"),
    stationery: asset("hsc/stationery.png"),
    headphones: asset("hsc/headphones.png"),
    deskLamp: asset("hsc/desk-lamp.png"),
    graduation: asset("hsc/graduation.png"),
    university: asset("hsc/university.png"),
    plantBooks: asset("hsc/plant-books.png"),
  },
} as const;

export const FALLBACK_JOURNEY_ASSET = journeyAssets.shared.books;
