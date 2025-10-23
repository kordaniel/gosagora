import type { WebViewMessageEvent } from 'react-native-webview';

import type { GeoPos } from '../../types';
import { isRNToLeafletMessage } from '../../utils/typeguards';
import { parseJSON } from '../../utils/parsers';

export type RNLeafletBidirectionalMessages = {
  debug: {
    echo?: string;
    error?: string;
    msg?: string;
  };
};

export type LeafletToRNCommandMessage =
  | { command: 'openUrl'; href: string; };

export type RNToLeafletCommandMessage =
  | { command: 'setPosition'; position: GeoPos | null; };

type LeafletToRNMessageTypesPayloads = {
  command: LeafletToRNCommandMessage;
  debug: RNLeafletBidirectionalMessages['debug'];
};

export type LeafletToRNMessage = {
  [T in keyof LeafletToRNMessageTypesPayloads]: {
    type: T;
    payload: LeafletToRNMessageTypesPayloads[T];
  }
}[keyof LeafletToRNMessageTypesPayloads];

type RNToLeafletMessageTypesPayloads = {
  command: RNToLeafletCommandMessage;
  debug: RNLeafletBidirectionalMessages['debug'];
};

export type RNToLeafletMessage = {
  [T in keyof RNToLeafletMessageTypesPayloads]: {
    type: T;
    payload: RNToLeafletMessageTypesPayloads[T];
  }
}[keyof RNToLeafletMessageTypesPayloads];

const sendMsg = (data: LeafletToRNMessage) => {
  const msg = JSON.stringify(data);
  if (window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(msg);
  } else if (window.parent) {
    window.parent.postMessage(msg, '*');
  }
};

const setOnMsgHandler = (handler: (msg: RNToLeafletMessage) => void) => {
  return (
    event: MessageEvent<string> | WebViewMessageEvent['nativeEvent'] // iframe contentWindow.postMessage | react-native-webview postMessage event
  ) => {
    const parsedData = parseJSON(isRNToLeafletMessage)(event.data);

    if (parsedData.hasError) {
      // NOTE: relay errors back to RN
      handler({
        type: 'debug',
        payload: {
          error: parsedData.error, // Contains original event.data string
        },
      });
      return;
    }

    handler(parsedData.parsed);
  };
};

export default {
  sendMsg,
  setOnMsgHandler,
};
