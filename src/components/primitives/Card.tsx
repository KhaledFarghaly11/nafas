import React from 'react';
import { Pressable, View, StyleSheet, type ViewStyle } from 'react-native';
import { useTheme } from '@/design/theme';

type CardPadding = 'none' | 'sm' | 'md' | 'lg';
type CardVariant = 'elevated' | 'outlined' | 'filled';

interface CardProps {
  children: React.ReactNode;
  padding?: CardPadding;
  variant?: CardVariant;
  onPress?: () => void;
  style?: ViewStyle;
  testID?: string;
}

export function Card({
  children,
  padding = 'md',
  variant = 'elevated',
  onPress,
  style,
  testID,
}: CardProps) {
  const tokens = useTheme();

  const paddingMap: Record<CardPadding, number> = {
    none: 0,
    sm: tokens.spacing.sm,
    md: tokens.spacing.md,
    lg: tokens.spacing.lg,
  };

  const variantStyles: Record<CardVariant, ViewStyle> = {
    elevated: {
      backgroundColor: tokens.colors.surface,
      ...tokens.shadows.md,
    },
    outlined: {
      backgroundColor: tokens.colors.surface,
      borderColor: tokens.colors.border,
      borderWidth: 1,
    },
    filled: {
      backgroundColor: tokens.colors.primary,
    },
  };

  const cardStyle = [
    variant !== 'elevated' && styles.base,
    {
      borderRadius: tokens.radius.lg,
      padding: paddingMap[padding],
    },
    variantStyles[variant],
    style,
  ];

  if (onPress) {
    return (
      <Pressable
        testID={testID}
        onPress={onPress}
        style={({ pressed }) => [cardStyle, { opacity: pressed ? 0.7 : 1 }]}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View testID={testID} style={cardStyle}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
});
