import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { C, T, theme } from '../constants/theme';
import type { IconComponent } from './icons';

type Props = {
  value: string;
  label: string;
  tint: string;
  Icon?: IconComponent;
};

/**
 * One metric pill. Every pill in a row is the same shape; only the tint, the
 * number and the caption change — no raster sprites, no mismatched icon sizes.
 * The card must NOT use flex:1 inside a flex:1 slot, hence width:'100%'.
 */
function StatCardBase({ value, label, tint, Icon }: Props) {
  return (
    <View
      style={[styles.card, { borderColor: tint + '55' }]}
      accessibilityLabel={value + ' ' + label}>
      <View style={styles.topRow}>
        <View style={[styles.dot, { backgroundColor: tint }]} />
        {Icon ? <Icon size={22} color={tint} strokeWidth={2.4} /> : null}
      </View>
      <Text style={[styles.value, { color: tint }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: theme.spacing.md,
    alignItems: 'center',
    borderRadius: theme.radius.md,
    borderWidth: 1,
    backgroundColor: C.bg.parchment,
  },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  value: { fontSize: 22, lineHeight: 28, fontWeight: '700' },
  label: {
    ...T.meta,
    color: C.text.secondary,
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
  },
});

export const StatCard = React.memo(StatCardBase);
