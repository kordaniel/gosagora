import React from 'react';

import { FlatList, ScrollView, StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';

import EmptyFlatList from '../../components/FlatListComponents/EmptyFlatList';
import ErrorRenderer from '../../components/ErrorRenderer';
import Separator from '../../components/Separator';
import StyledText from '../../components/StyledText';

import type { AppTheme } from '../../types';
import { useRaceContext } from '../../hooks/useRaceContext';

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

const RacesView = () => {
  const theme = useTheme<AppTheme>();
  const races = useRaceContext();

  return (
    <ScrollView contentContainerStyle={theme.styles.primaryContainer}>
      <StyledText variant="headline">Races</StyledText>
      <ErrorRenderer>{races ? races.racesError : ''}</ErrorRenderer>
      <FlatList
        data={races ? races.races : []}
        renderItem={({ item }) => <RaceView race={item} />}
        keyExtractor={item => item.id.toString()}
        ItemSeparatorComponent={Separator}
        ListEmptyComponent={<EmptyFlatList
          message="No races"
          loading={races ? races.racesLoading : true}
        />}
      />
    </ScrollView>
  );
};

export default RacesView;
