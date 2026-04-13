import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, View, StyleSheet, type ViewStyle } from 'react-native';
import { Button } from '@/components/primitives/Button';
import { useTheme } from '@/design/theme';
import { useSettingsStore } from '@/stores/settings-store';

interface LanguageToggleProps {
  style?: ViewStyle;
  testID?: string;
}

export function LanguageToggle({ style, testID }: LanguageToggleProps) {
  const tokens = useTheme();
  const { t } = useTranslation();
  const language = useSettingsStore((s) => s.language);

  const handlePress = (selectedLang: 'ar' | 'en') => {
    if (selectedLang === language) return;

    Alert.alert(t('language_change_confirm_title'), t('language_change_confirm_message'), [
      { text: t('language_change_confirm_cancel'), style: 'cancel' },
      {
        text: t('language_change_confirm_ok'),
        onPress: () => useSettingsStore.getState().switchLanguage(selectedLang),
      },
    ]);
  };

  return (
    <View testID={testID} style={[styles.container, { gap: tokens.spacing.md }, style]}>
      <Button
        title="العربية"
        variant={language === 'ar' ? 'primary' : 'ghost'}
        onPress={() => handlePress('ar')}
      />
      <Button
        title="English"
        variant={language === 'en' ? 'primary' : 'ghost'}
        onPress={() => handlePress('en')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
});
