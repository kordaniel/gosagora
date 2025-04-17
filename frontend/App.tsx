import React from 'react';

import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Main from './src/components/Main';

import useAppTheme from './src/hooks/useAppTheme';

const App = () => {
  const theme = useAppTheme();
  return (
    <SafeAreaProvider style={{ backgroundColor: theme.colors.background }}>
      <PaperProvider theme={theme}>
        <Main />
      </PaperProvider>
    </SafeAreaProvider>
  );
};

export default App;
