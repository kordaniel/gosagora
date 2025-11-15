import {
  trailListingDataArraySchema,
  trailListingDataSchema,
} from '../schemas/trail';
import axiosInstance from '../modules/axiosInstance';
import { validateResponse } from './validators';

import type {
  APITrailRequest,
  CreateTrailArguments,
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
  // TODO: DELETE dev trycatch
  try {
    const { data } = await axiosInstance.get<TrailListingData[]>(apiBasePath);

    return await validateResponse<TrailListingData[]>(
      data,
      trailListingDataArraySchema,
      'We encountered a problem loading the trails for you. Please try again, or contact our support team if the problem persists'
    );
  } catch (error) {
    console.log('err:', error);
    throw error;
  }
};

export default {
  create,
  getAll,
};
