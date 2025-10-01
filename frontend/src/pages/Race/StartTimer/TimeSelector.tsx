import React, { useState } from 'react';

import { IconButton, Text, useTheme } from 'react-native-paper';
import { StyleSheet, TextInput, type TextStyle, View } from 'react-native';

import type { AppTheme } from '../../../types';
import { assertNever } from '../../../utils/typeguards';
import { clampNumber } from '../../../utils/helpers';
import config from '../../../utils/config';

interface TimeSelectorProps {
  setDuration: (hours: number, minutes: number, seconds: number) => void;
}

const TimeSelector = ({ setDuration }: TimeSelectorProps) => {
  type FocusedFieldType = 'hours' | 'minutes' | 'seconds' | null;
  const theme = useTheme<AppTheme>();

  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [focused, setFocused] = useState<FocusedFieldType>(null);

  const styles = StyleSheet.create({
    field: {
      ...theme.styles.borderContainer,
      alignItems: 'center',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    row: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-evenly',
    },
  });

  const createTextInputStyle = (field: FocusedFieldType): TextStyle => {
    const isFocused = focused === field;
    const commonStyle: TextStyle = {
      ...theme.fonts.titleLarge,
      color: isFocused ? theme.colors.onSurface : theme.colors.onSurfaceVariant,
      fontWeight: isFocused ? 'bold' : theme.fonts.titleLarge.fontWeight,
      textAlign: 'center',
    };

    if (config.IS_MOBILE) {
      return isFocused ? {
        ...commonStyle,
        borderColor: theme.colors.outline,
        borderRadius: 5,
        borderWidth: 1,
        padding: 8,
      } : commonStyle;
    }

    return {
      ...commonStyle,
      width: theme.fonts.titleLarge.fontSize * 2,
    };
  };

  const adjustFieldValue = (field: NonNullable<FocusedFieldType>, delta: number) => {
    switch (field) {
      case 'hours':
        setHours(prev => clampNumber(prev + delta, 0, 23));
        break;
      case 'minutes':
        setMinutes(prev => clampNumber(prev + delta, 0, 59));
        break;
      case 'seconds':
        setSeconds(prev => clampNumber(prev + delta, 0, 59));
        break;
      default:
        assertNever(field);
    }
  };

  const setFieldValue = (field: NonNullable<FocusedFieldType>, newValue: string) => {
    const digits = newValue.replace(/[^0-9]/g, '');
    const newIntVal = Number(digits);

    if (isNaN(newIntVal)) {
      console.log(`Invalid integer: [${newValue}]`);
      return;
    }

    switch (field) {
      case 'hours':
        setHours(clampNumber(newIntVal, 0, 23));
        break;
      case 'minutes':
        setMinutes(clampNumber(newIntVal, 0, 59));
        break;
      case 'seconds':
        setSeconds(clampNumber(newIntVal, 0, 59));
        break;
      default:
        assertNever(field);
    }
  };

  console.log('focused:', focused);

  return (
    <View style={styles.row}>
      <View style={styles.field}>
        {/* NOTE: Larger icons TEST */}
        <IconButton icon="plus" size={24} onPress={() => adjustFieldValue("hours", 1)} />
        <TextInput
          keyboardType="numeric"
          onChangeText={(newVal) => setFieldValue("hours", newVal)}
          onFocus={() => { console.log('START'); setFocused("hours"); }}
          onEndEditing={() => { console.log('END'); setFocused(null); }}
          //onBlur={(e) => console.log('blur')}
          style={createTextInputStyle("hours")}
          value={hours.toString().padStart(2, "0")}
        />
        <Text variant="labelMedium">Hours</Text>
        <IconButton icon="minus" size={24} onPress={() => adjustFieldValue("hours", -1)} />
      </View>

      <View style={styles.field}>
        <IconButton icon="plus" size={20} onPress={() => adjustFieldValue("minutes", 1)} />
        <TextInput
          keyboardType="numeric"
          onChangeText={(newVal) => setFieldValue("minutes", newVal)}
          onFocus={() => setFocused("minutes")}
          onEndEditing={() => setFocused(null)}
          style={createTextInputStyle("minutes")}
          value={minutes.toString().padStart(2, "0")}
        />
        <Text variant="labelMedium">Minutes</Text>
        <IconButton icon="minus" size={20} onPress={() => adjustFieldValue("minutes", -1)} />
      </View>

      <View style={styles.field}>
        <IconButton icon="plus" size={20} onPress={() => adjustFieldValue("seconds", 1)} />
        <TextInput
          keyboardType="numeric"
          onChangeText={(newVal) => setFieldValue("seconds", newVal)}
          onFocus={() => setFocused("seconds")}
          onEndEditing={() => setFocused(null)}
          style={createTextInputStyle("seconds")}
          value={seconds.toString().padStart(2, "0")}
        />
        <Text variant="labelMedium">Seconds</Text>
        <IconButton icon="minus" size={20} onPress={() => adjustFieldValue("seconds", -1)} />
      </View>
    </View>
  );
};

export default TimeSelector;
