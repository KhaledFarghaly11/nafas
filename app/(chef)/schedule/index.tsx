import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components/primitives/Text';
import { useTheme } from '@/design/theme';

export default function ScheduleScreen() {
  const theme = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text variant="heading3">Schedule — Coming Soon</Text>
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
