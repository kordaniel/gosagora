import type { ErrorRequestHandler, RequestHandler, Response } from 'express';
import { ZodError } from 'zod';
import { FirebaseAuthError } from 'firebase-admin/auth';
import {
  BaseError as SequelizeBaseError,
  ValidationError as SequelizeValidationError
} from 'sequelize';

import logger from './logger';
import { ApplicationError, type ApplicationErrorType } from '../errors/applicationError';
import { assertNever, isNumber } from './typeguards';


const handleApplicationError = (err: ApplicationErrorType, res: Response) => {
  switch (err.kind) {
    case 'APIRequestError': {
      res.status(err.status).json(err.toJSONObj());
      break;
    }
    case 'AuthError': {
      res.status(err.status).json(err.toJSONObj());
      break;
    }
    case 'CorsError': {
      logger.info(err.toLogString());
      res.status(err.status).json(err.toJSONObj());
      break;
    }
    case 'ServiceError': {
      logger.info(err.toLogString());
      res.status(err.status).json(err.toJSONObj());
      break;
    }
    default: {
      assertNever(err);
      break;
    }
  }
};

const handleFirebaseAuthError = (err: FirebaseAuthError, res: Response) => {
  logger.info('FirebaseAuthError:', err.message);
  logger.error('TODO: Implement error handling for FirebaseAuthError');
  res.status(418).send(err.toJSON()); // TODO: Setup proper error handling
  return;
  switch (err.code) {
    case 'auth/email-already-exists': {
      break;
    }
    case 'auth/id-token-expired': {
      break;
    }
    case 'auth/invalid-email': {
      break;
    }
    case 'auth/invalid-id-token': {
      // The provided ID token is not a valid Firebase ID token.
      break;
    }
    case 'auth/invalid-password': {
      // The provided value for the password user property is invalid. It must be a string with at least six characters.
      break;
    }
    case 'auth/phone-number-already-exists': {
      // The provided phoneNumber is already in use by an existing user. Each user must have a unique phoneNumber.
      break;
    }
    case 'auth/user-not-found': {
      // There is no existing user record corresponding to the provided identifier.
      break;
    }
    default: {
      break;
    }
  }
};

const handleSequelizeError = (err: SequelizeBaseError, res: Response) => {
  if (err instanceof SequelizeValidationError) {
    res.status(400).json({
      status: 400,
      error: {
        message: err.name, // "SequelizeValidationError"
        body: err.errors.map(e => e.message).join(', '),
      },
    });
  } else {
    logger.error(`unhandled sequelize error, name: ${err. name} -`, err.message);
    res.status(400).json({
      status: 400,
      error: {
        message: err.name,
        body: err.message,
      },
    });
  }
};

const errorHandler: ErrorRequestHandler = (err: unknown, _req, res, next) => {
  if (err instanceof ApplicationError) {
    handleApplicationError(err, res);
  } else if (err instanceof ZodError) {
    res.status(400).json({
      status: 400,
      error: err.format(),
    });
  } else if (err instanceof FirebaseAuthError) {
    // https://firebase.google.com/docs/reference/admin/error-handling
    handleFirebaseAuthError(err, res);
  } else if (err instanceof SequelizeBaseError) {
    handleSequelizeError(err, res);
  } else if (err instanceof SyntaxError && 'body' in err && 'status' in err && isNumber(err.status)) {
    //JSON parsing failed
    res.status(err.status).json({
      status: err.status,
      error: {
        message: err.message,
        body: err.body,
      },
    });
  } else {
    logger.error('unhandled error:', err);
    next(err);
  }
};

const unknownEndpoint: RequestHandler = (req, res) => {
  res.status(404).json({
    status: 404,
    error: {
      message: 'unknown endpoint',
      path: req.url,
    },
  });
};

export default {
  errorHandler,
  unknownEndpoint,
};
