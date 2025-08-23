import React, { useRef } from 'react';

import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'react-native-paper';

import Modal, { type ModalCloseHandleType } from '../../components/Modal';
import EmptyFlatList from '../../components/FlatListComponents/EmptyFlatList';
import Form from '../../components/Form';
import LoadingOrErrorRenderer from '../../components/LoadingOrErrorRenderer';
import StyledText from '../../components/StyledText';

import type { AppTheme, SceneMapRouteProps } from '../../types';
import {
  SelectSubmitNewBoat,
  boatSliceSetSubmitNewBoatError,
  fetchBoat,
  submitNewBoat,
} from '../../store/slices/boatSlice';
import {
  createNewSailboatFormFields,
  newSailboatValidationSchema
} from '../../schemas/boat';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { type NewSailboatValuesType } from '../../models/boat';
import { SelectAuth } from '../../store/slices/authSlice';

import { type BoatIdentity } from '@common/types/boat';

interface AddBoatProps {
  jumpTo: SceneMapRouteProps['jumpTo'];
}

const AddBoat = ({ jumpTo }: AddBoatProps) => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(SelectSubmitNewBoat);
  const modalRef = useRef<ModalCloseHandleType>(null);

  const onSubmit = async (values: NewSailboatValuesType): Promise<boolean> => {
    const createdBoatId = await dispatch(submitNewBoat(values));
    if (createdBoatId === null) {
      return false;
    }

    if (modalRef.current) {
      modalRef.current.hideModal();
    }
    jumpTo('boatView');
    return true;
  };

  const clearSubmitNewBoatError = () => {
    dispatch(boatSliceSetSubmitNewBoatError(null));
  };

  return (
    <Modal
      title="Create a New Boat"
      closeButtonLabel="Cancel"
      openButtonLabel="Add a New Boat"
      ref={modalRef}
      onShowModal={clearSubmitNewBoatError}
    >
      <View>
        <Form<NewSailboatValuesType>
          formFields={createNewSailboatFormFields()}
          onSubmit={onSubmit}
          submitLabel="Submit new Sailboat"
          validationSchema={newSailboatValidationSchema}
        />
        <LoadingOrErrorRenderer
          loading={loading}
          error={error}
        />
      </View>
    </Modal>
  );
};

interface BoatIdentityListingViewProps {
  boatIdentity: BoatIdentity;
  jumpTo: SceneMapRouteProps['jumpTo'];
}

const BoatIdentityListingView = ({ boatIdentity, jumpTo }: BoatIdentityListingViewProps) => {
  const dispatch = useAppDispatch();
  const theme = useTheme<AppTheme>();
  const style = StyleSheet.compose(
    theme.styles.secondaryContainer,
    theme.styles.borderContainer,
  );

  const onPress = () => {
    void dispatch(fetchBoat(boatIdentity.id));
    jumpTo('boatView');
  };

  return (
    <TouchableOpacity style={style} onPress={onPress}>
      <StyledText variant="title">{boatIdentity.name}</StyledText>
      <StyledText>Boat type: {boatIdentity.boatType}</StyledText>
    </TouchableOpacity>
  );
};

interface BoatsHeaderProps {
  jumpTo: SceneMapRouteProps['jumpTo'];
}

const BoatsHeader = ({ jumpTo }: BoatsHeaderProps) => {
  const theme = useTheme<AppTheme>();
  return (
    <View style={theme.styles.primaryContainer}>
      <StyledText variant="headline">My Boats</StyledText>
      <AddBoat jumpTo={jumpTo} />
    </View>
  );
};

const BoatsList = ({ jumpTo }: SceneMapRouteProps) => {
  const { user, isInitialized, loading, error } = useAppSelector(SelectAuth);
  if (!isInitialized || loading || error) {
    return (
      <View>
        <LoadingOrErrorRenderer
          loading={loading || !isInitialized}
          loadingMessage={isInitialized ? "Just a moment, we are loading your boats for you" : ""}
          error={error}
        />
      </View>
    );
  }

  if (!user) {
    return (
      <View>
        <StyledText variant="headline">My Boats</StyledText>
        <StyledText>Something went wrong while loading your boats. Please try again, or contact our support team if the problem persists</StyledText>
      </View>
    );
  }

  return (
    <FlatList
      data={user.boatIdentities}
      renderItem={({ item }) => <BoatIdentityListingView boatIdentity={item} jumpTo={jumpTo} />}
      keyExtractor={item => item.id.toString()}
      ListEmptyComponent={<EmptyFlatList
        message="You haven't added any boats yet"
        loading={loading}
      />}
      ListHeaderComponent={<BoatsHeader jumpTo={jumpTo} />}
      stickyHeaderIndices={[0]}
    />
  );
};

export default BoatsList;
