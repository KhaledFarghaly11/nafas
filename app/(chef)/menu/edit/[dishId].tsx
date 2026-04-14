import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components/primitives/Text';
import { useTheme } from '@/design/theme';

export default function EditDishScreen() {
  const theme = useTheme();
  const { dishId } = useLocalSearchParams<{ dishId: string }>();
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text variant="heading3">Edit Dish — Coming Soon ({dishId})</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
