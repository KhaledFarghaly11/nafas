import React from 'react';
import { View, StyleSheet, type ViewStyle } from 'react-native';
import { useTheme } from '@/design/theme';

type DividerOrientation = 'horizontal' | 'vertical';
type DividerSpacing = 'none' | 'sm' | 'md';

interface DividerProps {
  orientation?: DividerOrientation;
  spacing?: DividerSpacing;
  style?: ViewStyle;
  testID?: string;
}

export function Divider({
  orientation = 'horizontal',
  spacing = 'md',
  style,
  testID,
}: DividerProps) {
  const tokens = useTheme();

  const marginMap: Record<DividerSpacing, number> = {
    none: 0,
    sm: tokens.spacing.xs,
    md: tokens.spacing.sm,
  };

  const margin = marginMap[spacing];

  if (orientation === 'vertical') {
    return (
      <View
        testID={testID}
        style={[
          styles.vertical,
          {
            backgroundColor: tokens.colors.border,
            marginHorizontal: margin,
          },
          style,
        ]}
      />
    );
  }

  return (
    <View
      testID={testID}
      style={[
        styles.horizontal,
        {
          backgroundColor: tokens.colors.border,
          marginVertical: margin,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  horizontal: {
    height: 1,
    width: '100%',
  },
  vertical: {
    alignSelf: 'stretch',
    width: 1,
  },
});
