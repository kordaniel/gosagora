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

const variantStyle = (theme: AppTheme, variant: StyledTextProps['variant']): StyleProp<ViewStyle | ImageStyle | TextStyle> => {
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
    case 'small':
      return StyleSheet.compose(theme.styles.onPrimaryContainer, theme.styles.textSmall);
    case 'link':
      return theme.styles.textLink;
    default:
      return assertNever(variant);
  }
};

export interface StyledTextProps extends TextProps {
  variant?: 'title' | 'button' | 'error' | 'headline' | 'small' | 'link';
}

const StyledText = ({ style, variant, ...props }: StyledTextProps) => {
  const theme = useTheme<AppTheme>();
  const textStyle = StyleSheet.compose(variantStyle(theme, variant), style);

  return (
    <Text style={textStyle} {...props} />
  );
};

export default StyledText;
