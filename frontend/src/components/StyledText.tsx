import React from 'react';

import type {
  ImageStyle,
  StyleProp,
  TextProps,
  TextStyle,
  ViewStyle
} from 'react-native';
import { StyleSheet, Text } from 'react-native';
import { useTheme } from 'react-native-paper';

import { AppTheme } from '../types';
import { assertNever } from '../utils/typeguards';

interface StyledTextProps extends TextProps {
  variant?: 'title' | 'button' | 'error' | 'headline';
}

const StyledText = ({ variant, ...props }: StyledTextProps) => {
  const theme = useTheme<AppTheme>();

  const variantStyle = (variant: StyledTextProps['variant']): StyleProp<ViewStyle | ImageStyle | TextStyle> => {
    switch (variant) {
      case undefined:
        return theme.styles.onPrimaryContainer;
      case 'title':
        return StyleSheet.compose(theme.styles.onPrimaryContainer, theme.styles.textTitle);
      case 'button':
        return theme.styles.buttonText;
      case 'error':
        return theme.styles.onErrorContainer;
      case 'headline':
        return StyleSheet.compose(theme.styles.onPrimaryContainer, theme.styles.textHeadline);
      default:
        return assertNever(variant);
    }
  };

  return (
    <Text style={variantStyle(variant)} {...props} />
  );
};

export default StyledText;
