import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../utils/custom-error';
import { DatabaseError } from 'pg';
import logger from '../utils/logger';

const handlePgError = (err: DatabaseError) => {
  logger.error('Database error occured');

  let message = 'Internal error occured';
  let statusCode = 500;

  if (err.code === '23505') {
    // unique constraint violation
    if (err.constraint === `users_username_unique`) {
      message = 'Username should be unique';
      statusCode = 400;
    } else if (err.constraint === `users_email_unique`) {
      message = 'Email should be unique';
      statusCode = 400;
    } else if (err.constraint === `authors_user_id_unique`) {
      message = 'You already have created an author account';
      statusCode = 409;
    }
  }

  return new CustomError(message, statusCode);
};

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof DatabaseError) {
    err = handlePgError(err);
  }

  if (err instanceof CustomError === false) {
    err.statusCode = 500;
    err.status = 'INTERNAL_ERROR';
    err.message = 'Internal error has occurred';
  }

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

export { errorHandler };
