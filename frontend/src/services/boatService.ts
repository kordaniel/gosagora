import axiosInstance from '../modules/axiosInstance';
import { sailboatDataSchema } from '../schemas/boat';
import { validateResponse } from './validators';

import { SailboatData } from '@common/types/rest_api';

const apiBasePath = '/api/v1/boat';

const getOne = async (boatId: string): Promise<SailboatData> => {
  const { data } = await axiosInstance.get<SailboatData>(`${apiBasePath}/${boatId}`);
  return await validateResponse<SailboatData>(
    data,
    sailboatDataSchema,
    'We encountered a problem loading this boat for you. Please try again, or contact our support team if the problem persists'
  );
};

export default {
  getOne,
};
