import { TUTORS } from '../../data/teacherCatalogue.ts';
import { toDiscoveryRecord, type TutorDiscoveryRecord } from './tutorDiscovery.ts';

export type TutorOrbitGroupId = 'mathematics' | 'english' | 'science' | 'foundations';

export interface TutorOrbitSlot {
  tutorId: string;
  groupId: TutorOrbitGroupId;
  groupSlotIndex: number;
  x: number;
  y: number;
  size: number;
}

interface AuthoredSlot {
  x: number;
  y: number;
  size: number;
}

export const TUTOR_ORBIT_GROUPS = [
  { id: 'mathematics', label: 'Mathematics' },
  { id: 'english', label: 'English' },
  { id: 'science', label: 'Science' },
  { id: 'foundations', label: 'Foundations' },
] as const satisfies ReadonlyArray<{ id: TutorOrbitGroupId; label: string }>;

const AUTHORED_SLOTS: Record<TutorOrbitGroupId, readonly AuthoredSlot[]> = {
  mathematics: [
    { x: 17, y: 20, size: 54 },
    { x: 22.9, y: 24.6, size: 54 },
    { x: 26.5, y: 36.6, size: 54 },
    { x: 26.5, y: 51.4, size: 54 },
    { x: 22.9, y: 63.4, size: 54 },
    { x: 17, y: 68, size: 54 },
    { x: 11.1, y: 63.4, size: 54 },
    { x: 7.5, y: 51.4, size: 54 },
    { x: 7.5, y: 36.6, size: 54 },
    { x: 11.1, y: 24.6, size: 54 },
  ],
  english: [
    { x: 31, y: 16, size: 56 },
    { x: 49, y: 9.9, size: 56 },
    { x: 49, y: 22.1, size: 56 },
  ],
  science: [
    { x: 63, y: 17, size: 56 },
    { x: 84, y: 10.9, size: 56 },
    { x: 84, y: 23.1, size: 56 },
  ],
  foundations: [
    { x: 5, y: 76, size: 46 },
    { x: 11.9, y: 76, size: 46 },
    { x: 18.8, y: 76, size: 46 },
    { x: 25.8, y: 76, size: 46 },
    { x: 32.7, y: 76, size: 46 },
    { x: 39.6, y: 76, size: 46 },
    { x: 46.5, y: 76, size: 46 },
    { x: 53.5, y: 76, size: 46 },
    { x: 60.4, y: 76, size: 46 },
    { x: 67.3, y: 76, size: 46 },
    { x: 74.2, y: 76, size: 46 },
    { x: 81.2, y: 76, size: 46 },
    { x: 88.1, y: 76, size: 46 },
    { x: 95, y: 76, size: 46 },
    { x: 8.5, y: 88.5, size: 46 },
    { x: 15.4, y: 88.5, size: 46 },
    { x: 22.3, y: 88.5, size: 46 },
    { x: 29.3, y: 88.5, size: 46 },
    { x: 36.2, y: 88.5, size: 46 },
    { x: 43.1, y: 88.5, size: 46 },
    { x: 50, y: 88.5, size: 46 },
    { x: 56.9, y: 88.5, size: 46 },
    { x: 63.8, y: 88.5, size: 46 },
    { x: 70.8, y: 88.5, size: 46 },
    { x: 77.7, y: 88.5, size: 46 },
    { x: 84.6, y: 88.5, size: 46 },
    { x: 91.5, y: 88.5, size: 46 },
  ],
};

export function getTutorOrbitGroup(record: TutorDiscoveryRecord): TutorOrbitGroupId {
  if (record.tutor.hasPrimary || record.tutor.primarySubject === 'both') return 'foundations';
  if (record.tutor.primarySubject === 'math') return 'mathematics';
  return record.tutor.primarySubject;
}

export function createTutorOrbitLayout(records: readonly TutorDiscoveryRecord[]): TutorOrbitSlot[] {
  const nextIndex: Record<TutorOrbitGroupId, number> = {
    mathematics: 0,
    english: 0,
    science: 0,
    foundations: 0,
  };

  return records.map(record => {
    const groupId = getTutorOrbitGroup(record);
    const groupSlotIndex = nextIndex[groupId];
    const authoredSlot = AUTHORED_SLOTS[groupId][groupSlotIndex];

    if (!authoredSlot) {
      throw new Error(`No authored ${groupId} orbit slot for ${record.tutor.id}`);
    }

    nextIndex[groupId] += 1;
    return {
      tutorId: record.tutor.id,
      groupId,
      groupSlotIndex,
      ...authoredSlot,
    };
  });
}

export const TUTOR_ORBIT_SLOTS = createTutorOrbitLayout(TUTORS.map(toDiscoveryRecord));
