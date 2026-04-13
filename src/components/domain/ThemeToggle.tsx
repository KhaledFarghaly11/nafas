import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, type ViewStyle } from 'react-native';
import { Button } from '@/components/primitives/Button';
import { useTheme } from '@/design/theme';
import { useSessionStore } from '@/stores/session-store';
import { useSettingsStore } from '@/stores/settings-store';

interface ThemeToggleProps {
  style?: ViewStyle;
  testID?: string;
}

export function ThemeToggle({ style, testID }: ThemeToggleProps) {
  const tokens = useTheme();
  const { t } = useTranslation();
  const themeOverride = useSettingsStore((s) => s.themeOverride);
  const role = useSessionStore((s) => s.role);

  const activeMode = themeOverride ?? (role === 'chef' ? 'dark' : 'light');

  const handlePress = (value: 'light' | 'dark' | null) => {
    useSettingsStore.getState().setThemeOverride(value);
  };

  return (
    <View testID={testID} style={[styles.container, { gap: tokens.spacing.md }, style]}>
      <Button
        title={t('theme_light')}
        variant={activeMode === 'light' ? 'primary' : 'ghost'}
        onPress={() => handlePress('light')}
      />
      <Button
        title={t('theme_dark')}
        variant={activeMode === 'dark' ? 'primary' : 'ghost'}
        onPress={() => handlePress('dark')}
      />
      <Button
        title={t('theme_system')}
        variant={themeOverride === null ? 'primary' : 'ghost'}
        onPress={() => handlePress(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
});
