import React from 'react';
import { View, StyleSheet, type ViewStyle } from 'react-native';
import { Text } from '@/components/primitives/Text';
import { useTheme } from '@/design/theme';

type BadgeVariant = 'primary' | 'success' | 'warning' | 'error' | 'info';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  style?: ViewStyle;
  testID?: string;
}

export function Badge({ label, variant = 'primary', size = 'md', style, testID }: BadgeProps) {
  const tokens = useTheme();

  const variantColors: Record<BadgeVariant, { bg: string; text: string }> = {
    primary: { bg: tokens.colors.primaryLight, text: tokens.colors.primary },
    success: { bg: `${tokens.colors.success}33`, text: tokens.colors.success },
    warning: { bg: `${tokens.colors.warning}33`, text: tokens.colors.warning },
    error: { bg: `${tokens.colors.error}33`, text: tokens.colors.error },
    info: { bg: tokens.colors.primaryLight, text: tokens.colors.primary },
  };

  const sizeConfig: Record<
    BadgeSize,
    { paddingHorizontal: number; paddingVertical: number; fontSize: number }
  > = {
    sm: {
      paddingHorizontal: tokens.spacing.xs,
      paddingVertical: 2,
      fontSize: tokens.typography.xs.fontSize,
    },
    md: {
      paddingHorizontal: tokens.spacing.sm,
      paddingVertical: tokens.spacing.xs,
      fontSize: tokens.typography.sm.fontSize,
    },
  };

  const { bg, text } = variantColors[variant];
  const sizeStyle = sizeConfig[size];

  return (
    <View
      testID={testID}
      style={[
        styles.base,
        {
          backgroundColor: bg,
          borderRadius: tokens.radius.sm,
          paddingHorizontal: sizeStyle.paddingHorizontal,
          paddingVertical: sizeStyle.paddingVertical,
        },
        style,
      ]}
    >
      <Text style={{ color: text, fontSize: sizeStyle.fontSize }}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    justifyContent: 'center',
  },
});
