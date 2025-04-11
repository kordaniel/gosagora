import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';

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
