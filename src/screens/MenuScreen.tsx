import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { GraduationCap, Settings } from 'lucide-react-native';
import { assets } from '../assets';
import { AppShell } from '../components/AppShell';
import { BottomTabs, TabKey } from '../components/BottomTabs';
import { ControlPanel } from '../components/ControlPanel';
import { DailyGoalMeter } from '../components/DailyGoalMeter';
import { EmptyState } from '../components/EmptyState';
import { PrimaryButton } from '../components/PrimaryButton';
import { RootCard } from '../components/RootCard';
import { FilterValue, RootFilter } from '../components/RootFilter';
import { ScreenHeader } from '../components/ScreenHeader';
import { ENTER_MS, FADE_MS } from '../constants/config';
import { C, CONTENT_MAX_W, T, theme } from '../constants/theme';
import { ROOTS, getRoot } from '../game/curriculum';
import {
  STATUS_LABEL,
  nextRootId,
  rootProgressOf,
  statusOf,
  todayCount,
} from '../game/progress';
import type { ProgressState, RootStatus } from '../game/types';
import { useReduceMotion } from '../hooks/useMotionPreference';

type Row = {
  id: string;
  form: string;
  meaning: string;
  status: RootStatus;
  statusLabel: string;
  builtCount: number;
  lastScore: number | null;
};

type Props = {
  state: ProgressState;
  onOpenRoot: (rootId: string) => void;
  onSelectTab: (tab: TabKey) => void;
};

export function MenuScreen({ state, onOpenRoot, onSelectTab }: Props) {
  const [filter, setFilter] = useState<FilterValue>('all');
  const fade = useRef(new Animated.Value(0)).current;
  const lift = useRef(new Animated.Value(6)).current;
  const reduceMotion = useReduceMotion();

  useEffect(() => {
    if (reduceMotion) {
      fade.setValue(1);
      lift.setValue(0);
      return;
    }
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: FADE_MS, useNativeDriver: true }),
      Animated.timing(lift, { toValue: 0, duration: ENTER_MS, useNativeDriver: true }),
    ]).start();
  }, [fade, lift, reduceMotion]);

  const rows = useMemo<Row[]>(
    () =>
      ROOTS.map(root => {
        const progress = rootProgressOf(state, root.id);
        const status = statusOf(state, root.id);
        return {
          id: root.id,
          form: root.form,
          meaning: root.meaning,
          status,
          statusLabel: STATUS_LABEL[status],
          builtCount: progress.completedBuilderWordIds.length,
          lastScore: progress.lastScore,
        };
      }),
    [state],
  );

  const visibleRows = useMemo(() => {
    if (filter === 'learning') {
      return rows.filter(row => row.status === 'learning');
    }
    if (filter === 'mastered') {
      return rows.filter(row => row.status === 'mastered' || row.status === 'review');
    }
    return rows;
  }, [filter, rows]);

  const nextId = useMemo(() => nextRootId(state), [state]);
  const nextRoot = getRoot(nextId);
  const completedToday = todayCount(state);
  const goal = state.preferences.dailyGoal;

  const openSettings = useCallback(() => onSelectTab('settings'), [onSelectTab]);
  const startLesson = useCallback(() => onOpenRoot(nextId), [nextId, onOpenRoot]);
  const showAll = useCallback(() => setFilter('all'), []);

  const keyExtractor = useCallback((row: Row) => row.id, []);

  const renderItem = useCallback(
    ({ item }: { item: Row }) => (
      <RootCard
        rootId={item.id}
        form={item.form}
        meaning={item.meaning}
        status={item.status}
        statusLabel={item.statusLabel}
        builtCount={item.builtCount}
        lastScore={item.lastScore}
        onOpen={onOpenRoot}
      />
    ),
    [onOpenRoot],
  );

  const listHeader = useMemo(
    () => (
      <View style={styles.header}>
        <View style={styles.heroRow}>
          <View style={styles.heroText}>
            <Text style={styles.heroTitle}>Vocabulary</Text>
            <Text style={styles.heroTitle}>Root Builder</Text>
            <Text style={styles.heroSubtitle}>Build meaning, one root at a time.</Text>
          </View>
          <View style={styles.heroArt}>
            <Image source={assets.sprite1} style={styles.heroImage} resizeMode="contain" />
          </View>
        </View>

        <View style={styles.goalBlock}>
          <DailyGoalMeter completedCount={completedToday} goal={goal} />
        </View>

        <View style={styles.filterBlock}>
          <RootFilter value={filter} onChange={setFilter} />
        </View>
      </View>
    ),
    [completedToday, filter, goal],
  );

  return (
    <AppShell variant="menu">
      <ScreenHeader
        title="Roots"
        trailing={{ Icon: Settings, label: 'Settings', onPress: openSettings }}
      />

      <Animated.View
        pointerEvents="box-none"
        style={[styles.listWrap, { opacity: fade, transform: [{ translateY: lift }] }]}>
        <FlatList
          data={visibleRows}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ListHeaderComponent={listHeader}
          ListEmptyComponent={
            <EmptyState
              title="No roots here yet."
              description="Change the filter to see the rest of the starter pack."
              actionLabel="All roots"
              onAction={showAll}
            />
          }
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={Separator}
          showsVerticalScrollIndicator={false}
          initialNumToRender={6}
          windowSize={5}
          removeClippedSubviews={false}
        />
      </Animated.View>

      <ControlPanel hint={'Next: ' + nextRoot.form + ' · ' + nextRoot.meaning}>
        <PrimaryButton
          label="START LESSON"
          Icon={GraduationCap}
          onPress={startLesson}
          accessibilityHint={'Opens the lesson for ' + nextRoot.form}
        />
      </ControlPanel>

      <BottomTabs selectedTab="roots" onSelectTab={onSelectTab} />
    </AppShell>
  );
}

function Separator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  listWrap: { flex: 1 },
  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
    alignSelf: 'center',
    width: '100%',
    maxWidth: CONTENT_MAX_W + 32,
  },
  header: { marginBottom: theme.spacing.xl },
  heroRow: { flexDirection: 'row', alignItems: 'flex-start' },
  heroText: { flex: 1, paddingRight: theme.spacing.lg },
  heroTitle: { ...T.hero, color: C.text.primary },
  heroSubtitle: { ...T.body, color: C.text.secondary, marginTop: theme.spacing.sm },
  heroArt: { width: 96, alignItems: 'flex-end', justifyContent: 'flex-start' },
  heroImage: { width: 96, height: 96 },
  goalBlock: {
    marginTop: theme.spacing.xl,
    backgroundColor: 'rgba(250,245,236,0.72)',
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: C.ui.border,
    padding: theme.spacing.lg,
  },
  filterBlock: { marginTop: theme.spacing.xl },
  separator: { height: 12 },
});
