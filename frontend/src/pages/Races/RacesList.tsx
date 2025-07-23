import React, { useEffect } from 'react';

import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'react-native-paper';

import EmptyFlatList from '../../components/FlatListComponents/EmptyFlatList';
import ErrorRenderer from '../../components/ErrorRenderer';
import StyledText from '../../components/StyledText';

import { SelectRaces, fetchRace, initializeRaces } from '../../store/slices/raceSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import type { AppTheme } from '../../types';
import { type SceneMapRouteProps } from './index';

import { RaceListing } from '@common/types/race';

interface RaceListingViewProps {
  race: RaceListing;
  jumpTo: SceneMapRouteProps['jumpTo']
}

const RaceListingView = ({ race, jumpTo }: RaceListingViewProps) => {
  const dispatch = useAppDispatch();
  const theme = useTheme<AppTheme>();
  const style = StyleSheet.compose(
    theme.styles.secondaryContainer,
    theme.styles.borderContainer,
  );

  const onPress = (id: number) => {
    void dispatch(fetchRace(id));
    jumpTo('raceView');
  };

  return (
    <TouchableOpacity style={style} onPress={() => onPress(race.id)}>
      <StyledText variant="title">Name: {race.name}</StyledText>
      <StyledText variant="small">Type: {race.type}</StyledText>
      <StyledText variant="small">Description: {race.description}</StyledText>
      <StyledText variant="small">Organizer: {race.user.displayName}</StyledText>
    </TouchableOpacity>
  );
};

interface RacesHeaderProps {
  racesError: string | null;
}

const RacesHeader = ({ racesError }: RacesHeaderProps) => {
  const theme = useTheme<AppTheme>();
  return (
    <View style={theme.styles.primaryContainer}>
      <StyledText variant="headline">Races</StyledText>
      <ErrorRenderer>{racesError}</ErrorRenderer>
    </View>
  );
};

const RacesList = ({ jumpTo }: SceneMapRouteProps) => {
  const dispatch = useAppDispatch();
  const { races, loading, error } = useAppSelector(SelectRaces);

  useEffect(() => {
    void dispatch(initializeRaces());
  }, [dispatch]);

  return (
    <FlatList
      data={races}
      renderItem={({ item }) => <RaceListingView race={item} jumpTo={jumpTo} />}
      keyExtractor={item => item.id.toString()}
      ListEmptyComponent={<EmptyFlatList
        message="No races.."
        loading={loading}
      />}
      ListHeaderComponent={<RacesHeader racesError={error}/>}
      stickyHeaderIndices={[0]}
    />
  );
};

export default RacesList;
