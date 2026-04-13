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
  switchLanguage: (lang: 'en' | 'ar') => void;
  hydrated: boolean;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      language: 'ar',
      setLanguage: (lang) => set({ language: lang }),
      themeOverride: null,
      setThemeOverride: (mode) => set({ themeOverride: mode }),
      switchLanguage: (lang) => {
        get().setLanguage(lang);
        I18nManager.forceRTL(lang === 'ar');
        i18n.changeLanguage(lang);
        Updates.reloadAsync();
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
