import { Feather } from '@expo/vector-icons';
import React from 'react';
import { View, StyleSheet, type ViewStyle } from 'react-native';
import { Button } from '@/components/primitives/Button';
import { Icon } from '@/components/primitives/Icon';
import { Text } from '@/components/primitives/Text';
import { useTheme } from '@/design/theme';

type FeatherName = React.ComponentProps<typeof Feather>['name'];

interface EmptyStateProps {
  title: string;
  message?: string;
  actionLabel: string;
  onAction: () => void;
  icon?: FeatherName;
  style?: ViewStyle;
  testID?: string;
}

export function EmptyState({
  title,
  message,
  actionLabel,
  onAction,
  icon,
  style,
  testID,
}: EmptyStateProps) {
  const tokens = useTheme();

  return (
    <View testID={testID} style={[styles.container, { gap: tokens.spacing.md }, style]}>
      {icon && <Icon name={icon} size={48} color="secondary" />}
      <Text variant="heading3">{title}</Text>
      {message && (
        <Text variant="body" color="secondary">
          {message}
        </Text>
      )}
      <Button variant="primary" title={actionLabel} onPress={onAction} />
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
