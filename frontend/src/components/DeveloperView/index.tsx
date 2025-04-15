import React from 'react';
import { Platform, View } from 'react-native';

import StyledText from '../StyledText';

import config from '../../utils/config';
import useGosagoraService from '../../hooks/useGosagoraService';

const ServiceStatus = () => {
  const { status, loading, error } = useGosagoraService();

  if (loading) {
    return (
      <View>
        <StyledText>Service Status: loading..</StyledText>
      </View>
    );
  }
  if (error) {
    return (
      <View>
        <StyledText>Error getting Service Status: {error}</StyledText>
      </View>
    );
  }

  return (
    <View>
      <StyledText>Service Status: {status}</StyledText>
    </View>
  );
};

const DebugView = () => {
  return (
    <View>
      <ServiceStatus />
      <StyledText>REST backend URL: {config.BACKEND_BASE_URL}.</StyledText>
      <StyledText>Platform: {Platform.OS}{Platform.OS !== 'web' && <>&nbsp;ver. {Platform.Version}</>}.</StyledText>
    </View>
  );
};

const DeveloperView = () => config.IS_DEVELOPMENT_ENV
    ? <DebugView />
    : null;

export default DeveloperView;
