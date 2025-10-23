import 'dotenv/config';

export default {
  name: 'GosaGora',
  slug: 'gosagora',
  version: '0.0.1',
  githubUrl: 'https://github.com/kordaniel/gosagora',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  userInterfaceStyle: 'automatic', // https://docs.expo.dev/develop/user-interface/color-themes/
  newArchEnabled: true,
  plugins: [[
    'expo-asset',
    {
      'assets': [
        './assets/bundles',
        './assets/html',
      ]
    }
  ], [
    'expo-location',
    {
      locationAlwaysAndWhenInUsePermission: 'Allow location access so we can provide you insights about your tracks and performance and to be able to deliver reliable race results.',
      locationWhenInUsePermission: 'Allow location access so we can provide you insights about your tracks and performance and to be able to deliver reliable race results.',
      isAndroidBackgroundLocationEnabled: true,
    }
  ]],
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  ios: {
    bundleIdentifier: 'com.kordaniel.gosagora',
    supportsTablet: true,
    isTabletOnly: false,
    infoPlist: {
      UIBackgroundModes: ['location'],
      NSLocationWhenInUseUsageDescription: 'Allow location access so we can provide you insights about your tracks and performance and to be able to deliver reliable race results.',
      NSLocationAlwaysUsageDescription: 'Allow location access so we can provide you insights about your tracks and performance and to be able to deliver reliable race results.',
      NSLocationAlwaysAndWhenInUseUsageDescription: 'Allow location access so we can provide you insights about your tracks and performance and to be able to deliver reliable race results.'
    }
  },
  android: {
    package: 'com.kordaniel.gosagora',
    permissions: [
      'ACCESS_FINE_LOCATION',
      'ACCESS_COARSE_LOCATION',
      'ACCESS_BACKGROUND_LOCATION',
      'FOREGROUND_SERVICE'
    ]
  },
  web: {
    favicon: './assets/images/favicon.png',
  },
  extra: {
    eas: {
      projectId: 'c91e78a0-c464-4f71-8300-a3134ced9531',
    },
    ENV: process.env.ENV || 'production',
    BACKEND_BASE_URL: process.env.BACKEND_BASE_URL,
    FIREBASE_AUTH_EMULATOR_HOST: process.env.FIREBASE_AUTH_EMULATOR_HOST || undefined,
  },
};
