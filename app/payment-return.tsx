import { Redirect, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Text } from '@/components/primitives/Text';
import { useSessionStore } from '@/stores/session-store';

export default function PaymentReturnScreen() {
  const { status, orderId } = useLocalSearchParams<{ status?: string; orderId?: string }>();
  const hydrated = useSessionStore((s) => s.hydrated);
  const userId = useSessionStore((s) => s.userId);
  const role = useSessionStore((s) => s.role);

  if (!hydrated) {
    return null;
  }

  if (!userId) {
    return <Redirect href="/auth/welcome" />;
  }

  if (role === 'chef') {
    return <Redirect href="/(chef)/dashboard" />;
  }

  return (
    <ScreenContainer>
      <Text variant="body">
        Payment Return — status: {status ?? 'unknown'}, orderId: {orderId ?? 'none'}
      </Text>
    </ScreenContainer>
  );
}
