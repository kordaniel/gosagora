import React, { ReactNode } from 'react';

import { View } from 'react-native';
import { useTheme } from 'react-native-paper';

import StyledText from './StyledText';

import type { AppTheme } from '../types';

const ErrorRenderer = ({ children }: { children: ReactNode }) => {
  const theme = useTheme<AppTheme>();

  if (!children) {
    return null;
  }

  return (
    <View style={theme.styles.errorContainer}>
      <StyledText variant="error">{children}</StyledText>
    </View>
  );
};

export default ErrorRenderer;
