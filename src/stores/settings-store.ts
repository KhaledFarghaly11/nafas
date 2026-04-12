import { create } from 'zustand';

interface SettingsState {
  language: 'en' | 'ar';
  setLanguage: (lang: 'en' | 'ar') => void;
}

export const useSettingsStore = create<SettingsState>()((set) => ({
  language: 'en',
  setLanguage: (lang) => set({ language: lang }),
}));
