import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { assets } from '../assets';
import { AppShell } from '../components/AppShell';
import { FADE_MS, LOADER_DURATION_MS } from '../constants/config';
import { C, T, theme } from '../constants/theme';
import { useReduceMotion } from '../hooks/useMotionPreference';

type Props = {
  onDone: () => void;
};

/**
 * Branded splash. Dark ink-to-burgundy overlay keeps it visibly distinct from
 * the light Roots screen that follows.
 */
export function LoaderScreen({ onDone }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.96)).current;
  const fill = useRef(new Animated.Value(0)).current;
  const reduceMotion = useReduceMotion();
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    if (reduceMotion) {
      opacity.setValue(1);
      scale.setValue(1);
    } else {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: FADE_MS, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: FADE_MS, useNativeDriver: true }),
      ]).start();
    }
    // Width is a layout property: this fill deliberately stays off the native driver.
    Animated.timing(fill, {
      toValue: 1,
      duration: LOADER_DURATION_MS,
      useNativeDriver: false,
    }).start();

    const timer = setTimeout(() => doneRef.current(), LOADER_DURATION_MS);
    return () => clearTimeout(timer);
  }, [fill, opacity, reduceMotion, scale]);

  const width = fill.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <AppShell variant="loader">
      <View style={styles.wrap}>
        <Animated.View
          pointerEvents="none"
          style={[styles.brandCard, { opacity, transform: [{ scale }] }]}>
          <Image source={assets.logo} style={styles.logo} resizeMode="contain" />
        </Animated.View>

        <Text style={styles.title}>Vocabulary</Text>
        <Text style={styles.title}>Root Builder</Text>
        <Text style={styles.subtitle}>Learn the parts. Understand the word.</Text>

        <View style={styles.progressWrap}>
          <View style={styles.track}>
            <Animated.View style={[styles.fill, { width }]} />
          </View>
          <Text style={styles.loading}>LOADING</Text>
          <Text style={styles.preparing}>Preparing your workbook...</Text>
        </View>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  brandCard: {
    width: 160,
    height: 160,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(250,245,236,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(221,181,176,0.45)',
    marginBottom: 18,
  },
  logo: { width: 112, height: 112 },
  title: {
    ...T.hero,
    color: C.text.inverse,
    textAlign: 'center',
  },
  subtitle: {
    ...T.body,
    color: C.text.inverseSoft,
    textAlign: 'center',
    maxWidth: 280,
    marginTop: theme.spacing.md,
  },
  progressWrap: { alignItems: 'center', marginTop: 40 },
  track: {
    width: 220,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    backgroundColor: 'rgba(221,181,176,0.22)',
  },
  fill: { height: 4, borderRadius: 2, backgroundColor: C.brand.mint },
  loading: {
    ...T.eyebrow,
    color: C.text.inverseSoft,
    marginTop: theme.spacing.lg,
  },
  preparing: { ...T.meta, color: 'rgba(221,181,176,0.85)', marginTop: theme.spacing.xs },
});
