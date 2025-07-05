
import axiosInstance from '../modules/axiosInstance';
import { raceSchema } from '../schemas/race';
import { validateResponse } from './validators';

import type {
  APIRaceRequest,
  CreateRaceArguments,
  RaceData,
} from '@common/types/rest_api';
import type {
  RaceListing,
} from '@common/types/race';

const apiBasePath = '/api/v1/race';

const create = async (raceDetails: CreateRaceArguments) => {
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

export default {
  create,
  getAll,
  getOne,
};
