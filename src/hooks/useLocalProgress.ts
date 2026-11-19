import { useCallback, useMemo, useRef, useState } from 'react';
import { MASTERY_PASS_DATES, PASS_THRESHOLD } from '../constants/config';
import { getWord, partsForRoot } from '../game/curriculum';
import {
  createInitialState,
  masteredCount,
  quizUnlocked,
  rootProgressOf,
} from '../game/progress';
import { accuracyOf, scoreOf } from '../game/quiz';
import type { AttemptResult, Preferences, ProgressState, QuizAttempt } from '../game/types';
import { todayKey } from '../utils/localDates';

function withUnique(list: string[], values: string[]): string[] {
  const next = list.slice();
  values.forEach(value => {
    if (next.indexOf(value) < 0) {
      next.push(value);
    }
  });
  return next;
}

export type ProgressActions = {
  completeLesson: (rootId: string) => void;
  completeBuilderWord: (rootId: string, wordId: string) => void;
  revealWord: (wordId: string) => void;
  recordAttempt: (attempt: QuizAttempt) => AttemptResult;
  savePreferences: (next: Preferences) => void;
};

/**
 * Single owner of the learning record. App.tsx holds it and passes down the
 * narrow slices each screen needs, so no screen subscribes to everything.
 */
export function useLocalProgress() {
  const [state, setState] = useState<ProgressState>(createInitialState);
  const stateRef = useRef(state);
  stateRef.current = state;

  /** Attempt ids already folded into the record — result processing is idempotent. */
  const processedRef = useRef<string[]>([]);
  const resultRef = useRef<Record<string, AttemptResult>>({});

  const completeLesson = useCallback((rootId: string) => {
    setState(prev => {
      const progress = rootProgressOf(prev, rootId);
      const parts = partsForRoot(rootId);
      const partIds = parts.prefixes.concat(parts.suffixes).map(part => part.id);
      return {
        ...prev,
        roots: { ...prev.roots, [rootId]: { ...progress, lessonCompleted: true } },
        studiedPartIds: withUnique(prev.studiedPartIds, partIds),
      };
    });
  }, []);

  const revealWord = useCallback((wordId: string) => {
    setState(prev => ({ ...prev, discoveredWordIds: withUnique(prev.discoveredWordIds, [wordId]) }));
  }, []);

  const completeBuilderWord = useCallback((rootId: string, wordId: string) => {
    setState(prev => {
      const progress = rootProgressOf(prev, rootId);
      return {
        ...prev,
        roots: {
          ...prev.roots,
          [rootId]: {
            ...progress,
            completedBuilderWordIds: withUnique(progress.completedBuilderWordIds, [wordId]),
          },
        },
        discoveredWordIds: withUnique(prev.discoveredWordIds, [wordId]),
      };
    });
  }, []);

  const savePreferences = useCallback((next: Preferences) => {
    setState(prev => ({ ...prev, preferences: { ...next } }));
  }, []);

  /** Folds one finished attempt into the record and returns the result payload. */
  const recordAttempt = useCallback((attempt: QuizAttempt): AttemptResult => {
    const cached = resultRef.current[attempt.id];
    if (cached) {
      return cached;
    }

    const before = stateRef.current;
    const key = todayKey();
    const score = scoreOf(attempt);
    const passed = score >= PASS_THRESHOLD;
    const eligible = quizUnlocked(before, attempt.rootId);
    const progress = rootProgressOf(before, attempt.rootId);

    const alreadyMastered = !!progress.masteredAt;
    const passDates = progress.passDates.slice();
    let creditedToday = false;
    let newlyMastered = false;

    if (passed && eligible && passDates.indexOf(key) < 0) {
      passDates.push(key);
    }
    if (passed && eligible && !alreadyMastered && passDates.length >= MASTERY_PASS_DATES) {
      newlyMastered = true;
    }

    const credits = (before.dailyRootCredits[key] || []).slice();
    if (passed && eligible && credits.indexOf(attempt.rootId) < 0) {
      credits.push(attempt.rootId);
      creditedToday = true;
    }

    const discovered = withUnique(
      before.discoveredWordIds,
      attempt.questions.map(question => question.wordId),
    );

    const nextState: ProgressState = {
      ...before,
      roots: {
        ...before.roots,
        [attempt.rootId]: {
          ...progress,
          passDates,
          masteredAt: newlyMastered ? key : progress.masteredAt,
          lastScore: score,
        },
      },
      discoveredWordIds: discovered,
      dailyRootCredits: { ...before.dailyRootCredits, [key]: credits },
    };

    stateRef.current = nextState;
    processedRef.current = withUnique(processedRef.current, [attempt.id]);
    setState(nextState);

    const result: AttemptResult = {
      attemptId: attempt.id,
      rootId: attempt.rootId,
      score,
      accuracy: accuracyOf(score),
      passed,
      newlyMastered,
      alreadyMastered,
      firstPassSaved: passed && eligible && !alreadyMastered && !newlyMastered,
      creditedToday,
      todayCount: credits.length,
      goal: before.preferences.dailyGoal,
      masteredRootCount: masteredCount(nextState),
      review: attempt.questions.map((question, index) => {
        const word = getWord(question.wordId);
        return {
          wordId: word.id,
          spelling: word.spelling,
          definition: word.definition,
          correct: attempt.answers[index] === question.correctIndex,
        };
      }),
    };
    resultRef.current[attempt.id] = result;
    return result;
  }, []);

  const actions = useMemo<ProgressActions>(
    () => ({ completeLesson, completeBuilderWord, revealWord, recordAttempt, savePreferences }),
    [completeLesson, completeBuilderWord, revealWord, recordAttempt, savePreferences],
  );

  return { state, actions };
}
