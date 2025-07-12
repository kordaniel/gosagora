type ApplicationErrorKind =
  | 'APIResponseError'
  | 'AuthError'
  | 'HttpError'
  | 'PermissionForbiddenError'
  | 'ServerConflictError';

export abstract class ApplicationError extends Error {
  abstract readonly kind: ApplicationErrorKind;

  constructor() {
    super();
    Object.setPrototypeOf(this, ApplicationError.prototype);
  }
}

export class APIResponseError extends ApplicationError {
  kind = 'APIResponseError' as const;
  constructor(
    public override message: string = 'An unexpected error occured. Please try again, or contact our support team if the issue persists',
  ) {
    super();
    Object.setPrototypeOf(this, APIResponseError.prototype);
  }
}

export class AuthError extends ApplicationError {
  kind = 'AuthError' as const;
  constructor(
    public override message: string = 'Please Sign In to perform this action',
  ) {
    super();
    Object.setPrototypeOf(this, AuthError.prototype);
  }
}

export class HttpError extends ApplicationError {
  kind = 'HttpError' as const;
  constructor(
    public override message: string,
  ) {
    super();
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

export class PermissionForbiddenError extends ApplicationError {
  kind = 'PermissionForbiddenError' as const;
  constructor(
    public override message: string = 'Sorry, you\'re not authorized to perform this action',
  ) {
    super();
    Object.setPrototypeOf(this, PermissionForbiddenError.prototype);
  }
}

export class ServerConflictError extends ApplicationError {
  kind = 'ServerConflictError' as const;
  constructor(
    public override message: string,
  ) {
    super();
    Object.setPrototypeOf(this, ServerConflictError.prototype);
  }
}

export type ApplicationErrorType =
  | ApplicationError
  | APIResponseError
  | AuthError
  | HttpError
  | PermissionForbiddenError
  | ServerConflictError;
