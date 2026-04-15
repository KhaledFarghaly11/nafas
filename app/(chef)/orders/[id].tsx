import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Text } from '@/components/primitives/Text';

export default function ChefOrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  return (
    <ScreenContainer>
      <Text variant="heading3">{t('chefOrderDetail.title', { id })}</Text>
    </ScreenContainer>
  );
}
