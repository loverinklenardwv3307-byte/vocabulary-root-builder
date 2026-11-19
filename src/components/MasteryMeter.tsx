import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { C, T, theme } from '../constants/theme';

type Props = {
  rootCount: number;
  masteredCount: number;
};

/** Six labelled segments plus the plain count — colour is supplementary. */
export function MasteryMeter({ rootCount, masteredCount }: Props) {
  const segments: number[] = [];
  for (let i = 0; i < rootCount; i += 1) {
    segments.push(i);
  }
  return (
    <View accessibilityLabel={masteredCount + ' of ' + rootCount + ' roots mastered'}>
      <Text style={styles.count}>
        {masteredCount} of {rootCount} roots mastered
      </Text>
      <View style={styles.row}>
        {segments.map(index => (
          <View
            key={index}
            style={[styles.segment, index < masteredCount ? styles.segmentFilled : null]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  count: { ...T.title, color: C.text.primary },
  row: { flexDirection: 'row', gap: 6, marginTop: theme.spacing.md },
  segment: {
    flex: 1,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(221,181,176,0.5)',
  },
  segmentFilled: { backgroundColor: C.brand.mint },
});
