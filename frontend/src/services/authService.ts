import axiosInstance from '../modules/axiosInstance';

import type {
  APIAuthRequest,
  SignInArguments,
  SignUpArguments
} from '@common/types/rest_api';
import type { GosaGoraUser } from '../types';

const apiBasePath = '/api/v1/auth';

const signUpUser = async (credentials: SignUpArguments) => {
  const postData: APIAuthRequest<'signup', SignUpArguments> = {
    type: 'signup',
    data: credentials,
  };

  const { data } = await axiosInstance.post<GosaGoraUser>(
    `${apiBasePath}/signup`, postData
  );
  return data;
};

const signInUser = async (credentials: SignInArguments) => {
  const postData: APIAuthRequest<'login', SignInArguments> = {
    type: 'login',
    data: credentials,
  };

  const { data } = await axiosInstance.post<GosaGoraUser>(
    `${apiBasePath}/login`, postData
  );
  return data;
};

export default {
  signInUser,
  signUpUser,
};
