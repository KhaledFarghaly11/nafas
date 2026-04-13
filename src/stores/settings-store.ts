import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface SettingsState {
  language: 'en' | 'ar';
  setLanguage: (lang: 'en' | 'ar') => void;
  themeOverride: 'light' | 'dark' | null;
  setThemeOverride: (mode: 'light' | 'dark' | null) => void;
  hydrated: boolean;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      language: 'ar',
      setLanguage: (lang) => set({ language: lang }),
      themeOverride: null,
      setThemeOverride: (mode) => set({ themeOverride: mode }),
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
