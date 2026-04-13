export const fontFamilies = {
  display: 'Tajawal',
  displayMedium: 'TajawalMedium',
  displayBold: 'TajawalBold',
  displayExtraBold: 'TajawalExtraBold',
  body: 'NotoSansArabic',
  bodyLight: 'NotoSansArabicLight',
  bodyMedium: 'NotoSansArabicMedium',
  numeral: 'CormorantGaramond',
  numeralSemiBold: 'CormorantGaramondSemiBold',
  numeralItalic: 'CormorantGaramondItalic',
} as const;

export type FontRole = 'display' | 'body' | 'numeral';

export function getFontFamily(role: FontRole): string {
  const map: Record<FontRole, string> = {
    display: fontFamilies.display,
    body: fontFamilies.body,
    numeral: fontFamilies.numeral,
  };
  return map[role];
}
