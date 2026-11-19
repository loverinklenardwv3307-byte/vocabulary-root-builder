import React, { useCallback } from 'react';
import { AppShell } from '../components/AppShell';
import type { AttemptResult, QuizAttempt } from '../game/types';
import { useLearningSession } from '../hooks/useLearningSession';
import { QuizScreen } from './QuizScreen';
import { RootLessonScreen } from './RootLessonScreen';
import { WordBuilderScreen } from './WordBuilderScreen';

type Props = {
  rootId: string;
  lessonSaved: boolean;
  quizUnlocked: boolean;
  onLessonComplete: (rootId: string) => void;
  onWordComplete: (rootId: string, wordId: string) => void;
  onGameOver: (result: AttemptResult) => void;
  recordAttempt: (attempt: QuizAttempt) => AttemptResult;
  startInQuiz: boolean;
  attemptSeed: number;
  onExit: () => void;
};

/**
 * Flow host for the lesson -> builder -> quiz phases. It owns no learning
 * rules of its own; it only routes between the three phase screens.
 */
export function GameScreen({
  rootId,
  lessonSaved,
  quizUnlocked,
  onLessonComplete,
  onWordComplete,
  onGameOver,
  recordAttempt,
  startInQuiz,
  attemptSeed,
  onExit,
}: Props) {
  const session = useLearningSession(rootId, startInQuiz, attemptSeed);
  const { attempt, attemptRef, backToLesson, commitAnswer, phase, startBuilder, startQuiz } =
    session;

  const buildWords = useCallback(() => {
    onLessonComplete(rootId);
    startBuilder();
  }, [onLessonComplete, rootId, startBuilder]);

  const completeWord = useCallback(
    (wordId: string) => onWordComplete(rootId, wordId),
    [onWordComplete, rootId],
  );

  const finishQuiz = useCallback(() => {
    const current = attemptRef.current;
    if (!current) {
      return;
    }
    onGameOver(recordAttempt(current));
  }, [attemptRef, onGameOver, recordAttempt]);

  if (phase === 'quiz' && attempt) {
    return (
      <AppShell variant="quiz">
        <QuizScreen
          attempt={attempt}
          onCommitAnswer={commitAnswer}
          onFinish={finishQuiz}
          onLeave={onExit}
        />
      </AppShell>
    );
  }

  if (phase === 'builder') {
    return (
      <AppShell variant="builder">
        <WordBuilderScreen
          rootId={rootId}
          onBack={backToLesson}
          onWordComplete={completeWord}
          onStartQuiz={startQuiz}
        />
      </AppShell>
    );
  }

  return (
    <AppShell variant="lesson">
      <RootLessonScreen
        rootId={rootId}
        lessonSaved={lessonSaved}
        quizUnlocked={quizUnlocked}
        onBack={onExit}
        onBuildWords={buildWords}
        onGoToQuiz={startQuiz}
      />
    </AppShell>
  );
}
