import React from 'react';

import { ActivityIndicator, ScrollView } from 'react-native';
import { useTheme } from 'react-native-paper';

import { SelectRace } from '../../store/slices/raceSlice';
import StyledText from '../../components/StyledText';

import { type AppTheme } from '../../types';
import { useAppSelector } from '../../store/hooks';

const RaceView = () => {
  const theme = useTheme<AppTheme>();
  const { selectedRace, loading, error } = useAppSelector(SelectRace);

  if (loading || error) {
    return (
      <ScrollView contentContainerStyle={theme.styles.primaryContainer}>
        {
          loading && <>
            <ActivityIndicator size="large" color={theme.colors.onPrimaryContainer} />
            <StyledText>Loading selected race..</StyledText>
          </>
        }
        {
          error && <StyledText variant="error">
            {error}
          </StyledText>
        }
      </ScrollView>
    );
  }
  if (!selectedRace) {
    return (
      <ScrollView contentContainerStyle={theme.styles.primaryContainer}>
        <StyledText>No race..</StyledText>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={theme.styles.primaryContainer}>
      <StyledText variant="headline">{selectedRace.name}</StyledText>
      <StyledText>User: {selectedRace.user.displayName}</StyledText>
      <StyledText>Type: {selectedRace.type}</StyledText>
      <StyledText>From: {selectedRace.dateFrom}</StyledText>
      <StyledText>To: {selectedRace.dateTo}</StyledText>
      <StyledText>Reg open: {selectedRace.registrationOpenDate}</StyledText>
      <StyledText>Reg close: {selectedRace.registrationCloseDate}</StyledText>
      <StyledText>Description: {selectedRace.description}</StyledText>
      <StyledText>URL: {selectedRace.url}</StyledText>
      <StyledText>Email: {selectedRace.email}</StyledText>
    </ScrollView>
  );
};

export default RaceView;
