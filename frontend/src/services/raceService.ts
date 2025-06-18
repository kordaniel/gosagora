import axiosInstance from '../modules/axiosInstance';

import type {
  APIRaceRequest,
  CreateRaceArguments
} from '@common/types/rest_api';
import type { RaceListing } from '@common/types/race';

const apiBasePath = '/api/v1/race';

const create = async (raceDetails: CreateRaceArguments) => {
  const postData: APIRaceRequest<'create', CreateRaceArguments> = {
    type: 'create',
    data: raceDetails
  };

  const { data } = await axiosInstance.post<unknown>(
    `${apiBasePath}`, postData
  );

  return data;
};

const getAll = async () => {
  const { data } = await axiosInstance.get<RaceListing[]>(apiBasePath);
  return data;
};

export default {
  create,
  getAll,
};
