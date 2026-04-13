type Shadow = {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
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
  };
  radius: {
    none: number;
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

export const lightTokens: TokenSet = {
  colors: {
    background: '#FFFFFF',
    text: '#1A1A1A',
    textSecondary: '#666666',
    primary: '#2E7D32',
    primaryLight: '#66BB6A',
    error: '#D32F2F',
    success: '#388E3C',
    warning: '#F57C00',
    surface: '#F5F5F5',
    border: '#E0E0E0',
    tabBackground: '#FFFFFF',
    tabBarInactive: '#999999',
    skeletonBase: '#E0E0E0',
    skeletonHighlight: '#F5F5F5',
  },
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
    xs: { fontSize: 12, lineHeight: 18, fontFamily: 'Cairo' },
    sm: { fontSize: 14, lineHeight: 21, fontFamily: 'Cairo' },
    md: { fontSize: 16, lineHeight: 24, fontFamily: 'Cairo' },
    lg: { fontSize: 18, lineHeight: 27, fontFamily: 'Cairo' },
    xl: { fontSize: 20, lineHeight: 30, fontFamily: 'Cairo' },
    '2xl': { fontSize: 24, lineHeight: 36, fontFamily: 'Cairo' },
    '3xl': { fontSize: 30, lineHeight: 45, fontFamily: 'Cairo' },
    '4xl': { fontSize: 36, lineHeight: 54, fontFamily: 'Cairo' },
  },
  radius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
  shadows: {
    none: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
    },
    sm: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
    },
    md: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
    },
    lg: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 5.46,
    },
  },
};

export const darkTokens: TokenSet = {
  colors: {
    background: '#121212',
    text: '#F5F5F5',
    textSecondary: '#AAAAAA',
    primary: '#66BB6A',
    primaryLight: '#81C784',
    error: '#EF5350',
    success: '#66BB6A',
    warning: '#FF9800',
    surface: '#1E1E1E',
    border: '#333333',
    tabBackground: '#1E1E1E',
    tabBarInactive: '#777777',
    skeletonBase: '#333333',
    skeletonHighlight: '#444444',
  },
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
    xs: { fontSize: 12, lineHeight: 18, fontFamily: 'Cairo' },
    sm: { fontSize: 14, lineHeight: 21, fontFamily: 'Cairo' },
    md: { fontSize: 16, lineHeight: 24, fontFamily: 'Cairo' },
    lg: { fontSize: 18, lineHeight: 27, fontFamily: 'Cairo' },
    xl: { fontSize: 20, lineHeight: 30, fontFamily: 'Cairo' },
    '2xl': { fontSize: 24, lineHeight: 36, fontFamily: 'Cairo' },
    '3xl': { fontSize: 30, lineHeight: 45, fontFamily: 'Cairo' },
    '4xl': { fontSize: 36, lineHeight: 54, fontFamily: 'Cairo' },
  },
  radius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
  shadows: {
    none: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
    },
    sm: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
    },
    md: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.56,
    },
    lg: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 6.68,
    },
  },
};
