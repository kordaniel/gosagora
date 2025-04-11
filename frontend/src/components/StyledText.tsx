import React from 'react';
import { Text, StyleSheet } from 'react-native';
import type { TextProps as NativeTextProps } from 'react-native';

import { useAppTheme } from '../hooks/useAppTheme';

const StyledText = (props: NativeTextProps) => {
  const { isDarkScheme } = useAppTheme();

  return (
    <Text style={isDarkScheme ? styles.dark : styles.light} {...props} />
  );
};

const styles = StyleSheet.create({
  light: {
    color: '#252500',
  },
  dark: {
    color: '#ffffff',
  },
});

export default StyledText;
