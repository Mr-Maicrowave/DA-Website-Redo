/**
 * Selected-branch state for the character journey.
 *
 * Deliberately separate from `useLearningFormatsState` for now — this
 * prototype only needs the coarse stage choice. Persisted so the branch
 * survives rerenders AND a refresh mid-session.
 */

import { useCallback, useEffect, useState } from "react";

import type { LearningStage } from "../logic/types";
import { STAGES } from "./journeyGeometry";

const STORAGE_KEY = "da-lf-selected-stage";

function readStage(): LearningStage | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw && (STAGES as string[]).includes(raw)
      ? (raw as LearningStage)
      : null;
  } catch {
    return null;
  }
}

export interface SelectedStageController {
  selectedStage: LearningStage | null;
  selectStage: (stage: LearningStage) => void;
  clearStage: () => void;
}

export function useSelectedStage(): SelectedStageController {
  const [selectedStage, setSelectedStage] = useState<LearningStage | null>(
    readStage,
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (selectedStage) {
        window.sessionStorage.setItem(STORAGE_KEY, selectedStage);
      } else {
        window.sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      /* private mode / quota — non-fatal */
    }
  }, [selectedStage]);

  const selectStage = useCallback(
    (stage: LearningStage) => setSelectedStage(stage),
    [],
  );
  const clearStage = useCallback(() => setSelectedStage(null), []);

  return { selectedStage, selectStage, clearStage };
}
