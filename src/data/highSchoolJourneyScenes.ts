import { highSchoolJourneyAssets, type JourneyAsset } from './highSchoolJourneyAssets';

export type JourneySceneId = 'blue' | 'green' | 'purple' | 'orange';
export type JourneyDepth = 'farBackground' | 'background' | 'midground' | 'content' | 'foreground' | 'extremeForeground';

export interface JourneyLayer {
  id: string;
  depth: JourneyDepth;
  asset: JourneyAsset;
  x: number;
  y: number;
  scale: number;
  zDepth: number;
  opacity: number;
  blur?: number;
  rotation?: number;
  desktopOnly?: boolean;
}

export interface HighSchoolJourneyStage {
  number: `0${1 | 2 | 3 | 4}`;
  label: string;
  heading: string;
  insight: string;
  emphasis?: string;
  responseLead?: string;
  response: string;
  colour: string;
  sceneId: JourneySceneId;
}

export const highSchoolJourneyStages: readonly HighSchoolJourneyStage[] = [
  {
    number: '01',
    label: 'Knowledge',
    heading: 'The gaps get harder to hide.',
    insight: 'High school builds quickly.',
    emphasis: 'A small gap in Year 7 can become a much bigger problem by Year 9.',
    response: 'We identify what’s missing early, rebuild the foundations and make sure new learning has something solid to build on.',
    colour: '#3578C6',
    sceneId: 'blue',
  },
  {
    number: '02',
    label: 'Habits',
    heading: 'Habits become harder to change.',
    insight: 'Organisation. Study. Homework. Asking for help.',
    emphasis: 'The routines students build now often follow them into Years 11–12.',
    response: 'We don’t just help students finish this week’s work. We help them become organised, independent learners who can eventually manage without us.',
    colour: '#47775C',
    sceneId: 'green',
  },
  {
    number: '03',
    label: 'Direction',
    heading: 'Their options start taking shape.',
    insight: 'By Years 9–10, subject choices, academic foundations and confidence begin influencing what students can choose next.',
    response: 'Whether they’re rebuilding, aiming higher, preparing for Selective or Scholarship opportunities, or thinking ahead to the HSC, we help them keep the right doors open.',
    colour: '#7553B7',
    sceneId: 'purple',
  },
  {
    number: '04',
    label: 'Belief',
    heading: 'Confidence can disappear quietly.',
    insight: 'A student can look like they’re doing “okay” while slowly deciding that they’re simply not good at Maths, English or Science.',
    responseLead: 'We want to catch that moment before it becomes a belief.',
    response: 'The right explanation, the right tutor and the right level of challenge can change how a student sees themselves.',
    colour: '#CC642D',
    sceneId: 'orange',
  },
] as const;

const layer = (id: string, depth: JourneyDepth, asset: JourneyAsset, zDepth: number, overrides: Partial<Omit<JourneyLayer, 'id' | 'depth' | 'asset' | 'zDepth'>> = {}): JourneyLayer => ({
  id,
  depth,
  asset,
  x: 50,
  y: 50,
  scale: 1,
  zDepth,
  opacity: 1,
  ...overrides,
});

const worldLayers = (sceneId: JourneySceneId): JourneyLayer[] => {
  const assets = highSchoolJourneyAssets[sceneId];
  const foreground = sceneId === 'purple'
    ? highSchoolJourneyAssets.purple.foregroundStroke
    : sceneId === 'blue'
      ? highSchoolJourneyAssets.blue.foregroundEdge
      : sceneId === 'green'
        ? highSchoolJourneyAssets.green.foregroundEdge
        : highSchoolJourneyAssets.orange.foregroundEdge;
  return [
    layer(`${sceneId}-background-pigment`, 'farBackground', assets.backgroundPigment, -320, { opacity: 0.72, blur: 2 }),
    layer(`${sceneId}-large-wash`, 'background', assets.largeWash, -220, { scale: 1.12 }),
    layer(`${sceneId}-droplets`, 'foreground', assets.droplets, 150, { x: 46, scale: 1.08, rotation: -2 }),
    layer(`${sceneId}-foreground-paint`, 'extremeForeground', foreground, 360, { y: 58, scale: 1.3, blur: 0.4 }),
  ];
};

export const highSchoolJourneyScenes: Record<JourneySceneId, JourneyLayer[]> = {
  blue: worldLayers('blue'),
  green: worldLayers('green'),
  purple: worldLayers('purple'),
  orange: worldLayers('orange'),
};

export const highSchoolJourneyEntranceLayers: JourneyLayer[] = [
  layer('paper-texture', 'farBackground', highSchoolJourneyAssets.background.paperTexture, -420, { opacity: 0.32 }),
  layer('distant-mountains', 'background', highSchoolJourneyAssets.background.distantMountains, -300),
  layer('atmospheric-haze', 'midground', highSchoolJourneyAssets.background.haze, -130, { opacity: 0.86 }),
  layer('floating-objects', 'foreground', highSchoolJourneyAssets.objects.floatingComposite, 140),
  layer('desk-foreground', 'extremeForeground', highSchoolJourneyAssets.objects.entranceComposite, 380, { scale: 1.04 }),
];

export const highSchoolJourneyFloatingLayers: JourneyLayer[] = [
  layer('paper-plane', 'foreground', highSchoolJourneyAssets.plane.primary, 190, { x: 18, y: 66, scale: 0.7, rotation: 8 }),
  layer('stars', 'midground', highSchoolJourneyAssets.objects.stars, -10, { opacity: 0.78 }),
  layer('geometry-lines', 'background', highSchoolJourneyAssets.objects.geometry, -120, { x: 74, y: 36, opacity: 0.42, rotation: 6 }),
];
