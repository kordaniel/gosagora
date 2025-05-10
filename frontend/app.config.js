import 'dotenv/config';

export default {
  name: 'GosaGora',
  slug: 'GosaGora',
  version: '0.0.1',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic', // https://docs.expo.dev/develop/user-interface/color-themes/
  newArchEnabled: true,
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    }
  },
  web: {
    favicon: './assets/favicon.png',
  },
  extra: {
    ENV: process.env.ENV || 'production',
    BACKEND_BASE_URL: process.env.BACKEND_BASE_URL,
    FIREBASE_AUTH_EMULATOR_HOST: process.env.FIREBASE_AUTH_EMULATOR_HOST || undefined,
  },
};
