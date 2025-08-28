import {
  patchRaceSchema,
  raceDataSchema,
  raceListingDataArraySchema,
  raceListingDataSchema,
} from '../schemas/race';
import axiosInstance from '../modules/axiosInstance';
import { validateResponse } from './validators';

import type {
  APIRaceRequest,
  CreateRaceArguments,
  RaceData,
  RaceListingData,
  RacePatchResponseData,
} from '@common/types/rest_api';

const apiBasePath = '/api/v1/race';

const create = async (raceDetails: CreateRaceArguments): Promise<RaceListingData> => {
  const postData: APIRaceRequest<'create', CreateRaceArguments> = {
    type: 'create',
    data: raceDetails
  };

  const { data } = await axiosInstance.post<RaceListingData>(
    `${apiBasePath}`, postData
  );

  return await validateResponse<RaceListingData>(
    data,
    raceListingDataSchema,
    'We encountered a problem creating the race for you. Please try again, or contact our support team if the problem persists'
  );
};

const deleteOne = async (raceId: string): Promise<void> => {
  await axiosInstance.delete(`${apiBasePath}/${raceId}`);
};

const getAll = async (): Promise<RaceListingData[]> => {
  const { data } = await axiosInstance.get<RaceListingData[]>(apiBasePath);

  return await validateResponse<RaceListingData[]>(
    data,
    raceListingDataArraySchema,
    'We encountered a problem loading the races for you. Please try again, or contact our support team if the problem persists'
  );
};

const getOne = async (raceId: string): Promise<RaceData> => {
  const { data } = await axiosInstance.get<RaceData>(`${apiBasePath}/${raceId}`);

  return await validateResponse<RaceData>(
    data,
    raceDataSchema,
    'We encountered a problem loading this race for you. Please try again, or contact our support team if the problem persists'
  );
};

const updateOne = async (
  raceId: string,
  raceDetails: Partial<CreateRaceArguments>
): Promise<RacePatchResponseData> => {
  const patchData: APIRaceRequest<'update', Partial<CreateRaceArguments>> = {
    type: 'update',
    data: raceDetails
  };

  const { data } = await axiosInstance.patch<RacePatchResponseData>(
    `${apiBasePath}/${raceId}`, patchData
  );

  return await validateResponse<RacePatchResponseData>(
    data,
    patchRaceSchema,
    'We encountered a problem updating this race for you. Please try again, or contact our support team if the problem persists'
  );
};

export default {
  create,
  deleteOne,
  getAll,
  getOne,
  updateOne,
};
