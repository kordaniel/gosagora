import React, { useState } from 'react';

import { Pressable } from 'react-native';

import SignIn from './SignIn';
import SignUp from './SignUp';
import StyledText from '../StyledText';

const Authentication = () => {
  const [view, setView] = useState<'signIn' | 'signUp'>('signIn');

  return (
    <>
      {view === "signIn"
        ? <>
            <SignIn />
            <StyledText>
              Don&apos;t have an account?&nbsp;
              <Pressable onPress={() => setView("signUp")}>
                <StyledText style={{ fontWeight: "bold" }}>Sign Up</StyledText>
              </Pressable>
            </StyledText>
          </>
        : <>
            <SignUp />
            <StyledText>
              Already have an account?&nbsp;
              <Pressable onPress={() => setView("signIn")}>
                <StyledText style={{ fontWeight: "bold" }}>Sign In</StyledText>
              </Pressable>
            </StyledText>
          </>
      }
    </>
  );
};

export default Authentication;
