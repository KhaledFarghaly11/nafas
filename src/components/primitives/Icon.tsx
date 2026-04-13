import { Feather } from '@expo/vector-icons';
import React from 'react';
import { type ViewStyle } from 'react-native';
import { useTheme } from '@/design/theme';
import { useRTL, applyRTLStyle } from '@/lib/rtl';

type FeatherName = React.ComponentProps<typeof Feather>['name'];
type IconColor =
  | 'primary'
  | 'secondary'
  | 'error'
  | 'inverse'
  | 'clay'
  | 'saffron'
  | 'mint'
  | 'smoke'
  | 'bark';

interface IconProps {
  name: FeatherName;
  size?: number;
  color?: IconColor;
  mirrorInRTL?: boolean;
  style?: ViewStyle;
  testID?: string;
}

const colorToToken: Record<IconColor, keyof ReturnType<typeof useTheme>['colors']> = {
  primary: 'text',
  secondary: 'textSecondary',
  error: 'error',
  inverse: 'background',
  clay: 'clay',
  saffron: 'saffron',
  mint: 'mint',
  smoke: 'smoke',
  bark: 'bark',
};

export function Icon({
  name,
  size = 24,
  color = 'bark',
  mirrorInRTL = false,
  style,
  testID,
}: IconProps) {
  const tokens = useTheme();
  const isRTL = useRTL();
  const resolvedColor = tokens.colors[colorToToken[color]];
  const rtlStyle = applyRTLStyle(isRTL, mirrorInRTL);

  return (
    <Feather
      testID={testID}
      name={name}
      size={size}
      color={resolvedColor}
      style={[rtlStyle, style]}
    />
  );
}
