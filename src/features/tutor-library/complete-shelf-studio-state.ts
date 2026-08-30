import { getCompleteShelfPresentationQuery } from "./complete-shelf-presentation.ts";
import type { CompleteShelfBookState } from "./CompleteShelfTutorBook.tsx";
import type { CompleteShelfRigController } from "./complete-shelf-r3f-state.ts";

export function getCompleteShelfStudioEngine(search: string, engineState: CompleteShelfBookState | undefined) {
  return engineState && getCompleteShelfPresentationQuery(search) === "jenny" ? "imperative" : "legacy";
}

export function applyCompleteShelfStudioState(controller: CompleteShelfRigController, state: CompleteShelfBookState) {
  controller.reset();
  if (state === "half-open") controller.setOpenProgress(0.5);
  if (state === "open") controller.setOpenProgress(1);
  if (state === "page-turn-25") { controller.setOpenProgress(1); controller.setPageTurnProgress(0.25); }
  if (state === "page-turning") { controller.setOpenProgress(1); controller.setPageTurnProgress(0.5); }
  if (state === "page-turn-75") { controller.setOpenProgress(1); controller.setPageTurnProgress(0.75); }
  if (state === "page-settled") { controller.setOpenProgress(1); controller.settlePage(); }
  controller.update(0);
}
