import React from 'react';

import { useTheme } from 'react-native-paper';

import ErrorRenderer from './ErrorRenderer';
import StyledText from './StyledText';

import { type AppTheme } from '../types';
import { ActivityIndicator, View } from 'react-native';

interface LoadingOrErrorRendererProps {
  error?: string | null;
  errorPrefix?: string | null;
  loading?: boolean | null;
  loadingMessage?: string | null;
}

const LoadingOrErrorRenderer = ({
  error,
  errorPrefix,
  loading,
  loadingMessage
}: LoadingOrErrorRendererProps) => {
  const theme = useTheme<AppTheme>();

  if (!error && !loading) {
    return null;
  }

  return (
    <View style={theme.styles.container}>
      {error && <ErrorRenderer>{errorPrefix ? `${errorPrefix}: ${error}` : error}</ErrorRenderer>}
      {loading &&
        <>
          <ActivityIndicator size="large" color={theme.colors.onPrimaryContainer} />
          {loadingMessage && <StyledText>{loadingMessage}</StyledText>}
        </>
      }
    </View>
  );
};

export default LoadingOrErrorRenderer;
