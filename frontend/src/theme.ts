import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import type { ColorSchemeName } from 'react-native';
import type { MD3Theme } from 'react-native-paper';
import type { MD3Type } from 'react-native-paper/lib/typescript/types';
import { StyleSheet } from 'react-native';

import type { AppTheme } from './types';

const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  'colors': {
    'primary': 'rgb(3, 97, 163)',
    'onPrimary': 'rgb(255, 255, 255)',
    'primaryContainer': 'rgb(209, 228, 255)',
    'onPrimaryContainer': 'rgb(0, 29, 54)',
    'secondary': 'rgb(58, 91, 169)',
    'onSecondary': 'rgb(255, 255, 255)',
    'secondaryContainer': 'rgb(218, 226, 255)',
    'onSecondaryContainer': 'rgb(0, 24, 71)',
    'tertiary': 'rgb(0, 107, 92)',
    'onTertiary': 'rgb(255, 255, 255)',
    'tertiaryContainer': 'rgb(120, 248, 222)',
    'onTertiaryContainer': 'rgb(0, 32, 27)',
    'error': 'rgb(186, 26, 26)',
    'onError': 'rgb(255, 255, 255)',
    'errorContainer': 'rgb(255, 218, 214)',
    'onErrorContainer': 'rgb(65, 0, 2)',
    'background': 'rgb(253, 252, 255)',
    'onBackground': 'rgb(26, 28, 30)',
    'surface': 'rgb(253, 252, 255)',
    'onSurface': 'rgb(26, 28, 30)',
    'surfaceVariant': 'rgb(223, 226, 235)',
    'onSurfaceVariant': 'rgb(67, 71, 78)',
    'outline': 'rgb(115, 119, 127)',
    'outlineVariant': 'rgb(195, 198, 207)',
    'shadow': 'rgb(0, 0, 0)',
    'scrim': 'rgb(0, 0, 0)',
    'inverseSurface': 'rgb(47, 48, 51)',
    'inverseOnSurface': 'rgb(241, 240, 244)',
    'inversePrimary': 'rgb(159, 202, 255)',
    'elevation': {
      'level0': 'transparent',
      'level1': 'rgb(241, 244, 250)',
      'level2': 'rgb(233, 240, 248)',
      'level3': 'rgb(226, 235, 245)',
      'level4': 'rgb(223, 233, 244)',
      'level5': 'rgb(218, 230, 242)'
    },
    'surfaceDisabled': 'rgba(26, 28, 30, 0.12)',
    'onSurfaceDisabled': 'rgba(26, 28, 30, 0.38)',
    'backdrop': 'rgba(44, 49, 55, 0.4)'
  }
};

const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  'colors': {
    'primary': 'rgb(159, 202, 255)',
    'onPrimary': 'rgb(0, 50, 88)',
    'primaryContainer': 'rgb(0, 73, 125)',
    'onPrimaryContainer': 'rgb(209, 228, 255)',
    'secondary': 'rgb(178, 197, 255)',
    'onSecondary': 'rgb(0, 43, 115)',
    'secondaryContainer': 'rgb(30, 67, 143)',
    'onSecondaryContainer': 'rgb(218, 226, 255)',
    'tertiary': 'rgb(88, 219, 194)',
    'onTertiary': 'rgb(0, 56, 47)',
    'tertiaryContainer': 'rgb(0, 80, 69)',
    'onTertiaryContainer': 'rgb(120, 248, 222)',
    'error': 'rgb(255, 180, 171)',
    'onError': 'rgb(105, 0, 5)',
    'errorContainer': 'rgb(147, 0, 10)',
    'onErrorContainer': 'rgb(255, 180, 171)',
    'background': 'rgb(26, 28, 30)',
    'onBackground': 'rgb(226, 226, 230)',
    'surface': 'rgb(26, 28, 30)',
    'onSurface': 'rgb(226, 226, 230)',
    'surfaceVariant': 'rgb(67, 71, 78)',
    'onSurfaceVariant': 'rgb(195, 198, 207)',
    'outline': 'rgb(141, 145, 153)',
    'outlineVariant': 'rgb(67, 71, 78)',
    'shadow': 'rgb(0, 0, 0)',
    'scrim': 'rgb(0, 0, 0)',
    'inverseSurface': 'rgb(226, 226, 230)',
    'inverseOnSurface': 'rgb(47, 48, 51)',
    'inversePrimary': 'rgb(3, 97, 163)',
    'elevation': {
      'level0': 'transparent',
      'level1': 'rgb(33, 37, 41)',
      'level2': 'rgb(37, 42, 48)',
      'level3': 'rgb(41, 47, 55)',
      'level4': 'rgb(42, 49, 57)',
      'level5': 'rgb(45, 52, 62)'
    },
    'surfaceDisabled': 'rgba(226, 226, 230, 0.12)',
    'onSurfaceDisabled': 'rgba(226, 226, 230, 0.38)',
    'backdrop': 'rgba(44, 49, 55, 0.4)'
  }
};

