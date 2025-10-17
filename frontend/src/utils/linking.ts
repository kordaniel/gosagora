import * as Linking from 'expo-linking';

import config from './config';

export const openLink = (href: string): void => {
  if (!config.IS_MOBILE && !href.startsWith('mailto:')) {
    window.open(href);
  } else {
    Linking.openURL(href).catch((error: unknown) => {
      console.error('Opening link:', error instanceof Error ? error.message : JSON.stringify(error));
    });
  }
};
