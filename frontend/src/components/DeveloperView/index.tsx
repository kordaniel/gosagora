import React from 'react';

import { ActivityIndicator, Platform, View } from 'react-native';
import { useTheme } from 'react-native-paper';

import StyledText from '../StyledText';

import { AppTheme } from '../../types';
import config from '../../utils/config';
import useGosagoraService from '../../hooks/useGosagoraService';

const ServiceStatus = () => {
  const theme = useTheme<AppTheme>();
  const { status, loading, error } = useGosagoraService();

  if (loading) {
    return (
      <View style={{ flexDirection: "row" }}>
        <StyledText variant="small">Service Status: </StyledText>
        <ActivityIndicator size={theme.fonts.bodySmall.fontSize} />
      </View>
    );
  }
  if (error) {
    console.log('Service status error:', error);
    return (
      <View>
        <StyledText variant="small">Service Status: Error</StyledText>
      </View>
    );
  }

  return (
    <View>
      <StyledText variant="small">Service Status: {status}</StyledText>
    </View>
  );
};

const DebugView = () => {
  if (!config.IS_PRODUCTION_ENV && !config.FIREBASE_AUTH_EMULATOR_HOST) {
    throw new Error('Invalid configuration. App is running outside production env and no firebase emulator connection configured');
  }
  const theme = useTheme<AppTheme>();

  const getEnvStr = () => {
    if (config.IS_PRODUCTION_ENV) return 'production';
    if (config.IS_DEVELOPMENT_ENV) return 'development';
    if (config.IS_TEST_ENV) return 'test';
    throw new Error('Environment not set');
  };

  return (
    <View style={theme.styles.developerViewContainer}>
      <ServiceStatus />
      <StyledText variant="small">REST URI: {config.BACKEND_BASE_URL}</StyledText>
      <StyledText variant="small">FB emultr: {config.FIREBASE_AUTH_EMULATOR_HOST}</StyledText>
      <StyledText variant="small">Platform: {Platform.OS}{Platform.OS !== 'web' && <>&nbsp;ver. {Platform.Version}</>}.</StyledText>
      <StyledText variant="small">Env: {getEnvStr()}</StyledText>
    </View>
  );
};

const DeveloperView = () => config.IS_DEVELOPMENT_ENV
    ? <DebugView />
    : null;

export default DeveloperView;
