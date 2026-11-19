import { getPart, getRoot, getWord, WORDS, bareForm } from './curriculum';
import type { Part } from './types';

export const NO_PREFIX = 'none_prefix';
export const NO_SUFFIX = 'none_suffix';

export type SlotRole = 'prefix' | 'suffix';

export type PartChoice = {
  id: string;
  label: string;
  meaning: string;
  empty: boolean;
};

function toChoice(part: Part): PartChoice {
  return { id: part.id, label: part.form, meaning: part.meaning, empty: false };
}

/**
 * Picker bank for a lesson: the two builder targets' affix forms plus the
 * explicit empty value. Duplicates are removed, empty always sits last.
 */
export function choicesForRole(rootId: string, role: SlotRole): PartChoice[] {
  const root = getRoot(rootId);
  const seen: string[] = [];
  const choices: PartChoice[] = [];
  root.builderTargetIds.forEach(wordId => {
    const word = getWord(wordId);
    const partId = role === 'prefix' ? word.prefixId : word.suffixId;
    const part = getPart(partId);
    if (part && seen.indexOf(part.id) < 0) {
      seen.push(part.id);
      choices.push(toChoice(part));
    }
  });
  choices.push(
    role === 'prefix'
      ? { id: NO_PREFIX, label: 'No prefix', meaning: 'This word starts with the root.', empty: true }
      : { id: NO_SUFFIX, label: 'No suffix', meaning: 'This word ends with the root.', empty: true },
  );
  return choices;
}

export function normalise(id: string | null): string | null {
  if (!id || id === NO_PREFIX || id === NO_SUFFIX) {
    return null;
  }
  return id;
}

/** Joined spelling of the current combination, using the curated table only. */
export function joinedSpelling(rootId: string, prefixId: string | null, suffixId: string | null): string {
  const root = getRoot(rootId);
  const prefix = getPart(normalise(prefixId));
  const suffix = getPart(normalise(suffixId));
  const match = findCuratedWord(rootId, prefixId, suffixId);
  if (match) {
    return match.spelling;
  }
  return (prefix ? bareForm(prefix) : '') + root.form + (suffix ? bareForm(suffix) : '');
}

export function findCuratedWord(rootId: string, prefixId: string | null, suffixId: string | null) {
  const p = normalise(prefixId);
  const s = normalise(suffixId);
  return WORDS.find(w => w.rootId === rootId && w.prefixId === p && w.suffixId === s) || null;
}

export type CheckOutcome =
  | { kind: 'correct'; wordId: string }
  | { kind: 'other-word'; message: string }
  | { kind: 'outside'; message: string };

/** Only the target's exact prefix/root/suffix tuple counts as correct. */
export function checkCombination(
  rootId: string,
  targetWordId: string,
  prefixId: string | null,
  suffixId: string | null,
): CheckOutcome {
  const target = getWord(targetWordId);
  const p = normalise(prefixId);
  const s = normalise(suffixId);
  if (p === target.prefixId && s === target.suffixId) {
    return { kind: 'correct', wordId: target.id };
  }
  const other = findCuratedWord(rootId, prefixId, suffixId);
  if (other) {
    return {
      kind: 'other-word',
      message: 'That is ' + other.spelling + '. This step asks for ' + target.spelling + '.',
    };
  }
  return {
    kind: 'outside',
    message: 'This combination is outside this exercise. Try the parts for ' + target.spelling + '.',
  };
}
