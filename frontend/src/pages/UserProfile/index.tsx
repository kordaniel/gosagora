import React from 'react';

import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import { useTheme } from 'react-native-paper';

import Authentication from '../../components/Authentication';
import SignedInView from './SignedInView';

import type { AppTheme } from 'src/types';
import useAuth from 'src/hooks/useAuth';

const UserProfile = () => {
  const theme = useTheme<AppTheme>();
  const { handleSignOut, isSignedIn } = useAuth();

  return (
    <SafeAreaView style={theme.styles.safeAreaView}>
      <ScrollView contentContainerStyle={theme.styles.primaryContainer}>
        {isSignedIn
          ? <SignedInView handleSignOut={handleSignOut} />
          : <Authentication />
        }
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserProfile;
