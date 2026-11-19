import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { SCREEN_HEIGHT } from '../constants/theme';

type Props = {
  tone?: 'ink' | 'paper';
  spacing?: number;
  opacity?: number;
  vertical?: boolean;
};

/**
 * Sparse ruled-paper decor. Purely visual: it never receives touches and is
 * hidden from accessibility.
 */
function PaperLinesBase({ tone = 'ink', spacing = 28, opacity = 0.05, vertical = false }: Props) {
  const color = tone === 'ink' ? 'rgba(36,24,29,1)' : 'rgba(250,245,236,1)';
  const count = Math.ceil((vertical ? 420 : SCREEN_HEIGHT + 120) / spacing);

  const lines = useMemo(() => {
    const out: number[] = [];
    for (let i = 0; i < count; i += 1) {
      out.push(i * spacing);
    }
    return out;
  }, [count, spacing]);

  return (
    <View
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden>
      {lines.map(offset =>
        vertical ? (
          <View
            key={offset}
            style={[styles.vLine, { left: offset, backgroundColor: color, opacity }]}
          />
        ) : (
          <View
            key={offset}
            style={[styles.hLine, { top: offset, backgroundColor: color, opacity }]}
          />
        ),
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  hLine: { position: 'absolute', left: 0, right: 0, height: 1 },
  vLine: { position: 'absolute', top: 0, bottom: 0, width: 1 },
});

export const PaperLines = React.memo(PaperLinesBase);
