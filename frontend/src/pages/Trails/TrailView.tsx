import React, { useState } from 'react';

import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

import LoadingOrErrorRenderer from '../../components/LoadingOrErrorRenderer';

import type { AppTheme, SceneMapRouteProps } from '../../types';
import { distanceToString, velocityToString } from '../../utils/stringTools';
import { SelectAuth } from '../../store/slices/authSlice';
import { SelectTrail } from '../../store/slices/trailSlice';
import { clampString } from '../../utils/helpers';
import config from '../../utils/config';
import { useAppSelector } from '../../store/hooks';


const TrailView = ({ jumpTo }: SceneMapRouteProps) => {
  const theme = useTheme<AppTheme>();
  const tableCellDataBold = StyleSheet.compose(
    theme.styles.tableCellData,
    { fontWeight: 'bold' }
  );
  const [showFullDescription, setShowFullDescription] = useState<boolean>(false);
  const { user, isAuthenticated } = useAppSelector(SelectAuth);
  const { error, loading, selectedTrail } = useAppSelector(SelectTrail);

  if (loading || error) {
    return (
      <ScrollView contentContainerStyle={theme.styles.primaryContainer}>
        <LoadingOrErrorRenderer
          loading={loading}
          loadingMessage="Just a moment, we are loading the trail for your"
          error={error}
        />
      </ScrollView>
    );
  }

  if (!selectedTrail) {
    return (
      <ScrollView contentContainerStyle={theme.styles.primaryContainer}>
        <Text variant="headlineSmall">Select a trail to see it&apos;s details</Text>
      </ScrollView>
    );
  }

  const isSignedUsersTrail: boolean = isAuthenticated
    ? selectedTrail.user.id === user?.id
    : false;
  const selectedTrailDescription = showFullDescription
    ? selectedTrail.description
    : clampString(selectedTrail.description, config.IS_MOBILE ? 300 : 600);
  const endedAt = selectedTrail.endDate
    ? selectedTrail.endDate.toLocaleString()
    : "This trail is still underway";

  return (
    <ScrollView contentContainerStyle={theme.styles.primaryContainer}>
      <Text variant="headlineSmall">{selectedTrail.name}</Text>
      {isSignedUsersTrail && <>
        <Text>{selectedTrail.public
          ? "This is your public trail that anyone can view"
          : "This is your private trail that only you can view"
        }</Text>
      </>}
      <View style={theme.styles.table}>
        <Pressable onPress={() => setShowFullDescription(!showFullDescription)}>
          <View style={theme.styles.tableColumn}>
            <Text style={tableCellDataBold}>Description</Text>
            <Text style={theme.styles.tableCellData}>{selectedTrailDescription}</Text>
          </View>
        </Pressable>
        <View style={theme.styles.tableRow}>
          <Text style={tableCellDataBold}>Started at</Text>
          <Text style={theme.styles.tableCellData}>{selectedTrail.startDate.toLocaleString()}</Text>
        </View>
        <View style={theme.styles.tableRow}>
          <Text style={tableCellDataBold}>Ended at</Text>
          <Text style={theme.styles.tableCellData}>{endedAt}</Text>
        </View>
        <View style={theme.styles.tableRow}>
          <Text style={tableCellDataBold}>Length</Text>
          <Text style={theme.styles.tableCellData}>{distanceToString(selectedTrail.length)}</Text>
        </View>
        <View style={theme.styles.tableRow}>
          <Text style={tableCellDataBold}>Average velocity</Text>
          <Text style={theme.styles.tableCellData}>{velocityToString(selectedTrail.avgVelocity)}</Text>
        </View>
        <View style={theme.styles.tableRow}>
          <Text style={tableCellDataBold}>Max velocity</Text>
          <Text style={theme.styles.tableCellData}>{velocityToString(selectedTrail.maxVelocity)}</Text>
        </View>
        <View style={theme.styles.tableRow}>
          <Text style={tableCellDataBold}>User</Text>
          <Text style={theme.styles.tableCellData}>{selectedTrail.user.displayName}</Text>
        </View>
        <View style={theme.styles.tableRow}>
          <Text style={tableCellDataBold}>Boat</Text>
          <Text style={theme.styles.tableCellData}>{selectedTrail.boat.name}</Text>
        </View>
        <View style={theme.styles.tableRow}>
          <Text style={tableCellDataBold}>Boat Type</Text>
          <Text style={theme.styles.tableCellData}>{selectedTrail.boat.boatType}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default TrailView;
