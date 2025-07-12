import React from 'react';

import { ScrollView, View } from 'react-native';
import { useTheme } from 'react-native-paper';

import Form, { type FormProps } from '../../components/Form';
import Button from '../../components/Button';
import Link from '../../components/Link';
import LoadingOrErrorRenderer from '../../components/LoadingOrErrorRenderer';
import Modal from '../../components/Modal';
import StyledText from '../../components/StyledText';

import {
  type NewRaceValuesType,
  RaceTypeReverseMap,
} from '../../models/race';
import {
  createRaceFormFields,
  newRaceValidationSchema
} from '../../schemas/race';
import {
  deleteRace,
  submitPatchRace,
} from '../../store/slices/raceSlice';
import { type AppTheme } from '../../types';
import { type SceneMapRouteProps } from './index';
import { askConfirmation } from '../../helpers/askConfirmation';
import { useAppDispatch } from '../../store/hooks';
import useRace from '../../hooks/useRace';

import { type RaceDetails } from '@common/types/race';

interface RaceEditorProps {
  race: RaceDetails;
  jumpTo: SceneMapRouteProps['jumpTo'];
}

const RaceEditor = ({ race, jumpTo }: RaceEditorProps) => {
  const dispatch = useAppDispatch();

  const formFields: FormProps<NewRaceValuesType>['formFields'] = createRaceFormFields({
    name: race.name,
    type: race.type,
    url: race.url ?? '',
    email: race.email ?? '',
    startEndDateRange: { startDate: new Date(race.dateFrom), endDate: new Date(race.dateTo) },
    registrationStartEndDateRange: { startDate: new Date(race.registrationOpenDate), endDate: new Date(race.registrationCloseDate) },
    description: race.description,
  });

  const handleUpdateSubmit = async (raceDetails: NewRaceValuesType): Promise<void> => {
    console.log('submitting:', raceDetails);
    await dispatch(submitPatchRace(race.id, raceDetails));
  };

  const handleDeleteCb = (shouldBeDeleted: boolean) => {
    if (shouldBeDeleted) {
      dispatch(deleteRace(race.id))
        .then(wasDeleted => {
          if (wasDeleted) {
            jumpTo('racesList');
          }
        })
        .catch(err => console.error('error deleting race:', err));
    }
  };

  const onDeletePress = () => {
    askConfirmation(
      `Are you sure you want to delete the race '${race.name}' for everyone?`,
      handleDeleteCb
    );
  };

  return (
    <Modal
      title={`Editing race "${race.name}"`}
      closeButtonLabel="Cancel"
      openButtonLabel="Edit race details"
    >
      <View>
        <Form<NewRaceValuesType>
          formFields={formFields}
          onSubmit={handleUpdateSubmit}
          submitLabel="Update race"
          validationSchema={newRaceValidationSchema}
        />
        <Button onPress={onDeletePress}>Delete race</Button>
      </View>
    </Modal>
  );
};

const RaceView = ({ jumpTo }: SceneMapRouteProps) => {
  const theme = useTheme<AppTheme>();
  const { selectedRace, loading, error, isSignedUsersRace } = useRace();

  if (loading || error) {
    return (
      <ScrollView contentContainerStyle={theme.styles.primaryContainer}>
        <LoadingOrErrorRenderer
          loading={loading}
          loadingMessage="Just a moment, we are loading the race for you" error={error}
        />
      </ScrollView>
    );
  }

  if (!selectedRace) {
    return (
      <ScrollView contentContainerStyle={theme.styles.primaryContainer}>
        <StyledText variant="headline">Select a race to see it&apos;s details</StyledText>
      </ScrollView>
    );
  }

  const raceTypeStr = RaceTypeReverseMap[selectedRace.type] ?? '-';

  return (
    <ScrollView contentContainerStyle={theme.styles.primaryContainer}>
      <StyledText variant="headline">{selectedRace.name}</StyledText>
      {isSignedUsersRace && <>
        <StyledText variant="title">You are the organizer of this race!</StyledText>
        <RaceEditor race={selectedRace} jumpTo={jumpTo} />
      </>}
      <View style={theme.styles.table}>
        <View style={theme.styles.tableColumn}>
          <StyledText variant="title" style={theme.styles.tableCellData}>Description</StyledText>
          <StyledText style={theme.styles.tableCellData}>{selectedRace.description}</StyledText>
        </View>
        <View style={theme.styles.tableRow}>
          <StyledText variant="title" style={theme.styles.tableCellData}>Organizer</StyledText>
          <StyledText style={theme.styles.tableCellData}>{selectedRace.user.displayName}</StyledText>
        </View>
        {selectedRace.url &&
          <View style={theme.styles.tableRow}>
            <StyledText variant="title" style={theme.styles.tableCellData}>Website</StyledText>
            <Link style={theme.styles.tableCellData} href={selectedRace.url}>{selectedRace.url}</Link>
          </View>
        }
        {selectedRace.email &&
          <View style={theme.styles.tableRow}>
            <StyledText variant="title" style={theme.styles.tableCellData}>E-mail</StyledText>
            <Link style={theme.styles.tableCellData} href={selectedRace.email} email={true}>{selectedRace.email}</Link>
          </View>
        }
        <View style={theme.styles.tableRow}>
          <StyledText variant="title" style={theme.styles.tableCellData}>Race type</StyledText>
          <StyledText style={theme.styles.tableCellData}>{raceTypeStr}</StyledText>
        </View>
        <View style={theme.styles.tableRow}>
          <StyledText variant="title" style={theme.styles.tableCellData}>Start date</StyledText>
          <StyledText style={theme.styles.tableCellData}>{selectedRace.dateFrom.toLocaleString()}</StyledText>
        </View>
        <View style={theme.styles.tableRow}>
          <StyledText variant="title" style={theme.styles.tableCellData}>End date</StyledText>
          <StyledText style={theme.styles.tableCellData}>{selectedRace.dateTo.toLocaleString()}</StyledText>
        </View>
        <View style={theme.styles.tableRow}>
          <StyledText variant="title" style={theme.styles.tableCellData}>Registration opens</StyledText>
          <StyledText style={theme.styles.tableCellData}>{selectedRace.registrationOpenDate.toLocaleString()}</StyledText>
        </View>
        <View style={theme.styles.tableRow}>
          <StyledText variant="title" style={theme.styles.tableCellData}>Registration closes</StyledText>
          <StyledText style={theme.styles.tableCellData}>{selectedRace.registrationCloseDate.toLocaleString()}</StyledText>
        </View>
      </View>
    </ScrollView>
  );
};

export default RaceView;
