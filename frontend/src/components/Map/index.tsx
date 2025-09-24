import React, { useEffect, useRef, useState } from 'react';

import HtmlRenderer, { type SendDataToWebType} from '../HtmlRenderer';
import LoadingOrErrorRenderer from '../LoadingOrErrorRenderer';

import { SelectLocation } from '../../store/slices/locationSlice';
import htmlBuilder from '../../modules/htmlBuilder';
import leafletJavascript from '../../modules/leafletJavascript';
import { loadAsset } from '../../modules/assetManager';
import { useAppSelector } from '../../store/hooks';

const Map = () => {
  const { current } = useAppSelector(SelectLocation);
  const [leafletHtml, setLeafletHtml] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sendDataToWebRef  = useRef<SendDataToWebType>(null);
  const initialCurrentRef = useRef<typeof current>(current); // use ref to avoid useEffect rerun

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
      const loadedLeaflet = await loadAsset('leafletHtml');
      if (!loadedLeaflet) {
        setError('We encountered a problem loading the map for you. Please try again, or contact our support team if the problem persists');
        return;
      }

      try {
        htmlBuilder.loadHtml(loadedLeaflet);

        htmlBuilder.injectTagIntoSingletonTag('head', 'link', null,
          leafletJavascript.getLeafletStylesheetLinkAttribs());
        htmlBuilder.injectTagIntoSingletonTag('head', 'style',
          leafletJavascript.getDocumentStyleSheet());

        htmlBuilder.injectTagIntoSingletonTag('body', 'script', null,
          leafletJavascript.getLeafletScriptAttribs());
        htmlBuilder.injectTagIntoSingletonTag('body', 'script',
          leafletJavascript.getRNCommunicator());
        htmlBuilder.injectTagIntoSingletonTag('body', 'script',
          leafletJavascript.getLeafletMap({
            lat: initialCurrentRef.current ? initialCurrentRef.current.lat : 0.0,
            lon: initialCurrentRef.current ? initialCurrentRef.current.lon : 0.0,
            zoom: 10.0,
          }));
        htmlBuilder.injectTagIntoSingletonTag('body', 'script',
          leafletJavascript.getAddEventListeners());

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
