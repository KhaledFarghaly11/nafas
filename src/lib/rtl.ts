import { I18nManager, type ViewStyle } from 'react-native';

export function useRTL(): boolean {
  return I18nManager.isRTL;
}

export function applyRTLStyle(isRTL: boolean, mirrorInRTL: boolean): ViewStyle | undefined {
  if (isRTL && mirrorInRTL) {
    return { transform: [{ scaleX: -1 }] };
  }
  return undefined;
}
