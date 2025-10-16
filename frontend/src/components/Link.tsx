import React from 'react';

import { Pressable, type PressableProps } from 'react-native';

import StyledText, { type StyledTextProps } from './StyledText';

import { openLink } from '../utils/linking';

interface LinkProps extends Omit<PressableProps, 'children'> {
  children: StyledTextProps['children'];
  email?: boolean;
  href: string;
}

const Link = ({ children, email, href, ...props }: LinkProps) => {
  const url = email ? `mailto:${href}` : href;

  return (
    <Pressable onPress={() => openLink(url)} {...props}>
      <StyledText variant="link">{children}</StyledText>
    </Pressable>
  );
};

export default Link;
