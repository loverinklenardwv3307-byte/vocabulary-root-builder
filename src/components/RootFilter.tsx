import React, { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { TOUCH_MIN } from '../constants/config';
import { C, T, theme } from '../constants/theme';

export type FilterValue = 'all' | 'learning' | 'mastered';

export const FILTERS: { value: FilterValue; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'learning', label: 'Learning' },
  { value: 'mastered', label: 'Mastered' },
];

function Chip({
  label,
  value,
  selected,
  onChange,
}: {
  label: string;
  value: FilterValue;
  selected: boolean;
  onChange: (value: FilterValue) => void;
}) {
  const handlePress = useCallback(() => onChange(value), [onChange, value]);
  return (
    <Pressable
      onPress={handlePress}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={label + ' roots'}
      style={[styles.chip, selected ? styles.chipSelected : styles.chipIdle]}>
      <Text style={[styles.chipText, selected ? styles.chipTextSelected : null]}>{label}</Text>
    </Pressable>
  );
}

export function RootFilter({
  value,
  onChange,
}: {
  value: FilterValue;
  onChange: (next: FilterValue) => void;
}) {
  return (
    <View style={styles.row} accessibilityRole="tablist">
      {FILTERS.map(filter => (
        <Chip
          key={filter.value}
          label={filter.label}
          value={filter.value}
          selected={filter.value === value}
          onChange={onChange}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: theme.spacing.sm },
  chip: {
    minHeight: TOUCH_MIN,
    height: TOUCH_MIN,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipIdle: {
    backgroundColor: 'rgba(250,245,236,0.78)',
    borderWidth: 1,
    borderColor: C.ui.border,
  },
  chipSelected: {
    backgroundColor: C.ui.tint,
    borderWidth: 2,
    borderColor: C.brand.burgundy,
  },
  chipText: { ...T.bodyStrong, color: C.brand.burgundy },
  chipTextSelected: { color: C.brand.burgundy },
});
