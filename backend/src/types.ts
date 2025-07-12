import type { Request } from 'express';
import { User } from './models';

import { CreateRaceArguments } from '@common/types/rest_api';

import {
  type ParamsDictionary as ExpressCoreParamsDictionary,
  type Query as ExpressCoreQuery,
} from 'express-serve-static-core';

export type AssertEqual<T, U> = (
  <V>() => V extends T ? 1 : 2
) extends <V, >() => V extends U ? 1 : 2
  ? true
  : false;

export type EnvironmentType =
  | 'production'
  | 'development'
  | 'test'
  | 'test-production'; // Simulate production, with test db

type OptionalExpressRequestParamsDictionaryParam<P> = P extends undefined
  ? ExpressCoreParamsDictionary
  : P extends unknown
    ? ExpressCoreParamsDictionary
    : P extends ExpressCoreParamsDictionary
      ? P
      : never;

export interface RequestUserExtended<
  P = ExpressCoreParamsDictionary,
  ResBody = unknown,
  ReqBody = unknown,
  ReqQuery = ExpressCoreQuery,
  Locals extends Record<string, unknown> = Record<string, unknown>,
> extends Request<OptionalExpressRequestParamsDictionaryParam<P>, ResBody, ReqBody, ReqQuery, Locals> {
  user?: User;
};

export interface NewRaceAttributes extends Omit<CreateRaceArguments,
  'dateFrom' | 'dateTo' | 'registrationOpenDate' | 'registrationCloseDate'
> {
  dateFrom: Date;
  dateTo: Date;
  registrationOpenDate: Date;
  registrationCloseDate: Date;
}
