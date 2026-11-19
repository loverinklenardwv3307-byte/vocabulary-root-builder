import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { C, T, theme } from '../constants/theme';
import { SecondaryButton } from './SecondaryButton';

type Props = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ title, description, actionLabel, onAction }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {actionLabel && onAction ? (
        <View style={styles.action}>
          <SecondaryButton label={actionLabel} onPress={onAction} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingVertical: theme.spacing.xxl,
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
  },
  title: { ...T.meaning, color: C.text.primary, textAlign: 'center' },
  description: {
    ...T.body,
    color: C.text.secondary,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
  action: { width: '100%', maxWidth: 260, marginTop: theme.spacing.xl },
});
