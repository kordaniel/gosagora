import { createContext, useContext, useEffect, useState } from 'react';
import { Appearance } from 'react-native';

import type { ColorSchemeName } from 'react-native';

export const useTheme = () => {
  const [colorScheme, setColorScheme] = useState<ColorSchemeName>(Appearance.getColorScheme());

  useEffect(() => {
    const subscription = Appearance.addChangeListener(
      ({ colorScheme: newColorScheme }: { colorScheme: ColorSchemeName }) => {
        setColorScheme(newColorScheme);
      },
    );
    return () => subscription.remove();
  }, [setColorScheme]);

  const toggleScheme = () => {
    setColorScheme(colorScheme === 'dark' ? 'light' : 'dark');
  };

  return {
    colorScheme,
    isDarkScheme: colorScheme === 'dark',
    toggleScheme,
  };
};

export const ThemeContext = createContext<ReturnType<typeof useTheme> | undefined>(undefined);

export const useAppTheme = () => {
  return useContext(ThemeContext);
};
