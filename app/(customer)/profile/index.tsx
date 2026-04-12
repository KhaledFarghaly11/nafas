import { router } from 'expo-router';
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { logout } from '@/api/mock-server';
import { useTheme } from '@/design/theme';

export default function ProfileScreen() {
  const theme = useTheme();

  const handleSignOut = () => {
    logout();
    router.replace('/auth/welcome');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.text, { color: theme.colors.text }]}>Profile — Coming Soon</Text>
      <Button title="Sign Out" onPress={handleSignOut} color={theme.colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    gap: 16,
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
  },
});
