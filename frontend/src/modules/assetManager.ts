/* eslint-disable @typescript-eslint/no-require-imports */
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';

import config from '../utils/config';

const createAssetsMap = <T extends Record<string, number | string>>(map: T) => map;

const GOSAGORA_ASSETS = createAssetsMap({
  leafletHtml: require('assets/html/leaflet.html') as number | string,
  leafletJs: require('assets/bundles/leaflet/leaflet.js.bundle') as number | string,
  leafletCss: require('assets/bundles/leaflet/dist/leaflet.css.bundle') as number | string,
  leafletFullscreenCss: require('assets/bundles/leaflet.fullscreen/Control.FullScreen.css.bundle') as number | string,
  leafletBoatingCss: require('assets/bundles/leaflet.boating/L.Control.Boating.css.bundle') as number | string,
} as const);

type GosaGoraAssets = keyof typeof GOSAGORA_ASSETS;

export const loadAsset = async (assetToLoad: GosaGoraAssets): Promise<string | null> => {
  try {
    const path = GOSAGORA_ASSETS[assetToLoad];
    const asset = Asset.fromModule(path);

    if (config.IS_MOBILE) {
      await asset.downloadAsync();
      return await FileSystem.readAsStringAsync(asset.localUri!);
    } else {
      const response = await fetch(asset.localUri || asset.uri);
      return await response.text();
    }

  } catch (error) {
    console.error('ERROR loading asset:', error);
    return null;
  }
};
