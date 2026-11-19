import React, { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Check, X } from 'lucide-react-native';
import { C, T, theme } from '../constants/theme';

export type AnswerState = 'idle' | 'correct' | 'selectedIncorrect' | 'unselectedAfterAnswer';

const LETTERS = ['A', 'B', 'C', 'D'];

type Props = {
  index: number;
  text: string;
  state: AnswerState;
  disabled: boolean;
  onSelect: (index: number) => void;
};

function QuizAnswerBase({ index, text, state, disabled, onSelect }: Props) {
  const handlePress = useCallback(() => onSelect(index), [index, onSelect]);

  const statusText =
    state === 'correct' ? 'Correct' : state === 'selectedIncorrect' ? 'Your answer' : null;

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      accessibilityLabel={LETTERS[index] + '. ' + text + (statusText ? '. ' + statusText : '')}
      style={styles.press}>
      <View
        style={[
          styles.row,
          state === 'correct' ? styles.correct : null,
          state === 'selectedIncorrect' ? styles.incorrect : null,
          state === 'unselectedAfterAnswer' ? styles.dimmed : null,
        ]}>
        <View style={[styles.letterWrap, state === 'correct' ? styles.letterWrapCorrect : null]}>
          <Text style={styles.letter}>{LETTERS[index]}</Text>
        </View>
        <View style={styles.body}>
          <Text style={styles.text}>{text}</Text>
          {statusText ? (
            <View style={styles.statusRow}>
              {state === 'correct' ? (
                <Check size={16} color={C.text.primary} strokeWidth={2.6} />
              ) : (
                <X size={16} color={C.brand.burgundy} strokeWidth={2.6} />
              )}
              <Text
                style={[
                  styles.status,
                  state === 'correct' ? styles.statusCorrect : styles.statusIncorrect,
                ]}>
                {statusText}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { width: '100%', minHeight: 56 },
  row: {
    width: '100%',
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: C.ui.border,
    backgroundColor: C.bg.parchment,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  correct: { backgroundColor: 'rgba(40,224,156,0.26)', borderColor: C.brand.mint, borderWidth: 2 },
  incorrect: { borderColor: C.brand.burgundy, borderWidth: 2 },
  dimmed: { opacity: 0.74 },
  letterWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.ui.tint,
    marginRight: theme.spacing.md,
  },
  letterWrapCorrect: { backgroundColor: 'rgba(250,245,236,0.85)' },
  letter: { ...T.meta, fontWeight: '700', color: C.brand.burgundy },
  body: { flex: 1 },
  text: { ...T.body, color: C.text.primary },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  status: { ...T.meta, fontWeight: '700', lineHeight: 16 },
  statusCorrect: { color: C.text.primary },
  statusIncorrect: { color: C.brand.burgundy },
});

export const QuizAnswer = React.memo(QuizAnswerBase);
