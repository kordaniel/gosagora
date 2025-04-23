import React, { useState } from 'react';

import { Pressable, View } from 'react-native';
import { useTheme } from 'react-native-paper';

import SignIn from './SignIn';
import SignOut from './SignOut';
import SignUp from './SignUp';
import StyledText from '../../components/StyledText';

import type { AppTheme } from '../../types';
import useAuth from '../../hooks/useAuth';

const Authentication = () => {
  const theme = useTheme<AppTheme>();
  const { user, handleSignIn, handleSignUp, handleSignOut } = useAuth();
  const [view, setView] = useState<'signIn' | 'signUp'>('signIn');

  const toggleView = () => {
    setView(view === 'signIn' ? 'signUp' : 'signIn');
  };

  console.log('AUTH, user:', user);

  /**
   * TODO: Implement auth type selection:
   * ****
   * - Sign In using your email
   * - Sign In with Google
   */

  return user ? (
    <SignOut handleSignOut={handleSignOut} />
  ) : (
    <View style={theme.styles.primaryContainer}>
      {view === 'signIn'
        ? <>
            <SignIn handleSignIn={handleSignIn} />
            <StyledText>No account? <Pressable style={{ fontWeight: "bold" }} onPress={toggleView}>Sign Up</Pressable></StyledText>
          </>
        : <>
            <SignUp handleSignUp={handleSignUp} />
            <StyledText>Already have an account? <Pressable style={{ fontWeight: "bold" }} onPress={toggleView}>Sign In</Pressable></StyledText>
          </>
      }
    </View>
  );
};

export default Authentication;
