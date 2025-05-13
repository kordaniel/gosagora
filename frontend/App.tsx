import React from 'react';

import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStaticNavigation } from '@react-navigation/native';

import Main from './src/components/Main';

import useAppTheme from './src/hooks/useAppTheme';

const RootStack = createNativeStackNavigator({
  screens: {
    Home: Main,
  },
});

const Navigation = createStaticNavigation(RootStack);

const App = () => {
  const theme = useAppTheme();
  return (
    <SafeAreaProvider style={{ backgroundColor: theme.colors.background }}>
      <PaperProvider theme={theme}>
        <Navigation />
      </PaperProvider>
    </SafeAreaProvider>
  );
};

export default App;
