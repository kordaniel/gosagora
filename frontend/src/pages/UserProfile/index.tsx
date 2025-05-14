import React from 'react';

import { Button, View } from 'react-native';
import { useTheme } from 'react-native-paper';

import StyledText from 'src/components/StyledText';

import type { AppTheme } from 'src/types';
import useAuth from 'src/hooks/useAuth';

const UserProfile = () => {
  const theme = useTheme<AppTheme>();
  const { user } = useAuth();

  console.log('user:', user);

  return (
    <View style={theme.styles.primaryContainer}>
      <StyledText variant="headline">Profile</StyledText>
      <Button
        title={theme.dark ? "Toggle light theme" : "Toggle dark theme"}
        onPress={theme.toggleScheme}
      />
    </View>
  );
};

export default UserProfile;
