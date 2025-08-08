import type { ReplaceField } from '../types';

import type { UserDetailsData } from '@common/types/rest_api';

export type UserDetails = ReplaceField<UserDetailsData, 'lastseenAt', Date | null>;

export const toUserDetails = (user: UserDetailsData): UserDetails => ({
  ...user,
  lastseenAt: user.lastseenAt ? new Date(user.lastseenAt) : null,
});
