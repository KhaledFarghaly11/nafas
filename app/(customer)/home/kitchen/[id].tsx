import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Text } from '@/components/primitives/Text';

export default function KitchenDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <ScreenContainer>
      <Text variant="heading3">Kitchen Detail — Coming Soon ({id})</Text>
    </ScreenContainer>
  );
}
