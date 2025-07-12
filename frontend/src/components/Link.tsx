import React from 'react';

import * as Linking from 'expo-linking';
import { Pressable, type PressableProps } from 'react-native';

import StyledText, { type StyledTextProps } from './StyledText';

import config from '../utils/config';

interface LinkProps extends Omit<PressableProps, 'children'> {
  children: StyledTextProps['children'];
  email?: boolean;
  href: string;
}

const Link = ({ children, email, href, ...props }: LinkProps) => {
  const url = email ? `mailto:${href}` : href;

  const handlePress = () => {
    if (!config.IS_MOBILE && !email) {
      window.open(url);
    } else {
      Linking.openURL(url).catch((err: unknown) => {
        console.error(`opening link "${url}"`, err);
      });
    }
  };

  return (
    <Pressable onPress={handlePress} {...props}>
      <StyledText variant="link">{children}</StyledText>
    </Pressable>
  );
};

export default Link;
