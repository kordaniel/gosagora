import type { DateRange, GeoPos } from '../types';
import type {
  LeafletToRNCommandMessage,
  LeafletToRNMessage,
  RNLeafletBidirectionalMessages,
  RNToLeafletCommandMessage,
  RNToLeafletMessage,
} from '../bundles/leaflet/msgBridgeToRN';

const hasOptionalStringField = <T extends object, K extends string>(
  param: T,
  key: K
): param is T & { [P in K]?: string } => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
  return !(key in param) || isString((param as any)[key]);
};

const isArrayOf = <T>(
  param: unknown,
  typeGuard: (el: unknown) => el is T,
): param is T[] => {
  return Array.isArray(param) && param.every(typeGuard);
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

export const isNullableGeoPos = (param: unknown): param is GeoPos | null => {
  return param === null || isGeoPos(param);
};

export const isNumber = (param: unknown): param is number => {
  return typeof param === 'number';
};

export const isString = (param: unknown): param is string => {
  return typeof param === 'string' || param instanceof String;
};

const isRNLeafletBidirectionalDebugMessage = (payload: NonNullable<object>): payload is RNLeafletBidirectionalMessages['debug'] => {
  return !Array.isArray(payload) &&
    hasOptionalStringField(payload, 'echo') &&
    hasOptionalStringField(payload, 'error') &&
    hasOptionalStringField(payload, 'msg');
};

const isLeafletToRNCommandMessagePayload = (payload: NonNullable<object>): payload is LeafletToRNCommandMessage => {
  if (Array.isArray(payload)) {
    return false;
  }
  if (!('command' in payload && isString(payload.command))) {
    return false;
  }

  if (payload.command === 'openUrl') {
    return 'href' in payload && isString(payload.href);
  } else if (payload.command === 'reqPositionsHistory') {
    return true;
  } else {
    return false;
  }
};

const isRNToLeafletCommandMessagePayload = (payload: NonNullable<object>): payload is RNToLeafletCommandMessage => {
  if (Array.isArray(payload)) {
    return false;
  }
  if (!('command' in payload && isString(payload.command))) {
    return false;
  }

  if (payload.command === 'setPosition') {
    if (!('position' in payload)) {
      return false;
    }
    return isNullableGeoPos(payload.position);
  } else if (payload.command === 'setPositions') {
    if (!('positions' in payload)) {
      return false;
    }
    return isArrayOf(payload.positions, isNullableGeoPos);
  } else {
    return false;
  }
};

export const isLeafletToRNMessage = (param: unknown): param is LeafletToRNMessage => {
  if (!isNotNullObject(param) ||
      !('type' in param && isString(param.type)) ||
      !('payload' in param && isNotNullObject(param.payload))
  ) {
    return false;
  }

  if (param.type === 'command') {
    return isLeafletToRNCommandMessagePayload(param.payload);
  } else if (param.type === 'debug') {
    return isRNLeafletBidirectionalDebugMessage(param.payload);
  } else {
    return false;
  }
};

export const isRNToLeafletMessage = (param: unknown): param is RNToLeafletMessage => {
  if (!isNotNullObject(param) ||
      !('type' in param && isString(param.type)) ||
      !('payload' in param && isNotNullObject(param.payload))
  ) {
    return false;
  }

  if (param.type === 'command') {
    return isRNToLeafletCommandMessagePayload(param.payload);
  } else if (param.type === 'debug') {
    return isRNLeafletBidirectionalDebugMessage(param.payload);
  } else {
    return false;
  }
};
