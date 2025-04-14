import type { ErrorRequestHandler, RequestHandler, Response } from 'express';
import { ApplicationError } from '../errors/applicationError';
import type { ApplicationErrorType } from '../errors/applicationError';
import logger from './logger';
import { assertNever, isNumber } from './typeguards';

const handleApplicationError = (err: ApplicationErrorType, res: Response) => {
  switch (err.kind) {
    case 'CorsError': {
      logger.info(err.toLogString());
      res.status(err.status).json(err.toJSONObj());
      break;
    }
    case 'TemporaryUnionFillerError': {
      logger.info('TEMP TEMP');
      logger.error(err.toLogString());
      break;
    }
    default: {
      assertNever(err);
      break;
    }
  }
};

const errorHandler: ErrorRequestHandler = (err: unknown, _req, res, next) => {
  if (err instanceof ApplicationError) {
    handleApplicationError(err, res);
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
