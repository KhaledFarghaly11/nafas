import { Feather } from '@expo/vector-icons';
import React from 'react';
import { type ViewStyle } from 'react-native';
import { useTheme } from '@/design/theme';
import { useRTL, applyRTLStyle } from '@/lib/rtl';

type FeatherName = React.ComponentProps<typeof Feather>['name'];
type IconColor = 'primary' | 'secondary' | 'error' | 'inverse';

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
};

export function Icon({
  name,
  size = 24,
  color = 'primary',
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
