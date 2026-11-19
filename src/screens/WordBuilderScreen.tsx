import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Animated, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { ArrowLeft, Check, ListChecks } from 'lucide-react-native';
import { ControlPanel } from '../components/ControlPanel';
import { MeaningCard } from '../components/MeaningCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { SlotKind, WordAssemblyBoard } from '../components/WordAssemblyBoard';
import { ENTER_MS } from '../constants/config';
import { C, CONTENT_MAX_W, T, theme } from '../constants/theme';
import {
  NO_PREFIX,
  NO_SUFFIX,
  PartChoice,
  checkCombination,
  choicesForRole,
  joinedSpelling,
} from '../game/assembly';
import { decompose, getRoot, getWord } from '../game/curriculum';
import { PHASE_STEP, PHASE_TITLE } from '../game/session';
import { useHaptics, useReduceMotion } from '../hooks/useMotionPreference';

function ChoiceButton({
  id,
  label,
  meaning,
  selected,
  onPress,
}: {
  id: string;
  label: string;
  meaning: string;
  selected: boolean;
  onPress: (id: string) => void;
}) {
  const handlePress = useCallback(() => onPress(id), [id, onPress]);
  return (
    <Pressable
      onPress={handlePress}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={label + ', ' + meaning}
      style={styles.choicePress}>
      <View style={[styles.choice, selected ? styles.choiceSelected : null]}>
        <Text style={styles.choiceLabel}>{label}</Text>
        <Text style={styles.choiceMeaning}>{meaning}</Text>
      </View>
    </Pressable>
  );
}

function labelFor(rootId: string, role: SlotKind, id: string): string {
  if (id === NO_PREFIX) {
    return 'No prefix';
  }
  if (id === NO_SUFFIX) {
    return 'No suffix';
  }
  const found = choicesForRole(rootId, role).find(choice => choice.id === id);
  if (found) {
    return found.label;
  }
  return role === 'prefix' ? 'No prefix' : 'No suffix';
}

function Separator() {
  return <View style={styles.separator} />;
}

type Props = {
  rootId: string;
  onBack: () => void;
  onWordComplete: (wordId: string) => void;
  onStartQuiz: () => void;
};

