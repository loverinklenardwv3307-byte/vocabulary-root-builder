import { useCallback, useRef, useState } from 'react';
import { createAttempt } from '../game/quiz';
import type { GamePhase } from '../game/session';
import type { QuizAttempt } from '../game/types';

/**
 * Owns the lesson -> builder -> quiz position for one root. The attempt lives
 * in a ref so callbacks never read a stale copy, and in state so the quiz
 * re-renders when an answer is committed.
 */
export function useLearningSession(rootId: string, startInQuiz: boolean, attemptSeed: number) {
  const ordinalRef = useRef(attemptSeed);
  const [attempt, setAttempt] = useState<QuizAttempt | null>(() => {
    if (!startInQuiz) {
      return null;
    }
    const first = createAttempt(rootId, attemptSeed);
    ordinalRef.current = attemptSeed + 1;
    return first;
  });
  const [phase, setPhase] = useState<GamePhase>(startInQuiz ? 'quiz' : 'lesson');
  const attemptRef = useRef<QuizAttempt | null>(attempt);

  const startBuilder = useCallback(() => setPhase('builder'), []);
  const backToLesson = useCallback(() => setPhase('lesson'), []);

  const startQuiz = useCallback(() => {
    const next = createAttempt(rootId, ordinalRef.current);
    ordinalRef.current += 1;
    attemptRef.current = next;
    setAttempt(next);
    setPhase('quiz');
  }, [rootId]);

  /** One answer per question; repeated taps are ignored synchronously. */
  const commitAnswer = useCallback((questionIndex: number, optionIndex: number) => {
    const current = attemptRef.current;
    if (!current || current.answers[questionIndex] !== null) {
      return;
    }
    const answers = current.answers.slice();
    answers[questionIndex] = optionIndex;
    const next = { ...current, answers };
    attemptRef.current = next;
    setAttempt(next);
  }, []);

  return {
    phase,
    attempt,
    attemptRef,
    startBuilder,
    backToLesson,
    startQuiz,
    commitAnswer,
  };
}
