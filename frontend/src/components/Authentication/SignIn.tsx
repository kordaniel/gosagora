import React from 'react';

import * as Yup from 'yup';
import { View } from 'react-native';
import { useTheme } from 'react-native-paper';

import Form, { type FormProps } from '../Form';
import { FormInputType } from '../Form/enums';

import ErrorRenderer from '../ErrorRenderer';
import StyledText from '../StyledText';

import type { AppTheme } from '../../types';
import config from '../../utils/config';
import useAuth from '../../hooks/useAuth';

export type SignInValuesType = {
  email: string;
  password: string;
};

const validationSchema: Yup.Schema<SignInValuesType> = Yup.object().shape({
  email: Yup.string()
    .trim()
    .min(8, 'Email must be at least 8 characters long')
    .max(256, 'Email can not be longer than 256 characters')
    .email()
    .required('Email is required'),
  password: Yup.string()
    .trim()
    .min(8, 'Password must be at least 8 characters long')
    .max(30, 'Password can not be longer than 30 characters')
    .required('Password is required'),
});

const formFields: FormProps<SignInValuesType>['formFields'] = {
  email: {
    inputType: FormInputType.TextField,
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
    inputType: FormInputType.TextField,
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

const SignIn = () => {
  const theme = useTheme<AppTheme>();
  const { error, handleSignIn } = useAuth();

  const onSubmit = async (values: SignInValuesType) => {
    await handleSignIn(values.email, values.password);
  };

  return (
    <View style={theme.styles.primaryContainer}>
      <StyledText variant="title">Sign In</StyledText>
      <ErrorRenderer>{error}</ErrorRenderer>
      <Form<SignInValuesType>
        formFields={formFields}
        onSubmit={onSubmit}
        submitLabel="Sign In"
        validationSchema={validationSchema}
        clearFieldsAfterSubmit={false}
      />
    </View>
  );
};

export default SignIn;
