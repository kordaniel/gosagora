type ApplicationErrorKind =
  | 'CorsError'
  | 'TemporaryUnionFillerError';

export abstract class ApplicationError extends Error {
  abstract readonly kind: ApplicationErrorKind;
  abstract readonly status: number;
  readonly origin?: string | undefined;

  constructor() {
    super();
    Object.setPrototypeOf(this, ApplicationError.prototype);
  };

  toJSONObj() {
    return {
      status: this.status,
      error: {
        message: this.message,
      },
    };
  }

  toLogString() {
    return `${this.kind}: status ${this.status}. ${this.message}`;
  }
};

export class CorsError extends ApplicationError {
  kind = 'CorsError' as const;
  constructor(
    public override message: string = 'Request from unknown origin has been blocked by CORS policy',
    public status: number = 403,
    public override origin?: string,
  ) {
    super();
    Object.setPrototypeOf(this, CorsError.prototype);
  }

  override toJSONObj() {
    const baseJson = super.toJSONObj();
    return {
      ...baseJson,
      error: {
        ...baseJson.error,
        origin: this.origin || null,
      },
    };
  }

  override toLogString() {
    return `${super.toLogString()}. Origin: '${this.origin || 'unknown'}'`;
  }
};

// TODO: Delete this temporary class that should never be used. It's defined
//       here only so we can use CorsError in a discriminated union before
//       adding additional Errors.
export class TemporaryUnionFillerError extends ApplicationError {
  kind = 'TemporaryUnionFillerError' as const;
  constructor(
    public override message: string = 'Internal server (developer) error. Should never be thrown',
    public status: number = 500,
  ) {
    super();
    Object.setPrototypeOf(this, TemporaryUnionFillerError.prototype);
  }
};

export type ApplicationErrorType =
  | ApplicationError
  | CorsError
  | TemporaryUnionFillerError;
