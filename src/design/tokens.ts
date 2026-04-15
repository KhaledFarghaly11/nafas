/**
 * Nafas Design Tokens
 *
 * Color tokens fall into two categories:
 *
 * **Surface tokens** (theme-adapted — different values per theme):
 *   background, text, textSecondary, primary, primaryLight, error, success,
 *   warning, surface, border, tabBackground, tabBarInactive, skeletonBase,
 *   skeletonHighlight, overlay
 *
 *   Use these for all UI surfaces, text, borders, and interactive states.
 *   They automatically adapt when the theme switches.
 *
 * **Brand tokens** (shared — identical across light and dark themes):
 *   clay, saffron, cream, linen, oud, smoke, mint, rose, warmWhite
 *
 *   Use these for brand accents, badges, and decorative elements only.
 *   WARNING: Some brand tokens (cream, warmWhite, linen) are very light
 *   and should NEVER be used as surface/background colors in dark mode.
 *
 * **Exception — `bark`**: The only brand token that adapts between themes
 *   (#6B3F28 in light, #9E7B6A in dark). All other brand tokens are identical
 *   across both themes.
 */

type Shadow = {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
};

type TypographyEntry = {
  fontSize: number;
  lineHeight: number;
  fontFamily: string;
};

export type TokenSet = {
  colors: {
    background: string;
    text: string;
    textSecondary: string;
    primary: string;
    primaryLight: string;
    error: string;
    success: string;
    warning: string;
    surface: string;
    border: string;
    tabBackground: string;
    tabBarInactive: string;
    skeletonBase: string;
    skeletonHighlight: string;
    clay: string;
    saffron: string;
    cream: string;
    linen: string;
    oud: string;
    bark: string;
    smoke: string;
    mint: string;
    rose: string;
    warmWhite: string;
    overlay: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    '2xl': number;
    '3xl': number;
  };
  typography: {
    xs: TypographyEntry;
    sm: TypographyEntry;
    md: TypographyEntry;
    lg: TypographyEntry;
    xl: TypographyEntry;
    '2xl': TypographyEntry;
    '3xl': TypographyEntry;
    '4xl': TypographyEntry;
    numeral: TypographyEntry;
  };
  radius: {
    none: number;
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    full: number;
  };
  shadows: {
    none: Shadow;
    sm: Shadow;
    md: Shadow;
    lg: Shadow;
  };
};

const warmShadowColor = 'rgba(44, 26, 14, 1)';

const sharedTokens = {
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    '2xl': 32,
    '3xl': 48,
  },
  typography: {
    xs: { fontSize: 12, lineHeight: 20, fontFamily: 'NotoSansArabic' },
    sm: { fontSize: 14, lineHeight: 24, fontFamily: 'NotoSansArabic' },
    md: { fontSize: 15, lineHeight: 26, fontFamily: 'NotoSansArabic' },
    lg: { fontSize: 18, lineHeight: 28, fontFamily: 'CormorantGaramond' },
    xl: { fontSize: 19, lineHeight: 29, fontFamily: 'TajawalMedium' },
    '2xl': { fontSize: 24, lineHeight: 36, fontFamily: 'TajawalBold' },
    '3xl': { fontSize: 30, lineHeight: 42, fontFamily: 'TajawalBold' },
    '4xl': { fontSize: 36, lineHeight: 48, fontFamily: 'TajawalExtraBold' },
    numeral: { fontSize: 20, lineHeight: 28, fontFamily: 'CormorantGaramondSemiBold' },
  },
  radius: {
    none: 0,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 20,
    xl: 24,
    full: 50,
  },
  shadows: {
    none: {
      shadowColor: warmShadowColor,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    sm: {
      shadowColor: warmShadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 2,
    },
    md: {
      shadowColor: warmShadowColor,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.12,
      shadowRadius: 24,
      elevation: 4,
    },
    lg: {
      shadowColor: warmShadowColor,
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: 0.16,
      shadowRadius: 48,
      elevation: 8,
    },
  },
};

export const lightTokens: TokenSet = {
  colors: {
    background: '#FAF3E8',
    text: '#2C1A0E',
    textSecondary: '#6B3F28',
    primary: '#C1714F',
    primaryLight: '#E8A838',
    error: '#B84C3C',
    success: '#5B8C6A',
    warning: '#E8A838',
    surface: '#F0E6D3',
    border: '#D9CCBC',
    tabBackground: '#FAF3E8',
    tabBarInactive: '#9E8A78',
    skeletonBase: '#F0E6D3',
    skeletonHighlight: '#FAF3E8',
    clay: '#C1714F',
    saffron: '#E8A838',
    cream: '#FAF3E8',
    linen: '#F0E6D3',
    oud: '#2C1A0E',
    bark: '#6B3F28',
    smoke: '#9E8A78',
    mint: '#7DADA0',
    rose: '#D4927A',
    warmWhite: '#FFFDF9',
    overlay: 'rgba(44, 26, 14, 0.55)',
  },
  ...sharedTokens,
};

export const darkTokens: TokenSet = {
  colors: {
    background: '#1A110A',
    text: '#FAF3E8',
    textSecondary: '#9E8A78',
    primary: '#C1714F',
    primaryLight: '#D4927A',
    error: '#D45A4A',
    success: '#7DADA0',
    warning: '#E8A838',
    surface: '#261A10',
    border: '#3D2C1E',
    tabBackground: '#1A110A',
    tabBarInactive: '#6B5A4A',
    skeletonBase: '#2C1A0E',
    skeletonHighlight: '#3D2C1E',
    clay: '#C1714F',
    saffron: '#E8A838',
    cream: '#FAF3E8',
    linen: '#F0E6D3',
    oud: '#2C1A0E',
    bark: '#9E7B6A',
    smoke: '#9E8A78',
    mint: '#7DADA0',
    rose: '#D4927A',
    warmWhite: '#FFFDF9',
    overlay: 'rgba(44, 26, 14, 0.7)',
  },
  ...sharedTokens,
};
