import React from 'react';

import { Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from 'react-native-paper';

import DeveloperView from './DeveloperView';
import Separator from './Separator';
import StyledText from './StyledText';

import type { AppTheme } from '../types';

const Main = () => {
  const theme = useTheme<AppTheme>();

  return (
    <SafeAreaView style={theme.styles.primaryContainer}>
      <DeveloperView />
      <StyledText>GosaGora</StyledText>
      <Separator />
      <StyledText>Welcome to GosaGora!</StyledText>
      <Button
        title={theme.dark ? "Toggle light theme" : "Toggle dark theme"}
        onPress={theme.toggleScheme}
      />
      <StatusBar
        style={theme.dark ? "light" : "dark"}
      />
    </SafeAreaView>
  );
};

export default Main;
