import {
  primaryQuestionBank,
  type PrimaryQuestion,
  type PrimarySubject,
  type PrimaryYear,
  type QuestionDifficulty,
} from './primaryQuestionBank.ts';

const RECENT_KEY = 'primaryChallengeRecentlySeen';
const SESSION_DIFFICULTIES: QuestionDifficulty[] = [1, 2, 2, 3, 4, 5];

export type RecentQuestionStore = {
  read: () => string[];
  write: (ids: string[]) => void;
};

export const createLocalRecentQuestionStore = (): RecentQuestionStore => ({
  read: () => {
    try {
      const value = window.localStorage.getItem(RECENT_KEY);
      return value ? JSON.parse(value) : [];
    } catch {
      return [];
    }
  },
  write: (ids) => {
    try {
      window.localStorage.setItem(RECENT_KEY, JSON.stringify(ids.slice(-72)));
    } catch {
      // The challenge still works when storage is unavailable.
    }
  },
});

const shuffled = <T,>(items: readonly T[], random: () => number): T[] => {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
};

export const shuffleQuestionOptions = (question: PrimaryQuestion, random: () => number = Math.random): PrimaryQuestion => ({
  ...question,
  options: shuffled(question.options, random),
  followUp: { ...question.followUp, options: shuffled(question.followUp.options, random) },
});

type CreateChallengeOptions = {
  year: PrimaryYear;
  subject: PrimarySubject;
  random?: () => number;
  store?: RecentQuestionStore;
};

export const createChallenge = ({ year, subject, random = Math.random, store }: CreateChallengeOptions): PrimaryQuestion[] => {
  const recent = new Set(store?.read() ?? []);
  const bank = primaryQuestionBank[year][subject];
  const selected: PrimaryQuestion[] = [];

  for (const difficulty of SESSION_DIFFICULTIES) {
    const unusedTopics = new Set(selected.map((question) => question.topic));
    const candidates = bank.filter((question) =>
      question.difficulty === difficulty
      && !selected.some((selectedQuestion) => selectedQuestion.id === question.id),
    );
    const ranked = shuffled(candidates, random).sort((a, b) => {
      const aScore = (recent.has(a.id) ? 2 : 0) + (unusedTopics.has(a.topic) ? 1 : 0);
      const bScore = (recent.has(b.id) ? 2 : 0) + (unusedTopics.has(b.topic) ? 1 : 0);
      return aScore - bScore;
    });
    const next = ranked[0] ?? shuffled(bank.filter((question) => !selected.includes(question)), random)[0];
    if (next) selected.push(next);
  }

  const challenge = selected.map((question) => shuffleQuestionOptions(question, random));
  if (store) store.write([...(store.read() ?? []), ...challenge.map((question) => question.id)].slice(-72));
  return challenge;
};

export type LearningMode = 'question' | 'correct' | 'teaching' | 'follow-up' | 'follow-up-support' | 'ready-to-grow';
export type LearningState = {
  mode: LearningMode;
  selectedAnswer?: string;
  explanationStep: number;
  followUpAttempts: number;
  revealedAnswer?: string;
};

export const createInitialLearningState = (): LearningState => ({
  mode: 'question',
  explanationStep: 0,
  followUpAttempts: 0,
});

type LearningAction =
  | { type: 'answer'; answer: string; question: PrimaryQuestion }
  | { type: 'show-next-step'; question: PrimaryQuestion }
  | { type: 'begin-follow-up'; question: PrimaryQuestion }
  | { type: 'answer-follow-up'; answer: string; question: PrimaryQuestion };

export const reduceLearningState = (state: LearningState, action: LearningAction): LearningState => {
  if (action.type === 'answer') {
    return action.answer === action.question.correctAnswer
      ? { ...state, mode: 'correct', selectedAnswer: action.answer }
      : { ...state, mode: 'teaching', selectedAnswer: action.answer, explanationStep: 0 };
  }
  if (action.type === 'show-next-step') {
    return { ...state, explanationStep: Math.min(state.explanationStep + 1, action.question.explanation.steps.length - 1) };
  }
  if (action.type === 'begin-follow-up') {
    return { ...state, mode: 'follow-up', selectedAnswer: undefined };
  }
  const attempts = state.followUpAttempts + 1;
  if (action.answer === action.question.followUp.correctAnswer) {
    return { ...state, mode: 'ready-to-grow', selectedAnswer: action.answer, followUpAttempts: attempts };
  }
  if (attempts >= 2) {
    return { ...state, mode: 'ready-to-grow', selectedAnswer: action.answer, followUpAttempts: attempts, revealedAnswer: action.question.followUp.correctAnswer };
  }
  return { ...state, mode: 'follow-up-support', selectedAnswer: action.answer, followUpAttempts: attempts };
};
