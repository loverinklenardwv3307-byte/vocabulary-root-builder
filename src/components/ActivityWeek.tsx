import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { C, T, theme } from '../constants/theme';
import { shortDayLabel } from '../utils/localDates';

type Props = {
  dateKeys: string[];
  credits: number[];
};

/** Seven day cells with readable counts. Not a streak that can be lost. */
export function ActivityWeek({ dateKeys, credits }: Props) {
  return (
    <View>
      <Text style={styles.heading}>Daily practice</Text>
      <View style={styles.row}>
        {dateKeys.map((key, index) => {
          const count = credits[index] || 0;
          return (
            <View key={key} style={styles.cellSlot}>
              <View style={[styles.cell, count > 0 ? styles.cellActive : null]}>
                <Text style={[styles.count, count > 0 ? styles.countActive : null]}>{count}</Text>
              </View>
              <Text style={styles.day} accessibilityLabel={key}>
                {shortDayLabel(key)}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heading: { ...T.eyebrow, color: C.text.secondary, marginBottom: theme.spacing.md },
  row: { flexDirection: 'row', gap: 6 },
  cellSlot: { flex: 1, alignItems: 'center' },
  cell: {
    width: '100%',
    height: 44,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(221,181,176,0.3)',
    borderWidth: 1,
    borderColor: C.ui.rule,
  },
  cellActive: { backgroundColor: C.ui.mintTint, borderColor: 'rgba(40,224,156,0.6)' },
  count: { ...T.bodyStrong, color: C.text.secondary },
  countActive: { color: C.text.primary },
  day: { fontSize: 12, lineHeight: 16, fontWeight: '600', color: C.text.secondary, marginTop: 4 },
});
