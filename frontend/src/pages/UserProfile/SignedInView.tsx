import React, { useState } from 'react';

import { type GestureResponderEvent, View } from 'react-native';
import { useTheme } from 'react-native-paper';

import Button from '../../components/Button';
import LoadingOrErrorRenderer from '../../components/LoadingOrErrorRenderer';
import Separator from '../../components/Separator';
import StyledText from '../../components/StyledText';

import type { AppTheme } from '../../types';
import { SelectAuth } from '../../store/slices/authSlice';
import firebase from '../../modules/firebase';
import { useAppSelector } from '../../store/hooks';


const DangerZone = () => {
  const theme = useTheme<AppTheme>();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleDeletion = () => {
    console.log('DEL');
  };

  return (
    <View style={theme.styles.errorContainer}>
      <StyledText variant="title">Danger zone</StyledText>
      {isOpen && <>
        <Button
          colors={[theme.colors.onErrorContainer, theme.colors.errorContainer]}
          onPress={handleDeletion}
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
