import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { ToastProvider } from '@/components/feedback/Toast';
import { ThemeProvider } from '@/design/theme';
import i18n from '@/i18n';
import { QueryProvider } from '@/lib/query-client';
import { useSessionStore } from '@/stores/session-store';
import { useSettingsStore } from '@/stores/settings-store';

SplashScreen.preventAutoHideAsync();

/* eslint-disable @typescript-eslint/no-require-imports */
const fontMap = {
  SpaceGrotesk: require('../assets/fonts/SpaceGrotesk-Regular.ttf'),
  SpaceGroteskMedium: require('../assets/fonts/SpaceGrotesk-Medium.ttf'),
  SpaceGroteskBold: require('../assets/fonts/SpaceGrotesk-Bold.ttf'),
  Inter: require('../assets/fonts/Inter-Regular.ttf'),
  InterMedium: require('../assets/fonts/Inter-Medium.ttf'),
  Cairo: require('../assets/fonts/Cairo-Regular.ttf'),
  CairoMedium: require('../assets/fonts/Cairo-Medium.ttf'),
  CairoBold: require('../assets/fonts/Cairo-Bold.ttf'),
};
/* eslint-enable @typescript-eslint/no-require-imports */

export default function RootLayout() {
  const hydrated = useSessionStore((s) => s.hydrated);
  const settingsHydrated = useSettingsStore((s) => s.hydrated);

  const [fontsLoaded] = useFonts(fontMap);

  useEffect(() => {
    if (hydrated && settingsHydrated && fontsLoaded) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [hydrated, settingsHydrated, fontsLoaded]);

  useEffect(() => {
    if (settingsHydrated) {
      const lang = useSettingsStore.getState().language;
      if (i18n.language !== lang) {
        i18n.changeLanguage(lang);
      }
    }
  }, [settingsHydrated]);

  if (!hydrated || !settingsHydrated || !fontsLoaded) {
    return null;
  }

  return (
    <QueryProvider>
      <ThemeProvider>
        <ToastProvider>
          <Slot />
        </ToastProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
