import { Alert } from 'react-native';

import config from '../utils/config';

export const askConfirmation = (
  message: string,
  confirmationCb: (confirmation: boolean) => void
): void => {
  if (!config.IS_MOBILE) {
    confirmationCb(window.confirm(message));
  } else {
    Alert.alert(
      'Please confirm this action',
      message,
      [{
        text: 'Cancel',
        onPress: () => confirmationCb(false),
        style: 'cancel',
      }, {
        text: 'OK',
        onPress: () => confirmationCb(true),
      }],
    );
  }
};
