import type { ImageStyle, TextStyle, ViewStyle } from 'react-native';
import type { Route, SceneRendererProps } from 'react-native-tab-view';
import type { MD3Theme } from 'react-native-paper';
import type { MD3Type } from 'react-native-paper/lib/typescript/types';

export type SceneMapRouteProps = Omit<SceneRendererProps, 'layout'> & { route: Route; };

export type NonNullableFields<T> = {
  [K in keyof T]: Exclude<T[K], null>;
};
export type NonNullableFieldsUnion<T, K extends keyof T>
  = Omit<T, K> & { [P in K]: NonNullable<T[P]> };

export type ReplaceField<T, K extends keyof T, V> = Omit<T, K> & { [P in K]: V };

export type WithRequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export interface AppTheme extends MD3Theme {
  // TODO: Refactor string => union with actual defined keys (primaryContainer, secondaryContainer, ...)
  customFonts: Record<string, MD3Type>;
  styles: Record<string, ViewStyle | ImageStyle | TextStyle>;
  toggleScheme: () => void;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface GeoPos {
  id: string;
  timestamp: number;
  lat: number;
  lon: number;
  acc: number;
  hdg: number | null;
  vel: number | null;
}

export interface TimeDuration {
  hours: number;
  minutes: number;
  seconds: number;
  msecs: number;
}
