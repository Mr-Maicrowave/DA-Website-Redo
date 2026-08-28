export type ProgramId = 'private-tuition' | 'small-group' | 'classes' | 'creative-writing' | 'advanced-enrichment';

export const selectProgram = (currentId: ProgramId, nextId: ProgramId): ProgramId => (
  currentId === nextId ? currentId : nextId
);
