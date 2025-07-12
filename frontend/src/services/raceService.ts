import { patchRaceSchema, raceSchema } from '../schemas/race';
import axiosInstance from '../modules/axiosInstance';
import { validateResponse } from './validators';

import type {
  APIRaceRequest,
  CreateRaceArguments,
  RaceData,
  RacePatchResponseData,
} from '@common/types/rest_api';
import type {
  RaceListing,
} from '@common/types/race';

const apiBasePath = '/api/v1/race';

const create = async (raceDetails: CreateRaceArguments): Promise<RaceListing> => {
  const postData: APIRaceRequest<'create', CreateRaceArguments> = {
    type: 'create',
    data: raceDetails
  };

  const { data } = await axiosInstance.post<RaceListing>(
    `${apiBasePath}`, postData
  );
  return data;
};

const getAll = async () => {
  const { data } = await axiosInstance.get<RaceListing[]>(apiBasePath);
  return data;
};

const getOne = async (raceId: string): Promise<RaceData> => {
  const { data } = await axiosInstance.get<RaceData>(`${apiBasePath}/${raceId}`);
  return await validateResponse<RaceData>(
    data,
    raceSchema,
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
  getAll,
  getOne,
  updateOne,
};
