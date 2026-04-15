import React from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  type KeyboardTypeOptions,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { Text } from '@/components/primitives/Text';
import { useTheme } from '@/design/theme';
import { useRTL } from '@/lib/rtl';

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  maxLength?: number;
  disabled?: boolean;
  style?: ViewStyle;
  testID?: string;
}

export function Input({
  value,
  onChangeText,
  placeholder,
  label,
  error,
  secureTextEntry = false,
  keyboardType,
  maxLength,
  disabled = false,
  style,
  testID,
}: InputProps) {
  const tokens = useTheme();
  const isRTL = useRTL();

  const inputOpacity = disabled ? 0.5 : 1;
  const textAlign: TextStyle['textAlign'] = isRTL ? 'right' : 'left';

  return (
    <View style={[styles.container, { opacity: inputOpacity }, style]}>
      {label && (
        <Text variant="caption" style={{ marginBottom: tokens.spacing.xs }}>
          {label}
        </Text>
      )}
      <TextInput
        testID={testID}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={tokens.colors.textSecondary}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        maxLength={maxLength}
        editable={!disabled}
        accessibilityLabel={label ?? placeholder}
        accessibilityState={{ disabled }}
        style={[
          styles.input,
          {
            backgroundColor: tokens.colors.surface,
            borderColor: error ? tokens.colors.error : tokens.colors.border,
            borderRadius: tokens.radius.md,
            color: tokens.colors.text,
            padding: tokens.spacing.md,
            textAlign,
          },
        ]}
      />
      {error && (
        <Text variant="caption" color="error" style={{ marginTop: tokens.spacing.xs }}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
  },
  input: {
    borderWidth: 1,
  },
});
