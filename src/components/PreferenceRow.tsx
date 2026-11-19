import React, { useCallback } from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { C, T, theme } from '../constants/theme';

type Props = {
  label: string;
  description: string;
  value: boolean;
  onChange: (next: boolean) => void;
};

export function PreferenceRow({ label, description, value, onChange }: Props) {
  const toggle = useCallback(() => onChange(!value), [onChange, value]);

  return (
    <Pressable
      onPress={toggle}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityHint={description}
      accessibilityState={{ checked: value }}
      style={styles.press}>
      <View style={styles.row}>
        <View style={styles.text}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
        <Switch
          value={value}
          onValueChange={onChange}
          trackColor={{ false: 'rgba(221,181,176,0.6)', true: 'rgba(40,224,156,0.65)' }}
          thumbColor={value ? C.brand.mint : C.bg.parchment}
        />
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
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
  },
  text: { flex: 1, paddingRight: theme.spacing.lg },
  label: { ...T.bodyStrong, color: C.text.primary },
  description: { ...T.meta, color: C.text.secondary, marginTop: 2 },
});
