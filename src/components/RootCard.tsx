import React, { useCallback, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { PRESS_FRICTION, PRESS_IN_MS, PRESS_TENSION } from '../constants/config';
import { C, T, theme } from '../constants/theme';
import type { RootStatus } from '../game/types';
import { useReduceMotion } from '../hooks/useMotionPreference';

const STATUS_TINT: Record<RootStatus, string> = {
  new: C.text.secondary,
  learning: C.brand.burgundy,
  mastered: '#17946A',
  review: '#B5761F',
};

type Props = {
  rootId: string;
  form: string;
  meaning: string;
  status: RootStatus;
  statusLabel: string;
  builtCount: number;
  lastScore: number | null;
  onOpen: (rootId: string) => void;
};

/**
 * One row of the roots list. Props are primitives so React.memo actually holds
 * between renders of the list.
 */
function RootCardBase({
  rootId,
  form,
  meaning,
  status,
  statusLabel,
  builtCount,
  lastScore,
  onOpen,
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const reduceMotion = useReduceMotion();

  const handlePress = useCallback(() => onOpen(rootId), [onOpen, rootId]);

  const pressIn = useCallback(() => {
    if (reduceMotion) {
      return;
    }
    Animated.timing(scale, { toValue: 0.985, duration: PRESS_IN_MS, useNativeDriver: true }).start();
  }, [reduceMotion, scale]);

  const pressOut = useCallback(() => {
    if (reduceMotion) {
      return;
    }
    Animated.spring(scale, {
      toValue: 1,
      tension: PRESS_TENSION,
      friction: PRESS_FRICTION,
      useNativeDriver: true,
    }).start();
  }, [reduceMotion, scale]);

  const detail =
    lastScore === null
      ? builtCount > 0
        ? builtCount + ' of 2 words built'
        : 'Lesson not started'
      : 'Last quiz ' + lastScore + ' of 5';

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      accessibilityRole="button"
      accessibilityLabel={form + ', ' + meaning + '. ' + statusLabel + '. ' + detail}
      style={styles.press}>
      <Animated.View pointerEvents="none" style={[styles.card, { transform: [{ scale }] }]}>
        <View style={styles.main}>
          <Text style={styles.root}>{form}</Text>
          <Text style={styles.meaning}>{meaning}</Text>
          <Text style={styles.detail}>{detail}</Text>
        </View>
        <View style={styles.sideColumn}>
          <View style={[styles.statusPill, { borderColor: STATUS_TINT[status] }]}>
            <Text style={[styles.statusText, { color: STATUS_TINT[status] }]}>{statusLabel}</Text>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { width: '100%', minHeight: 88 },
  card: {
    width: '100%',
    minHeight: 88,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.radius.lg,
    backgroundColor: C.bg.parchment,
    borderWidth: 1,
    borderColor: C.ui.border,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    ...theme.shadows.card,
  },
  main: { flex: 1, paddingRight: theme.spacing.md },
  root: { ...T.title, color: C.brand.burgundy },
  meaning: { ...T.body, color: C.text.primary, marginTop: 2 },
  detail: { ...T.meta, color: C.text.secondary, marginTop: 4 },
  sideColumn: { alignItems: 'flex-end', justifyContent: 'center' },
  statusPill: {
    borderWidth: 1,
    borderRadius: theme.radius.full,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'rgba(242,234,216,0.75)',
  },
  statusText: { ...T.meta, fontWeight: '700' },
});

export const RootCard = React.memo(RootCardBase);
