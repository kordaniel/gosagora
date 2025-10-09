import 'leaflet';
import type { CurrentPositionEventMap } from './leafletTypes';

declare module 'leaflet' {

  interface Evented {
    on<K extends keyof CurrentPositionEventMap>(
      type: K,
      fn: (event: { type: K }
        & Pick<L.LeafletEvent, 'sourceTarget' | 'target'>
        & CurrentPositionEventMap[K]
      ) => void,
    ): this;

    fire<K extends keyof CurrentPositionEventMap>(
      type: K,
      data: CurrentPositionEventMap[K],
    ): this;
  }
}
