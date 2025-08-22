import React from 'react';

import { ScrollView, View } from 'react-native';
import { useTheme } from 'react-native-paper';

import StyledText from '../../components/StyledText';

import { type AppTheme } from '../../types';
import { SelectAuth } from '../../store/slices/authSlice';
import { type UserDetails } from '../../models/user';
import { useAppSelector } from '../../store/hooks';

const BoatsList = ({ boatIdentities }: { boatIdentities: UserDetails['boatIdentities'] }) => {
  const theme = useTheme<AppTheme>();

  if (boatIdentities.length === 0) {
    return (
      <View style={theme.styles.table}>
        <StyledText>No boats...</StyledText>
      </View>
    );
  }

  return (
    <View style={theme.styles.table}>
      {boatIdentities.map(boat => (
        <View key={boat.id} style={theme.styles.borderContainer}>
          <View style={theme.styles.tableRow}>
            <StyledText variant="title" style={theme.styles.tableCellData}>Name</StyledText>
            <StyledText style={theme.styles.tableCellData}>{boat.name}</StyledText>
          </View>
          <View style={theme.styles.tableRow}>
            <StyledText variant="title" style={theme.styles.tableCellData}>Type</StyledText>
            <StyledText style={theme.styles.tableCellData}>{boat.boatType}</StyledText>
          </View>
        </View>
      ))}
    </View>
  );
};

const UserBoats = () => {
  const theme = useTheme<AppTheme>();
  const { user } = useAppSelector(SelectAuth);

  if (!user) {
    return (
      <View>
        <StyledText>TODO: HANDLE THIS</StyledText>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={theme.styles.primaryContainer}>
      <StyledText variant="headline">My boats</StyledText>
      <BoatsList boatIdentities={user.boatIdentities} />
    </ScrollView>
  );
};

export default UserBoats;
