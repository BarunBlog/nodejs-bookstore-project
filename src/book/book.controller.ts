import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth-middleware';
import { validationResult } from 'express-validator';
import * as bookModel from './book.model';
import * as authorModel from '../author/author.model';
import { Author } from '../author/author.model';
import { Book } from './book.model';
import logger from '../utils/logger';
import { CustomError } from '../utils/custom-error';

export const createBook = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, description, published_date } = req.body;
  const user_id = req.user?.id as number;

  let author: Author | null | undefined;

  // Query the database to get the author id by user_id -----------------------------------------------------
  try {
    author = await authorModel.getAuthorByUserId(user_id);
    if (!author) {
      logger.warn(`User id ${user_id} has no author account, Please create an author account first`);
      return next(new CustomError('Please create an author account first', 400));
    }
  } catch (err) {
    logger.error(err);
    next(new CustomError('Failed to create the book', 500));
  }

  logger.info('Start creating the Book');

  // Create the book for the author -------------------------------------------------------------------------
  try {
    const newBook: Book = { title, description, published_date, author_id: author?.id as number };

    await bookModel.createBook(newBook);
    logger.info('Book created successfully');

    res.status(201).json({ message: 'Book created successfully' });
  } catch (err) {
    logger.error('Failed to create the book', err);
    next(new CustomError('Failed to create the book', 500));
  }
};
