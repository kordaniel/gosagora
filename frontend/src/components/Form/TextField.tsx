import React, { PropsWithChildren } from 'react';

import { ErrorMessage, useField } from 'formik';
import { KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import type { TextInputProps } from 'react-native';
import { useTheme } from 'react-native-paper';

import ErrorRenderer from '../ErrorRenderer';
import StyledText from '../StyledText';

import type { AppTheme } from '../../types';

interface FieldBaseProps {
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

interface TextFieldProps extends FieldBaseProps {
  placeholder: string;
  textInputProps?: TextInputProps;
}

const TextField = ({
  name,
  placeholder,
  textInputProps,
  label
}: TextFieldProps) => {
  const theme = useTheme<AppTheme>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_field, meta, helpers] = useField<string>(name);

  const textInputStyle = [
    theme.styles.textInput,
    meta.error && theme.styles.textInputError,
  ];
  const handleChange = (newValue: string) => {
    void helpers.setTouched(newValue !== meta.initialValue);
    void helpers.setValue(newValue);
  };

  return (
    <FieldBase
      label={label}
      name={name}
    >
      <TextInput
        style={textInputStyle}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.surfaceVariant}
        onChangeText={handleChange}
        value={meta.value}
        {...textInputProps}
      />
    </FieldBase>
  );
};

export default TextField;
