import React from 'react';

import { Checkbox as RNPCheckbox, useTheme } from 'react-native-paper';
import { View } from 'react-native';
import { useField } from 'formik';

import FieldBase, { type FieldBaseProps } from './FieldBase';
import StyledText from '../StyledText';

import type { AppTheme } from '../../types';

export interface RNPCheckboxProps {
  disabled?: boolean;
  uncheckedColor?: string;
  color?: string;
}

interface CheckboxProps extends FieldBaseProps {
  checkboxProps?: RNPCheckboxProps;
  checkboxText: string;
}

const Checkbox = ({ label, name, checkboxProps, checkboxText }: CheckboxProps) => {
  const theme = useTheme<AppTheme>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_field, meta, helpers] = useField<boolean>(name);

  const handleChange = () => {
    void helpers.setTouched(true);
    void helpers.setValue(!meta.value);
  };

  return (
    <FieldBase
      label={label}
      name={name}
    >
      <View style={[
        theme.styles.containerFlexRow,
        theme.styles.container
      ]}>
        <RNPCheckbox
          status={meta.value ? 'checked' : 'unchecked'}
          onPress={handleChange}
          {...checkboxProps}
        />
        <StyledText>{checkboxText}</StyledText>
      </View>
    </FieldBase>
  );
};

export default Checkbox;
