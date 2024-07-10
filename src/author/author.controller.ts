import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../utils/custom-error';
import * as authorModel from './author.model';
import { Author } from './author.model';
import logger from '../utils/logger';
import { AuthenticatedRequest } from '../middleware/auth-middleware';
import { validationResult } from 'express-validator';

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

export const getAuthorDetails = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  logger.info('Start getting the author details by id');

  try {
    const authorId = parseInt(req.params.id);

    const author = await authorModel.getAuthorById(authorId);
    if (!author) {
      logger.warn('Author not found with the given id');
      return next(new CustomError('Author not found', 404));
    }

    res.status(200).json(author);
  } catch (err) {
    next(new CustomError('Failed to retrieve author', 500));
  }
};

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

export const updateAuthor = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  logger.info('Start updating the author');

  const userId = req.user?.id;
  const authorId = parseInt(req.params.id);

  try {
    // Check if the author exists and belongs to the authenticated user -------------------------------------
    const existingAuthor = await authorModel.getAuthorById(authorId);
    if (!existingAuthor) {
      logger.warn('Author not found, please check author id again.');
      return next(new CustomError('Author not found', 404));
    }

    if (existingAuthor.user_id !== userId) {
      logger.warn('You are not authorized to update this author');
      return next(new CustomError('You are not authorized to update this author', 403));
    }

    // Update the author ------------------------------------------------------------------------------------
    const updatedAuthor = { ...existingAuthor, ...req.body };
    await authorModel.updateAuthor(authorId, updatedAuthor);
    res.status(200).json({ message: 'Author updated successfully' });
  } catch (err) {
    next(new CustomError('Failed to update author', 500));
  }
};

export const deleteAuthor = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  logger.info('Start deleting the author');

  const userId = req.user?.id;
  const authorId = parseInt(req.params.id);

  try {
    // Check if the author exists and belongs to the authenticated user -------------------------------------
    const existingAuthor = await authorModel.getAuthorById(authorId);
    if (!existingAuthor) {
      logger.warn('Author not found, please check author id again.');
      return next(new CustomError('Author not found', 404));
    }

    if (existingAuthor.user_id !== userId) {
      logger.warn('You are not authorized to delete this author');
      return next(new CustomError('You are not authorized to delete this author', 403));
    }

    // Delete the author ------------------------------------------------------------------------------------
    await authorModel.deleteAuthor(authorId);
    res.status(200).json({ message: 'Author deleted successfully' });
  } catch (err) {
    logger.error(err);
    next(new CustomError('Failed to delete the author', 500));
  }
};
