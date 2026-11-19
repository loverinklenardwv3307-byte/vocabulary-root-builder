import React, { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Minus, Plus } from 'lucide-react-native';
import { C, T, theme } from '../constants/theme';

type Props = {
  value: number;
  minimum: number;
  maximum: number;
  onChange: (next: number) => void;
};

function StepButton({
  kind,
  disabled,
  onPress,
}: {
  kind: 'minus' | 'plus';
  disabled: boolean;
  onPress: () => void;
}) {
  const Icon = kind === 'minus' ? Minus : Plus;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      accessibilityRole="button"
      accessibilityLabel={kind === 'minus' ? 'Decrease daily goal' : 'Increase daily goal'}
      accessibilityState={{ disabled }}
      style={styles.stepPress}>
      <View style={[styles.step, disabled ? styles.stepDisabled : null]}>
        <Icon size={24} color={disabled ? C.text.secondary : C.brand.burgundy} strokeWidth={2.4} />
      </View>
    </Pressable>
  );
}

export function GoalStepper({ value, minimum, maximum, onChange }: Props) {
  const decrease = useCallback(() => onChange(Math.max(minimum, value - 1)), [minimum, onChange, value]);
  const increase = useCallback(() => onChange(Math.min(maximum, value + 1)), [maximum, onChange, value]);

  return (
    <View style={styles.row}>
      <StepButton kind="minus" disabled={value <= minimum} onPress={decrease} />
      <View style={styles.valueWrap}>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.caption}>{value === 1 ? '1 root per day' : value + ' roots per day'}</Text>
      </View>
      <StepButton kind="plus" disabled={value >= maximum} onPress={increase} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stepPress: { width: 56, height: 56 },
  step: {
    width: 56,
    height: 56,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.ui.tint,
    borderWidth: 1,
    borderColor: C.brand.burgundy,
  },
  stepDisabled: { borderColor: C.ui.rule, backgroundColor: 'rgba(242,234,216,0.7)' },
  valueWrap: { flex: 1, alignItems: 'center' },
  value: { fontSize: 40, lineHeight: 46, fontWeight: '700', color: C.text.primary },
  caption: { ...T.meta, color: C.text.secondary, marginTop: 2 },
});
