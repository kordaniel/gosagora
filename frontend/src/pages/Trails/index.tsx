import React from 'react';

import { Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';

import type { AppTheme } from '../../types';

const Trails = () => {
  const theme = useTheme<AppTheme>();
  return (
    <SafeAreaView style={theme.styles.safeAreaView}>
      <ScrollView contentContainerStyle={theme.styles.primaryContainer}>
        <Text>Trails... placeholder</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Trails;
