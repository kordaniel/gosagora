import React, { useState } from 'react';

import { Menu, useTheme } from 'react-native-paper';
import { Pressable, TextInput } from 'react-native';
import { useField } from 'formik';

import FieldBase, { type FieldBaseProps } from './FieldBase';

import type { AppTheme } from '../../types';

interface SelectDropdownProps extends FieldBaseProps {
  placeholder: string;
  options: Array<{ label: string; value: string; }>;
}

const SelectDropdown = ({
  name,
  placeholder,
  label,
  options,
}: SelectDropdownProps) => {
  const theme = useTheme<AppTheme>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_field, meta, helpers] = useField<string>(name);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const textInputStyle = [
    theme.styles.textInput,
    meta.error && theme.styles.textInputError,
  ];

  const handleSelection = (newValue: string) => {
    void helpers.setTouched(newValue !== meta.initialValue);
    void helpers.setValue(newValue);
    setIsVisible(false);
  };

  return (
    <FieldBase
      label={label}
      name={name}
    >
      <Menu
        visible={isVisible}
        onDismiss={() => setIsVisible(false)}
        anchor={
          <Pressable onPress={() => setIsVisible(true)} >
            <TextInput
              style={textInputStyle}
              placeholder={placeholder}
              placeholderTextColor={theme.colors.surfaceVariant}
              value={options.find(o => o.value === meta.value)?.label || ''}
              showSoftInputOnFocus={false}
              editable={false}
              pointerEvents="none"
            />
          </Pressable>
        }
      >
        {options.map((option) => (
          <Menu.Item
            key={option.value}
            onPress={() => handleSelection(option.value)}
            title={option.label}
          />
        ))}
      </Menu>
    </FieldBase>
  );
};

export default SelectDropdown;
