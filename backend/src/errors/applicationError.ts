type ApplicationErrorKind =
  | 'APIRequestError'
  | 'AuthError'
  | 'CorsError'
  | 'ServiceError';

interface IApplicationErrorJSON {
  status: number;
  error: object | {
    message: string;
    origin?: string | null;
  }
}

export abstract class ApplicationError extends Error {
  abstract readonly kind: ApplicationErrorKind;
  abstract readonly status: number;
  readonly origin?: string | undefined;

  constructor() {
    super();
    Object.setPrototypeOf(this, ApplicationError.prototype);
  };

  toJSONObj(): IApplicationErrorJSON {
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

export class APIRequestError extends ApplicationError {
  kind = 'APIRequestError' as const;
  constructor(
    public override message: string = 'Invalid request for target path',
    public status: number = 400,
    public readonly errorObj?: object,
  ) {
    super();
    Object.setPrototypeOf(this, APIRequestError.prototype);
  }

  override toJSONObj() {
    return !this.errorObj ? super.toJSONObj() : {
      ...super.toJSONObj(),
      error: this.errorObj,
    };
  }

  override toLogString() {
    return `${this.kind}: status ${this.status}. ${this.errorObj ? JSON.stringify(this.errorObj) : this.message}`;
  }
};

export class AuthError extends ApplicationError {
  kind = 'AuthError' as const;

  /**
   * @param status Default value 409 - Conflict. This response is sent when a request conflicts with the current state of the server.
   */
  constructor(
    public override message: string = 'Invalid authentication',
    public status: number = 409,
  ) {
    super();
    Object.setPrototypeOf(this, AuthError.prototype);
  }
};

export class ServiceError extends ApplicationError {
  kind = 'ServiceError' as const;

  constructor(
    public override message: string = 'GosaGora service internal error',
    public status: number = 500,
  ) {
    super();
    Object.setPrototypeOf(this, ServiceError.prototype);
  }
};

export type ApplicationErrorType =
  | ApplicationError
  | APIRequestError
  | AuthError
  | CorsError
  | ServiceError;
