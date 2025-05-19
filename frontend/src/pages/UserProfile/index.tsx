import React from 'react';

import { type GestureResponderEvent, View } from 'react-native';
import { useTheme } from 'react-native-paper';

import Authentication from '../../components/Authentication';
import Button from '../../components/Button';
import StyledText from 'src/components/StyledText';

import type { AppTheme } from 'src/types';
import useAuth from 'src/hooks/useAuth';

const UserProfile = () => {
  const theme = useTheme<AppTheme>();
  const { handleSignOut, isSignedIn } = useAuth();

  if (!isSignedIn) {
    return (
      <Authentication />
    );
  }

  return (
    <View style={theme.styles.primaryContainer}>
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

export default UserProfile;
