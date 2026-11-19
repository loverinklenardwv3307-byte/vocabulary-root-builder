import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { CircleCheck, Home, RotateCcw, Target, Trophy } from 'lucide-react-native';
import { assets } from '../assets';
import { AppShell } from '../components/AppShell';
import { ControlPanel } from '../components/ControlPanel';
import { DailyGoalMeter } from '../components/DailyGoalMeter';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { SecondaryButton } from '../components/SecondaryButton';
import { StatCard } from '../components/StatCard';
import type { IconComponent } from '../components/icons';
import { FADE_MS, QUIZ_LENGTH } from '../constants/config';
import { C, CONTENT_MAX_W, T, theme } from '../constants/theme';
import { decompose, getRoot, getWord } from '../game/curriculum';
import type { AttemptResult } from '../game/types';
import { useReduceMotion } from '../hooks/useMotionPreference';

type ReviewRow = {
  wordId: string;
  spelling: string;
  definition: string;
  correct: boolean;
};

function ReviewItem({
  wordId,
  spelling,
  definition,
  correct,
  expanded,
  onToggle,
}: ReviewRow & { expanded: boolean; onToggle: (wordId: string) => void }) {
  const handlePress = useCallback(() => onToggle(wordId), [onToggle, wordId]);
  const word = getWord(wordId);
  return (
    <Pressable
      onPress={handlePress}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      accessibilityRole="button"
      accessibilityState={{ expanded }}
      accessibilityLabel={spelling + '. ' + definition + '. ' + (correct ? 'Correct' : 'Review')}
      style={styles.reviewPress}>
      <View style={styles.reviewRow}>
        <View style={styles.reviewBody}>
          <Text style={styles.reviewWord}>{spelling}</Text>
          <Text style={styles.reviewDefinition}>{definition}</Text>
          {expanded ? (
            <View style={styles.reviewExtra}>
              <Text style={styles.reviewSplit}>{decompose(wordId)}</Text>
              <Text style={styles.reviewExample}>{word.example}</Text>
            </View>
          ) : null}
        </View>
        <View style={[styles.reviewTag, correct ? styles.reviewTagOk : styles.reviewTagNo]}>
          <Text style={[styles.reviewTagText, correct ? styles.tagTextOk : styles.tagTextNo]}>
            {correct ? 'Correct' : 'Review'}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

type Props = {
  result: AttemptResult;
  onPracticeAgain: () => void;
  onBackToRoots: () => void;
};

export function GameOverScreen({ result, onPracticeAgain, onBackToRoots }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const fade = useRef(new Animated.Value(0)).current;
  const reduceMotion = useReduceMotion();
  const root = getRoot(result.rootId);

  useEffect(() => {
    if (reduceMotion) {
      fade.setValue(1);
      return;
    }
    Animated.timing(fade, { toValue: 1, duration: FADE_MS, useNativeDriver: true }).start();
  }, [fade, reduceMotion]);

  const toggle = useCallback((wordId: string) => {
    setExpandedId(current => (current === wordId ? null : wordId));
  }, []);

  const keyExtractor = useCallback((row: ReviewRow) => row.wordId, []);

  const renderItem = useCallback(
    ({ item }: { item: ReviewRow }) => (
      <ReviewItem
        wordId={item.wordId}
        spelling={item.spelling}
        definition={item.definition}
        correct={item.correct}
        expanded={expandedId === item.wordId}
        onToggle={toggle}
      />
    ),
    [expandedId, toggle],
  );

  let feedback: string;
  if (!result.passed) {
    feedback = 'Review the parts, then try again.';
  } else if (result.newlyMastered) {
    feedback = root.form + ' mastered';
  } else if (result.alreadyMastered) {
    feedback = 'Practice saved';
  } else if (result.firstPassSaved) {
    feedback = 'First pass saved. Pass on another day to master ' + root.form + '.';
  } else {
    feedback = 'Attempt saved. Finish the lesson and both words to earn a pass.';
  }

  // Optional pills only: at least two positive metrics, otherwise no row.
  const positives = [
    result.score > 0
      ? { key: 'correct', value: result.score + '/' + QUIZ_LENGTH, label: 'correct', tint: '#17946A', Icon: CircleCheck }
      : null,
    result.accuracy > 0
      ? { key: 'accuracy', value: result.accuracy + '%', label: 'accuracy', tint: '#B5761F', Icon: Target }
      : null,
    result.masteredRootCount > 0
      ? { key: 'mastered', value: String(result.masteredRootCount), label: 'mastered', tint: C.brand.burgundy, Icon: Trophy }
      : null,
  ].filter(Boolean) as {
    key: string;
    value: string;
    label: string;
    tint: string;
    Icon: IconComponent;
  }[];

  const header = (
    <View>
      <View style={styles.decorRow}>
        <Image
          source={assets.sprite3}
          style={styles.decor}
          resizeMode="contain"
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        />
      </View>

      <View style={styles.mainCard}>
        <Text style={styles.eyebrow}>{root.form.toUpperCase()} QUIZ</Text>
        <Text style={styles.score}>
          {result.score} of {QUIZ_LENGTH} correct
        </Text>
        <Text style={styles.status}>{result.passed ? 'Quiz passed' : 'Keep building'}</Text>
        <Text style={styles.feedback}>{feedback}</Text>
        <View style={styles.goalWrap}>
          <DailyGoalMeter
            completedCount={result.todayCount}
            goal={result.goal}
            label="Completed today"
          />
        </View>
      </View>

      {positives.length >= 2 ? (
        <View style={styles.statsRow}>
          {positives.map(pill => (
            <View key={pill.key} style={styles.statSlot}>
              <StatCard value={pill.value} label={pill.label} tint={pill.tint} Icon={pill.Icon} />
            </View>
          ))}
        </View>
      ) : null}

      <Text style={styles.sectionTitle}>Review the five words</Text>
    </View>
  );

  return (
    <AppShell variant="result">
      <ScreenHeader
        title="Session Result"
        tone="dark"
        trailing={{ Icon: Home, label: 'Back to roots', onPress: onBackToRoots }}
      />
      <Animated.View pointerEvents="box-none" style={[styles.listWrap, { opacity: fade }]}>
        <FlatList
          data={result.review}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ListHeaderComponent={header}
          ItemSeparatorComponent={Separator}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          extraData={expandedId}
          removeClippedSubviews={false}
        />
      </Animated.View>
      <ControlPanel tone="dark">
        <PrimaryButton label="PRACTICE AGAIN" Icon={RotateCcw} onPress={onPracticeAgain} />
        <View style={styles.secondaryWrap}>
          <SecondaryButton label="BACK TO ROOTS" Icon={Home} onPress={onBackToRoots} tone="dark" />
        </View>
      </ControlPanel>
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
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    alignSelf: 'center',
    width: '100%',
    maxWidth: CONTENT_MAX_W + 32,
  },
  decorRow: { alignItems: 'center', marginBottom: theme.spacing.md },
  decor: { width: 72, height: 72 },
  mainCard: {
    borderRadius: theme.radius.xl,
    backgroundColor: C.bg.parchment,
    borderWidth: 1,
    borderColor: C.ui.border,
    padding: theme.spacing.xl,
    ...theme.shadows.card,
  },
  eyebrow: { ...T.eyebrow, color: C.brand.burgundy },
  score: { fontSize: 40, lineHeight: 46, fontWeight: '700', color: C.text.primary, marginTop: 4 },
  status: { ...T.meaning, color: C.brand.burgundy },
  feedback: { ...T.body, color: C.text.secondary, marginTop: theme.spacing.md },
  goalWrap: {
    marginTop: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: C.ui.rule,
  },
  statsRow: { flexDirection: 'row', gap: theme.spacing.md, marginTop: theme.spacing.lg },
  statSlot: { flex: 1 },
  sectionTitle: {
    ...T.title,
    fontSize: 22,
    lineHeight: 28,
    color: C.text.inverse,
    marginTop: theme.spacing.xxl,
    marginBottom: theme.spacing.md,
  },
  reviewPress: { width: '100%', minHeight: 56 },
  reviewRow: {
    width: '100%',
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: theme.radius.md,
    backgroundColor: 'rgba(250,245,236,0.94)',
    borderWidth: 1,
    borderColor: C.ui.border,
    padding: theme.spacing.lg,
  },
  reviewBody: { flex: 1, paddingRight: theme.spacing.md },
  reviewWord: { ...T.bodyStrong, fontSize: 18, lineHeight: 24, color: C.text.primary },
  reviewDefinition: { ...T.body, color: C.text.secondary, marginTop: 2 },
  reviewExtra: { marginTop: theme.spacing.sm },
  reviewSplit: { ...T.meta, color: C.brand.burgundy, letterSpacing: 0.6 },
  reviewExample: { ...T.body, color: C.text.secondary, fontStyle: 'italic', marginTop: 2 },
  reviewTag: { borderRadius: theme.radius.full, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 4 },
  reviewTagOk: { borderColor: 'rgba(23,148,106,0.8)', backgroundColor: 'rgba(40,224,156,0.16)' },
  reviewTagNo: { borderColor: C.brand.burgundy, backgroundColor: 'rgba(171,42,90,0.08)' },
  reviewTagText: { ...T.meta, fontWeight: '700' },
  tagTextOk: { color: '#17946A' },
  tagTextNo: { color: C.brand.burgundy },
  separator: { height: 10 },
  secondaryWrap: { marginTop: theme.spacing.md },
});
