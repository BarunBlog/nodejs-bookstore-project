import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth-middleware';
import { validationResult } from 'express-validator';
import * as bookModel from './book.model';
import * as authorModel from '../author/author.model';
import { Author } from '../author/author.model';
import { Book } from './book.model';
import logger from '../utils/logger';
import { CustomError } from '../utils/custom-error';
import { PaginationResponse } from '../utils/interface/pagination-response.interface';

export const getAllBooks = async (req: Request, res: Response, next: NextFunction) => {
  logger.info('Start getting all books from the database');

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = (page - 1) * limit;

  try {
    const { books, total } = await bookModel.getAllBooks(offset, limit);

    const response: PaginationResponse<Book> = {
      data: books,
      page: page,
      limit: limit,
      total: total as number,
      totalPages: Math.ceil((total as number) / limit),
    };

    res.status(200).json(response);
  } catch (err) {
    logger.error(err);
    next(new CustomError('Failed to retrieve books', 500));
  }
};

export const getBooksByAuthorId = async (req: Request, res: Response, next: NextFunction) => {
  const authorId = parseInt(req.params.id);

  logger.info(`Start getting books by the author id ${authorId}`);

  try {
    const books = await bookModel.getBooks({ author_id: authorId });
    res.status(200).json(books);
  } catch (error) {
    logger.error(error);
    next(new CustomError('Failed to retrieve books', 500));
  }
};

export const getBookDetails = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  logger.info('Start getting the book details by id');

  try {
    const bookId = parseInt(req.params.id);

    const book = await bookModel.getBookById(bookId);
    if (!book) {
      logger.warn('Book not found with the given id');
      return next(new CustomError('Book not found', 404));
    }

    res.status(200).json(book);
  } catch (err) {
    next(new CustomError('Failed to retrieve the book', 500));
  }
};

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

export const updateBook = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  logger.info('Start updating the book');

  const userId = req.user?.id;
  const bookId = parseInt(req.params.id);

  try {
    // Check if the book belongs to the authenticated user --------------------------------------------------
    const book = await bookModel.getBook({
      book_id: bookId,
      user_id: userId,
    });

    if (!book) {
      logger.warn('You are not the author of this book');
      return next(new CustomError('You are not the author of this book', 403));
    }

    // Update the book --------------------------------------------------------------------------------------
    const updateBook = { ...book, ...req.body };
    await bookModel.updateBook(bookId, updateBook);
    res.status(200).json({ message: 'Book updated successfully' });
  } catch (err) {
    logger.error(err);
    next(new CustomError('Failed to update the book', 500));
  }
};

export const deleteBook = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  logger.info('Start deleting the book');

  const userId = req.user?.id;
  const bookId = parseInt(req.params.id);

  try {
    // Check if the book belongs to the authenticated user --------------------------------------------------
    const book = await bookModel.getBook({
      book_id: bookId,
      user_id: userId,
    });

    if (!book) {
      logger.warn('You are not the author of this book');
      return next(new CustomError('You are not the author of this book', 403));
    }

    // Delete the Book --------------------------------------------------------------------------------------
    await bookModel.deleteBook(bookId);
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (err) {
    logger.error(err);
    next(new CustomError('Failed to delete the book', 500));
  }
};
