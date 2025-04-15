import React from 'react';
import { View } from 'react-native';

import StyledText from './StyledText';

import useGosagoraService from '../hooks/useGosagoraService';

const ServiceHealth = () => {
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
        <StyledText>Error: {error}</StyledText>
      </View>
    );
  }

  return (
    <View>
      <StyledText>Service Status: {status}</StyledText>
    </View>
  );
};

export default ServiceHealth;
