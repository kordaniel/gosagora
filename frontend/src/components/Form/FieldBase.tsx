import React, { PropsWithChildren } from 'react';

import { KeyboardAvoidingView, Platform } from 'react-native';
import { ErrorMessage } from 'formik';
import { useTheme } from 'react-native-paper';

import ErrorRenderer from '../ErrorRenderer';
import StyledText from '../StyledText';

import type { AppTheme } from '../../types';
import { isString } from '../../utils/typeguards';

const extractStrings = (val: unknown): string[] => {
  if (!val) {
    console.error('Form field validation error message is missing');
    return [];
  }

  if (isString(val)) {
    return [val];
  }
  if (typeof val === 'object') {
    return Object.entries(val)
      .map(([_k, v]: [_k: string, v: unknown]) => v)
      .filter(v => isString(v));
  }

  console.error('Form field validation error message has an unsupported type');
  return [];
};

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
        {msg =>
          extractStrings(msg).map((s, i) =>
            <ErrorRenderer key={i}>{s}</ErrorRenderer>
          )
        }
      </ErrorMessage>
    </KeyboardAvoidingView>
  );
};

export default FieldBase;
