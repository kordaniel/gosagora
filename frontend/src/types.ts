import type { ImageStyle, TextStyle, ViewStyle } from 'react-native';
import type { User as FirebaseUser } from 'firebase/auth';
import type { MD3Theme } from 'react-native-paper';

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
