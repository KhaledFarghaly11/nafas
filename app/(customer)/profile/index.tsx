import { router } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { logout } from '@/api/mock-server';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Button } from '@/components/primitives/Button';
import { Text } from '@/components/primitives/Text';

export default function ProfileScreen() {
  const { t } = useTranslation();

  const handleSignOut = () => {
    logout();
    router.replace('/auth/welcome');
  };

  return (
    <ScreenContainer safeArea={false}>
      <Text variant="heading3" color="secondary">
        {t('profile')} — {t('coming_soon')}
      </Text>
      <Button variant="danger" title={t('sign_out')} onPress={handleSignOut} />
    </ScreenContainer>
  );
}
