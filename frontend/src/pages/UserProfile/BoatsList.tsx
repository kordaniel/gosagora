import React from 'react';

import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'react-native-paper';

import EmptyFlatList from '../../components/FlatListComponents/EmptyFlatList';
import LoadingOrErrorRenderer from '../../components/LoadingOrErrorRenderer';
import StyledText from '../../components/StyledText';

import type { AppTheme, SceneMapRouteProps } from '../../types';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { SelectAuth } from '../../store/slices/authSlice';
import { fetchBoat } from '../../store/slices/boatSlice';

import { BoatIdentity } from '@common/types/boat';

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

const BoatsHeader = () => {
  const theme = useTheme<AppTheme>();
  return (
    <View style={theme.styles.primaryContainer}>
      <StyledText variant="headline">My Boats</StyledText>
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
      ListHeaderComponent={<BoatsHeader />}
      stickyHeaderIndices={[0]}
    />
  );
};

export default BoatsList;