/** Guided assembly of the two prescribed words, in table order. */
export function WordBuilderScreen({ rootId, onBack, onWordComplete, onStartQuiz }: Props) {
  const root = getRoot(rootId);
  const targets = root.builderTargetIds;

  const [targetIndex, setTargetIndex] = useState(0);
  const [prefixId, setPrefixId] = useState<string>(NO_PREFIX);
  const [suffixId, setSuffixId] = useState<string>(NO_SUFFIX);
  const [activeSlot, setActiveSlot] = useState<SlotKind>('prefix');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [solved, setSolved] = useState(false);

  const settle = useRef(new Animated.Value(0)).current;
  const reduceMotion = useReduceMotion();
  const buzz = useHaptics();

  const target = getWord(targets[targetIndex]);
  const choices = useMemo(() => choicesForRole(rootId, activeSlot), [activeSlot, rootId]);
  const preview = joinedSpelling(rootId, prefixId, suffixId);

  const selectSlot = useCallback((kind: SlotKind) => setActiveSlot(kind), []);

  const pickChoice = useCallback(
    (choiceId: string) => {
      if (solved) {
        return;
      }
      if (activeSlot === 'prefix') {
        setPrefixId(choiceId);
      } else {
        setSuffixId(choiceId);
      }
      setFeedback(null);
      if (!reduceMotion) {
        settle.setValue(1);
        Animated.timing(settle, { toValue: 0, duration: ENTER_MS, useNativeDriver: true }).start();
      }
    },
    [activeSlot, reduceMotion, settle, solved],
  );

  const check = useCallback(() => {
    if (solved) {
      return;
    }
    const outcome = checkCombination(rootId, target.id, prefixId, suffixId);
    if (outcome.kind === 'correct') {
      setSolved(true);
      setFeedback('Correct');
      onWordComplete(target.id);
      buzz();
      return;
    }
    setFeedback(outcome.message);
  }, [buzz, onWordComplete, prefixId, rootId, solved, suffixId, target.id]);

  const nextWord = useCallback(() => {
    setTargetIndex(1);
    setPrefixId(NO_PREFIX);
    setSuffixId(NO_SUFFIX);
    setActiveSlot('prefix');
    setFeedback(null);
    setSolved(false);
  }, []);

  const actionLabel = !solved ? 'CHECK WORD' : targetIndex === 0 ? 'NEXT WORD' : 'START QUIZ';
  const actionPress = !solved ? check : targetIndex === 0 ? nextWord : onStartQuiz;
  const ActionIcon = solved && targetIndex === 1 ? ListChecks : Check;

  const keyExtractor = useCallback((choice: PartChoice) => choice.id, []);

  const renderChoice = useCallback(
    ({ item }: { item: PartChoice }) => (
      <ChoiceButton
        id={item.id}
        label={item.label}
        meaning={item.meaning}
        selected={(activeSlot === 'prefix' ? prefixId : suffixId) === item.id}
        onPress={pickChoice}
      />
    ),
    [activeSlot, pickChoice, prefixId, suffixId],
  );

  const header = (
    <View>
      <Text style={styles.wordCounter}>Word {targetIndex + 1} of 2</Text>
      <Animated.View
        pointerEvents="box-none"
        style={{ transform: [{ translateY: Animated.multiply(settle, 4) }] }}>
        <WordAssemblyBoard
          rootForm={root.form}
          rootMeaning={root.meaning}
          cue={'Build ' + target.spelling + ' from its parts.'}
          prefixValue={labelFor(rootId, 'prefix', prefixId)}
          suffixValue={labelFor(rootId, 'suffix', suffixId)}
          activeSlot={activeSlot}
          preview={preview}
          previewLabel={solved ? 'Your word' : 'Your combination'}
          onSelectSlot={selectSlot}
          feedback={feedback}
          feedbackTone={feedback === null ? 'none' : solved ? 'correct' : 'retry'}
        />
      </Animated.View>

      {solved ? (
        <View style={styles.resultWrap}>
          <MeaningCard
            word={target.spelling}
            decomposition={decompose(target.id)}
            definition={target.definition}
            example={target.example}
            tone="mint"
          />
        </View>
      ) : (
        <Text style={styles.bankTitle}>
          {activeSlot === 'prefix' ? 'Choose a prefix' : 'Choose a suffix'}
        </Text>
      )}
    </View>
  );

  return (
    <>
      <ScreenHeader
        title={PHASE_TITLE.builder}
        stepLabel={PHASE_STEP.builder}
        leading={{ Icon: ArrowLeft, label: 'Back to lesson', onPress: onBack }}
      />
      <FlatList
        style={styles.list}
        data={solved ? [] : choices}
        keyExtractor={keyExtractor}
        renderItem={renderChoice}
        ListHeaderComponent={header}
        ItemSeparatorComponent={Separator}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={false}
      />
      <ControlPanel
        hint={
          solved
            ? 'Saved. ' + target.spelling + ' is now in your workbook.'
            : 'Tap a slot, choose a part, then check the word.'
        }>
        <PrimaryButton label={actionLabel} Icon={ActionIcon} onPress={actionPress} />
      </ControlPanel>
    </>
  );
}

const styles = StyleSheet.create({
  list: { flex: 1 },
  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    alignSelf: 'center',
    width: '100%',
    maxWidth: CONTENT_MAX_W + 32,
  },
  wordCounter: { ...T.eyebrow, color: C.text.secondary, marginBottom: theme.spacing.md },
  bankTitle: {
    ...T.bodyStrong,
    color: C.text.primary,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.md,
  },
  resultWrap: { marginTop: theme.spacing.xl },
  choicePress: { width: '100%', minHeight: 48 },
  choice: {
    width: '100%',
    minHeight: 48,
    justifyContent: 'center',
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: C.ui.border,
    backgroundColor: C.bg.parchment,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  choiceSelected: { borderWidth: 2, borderColor: C.brand.burgundy, backgroundColor: C.ui.tint },
  choiceLabel: { ...T.bodyStrong, fontSize: 18, lineHeight: 24, color: C.text.primary },
  choiceMeaning: { ...T.meta, color: C.text.secondary },
  separator: { height: 10 },
});
