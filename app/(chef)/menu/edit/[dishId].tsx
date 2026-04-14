import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Text } from '@/components/primitives/Text';

export default function EditDishScreen() {
  const { dishId } = useLocalSearchParams<{ dishId: string }>();
  return (
    <ScreenContainer>
      <Text variant="heading3">Edit Dish — Coming Soon ({dishId})</Text>
    </ScreenContainer>
  );
}
