import React from 'react';

import type { GestureResponderEvent } from 'react-native';
import { View } from 'react-native';
import { useTheme } from 'react-native-paper';

import Button from '../../components/Button';
import StyledText from '../../components/StyledText';

import { AppTheme } from '../../types';

interface SignOutProps {
  handleSignOut: () => Promise<void>;
}

const SignOut = ({ handleSignOut }: SignOutProps) => {
  const theme = useTheme<AppTheme>();

  return (
    <View style={theme.styles.primaryContainer}>
      <StyledText variant="title">Sign Out</StyledText>
      <Button onPress={handleSignOut as (e?: GestureResponderEvent) => void}>Sign out</Button>
    </View>
  );
};

export default SignOut;
