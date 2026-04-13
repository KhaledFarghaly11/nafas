import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, type ViewStyle } from 'react-native';
import { Button } from '@/components/primitives/Button';
import { Icon } from '@/components/primitives/Icon';
import { Text } from '@/components/primitives/Text';
import { useTheme } from '@/design/theme';

interface ErrorStateProps {
  title?: string;
  message?: string;
  retryLabel?: string;
  onRetry: () => void;
  style?: ViewStyle;
  testID?: string;
}

export function ErrorState({
  title,
  message,
  retryLabel,
  onRetry,
  style,
  testID,
}: ErrorStateProps) {
  const tokens = useTheme();
  const { t } = useTranslation();

  return (
    <View testID={testID} style={[styles.container, { gap: tokens.spacing.md }, style]}>
      <Icon name="alert-circle" size={48} color="error" />
      <Text variant="heading3" color="error">
        {title ?? t('error_title')}
      </Text>
      <Text variant="body" color="secondary">
        {message ?? t('error_message')}
      </Text>
      <Button variant="primary" title={retryLabel ?? t('error_retry')} onPress={onRetry} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
