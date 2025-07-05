import React from 'react';

import { ScrollView, View } from 'react-native';
import { useTheme } from 'react-native-paper';

import Link from '../../components/Link';
import LoadingOrErrorRenderer from '../../components/LoadingOrErrorRenderer';
import StyledText from '../../components/StyledText';

import { type AppTheme } from '../../types';
import { RaceTypeReverseMap } from '../../models/race';
import { SelectRace } from '../../store/slices/raceSlice';
import { useAppSelector } from '../../store/hooks';

const RaceView = () => {
  const theme = useTheme<AppTheme>();
  const { selectedRace, loading, error } = useAppSelector(SelectRace);

  if (loading || error) {
    return (
      <ScrollView contentContainerStyle={theme.styles.primaryContainer}>
        <LoadingOrErrorRenderer
          loading={loading}
          loadingMessage="Just a moment, we are loading the race for you" error={error}
        />
      </ScrollView>
    );
  }

  if (!selectedRace) {
    return (
      <ScrollView contentContainerStyle={theme.styles.primaryContainer}>
        <StyledText variant="headline">Select a race to see it&apos;s details</StyledText>
      </ScrollView>
    );
  }

  const raceTypeStr = RaceTypeReverseMap[selectedRace.type] ?? '-';

  return (
    <ScrollView contentContainerStyle={theme.styles.primaryContainer}>
      <StyledText variant="headline">{selectedRace.name}</StyledText>
      <View style={theme.styles.table}>
        <View style={theme.styles.tableColumn}>
          <StyledText variant="title" style={theme.styles.tableCellData}>Description</StyledText>
          <StyledText style={theme.styles.tableCellData}>{selectedRace.description}</StyledText>
        </View>
        <View style={theme.styles.tableRow}>
          <StyledText variant="title" style={theme.styles.tableCellData}>Organizer</StyledText>
          <StyledText style={theme.styles.tableCellData}>{selectedRace.user.displayName}</StyledText>
        </View>
        {selectedRace.url &&
          <View style={theme.styles.tableRow}>
            <StyledText variant="title" style={theme.styles.tableCellData}>Website</StyledText>
            <Link style={theme.styles.tableCellData} href={selectedRace.url}>{selectedRace.url}</Link>
          </View>
        }
        {selectedRace.email &&
          <View style={theme.styles.tableRow}>
            <StyledText variant="title" style={theme.styles.tableCellData}>E-mail</StyledText>
            <Link style={theme.styles.tableCellData} href={selectedRace.email} email={true}>{selectedRace.email}</Link>
          </View>
        }
        <View style={theme.styles.tableRow}>
          <StyledText variant="title" style={theme.styles.tableCellData}>Race type</StyledText>
          <StyledText style={theme.styles.tableCellData}>{raceTypeStr}</StyledText>
        </View>
        <View style={theme.styles.tableRow}>
          <StyledText variant="title" style={theme.styles.tableCellData}>Start date</StyledText>
          <StyledText style={theme.styles.tableCellData}>{selectedRace.dateFrom.toLocaleString()}</StyledText>
        </View>
        <View style={theme.styles.tableRow}>
          <StyledText variant="title" style={theme.styles.tableCellData}>End date</StyledText>
          <StyledText style={theme.styles.tableCellData}>{selectedRace.dateTo.toLocaleString()}</StyledText>
        </View>
        <View style={theme.styles.tableRow}>
          <StyledText variant="title" style={theme.styles.tableCellData}>Registration opens</StyledText>
          <StyledText style={theme.styles.tableCellData}>{selectedRace.registrationOpenDate.toLocaleString()}</StyledText>
        </View>
        <View style={theme.styles.tableRow}>
          <StyledText variant="title" style={theme.styles.tableCellData}>Registration closes</StyledText>
          <StyledText style={theme.styles.tableCellData}>{selectedRace.registrationCloseDate.toLocaleString()}</StyledText>
        </View>
      </View>
    </ScrollView>
  );
};

export default RaceView;
