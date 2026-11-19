import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { C, T, theme } from '../constants/theme';

type Props = {
  word: string;
  decomposition: string;
  definition: string;
  example: string;
  note?: string;
  tone?: 'parchment' | 'mint';
};

/** Shared definition block: lesson, builder success, quiz feedback, result review. */
function MeaningCardBase({ word, decomposition, definition, example, note, tone = 'parchment' }: Props) {
  return (
    <View style={[styles.card, tone === 'mint' ? styles.mint : styles.parchment]}>
      <Text style={styles.word}>{word}</Text>
      <Text style={styles.split}>{decomposition}</Text>
      <Text style={styles.definition}>{definition}</Text>
      <Text style={styles.example}>{example}</Text>
      {note ? <Text style={styles.note}>{note}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.radius.md,
    borderWidth: 1,
    padding: theme.spacing.lg,
  },
  parchment: { backgroundColor: C.bg.secondary, borderColor: C.ui.rule },
  mint: { backgroundColor: C.ui.mintTint, borderColor: 'rgba(40,224,156,0.6)' },
  word: { ...T.meaning, color: C.text.primary },
  split: { ...T.meta, color: C.brand.burgundy, marginTop: 2, letterSpacing: 0.6 },
  definition: { ...T.body, color: C.text.primary, marginTop: theme.spacing.sm },
  example: { ...T.body, color: C.text.secondary, marginTop: theme.spacing.xs, fontStyle: 'italic' },
  note: { ...T.meta, color: C.text.secondary, marginTop: theme.spacing.sm },
});

export const MeaningCard = React.memo(MeaningCardBase);
