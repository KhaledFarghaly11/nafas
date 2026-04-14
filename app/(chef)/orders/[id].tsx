import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components/primitives/Text';
import { useTheme } from '@/design/theme';

export default function ChefOrderDetailScreen() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text variant="heading3">Chef Order Detail — Coming Soon ({id})</Text>
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
