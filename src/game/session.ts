export type GamePhase = 'lesson' | 'builder' | 'quiz';

export const PHASE_STEP: Record<GamePhase, string> = {
  lesson: '1 of 3',
  builder: '2 of 3',
  quiz: '3 of 3',
};

export const PHASE_TITLE: Record<GamePhase, string> = {
  lesson: 'Root Lesson',
  builder: 'Word Builder',
  quiz: 'Meaning Quiz',
};
