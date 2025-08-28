import {
  boatCreateResponseDataSchema,
  sailboatDataSchema
} from '../schemas/boat';
import axiosInstance from '../modules/axiosInstance';
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

  const { data } = await axiosInstance.post<BoatCreateResponseData>(apiBasePath, postData);

  return await validateResponse<BoatCreateResponseData>(
    data,
    boatCreateResponseDataSchema,
    'We encountered a problem creating the boat for you. Please try again, or contact our support team if the problem persists'
  );
};

const deleteOneUserSailboats = async (boatId: string, userId: string): Promise<void> => {
  await axiosInstance.delete(`${apiBasePath}/${boatId}/users/${userId}`);
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

  return validateResponse<BoatCreateResponseData>(
    data,
    boatCreateResponseDataSchema,
    'We encountered a problem updating this boat for you. Please try again, or contact our support team if the problem persists'
  );
};

export default {
  createSailboat,
  deleteOneUserSailboats,
  getOne,
  updateOne,
};
