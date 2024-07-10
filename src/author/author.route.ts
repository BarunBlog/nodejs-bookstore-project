import express from 'express';
import * as AuthorController from './author.controller';
import * as BookController from '../book/book.controller';
import { authMiddleware } from '../middleware/auth-middleware';
import { createAuthorValidator } from './validator/create-author.validator';
import { updateAuthorValidator } from './validator/update-author.validator';
import { authorParamValidator } from './validator/author-param.validator';

const authorRouter = express.Router();

authorRouter.get('/', AuthorController.getAllAuthors);
authorRouter.get('/:id', authorParamValidator, AuthorController.getAuthorDetails);
authorRouter.post('/', authMiddleware, createAuthorValidator, AuthorController.createAuthor);
authorRouter.put('/:id', authMiddleware, authorParamValidator, updateAuthorValidator, AuthorController.updateAuthor);
authorRouter.delete('/:id', authMiddleware, authorParamValidator, AuthorController.deleteAuthor);

authorRouter.get('/:id/books', authorParamValidator, BookController.getBooksByAuthorId);

export default authorRouter;
