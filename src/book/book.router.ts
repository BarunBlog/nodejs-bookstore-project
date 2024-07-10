import express from 'express';
import * as BookController from './book.controller';
import { authMiddleware } from '../middleware/auth-middleware';
import { createBookValidator } from './validator/create-book.validator';
import { bookParamValidator } from './validator/book-param.validator';

const bookRouter = express.Router();

bookRouter.get('/', BookController.getAllBooks);
bookRouter.get('/:id', bookParamValidator, BookController.getBookDetails);
bookRouter.post('/', authMiddleware, createBookValidator, BookController.createBook);

export default bookRouter;
