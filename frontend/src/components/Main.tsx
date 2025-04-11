import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Separator from './Separator';
import StyledText from './StyledText';

import { useAppTheme } from '../hooks/useAppTheme';

const Main = () => {
  const { isDarkScheme, toggleScheme } = useAppTheme();

  const styleContainer = StyleSheet.flatten([
    styles.light.container,
    isDarkScheme && styles.dark.container
  ]);

  return (
    <SafeAreaView style={styleContainer}>
      <StyledText>GosaGora</StyledText>
      <Separator />
      <StyledText>Welcome to GosaGora!</StyledText>
      <Button
        title={isDarkScheme ? "Toggle light theme" : "Toggle dark theme"}
        onPress={toggleScheme}
      />
      <StatusBar
        style={isDarkScheme ? "light" : "dark"}
        backgroundColor={styleContainer.backgroundColor}
      />
    </SafeAreaView>
  );
};

const styles = {
  light: StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#ffffff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  }),
  dark: StyleSheet.create({
    container: {
      backgroundColor: '#000025',
    },
  }),
};

export default Main;
