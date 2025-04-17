import React from 'react';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';

import { AppTheme } from '../types';

const Separator = () => {
  const theme = useTheme<AppTheme>();
  return (
    <SafeAreaView mode="margin" style={theme.styles.separator} />
  );
};

export default Separator;
