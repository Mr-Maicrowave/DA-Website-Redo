import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  type AcademicLevelAnswer,
  type AssessmentAnswers,
  type ConfidenceAnswer,
  type LearningHabitsAnswer,
  type MotivationAnswer,
  type GoalsAnswer,
  initialAssessmentAnswers,
  setAcademicLevel,
  setConfidence,
  setLearningHabits,
  setMotivation,
  setGoals,
} from "./assessmentTypes";
import {
  readJourneySession,
  writeJourneySession,
} from "./recommendationStorage";

interface AssessmentJourneyValue {
  answers: AssessmentAnswers;
  setAcademicLevelAnswer: (answer: AcademicLevelAnswer) => void;
  setConfidenceAnswer: (answer: ConfidenceAnswer) => void;
  setLearningHabitsAnswer: (answer: LearningHabitsAnswer) => void;
  setMotivationAnswer: (answer: MotivationAnswer) => void;
  setGoalsAnswer: (answer: GoalsAnswer) => void;
  resultRevealed: boolean;
  setResultRevealed: (revealed: boolean) => void;
}

const AssessmentJourneyContext = createContext<AssessmentJourneyValue | null>(null);

export const AssessmentJourneyProvider = ({ children }: { children: ReactNode }) => {
  const [initialSession] = useState(() =>
    typeof window === "undefined"
      ? null
      : readJourneySession(window.sessionStorage),
  );
  const [answers, setAnswers] = useState<AssessmentAnswers>(
    () => initialSession?.answers ?? initialAssessmentAnswers,
  );
  const [resultRevealed, setResultRevealed] = useState(
    () => initialSession?.revealed ?? false,
  );

  useEffect(() => {
    writeJourneySession(window.sessionStorage, answers, resultRevealed);
  }, [answers, resultRevealed]);

  const invalidateResult = useCallback(() => setResultRevealed(false), []);
  const setAcademicLevelAnswer = useCallback((answer: AcademicLevelAnswer) => {
    invalidateResult();
    setAnswers((current) => setAcademicLevel(current, answer));
  }, [invalidateResult]);
  const setConfidenceAnswer = useCallback((answer: ConfidenceAnswer) => {
    invalidateResult();
    setAnswers((current) => setConfidence(current, answer));
  }, [invalidateResult]);
  const setLearningHabitsAnswer = useCallback((answer: LearningHabitsAnswer) => {
    invalidateResult();
    setAnswers((current) => setLearningHabits(current, answer));
  }, [invalidateResult]);
  const setMotivationAnswer = useCallback((answer: MotivationAnswer) => {
    invalidateResult();
    setAnswers((current) => setMotivation(current, answer));
  }, [invalidateResult]);
  const setGoalsAnswer = useCallback((answer: GoalsAnswer) => {
    invalidateResult();
    setAnswers((current) => setGoals(current, answer));
  }, [invalidateResult]);
  const value = useMemo(
    () => ({
      answers,
      setAcademicLevelAnswer,
      setConfidenceAnswer,
      setLearningHabitsAnswer,
      setMotivationAnswer,
      setGoalsAnswer,
      resultRevealed,
      setResultRevealed,
    }),
    [
      answers,
      setAcademicLevelAnswer,
      setConfidenceAnswer,
      setLearningHabitsAnswer,
      setMotivationAnswer,
      setGoalsAnswer,
      resultRevealed,
    ],
  );

  return (
    <AssessmentJourneyContext.Provider value={value}>
      {children}
    </AssessmentJourneyContext.Provider>
  );
};

export const useAssessmentJourney = () => {
  const context = useContext(AssessmentJourneyContext);
  if (!context) {
    throw new Error("useAssessmentJourney must be used inside AssessmentJourneyProvider");
  }
  return context;
};
