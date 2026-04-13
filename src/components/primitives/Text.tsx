import React from 'react';
import { Text as RNText, type TextStyle } from 'react-native';
import { useTheme } from '@/design/theme';
import { getFontFamily } from '@/design/typography';
import { useRTL } from '@/lib/rtl';
import { useSettingsStore } from '@/stores/settings-store';

type TextVariant = 'heading1' | 'heading2' | 'heading3' | 'body' | 'caption' | 'overline';
type TextColor = 'primary' | 'secondary' | 'error' | 'inverse';
type TextAlign = 'left' | 'center' | 'right' | 'auto';

interface TextProps {
  children: React.ReactNode;
  variant?: TextVariant;
  color?: TextColor;
  align?: TextAlign;
  numberOfLines?: number;
  style?: TextStyle;
  testID?: string;
}

const variantToToken: Record<TextVariant, keyof ReturnType<typeof useTheme>['typography']> = {
  heading1: '4xl',
  heading2: '3xl',
  heading3: '2xl',
  body: 'md',
  caption: 'sm',
  overline: 'xs',
};

const colorToToken: Record<TextColor, keyof ReturnType<typeof useTheme>['colors']> = {
  primary: 'text',
  secondary: 'textSecondary',
  error: 'error',
  inverse: 'background',
};

export function Text({
  children,
  variant = 'body',
  color = 'primary',
  align = 'auto',
  numberOfLines,
  style,
  testID,
}: TextProps) {
  const tokens = useTheme();
  const isRTL = useRTL();
  const language = useSettingsStore((s) => s.language);

  const typo = tokens.typography[variantToToken[variant]];
  const resolvedColor = tokens.colors[colorToToken[color]];
  const isHeading = variant === 'heading1' || variant === 'heading2' || variant === 'heading3';
  const fontFamily = getFontFamily(language, isHeading ? 'heading' : 'body');

  const resolvedAlign = align === 'auto' ? (isRTL ? 'right' : 'left') : align;

  return (
    <RNText
      testID={testID}
      numberOfLines={numberOfLines}
      style={[
        {
          fontSize: typo.fontSize,
          lineHeight: typo.lineHeight,
          fontFamily,
          color: resolvedColor,
          textAlign: resolvedAlign,
        },
        style,
      ]}
    >
      {children}
    </RNText>
  );
}
