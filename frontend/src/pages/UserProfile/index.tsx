import React from 'react';

import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import { useTheme } from 'react-native-paper';

import Authentication from '../../components/Authentication';
import SignedInView from './SignedInView';

import { type AppTheme } from '../../types';
import { SelectAuth } from '../../store/slices/authSlice';
import { useAppSelector } from '../../store/hooks';

const UserProfile = () => {
  const theme = useTheme<AppTheme>();
  const { isAuthenticated } = useAppSelector(SelectAuth);

  return (
    <SafeAreaView style={theme.styles.safeAreaView}>
      <ScrollView contentContainerStyle={theme.styles.primaryContainer}>
        {isAuthenticated
          ? <SignedInView />
          : <Authentication />
        }
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserProfile;
