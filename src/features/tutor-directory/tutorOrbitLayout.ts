import { TUTORS } from '../../data/teacherCatalogue.ts';
import { toDiscoveryRecord, type TutorDiscoveryRecord } from './tutorDiscovery.ts';

export type TutorOrbitGroupId = 'mathematics' | 'english' | 'science';
export type TutorOrbitPlacementId = TutorOrbitGroupId | 'maths-english-bridge' | 'maths-science-bridge';

export interface TutorOrbitSlot {
  tutorId: string;
  placementId: TutorOrbitPlacementId;
  placementSlotIndex: number;
  isAnchor: boolean;
  x: number;
  y: number;
  size: number;
}

interface AuthoredSlot {
  tutorId: string;
  x: number;
  y: number;
  size?: number;
}

export const TUTOR_ORBIT_GROUPS = [
  { id: 'mathematics', label: 'Mathematics', anchorTutorId: 'T011' },
  { id: 'english', label: 'English', anchorTutorId: 'T005' },
  { id: 'science', label: 'Science', anchorTutorId: 'T010' },
] as const satisfies ReadonlyArray<{ id: TutorOrbitGroupId; label: string; anchorTutorId: string }>;

export const PRIMARY_PATHWAY_BOUNDS = { left: 23, right: 77, top: 74 } as const;

const AUTHORED_SLOTS: Record<TutorOrbitPlacementId, readonly AuthoredSlot[]> = {
  mathematics: [
    { tutorId: 'T011', x: 15, y: 42, size: 68 },
    { tutorId: 'T012', x: 8, y: 15 },
    { tutorId: 'T015', x: 15, y: 12 },
    { tutorId: 'T002', x: 22, y: 16 },
    { tutorId: 'T009', x: 6, y: 28 },
    { tutorId: 'T004', x: 13, y: 26 },
    { tutorId: 'T008', x: 21, y: 29 },
    { tutorId: 'T013', x: 6, y: 42 },
    { tutorId: 'T020', x: 23, y: 43 },
    { tutorId: 'T022', x: 6, y: 56 },
    { tutorId: 'T023', x: 13, y: 58 },
    { tutorId: 'T028', x: 22, y: 57 },
    { tutorId: 'T029', x: 7, y: 70 },
    { tutorId: 'T031', x: 15, y: 72 },
    { tutorId: 'T035', x: 23, y: 70 },
    { tutorId: 'T037', x: 6, y: 84 },
    { tutorId: 'T040', x: 13, y: 87 },
    { tutorId: 'T041', x: 19, y: 84 },
    { tutorId: 'T043', x: 28, y: 10 },
    { tutorId: 'T046', x: 18, y: 94 },
  ],
  english: [
    { tutorId: 'T005', x: 47, y: 14, size: 68 },
    { tutorId: 'T003', x: 34, y: 9 },
    { tutorId: 'T001', x: 38, y: 22 },
    { tutorId: 'T007', x: 42, y: 5.5 },
    { tutorId: 'T014', x: 53, y: 5.5 },
    { tutorId: 'T024', x: 56, y: 22 },
    { tutorId: 'T027', x: 61, y: 9 },
    { tutorId: 'T045', x: 65, y: 23 },
  ],
  science: [
    { tutorId: 'T010', x: 85, y: 38, size: 68 },
  ],
  'maths-english-bridge': [
    { tutorId: 'T006', x: 10, y: 33 },
    { tutorId: 'T017', x: 4, y: 49 },
    { tutorId: 'T021', x: 10, y: 65 },
    { tutorId: 'T025', x: 19, y: 77 },
    { tutorId: 'T026', x: 10, y: 81 },
    { tutorId: 'T030', x: 4, y: 93 },
    { tutorId: 'T033', x: 28, y: 17 },
    { tutorId: 'T036', x: 34, y: 25 },
    { tutorId: 'T038', x: 43, y: 25 },
    { tutorId: 'T042', x: 52, y: 25 },
    { tutorId: 'T044', x: 61, y: 17 },
  ],
  'maths-science-bridge': [
    { tutorId: 'T016', x: 25, y: 5 },
    { tutorId: 'T019', x: 67, y: 5 },
    { tutorId: 'T034', x: 79, y: 25 },
  ],
};

const ANCHOR_IDS = new Set<string>(TUTOR_ORBIT_GROUPS.map(group => group.anchorTutorId));

function expectedPlacement(record: TutorDiscoveryRecord): TutorOrbitPlacementId {
  if (record.tutor.primarySubject === 'both' && record.tutor.hasPrimary) return 'maths-english-bridge';
  if (record.tutor.primarySubject === 'science' && record.subjects.includes('maths')) return 'maths-science-bridge';
  if (record.tutor.primarySubject === 'math') return 'mathematics';
  if (record.tutor.primarySubject === 'both') return 'mathematics';
  return record.tutor.primarySubject;
}

export function createTutorOrbitLayout(records: readonly TutorDiscoveryRecord[]): TutorOrbitSlot[] {
  const recordsById = new Map(records.map(record => [record.tutor.id, record]));
  const authoredTutorIds = new Set<string>();
  const layout: TutorOrbitSlot[] = [];

  for (const [placementId, slots] of Object.entries(AUTHORED_SLOTS) as Array<[TutorOrbitPlacementId, readonly AuthoredSlot[]]>) {
    slots.forEach((slot, placementSlotIndex) => {
      const record = recordsById.get(slot.tutorId);
      if (!record) return;
      if (expectedPlacement(record) !== placementId) {
        throw new Error(`${slot.tutorId} is authored in ${placementId}, but catalogue data maps it to ${expectedPlacement(record)}`);
      }
      authoredTutorIds.add(slot.tutorId);
      layout.push({
        tutorId: slot.tutorId,
        placementId,
        placementSlotIndex,
        isAnchor: ANCHOR_IDS.has(slot.tutorId),
        x: slot.x,
        y: slot.y,
        size: slot.size ?? 42,
      });
    });
  }

  const missing = records.map(record => record.tutor.id).filter(id => !authoredTutorIds.has(id));
  if (missing.length > 0) throw new Error(`No authored orbit slot for ${missing.join(', ')}`);
  return layout;
}

export const TUTOR_ORBIT_SLOTS = createTutorOrbitLayout(TUTORS.map(toDiscoveryRecord));
