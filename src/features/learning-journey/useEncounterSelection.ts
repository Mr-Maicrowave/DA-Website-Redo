import {
  type RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import gsap from "gsap";

import { type EncounterPhase } from "./assessmentTypes";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const CONFIRMATION_HOLD_MS = 800;

interface EncounterSelectionOptions<T extends string> {
  value: T | null;
  setValue: (value: T) => void;
  rootRef: RefObject<HTMLElement>;
  characterRef: RefObject<HTMLDivElement>;
  choiceSelector: (value: T) => string;
  onValueCommitted?: (value: T) => void;
  onFirstComplete?: () => void;
}

export const useEncounterSelection = <T extends string>({
  value,
  setValue,
  rootRef,
  characterRef,
  choiceSelector,
  onValueCommitted,
  onFirstComplete,
}: EncounterSelectionOptions<T>) => {
  const [phase, setPhase] = useState<EncounterPhase>(
    value === null ? "awaiting-answer" : "complete",
  );
  const valueRef = useRef(value);
  const generationRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useEffect(() => () => {
    generationRef.current += 1;
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    timelineRef.current?.kill();
  }, []);

  const select = useCallback((answer: T) => {
    const revising = valueRef.current !== null;
    valueRef.current = answer;
    generationRef.current += 1;
    const generation = generationRef.current;

    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    timelineRef.current?.kill();

    setValue(answer);
    onValueCommitted?.(answer);
    setPhase("confirming");

    const selected = rootRef.current?.querySelector<HTMLElement>(
      choiceSelector(answer),
    );
    if (selected && !window.matchMedia(REDUCED_MOTION_QUERY).matches) {
      const dot = selected.querySelector<HTMLElement>("[data-selection-dot]");
      const ripple = selected.querySelector<HTMLElement>("[data-selection-ripple]");

      timelineRef.current = gsap.timeline()
        .fromTo(
          dot,
          { autoAlpha: 0, y: -16, scale: 0.65 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.28, ease: "power4.out" },
        )
        .fromTo(
          ripple,
          { autoAlpha: 0.45, scale: 0.3 },
          { autoAlpha: 0, scale: 1.6, duration: 0.48, ease: "power3.out" },
          "<",
        )
        .to(
          characterRef.current,
          { rotation: -1.2, y: -2, duration: 0.2, yoyo: true, repeat: 1 },
          "<",
        );
    }

    timerRef.current = window.setTimeout(() => {
      if (generationRef.current !== generation) return;
      timerRef.current = null;
      setPhase("complete");
      if (!revising) onFirstComplete?.();
    }, CONFIRMATION_HOLD_MS);
  }, [
    characterRef,
    choiceSelector,
    onFirstComplete,
    onValueCommitted,
    rootRef,
    setValue,
  ]);

  return { phase, select };
};
