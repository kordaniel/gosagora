import { assertNever } from './typeguards';

export enum DistanceUnits {
  Kilometers,
  NauticalMiles,
  Meters,
}

export enum VelocityUnits {
  KilometersPerHour,
  Knots,
  MetersPerSec,
}

const degToRad = (angle: number) => {
  return angle * Math.PI / 180;
};

const radToDeg = (radians: number) => {
  return radians * 180 / Math.PI;
};

const metersTo = (meters: number, toType: DistanceUnits): number => {
  switch (toType) {
    case DistanceUnits.NauticalMiles: return meters * 0.0005399568;
    case DistanceUnits.Kilometers:    return meters * 0.001;
    case DistanceUnits.Meters:        return meters;
    default: return assertNever(toType);
  }
};

const mPerSecTo = (mPerS: number, toType: VelocityUnits): number => {
  switch (toType) {
    case VelocityUnits.Knots:             return mPerS * 1.94384;
    case VelocityUnits.KilometersPerHour: return mPerS * 3.6;
    case VelocityUnits.MetersPerSec:      return mPerS;
    default: return assertNever(toType);
  }
};

export default {
  degToRad,
  radToDeg,
  metersTo,
  mPerSecTo,
};
