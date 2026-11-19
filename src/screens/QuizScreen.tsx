import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Check, Flag, Pause } from 'lucide-react-native';
import { ControlPanel } from '../components/ControlPanel';
import { MeaningCard } from '../components/MeaningCard';
import { PauseSheet } from '../components/PauseSheet';
import { PrimaryButton } from '../components/PrimaryButton';
import { AnswerState, QuizAnswer } from '../components/QuizAnswer';
import { ScreenHeader } from '../components/ScreenHeader';
import { QUIZ_LENGTH } from '../constants/config';
import { C, CONTENT_MAX_W, T, theme } from '../constants/theme';
import { getPart, getWord } from '../game/curriculum';
import { PHASE_TITLE } from '../game/session';
import type { QuizAttempt } from '../game/types';
import { useHaptics } from '../hooks/useMotionPreference';

type OptionRow = {
  key: string;
  index: number;
  text: string;
};

type Props = {
  attempt: QuizAttempt;
  onCommitAnswer: (questionIndex: number, optionIndex: number) => void;
  onFinish: () => void;
  onLeave: () => void;
};

export function QuizScreen({ attempt, onCommitAnswer, onFinish, onLeave }: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const buzz = useHaptics();

  const question = attempt.questions[index];
  const answer = attempt.answers[index];
  const answered = answer !== null && answer !== undefined;
  const word = getWord(question.wordId);
  const prefix = getPart(word.prefixId);
  const suffix = getPart(word.suffixId);

  const select = useCallback(
    (optionIndex: number) => {
      if (attempt.answers[index] !== null) {
        return;
      }
      onCommitAnswer(index, optionIndex);
      buzz();
    },
    [attempt.answers, buzz, index, onCommitAnswer],
  );

  const advance = useCallback(() => {
    if (index < QUIZ_LENGTH - 1) {
      setIndex(index + 1);
      return;
    }
    onFinish();
  }, [index, onFinish]);

  const openPause = useCallback(() => setPaused(true), []);
  const closePause = useCallback(() => setPaused(false), []);
  const leave = useCallback(() => {
    setPaused(false);
    onLeave();
  }, [onLeave]);

  const rows: OptionRow[] = question.options.map((option, optionIndex) => ({
    key: question.wordId + '-' + optionIndex,
    index: optionIndex,
    text: option.definition,
  }));

  const correctIndex = question.correctIndex;

  const stateFor = useCallback(
    (optionIndex: number): AnswerState => {
      if (!answered) {
        return 'idle';
      }
      if (optionIndex === correctIndex) {
        return 'correct';
      }
      if (optionIndex === answer) {
        return 'selectedIncorrect';
      }
      return 'unselectedAfterAnswer';
    },
    [answer, answered, correctIndex],
  );

  const keyExtractor = useCallback((row: OptionRow) => row.key, []);

  const renderItem = useCallback(
    ({ item }: { item: OptionRow }) => (
      <QuizAnswer
        index={item.index}
        text={item.text}
        state={stateFor(item.index)}
        disabled={answered}
        onSelect={select}
      />
    ),
    [answered, select, stateFor],
  );

  const partsLine = [
    prefix ? prefix.form + ' = ' + prefix.meaning : null,
    suffix ? suffix.form + ' = ' + suffix.meaning : null,
  ]
    .filter(Boolean)
    .join('   ');

  const header = (
    <View style={styles.questionCard}>
      <Text style={styles.eyebrow}>Use the parts you know</Text>
      <Text style={styles.word}>{question.spelling}</Text>
      <Text style={styles.split}>{question.decomposition}</Text>
      <Text style={styles.prompt}>{question.prompt}</Text>
    </View>
  );

  const footer = answered ? (
    <View style={styles.footer}>
      <View style={styles.verdictRow}>
        <Check size={18} color={C.brand.burgundy} strokeWidth={2.6} />
        <Text style={styles.verdict}>
          {answer === question.correctIndex ? 'Correct' : 'The correct meaning is shown above'}
        </Text>
      </View>
      <MeaningCard
        word={word.spelling}
        decomposition={question.decomposition}
        definition={word.definition}
        example={word.example}
        note={partsLine ? partsLine : undefined}
      />
      <Text style={styles.clue}>The parts are a clue; this is the word's usual meaning.</Text>
    </View>
  ) : null;

  return (
    <>
      <ScreenHeader
        title={PHASE_TITLE.quiz}
        stepLabel={index + 1 + ' of ' + QUIZ_LENGTH}
        leading={{ Icon: Pause, label: 'Pause quiz', onPress: openPause }}
      />
      <FlatList
        style={styles.list}
        data={rows}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={header}
        ListFooterComponent={footer}
        ItemSeparatorComponent={Separator}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={false}
        extraData={answer}
      />
      <ControlPanel hint={answered ? undefined : 'Choose a meaning'}>
        <PrimaryButton
          label={index < QUIZ_LENGTH - 1 ? 'NEXT QUESTION' : 'SEE RESULTS'}
          Icon={Flag}
          onPress={advance}
          disabled={!answered}
        />
      </ControlPanel>
      <PauseSheet visible={paused} onContinue={closePause} onSaveAndLeave={leave} />
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
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    alignSelf: 'center',
    width: '100%',
    maxWidth: CONTENT_MAX_W + 32,
  },
  questionCard: {
    borderRadius: theme.radius.xl,
    backgroundColor: C.bg.parchment,
    borderWidth: 1,
    borderColor: C.ui.border,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
    ...theme.shadows.card,
  },
  eyebrow: { ...T.eyebrow, color: C.text.secondary },
  word: { ...T.word, color: C.brand.burgundy, marginTop: 4 },
  split: { ...T.body, color: C.text.secondary },
  prompt: { ...T.bodyStrong, color: C.text.primary, marginTop: theme.spacing.md },
  footer: { marginTop: theme.spacing.xl },
  verdictRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: theme.spacing.md },
  verdict: { ...T.bodyStrong, color: C.brand.burgundy, lineHeight: 24 },
  clue: { ...T.meta, color: C.text.secondary, marginTop: theme.spacing.md },
  separator: { height: 10 },
});
