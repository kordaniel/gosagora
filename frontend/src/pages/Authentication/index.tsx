import React, { useState } from 'react';

import { Pressable, ScrollView, View } from 'react-native';
import { useTheme } from 'react-native-paper';

import SignIn from './SignIn';
import SignOut from './SignOut';
import SignUp from './SignUp';
import StyledText from '../../components/StyledText';

import type { AppTheme } from '../../types';
import useAuth from '../../hooks/useAuth';

const Authentication = () => {
  const theme = useTheme<AppTheme>();
  const { user, error, handleSignIn, handleSignUp, handleSignOut } = useAuth();
  const [view, setView] = useState<'signIn' | 'signUp'>('signIn');

  const toggleView = () => {
    setView(view === 'signIn' ? 'signUp' : 'signIn');
  };

  if (!user) {
    return (
      <View style={theme.styles.primaryContainer}>
        {view === 'signIn'
          ? <ScrollView>
              <SignIn handleSignIn={handleSignIn} errorMsg={error} />
              <StyledText>Don&apos;t have an account?&nbsp;
                <Pressable onPress={toggleView}>
                  <StyledText style={{ fontWeight: "bold" }}>Sign Up</StyledText>
                </Pressable>
              </StyledText>
            </ScrollView>
          : <ScrollView>
              <SignUp handleSignUp={handleSignUp} errorMsg={error} />
              <StyledText>Already have an account?&nbsp;
                <Pressable onPress={toggleView}>
                  <StyledText style={{ fontWeight: "bold" }}>Sign In</StyledText>
                </Pressable>
              </StyledText>
            </ScrollView>
        }
      </View>
    );
  }

  return (
    <View style={theme.styles.primaryContainer}>
      <SignOut handleSignOut={handleSignOut} />
    </View>
  );
};

export default Authentication;
