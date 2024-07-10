import express from 'express';
import * as BookController from './book.controller';
import { authMiddleware } from '../middleware/auth-middleware';
import { createBookValidator } from './validator/create-book.validator';
import { bookParamValidator } from './validator/book-param.validator';
import { updateBookValidator } from './validator/update-author.validator';
import { authorParamValidator } from '../author/validator/author-param.validator';
import { paginationQueryParamValidator } from '../utils/validator/pagination-query-param.validator';

const bookRouter = express.Router();

bookRouter.get('/', paginationQueryParamValidator, BookController.getAllBooks);
bookRouter.get('/:id', bookParamValidator, BookController.getBookDetails);
bookRouter.post('/', authMiddleware, createBookValidator, BookController.createBook);
bookRouter.put('/:id', authMiddleware, bookParamValidator, updateBookValidator, BookController.updateBook);
bookRouter.delete('/:id', authMiddleware, bookParamValidator, BookController.deleteBook);

bookRouter.get('/author/:id', authorParamValidator, BookController.getBooksByAuthorId);

export default bookRouter;
