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
  eyebrow: string;
  heading: string;
  body: string;
  colour: string;
  sceneId: JourneySceneId;
}

export const highSchoolJourneyStages: readonly HighSchoolJourneyStage[] = [
  { number: '01', eyebrow: 'Why This Stage Is Critical', heading: 'The Curriculum Gets Serious', body: 'Year 7 introduces more complex ideas that build the foundations for future success.', colour: '#3578C6', sceneId: 'blue' },
  { number: '02', eyebrow: 'Why This Stage Is Critical', heading: 'Habits Form Now or Not at All', body: 'The habits developed in Years 7–8 shape how students handle pressure in Years 11–12.', colour: '#47775C', sceneId: 'green' },
  { number: '03', eyebrow: 'Why This Stage Is Critical', heading: 'Selective & Scholarship Pressure', body: 'Year 9–10 decisions can shape opportunities. We help students stay prepared and confident.', colour: '#7553B7', sceneId: 'purple' },
  { number: '04', eyebrow: 'Why This Stage Is Critical', heading: 'Confidence Decides Outcomes', body: 'When students believe in themselves, they’re willing to take on bigger challenges.', colour: '#CC642D', sceneId: 'orange' },
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
