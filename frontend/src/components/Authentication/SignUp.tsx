import React from 'react';

import * as Yup from 'yup';
import { View } from 'react-native';
import { useTheme } from 'react-native-paper';

import Form, { type FormProps } from '../Form';
import ErrorRenderer from '../ErrorRenderer';
import StyledText from '../StyledText';

import { AppTheme } from '../../types';
import config from '../../utils/config';
import useAuth from '../../hooks/useAuth';

type SignUpValuesType = {
  email: string;
  displayName: string;
  password: string;
  passwordConfirmation: string;
};

const validationSchema: Yup.Schema<SignUpValuesType> = Yup.object().shape({
  email: Yup.string()
    .min(8, 'Email must be at least 8 characters long')
    .max(256, 'Email can not be longer than 256 characters')
    .email()
    .required('Email is required'),
  displayName: Yup.string()
    .min(4, 'Visible name must be at least 4 characters long')
    .max(64, 'Visible name can not be longer than 64 characters')
    .required('Visible name is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters long')
    .max(30, 'Password can not be longer than 30 characters')
    .required('Password is required'),
  passwordConfirmation: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords do not match')
    .required('Password confirmation is required'),
});

const formFields: FormProps<SignUpValuesType>['formFields'] = {
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
  displayName: {
    label: config.IS_MOBILE ? undefined : 'Visible name',
    placeholder: 'Shown in your profile and interactions',
    props: {
      autoCapitalize: 'none',
      autoCorrect: false,
      autoFocus: false,
      inputMode: 'text',
    }
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
  passwordConfirmation: {
    label: config.IS_MOBILE ? undefined : 'Confirm password',
    placeholder: 'Confirm password',
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

const SignUp = () => {
  const theme = useTheme<AppTheme>();
  const { error, handleSignUp } = useAuth();

  const onSubmit = async (values: SignUpValuesType) => {
    await handleSignUp(values.email, values.password, values.displayName);
  };

  return (
    <View style={theme.styles.primaryContainer}>
      <StyledText variant="title">Sign Up</StyledText>
      <ErrorRenderer>{error}</ErrorRenderer>
      <Form<SignUpValuesType>
        formFields={formFields}
        onSubmit={onSubmit}
        submitLabel="Sign Up"
        validationSchema={validationSchema}
      />
    </View>
  );
};

export default SignUp;
