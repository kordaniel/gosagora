import React from 'react';

import { ActivityIndicator, ScrollView } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

import ErrorRenderer from '../../components/ErrorRenderer';
import Form from '../../components/Form';

import { type AppTheme, type SceneMapRouteProps, } from '../../types';
import {
  SelectSubmitNewTrail,
  submitNewTrail,
} from '../../store/slices/trailSlice';
import { createTrailFormFields, newTrailValidationSchema } from '../../schemas/trail';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import type { NewTrailValuesType } from '../../models/trail';
import { SelectAuth } from '../../store/slices/authSlice';


const NewTrail = ({ jumpTo }: SceneMapRouteProps) => {
  const dispatch = useAppDispatch();
  const theme = useTheme<AppTheme>();
  const { user } = useAppSelector(SelectAuth);
  const { error, loading } = useAppSelector(SelectSubmitNewTrail);

  console.log('user:', user?.boatIdentities);

  const onSubmit = async (newTrailDetails: NewTrailValuesType): Promise<boolean> => {
    console.log('new race:', newTrailDetails);
    const createdTrailId = await dispatch(submitNewTrail(newTrailDetails));
    if (createdTrailId === null) {
      return false;
    }

    console.log('new trail ID:', createdTrailId);
    return true;
  };

  if (!user) {
    return (
      <ActivityIndicator />
    );
  }

  return (
    <ScrollView contentContainerStyle={theme.styles.primaryContainer}>
      <Text variant="headlineSmall">New Trail</Text>
      <ErrorRenderer>{error}</ErrorRenderer>
      <Form<NewTrailValuesType>
        formFields={createTrailFormFields(user.boatIdentities)}
        onSubmit={onSubmit}
        submitLabel="Create new Trail"
        validationSchema={newTrailValidationSchema}
      />
      {loading && <ActivityIndicator color={theme.colors.onPrimaryContainer} size="large" />}
    </ScrollView>
  );
};

export default NewTrail;
