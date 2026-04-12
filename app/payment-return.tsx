import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/design/theme';
import { useSessionStore } from '@/stores/session-store';

export default function PaymentReturnScreen() {
  const { status, orderId } = useLocalSearchParams<{ status?: string; orderId?: string }>();
  const theme = useTheme();
  const session = useSessionStore();

  if (!session.hydrated) {
    return null;
  }

  if (!session.userId) {
    router.replace('/auth/welcome');
    return null;
  }

  if (session.role === 'chef') {
    router.replace('/(chef)/dashboard');
    return null;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.text, { color: theme.colors.text }]}>
          Payment Return — status: {status ?? 'unknown'}, orderId: {orderId ?? 'none'}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  text: {
    fontSize: 16,
  },
});
