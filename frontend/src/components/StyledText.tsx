import { Text, StyleSheet } from 'react-native';
import type { TextProps as NativeTextProps } from 'react-native';

import { useAppTheme } from '../hooks/useAppTheme';

const StyledText = (props: NativeTextProps) => {
  const theme = useAppTheme();
  const isDarkScheme = theme ? theme.isDarkScheme : true;

  return (
    <Text style={isDarkScheme ? styles.dark : styles.light} {...props} />
  );
};

const styles = StyleSheet.create({
  light: {
    color: '#252500',
  },
  dark: {
    color: '#ffffff',
  },
});

export default StyledText;
