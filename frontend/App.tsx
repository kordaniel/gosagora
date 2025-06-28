import React from 'react';

import { en, registerTranslation } from 'react-native-paper-dates';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Provider as StoreProvider } from 'react-redux';

import DeveloperView from './src/components/DeveloperView';
import Navigator from './src/components/Navigator';

import store from './src/store';
import useAppTheme from './src/hooks/useAppTheme';

// react-native-paper-dates setup
// NOTE: 'main' must be registered when translations are registered => don't run from index.ts
// https://web-ridge.github.io/react-native-paper-dates/docs/intro#register-translation
registerTranslation('en', en);

const App = () => {
  const theme = useAppTheme();
  return (
    <SafeAreaProvider style={{ backgroundColor: theme.colors.background }}>
      <StoreProvider store={store}>
        <PaperProvider theme={theme}>
          <StatusBar style={theme.dark ? "light" : "dark" } />
          <DeveloperView />
          <NavigationContainer>
            <Navigator />
          </NavigationContainer>
        </PaperProvider>
      </StoreProvider>
    </SafeAreaProvider>
  );
};

export default App;
