import React, { PropsWithChildren } from 'react';

import { ErrorMessage, useField } from 'formik';
import { StyleSheet, TextInput, View } from 'react-native';
import type { TextInputProps } from 'react-native';

import StyledText from '../StyledText';

interface FieldBaseProps {
  label: string;
  name: string;
}

const FieldBase = ({ label, name, children }: PropsWithChildren<FieldBaseProps>) => {
  return (
    <View style={styles.container}>
      <StyledText>{label}:&nbsp;</StyledText>
      {children}
      <ErrorMessage name={name}>
        {msg => <StyledText style={styles.error}>{msg}</StyledText>}
      </ErrorMessage>
    </View>
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_field, meta, helpers] = useField<string>(name);

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
        style={styles.input}
        placeholder={placeholder}
        onChangeText={handleChange}
        value={meta.value}
        {...textInputProps}
      />
    </FieldBase>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  error: {
    fontSize: 12,
  },
  input: {
    borderWidth: 1,
    height: 32,
    width: 200,
  },
});

export default TextField;
