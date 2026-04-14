import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Text } from '@/components/primitives/Text';

export default function ChefOrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <ScreenContainer>
      <Text variant="heading3">Chef Order Detail — Coming Soon ({id})</Text>
    </ScreenContainer>
  );
}
