import React from 'react';

import { WebView } from 'react-native-webview';

import config from '../utils/config';

interface HtmlRendererProps {
  html: string;
}

type RenderProps = Pick<HtmlRendererProps, 'html'>;

const RenderMobile = ({ html }: RenderProps) => {
  return (
    <WebView
      style={{ flex: 1 }}
      originWhitelist={["*"]}
      source={{ html }}
    />
  );
};

const RenderWeb = ({ html }: RenderProps) => {
  return (
    <div dangerouslySetInnerHTML={{ __html: html }}/>
  );
};

const HtmlRenderer = ({ html }: HtmlRendererProps) => {
  return config.IS_MOBILE
    ? <RenderMobile html={html} />
    : <RenderWeb html={html} />;
};

export default HtmlRenderer;
