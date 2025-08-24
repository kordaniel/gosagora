import axiosInstance from '../modules/axiosInstance';
import { sailboatDataSchema } from '../schemas/boat';
import { validateResponse } from './validators';

import type {
  APIBoatRequest,
  BoatCreateResponseData,
  CreateSailboatArguments,
  SailboatData,
} from '@common/types/rest_api';
import { BoatType } from '@common/types/boat';

const apiBasePath = '/api/v1/boat';

const createSailboat = async (boatDetails: CreateSailboatArguments): Promise<BoatCreateResponseData> => {
  const postData: APIBoatRequest<'create', CreateSailboatArguments> = {
    type: 'create',
    boatType: BoatType.Sailboat,
    data: boatDetails,
  };

  // TODO: Validate response
  const { data } = await axiosInstance.post<BoatCreateResponseData>(apiBasePath, postData);
  return data;
};

const getOne = async (boatId: string): Promise<SailboatData> => {
  const { data } = await axiosInstance.get<SailboatData>(`${apiBasePath}/${boatId}`);
  return await validateResponse<SailboatData>(
    data,
    sailboatDataSchema,
    'We encountered a problem loading this boat for you. Please try again, or contact our support team if the problem persists'
  );
};

const updateOne = async (
  boatId: string,
  boatDetails: Partial<CreateSailboatArguments>
): Promise<BoatCreateResponseData> => {
  const patchData: APIBoatRequest<'update', Partial<CreateSailboatArguments>> = {
    type: 'update',
    boatType: BoatType.Sailboat,
    data: boatDetails,
  };

  const { data } = await axiosInstance.patch<BoatCreateResponseData>(
    `${apiBasePath}/${boatId}`, patchData
  );
  // TODO: Validate response
  return data;
};

export default {
  createSailboat,
  getOne,
  updateOne,
};
