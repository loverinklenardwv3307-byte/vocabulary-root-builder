import React, { createContext, useContext, useMemo } from 'react';
import { Vibration } from 'react-native';

type PreferenceValue = {
  reduceMotion: boolean;
  haptics: boolean;
};

const PreferenceContext = createContext<PreferenceValue>({ reduceMotion: false, haptics: true });

export function PreferenceProvider({
  reduceMotion,
  haptics,
  children,
}: {
  reduceMotion: boolean;
  haptics: boolean;
  children: React.ReactNode;
}) {
  const value = useMemo(() => ({ reduceMotion, haptics }), [reduceMotion, haptics]);
  return <PreferenceContext.Provider value={value}>{children}</PreferenceContext.Provider>;
}

/** Narrow selector: components take only the flag they need. */
export function useReduceMotion(): boolean {
  return useContext(PreferenceContext).reduceMotion;
}

export function useHaptics(): () => void {
  const enabled = useContext(PreferenceContext).haptics;
  return useMemo(
    () => () => {
      if (enabled) {
        // VIBRATE permission is declared in AndroidManifest.xml.
        Vibration.vibrate(18);
      }
    },
    [enabled],
  );
}