const customLightFonts: Record<string, MD3Type> = StyleSheet.create({
  displayHuge: {
    ...MD3LightTheme.fonts.displayLarge,
    fontSize: 96,
    lineHeight: 100,
  },
  displayHugeBold: {
    ...MD3LightTheme.fonts.displayLarge,
    fontSize: 96,
    fontWeight: 'bold',
    lineHeight: 100,
  },
});

const customDarkFonts: Record<string, MD3Type> = StyleSheet.create({
  displayHuge: {
    ...MD3DarkTheme.fonts.displayLarge,
    fontSize: 96,
    lineHeight: 100,
  },
  displayHugeBold: {
    ...MD3DarkTheme.fonts.displayLarge,
    fontSize: 96,
    fontWeight: 'bold',
    lineHeight: 100,
  },
});

const styles = StyleSheet.create({
  borderContainer: {
    borderRadius: 5,
    borderWidth: StyleSheet.hairlineWidth,
    margin: 3,
    padding: 3,
  },
  button: {
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    padding: 8,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonLoading: {
    opacity: 0.8,
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  compassDial: {
    alignItems: 'center',
    borderRadius: 80,
    borderWidth: 20,
    height: 160,
    justifyContent: 'center',
    width: 160,
  },
  compassMarkerHeading: {
    borderBottomWidth: 20,
    borderLeftColor: 'transparent',
    borderLeftWidth: 3,
    borderRightColor: 'transparent',
    borderRightWidth: 3,
    height: 0,
    width: 0,
  },
  compassMarkerNorth: {
    borderLeftColor: 'transparent',
    borderLeftWidth: 4,
    borderRightColor: 'transparent',
    borderRightWidth: 4,
    borderTopWidth: 6,
    height: 0,
    width: 0,
  },
  compassOuterDial: {
    alignItems: 'center',
    borderRadius: 83,
    height: 166,
    justifyContent: 'center',
    width: 166
  },
  compassTextContainer: {
    alignItems: 'center',
    position: 'absolute',
  },
  container: {
    alignItems: 'center',
    padding: 3,
  },
  containerFlexColumn: {
    flexDirection: 'column',
    gap: 8,
  },
  containerFlexRow: {
    flexDirection: 'row',
    gap: 8,
  },
  developerViewContainer: {
    paddingBottom: 3,
    paddingHorizontal: 3,
  },
  modalContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  modalContentContainer: {
    margin: 8,
  },
  safeAreaView: {
    flex: 1,
    flexDirection: 'column',
    gap: 0,
  },
  separator: {
    height: 1,
  },
  stretchContainer: {
    alignItems: 'stretch',
  },
  tabBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 3,
    paddingVertical: 3,
  },
  tabBarTab: {
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 5,
  },
  table: {
    alignItems: 'stretch',
    flexDirection: 'column',
    gap: 3,
    justifyContent: 'center',
  },
  tableCellData: {
    justifyContent: 'center',
    padding: 3,
  },
  tableColumn: {
    flexDirection: 'column',
  },
  tableRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 3,
    justifyContent: 'space-between',
  },
  textInput: {
    borderRadius: 5,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 8,
  },
  textLink: {
    color: '#1e90ff',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

const lightStyle = StyleSheet.create({
  ...styles,
  borderContainer: {
    ...styles.borderContainer,
    borderColor: lightTheme.colors.outline,
  },
  button: {
    ...styles.button,
    borderColor: lightTheme.colors.onPrimary,
  },
  buttonText: {
    ...lightTheme.fonts.default,
    color: lightTheme.colors.onPrimary,
  },
  compassDial: {
    ...styles.compassDial,
    backgroundColor: lightTheme.colors.surfaceVariant,
    borderColor: lightTheme.colors.surface,
  },
  compassMarkerHeading: {
    ...styles.compassMarkerHeading,
    borderBottomColor: lightTheme.colors.onSurfaceVariant,
  },
  compassMarkerNorth: {
    ...styles.compassMarkerNorth,
    borderTopColor: lightTheme.colors.error,
  },
  compassOuterDial: {
    ...styles.compassOuterDial,
    backgroundColor: lightTheme.colors.outlineVariant,
  },
  developerViewContainer: {
    ...styles.developerViewContainer,
    backgroundColor: lightTheme.colors.backdrop,
  },
  errorContainer: {
    ...styles.container,
    ...styles.borderContainer,
    backgroundColor: lightTheme.colors.errorContainer,
    borderColor: lightTheme.colors.onErrorContainer,
    color: lightTheme.colors.onErrorContainer,
  },
  modalContainer: {
    ...styles.modalContainer,
    backgroundColor: lightTheme.colors.elevation.level1,
  },
  modalContentContainer: {
    ...styles.container,
    ...styles.containerFlexColumn,
    ...styles.borderContainer,
    ...styles.modalContentContainer,
    backgroundColor: lightTheme.colors.elevation.level2,
    borderColor: lightTheme.colors.outline,
  },
  onErrorContainer: {
    ...lightTheme.fonts.default,
    color: lightTheme.colors.onErrorContainer,
  },
  onPrimaryContainer: {
    ...lightTheme.fonts.default,
    color: lightTheme.colors.onPrimaryContainer,
  },
  primaryContainer: {
    ...styles.container,
    backgroundColor: lightTheme.colors.primaryContainer,
    color: lightTheme.colors.onPrimaryContainer,
  },
  safeAreaView: {
    ...styles.safeAreaView,
    backgroundColor: lightTheme.colors.primaryContainer,
    color: lightTheme.colors.onPrimaryContainer,
  },
  secondaryContainer: {
    ...styles.container,
    backgroundColor: lightTheme.colors.secondaryContainer,
    color: lightTheme.colors.onSecondaryContainer,
  },
  tabBarContainer: {
    ...styles.tabBarContainer,
    backgroundColor: lightTheme.colors.surface,
  },
  tabBarTab: {
    ...styles.tabBarTab,
    backgroundColor: lightTheme.colors.surfaceVariant,
  },
  tableColumn: {
    ...styles.borderContainer,
    ...styles.tableColumn,
    borderColor: lightTheme.colors.outline,
  },
  tableRow: {
    ...styles.borderContainer,
    ...styles.tableRow,
    borderColor: lightTheme.colors.outline,
  },
  tertiaryContainer: {
    ...styles.container,
    backgroundColor: lightTheme.colors.tertiaryContainer,
    color: lightTheme.colors.onTertiaryContainer,
  },
  textHeadline: {
    ...lightTheme.fonts.headlineSmall,
  },
  textInput: {
    ...lightTheme.fonts.default,
    ...styles.textInput,
    backgroundColor: lightTheme.colors.surface,
    borderColor: lightTheme.colors.surfaceVariant,
    color: lightTheme.colors.onSurface,
  },
  textInputError: {
    borderColor: lightTheme.colors.error,
  },
  textSmall: {
    ...lightTheme.fonts.bodySmall,
  },
  textTitle: {
    ...lightTheme.fonts.titleMedium,
  },
});

const darkStyle = StyleSheet.create({
  ...styles,
  borderContainer: {
    ...styles.borderContainer,
    borderColor: darkTheme.colors.outline,
  },
  button: {
    ...styles.button,
    borderColor: darkTheme.colors.onPrimary,
  },
  buttonText: {
    ...darkTheme.fonts.default,
    color: darkTheme.colors.onPrimary,
  },
  compassDial: {
    ...styles.compassDial,
    backgroundColor: darkTheme.colors.surfaceVariant,
    borderColor: darkTheme.colors.surface,
  },
  compassMarkerHeading: {
    ...styles.compassMarkerHeading,
    borderBottomColor: darkTheme.colors.onSurfaceVariant,
  },
  compassMarkerNorth: {
    ...styles.compassMarkerNorth,
    borderTopColor: darkTheme.colors.error,
  },
  compassOuterDial: {
    ...styles.compassOuterDial,
    backgroundColor: darkTheme.colors.outlineVariant,
  },
  developerViewContainer: {
    ...styles.developerViewContainer,
    backgroundColor: darkTheme.colors.backdrop,
  },
  errorContainer: {
    ...styles.container,
    ...styles.borderContainer,
    backgroundColor: darkTheme.colors.errorContainer,
    borderColor: darkTheme.colors.onErrorContainer,
    color: darkTheme.colors.onErrorContainer,
  },
  modalContainer: {
    ...styles.modalContainer,
    backgroundColor: darkTheme.colors.elevation.level1,
  },
  modalContentContainer: {
    ...styles.container,
    ...styles.containerFlexColumn,
    ...styles.borderContainer,
    ...styles.modalContentContainer,
    backgroundColor: darkTheme.colors.elevation.level2,
    borderColor: darkTheme.colors.outline,
  },
  onErrorContainer: {
    ...darkTheme.fonts.default,
    color: darkTheme.colors.onErrorContainer,
  },
  onPrimaryContainer: {
    ...darkTheme.fonts.default,
    color: darkTheme.colors.onPrimaryContainer,
  },
  primaryContainer: {
    ...styles.container,
    backgroundColor: darkTheme.colors.primaryContainer,
    color: darkTheme.colors.onPrimaryContainer,
  },
  safeAreaView: {
    ...styles.safeAreaView,
    backgroundColor: darkTheme.colors.primaryContainer,
    color: darkTheme.colors.onPrimaryContainer,
  },
  secondaryContainer: {
    ...styles.container,
    backgroundColor: darkTheme.colors.secondaryContainer,
    color: darkTheme.colors.onSecondaryContainer,
  },
  tabBarContainer: {
    ...styles.tabBarContainer,
    backgroundColor: darkTheme.colors.surface,
  },
  tabBarTab: {
    ...styles.tabBarTab,
    backgroundColor: darkTheme.colors.surfaceVariant,
  },
  tableColumn: {
    ...styles.borderContainer,
    ...styles.tableColumn,
    borderColor: darkTheme.colors.outline,
  },
  tableRow: {
    ...styles.borderContainer,
    ...styles.tableRow,
    borderColor: darkTheme.colors.outline,
  },
  tertiaryContainer: {
    ...styles.container,
    backgroundColor: darkTheme.colors.tertiaryContainer,
    color: darkTheme.colors.onTertiaryContainer,
  },
  textHeadline: {
    ...darkTheme.fonts.headlineSmall,
  },
  textInput: {
    ...darkTheme.fonts.default,
    ...styles.textInput,
    backgroundColor: darkTheme.colors.surface,
    borderColor: darkTheme.colors.surfaceVariant,
    color: darkTheme.colors.onSurface,
  },
  textInputError: {
    borderColor: darkTheme.colors.error,
  },
  textSmall: {
    ...darkTheme.fonts.bodySmall,
  },
  textTitle: {
    ...darkTheme.fonts.titleMedium,
  },
});

export const getTheme = (colorScheme?: ColorSchemeName): Omit<AppTheme, 'toggleScheme'> => {
  switch (colorScheme) {
    case 'dark': return {
      ...darkTheme,
      customFonts: customDarkFonts,
      styles: darkStyle,
    };
    case 'light': return {
      ...lightTheme,
      customFonts: customLightFonts,
      styles: lightStyle,
    };
    default: return { // NOTE: Do not throw here, OS might return null | undefined colorScheme
      ...darkTheme,
      customFonts: customDarkFonts,
      styles: darkStyle,
    };
  }
};
