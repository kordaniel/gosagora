import { useEffect, useState } from 'react';
import { Appearance } from 'react-native';
import type { ColorSchemeName } from 'react-native';

import type { AppTheme } from '../types';
import { getTheme } from '../theme';

const useAppTheme = (): AppTheme => {
  const [colorScheme, setColorScheme] = useState<ColorSchemeName>(Appearance.getColorScheme());
  const theme = getTheme(colorScheme);

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
    ...theme,
    toggleScheme,
  };
};

export default useAppTheme;
