import express from 'express';
import * as AuthorController from './author.controller';
import { authMiddleware } from '../middleware/auth-middleware';
import { createAuthorValidator } from './validator/create-author.validator';
import { getAuthorValidator } from './validator/get-author-param.validator';

const authorRouter = express.Router();

authorRouter.get('/', AuthorController.getAllAuthors);
authorRouter.get('/:id', getAuthorValidator, AuthorController.getAuthorDetails);
authorRouter.post('/', authMiddleware, createAuthorValidator, AuthorController.createAuthor);

export default authorRouter;
