import type { CatalogueTutor } from '../../data/teacherCatalogue';
import { selectVisibleShelfEditions, type CompleteShelfBookPool } from './complete-shelf-book-pool';
import type { CompleteShelfTutorRig } from './CompleteShelfTutorBookBridge';
import type { TutorBookEdition } from './tutor-library-data';
import { TutorBook } from './TutorBook';
import { createSpotlightSearchPose } from './tutor-library-spotlight';
import { getFeaturedTutorColumnPose, getOrdinaryTutorShelfPose, selectCentredFaceOutTutorEditionIds } from './tutor-library-presentation';
import type { LibraryEvent, LibraryPhase } from './tutor-library-state';
import type { TutorBookPageTurnDirection } from './tutor-book-pages';

export function TutorShelf({ editions, spotlight = false, tutors, pool, rigIntentEditionId, rigIntentToken, onRigIntent, phase, generation, reducedMotion, pageTurnDirection, selectedEditionId, motionProgress, motionProgressRef, onActivate, onRigReady, onRigUnavailable, onLifecycleComplete, onPageSettled, onError }: { editions: readonly TutorBookEdition[]; spotlight?: boolean; tutors: ReadonlyMap<string, CatalogueTutor>; pool: CompleteShelfBookPool<CompleteShelfTutorRig>; rigIntentEditionId?: string; rigIntentToken: number; onRigIntent: (editionId?: string) => void; phase: LibraryPhase; generation: number; reducedMotion: boolean; pageTurnDirection: TutorBookPageTurnDirection; selectedEditionId?: string; motionProgress: number; motionProgressRef?: Readonly<{ current: { book: number } }>; onActivate: (editionId: string, rootUuid: string) => void; onRigReady: (editionId: string, rootUuid: string, token: number) => void; onRigUnavailable: (editionId: string, rootUuid: string) => void; onLifecycleComplete: (event: LibraryEvent) => void; onPageSettled: (settledPages: number) => void; onError: (message: string) => void }) {
  const visibleEditions = spotlight ? editions : selectVisibleShelfEditions(editions, selectedEditionId);
  const featuredEditionIds = [...selectCentredFaceOutTutorEditionIds(visibleEditions, tutors)];
  const featuredEditionIdSet = new Set(featuredEditionIds);
  const ordinaryEditionIds = visibleEditions.filter(edition => !featuredEditionIdSet.has(edition.id)).map(edition => edition.id);
  return <group name="tutor-shelf">{visibleEditions.map(edition => {
    const tutor = tutors.get(edition.tutorId);
    const featuredIndex = featuredEditionIds.indexOf(edition.id);
    const shelfPoseOverride = spotlight
      ? undefined
      : featuredIndex >= 0
        ? getFeaturedTutorColumnPose(featuredIndex, featuredEditionIds.length)
        : getOrdinaryTutorShelfPose(edition, ordinaryEditionIds.indexOf(edition.id));
    return tutor && (spotlight || shelfPoseOverride) ? <TutorBook key={edition.id} edition={edition} tutor={tutor} pool={pool} rigIntent={edition.id === rigIntentEditionId} rigIntentToken={rigIntentToken} onRigIntent={onRigIntent} phase={phase} generation={generation} reducedMotion={reducedMotion} pageTurnDirection={pageTurnDirection} selected={edition.id === selectedEditionId} motionProgress={motionProgress} motionProgressRef={motionProgressRef} spotlight={spotlight} faceOut={spotlight || featuredIndex >= 0} searchPose={spotlight ? createSpotlightSearchPose(edition, visibleEditions.indexOf(edition), visibleEditions.length) : undefined} shelfPoseOverride={shelfPoseOverride} onActivate={onActivate} onRigReady={onRigReady} onRigUnavailable={onRigUnavailable} onLifecycleComplete={onLifecycleComplete} onPageSettled={onPageSettled} onError={onError} /> : null;
  })}</group>;
}
