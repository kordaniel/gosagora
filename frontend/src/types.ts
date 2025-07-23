import type { ImageStyle, TextStyle, ViewStyle } from 'react-native';
import type { User as FirebaseUser } from 'firebase/auth';
import type { MD3Theme } from 'react-native-paper';

export type NonNullableFields<T> = {
  [K in keyof T]: Exclude<T[K], null>;
};

export type ReplaceField<T, K extends keyof T, V> = Omit<T, K> & { [P in K]: V };

export type WithRequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export interface AppTheme extends MD3Theme {
  // TODO: Refactor string => union with actual defined keys (primaryContainer, secondaryContainer, ...)
  styles: Record<string, ViewStyle | ImageStyle | TextStyle>;
  toggleScheme: () => void;
}

export interface GosaGoraUser {
  id: number;
  email: string;
  firebaseUid: string;
  displayName: string;
  lastseenAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  disabledAt: Date | null;
}

export interface User {
  firebaseUser: FirebaseUser;
  gosaGoraUser: GosaGoraUser;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}
