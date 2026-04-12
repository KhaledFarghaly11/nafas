import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/design/theme';

export default function EditDishScreen() {
  const theme = useTheme();
  const { dishId } = useLocalSearchParams<{ dishId: string }>();
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.text, { color: theme.colors.text }]}>
        Edit Dish — Coming Soon ({dishId})
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
  },
});
