import axiosInstance from '../modules/axiosInstance';

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

  // TODO: Validate response
  const { data } = await axiosInstance.post<UserDetailsData>(
    `${apiBasePath}/signup`, postData
  );
  return data;
};

const signInUser = async (credentials: SignInArguments): Promise<UserDetailsData> => {
  const postData: APIAuthRequest<'login', SignInArguments> = {
    type: 'login',
    data: credentials,
  };

  // TODO: Validate response
  const { data } = await axiosInstance.post<UserDetailsData>(
    `${apiBasePath}/login`, postData
  );
  return data;
};

export default {
  signInUser,
  signUpUser,
};
