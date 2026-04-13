import { Feather } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, type ViewStyle } from 'react-native';
import { Icon } from '@/components/primitives/Icon';
import { Text } from '@/components/primitives/Text';
import { useTheme } from '@/design/theme';

type FeatherName = React.ComponentProps<typeof Feather>['name'];
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: FeatherName;
  rightIcon?: FeatherName;
  style?: ViewStyle;
  testID?: string;
}

const sizeToPadding: Record<ButtonSize, keyof ReturnType<typeof useTheme>['spacing']> = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
};

const sizeToTextVariant: Record<ButtonSize, 'caption' | 'body' | 'heading3'> = {
  sm: 'caption',
  md: 'body',
  lg: 'heading3',
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  style,
  testID,
}: ButtonProps) {
  const tokens = useTheme();

  const variantConfig: Record<
    ButtonVariant,
    { bg: string; textColor: 'primary' | 'inverse'; borderColor?: string; borderWidth?: number }
  > = {
    primary: { bg: tokens.colors.clay, textColor: 'inverse' },
    secondary: {
      bg: tokens.colors.surface,
      textColor: 'primary',
      borderColor: tokens.colors.border,
      borderWidth: 1,
    },
    ghost: { bg: 'transparent', textColor: 'primary' },
    danger: { bg: tokens.colors.error, textColor: 'inverse' },
  };

  const { bg, textColor, borderColor, borderWidth } = variantConfig[variant];
  const padding = tokens.spacing[sizeToPadding[size]];
  const textVariant = sizeToTextVariant[size];
  const iconColor: 'inverse' | 'primary' =
    variant === 'primary' || variant === 'danger' ? 'inverse' : 'primary';
  const activityColor =
    variant === 'ghost' || variant === 'secondary' ? tokens.colors.clay : tokens.colors.warmWhite;
  const buttonOpacity = disabled ? 0.5 : 1;

  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: bg,
          borderRadius: tokens.radius.sm,
          gap: tokens.spacing.xs,
          opacity: buttonOpacity,
          paddingHorizontal: padding * 1.5,
          paddingVertical: padding,
          transform: [{ scale: pressed ? 0.97 : 1 }],
          ...(borderColor ? { borderColor, borderWidth: borderWidth ?? 0 } : {}),
        },
        style,
      ]}
      pointerEvents={disabled || loading ? 'none' : 'auto'}
    >
      {leftIcon && !loading && <Icon name={leftIcon} size={16} color={iconColor} />}
      {loading ? (
        <ActivityIndicator color={activityColor} size="small" />
      ) : (
        <Text variant={textVariant} color={textColor}>
          {title}
        </Text>
      )}
      {rightIcon && !loading && <Icon name={rightIcon} size={16} color={iconColor} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
