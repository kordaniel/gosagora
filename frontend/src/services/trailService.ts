import {
  trailDataSchema,
  trailListingDataArraySchema,
  trailListingDataSchema,
} from '../schemas/trail';
import axiosInstance from '../modules/axiosInstance';
import { validateResponse } from './validators';

import type {
  APITrailRequest,
  CreateTrailArguments,
  TrailData,
  TrailListingData
} from '@common/types/rest_api';

const apiBasePath = '/api/v1/trail';

const create = async (trailDetails: CreateTrailArguments): Promise<TrailListingData> => {
  const postData: APITrailRequest<'create', CreateTrailArguments> = {
    type: 'create',
    data: trailDetails
  };

  const { data } = await axiosInstance.post<TrailListingData>(apiBasePath, postData);

  return await validateResponse<TrailListingData>(
    data,
    trailListingDataSchema,
    'We encountered a problem creating the trail for you. Please try again, or contact our support team if the problem persists'
  );
};

const getAll = async (): Promise<TrailListingData[]> => {
  const { data } = await axiosInstance.get<TrailListingData[]>(apiBasePath);

  return await validateResponse<TrailListingData[]>(
    data,
    trailListingDataArraySchema,
    'We encountered a problem loading the trails for you. Please try again, or contact our support team if the problem persists'
  );
};

const getOne = async (trailId: string): Promise<TrailData> => {
  const { data } = await axiosInstance.get<TrailData>(`${apiBasePath}/${trailId}`);

  return await validateResponse<TrailData>(
    data,
    trailDataSchema,
    'We encountered a problem loading this trail for you. Please try again, or contact our support team if the problem persists'
  );
};

export default {
  create,
  getAll,
  getOne,
};
