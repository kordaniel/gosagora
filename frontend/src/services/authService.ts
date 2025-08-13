import axiosInstance from '../modules/axiosInstance';
import { userDetailsDataSchema } from '../schemas/user';
import { validateResponse } from './validators';

import type {
  APIAuthRequest,
  SignInArguments,
  SignUpArguments,
  UserDetailsData,
} from '@common/types/rest_api';

const apiBasePath = '/api/v1/auth';

const signUpUser = async (credentials: SignUpArguments): Promise<UserDetailsData> => {
  const postData: APIAuthRequest<'signup', SignUpArguments> = {
    type: 'signup',
    data: credentials,
  };

  const { data } = await axiosInstance.post<UserDetailsData>(
    `${apiBasePath}/signup`, postData
  );
  return await validateResponse<UserDetailsData>(
    data,
    userDetailsDataSchema,
    'We encountered a problem while creating an account for you. Please try again, or contact our support team if the problem persists'
  );
};

const signInUser = async (credentials: SignInArguments): Promise<UserDetailsData> => {
  const postData: APIAuthRequest<'login', SignInArguments> = {
    type: 'login',
    data: credentials,
  };

  const { data } = await axiosInstance.post<UserDetailsData>(
    `${apiBasePath}/login`, postData
  );
  return await validateResponse<UserDetailsData>(
    data,
    userDetailsDataSchema,
    'We encountered a problem signing you in. Please try again, or contact our support team if the problem persists'
  );
};

export default {
  signInUser,
  signUpUser,
};
