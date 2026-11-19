import React, { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BookOpen, ChartColumn, Settings } from 'lucide-react-native';
import { C, T, theme } from '../constants/theme';
import type { IconComponent } from './icons';

export type TabKey = 'roots' | 'progress' | 'settings';

const TABS: { key: TabKey; label: string; Icon: IconComponent }[] = [
  { key: 'roots', label: 'Roots', Icon: BookOpen },
  { key: 'progress', label: 'Progress', Icon: ChartColumn },
  { key: 'settings', label: 'Settings', Icon: Settings },
];

function Tab({
  tabKey,
  label,
  Icon,
  selected,
  onSelect,
}: {
  tabKey: TabKey;
  label: string;
  Icon: IconComponent;
  selected: boolean;
  onSelect: (key: TabKey) => void;
}) {
  const handlePress = useCallback(() => onSelect(tabKey), [onSelect, tabKey]);
  const tint = selected ? C.brand.burgundy : C.text.secondary;

  return (
    <Pressable
      onPress={handlePress}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      style={styles.tab}>
      <View style={styles.tabInner}>
        <Icon size={24} color={tint} strokeWidth={selected ? 2.4 : 1.9} />
        <Text style={[styles.label, { color: tint }]}>{label}</Text>
        <View style={[styles.indicator, selected ? styles.indicatorOn : null]} />
      </View>
    </Pressable>
  );
}

export function BottomTabs({
  selectedTab,
  onSelectTab,
}: {
  selectedTab: TabKey;
  onSelectTab: (key: TabKey) => void;
}) {
  return (
    <View style={styles.bar}>
      {TABS.map(tab => (
        <Tab
          key={tab.key}
          tabKey={tab.key}
          label={tab.label}
          Icon={tab.Icon}
          selected={tab.key === selectedTab}
          onSelect={onSelectTab}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(250,245,236,0.96)',
    borderTopWidth: 1,
    borderTopColor: C.ui.border,
    paddingBottom: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
  },
  tab: { flex: 1, height: 64 },
  tabInner: { width: '100%', height: 64, alignItems: 'center', justifyContent: 'center' },
  label: { ...T.navLabel, marginTop: 3 },
  indicator: {
    width: 22,
    height: 3,
    borderRadius: 2,
    marginTop: 4,
    backgroundColor: 'transparent',
  },
  indicatorOn: { backgroundColor: C.brand.burgundy },
});
