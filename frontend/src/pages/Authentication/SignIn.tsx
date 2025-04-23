import React from 'react';

import * as Yup from 'yup';
import { View } from 'react-native';
import { useTheme } from 'react-native-paper';

import Form from '../../components/Form';
import type { FormProps } from '../../components/Form';
import StyledText from '../../components/StyledText';

import type { AppTheme } from '../../types';
import config from '../../utils/config';

export type SignInValuesType = {
  email: string;
  password: string;
};

const validationSchema: Yup.Schema<SignInValuesType> = Yup.object().shape({
  email: Yup.string()
    .min(8, 'Email must be at least 8 characters long')
    .max(256, 'Email can not be longer than 256 characters')
    .email()
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters long')
    .max(30, 'Password can not be longer than 30 characters')
    .required('Password is required'),
});

const formFields: FormProps<SignInValuesType>['formFields'] = {
  email: {
    label: config.IS_MOBILE ? undefined : 'Email',
    placeholder: 'your.email@address.com',
    props: {
      autoCapitalize: 'none',
      autoComplete: 'email',
      autoCorrect: false,
      autoFocus: true,
      inputMode: 'email',
    },
  },
  password: {
    label: config.IS_MOBILE ? undefined : 'Password',
    placeholder: 'Password',
    props: {
      autoCapitalize: 'none',
      autoComplete: 'off',
      autoCorrect: false,
      autoFocus: false,
      inputMode: 'text',
      secureTextEntry: true,
    },
  },
};

interface SignInProps {
  handleSignIn: (credentials: SignInValuesType) => Promise<void>;
}

const SignIn = ({ handleSignIn }: SignInProps) => {
  const theme = useTheme<AppTheme>();

  const onSubmit = async (values: SignInValuesType) => {
    console.log('sign in component, values:', values);
    await handleSignIn(values);
    console.log('done submitting!');
  };

  return (
    <View style={theme.styles.primaryContainer}>
      <StyledText variant="title">Sign In</StyledText>
      <Form<SignInValuesType>
        formFields={formFields}
        onSubmit={onSubmit}
        submitLabel="Sign In"
        validationSchema={validationSchema}
      />
    </View>
  );
};

export default SignIn;
