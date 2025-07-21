import React from 'react';

import { ActivityIndicator, ScrollView } from 'react-native';
import { useTheme } from 'react-native-paper';

import ErrorRenderer from '../../components/ErrorRenderer';
import Form from '../../components/Form';
import StyledText from '../../components/StyledText';

import {
  SelectSubmitNewRace,
  fetchRace,
  submitNewRace,
} from '../../store/slices/raceSlice';
import {
  createRaceFormFields,
  newRaceValidationSchema,
} from '../../schemas/race';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { type AppTheme, } from '../../types';
import { type NewRaceValuesType, } from '../../models/race';
import { type SceneMapRouteProps } from './index';


const NewRace = ({ jumpTo }: SceneMapRouteProps) => {
  const dispatch = useAppDispatch();
  const theme = useTheme<AppTheme>();
  const { loading, error } = useAppSelector(SelectSubmitNewRace);

  const onSubmit = async (raceDetails: NewRaceValuesType): Promise<boolean> => {
    const createdRaceId = await dispatch(submitNewRace(raceDetails));
    if (createdRaceId === null) {
      return false;
    }

    void dispatch(fetchRace(createdRaceId));
    jumpTo('raceView');
    return true;
  };

  return (
    <ScrollView contentContainerStyle={theme.styles.primaryContainer}>
      <StyledText variant="headline">New race</StyledText>
      <ErrorRenderer>{error}</ErrorRenderer>
      <Form<NewRaceValuesType>
        formFields={createRaceFormFields()}
        onSubmit={onSubmit}
        submitLabel="Create new race"
        validationSchema={newRaceValidationSchema}
      />
      {loading && <ActivityIndicator color={theme.colors.onPrimaryContainer} size="large" />}
    </ScrollView>
  );
};

export default NewRace;
