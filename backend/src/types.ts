import { CreateRaceArguments } from '@common/types/rest_api';

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

export interface NewRaceAttributes extends Omit<CreateRaceArguments,
  'dateFrom' | 'dateTo' | 'registrationOpenDate' | 'registrationCloseDate'
> {
  dateFrom: Date;
  dateTo: Date;
  registrationOpenDate: Date;
  registrationCloseDate: Date;
}

export interface ConstantsModelObj {
  MODEL_NAME: string;
  SQL_TABLE_NAME: string;
  VALIDATION: {
    [key: string]: {
      MIN: number;
      MAX: number;
    }
  }
}