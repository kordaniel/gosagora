import React, { useEffect, useRef, useState } from 'react';

import HtmlRenderer, { type SendDataToWebType} from '../HtmlRenderer';
import LoadingOrErrorRenderer from '../LoadingOrErrorRenderer';

import { assertNever, isLeafletToRNMessage } from '../../utils/typeguards';
import { SelectLocation } from '../../store/slices/locationSlice';
import config from '../../utils/config';
import htmlBuilder from '../../modules/htmlBuilder';
import { loadAsset } from '../../modules/assetManager';
import { openLink } from '../../utils/linking';
import { parseJSON } from '../../utils/parsers';
import { useAppSelector } from '../../store/hooks';


const Map = () => {
  const { currentPosition } = useAppSelector(SelectLocation);
  const [leafletHtml, setLeafletHtml] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sendDataToWebRef = useRef<SendDataToWebType>(null);

  const handleMessage = (data: string) => {
    const parsedData = parseJSON(isLeafletToRNMessage)(data);

    if (parsedData.hasError) {
      console.error('MAP:', parsedData.error);
      return;
    }

    const { parsed: leafletMsg } = parsedData;

    switch (leafletMsg.type) {
      case 'command':
        switch (leafletMsg.payload.command) {
          case 'openUrl':
            openLink(leafletMsg.payload.href);
            break;
          default:
            assertNever(leafletMsg.payload.command);
        }
        break;
      case 'debug':
        if (config.IS_DEVELOPMENT_ENV) {
          console.log('MAP DBG:', leafletMsg.payload);
        }
        break;
      default:
        assertNever(leafletMsg);
    }
  };

  useEffect(() => {
    if (currentPosition && sendDataToWebRef.current) {
      sendDataToWebRef.current.sendDataToWeb({
        type: 'command',
        payload: {
          command: 'setPosition',
          position: currentPosition,
        },
      });
    }
  }, [currentPosition]);

  useEffect(() => {
    const loadLeafletHtml = async () => {
      const loadedLeafletHtml = await loadAsset('leafletHtml');
      if (!loadedLeafletHtml) {
        setError('We encountered a problem loading the map for you. Please try again, or contact our support team if the problem persists');
        return;
      }
      const loadedLeafletJs = await loadAsset('leafletJs');
      if (!loadedLeafletJs) {
        setError('We encountered a problem loading the map functionality for you. Please try again, or contact our support team if the problem persists');
      }
      const loadedLeafletCss = await loadAsset('leafletCss');
      if (!loadedLeafletCss) {
        setError('We encountered a problem loading the map style for you. Please try again, or contact our support team if the problem persists');
      }
      const loadedLeafletFullscreenCss = await loadAsset('leafletFullscreenCss');
      if (!loadedLeafletFullscreenCss) {
        setError('We encountered a problem loading the style for the map fullscreen functionality for you. Please try again, or contact our support team if the problem persists');
      }
      const loadedLeafletGosagoraCss = await loadAsset('leafletGosagoraCss');
      if (!loadedLeafletGosagoraCss) {
        setError('We encountered a problem loading the style for the Gosagora functionality of the map for you. Please try again, or contact our support team if the problem persists');
      }

      try {
        htmlBuilder.loadHtml(loadedLeafletHtml);
        htmlBuilder.injectTagIntoSingletonTag('head', 'style', loadedLeafletCss);
        htmlBuilder.injectTagIntoSingletonTag('head', 'style', loadedLeafletFullscreenCss);
        htmlBuilder.injectTagIntoSingletonTag('head', 'style', loadedLeafletGosagoraCss);
        htmlBuilder.injectTagIntoSingletonTag('body', 'script', loadedLeafletJs);

        setLeafletHtml(htmlBuilder.toString());
        htmlBuilder.unloadHtml();
      } catch (error: unknown) {
        console.log('Error while bundling Map HTML:', error instanceof Error ? error.message : error);
        setError('We encountered a problem initializing the map for you. Please try again, or contact our support team if the problem persists');
      }
    };

    void loadLeafletHtml();
  }, []);

  if (!leafletHtml || error) {
    return (
      <LoadingOrErrorRenderer
        loading={!error}
        loadingMessage="Just a moment, we are loading the map for you"
        error={error}
      />
    );
  }

  return <HtmlRenderer
    ref={sendDataToWebRef}
    handleMsgFromWeb={handleMessage}
    html={leafletHtml}
  />;
};

export default Map;
