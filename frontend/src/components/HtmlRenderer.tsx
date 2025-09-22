import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef
} from 'react';

import {
  WebView,
  type WebViewMessageEvent
} from 'react-native-webview';

import config from '../utils/config';
import { isString } from '../utils/typeguards';

export type SendDataToWebType = {
  sendDataToWeb: (data: {
    command: 'setView';
    accuracy?: number;
    lat: number;
    lon: number;
    zoom?: number;
  }) => void;
};

interface HtmlRendererProps {
  handleMsgFromWeb: (msg: string) => void;
  html: string;
}

type RenderProps = Pick<HtmlRendererProps, 'handleMsgFromWeb' | 'html'>;

const RenderMobile = forwardRef<SendDataToWebType, RenderProps>(function RenderMobile(
  { handleMsgFromWeb, html }: RenderProps, ref?
) {
  const webViewRef = useRef<WebView>(null);

  const handleMessage = (event: WebViewMessageEvent) => {
    try {
      handleMsgFromWeb(event.nativeEvent.data);
    } catch (error: unknown) {
      console.error('RenderMobile.handleMessage:', error);
    }
  };

  const sendDataToWeb: SendDataToWebType['sendDataToWeb'] = (data) => {
    if (webViewRef.current) {
      const msg = JSON.stringify(data);
      webViewRef.current.postMessage(msg);
    } else {
      console.error('RenderMobile.webViewRef.current === null');
    }
  };

  useImperativeHandle(ref, () => ({ sendDataToWeb }));

  return (
    <WebView
      onMessage={handleMessage}
      originWhitelist={["*"]}
      ref={webViewRef}
      source={{ html }}
      style={{ flex: 1 }}
    />
  );
});

//type IFrame = React.ComponentProps<'iframe'>; // ..WithRef ..WithoutRef is also available

const RenderWeb = forwardRef<SendDataToWebType, RenderProps>(function RenderWeb(
  { handleMsgFromWeb, html }: RenderProps, ref?
) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const style = { border: 'none', height: '100%', width: '100%' };

  useEffect(() => {
    const handleMessage = (e: MessageEvent<Record<string, unknown> | string>) => {
      if (e.data) {
        if (isString(e.data)) {
          handleMsgFromWeb(e.data);
        } else if ('source' in e.data && isString(e.data.source) && e.data.source === 'react-devtools-bridge') {
          return; // Discard message
        } else {
          console.error('RenderWeb.handleMessage: invalid e.data');
        }
      } else {
        console.error('RenderWeb.handleMessage: invalid event');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };

  }, [handleMsgFromWeb]);

  const sendDataToWeb: SendDataToWebType['sendDataToWeb'] = (data) => {
    if (iframeRef.current) {
      const msg = JSON.stringify(data);
      iframeRef.current.contentWindow?.postMessage(msg);
    } else {
      console.error('RenderWeb.iframeRef.current === null');
    }
  };

  useImperativeHandle(ref, () => ({ sendDataToWeb }));

  return (
    <iframe
      srcDoc={html}
      //name='' // name of iframe (mainly used to reference the element in javascript)
      allowFullScreen={true}
      loading="eager"
      ref={iframeRef}
      referrerPolicy="no-referrer"
      style={style}
      sandbox='allow-scripts allow-same-origin'
    />
  );
});

const HtmlRenderer = forwardRef<
  SendDataToWebType,
  HtmlRendererProps
>(function HtmlRenderer(
  { handleMsgFromWeb, html }: HtmlRendererProps, ref?
) {
  const webRef = useRef<SendDataToWebType>(null);

  const sendDataToWeb: SendDataToWebType['sendDataToWeb'] = (data) => {
    if (webRef.current) {
      webRef.current.sendDataToWeb(data);
    }
  };

  useImperativeHandle(ref, () => ({ sendDataToWeb }));

  return config.IS_MOBILE
    ? <RenderMobile ref={webRef} html={html} handleMsgFromWeb={handleMsgFromWeb} />
    : <RenderWeb ref={webRef} html={html} handleMsgFromWeb={handleMsgFromWeb} />;
});

export default HtmlRenderer;
