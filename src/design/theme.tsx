import React, { createContext, useContext } from 'react';
import { lightTokens, darkTokens } from '@/design/tokens';
import { useSessionStore } from '@/stores/session-store';

type TokenSet = typeof lightTokens;

const ThemeContext = createContext<TokenSet>(lightTokens);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const role = useSessionStore((s) => s.role);
  const tokens = role === 'chef' ? darkTokens : lightTokens;

  return <ThemeContext.Provider value={tokens}>{children}</ThemeContext.Provider>;
};

export function useTheme(): TokenSet {
  return useContext(ThemeContext);
}
