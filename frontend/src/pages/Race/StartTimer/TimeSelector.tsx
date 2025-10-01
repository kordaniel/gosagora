import React, { useState } from 'react';

import {
  IconButton,
  type IconButtonProps,
  Text,
  useTheme
} from 'react-native-paper';
import {
  StyleSheet,
  TextInput,
  type TextStyle,
  View,
  type ViewStyle
} from 'react-native';

import type { AppTheme, TimeDuration } from '../../../types';
import { assertNever } from '../../../utils/typeguards';
import { clampNumber } from '../../../utils/helpers';
import config from '../../../utils/config';

type FieldType = 'hours' | 'minutes' | 'seconds';

interface TimeFieldSelectorProps {
  adjustFieldValue: (field: FieldType, delta: number) => void;
  field: FieldType;
  iconSize?: NonNullable<IconButtonProps['size']>;
  setFieldValue: (field: FieldType, newValue: string) => void;
  setFocused: React.Dispatch<React.SetStateAction<FieldType | null>>;
  style: ViewStyle,
  textInputStyle: TextStyle,
  value: number;
}

const TimeFieldSelector = ({
  adjustFieldValue,
  field,
  iconSize = 24,
  setFieldValue,
  setFocused,
  style,
  textInputStyle,
  value,
}: TimeFieldSelectorProps) => {
  return (
    <View style={style}>
      <IconButton
        icon="plus"
        size={iconSize}
        onPress={() => adjustFieldValue(field, 1)}
      />
      <TextInput
        keyboardType="numeric"
        onChangeText={(newVal) => setFieldValue(field, newVal)}
        onFocus={() => setFocused(field)}
        onBlur={() => setFocused(null)}
        style={textInputStyle}
        value={value.toString().padStart(2, "0")}
      />
      <Text style={{ textTransform: "capitalize" }} variant="labelMedium">{field}</Text>
      <IconButton
        icon="minus"
        size={iconSize}
        onPress={() => adjustFieldValue(field, -1)}
      />
    </View>
  );
};

interface TimeSelectorProps {
  duration: Omit<TimeDuration, 'msecs'>;
  setDuration: (newDuration: Omit<TimeDuration, 'msecs'>) => void;
}

const TimeSelector = ({ duration, setDuration }: TimeSelectorProps) => {
  const theme = useTheme<AppTheme>();
  const [focused, setFocused] = useState<FieldType | null>(null);

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

  const createTextInputStyle = (field: FieldType | null): TextStyle => {
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

  const adjustFieldValue = (field: FieldType, delta: number) => {
    switch (field) {
      case 'hours':
        setDuration({
          hours: clampNumber(duration.hours + delta, 0, 23),
          minutes: duration.minutes,
          seconds: duration.seconds
        });
        break;
      case 'minutes':
        setDuration({
          hours: duration.hours,
          minutes: clampNumber(duration.minutes + delta, 0, 59),
          seconds: duration.seconds
        });
        break;
      case 'seconds':
        setDuration({
          hours: duration.hours,
          minutes: duration.minutes,
          seconds: clampNumber(duration.seconds + delta, 0, 59)
        });
        break;
      default:
        assertNever(field);
    }
  };

  const setFieldValue = (field: FieldType, newValue: string) => {
    const digits = newValue.replace(/[^0-9]/g, '');
    const newIntVal = Number(digits);

    if (isNaN(newIntVal)) {
      console.log(`Invalid integer: [${newValue}]`);
      return;
    }

    switch (field) {
      case 'hours':
        setDuration({
          hours: clampNumber(newIntVal, 0, 23),
          minutes: duration.minutes,
          seconds: duration.seconds
        });
        break;
      case 'minutes':
        setDuration({
          hours: duration.hours,
          minutes: clampNumber(newIntVal, 0, 59),
          seconds: duration.seconds
        });
        break;
      case 'seconds':
        setDuration({
          hours: duration.hours,
          minutes: duration.minutes,
          seconds: clampNumber(newIntVal, 0, 59)
        });
        break;
      default:
        assertNever(field);
    }
  };

  return (
    <View style={styles.row}>
      <TimeFieldSelector
        adjustFieldValue={adjustFieldValue}
        field="hours"
        setFieldValue={setFieldValue}
        setFocused={setFocused}
        style={styles.field}
        textInputStyle={createTextInputStyle("hours")}
        value={duration.hours}
      />
      <TimeFieldSelector
        adjustFieldValue={adjustFieldValue}
        field="minutes"
        setFieldValue={setFieldValue}
        setFocused={setFocused}
        style={styles.field}
        textInputStyle={createTextInputStyle("minutes")}
        value={duration.minutes}
      />
      <TimeFieldSelector
        adjustFieldValue={adjustFieldValue}
        field="seconds"
        setFieldValue={setFieldValue}
        setFocused={setFocused}
        style={styles.field}
        textInputStyle={createTextInputStyle("seconds")}
        value={duration.seconds}
      />
    </View>
  );
};

export default TimeSelector;
