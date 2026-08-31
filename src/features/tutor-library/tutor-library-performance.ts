import type { LibraryPhase } from './tutor-library-state';

export function shouldPreloadTutorLibrary(input: { introComplete: boolean; saveData: boolean }) {
  return !input.introComplete && !input.saveData;
}

export function isTutorLibraryRevealReady(input: { roomReady: boolean; assetsReady: boolean; sceneError: boolean }) {
  return input.sceneError || (input.roomReady && input.assetsReady);
}

export function getTutorLibraryRouteMountPolicy(introComplete: boolean) {
  return introComplete
    ? { mountIntro: false, mountLibrary: true } as const
    : { mountIntro: true, mountLibrary: false } as const;
}

export function shouldMountTutorLibraryWallBooks(
  wallIndex: number,
  fromWallIndex: number,
  toWallIndex: number,
  phase: LibraryPhase,
) {
  if (wallIndex === fromWallIndex) return true;
  return wallIndex === toWallIndex && (phase === 'ROOM_TURNING' || toWallIndex !== fromWallIndex);
}
