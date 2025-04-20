import React from 'react';

import { ActivityIndicator, Animated, Pressable, PressableProps } from 'react-native';
import type { ReactNode } from 'react';
import { useTheme } from 'react-native-paper';

import StyledText from './StyledText';

import { AppTheme } from '../types';

interface ButtonProps extends Omit<PressableProps, 'children' | 'onPressIn' | 'onPressOut'> {
  children: ReactNode, // Omit cb from PressableProps ('ReactNode | ((state: PressableStateCallbackType) => ReactNode)')
  ctxLoading?: boolean;
}

const Button = ({ children, ctxLoading, disabled, onPress, ...props }: ButtonProps) => {
  const theme = useTheme<AppTheme>();
  const backgroundColorRef = new Animated.Value(0);

  const handlePressIn = () => {
    Animated.timing(backgroundColorRef, {
      toValue: 1,
      duration: 60,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(backgroundColorRef, {
      toValue: 0,
      duration: 60,
      useNativeDriver: true,
    }).start();
  };

  const backgroundColor = backgroundColorRef.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.colors.primary, theme.colors.onPrimary],
  });

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      {...props}
    >
      <Animated.View style={[
        theme.styles.button,
        { backgroundColor },
        disabled && theme.styles.buttonDisabled,
        ctxLoading && theme.styles.buttonLoading,
      ]}>
        {ctxLoading && <ActivityIndicator color={theme.colors.onPrimary} size='small'/>}
        <StyledText variant="button">
          {children}
        </StyledText>
      </Animated.View>
    </Pressable>
  );
};

export default Button;
