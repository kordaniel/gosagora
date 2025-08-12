import React, { useState } from 'react';

import { type GestureResponderEvent, View } from 'react-native';
import { useTheme } from 'react-native-paper';

import Button from '../../components/Button';
import ErrorRenderer from '../../components/ErrorRenderer';
import LoadingOrErrorRenderer from '../../components/LoadingOrErrorRenderer';
import Separator from '../../components/Separator';
import StyledText from '../../components/StyledText';

import { SelectAuth, authSliceDeleteUser } from '../../store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import type { AppTheme } from '../../types';
import { askConfirmation } from '../../helpers/askConfirmation';
import firebase from '../../modules/firebase';

const DangerZone = () => {
  const dispatch = useAppDispatch();
  const theme = useTheme<AppTheme>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleDeleteCb = (deletionConfirmation: boolean) => {
    if (!deletionConfirmation) {
      return;
    }
    dispatch(authSliceDeleteUser())
      .then(errorString => {
        setError(errorString === null ? '' : errorString);
      })
      .catch(err => {
        console.error('Error deleting user:', err);
      });
  };

  const onDeletePress = () => {
    askConfirmation(
      'Are you sure you want to delete your profile?',
      handleDeleteCb
    );
  };

  return (
    <View style={theme.styles.errorContainer}>
      <StyledText variant="title">Danger zone</StyledText>
      {isOpen && <>
        <ErrorRenderer>{error}</ErrorRenderer>
        <Button
          colors={[theme.colors.onErrorContainer, theme.colors.errorContainer]}
          onPress={onDeletePress}
        >
          Delete profile
        </Button>
      </>
      }
      <Button
        colors={isOpen
          ? undefined
          : [theme.colors.onErrorContainer, theme.colors.errorContainer]
        }
        onPress={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "Close danger zone" : "Open danger zone"}
      </Button>
    </View>
  );
};

const SignedInView = () => {
  const theme = useTheme<AppTheme>();
  const { user, isInitialized, loading, error } = useAppSelector(SelectAuth);

  if (!isInitialized || loading || error) {
    return (
      <View>
        <LoadingOrErrorRenderer
          loading={loading || !isInitialized}
          loadingMessage={isInitialized ? 'Just a moment, we are loading the profile for you' : ''}
          error={error}
        />
      </View>
    );
  }

  if (!user) {
    return (
      <View>
        <StyledText variant="headline">Profile</StyledText>
        <StyledText>Something went wrong while loading your profile. Please try again, or contact our support team if the problem persist</StyledText>
      </View>
    );
  }

  return (
    <View>
      <StyledText variant="headline">{user.displayName}</StyledText>
      <View style={theme.styles.table}>
        <View style={theme.styles.tableRow}>
          <StyledText variant="title" style={theme.styles.tableCellData}>Email</StyledText>
          <StyledText style={theme.styles.tableCellData}>{user.email}</StyledText>
        </View>
        <View style={theme.styles.tableRow}>
          <StyledText variant="title" style={theme.styles.tableCellData}>Previous login</StyledText>
          <StyledText style={theme.styles.tableCellData}>{user.lastseenAt ? user.lastseenAt.toLocaleString() : "First time here, welcome!"}</StyledText>
        </View>
      </View>
      <Button onPress={theme.toggleScheme}>
        {theme.dark ? "Toggle light theme" : "Toggle dark theme"}
      </Button>
      <Button onPress={firebase.signOut as (e?: GestureResponderEvent) => void}>
        Sign Out
      </Button>
      <Separator height={20} />
      <DangerZone />
    </View>
  );
};

export default SignedInView;
