import React from 'react';
import { Text } from 'react-native';
import type { TextProps } from 'react-native';

const StyledText = (props: TextProps) => {
  return (
    <Text {...props} />
  );
};

export default StyledText;
