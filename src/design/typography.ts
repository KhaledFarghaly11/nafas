export const fontFamilies = {
  latin: { heading: 'SpaceGrotesk', body: 'Inter' },
  arabic: { heading: 'Cairo', body: 'Cairo' },
} as const;

export function getFontFamily(language: 'ar' | 'en', variant: 'heading' | 'body'): string {
  const group = language === 'ar' ? fontFamilies.arabic : fontFamilies.latin;
  return group[variant];
}
