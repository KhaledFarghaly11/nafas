import React from 'react';
import { ScrollView, View, StyleSheet, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/design/theme';

interface ScreenContainerProps {
  children: React.ReactNode;
  scrollable?: boolean;
  safeArea?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  testID?: string;
}

export function ScreenContainer({
  children,
  scrollable = true,
  safeArea = true,
  padding = 'md',
  style,
  testID,
}: ScreenContainerProps) {
  const tokens = useTheme();

  const paddingMap: Record<string, number> = {
    none: 0,
    sm: tokens.spacing.sm,
    md: tokens.spacing.md,
    lg: tokens.spacing.lg,
  };
  const resolvedPadding = paddingMap[padding];

  const content = scrollable ? (
    <ScrollView contentContainerStyle={{ padding: resolvedPadding }}>{children}</ScrollView>
  ) : (
    <View style={[styles.flex, { padding: resolvedPadding }]}>{children}</View>
  );

  const containerStyle = [styles.flex, { backgroundColor: tokens.colors.background }, style];

  if (safeArea) {
    return (
      <SafeAreaView testID={testID} style={containerStyle}>
        {content}
      </SafeAreaView>
    );
  }

  return (
    <View testID={testID} style={containerStyle}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
