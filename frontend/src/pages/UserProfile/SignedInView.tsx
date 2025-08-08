import React from 'react';

import { type GestureResponderEvent, View } from 'react-native';
import { useTheme } from 'react-native-paper';

import Button from '../../components/Button';
import LoadingOrErrorRenderer from '../../components/LoadingOrErrorRenderer';
import StyledText from '../../components/StyledText';

import type { AppTheme } from '../../types';
import { SelectAuth } from '../../store/slices/authSlice';
import firebase from '../../modules/firebase';
import { useAppSelector } from '../../store/hooks';


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
          <StyledText style={theme.styles.tableCellData}>{user.lastseenAt ? user.lastseenAt : "First time here, welcome!"}</StyledText>
        </View>
      </View>
      <Button onPress={theme.toggleScheme}>
        {theme.dark ? "Toggle light theme" : "Toggle dark theme"}
      </Button>
      <Button onPress={firebase.signOut as (e?: GestureResponderEvent) => void}>
        Sign Out
      </Button>
    </View>
  );
};

export default SignedInView;
