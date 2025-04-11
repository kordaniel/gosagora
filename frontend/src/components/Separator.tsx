import React from 'react';
import { useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppTheme } from '../types';

const Separator = () => {
  const theme = useTheme<AppTheme>();
  return (
    <SafeAreaView mode="margin" style={theme.styles.separator} />
  );
};

export default Separator;
