import React, { createContext, useContext } from 'react';
import { lightTokens, darkTokens } from '@/design/tokens';
import type { TokenSet } from '@/design/tokens';
import { useSessionStore } from '@/stores/session-store';
import { useSettingsStore } from '@/stores/settings-store';

const ThemeContext = createContext<TokenSet>(lightTokens);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const role = useSessionStore((s) => s.role);
  const sessionHydrated = useSessionStore((s) => s.hydrated);
  const settingsHydrated = useSettingsStore((s) => s.hydrated);
  const themeOverride = useSettingsStore((s) => s.themeOverride);

  if (!sessionHydrated || !settingsHydrated) {
    return null;
  }

  const mode = themeOverride ?? (role === 'chef' ? 'dark' : 'light');
  const tokens = mode === 'dark' ? darkTokens : lightTokens;

  return <ThemeContext.Provider value={tokens}>{children}</ThemeContext.Provider>;
};

export function useTheme(): TokenSet {
  return useContext(ThemeContext);
}
