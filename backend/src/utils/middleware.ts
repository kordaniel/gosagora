import { ErrorRequestHandler, RequestHandler } from 'express';

import logger from './logger';
import { isNumber } from './typeguards';

const errorHandler: ErrorRequestHandler = (err: unknown, _req, res, next) => {
  if (err instanceof SyntaxError && 'body' in err && 'status' in err && isNumber(err.status)) {
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
