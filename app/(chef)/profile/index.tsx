import { router } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { logout } from '@/api/mock-server';
import { Button } from '@/components/primitives/Button';
import { Text } from '@/components/primitives/Text';
import { useTheme } from '@/design/theme';

export default function ChefProfileScreen() {
  const theme = useTheme();
  const { t } = useTranslation();

  const handleSignOut = () => {
    logout();
    router.replace('/auth/welcome');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View
        style={[styles.content, { gap: theme.spacing.lg, paddingHorizontal: theme.spacing.xl }]}
      >
        <Text variant="heading3" color="secondary">
          {t('profile')} — {t('coming_soon')}
        </Text>
        <Button variant="danger" title={t('sign_out')} onPress={handleSignOut} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
