import React, { useEffect, useState } from 'react';

import HtmlRenderer from '../HtmlRenderer';
import LoadingOrErrorRenderer from '../LoadingOrErrorRenderer';

import { loadAsset } from '../../modules/assetManager';

const Map = () => {
  const [leafletHtml, setLeafletHtml] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLeafletHtml = async () => {
      const loadedLeaflet = await loadAsset('leafletHtml');
      if (loadedLeaflet) {
        setLeafletHtml(loadedLeaflet);
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

  return <HtmlRenderer html={leafletHtml} />;
};

export default Map;
