import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../utils/custom-error';
import * as authorModel from './author.model';
import { Author } from './author.model';
import logger from '../utils/logger';
import { AuthenticatedRequest } from '../middleware/auth-middleware';
import { validationResult } from 'express-validator';

export const createAuthor = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let userId: number = req.user?.id as number;

  logger.info('Start creating the author');

  const newAuthor: Author = { ...req.body, user_id: userId };

  try {
    await authorModel.createAuthor(newAuthor);
    logger.info('Author created successfully');
    res.status(201).json({ message: 'Author created successfully' });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

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
