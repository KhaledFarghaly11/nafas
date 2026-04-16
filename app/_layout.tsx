import {
  CormorantGaramond_400Regular,
  CormorantGaramond_600SemiBold,
  CormorantGaramond_400Regular_Italic,
} from '@expo-google-fonts/cormorant-garamond';
import {
  NotoSansArabic_300Light,
  NotoSansArabic_400Regular,
  NotoSansArabic_500Medium,
} from '@expo-google-fonts/noto-sans-arabic';
import {
  Tajawal_400Regular,
  Tajawal_500Medium,
  Tajawal_700Bold,
  Tajawal_800ExtraBold,
} from '@expo-google-fonts/tajawal';
import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { I18nManager } from 'react-native';
import { initializeDB } from '@/api/mock-db';
import { ToastProvider } from '@/components/feedback/Toast';
import { ThemeProvider } from '@/design/theme';
import i18n from '@/i18n';
import { QueryProvider } from '@/lib/query-client';
import { useSessionStore } from '@/stores/session-store';
import { useSettingsStore } from '@/stores/settings-store';

SplashScreen.preventAutoHideAsync();

const fontMap = {
  Tajawal: Tajawal_400Regular,
  TajawalMedium: Tajawal_500Medium,
  TajawalBold: Tajawal_700Bold,
  TajawalExtraBold: Tajawal_800ExtraBold,
  NotoSansArabic: NotoSansArabic_400Regular,
  NotoSansArabicLight: NotoSansArabic_300Light,
  NotoSansArabicMedium: NotoSansArabic_500Medium,
  CormorantGaramond: CormorantGaramond_400Regular,
  CormorantGaramondSemiBold: CormorantGaramond_600SemiBold,
  CormorantGaramondItalic: CormorantGaramond_400Regular_Italic,
};

export default function RootLayout() {
  const hydrated = useSessionStore((s) => s.hydrated);
  const settingsHydrated = useSettingsStore((s) => s.hydrated);

  const [fontsLoaded] = useFonts(fontMap);

  const [dbReady, setDbReady] = React.useState(false);
  const [dbError, setDbError] = React.useState(false);

  useEffect(() => {
    initializeDB()
      .then(() => setDbReady(true))
      .catch((error: unknown) => {
        console.error('[RootLayout] initializeDB failed:', error);
        setDbError(true);
      });
  }, []);

  useEffect(() => {
    if (hydrated && settingsHydrated && fontsLoaded && dbReady) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [hydrated, settingsHydrated, fontsLoaded, dbReady]);

  useEffect(() => {
    if (settingsHydrated) {
      const lang = useSettingsStore.getState().language;
      if (i18n.language !== lang) {
        i18n.changeLanguage(lang);
      }
      if (I18nManager.isRTL !== (lang === 'ar')) {
        try {
          if (typeof I18nManager.forceRTL === 'function') {
            I18nManager.forceRTL(lang === 'ar');
          }
        } catch {
          // forceRTL not supported in all runtimes
        }
      }
    }
  }, [settingsHydrated]);

  if (!hydrated || !settingsHydrated || !fontsLoaded || dbError || !dbReady) {
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
