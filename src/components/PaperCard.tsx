import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { C, theme } from '../constants/theme';

type Props = {
  children: React.ReactNode;
  tone?: 'parchment' | 'inset' | 'ink';
  radius?: 14 | 16 | 18;
  style?: ViewStyle | ViewStyle[];
  accessibilityLabel?: string;
};

/** Shared parchment surface: fill, hairline rule, padding and paper shadow. */
export function PaperCard({
  children,
  tone = 'parchment',
  radius = 18,
  style,
  accessibilityLabel,
}: Props) {
  return (
    <View
      accessibilityLabel={accessibilityLabel}
      style={[
        styles.base,
        { borderRadius: radius },
        tone === 'parchment' ? styles.parchment : null,
        tone === 'inset' ? styles.inset : null,
        tone === 'ink' ? styles.ink : null,
        style,
      ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    padding: theme.spacing.xl,
    borderWidth: 1,
    ...theme.shadows.card,
  },
  parchment: {
    backgroundColor: C.bg.parchment,
    borderColor: C.ui.border,
  },
  inset: {
    backgroundColor: C.bg.secondary,
    borderColor: C.ui.rule,
  },
  ink: {
    backgroundColor: 'rgba(36,24,29,0.72)',
    borderColor: 'rgba(221,181,176,0.4)',
  },
});
