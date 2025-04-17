import React from 'react';

import { StyleSheet, Text } from 'react-native';
import type { TextProps } from 'react-native';
import { useTheme } from 'react-native-paper';

const StyledText = (props: TextProps) => {
  const theme = useTheme();

  const style = StyleSheet.compose(theme.fonts.default, {
    color: theme.colors.onPrimaryContainer
  });

  return (
    <Text style={style} {...props} />
  );
};

export default StyledText;
