import React from 'react';

import { FlatList, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';

import EmptyFlatList from '../../components/FlatListComponents/EmptyFlatList';
import ErrorRenderer from '../../components/ErrorRenderer';
import NewRace from './NewRace';
import RaceListing from './RaceListing';
import StyledText from '../../components/StyledText';

import { AppTheme } from 'src/types';
import useRace from 'src/hooks/useRace';


const Races = () => {
  const theme = useTheme<AppTheme>();
  const {
    races,
    racesError,
    racesLoading,
    //racesRefetch,
    submitNewRace,
    submitNewRaceError,
    submitNewRaceLoading
  } = useRace();

  return (
    <SafeAreaView style={theme.styles.safeAreaView}>
      <ScrollView contentContainerStyle={theme.styles.primaryContainer}>
        <StyledText variant="headline">Races</StyledText>
        <NewRace
          handleSubmit={submitNewRace}
          loading={submitNewRaceLoading}
          error={submitNewRaceError}
        />
        <ErrorRenderer>{racesError}</ErrorRenderer>
        <FlatList
          data={races}
          renderItem={({ item }) => <RaceListing race={item} />}
          keyExtractor={item => item.id.toString()}
          ListEmptyComponent={<EmptyFlatList
            message="No races"
            loading={racesLoading}
          />}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Races;
