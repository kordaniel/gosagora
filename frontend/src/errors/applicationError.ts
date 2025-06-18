type ApplicationErrorKind =
  | 'AuthError'
  | 'HttpError';

export abstract class ApplicationError extends Error {
  abstract readonly kind: ApplicationErrorKind;

  constructor() {
    super();
    Object.setPrototypeOf(this, ApplicationError.prototype);
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

export type ApplicationErrorType =
  | ApplicationError
  | AuthError
  | HttpError;
