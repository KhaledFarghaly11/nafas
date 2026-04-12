import { Redirect, Stack } from 'expo-router';
import React from 'react';
import { useSessionStore } from '@/stores/session-store';

export default function AuthLayout() {
  const role = useSessionStore((s) => s.role);

  if (role === 'customer') {
    return <Redirect href="/(customer)/home" />;
  }
  if (role === 'chef') {
    return <Redirect href="/(chef)/dashboard" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
