import React, { useEffect } from 'react';

import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

import EmptyFlatList from '../../components/FlatListComponents/EmptyFlatList';
import ErrorRenderer from '../../components/ErrorRenderer';

import type { AppTheme, SceneMapRouteProps } from '../../types';
import { SelectTrails, initializeTrails } from '../../store/slices/trailSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

import type { TrailListing } from '@common/types/trail';


interface TrailListingViewProps {
  trail: TrailListing;
  jumpto: SceneMapRouteProps['jumpTo'];
}

const TrailListingView = ({ trail, jumpTo }: TrailListingViewProps) => {
  const theme = useTheme<AppTheme>();
  const style = StyleSheet.compose(
    theme.styles.secondaryContainer,
    theme.styles.borderContainer,
  );

  const onPress = (id: number) => {
    console.log('clicked id:', id);
  };

  if (Math.random() < 0.4) {
    trail.endDate = new Date(); // TODO: Delete dev helper
  }

  return (
    <TouchableOpacity style={style} onPress={() => onPress(trail.id)}>
      <Text variant="titleMedium">Name: {trail.name}</Text>
      <Text variant="bodySmall">Started at: {trail.startDate.toLocaleString()}</Text>
      <Text variant="bodySmall">Ended at: {
        trail.endDate !== null
          ? trail.endDate.toLocaleString()
          : "This trail is still underway"
      }</Text>
      <Text variant="bodySmall">Created by: {trail.user.displayName}</Text>
      <Text variant="bodySmall">Boat: {trail.boat.name}</Text>
      <Text variant="bodySmall">Boat type: {trail.boat.boatType}</Text>
    </TouchableOpacity>
  );
};

interface TrailsHeaderProps {
  trailsError: string | null;
}

const TrailsHeader = ({ trailsError }: TrailsHeaderProps) => {
  const theme = useTheme<AppTheme>();
  return (
    <View style={theme.styles.primaryContainer}>
      <Text variant="headlineSmall">Trails</Text>
      <ErrorRenderer>{trailsError}</ErrorRenderer>
    </View>
  );
};

const TrailsList = ({ jumpTo }: SceneMapRouteProps) => {
  const dispatch = useAppDispatch();
  const { error, loading, trails } = useAppSelector(SelectTrails);

  useEffect(() => {
    void dispatch(initializeTrails());
  }, [dispatch]);

  return (
    <FlatList
      data={trails}
      renderItem={({ item }) => <TrailListingView trail={item} jumpto={jumpTo} />}
      keyExtractor={item => item.id.toString()}
      ListEmptyComponent={<EmptyFlatList
        message="No Trails.."
        loading={loading}
      />}
      ListHeaderComponent={<TrailsHeader trailsError={error} />}
      stickyHeaderIndices={[0]}
    />
  );
};

export default TrailsList;
