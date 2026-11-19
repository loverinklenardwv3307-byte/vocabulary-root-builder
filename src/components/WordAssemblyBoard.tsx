import React, { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BOARD_FRAME, SLOT_GAP, SLOT_MIN_HEIGHT } from '../constants/config';
import { C, CONTENT_MAX_W, T, theme } from '../constants/theme';

/** Board frame maths — the parent's padding + border never squeezes the slots. */
const BOARD_W = CONTENT_MAX_W;
const INNER_W = BOARD_W - 2 * BOARD_FRAME;

export type SlotKind = 'prefix' | 'suffix';

type SlotProps = {
  kind: SlotKind;
  label: string;
  value: string;
  active: boolean;
  onPress: (kind: SlotKind) => void;
};

function Slot({ kind, label, value, active, onPress }: SlotProps) {
  const handlePress = useCallback(() => onPress(kind), [kind, onPress]);
  return (
    <Pressable
      onPress={handlePress}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={label + ' slot, ' + value + '. Double tap to choose a part.'}
      style={styles.slotPress}>
      <View style={[styles.slot, active ? styles.slotActive : null]}>
        <Text style={styles.slotLabel}>{label}</Text>
        <Text style={styles.slotValue} numberOfLines={2}>
          {value}
        </Text>
      </View>
    </Pressable>
  );
}

type Props = {
  rootForm: string;
  rootMeaning: string;
  cue: string;
  prefixValue: string;
  suffixValue: string;
  activeSlot: SlotKind;
  preview: string;
  previewLabel: string;
  onSelectSlot: (kind: SlotKind) => void;
  feedback: string | null;
  feedbackTone: 'none' | 'correct' | 'retry';
};

export function WordAssemblyBoard({
  rootForm,
  rootMeaning,
  cue,
  prefixValue,
  suffixValue,
  activeSlot,
  preview,
  previewLabel,
  onSelectSlot,
  feedback,
  feedbackTone,
}: Props) {
  return (
    <View style={styles.board}>
      <Text style={styles.eyebrow}>Build the word</Text>
      <Text style={styles.cue}>{cue}</Text>

      <View style={styles.stack}>
        <Slot
          kind="prefix"
          label="PREFIX"
          value={prefixValue}
          active={activeSlot === 'prefix'}
          onPress={onSelectSlot}
        />
        <View style={styles.rootSlot}>
          <Text style={styles.rootLabel}>ROOT (FIXED)</Text>
          <Text style={styles.rootValue}>
            {rootForm} · {rootMeaning}
          </Text>
        </View>
        <Slot
          kind="suffix"
          label="SUFFIX"
          value={suffixValue}
          active={activeSlot === 'suffix'}
          onPress={onSelectSlot}
        />
      </View>

      <View style={styles.previewWrap}>
        <Text style={styles.previewLabel}>{previewLabel}</Text>
        <Text style={styles.preview}>{preview}</Text>
      </View>

      {feedback ? (
        <View
          accessibilityLiveRegion="polite"
          style={[
            styles.feedback,
            feedbackTone === 'correct' ? styles.feedbackCorrect : styles.feedbackRetry,
          ]}>
          <Text style={styles.feedbackText}>{feedback}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    width: BOARD_W,
    alignSelf: 'center',
    padding: BOARD_FRAME - 1,
    borderWidth: 1,
    borderRadius: theme.radius.xl,
    backgroundColor: C.bg.parchment,
    borderColor: C.ui.border,
    ...theme.shadows.card,
  },
  eyebrow: { ...T.eyebrow, color: C.brand.burgundy },
  cue: { ...T.bodyStrong, color: C.text.primary, marginTop: 4 },
  stack: { width: INNER_W, marginTop: theme.spacing.lg, gap: SLOT_GAP },
  slotPress: { width: INNER_W, minHeight: SLOT_MIN_HEIGHT },
  slot: {
    width: INNER_W,
    minHeight: SLOT_MIN_HEIGHT,
    justifyContent: 'center',
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: C.ui.rule,
    backgroundColor: C.bg.secondary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  slotActive: { borderWidth: 2, borderColor: C.brand.burgundy },
  slotLabel: { fontSize: 13, lineHeight: 18, fontWeight: '700', letterSpacing: 1.2, color: C.text.secondary },
  slotValue: { fontSize: 24, lineHeight: 30, fontWeight: '700', color: C.text.primary },
  rootSlot: {
    width: INNER_W,
    minHeight: SLOT_MIN_HEIGHT,
    justifyContent: 'center',
    borderRadius: theme.radius.md,
    backgroundColor: C.brand.burgundy,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  rootLabel: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: C.text.inverseSoft,
  },
  rootValue: { fontSize: 24, lineHeight: 30, fontWeight: '700', color: C.text.inverse },
  previewWrap: { width: INNER_W, marginTop: theme.spacing.lg },
  previewLabel: { ...T.eyebrow, color: C.text.secondary },
  preview: { ...T.preview, color: C.brand.burgundy, marginTop: 2 },
  feedback: {
    width: INNER_W,
    marginTop: theme.spacing.md,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  feedbackCorrect: { borderColor: 'rgba(40,224,156,0.7)', backgroundColor: C.ui.mintTint },
  feedbackRetry: { borderColor: C.brand.burgundy, backgroundColor: 'rgba(171,42,90,0.08)' },
  feedbackText: { ...T.body, color: C.text.primary },
});
