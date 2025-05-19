import React, { useState } from 'react';

import { Pressable, ScrollView, View } from 'react-native';
import { useTheme } from 'react-native-paper';

import SignIn from './SignIn';
import SignUp from './SignUp';
import StyledText from '../StyledText';

import { AppTheme } from 'src/types';

const Authentication = () => {
  const theme = useTheme<AppTheme>();
  const [view, setView] = useState<'signIn' | 'signUp'>('signIn');

  return (
    <View style={theme.styles.primaryContainer}>
      {view === 'signIn'
        ? <ScrollView>
            <SignIn />
            <StyledText>
              Don&apos;t have an account?&nbsp;
              <Pressable onPress={() => setView("signUp")}>
                <StyledText style={{ fontWeight: "bold" }}>Sign Up</StyledText>
              </Pressable>
            </StyledText>
          </ScrollView>
        : <ScrollView>
            <SignUp />
            <StyledText>
              Already have an account?&nbsp;
              <Pressable onPress={() => setView("signIn")}>
                <StyledText style={{ fontWeight: "bold" }}>Sign In</StyledText>
              </Pressable>
            </StyledText>
          </ScrollView>
      }
    </View>
  );
};

export default Authentication;
