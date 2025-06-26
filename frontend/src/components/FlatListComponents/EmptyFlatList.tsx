import React from 'react';

import { ActivityIndicator, View } from 'react-native';
import { useTheme } from 'react-native-paper';

import { AppTheme } from '../../types';
import StyledText from '../StyledText';

interface EmptyFlatListProps {
  message?: string;
  errorPrefix?: string | null;
  error?: string;
  loading?: boolean;
}

const EmptyFlatList = ({ message, errorPrefix, error, loading }: EmptyFlatListProps) => {
  const theme = useTheme<AppTheme>();

  if (error || loading) {
    return (
      <View style={theme.styles.primaryContainer}>
        {loading && <ActivityIndicator size="large" color={theme.colors.onPrimaryContainer} />}
        {
          error && <StyledText variant="error">
            <>{errorPrefix && <>{errorPrefix}:&nbsp;</>}{error}</>
          </StyledText>
        }
      </View>
    );
  }

  if (message) {
    return (
      <View style={theme.styles.primaryContainer}>
        <StyledText>{message}</StyledText>
      </View>
    );
  }

  return null;
};

export default EmptyFlatList;
