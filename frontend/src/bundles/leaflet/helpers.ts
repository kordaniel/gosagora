import {
  DistanceUnits,
  VelocityUnits
} from '../../utils/unitConverter';
import {
  dateOrTimestampToString,
  decimalCoordsToDMSString,
  distanceToString,
  headingToString,
  velocityToString
} from '../../utils/stringTools';
import type { GeoPos } from '../../types';

export const GeoPosToPopupHTML = (pos: GeoPos): string => {
  const dms = decimalCoordsToDMSString({ lat: pos.lat, lon: pos.lon });
  const fields = [
    `Time: ${dateOrTimestampToString(pos.timestamp)}`,
    `Lat: ${dms.lat}`,
    `Lon: ${dms.lon}`,
    `Acc: ${distanceToString(pos.acc, DistanceUnits.Meters)}`,
    `COG: ${headingToString(pos.hdg)}`,
    `SOG: ${velocityToString(pos.vel, VelocityUnits.KilometersPerHour)}`
  ];
  return `<p>${fields.join('<br/>')}</p>`;
};
