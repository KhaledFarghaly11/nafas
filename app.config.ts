import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Nafas',
  slug: 'nafas',
  scheme: 'nafas',
  version: '1.0.0',
  orientation: 'default',
  icon: './assets/icon.png',
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#FAF3E8',
  },
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'com.nafas.app',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#FAF3E8',
    },
    package: 'com.nafas.app',
  },
  plugins: ['expo-router'],
});
