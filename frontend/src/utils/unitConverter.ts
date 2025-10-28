import { assertNever } from './typeguards';

export type DistanceUnits = 'kilometers' | 'meters' | 'nauticalMiles';
export type VelocityUnits = 'kilometersPerHour' | 'knots' | 'metersPerSec';

const degToRad = (angle: number) => {
  return angle * Math.PI / 180;
};

const radToDeg = (radians: number) => {
  return radians * 180 / Math.PI;
};

const metersTo = (meters: number, toType: DistanceUnits): number => {
  switch (toType) {
    case 'nauticalMiles': return meters * 0.0005399568;
    case 'kilometers':    return meters * 0.001;
    case 'meters':        return meters;
    default: return assertNever(toType);
  }
};

const mPerSecTo = (mPerS: number, toType: VelocityUnits): number => {
  switch (toType) {
    case 'knots':             return mPerS * 1.94384;
    case 'kilometersPerHour': return mPerS * 3.6;
    case 'metersPerSec':      return mPerS;
    default: return assertNever(toType);
  }
};

export default {
  degToRad,
  radToDeg,
  metersTo,
  mPerSecTo,
};
