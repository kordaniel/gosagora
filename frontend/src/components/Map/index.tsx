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

  const sendDataToWebRef = useRef<SendDataToWebType>(null);

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
      if (loadedLeaflet) {
        htmlBuilder.loadHtml(loadedLeaflet);
        htmlBuilder.injectScriptTagIntoBody(
          'messageToRN(JSON.stringify({ type: "debug", raw: "Hello from injected JS!" }));'
        );
        setLeafletHtml(htmlBuilder.toString());
        htmlBuilder.unloadHtml();
      } else {
        setError('Error loading Map (html)');
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
