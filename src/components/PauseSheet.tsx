import React from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { C, T, theme } from '../constants/theme';
import { PrimaryButton } from './PrimaryButton';
import { SecondaryButton } from './SecondaryButton';

type Props = {
  visible: boolean;
  onContinue: () => void;
  onSaveAndLeave: () => void;
};

/** Native modal — no JS bottom sheet, no gesture library. */
export function PauseSheet({ visible, onContinue, onSaveAndLeave }: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onContinue}
      statusBarTranslucent>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Quiz paused</Text>
          <Text style={styles.body}>
            Nothing is timed. Your submitted answers are already saved.
          </Text>
          <View style={styles.primaryWrap}>
            <PrimaryButton label="CONTINUE QUIZ" onPress={onContinue} />
          </View>
          <View style={styles.secondaryWrap}>
            <SecondaryButton label="SAVE AND LEAVE" onPress={onSaveAndLeave} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(36,24,29,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  sheet: {
    width: '100%',
    maxWidth: 380,
    borderRadius: theme.radius.xl,
    backgroundColor: C.bg.parchment,
    borderWidth: 1,
    borderColor: C.ui.border,
    padding: theme.spacing.xxl,
  },
  title: { ...T.title, color: C.text.primary },
  body: { ...T.body, color: C.text.secondary, marginTop: theme.spacing.sm },
  primaryWrap: { marginTop: theme.spacing.xl },
  secondaryWrap: { marginTop: theme.spacing.md },
});
