import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import DeveloperView from 'src/components/DeveloperView';
import Navigator from 'src/components/Navigator';

import useAppTheme from './src/hooks/useAppTheme';

const App = () => {
  const theme = useAppTheme();
  return (
    <SafeAreaProvider style={{ backgroundColor: theme.colors.background }}>
      <PaperProvider theme={theme}>
        <StatusBar style={theme.dark ? "light" : "dark" } />
        <DeveloperView />
        <NavigationContainer>
          <Navigator />
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
};

export default App;
