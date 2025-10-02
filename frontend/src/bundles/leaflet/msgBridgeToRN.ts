import type { WebViewMessageEvent } from 'react-native-webview';

export type RNMessage<T = unknown> = {
  type: string;
  payload?: T;
} | {
  command: 'setView',
  payload: {
    lat: number,
    lon: number,
    zoom?: number,
    accuracy?: number;
  }
} | {
  type: 'debug',
  error?: string;
  raw?: string;
};

export const sendMsg = (data: RNMessage) => {
  const msg = JSON.stringify(data);
  if (window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(msg);
  } else if (window.parent) {
    window.parent.postMessage(msg, '*');
  }
};

const setOnMsgHandler = (handler: (msg: RNMessage) => void) => {
  return (
    event: MessageEvent<string> | WebViewMessageEvent['nativeEvent'] // iframe contentWindow.postMessage | react-native-webview postMessage event
  ) => {
    try {
      handler(JSON.parse(event.data) as RNMessage);
    } catch (error: unknown) {
      handler({
        type: 'debug',
        error: JSON.stringify(error instanceof Error ? error.message : error),
        raw: event.data
      });
    }
  };
};

export default {
  sendMsg,
  setOnMsgHandler,
};
