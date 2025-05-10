import React from 'react';

import { PaperProvider } from 'react-native-paper';
import type { ReactNode } from 'react';

import useAppTheme from '../../src/hooks/useAppTheme';

export const AllProvidersWrapper = ({ children }: { children: ReactNode }) => {
  const theme = useAppTheme();
  return (
    <PaperProvider theme={theme}>
      {children}
    </PaperProvider>
  );
};
