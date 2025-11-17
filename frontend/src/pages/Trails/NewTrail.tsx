import React from 'react';

import { ActivityIndicator, ScrollView } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

import Authentication from '../../components/Authentication';
import ErrorRenderer from '../../components/ErrorRenderer';
import Form from '../../components/Form';

import { type AppTheme, type SceneMapRouteProps, } from '../../types';
import {
  SelectSubmitNewTrail,
  fetchTrail,
  submitNewTrail,
} from '../../store/slices/trailSlice';
import { createTrailFormFields, newTrailValidationSchema } from '../../schemas/trail';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import type { NewTrailValuesType } from '../../models/trail';
import { SelectAuth } from '../../store/slices/authSlice';


const NewTrail = ({ jumpTo }: SceneMapRouteProps) => {
  const dispatch = useAppDispatch();
  const theme = useTheme<AppTheme>();
  const { user, isAuthenticated } = useAppSelector(SelectAuth);
  const { error, loading } = useAppSelector(SelectSubmitNewTrail);

  const onSubmit = async (newTrailDetails: NewTrailValuesType): Promise<boolean> => {
    const createdTrailId = await dispatch(submitNewTrail(newTrailDetails));
    if (createdTrailId === null) {
      return false;
    }

    void dispatch(fetchTrail(createdTrailId));
    jumpTo('trailView');
    return true;
  };

  if (!(isAuthenticated && user)) {
    return (
      <ScrollView contentContainerStyle={theme.styles.primaryContainer}>
        <Text variant="headlineSmall">New Trail</Text>
        <Text style={{ fontWeight: "bold" }}>Sign In to start your own Trail</Text>
        <Authentication />
      </ScrollView>
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
