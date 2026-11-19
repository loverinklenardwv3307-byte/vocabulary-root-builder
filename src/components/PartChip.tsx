import React, { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { TOUCH_MIN } from '../constants/config';
import { C, T, theme } from '../constants/theme';

export type ChipRole = 'prefix' | 'root' | 'suffix' | 'empty';

const ROLE_LABEL: Record<ChipRole, string> = {
  prefix: 'PREFIX',
  root: 'ROOT',
  suffix: 'SUFFIX',
  empty: 'EMPTY',
};

type Props = {
  form: string;
  role: ChipRole;
  meaning?: string;
  selected?: boolean;
  disabled?: boolean;
  onPress?: (form: string) => void;
  compact?: boolean;
};

/**
 * One labelled word part. Colour is never the only cue — every chip carries a
 * written role label as well.
 */
function PartChipBase({ form, role, meaning, selected, disabled, onPress, compact }: Props) {
  const handlePress = useCallback(() => {
    if (onPress) {
      onPress(form);
    }
  }, [form, onPress]);

  const body = (
    <View
      style={[
        styles.chip,
        role === 'prefix' ? styles.prefix : null,
        role === 'root' ? styles.root : null,
        role === 'suffix' ? styles.suffix : null,
        role === 'empty' ? styles.empty : null,
        selected ? styles.selected : null,
        compact ? styles.compact : null,
      ]}>
      <Text style={[styles.roleLabel, role === 'root' ? styles.onInk : styles.onPaper]}>
        {ROLE_LABEL[role]}
      </Text>
      <Text style={[styles.form, role === 'root' ? styles.onInk : styles.onPaperStrong]}>{form}</Text>
      {meaning ? (
        <Text style={[styles.meaning, role === 'root' ? styles.onInk : styles.onPaper]}>
          {meaning}
        </Text>
      ) : null}
    </View>
  );

  if (!onPress) {
    return body;
  }

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected, disabled: !!disabled }}
      accessibilityLabel={ROLE_LABEL[role] + ' ' + form + (meaning ? ', ' + meaning : '')}
      style={styles.press}>
      {body}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { minHeight: TOUCH_MIN },
  chip: {
    minHeight: TOUCH_MIN,
    justifyContent: 'center',
    borderRadius: theme.radius.md,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  compact: { paddingHorizontal: theme.spacing.md },
  prefix: { backgroundColor: C.ui.tint, borderColor: C.ui.border },
  suffix: { backgroundColor: C.ui.mintTint, borderColor: 'rgba(40,224,156,0.55)' },
  root: { backgroundColor: C.brand.burgundy, borderColor: C.brand.burgundy },
  empty: { backgroundColor: 'rgba(242,234,216,0.9)', borderColor: C.ui.rule },
  selected: { borderWidth: 2, borderColor: C.brand.burgundy },
  roleLabel: { ...T.eyebrow, fontSize: 12, lineHeight: 16, letterSpacing: 1.2 },
  form: { fontSize: 24, lineHeight: 30, fontWeight: '700' },
  meaning: { ...T.meta },
  onPaper: { color: C.text.secondary },
  onPaperStrong: { color: C.text.primary },
  onInk: { color: C.text.inverse },
});

export const PartChip = React.memo(PartChipBase);
