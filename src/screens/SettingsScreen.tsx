import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { Check, Save } from 'lucide-react-native';
import { assets } from '../assets';
import { AppShell } from '../components/AppShell';
import { BottomTabs, TabKey } from '../components/BottomTabs';
import { ControlPanel } from '../components/ControlPanel';
import { GoalStepper } from '../components/GoalStepper';
import { PreferenceRow } from '../components/PreferenceRow';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { CHECKMARK_MS, DAILY_GOAL_MAX, DAILY_GOAL_MIN } from '../constants/config';
import { C, CONTENT_MAX_W, T, theme } from '../constants/theme';
import type { Preferences } from '../game/types';

type Block = { key: string };

const BLOCKS: Block[] = [{ key: 'goal' }, { key: 'preferences' }, { key: 'privacy' }];

type Props = {
  preferences: Preferences;
  onSave: (next: Preferences) => void;
  onSelectTab: (tab: TabKey) => void;
};

export function SettingsScreen({ preferences, onSave, onSelectTab }: Props) {
  const [draft, setDraft] = useState<Preferences>(preferences);
  const [saved, setSaved] = useState(false);
  const check = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setDraft(preferences);
  }, [preferences]);

  const dirty =
    draft.dailyGoal !== preferences.dailyGoal ||
    draft.haptics !== preferences.haptics ||
    draft.reduceMotion !== preferences.reduceMotion;

  const setGoal = useCallback((next: number) => {
    setSaved(false);
    setDraft(current => ({ ...current, dailyGoal: next }));
  }, []);

  const setHaptics = useCallback((next: boolean) => {
    setSaved(false);
    setDraft(current => ({ ...current, haptics: next }));
  }, []);

  const setReduceMotion = useCallback((next: boolean) => {
    setSaved(false);
    setDraft(current => ({ ...current, reduceMotion: next }));
  }, []);

  const save = useCallback(() => {
    onSave(draft);
    setSaved(true);
    check.setValue(0);
    Animated.timing(check, {
      toValue: 1,
      duration: CHECKMARK_MS,
      useNativeDriver: true,
    }).start();
  }, [check, draft, onSave]);

  const keyExtractor = useCallback((block: Block) => block.key, []);

  const renderItem = useCallback(
    ({ item }: { item: Block }) => {
      if (item.key === 'goal') {
        return (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Daily goal</Text>
            <Text style={styles.cardBody}>
              Complete a root's lesson and pass its quiz to count it today.
            </Text>
            <View style={styles.stepperWrap}>
              <GoalStepper
                value={draft.dailyGoal}
                minimum={DAILY_GOAL_MIN}
                maximum={DAILY_GOAL_MAX}
                onChange={setGoal}
              />
            </View>
          </View>
        );
      }
      if (item.key === 'preferences') {
        return (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Preferences</Text>
            <PreferenceRow
              label="Haptic feedback"
              description="A short buzz when an answer is saved."
              value={draft.haptics}
              onChange={setHaptics}
            />
            <View style={styles.divider} />
            <PreferenceRow
              label="Reduce motion"
              description="Replace movement with simple fades."
              value={draft.reduceMotion}
              onChange={setReduceMotion}
            />
          </View>
        );
      }
      return (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Privacy</Text>
          <Text style={styles.cardBody}>Your lessons and progress are stored on this device.</Text>
          <Text style={styles.cardBody}>No account is needed.</Text>
          <Image
            source={assets.sprite4}
            style={styles.art}
            resizeMode="contain"
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          />
        </View>
      );
    },
    [draft, setGoal, setHaptics, setReduceMotion],
  );

  return (
    <AppShell variant="settings">
      <ScreenHeader title="Settings" />
      <FlatList
        style={styles.list}
        data={BLOCKS}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ItemSeparatorComponent={Separator}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        extraData={draft}
        removeClippedSubviews={false}
      />
      <ControlPanel hint={saved ? undefined : 'Changes apply after you save.'}>
        {saved ? (
          <Animated.View pointerEvents="none" style={[styles.savedRow, { opacity: check }]}>
            <Check size={18} color={C.brand.burgundy} strokeWidth={2.6} />
            <Text style={styles.savedText}>Saved</Text>
          </Animated.View>
        ) : null}
        <PrimaryButton label="SAVE SETTINGS" Icon={Save} onPress={save} disabled={!dirty} />
      </ControlPanel>
      <BottomTabs selectedTab="settings" onSelectTab={onSelectTab} />
    </AppShell>
  );
}

function Separator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  list: { flex: 1 },
  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
    alignSelf: 'center',
    width: '100%',
    maxWidth: CONTENT_MAX_W + 32,
  },
  card: {
    borderRadius: theme.radius.xl,
    backgroundColor: C.bg.parchment,
    borderWidth: 1,
    borderColor: C.ui.border,
    padding: theme.spacing.xl,
    overflow: 'hidden',
    ...theme.shadows.card,
  },
  cardTitle: { ...T.title, fontSize: 22, lineHeight: 28, color: C.text.primary },
  cardBody: { ...T.body, color: C.text.secondary, marginTop: theme.spacing.sm },
  stepperWrap: { marginTop: theme.spacing.xl },
  divider: { height: 1, backgroundColor: C.ui.rule, marginVertical: theme.spacing.sm },
  art: { position: 'absolute', right: 12, bottom: 12, width: 52, height: 52, opacity: 0.85 },
  savedRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: theme.spacing.md },
  savedText: { ...T.bodyStrong, color: C.brand.burgundy, lineHeight: 24 },
  separator: { height: 12 },
});
