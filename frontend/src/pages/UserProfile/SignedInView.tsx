import React from 'react';

import { type GestureResponderEvent, View } from 'react-native';
import { useTheme } from 'react-native-paper';

import Button from '../../components/Button';
import StyledText from '../../components/StyledText';

import { AppTheme } from 'src/types';


interface SignedInViewProps {
  handleSignOut: () => Promise<void>;
}

const SignedInView = ({ handleSignOut }: SignedInViewProps) => {
  const theme = useTheme<AppTheme>();

  return (
    <View>
      <StyledText variant="headline">Profile</StyledText>
      <Button onPress={theme.toggleScheme}>
        {theme.dark ? "Toggle light theme" : "Toggle dark theme"}
      </Button>
      <Button onPress={handleSignOut as (e?: GestureResponderEvent) => void}>
        Sign Out
      </Button>
    </View>
  );
};

export default SignedInView;
