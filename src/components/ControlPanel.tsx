import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { C, T, theme } from '../constants/theme';

type Props = {
  /** Helper copy always sits ABOVE the call to action, never under it. */
  hint?: string;
  children: React.ReactNode;
  tone?: 'light' | 'dark';
};

/** Raised bottom action surface shared by every screen that has a main action. */
export function ControlPanel({ hint, children, tone = 'light' }: Props) {
  const dark = tone === 'dark';
  return (
    <View style={[styles.panel, dark ? styles.panelDark : styles.panelLight]}>
      {hint ? (
        <Text style={[styles.hint, dark ? styles.hintDark : styles.hintLight]}>{hint}</Text>
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderTopWidth: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
    ...theme.shadows.panel,
  },
  panelLight: {
    backgroundColor: C.bg.parchment,
    borderTopColor: C.ui.border,
  },
  panelDark: {
    backgroundColor: 'rgba(36,24,29,0.86)',
    borderTopColor: 'rgba(221,181,176,0.35)',
  },
  hint: { ...T.body, marginBottom: theme.spacing.md },
  hintLight: { color: C.text.secondary },
  hintDark: { color: C.text.inverseSoft },
});
