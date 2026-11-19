import React, { useCallback, useMemo } from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { ArrowLeft, Blocks, Check, ListChecks } from 'lucide-react-native';
import { assets } from '../assets';
import { ControlPanel } from '../components/ControlPanel';
import { MeaningCard } from '../components/MeaningCard';
import { PartChip } from '../components/PartChip';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { SecondaryButton } from '../components/SecondaryButton';
import { C, CONTENT_MAX_W, T, theme } from '../constants/theme';
import {
  bareForm,
  decompose,
  getPart,
  getRoot,
  getWord,
  partsForRoot,
} from '../game/curriculum';
import { PHASE_STEP, PHASE_TITLE } from '../game/session';

type PartRow = {
  id: string;
  form: string;
  role: string;
  meaning: string;
  note?: string;
};

type Props = {
  rootId: string;
  lessonSaved: boolean;
  quizUnlocked: boolean;
  onBack: () => void;
  onBuildWords: () => void;
  onGoToQuiz: () => void;
};

export function RootLessonScreen({
  rootId,
  lessonSaved,
  quizUnlocked,
  onBack,
  onBuildWords,
  onGoToQuiz,
}: Props) {
  const root = getRoot(rootId);
  const worked = getWord(root.workedExampleId);
  const workedPrefix = getPart(worked.prefixId);
  const workedSuffix = getPart(worked.suffixId);

  const rows = useMemo<PartRow[]>(() => {
    const parts = partsForRoot(rootId);
    const prefixRows = parts.prefixes.map(part => ({
      id: part.id,
      form: part.form,
      role: 'Prefix',
      meaning: part.meaning,
      note: part.note,
    }));
    const suffixRows = parts.suffixes.map(part => ({
      id: part.id,
      form: part.form,
      role: 'Suffix',
      meaning: part.meaning,
      note: part.note,
    }));
    return prefixRows.concat(suffixRows);
  }, [rootId]);

  const keyExtractor = useCallback((row: PartRow) => row.id, []);

  const renderItem = useCallback(
    ({ item }: { item: PartRow }) => (
      <View style={styles.partRow}>
        <View style={styles.partFormWrap}>
          <Text style={styles.partForm}>{item.form}</Text>
          <Text style={styles.partRole}>{item.role}</Text>
        </View>
        <View style={styles.partBody}>
          <Text style={styles.partMeaning}>{item.meaning}</Text>
          {item.note ? <Text style={styles.partNote}>{item.note}</Text> : null}
        </View>
      </View>
    ),
    [],
  );

  const header = useMemo(
    () => (
      <View>
        <View style={styles.rootCard}>
          <Text style={styles.eyebrow}>LATIN ROOT</Text>
          <Text style={styles.rootForm}>{root.form}</Text>
          <Text style={styles.rootMeaning}>{root.meaning}</Text>
          <Text style={styles.rootBody}>A root is a word part that carries meaning.</Text>
          <Image
            source={assets.sprite2}
            style={styles.rootArt}
            resizeMode="contain"
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          />
        </View>

        {lessonSaved ? (
          <View style={styles.savedRow}>
            <Check size={16} color={C.brand.burgundy} strokeWidth={2.6} />
            <Text style={styles.savedText}>Lesson saved</Text>
          </View>
        ) : null}

        <Text style={styles.sectionTitle}>Worked example</Text>
        <View style={styles.chipRow}>
          {workedPrefix ? (
            <PartChip
              form={bareForm(workedPrefix)}
              role="prefix"
              meaning={workedPrefix.meaning}
              compact
            />
          ) : null}
          <PartChip form={root.form} role="root" meaning={root.meaning} compact />
          {workedSuffix ? (
            <PartChip
              form={bareForm(workedSuffix)}
              role="suffix"
              meaning={workedSuffix.meaning}
              compact
            />
          ) : null}
        </View>
        <MeaningCard
          word={worked.spelling}
          decomposition={decompose(worked.id)}
          definition={worked.definition}
          example={worked.example}
          note="Parts give a clue. A dictionary meaning can be more specific."
        />

        <Text style={styles.sectionTitle}>Parts to know</Text>
        <Text style={styles.sectionBody}>
          These are the prefixes and suffixes used by the five {root.form} words in this pack.
        </Text>
      </View>
    ),
    [lessonSaved, root.form, root.meaning, worked, workedPrefix, workedSuffix],
  );

  return (
    <>
      <ScreenHeader
        title={PHASE_TITLE.lesson}
        stepLabel={PHASE_STEP.lesson}
        leading={{ Icon: ArrowLeft, label: 'Back to roots', onPress: onBack }}
      />
      <FlatList
        style={styles.list}
        data={rows}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={header}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={Separator}
        showsVerticalScrollIndicator={false}
        initialNumToRender={8}
        removeClippedSubviews={false}
      />
      <ControlPanel hint="Read the root and its parts, then try two words.">
        <PrimaryButton label="BUILD WORDS" Icon={Blocks} onPress={onBuildWords} />
        {quizUnlocked ? (
          <View style={styles.secondaryWrap}>
            <SecondaryButton label="GO TO QUIZ" Icon={ListChecks} onPress={onGoToQuiz} />
          </View>
        ) : null}
      </ControlPanel>
    </>
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
  rootCard: {
    borderRadius: theme.radius.xl,
    backgroundColor: C.bg.parchment,
    borderWidth: 1,
    borderColor: C.ui.border,
    padding: theme.spacing.xl,
    paddingRight: 96,
    overflow: 'hidden',
    ...theme.shadows.card,
  },
  rootArt: { position: 'absolute', right: 12, bottom: 12, width: 64, height: 64, opacity: 0.9 },
  eyebrow: { ...T.eyebrow, color: C.brand.burgundy },
  rootForm: { ...T.rootHero, color: C.brand.burgundy, marginTop: 2 },
  rootMeaning: { ...T.meaning, color: C.text.primary },
  rootBody: { ...T.body, color: C.text.secondary, marginTop: theme.spacing.md },
  savedRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: theme.spacing.md },
  savedText: { ...T.meta, color: C.brand.burgundy, fontWeight: '700' },
  sectionTitle: {
    ...T.title,
    fontSize: 22,
    lineHeight: 28,
    color: C.text.primary,
    marginTop: theme.spacing.xxl,
    marginBottom: theme.spacing.md,
  },
  sectionBody: { ...T.body, color: C.text.secondary, marginBottom: theme.spacing.lg },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm, marginBottom: theme.spacing.lg },
  partRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(250,245,236,0.82)',
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: C.ui.rule,
    padding: theme.spacing.lg,
    minHeight: 56,
  },
  partFormWrap: { width: 92, paddingRight: theme.spacing.md },
  partForm: { ...T.bodyStrong, fontSize: 18, lineHeight: 24, color: C.brand.burgundy },
  partRole: { ...T.meta, color: C.text.secondary },
  partBody: { flex: 1 },
  partMeaning: { ...T.body, color: C.text.primary },
  partNote: { ...T.meta, color: C.text.secondary, marginTop: 2 },
  separator: { height: 10 },
  secondaryWrap: { marginTop: theme.spacing.md },
});
