import React from 'react';

import { ScrollView, View } from 'react-native';
import { useTheme } from 'react-native-paper';

import LoadingOrErrorRenderer from '../../components/LoadingOrErrorRenderer';
import StyledText from '../../components/StyledText';

import { type AppTheme } from '../../types';
import { SelectSelectedBoat } from '../../store/slices/boatSlice';
import { useAppSelector } from '../../store/hooks';

const BoatView = () => {
  const theme = useTheme<AppTheme>();
  const { boat, error, loading } = useAppSelector(SelectSelectedBoat);

  if (loading || error) {
    return (
      <ScrollView contentContainerStyle={theme.styles.primaryContainer}>
        <LoadingOrErrorRenderer
          loading={loading}
          loadingMessage="Just a moment, we are loading the boat for you"
          error={error}
        />
      </ScrollView>
    );
  }

  if (!boat) {
    return (
      <ScrollView contentContainerStyle={theme.styles.primaryContainer}>
        <StyledText variant="headline">Select a boat to see it&apos;s details</StyledText>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={theme.styles.primaryContainer}>
      <StyledText variant="headline">{boat.name}</StyledText>
      <View style={theme.styles.table}>
        <View style={theme.styles.tableRow}>
          <StyledText variant="title" style={theme.styles.tableCellData}>Type</StyledText>
          <StyledText style={theme.styles.tableCellData}>{boat.boatType}</StyledText>
        </View>
        {<View style={theme.styles.tableRow}>
          <StyledText variant="title" style={theme.styles.tableCellData}>Sail Number</StyledText>
          <StyledText style={theme.styles.tableCellData}>{boat.sailNumber ?? "No sail number given"}</StyledText>
        </View>}
        <View style={theme.styles.tableRow}>
          <StyledText variant="title" style={theme.styles.tableCellData}>Description</StyledText>
          <StyledText style={theme.styles.tableCellData}>{boat.description ?? "No description given"}</StyledText>
        </View>
        <View style={theme.styles.tableColumn}>
          <StyledText variant="title" style={theme.styles.tableCellData}>Owners list</StyledText>
          {boat.users.length === 0
            ? <StyledText style={theme.styles.tableCellData}>No owners</StyledText>
            : boat.users.map((({ id, displayName }) =>
              <StyledText key={id} style={theme.styles.tableCellData}>{displayName}</StyledText>
            ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default BoatView;
