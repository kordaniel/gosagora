import React from 'react';

import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

import { AppTheme } from '../types';

interface SeparatorProps {
  height?: number;
}

const Separator = ({ height }: SeparatorProps) => {
  const theme = useTheme<AppTheme>();
  const style = StyleSheet.compose(
    theme.styles.separator,
    height === undefined ? undefined : { height }
  );

  return (
    <SafeAreaView mode="margin" style={style} />
  );
};

export default Separator;
