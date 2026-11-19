export type PartRole = 'prefix' | 'suffix';

export type Part = {
  id: string;
  role: PartRole;
  form: string;
  meaning: string;
  note?: string;
};

export type Word = {
  id: string;
  spelling: string;
  rootId: string;
  prefixId: string | null;
  suffixId: string | null;
  definition: string;
  example: string;
};

export type Root = {
  id: string;
  form: string;
  meaning: string;
  /** Table order: worked example, builder 1, builder 2, transfer 1, transfer 2. */
  wordIds: string[];
  workedExampleId: string;
  builderTargetIds: string[];
  transferIds: string[];
};

export type RootStatus = 'new' | 'learning' | 'mastered' | 'review';

export type RootProgress = {
  lessonCompleted: boolean;
  completedBuilderWordIds: string[];
  passDates: string[];
  masteredAt: string | null;
  lastScore: number | null;
};

export type Preferences = {
  dailyGoal: number;
  haptics: boolean;
  reduceMotion: boolean;
};

export type ProgressState = {
  schemaVersion: 1;
  roots: Record<string, RootProgress>;
  studiedPartIds: string[];
  discoveredWordIds: string[];
  /** local date key (YYYY-MM-DD) -> root ids credited that day */
  dailyRootCredits: Record<string, string[]>;
  preferences: Preferences;
};

export type QuizOption = {
  wordId: string;
  definition: string;
};

export type QuizQuestion = {
  wordId: string;
  spelling: string;
  decomposition: string;
  prompt: string;
  options: QuizOption[];
  correctIndex: number;
};

export type QuizAttempt = {
  id: string;
  rootId: string;
  ordinal: number;
  questions: QuizQuestion[];
  answers: (number | null)[];
};

export type AttemptResult = {
  attemptId: string;
  rootId: string;
  score: number;
  accuracy: number;
  passed: boolean;
  newlyMastered: boolean;
  alreadyMastered: boolean;
  firstPassSaved: boolean;
  creditedToday: boolean;
  todayCount: number;
  goal: number;
  masteredRootCount: number;
  review: { wordId: string; spelling: string; definition: string; correct: boolean }[];
};
