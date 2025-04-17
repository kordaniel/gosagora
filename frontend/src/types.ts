import type { ImageStyle, TextStyle, ViewStyle } from 'react-native';
import type { MD3Theme } from 'react-native-paper';

export interface AppTheme extends MD3Theme {
  styles: Record<string, ViewStyle | ImageStyle | TextStyle>;
  toggleScheme: () => void;
}
