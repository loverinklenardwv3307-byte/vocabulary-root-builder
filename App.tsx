/**
 * Vocabulary Root Builder — route coordinator only.
 * Curriculum rules, answer evaluation and progress updates live in src/game
 * and src/hooks; this file just switches between screens.
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';
import { TabKey } from './src/components/BottomTabs';
import { ROOTS } from './src/game/curriculum';
import { quizUnlocked, rootProgressOf } from './src/game/progress';
import type { AttemptResult } from './src/game/types';
import { PreferenceProvider } from './src/hooks/useMotionPreference';
import { useLocalProgress } from './src/hooks/useLocalProgress';
import { GameOverScreen } from './src/screens/GameOverScreen';
import { GameScreen } from './src/screens/GameScreen';
import { LoaderScreen } from './src/screens/LoaderScreen';
import { MenuScreen } from './src/screens/MenuScreen';
import { ProgressScreen } from './src/screens/ProgressScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';

type Screen = 'loader' | 'menu' | 'game' | 'gameover' | 'progress' | 'settings';

function App(): React.JSX.Element {
  const [screen, setScreen] = useState<Screen>('loader');
  const [activeRootId, setActiveRootId] = useState<string>(ROOTS[0].id);
  const [result, setResult] = useState<AttemptResult | null>(null);
  const [startInQuiz, setStartInQuiz] = useState(false);
  const [gameKey, setGameKey] = useState(0);
  const attemptSeedRef = useRef(0);

  const { state, actions } = useLocalProgress();

  const goMenu = useCallback(() => setScreen('menu'), []);

  const openRoot = useCallback((rootId: string) => {
    setActiveRootId(rootId);
    setStartInQuiz(false);
    setGameKey(key => key + 1);
    setScreen('game');
  }, []);

  const selectTab = useCallback((tab: TabKey) => {
    if (tab === 'progress') {
      setScreen('progress');
      return;
    }
    if (tab === 'settings') {
      setScreen('settings');
      return;
    }
    setScreen('menu');
  }, []);

  const handleGameOver = useCallback((attemptResult: AttemptResult) => {
    setResult(attemptResult);
    setScreen('gameover');
  }, []);

  const practiceAgain = useCallback(() => {
    attemptSeedRef.current += 1;
    setStartInQuiz(true);
    setGameKey(key => key + 1);
    setScreen('game');
  }, []);

  // Android hardware back: every route falls back to Roots, Roots exits.
  useEffect(() => {
    const onBack = () => {
      if (screen === 'menu' || screen === 'loader') {
        return false;
      }
      setScreen('menu');
      return true;
    };
    const subscription = BackHandler.addEventListener('hardwareBackPress', onBack);
    return () => subscription.remove();
  }, [screen]);

  const progress = rootProgressOf(state, activeRootId);

  let content: React.ReactNode;
  if (screen === 'loader') {
    content = <LoaderScreen onDone={goMenu} />;
  } else if (screen === 'game') {
    content = (
      <GameScreen
        key={gameKey}
        rootId={activeRootId}
        lessonSaved={progress.lessonCompleted}
        quizUnlocked={quizUnlocked(state, activeRootId)}
        onLessonComplete={actions.completeLesson}
        onWordComplete={actions.completeBuilderWord}
        onGameOver={handleGameOver}
        recordAttempt={actions.recordAttempt}
        startInQuiz={startInQuiz}
        attemptSeed={attemptSeedRef.current}
        onExit={goMenu}
      />
    );
  } else if (screen === 'gameover' && result) {
    content = (
      <GameOverScreen result={result} onPracticeAgain={practiceAgain} onBackToRoots={goMenu} />
    );
  } else if (screen === 'progress') {
    content = <ProgressScreen state={state} onOpenRoot={openRoot} onSelectTab={selectTab} />;
  } else if (screen === 'settings') {
    content = (
      <SettingsScreen
        preferences={state.preferences}
        onSave={actions.savePreferences}
        onSelectTab={selectTab}
      />
    );
  } else {
    content = <MenuScreen state={state} onOpenRoot={openRoot} onSelectTab={selectTab} />;
  }

  return (
    <PreferenceProvider
      reduceMotion={state.preferences.reduceMotion}
      haptics={state.preferences.haptics}>
      <View style={styles.root}>{content}</View>
    </PreferenceProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});

export default App;
