import React, { useCallback, useMemo } from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { GraduationCap } from 'lucide-react-native';
import { assets } from '../assets';
import { ActivityWeek } from '../components/ActivityWeek';
import { AppShell } from '../components/AppShell';
import { BottomTabs, TabKey } from '../components/BottomTabs';
import { ControlPanel } from '../components/ControlPanel';
import { MasteryMeter } from '../components/MasteryMeter';
import { PrimaryButton } from '../components/PrimaryButton';
import { RootCard } from '../components/RootCard';
import { ScreenHeader } from '../components/ScreenHeader';
import { WORD_COUNT } from '../constants/config';
import { C, CONTENT_MAX_W, T, theme } from '../constants/theme';
import { ROOTS } from '../game/curriculum';
import {
  STATUS_LABEL,
  creditsForDate,
  masteredCount,
  nextRootId,
  rootProgressOf,
  statusOf,
} from '../game/progress';
import type { ProgressState, RootStatus } from '../game/types';
import { lastSevenKeys } from '../utils/localDates';

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

export function ProgressScreen({ state, onOpenRoot, onSelectTab }: Props) {
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

  const weekKeys = useMemo(() => lastSevenKeys(), []);
  const weekCredits = useMemo(
    () => weekKeys.map(key => creditsForDate(state, key).length),
    [state, weekKeys],
  );

  const mastered = masteredCount(state);
  const discovered = state.discoveredWordIds.length;
  const startedAnything = rows.some(row => row.status !== 'new');
  const nextId = useMemo(() => nextRootId(state), [state]);

  const startLesson = useCallback(() => onOpenRoot(nextId), [nextId, onOpenRoot]);
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

  const header = (
    <View>
      <View style={styles.summaryCard}>
        <MasteryMeter rootCount={ROOTS.length} masteredCount={mastered} />
        <Text style={styles.discovered}>
          {discovered} words discovered out of {WORD_COUNT}
        </Text>
        <Image
          source={assets.sprite5}
          style={styles.summaryArt}
          resizeMode="contain"
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        />
      </View>

      <View style={styles.activityCard}>
        <ActivityWeek dateKeys={weekKeys} credits={weekCredits} />
      </View>

      {startedAnything ? null : (
        <View style={styles.newUserCard}>
          <Text style={styles.newUserTitle}>Your workbook starts here.</Text>
          <Text style={styles.newUserBody}>Learn a root and take its quiz.</Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>All roots</Text>
    </View>
  );

  return (
    <AppShell variant="progress">
      <ScreenHeader title="Progress" />
      <FlatList
        style={styles.list}
        data={rows}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={header}
        ItemSeparatorComponent={Separator}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={false}
      />
      <ControlPanel hint="Pick up where you left off.">
        <PrimaryButton label="START LESSON" Icon={GraduationCap} onPress={startLesson} />
      </ControlPanel>
      <BottomTabs selectedTab="progress" onSelectTab={onSelectTab} />
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
  summaryCard: {
    borderRadius: theme.radius.xl,
    backgroundColor: C.bg.parchment,
    borderWidth: 1,
    borderColor: C.ui.border,
    padding: theme.spacing.xl,
    paddingRight: 92,
    overflow: 'hidden',
    ...theme.shadows.card,
  },
  summaryArt: { position: 'absolute', right: 12, bottom: 12, width: 56, height: 56, opacity: 0.9 },
  discovered: { ...T.body, color: C.text.secondary, marginTop: theme.spacing.lg },
  activityCard: {
    marginTop: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    backgroundColor: 'rgba(250,245,236,0.88)',
    borderWidth: 1,
    borderColor: C.ui.border,
    padding: theme.spacing.xl,
  },
  newUserCard: {
    marginTop: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    backgroundColor: C.ui.tint,
    borderWidth: 1,
    borderColor: C.ui.border,
    padding: theme.spacing.xl,
  },
  newUserTitle: { ...T.bodyStrong, color: C.text.primary },
  newUserBody: { ...T.body, color: C.text.secondary, marginTop: 2 },
  sectionTitle: {
    ...T.title,
    fontSize: 22,
    lineHeight: 28,
    color: C.text.primary,
    marginTop: theme.spacing.xxl,
    marginBottom: theme.spacing.md,
  },
  separator: { height: 12 },
});
