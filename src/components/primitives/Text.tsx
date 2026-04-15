import React from 'react';
import { Text as RNText, type TextStyle } from 'react-native';
import { useTheme } from '@/design/theme';
import { useRTL } from '@/lib/rtl';

type TextVariant = 'heading1' | 'heading2' | 'heading3' | 'body' | 'caption' | 'overline' | 'price';
type TextColor =
  | 'primary'
  | 'secondary'
  | 'error'
  | 'inverse'
  | 'clay'
  | 'saffron'
  | 'mint'
  | 'smoke';
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
  caption: 'xs',
  overline: 'xs',
  price: 'numeral',
};

const headingVariants = new Set<TextVariant>(['heading1', 'heading2', 'heading3']);

const colorToToken: Record<TextColor, keyof ReturnType<typeof useTheme>['colors']> = {
  primary: 'text',
  secondary: 'textSecondary',
  error: 'error',
  inverse: 'background',
  clay: 'clay',
  saffron: 'saffron',
  mint: 'mint',
  smoke: 'smoke',
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

  const typo = tokens.typography[variantToToken[variant]];
  const resolvedColor = tokens.colors[colorToToken[color]];

  const resolvedAlign = align === 'auto' ? (isRTL ? 'right' : 'left') : align;

  const isHeading = headingVariants.has(variant);

  return (
    <RNText
      testID={testID}
      numberOfLines={numberOfLines}
      accessibilityRole={isHeading ? 'header' : undefined}
      style={[
        {
          fontSize: typo.fontSize,
          lineHeight: typo.lineHeight,
          fontFamily: typo.fontFamily,
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
