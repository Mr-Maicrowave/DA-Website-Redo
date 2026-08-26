export const finaleConfig = {
  compositeAsset:
    "/high-school-journey/finale/student-watercolour-composite.png",
  orangeWashAsset: "/high-school-journey/watercolour/orange-foreground-ai.png",
  timeline: {
    orangeHold: 100,
    anticipation: 105,
    firstBreak: 110,
    swipeStart: 113,
    swipeEnd: 128,
    heroHold: 136,
    moveLeft: 144,
    heading: 151,
    year7: 158,
    year8: 166,
    year9: 174,
    year10: 182,
    end: 190,
  },
  swipe: { desktop: 118, tablet: 108, mobile: 92 },
} as const;

export type FinaleLayerRegistrar = (
  part: string,
) => (node: HTMLElement | SVGElement | null) => void;
