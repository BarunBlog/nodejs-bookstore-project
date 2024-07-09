import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../utils/custom-error';
import * as authorModel from './author.model';
import logger from '../utils/logger';

export const getAllAuthors = async (req: Request, res: Response, next: NextFunction) => {
  logger.info('Start getting all authors from the database');

  try {
    const authors = await authorModel.getAllAuthors();
    res.status(200).json(authors);
  } catch (err) {
    logger.error(err);
    next(new CustomError('Failed to retrieve authors', 500));
  }
};
