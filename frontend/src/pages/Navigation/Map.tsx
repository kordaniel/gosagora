import React, { useEffect, useState } from 'react';

import HtmlRenderer from '../../components/HtmlRenderer';
import LoadingOrErrorRenderer from '../../components/LoadingOrErrorRenderer';

import { loadAsset } from '../../modules/assetManager';


const Map = () => {
  const [html, setHtml] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLeafletHtml = async () => {
      const leafletHtml = await loadAsset('leafletHtml');
      if (leafletHtml) {
        setHtml(leafletHtml);
      } else {
        setError('Error loading Map (html)');
      }
    };
    void loadLeafletHtml();
  }, []);

  if (!html || error) {
    return (
      <LoadingOrErrorRenderer
        loading={!error}
        loadingMessage="Just a moment, we are loading the map for you"
        error={error}
      />
    );
  }

  return <HtmlRenderer html={html} />;
};

export default Map;
