import React, { PropsWithChildren } from 'react';

import { KeyboardAvoidingView, Platform } from 'react-native';
import { ErrorMessage } from 'formik';
import { useTheme } from 'react-native-paper';

import ErrorRenderer from '../ErrorRenderer';
import StyledText from '../StyledText';

import type { AppTheme } from '../../types';

export interface FieldBaseProps {
  label?: string;
  name: string;
}

const FieldBase = ({ label, name, children }: PropsWithChildren<FieldBaseProps>) => {
  const theme = useTheme<AppTheme>();
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={theme.styles.containerFlexColumn}
    >
      {label && <StyledText>{label}:&nbsp;</StyledText>}
      {children}
      <ErrorMessage name={name}>
        {msg => <ErrorRenderer>{msg}</ErrorRenderer>}
      </ErrorMessage>
    </KeyboardAvoidingView>
  );
};

export default FieldBase;
