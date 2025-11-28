import React from 'react';

import { ActivityIndicator, ScrollView } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

import Authentication from '../../components/Authentication';
import ErrorRenderer from '../../components/ErrorRenderer';
import Form from '../../components/Form';

import { type AppTheme, type SceneMapRouteProps, } from '../../types';
import { createTrailFormFields, newTrailValidationSchema } from '../../schemas/trail';
import type { NewTrailValuesType } from '../../models/trail';
import { SelectAuth } from '../../store/slices/authSlice';
import { SelectSubmitNewTrail } from '../../store/slices/trailSlice';
import { useAppSelector } from '../../store/hooks';
import useTrailTracker from '../../hooks/useTrailTracker';


const NewTrail = ({ jumpTo }: SceneMapRouteProps) => {
  const theme = useTheme<AppTheme>();
  const { user, isAuthenticated } = useAppSelector(SelectAuth);
  const { error, loading } = useAppSelector(SelectSubmitNewTrail);
  const { startNewTrail, trackingTrailId } = useTrailTracker();

  const onSubmit = async (newTrailDetails: NewTrailValuesType): Promise<boolean> => {
    const trailCreated = await startNewTrail(newTrailDetails);
    if (trailCreated) {
      jumpTo('trailView');
    }
    return trailCreated;
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
      <Text>Tracking trail: {trackingTrailId === null ? "No trackingTrailId" : trackingTrailId}</Text>
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
