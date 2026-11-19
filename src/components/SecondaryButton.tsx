import React, { useCallback, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import {
  PRESS_FRICTION,
  PRESS_IN_MS,
  PRESS_SCALE,
  PRESS_TENSION,
  SECONDARY_HEIGHT,
} from '../constants/config';
import { C, T, theme } from '../constants/theme';
import { useReduceMotion } from '../hooks/useMotionPreference';
import type { IconComponent } from './icons';

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  Icon?: IconComponent;
  tone?: 'light' | 'dark';
};

/** Outlined companion action. Same icon geometry as PrimaryButton: 24 dp, gap 10. */
export function SecondaryButton({ label, onPress, disabled, Icon, tone = 'light' }: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const reduceMotion = useReduceMotion();
  const dark = tone === 'dark';

  const pressIn = useCallback(() => {
    if (reduceMotion) {
      return;
    }
    Animated.timing(scale, {
      toValue: PRESS_SCALE,
      duration: PRESS_IN_MS,
      useNativeDriver: true,
    }).start();
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

  const textColor = disabled ? C.text.secondary : dark ? C.text.inverse : C.brand.burgundy;

  return (
    <Pressable
      onPress={onPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      disabled={disabled}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      style={styles.press}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.surface,
          dark ? styles.surfaceDark : styles.surfaceLight,
          disabled ? styles.surfaceDisabled : null,
          { transform: [{ scale }] },
        ]}>
        <View style={styles.row}>
          {Icon ? <Icon size={24} color={textColor} strokeWidth={2.2} /> : null}
          <Text style={[styles.label, { color: textColor }]} numberOfLines={1}>
            {label}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { width: '100%', height: SECONDARY_HEIGHT },
  surface: {
    width: '100%',
    height: SECONDARY_HEIGHT,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  surfaceLight: {
    backgroundColor: 'rgba(221,181,176,0.22)',
    borderColor: C.brand.burgundy,
  },
  surfaceDark: {
    backgroundColor: 'rgba(250,245,236,0.12)',
    borderColor: 'rgba(221,181,176,0.65)',
  },
  surfaceDisabled: {
    opacity: 0.55,
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  label: { ...T.button, lineHeight: 24 },
});
