import React from 'react';

import { View } from 'react-native';

import StyledText from '../../components/StyledText';

import { RaceListing as IRaceListing } from '@common/types/race';

const RaceListing = ({ race }: { race: IRaceListing }) => {
  return (
    <View>
      <StyledText variant="title">Name: {race.name}</StyledText>
      <StyledText variant="small">Type: {race.type}</StyledText>
      <StyledText variant="small">Description: {race.description}</StyledText>
      <StyledText variant="small">Organizer: {race.user.displayName}</StyledText>
    </View>
  );
};

export default RaceListing;
