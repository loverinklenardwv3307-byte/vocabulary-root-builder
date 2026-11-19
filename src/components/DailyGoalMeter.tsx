import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { FADE_MS } from '../constants/config';
import { C, T, theme } from '../constants/theme';
import { useReduceMotion } from '../hooks/useMotionPreference';

type Props = {
  completedCount: number;
  goal: number;
  label?: string;
  tone?: 'light' | 'dark';
};

/**
 * Explanatory daily-goal line with a thin fill. Width is a layout property, so
 * the fill animation deliberately runs off the native driver.
 */
export function DailyGoalMeter({ completedCount, goal, label, tone = 'light' }: Props) {
  const fill = useRef(new Animated.Value(0)).current;
  const reduceMotion = useReduceMotion();
  const ratio = goal > 0 ? Math.min(completedCount / goal, 1) : 1;

  useEffect(() => {
    if (reduceMotion) {
      fill.setValue(ratio);
      return;
    }
    Animated.timing(fill, {
      toValue: ratio,
      duration: FADE_MS,
      useNativeDriver: false,
    }).start();
  }, [fill, ratio, reduceMotion]);

  const width = fill.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });
  const dark = tone === 'dark';

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: goal, now: completedCount }}>
      <Text style={[styles.label, dark ? styles.labelDark : styles.labelLight]}>
        {label || "Today's goal"}: {completedCount} of {goal} roots
      </Text>
      <View style={[styles.track, dark ? styles.trackDark : styles.trackLight]}>
        <Animated.View style={[styles.fill, { width }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { ...T.body, marginBottom: theme.spacing.sm },
  labelLight: { color: C.text.secondary },
  labelDark: { color: C.text.inverseSoft },
  track: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  trackLight: { backgroundColor: 'rgba(221,181,176,0.5)' },
  trackDark: { backgroundColor: 'rgba(221,181,176,0.28)' },
  fill: { height: 4, borderRadius: 2, backgroundColor: C.brand.mint },
});
