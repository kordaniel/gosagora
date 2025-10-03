import type { WebViewMessageEvent } from 'react-native-webview';

import type { GeoPos } from '../../types';

export type RNLeafletMessage =
  | {
      type: 'debug';
      payload: {
        echo?: string;
        error?: string;
        msg?: string;
      };
    }
  | {
    type: 'command',
    payload: {
      command: 'setPosition',
      position: GeoPos | null;
    };
  };

export const sendMsg = (data: RNLeafletMessage) => {
  const msg = JSON.stringify(data);
  if (window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(msg);
  } else if (window.parent) {
    window.parent.postMessage(msg, '*');
  }
};

const setOnMsgHandler = (handler: (msg: RNLeafletMessage) => void) => {
  return (
    event: MessageEvent<string> | WebViewMessageEvent['nativeEvent'] // iframe contentWindow.postMessage | react-native-webview postMessage event
  ) => {
    try {
      handler(JSON.parse(event.data) as RNLeafletMessage);
    } catch (err: unknown) {
      handler({
        type: 'debug',
        payload: {
          error: JSON.stringify(err instanceof Error ? err.message : err),
          echo: event.data,
        },
      });
    }
  };
};

export default {
  sendMsg,
  setOnMsgHandler,
};
