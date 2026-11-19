import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { PRESS_FRICTION, PRESS_IN_MS, PRESS_TENSION, TOUCH_MIN } from '../constants/config';
import { C, HEADER_TOP_PAD, T, theme } from '../constants/theme';
import { useReduceMotion } from '../hooks/useMotionPreference';
import type { IconComponent } from './icons';

export type HeaderAction = {
  Icon: IconComponent;
  label: string;
  onPress: () => void;
};

export function HeaderIconButton({ action, tone }: { action: HeaderAction; tone: 'light' | 'dark' }) {
  const scale = useRef(new Animated.Value(1)).current;
  const reduceMotion = useReduceMotion();
  const { Icon, label, onPress } = action;

  const pressIn = () => {
    if (reduceMotion) {
      return;
    }
    Animated.timing(scale, {
      toValue: 0.94,
      duration: PRESS_IN_MS,
      useNativeDriver: true,
    }).start();
  };
  const pressOut = () => {
    if (reduceMotion) {
      return;
    }
    Animated.spring(scale, {
      toValue: 1,
      tension: PRESS_TENSION,
      friction: PRESS_FRICTION,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={styles.iconButton}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.iconInner,
          tone === 'dark' ? styles.iconInnerDark : styles.iconInnerLight,
          { transform: [{ scale }] },
        ]}>
        <Icon size={24} color={tone === 'dark' ? C.text.inverse : C.brand.burgundy} strokeWidth={2} />
      </Animated.View>
    </Pressable>
  );
}

type Props = {
  title: string;
  stepLabel?: string;
  leading?: HeaderAction;
  trailing?: HeaderAction;
  tone?: 'light' | 'dark';
};

/**
 * The one header used by every screen. Screens differ only through the
 * leading/trailing slots and the step label.
 */
export function ScreenHeader({ title, stepLabel, leading, trailing, tone = 'light' }: Props) {
  const dark = tone === 'dark';
  return (
    <View style={[styles.wrap, dark ? styles.wrapDark : styles.wrapLight]}>
      <View style={styles.row}>
        <View style={styles.side}>
          {leading ? <HeaderIconButton action={leading} tone={tone} /> : null}
        </View>
        <View style={styles.middle}>
          <Text
            numberOfLines={1}
            style={[styles.title, dark ? styles.titleDark : styles.titleLight]}
            accessibilityRole="header">
            {title}
          </Text>
          {stepLabel ? (
            <Text style={[styles.step, dark ? styles.stepDark : styles.stepLight]}>{stepLabel}</Text>
          ) : null}
        </View>
        <View style={styles.sideRight}>
          {trailing ? <HeaderIconButton action={trailing} tone={tone} /> : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingTop: HEADER_TOP_PAD,
    paddingHorizontal: theme.spacing.lg,
    borderBottomWidth: 1,
  },
  wrapLight: {
    backgroundColor: 'rgba(250,245,236,0.82)',
    borderBottomColor: C.ui.border,
  },
  wrapDark: {
    backgroundColor: 'rgba(36,24,29,0.34)',
    borderBottomColor: 'rgba(221,181,176,0.3)',
  },
  row: {
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
  },
  side: { width: TOUCH_MIN, alignItems: 'flex-start', justifyContent: 'center' },
  sideRight: { width: TOUCH_MIN, alignItems: 'flex-end', justifyContent: 'center' },
  middle: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  title: { ...T.title, fontSize: 24, lineHeight: 30 },
  titleLight: { color: C.text.primary },
  titleDark: { color: C.text.inverse },
  step: { ...T.meta, marginTop: 2 },
  stepLight: { color: C.text.secondary },
  stepDark: { color: C.text.inverseSoft },
  iconButton: {
    width: TOUCH_MIN,
    height: TOUCH_MIN,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconInner: {
    width: TOUCH_MIN,
    height: TOUCH_MIN,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  iconInnerLight: {
    backgroundColor: 'rgba(221,181,176,0.22)',
    borderColor: C.ui.border,
  },
  iconInnerDark: {
    backgroundColor: 'rgba(250,245,236,0.14)',
    borderColor: 'rgba(221,181,176,0.4)',
  },
});
