import { methodItems, type MethodId } from './methodTransitionData.ts';

export const getInactiveMethods = (activeId: MethodId) =>
  methodItems.map(({ id }) => id).filter((id) => id !== activeId);

export function getAdjacentMethodId(activeId: MethodId, direction: -1 | 1): MethodId {
  const ids = methodItems.map(({ id }) => id);
  return ids[(ids.indexOf(activeId) + direction + ids.length) % ids.length];
}
