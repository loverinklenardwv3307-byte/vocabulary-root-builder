import React, { useCallback, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  PRESS_FRICTION,
  PRESS_IN_MS,
  PRESS_SCALE,
  PRESS_TENSION,
  PRIMARY_HEIGHT,
} from '../constants/config';
import { C, T, theme } from '../constants/theme';
import { useReduceMotion } from '../hooks/useMotionPreference';
import type { IconComponent } from './icons';

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  Icon?: IconComponent;
  accessibilityHint?: string;
};

/**
 * Mint gradient call to action. The Pressable is the parent and the animated
 * visual is its child, so press handling never gets swallowed on Android.
 */
export function PrimaryButton({ label, onPress, disabled, Icon, accessibilityHint }: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const busyRef = useRef(false);
  const reduceMotion = useReduceMotion();

  const handlePress = useCallback(() => {
    if (busyRef.current || disabled) {
      return;
    }
    busyRef.current = true;
    onPress();
    setTimeout(() => {
      busyRef.current = false;
    }, 320);
  }, [disabled, onPress]);

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

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      disabled={disabled}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !!disabled }}
      style={styles.press}>
      <Animated.View
        pointerEvents="none"
        style={[styles.animated, theme.shadows.action, { transform: [{ scale }] }]}>
        <LinearGradient
          colors={disabled ? ['#D6CEC4', '#C9C0B6'] : theme.gradients.action}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.surface}>
          <View style={styles.row}>
            {Icon ? <Icon size={24} color={C.text.primary} strokeWidth={2.2} /> : null}
            <Text style={styles.label} numberOfLines={1}>
              {label}
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    width: '100%',
    height: PRIMARY_HEIGHT,
  },
  animated: {
    width: '100%',
    height: PRIMARY_HEIGHT,
    borderRadius: theme.radius.lg,
  },
  surface: {
    width: '100%',
    height: PRIMARY_HEIGHT,
    borderRadius: theme.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  label: {
    ...T.button,
    lineHeight: 24,
    color: C.text.primary,
  },
});
