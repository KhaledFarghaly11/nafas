import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/design/theme';

export default function ProfileSetupScreen() {
  const theme = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.text, { color: theme.colors.text }]}>
        Profile Setup — Coming in Phase 4
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
