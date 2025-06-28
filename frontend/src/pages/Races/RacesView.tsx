import React, { useEffect } from 'react';

import { FlatList, StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';

import EmptyFlatList from '../../components/FlatListComponents/EmptyFlatList';
import ErrorRenderer from '../../components/ErrorRenderer';
import StyledText from '../../components/StyledText';

import { SelectRaces, initializeRaces } from '../../store/slices/raceSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import type { AppTheme } from '../../types';

import { RaceListing } from '@common/types/race';


const RaceView = ({ race }: { race: RaceListing }) => {
  const theme = useTheme<AppTheme>();
  const style = StyleSheet.compose(
    theme.styles.secondaryContainer,
    theme.styles.borderContainer,
  );

  return (
    <View style={style}>
      <StyledText variant="title">Name: {race.name}</StyledText>
      <StyledText variant="small">Type: {race.type}</StyledText>
      <StyledText variant="small">Description: {race.description}</StyledText>
      <StyledText variant="small">Organizer: {race.user.displayName}</StyledText>
    </View>
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

const RacesView = () => {
  const dispatch = useAppDispatch();
  const {
    races,
    racesLoading,
    racesLoadingError
  } = useAppSelector(SelectRaces);

  useEffect(() => {
    void dispatch(initializeRaces());
  }, [dispatch]);

  return (
    <FlatList
      data={races}
      renderItem={({ item }) => <RaceView race={item} />}
      keyExtractor={item => item.id.toString()}
      ListEmptyComponent={<EmptyFlatList
        message="No races.."
        loading={racesLoading}
      />}
      ListHeaderComponent={<RacesHeader racesError={racesLoadingError}/>}
      stickyHeaderIndices={[0]}
    />
  );
};

export default RacesView;
