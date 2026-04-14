import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Text } from '@/components/primitives/Text';

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <ScreenContainer>
      <Text variant="heading3">Order Detail — Coming Soon ({id})</Text>
    </ScreenContainer>
  );
}
