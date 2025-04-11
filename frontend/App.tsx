import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Main from './src/components/Main';

import { useTheme, ThemeContext } from './src/hooks/useAppTheme';

const App = () => {
  const theme = useTheme();

  return (
    <SafeAreaProvider>
      <ThemeContext.Provider value={theme}>
        <Main />
      </ThemeContext.Provider>
    </SafeAreaProvider>
  );
};

export default App;
