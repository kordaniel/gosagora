import React, { useState } from 'react';

import { ScrollView, View } from 'react-native';
import { useTheme } from 'react-native-paper';

import Form, { type FormProps } from '../../components/Form';
import Button from '../../components/Button';
import LoadingOrErrorRenderer from '../../components/LoadingOrErrorRenderer';
import Modal from '../../components/Modal';
import StyledText from '../../components/StyledText';

import type { AppTheme, SceneMapRouteProps } from '../../types';
import {
  SelectSelectedBoat,
  deleteAuthorizedUsersUserSailboats,
  submitPatchBoat,
} from '../../store/slices/boatSlice';
import {
  createNewSailboatFormFields,
  newSailboatValidationSchema,
} from '../../schemas/boat';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { NewSailboatValuesType } from '../../models/boat';
import { askConfirmation } from '../../helpers/askConfirmation';

import type { SailboatData } from '@common/types/rest_api';

interface BoatEditorProps {
  boat: SailboatData;
  jumpTo: SceneMapRouteProps['jumpTo'];
}

const BoatEditor = ({ boat, jumpTo }: BoatEditorProps) => {
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string>('');

  const formFields: FormProps<NewSailboatValuesType>['formFields'] = createNewSailboatFormFields({
    name: boat.name,
    sailNumber: boat.sailNumber ?? '',
    description: boat.description ?? '',
  });

  const isSoleOwner = boat.userIdentities.length < 2;

  const handleUpdateSubmit = async (values: NewSailboatValuesType): Promise<boolean> => {
    const errorString = await dispatch(submitPatchBoat(boat.id, values));
    setError(errorString === null ? '' : errorString);
    return errorString === null;
  };

  const handleDeleteCb = (deletionConfirmation: boolean) => {
    if (!deletionConfirmation) {
      return;
    }
    dispatch(deleteAuthorizedUsersUserSailboats(boat.id))
      .then(errorString => {
        if (errorString === null) {
          setError('');
          jumpTo('boatsList');
        } else {
          setError(errorString);
        }
      })
      .catch(err => {
        console.error('error deleting userBoats:', err);
      });
  };

  const onDeletePress = () => {
    askConfirmation(
      isSoleOwner
        ? `Are you sure you want to delete the boat '${boat.name}'?`
        : `Are you sure you want to resign as an owner from the boat '${boat.name}'?`,
      handleDeleteCb
    );
  };

  return (
    <Modal
      title={`Editing boat "${boat.name}"`}
      closeButtonLabel="Close editor"
      openButtonLabel="Open boat editor"
    >
      <View>
        <Form<NewSailboatValuesType>
          clearFieldsAfterSubmit={true}
          enableReinitialize={true}
          formFields={formFields}
          onSubmit={handleUpdateSubmit}
          submitLabel="Update boat"
          validationSchema={newSailboatValidationSchema}
        />
        <LoadingOrErrorRenderer error={error} />
        <Button onPress={onDeletePress}>{isSoleOwner ? "Delete boat" : "Resign from owners"}</Button>
      </View>
    </Modal>
  );
};

const BoatView = ({ jumpTo }: SceneMapRouteProps) => {
  const theme = useTheme<AppTheme>();
  const { boat, error, loading } = useAppSelector(SelectSelectedBoat);

  if (loading || error) {
    return (
      <ScrollView contentContainerStyle={theme.styles.primaryContainer}>
        <LoadingOrErrorRenderer
          loading={loading}
          loadingMessage="Just a moment, we are loading the boat for you"
          error={error}
        />
      </ScrollView>
    );
  }

  if (!boat) {
    return (
      <ScrollView contentContainerStyle={theme.styles.primaryContainer}>
        <StyledText variant="headline">Select a boat to see it&apos;s details</StyledText>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={theme.styles.primaryContainer}>
      <StyledText variant="headline">{boat.name}</StyledText>
      <BoatEditor boat={boat} jumpTo={jumpTo} />
      <View style={theme.styles.table}>
        <View style={theme.styles.tableRow}>
          <StyledText variant="title" style={theme.styles.tableCellData}>Type</StyledText>
          <StyledText style={theme.styles.tableCellData}>{boat.boatType}</StyledText>
        </View>
        {<View style={theme.styles.tableRow}>
          <StyledText variant="title" style={theme.styles.tableCellData}>Sail Number</StyledText>
          <StyledText style={theme.styles.tableCellData}>{boat.sailNumber ?? "No sail number given"}</StyledText>
        </View>}
        <View style={theme.styles.tableRow}>
          <StyledText variant="title" style={theme.styles.tableCellData}>Description</StyledText>
          <StyledText style={theme.styles.tableCellData}>{boat.description ?? "No description given"}</StyledText>
        </View>
        <View style={theme.styles.tableColumn}>
          <StyledText variant="title" style={theme.styles.tableCellData}>Owners list</StyledText>
          {boat.userIdentities.length === 0
            ? <StyledText style={theme.styles.tableCellData}>No owners</StyledText>
            : boat.userIdentities.map((({ id, displayName }) =>
              <StyledText key={id} style={theme.styles.tableCellData}>{displayName}</StyledText>
            ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default BoatView;
