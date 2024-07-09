import express from 'express';
import * as AuthorController from './author.controller';
import { authMiddleware } from '../middleware/auth-middleware';
import { validateAuthor } from './validator/create-author.validator';

const authorRouter = express.Router();

authorRouter.post('/', authMiddleware, validateAuthor, AuthorController.createAuthor)
authorRouter.get('/', AuthorController.getAllAuthors);

export default authorRouter;
