import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Text } from '@/components/primitives/Text';

export default function MenuScreen() {
  const { t } = useTranslation();
  return (
    <ScreenContainer>
      <Text variant="heading3">{t('menu.heading')}</Text>
    </ScreenContainer>
  );
}
