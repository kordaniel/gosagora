type ApplicationErrorKind =
  | 'HttpError'
  | 'TemporaryUnionFillerError';

export abstract class ApplicationError extends Error {
  abstract readonly kind: ApplicationErrorKind;

  constructor() {
    super();
    Object.setPrototypeOf(this, ApplicationError.prototype);
  };
};

export class HttpError extends ApplicationError {
  kind = 'HttpError' as const;
  constructor(
    public override message: string
  ) {
    super();
    Object.setPrototypeOf(this, HttpError.prototype);
  };
};

// TODO: Delete this temporary class that should never be used. It's defined
//       here only so we can use CorsError in a discriminated union before
//       adding additional Errors.
export class TemporaryUnionFillerError extends ApplicationError {
  kind = 'TemporaryUnionFillerError' as const;
  constructor(
    public override message: string = 'Internal server (developer) error. Should never be thrown',
  ) {
    super();
    Object.setPrototypeOf(this, TemporaryUnionFillerError.prototype);
  }
};

export type ApplicationErrorType =
  | ApplicationError
  | HttpError
  | TemporaryUnionFillerError;
