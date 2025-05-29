import type {
  ErrorRequestHandler,
  NextFunction,
  RequestHandler,
  Response,
} from 'express';
import {
  BaseError as SequelizeBaseError,
  DatabaseError as SequelizeDatabaseError,
  ValidationError as SequelizeValidationError,
} from 'sequelize';
import { FirebaseAuthError } from 'firebase-admin/auth';
import { ZodError } from 'zod';

import {
  APIRequestError,
  ApplicationError,
  type ApplicationErrorType,
  AuthError,
} from '../errors/applicationError';
import { assertNever, isNumber } from './typeguards';
import logger from './logger';
import { snakeToCamelCase } from './helpers';

import authService from '../services/authService';
import userService from 'src/services/userService';

import type { RequestUserExtended } from 'src/types';


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
  switch (err.code) {
    case 'auth/argument-error': {
      // Thrown when firebase.verifyIdToken() fails.
      // Firebase ID token has incorrect "aud" (audience) claim.
      // Make sure the ID token comes from the same Firebase project as the service account
      // used to authenticate this SDK. See https://firebase.google.com/docs/auth/admin/verify-id-tokens
      // for details on how to retrieve an ID token.
      res.status(401).json(new AuthError().toJSONObj());
      break;
    }
    case 'auth/email-already-exists': {
      res.status(409).json(new APIRequestError(err.code, 409, err.toJSON()).toJSONObj());
      break;
    }
    //case 'auth/id-token-expired': {
    //  break;
    //}
    //case 'auth/invalid-email': {
    //  break;
    //}
    //case 'auth/invalid-id-token': {
    //  // The provided ID token is not a valid Firebase ID token.
    //  break;
    //}
    //case 'auth/invalid-password': {
    //  // The provided value for the password user property is invalid. It must be a string with at least six characters.
    //  break;
    //}
    //case 'auth/phone-number-already-exists': {
    //  // The provided phoneNumber is already in use by an existing user. Each user must have a unique phoneNumber.
    //  break;
    //}
    //case 'auth/user-not-found': {
    //  // There is no existing user record corresponding to the provided identifier.
    //  break;
    //}
    default: {
      logger.error('unhandled FirebaseAuthError, code:', err.code);
      logger.error('name:', err.name, '. Message:', err.message);
      res.status(418).send(err.toJSON()); // TODO: Setup proper error handling
      break;
    }
  }
};

const handleSequelizeError = (err: SequelizeBaseError, res: Response) => {
  if (err instanceof SequelizeValidationError) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(409).json({
        status: 409,
        error: {
          code: err.name, // "SequelizeValidationError"
          message: `${err.errors.map(({ path, value }) => `${path ? snakeToCamelCase(path) : path}: "${value}"`).join(', ')} is already in use by another account`,
        },
      });
    } else {
      logger.error(`unhandled SequelizeValidationError, name: ${err. name}. message: ${err.message}`);
      res.status(418).json({
        status: 418,
        error: {
          code: err.name,
          message: err.message,
          body: err.errors.map(e => e.message).join(', '),
        },
      });
    }
  } else if (err instanceof SequelizeDatabaseError) {
    // TODO: Implement proper error handling, responses
    if (err.name === 'SequelizeForeignKeyConstraintError') {
      // race.user_id not a valid user.id
    }
    logger.error('Sequelize database error:', err.message);
    logger.error('Sequelize database error, name:', err.name);
    logger.error('Sequelize database error, parameters:', err.parameters);
    logger.error('Sequelize database error, original:', err.original);
    logger.error('Sequelize database error, parent:', err.parent);
    logger.error('Sequelize database error, sql:', err.sql);
    res.status(500).json({
      status: 500,
      error: {
        message: 'Something went wrong, contact lazy developer',
      }
    });
  } else {
    logger.error(`unhandled SequelizeBaseError, name: ${err. name}. message: ${err.message}`);
    res.status(400).json({
      status: 400,
      error: {
        code: err.name,
        message: err.message,
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
    // JSON parsing failed
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

const userExtractor = async (
  req: RequestUserExtended<unknown, unknown, unknown>,
  _res: Response,
  next: NextFunction
) => {
  // TODO: finish userExtractor logic
  const authorization = req.get('authorization');

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new Error('ACCESS DENIED'); // TODO
  }

  const fbIdToken = authorization.slice(7);

  try {
    const decodedIdToken = await authService.verifyIdToken(fbIdToken);
    const user =  await userService.getUserBy({ firebaseUid: decodedIdToken.uid });

    console.log('decodedIdToken:', decodedIdToken);
    console.log('user:', user?.toJSON());
    if (user) {
      req.user = user;
      next();
    }
  } catch (error: unknown) {
    let errorMsg = 'Token ERROR';
    if (error instanceof Error) {
      errorMsg += `: ${error.message}`;
    }

    console.error('token error:', errorMsg);
    throw new Error(errorMsg);
  }
};

export default {
  errorHandler,
  unknownEndpoint,
  userExtractor,
};
