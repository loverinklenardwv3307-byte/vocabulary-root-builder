import React from 'react';
import { Image, StatusBar, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { assets } from '../assets';
import { theme } from '../constants/theme';
import { PaperLines } from './PaperLines';

export type ShellVariant =
  | 'loader'
  | 'menu'
  | 'lesson'
  | 'builder'
  | 'quiz'
  | 'result'
  | 'progress'
  | 'settings';

const DARK_VARIANTS: ShellVariant[] = ['loader', 'result'];

type Props = {
  variant: ShellVariant;
  children: React.ReactNode;
};

/**
 * One background illustration for every screen; the gradient overlay and the
 * ruled-paper decor are what tell the screens apart.
 */
export function AppShell({ variant, children }: Props) {
  const dark = DARK_VARIANTS.indexOf(variant) >= 0;
  const colors = theme.gradients[variant];

  return (
    <View style={styles.root}>
      <Image
        source={assets.bg}
        style={styles.bg}
        resizeMode="cover"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      />
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <PaperLines
        tone={dark ? 'paper' : 'ink'}
        spacing={28}
        opacity={dark ? 0.06 : 0.04}
        vertical={variant === 'progress'}
      />
      <StatusBar
        barStyle={dark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg.primary },
  bg: { ...StyleSheet.absoluteFillObject, width: undefined, height: undefined },
  content: { flex: 1 },
});
