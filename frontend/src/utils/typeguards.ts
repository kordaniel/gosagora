import type { DateRange, GeoPos } from '../types';
import type { RNLeafletMessage } from '../bundles/leaflet/msgBridgeToRN';

const hasOptionalStringField = <T extends object, K extends string>(
  param: T,
  key: K
): param is T & { [P in K]?: string } => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
  return !(key in param) || isString((param as any)[key]);
};

const isNotNullObject = (param: unknown): param is object => {
  return typeof param === 'object' && param !== null;
};

export const isDateRange = (param: unknown): param is DateRange => {
  if (!param || typeof param !== 'object') {
    return false;
  }
  if (!(('startDate' in param) && (param.startDate instanceof Date))) {
    return false;
  }
  if (!(('endDate' in param) && (param.endDate instanceof Date))) {
    return false;
  }

  return true;
};

export const assertNever = (value: never): never => {
  throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
};

export const isGeoPos = (param: unknown): param is GeoPos => {
  if (!isNotNullObject(param)) {
    return false;
  }

  return ('id' in param && param.id !== null && isString(param.id)) &&
    ('timestamp' in param && param.timestamp !== null && isNumber(param.timestamp)) &&
    ('lat' in param && param.lat !== null && isNumber(param.lat)) &&
    ('lon' in param && param.lon !== null && isNumber(param.lon)) &&
    ('acc' in param && param.acc !== null && isNumber(param.acc)) &&
    ('hdg' in param && (param.hdg === null || isNumber(param.hdg))) &&
    ('vel' in param && (param.vel === null || isNumber(param.vel)));
};

export const isNumber = (param: unknown): param is number => {
  return typeof param === 'number';
};

export const isString = (param: unknown): param is string => {
  return typeof param === 'string' || param instanceof String;
};

const isRNLeafletMessageDebugPayload = (payload: NonNullable<object>): payload is {
  echo?: string;
  error?: string;
  msg?: string;
} => {
  return !Array.isArray(payload) &&
    hasOptionalStringField(payload, 'echo') &&
    hasOptionalStringField(payload, 'error') &&
    hasOptionalStringField(payload, 'msg');
};

const isRNLeafletMessageCommandPayload = (payload: NonNullable<object>): payload is
{
  command: 'openUrl';
  href: string;
} | {
  command: 'setPosition';
  position: GeoPos | null;
} => {
  if (Array.isArray(payload)) {
    return false;
  }
  if (!('command' in payload && isString(payload.command))) {
    return false;
  }

  if (payload.command === 'openUrl') {
    return 'href' in payload && isString(payload.href);
  } else if (payload.command === 'setPosition') {
    if (!('position' in payload)) {
      return false;
    }
    return payload.position === null || isGeoPos(payload.position);
  }

  return false;
};

export const isRNLeafletMessage = (param: unknown): param is RNLeafletMessage => {
  if (!isNotNullObject(param) ||
      !('type' in param && isString(param.type)) ||
      !('payload' in param && isNotNullObject(param.payload))
  ) {
    return false;
  }

  if (param.type === 'debug') {
    return isRNLeafletMessageDebugPayload(param.payload);
  } else if (param.type === 'command') {
    return isRNLeafletMessageCommandPayload(param.payload);
  } else {
    return false;
  }
};
