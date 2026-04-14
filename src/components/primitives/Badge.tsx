import React from 'react';
import { View, StyleSheet, type ViewStyle } from 'react-native';
import { Text } from '@/components/primitives/Text';
import { useTheme } from '@/design/theme';
import { withAlpha } from '@/lib/color';

type BadgeVariant =
  | 'primary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'mint'
  | 'rose'
  | 'saffron';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  style?: ViewStyle;
  testID?: string;
}

const BADGE_ALPHA = 0.13;

const variantColorKey: Record<BadgeVariant, keyof ReturnType<typeof useTheme>['colors']> = {
  primary: 'clay',
  success: 'success',
  warning: 'saffron',
  error: 'error',
  info: 'mint',
  mint: 'mint',
  rose: 'rose',
  saffron: 'saffron',
};

export function Badge({ label, variant = 'primary', size = 'md', style, testID }: BadgeProps) {
  const tokens = useTheme();

  const colorKey = variantColorKey[variant];
  const color = tokens.colors[colorKey];
  const bg = withAlpha(color, BADGE_ALPHA);

  const sizeConfig: Record<
    BadgeSize,
    { paddingHorizontal: number; paddingVertical: number; fontSize: number }
  > = {
    sm: {
      paddingHorizontal: tokens.spacing.xs,
      paddingVertical: tokens.spacing.xs / 2,
      fontSize: tokens.typography.xs.fontSize,
    },
    md: {
      paddingHorizontal: tokens.spacing.sm,
      paddingVertical: tokens.spacing.xs,
      fontSize: tokens.typography.sm.fontSize,
    },
  };

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
      <Text style={{ color, fontSize: sizeStyle.fontSize }}>{label}</Text>
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
