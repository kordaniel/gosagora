import React, { useEffect, useRef, useState } from 'react';

import HtmlRenderer, { type SendDataToWebType} from '../HtmlRenderer';
import LoadingOrErrorRenderer from '../LoadingOrErrorRenderer';

import { SelectLocation } from '../../store/slices/locationSlice';
import htmlBuilder from '../../modules/htmlBuilder';
import { loadAsset } from '../../modules/assetManager';
import { useAppSelector } from '../../store/hooks';

const Map = () => {
  const { current } = useAppSelector(SelectLocation);
  const [leafletHtml, setLeafletHtml] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sendDataToWebRef  = useRef<SendDataToWebType>(null);

  const handleMessage = (data: string) => {
    console.log('MSG from web:', data);
  };

  useEffect(() => {
    if (current && sendDataToWebRef.current) {
      sendDataToWebRef.current.sendDataToWeb({
        command: 'setView',
        accuracy: current.acc,
        lat: current.lat,
        lon: current.lon,
      });
    }
  }, [current]);

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

      try {
        htmlBuilder.loadHtml(loadedLeafletHtml);
        htmlBuilder.injectTagIntoSingletonTag('head', 'style', loadedLeafletCss);
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
