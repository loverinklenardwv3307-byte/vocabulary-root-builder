import { DAILY_GOAL_DEFAULT, REVIEW_INTERVAL_DAYS } from '../constants/config';
import { daysBetween, todayKey } from '../utils/localDates';
import { ROOTS, getRoot } from './curriculum';
import type { ProgressState, RootProgress, RootStatus } from './types';

export const EMPTY_ROOT_PROGRESS: RootProgress = {
  lessonCompleted: false,
  completedBuilderWordIds: [],
  passDates: [],
  masteredAt: null,
  lastScore: null,
};

export function createInitialState(): ProgressState {
  const roots: Record<string, RootProgress> = {};
  ROOTS.forEach(root => {
    roots[root.id] = { ...EMPTY_ROOT_PROGRESS, completedBuilderWordIds: [], passDates: [] };
  });
  return {
    schemaVersion: 1,
    roots,
    studiedPartIds: [],
    discoveredWordIds: [],
    dailyRootCredits: {},
    preferences: { dailyGoal: DAILY_GOAL_DEFAULT, haptics: true, reduceMotion: false },
  };
}

export function rootProgressOf(state: ProgressState, rootId: string): RootProgress {
  return state.roots[rootId] || EMPTY_ROOT_PROGRESS;
}

export function buildersComplete(state: ProgressState, rootId: string): boolean {
  const root = getRoot(rootId);
  const progress = rootProgressOf(state, rootId);
  return root.builderTargetIds.every(id => progress.completedBuilderWordIds.indexOf(id) >= 0);
}

/** Lesson + both builder targets must be done before a pass can qualify. */
export function quizUnlocked(state: ProgressState, rootId: string): boolean {
  return rootProgressOf(state, rootId).lessonCompleted && buildersComplete(state, rootId);
}

export function statusOf(state: ProgressState, rootId: string): RootStatus {
  const progress = rootProgressOf(state, rootId);
  if (progress.masteredAt) {
    const last = progress.passDates[progress.passDates.length - 1] || progress.masteredAt;
    if (daysBetween(last, todayKey()) >= REVIEW_INTERVAL_DAYS) {
      return 'review';
    }
    return 'mastered';
  }
  if (progress.lessonCompleted) {
    return 'learning';
  }
  return 'new';
}

export const STATUS_LABEL: Record<RootStatus, string> = {
  new: 'New',
  learning: 'Learning',
  mastered: 'Mastered',
  review: 'Review due',
};

export function masteredCount(state: ProgressState): number {
  return ROOTS.filter(root => !!rootProgressOf(state, root.id).masteredAt).length;
}

export function creditsForDate(state: ProgressState, key: string): string[] {
  return state.dailyRootCredits[key] || [];
}

export function todayCount(state: ProgressState): number {
  return creditsForDate(state, todayKey()).length;
}

/**
 * Next lesson: the last unfinished learning root, else the first New root in
 * curriculum order, else the oldest Review due root, else port.
 */
export function nextRootId(state: ProgressState): string {
  const learning = ROOTS.find(root => statusOf(state, root.id) === 'learning');
  if (learning) {
    return learning.id;
  }
  const fresh = ROOTS.find(root => statusOf(state, root.id) === 'new');
  if (fresh) {
    return fresh.id;
  }
  const due = ROOTS.filter(root => statusOf(state, root.id) === 'review').sort((a, b) => {
    const pa = rootProgressOf(state, a.id).passDates;
    const pb = rootProgressOf(state, b.id).passDates;
    const la = pa[pa.length - 1] || '';
    const lb = pb[pb.length - 1] || '';
    return la < lb ? -1 : 1;
  });
  if (due.length > 0) {
    return due[0].id;
  }
  return ROOTS[0].id;
}

export function discoveredCount(state: ProgressState): number {
  return state.discoveredWordIds.length;
}

export function goalFill(state: ProgressState): number {
  const goal = state.preferences.dailyGoal;
  if (goal <= 0) {
    return 1;
  }
  return Math.min(todayCount(state) / goal, 1);
}
