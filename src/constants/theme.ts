/**
 * WARM_EARTHY preset, editorial / magazine variant.
 * The `name` field must stay exactly as the preset defines it.
 */
import { Dimensions, Platform } from 'react-native';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

export const theme = {
  name: 'warm-earthy',
  colors: {
    bg: {
      primary: '#F6EDF1',
      secondary: '#F2EAD8',
      parchment: '#FAF5EC',
      ink: '#24181D',
    },
    brand: {
      burgundy: '#AB2A5A',
      mint: '#28E09C',
      blush: '#DDB5B0',
    },
    text: {
      primary: '#24181D',
      secondary: '#6D4B59',
      accent: '#AB2A5A',
      inverse: '#FAF5EC',
      inverseSoft: '#DDB5B0',
    },
    ui: {
      border: 'rgba(221, 181, 176, 0.65)',
      borderStrong: '#AB2A5A',
      rule: 'rgba(221, 181, 176, 0.45)',
      tint: 'rgba(221, 181, 176, 0.28)',
      mintTint: 'rgba(40, 224, 156, 0.16)',
    },
  },
  gradients: {
    // Loader: dark, 92% opaque -> clearly different from the light Menu
    loader: ['rgba(36,24,29,0.94)', 'rgba(171,42,90,0.92)'],
    menu: ['rgba(246,237,241,0.97)', 'rgba(242,234,216,0.97)'],
    lesson: ['rgba(246,237,241,0.97)', 'rgba(250,245,236,0.97)'],
    builder: ['rgba(242,234,216,0.97)', 'rgba(246,237,241,0.97)'],
    quiz: ['rgba(250,245,236,0.97)', 'rgba(246,237,241,0.97)'],
    result: ['rgba(171,42,90,0.95)', 'rgba(36,24,29,0.96)'],
    progress: ['rgba(246,237,241,0.97)', 'rgba(242,234,216,0.97)'],
    settings: ['rgba(250,245,236,0.97)', 'rgba(246,237,241,0.97)'],
    action: ['#28E09C', 'rgba(40,224,156,0.84)'],
    ink: ['#AB2A5A', '#24181D'],
  },
  typography: {
    hero: { fontSize: 40, lineHeight: 44, fontWeight: '700' as const, letterSpacing: -0.4 },
    rootHero: { fontSize: 48, lineHeight: 54, fontWeight: '700' as const, letterSpacing: -0.5 },
    title: { fontSize: 28, lineHeight: 34, fontWeight: '700' as const },
    word: { fontSize: 34, lineHeight: 40, fontWeight: '700' as const },
    preview: { fontSize: 28, lineHeight: 34, fontWeight: '700' as const },
    meaning: { fontSize: 24, lineHeight: 30, fontWeight: '600' as const },
    body: { fontSize: 16, lineHeight: 24, fontWeight: '400' as const },
    bodyStrong: { fontSize: 16, lineHeight: 24, fontWeight: '600' as const },
    button: { fontSize: 16, lineHeight: 24, fontWeight: '700' as const, letterSpacing: 0.2 },
    meta: { fontSize: 13, lineHeight: 18, fontWeight: '500' as const },
    eyebrow: {
      fontSize: 13,
      lineHeight: 18,
      fontWeight: '700' as const,
      letterSpacing: 1.6,
      textTransform: 'uppercase' as const,
    },
    navLabel: { fontSize: 12, lineHeight: 16, fontWeight: '600' as const },
  },
  radius: { sm: 10, md: 14, lg: 16, xl: 18, full: 999 },
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 28 },
  shadows: {
    card: {
      shadowColor: '#24181D',
      shadowOpacity: 0.08,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 12,
      elevation: 2,
    },
    panel: {
      shadowColor: '#24181D',
      shadowOpacity: 0.12,
      shadowOffset: { width: 0, height: -2 },
      shadowRadius: 12,
      elevation: 4,
    },
    action: {
      shadowColor: '#28E09C',
      shadowOpacity: 0.2,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 10,
      elevation: 3,
    },
  },
};

export const C = theme.colors;
export const T = theme.typography;

export const HEADER_TOP_PAD = Platform.OS === 'android' ? 44 : 44;
export const SCREEN_WIDTH = SCREEN_W;
export const SCREEN_HEIGHT = SCREEN_H;

/** Shared content frame: never wider than 380 dp, always 16 dp of gutter. */
export const CONTENT_MAX_W = Math.min(SCREEN_W - 32, 380);

export type Theme = typeof theme;
