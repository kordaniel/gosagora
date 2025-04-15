import axios, { AxiosError } from 'axios';
import type {
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios';

import appConfig from '../utils/config';
import { HttpError } from '../errors/applicationError';

// https://axios-http.com/docs/intro
// https://github.com/axios/axios
// https://dev.to/mdmostafizurrahaman/handle-axios-error-in-typescript-4mf9
// https://dev.to/mperon/axios-error-handling-like-a-boss-333d

declare module 'axios' {
  export interface AxiosRequestConfig {
    skipInterceptors?: boolean;
    silent?: boolean; // if true => mute notifications
  }
};

const axiosConfig: AxiosRequestConfig = {
  allowAbsoluteUrls: false,
  baseURL: appConfig.BACKEND_BASE_URL,
  timeout: 15 * 1000,
  withCredentials: false,
  silent: appConfig.IS_PRODUCTION_ENV,
};

const axiosInstance: AxiosInstance = axios.create(axiosConfig);

const onRequest = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  // TODO:
  //  - Set Headers Here
  //  - Check Authentication Here
  //  - Set Loading Start Here
  if (config.skipInterceptors) {
    return config;
  }

  const { method, url } = config;

  if (!config.silent) {
    console.log(`[API] ${method?.toLocaleUpperCase()} ${url} | Request`);
  }

  if (!appConfig.IS_PRODUCTION_ENV && method === 'get') {
    config.timeout = 1000;
  }

  return config;
};

/**
 * Any status code that lie within the range of 2xx cause this function to trigger
 */
const onResponse = (response: AxiosResponse): AxiosResponse => {
  if (response.config.skipInterceptors) {
    return response;
  }

  const { method, silent, url } = response.config;
  const { status, headers } = response;

  if (!silent) {
    console.log([
      `[API] ${method?.toLocaleUpperCase()} ${url}`,
      `Response ${status}\n`,
      `Headers: ${JSON.stringify(headers)}`
    ].join(' | '));
  }

  return response;
};

/**
 * Any status codes that falls outside the range of 2xx cause this function to trigger
 */
const onErrorResponse = (error: AxiosError | Error): Promise<AxiosError> => {
  if (!axios.isAxiosError(error) || error.config?.skipInterceptors) {
    if (appConfig.IS_DEVELOPMENT_ENV) {
      console.log(`[API] | Error: ${error.message}`);
    }
    return Promise.reject(error);
  }

  const { message } = error;
  const { silent, method, url } = error.config as InternalAxiosRequestConfig;

  if (!silent) {
    console.log([
      `[API] ${method?.toUpperCase()} ${url}`,
      `Error: status: ${error.response?.status} - ${message}\n`,
      `Headers: ${JSON.stringify(error.response?.headers)}`,
    ].join(' | '));
  }

  if (error.code) {
    switch (error.code) {
      case 'ECONNABORTED':     // Request timed out due to exceeding timeout specified in axios configuration.
      // eslint-disable-next-line no-fallthrough
      case 'ETIMEDOUT':        // Request timed out due to exceeding default axios timelimit.
        throw new HttpError(`No internet. Please check your connection and try again!`);
      case 'ERR_NETWORK':      // Network-related issue. (including cors, backend not responding)
        throw new HttpError(`We encountered a ${message} while processing your request. Please try again in a moment!`);
/*    Ignore for now, keep as reference
      case 'ERR_BAD_RESPONSE': // Response cannot be parsed properly or is in an unexpected format.
        break;
      case 'ERR_BAD_REQUEST':  // Requested has unexpected format or missing required parameters.
        break;
      case 'ERR_CANCELED':     // Feature or method is canceled explicitly by the user.
        break;
      case 'ERR_NOT_SUPPORT':  // Feature or method not supported in the current axios environment.
        break;
      case 'ERR_INVALID_URL':  // Invalid URL provided for axios request.
        break;
      default:
        break;
*/
    }
  }
  if (error.response)
  {
    // The request was made and the server responded with a status code that falls out of the range of 2xx
    // NOTE: error.response is of type AxiosResponse
    switch (error.response.status) {
      /*
      case 401: {
        // "Login required"
        // Delete token & Go To Login Page if required.
        break;
      }
      case 403: {
        // "Permission denied"
        // Delete token & Go To Login Page if required.
        break;
      }
      */
      case 404: {
        // TODO: Relay backend error 404 message to UI.
        throw new HttpError('Sorry, we couldn\'t find what you were looking for. Please try again');
      }
      /*
      case 500: {
        // "Server error"
        break;
      }
      */
      default: {
        // "Unknown error occurred"
        break;
      }
    }
  }
  else if (error.request)
  {
    // The request was made but no response was received `error.request` is an instance of
    // XMLHttpRequest in the browser and an instance of http.ClientRequest in node.js
    if (!silent) {
      console.log(`[API] Request error: ${error.request}`);
    }
  }
  else
  {
    // Something happened in setting up the request that triggered an Error
    if (!silent) {
      console.log('[API] Unknown Error');
    }
  }

  return Promise.reject(error);
};

axiosInstance.interceptors.request.use(onRequest, onErrorResponse, { synchronous: true });
axiosInstance.interceptors.response.use(onResponse, onErrorResponse);

export default axiosInstance;
