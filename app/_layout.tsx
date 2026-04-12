import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { ThemeProvider } from '@/design/theme';
import { QueryProvider } from '@/lib/query-client';
import { useSessionStore } from '@/stores/session-store';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const hydrated = useSessionStore((s) => s.hydrated);

  useEffect(() => {
    if (hydrated) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [hydrated]);

  if (!hydrated) {
    return null;
  }

  return (
    <QueryProvider>
      <ThemeProvider>
        <Slot />
      </ThemeProvider>
    </QueryProvider>
  );
}
