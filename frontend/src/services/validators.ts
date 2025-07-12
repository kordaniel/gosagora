import { Schema } from 'yup';

import { APIResponseError } from '../errors/applicationError';

export const validateResponse = async <T>(
  data: unknown,
  yupSchema: Schema<T>,
  errorMessage?: string,
): Promise<T> => {
  try {
    return await yupSchema.validate(data, { stripUnknown: true });
  } catch (error: unknown) {
    console.error('validating response:', error instanceof Error ? error.message : error);
    throw new APIResponseError(errorMessage);
  }
};
