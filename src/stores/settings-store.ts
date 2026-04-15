import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Updates from 'expo-updates';
import { I18nManager } from 'react-native';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import i18n from '@/i18n';

export interface SettingsState {
  language: 'en' | 'ar';
  setLanguage: (lang: 'en' | 'ar') => void;
  themeOverride: 'light' | 'dark' | null;
  setThemeOverride: (mode: 'light' | 'dark' | null) => void;
  switchLanguage: (lang: 'en' | 'ar') => Promise<void>;
  devErrorInjection: boolean;
  setDevErrorInjection: (enabled: boolean) => void;
  hydrated: boolean;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      language: 'ar',
      setLanguage: (lang) => set({ language: lang }),
      themeOverride: null,
      setThemeOverride: (mode) => set({ themeOverride: mode }),
      devErrorInjection: false,
      setDevErrorInjection: (enabled) => set({ devErrorInjection: enabled }),
      switchLanguage: async (lang) => {
        const prevLang = get().language;
        try {
          try {
            if (typeof I18nManager.forceRTL === 'function') {
              I18nManager.forceRTL(lang === 'ar');
            }
          } catch {
            // forceRTL not supported in all runtimes (e.g. Expo SDK 54 new architecture)
          }
          await i18n.changeLanguage(lang);
          get().setLanguage(lang);
          const toPersist = Object.fromEntries(
            Object.entries(get()).filter(([key]) => key !== 'hydrated'),
          );
          await AsyncStorage.setItem(
            'nafas-settings',
            JSON.stringify({ state: toPersist, version: 0 }),
          );
          try {
            await Updates.reloadAsync();
          } catch {
            // reloadAsync not available in dev mode or Expo Go
          }
        } catch (error) {
          get().setLanguage(prevLang);
          console.warn('[settings-store] switchLanguage failed:', error);
          throw error;
        }
      },
      hydrated: false,
    }),
    {
      name: 'nafas-settings',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) =>
        Object.fromEntries(Object.entries(state).filter(([key]) => key !== 'hydrated')),
      onRehydrateStorage: () => {
        return (_state, error) => {
          if (error) {
            console.warn('[settings-store] Rehydration failed:', error);
          }
          useSettingsStore.setState({ hydrated: true });
        };
      },
    },
  ),
);
