import {
  createCompleteShelfPresentationForQuery,
  getCompleteShelfPresentationQuery,
} from "./complete-shelf-presentation.ts";

export function selectCompleteShelfR3FBridgePresentation(search: string | URLSearchParams) {
  return createCompleteShelfPresentationForQuery(getCompleteShelfPresentationQuery(search));
}
