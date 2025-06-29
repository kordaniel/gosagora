import React from 'react';

import { ActivityIndicator, Text, View } from 'react-native';
import { en, registerTranslation } from 'react-native-paper-dates';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Provider as StoreProvider } from 'react-redux';

import DeveloperView from './src/components/DeveloperView';
import Navigator from './src/components/Navigator';

import { SelectAuth } from './src/store/slices/authSlice';
import store from './src/store';
import { useAppSelector } from './src/store/hooks';
import useAppTheme from './src/hooks/useAppTheme';
import useAuthInit from './src/hooks/useAuthInit';

// react-native-paper-dates setup
// NOTE: 'main' must be registered when translations are registered => don't run from index.ts
// https://web-ridge.github.io/react-native-paper-dates/docs/intro#register-translation
registerTranslation('en', en);

const AppRenderer = () => {
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

const AuthWrapper = () => {
  useAuthInit();
  const { isInitialized } = useAppSelector(SelectAuth);

  if (isInitialized) {
    return <AppRenderer/>;
  }

  return (
    <View style={{
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
    }}>
      <ActivityIndicator size="large" />
      <Text>Initializing GosaGora</Text>
    </View>
  );
};

const App = () => {
  return (
    <StoreProvider store={store}>
      <AuthWrapper />
    </StoreProvider>
  );
};

export default App;
