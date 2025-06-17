import React from 'react';

import { TextInput, type TextInputProps } from 'react-native';
import { useField } from 'formik';
import { useTheme } from 'react-native-paper';

import FieldBase, { type FieldBaseProps } from './FieldBase';

import type { AppTheme } from '../../types';


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
