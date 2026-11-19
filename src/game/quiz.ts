import { QUIZ_LENGTH } from '../constants/config';
import { decompose, getRoot, getWord, rootIndex } from './curriculum';
import type { QuizAttempt, QuizOption, QuizQuestion } from './types';

/**
 * Question order is transfer-first: transfer 1, builder 1, builder 2,
 * transfer 2, worked example.
 */
function questionOrder(rootId: string): string[] {
  const root = getRoot(rootId);
  return [
    root.transferIds[0],
    root.builderTargetIds[0],
    root.builderTargetIds[1],
    root.transferIds[1],
    root.workedExampleId,
  ];
}

/**
 * Distractors are the next three definitions taken cyclically from the root's
 * own table order, so every option belongs to the same lesson.
 */
function buildQuestion(rootId: string, wordId: string, questionIndex: number, ordinal: number): QuizQuestion {
  const root = getRoot(rootId);
  const word = getWord(wordId);
  const sourceIndex = root.wordIds.indexOf(wordId);

  const distractors: QuizOption[] = [];
  for (let step = 1; step <= 3; step += 1) {
    const candidate = getWord(root.wordIds[(sourceIndex + step) % root.wordIds.length]);
    distractors.push({ wordId: candidate.id, definition: candidate.definition });
  }

  const correctIndex = (rootIndex(rootId) + questionIndex + ordinal) % 4;
  const options: QuizOption[] = [];
  let fill = 0;
  for (let position = 0; position < 4; position += 1) {
    if (position === correctIndex) {
      options.push({ wordId: word.id, definition: word.definition });
    } else {
      options.push(distractors[fill]);
      fill += 1;
    }
  }

  return {
    wordId: word.id,
    spelling: word.spelling,
    decomposition: decompose(word.id),
    prompt: 'What does ' + word.spelling + ' mean?',
    options,
    correctIndex,
  };
}

export function createAttempt(rootId: string, ordinal: number): QuizAttempt {
  const order = questionOrder(rootId);
  const questions = order.map((wordId, index) => buildQuestion(rootId, wordId, index, ordinal));
  return {
    id: rootId + '-' + ordinal + '-' + Date.now(),
    rootId,
    ordinal,
    questions,
    answers: questions.map(() => null),
  };
}

export function scoreOf(attempt: QuizAttempt): number {
  let score = 0;
  attempt.questions.forEach((question, index) => {
    if (attempt.answers[index] === question.correctIndex) {
      score += 1;
    }
  });
  return score;
}

export function accuracyOf(score: number): number {
  return Math.round((100 * score) / QUIZ_LENGTH);
}

export function firstUnanswered(attempt: QuizAttempt): number {
  const index = attempt.answers.findIndex(answer => answer === null);
  return index < 0 ? attempt.questions.length - 1 : index;
}
