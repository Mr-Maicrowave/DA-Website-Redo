export type ProgramId = 'small-group' | 'private-tuition' | 'creative-writing';

export const selectProgram = (currentId: ProgramId, nextId: ProgramId): ProgramId => (
  currentId === nextId ? currentId : nextId
);
