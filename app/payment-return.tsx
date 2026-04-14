import { Redirect, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { Text } from '@/components/primitives/Text';
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
    return <Redirect href="/auth/welcome" />;
  }

  if (session.role === 'chef') {
    return <Redirect href="/(chef)/dashboard" />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.content, { paddingHorizontal: theme.spacing['2xl'] }]}>
        <Text variant="body">
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
  },
});
