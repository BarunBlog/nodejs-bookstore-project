import express from 'express';
import * as AuthorController from './author.controller';
import { authMiddleware } from '../middleware/auth-middleware';
import { createAuthorValidator } from './validator/create-author.validator';
import { validateAuthorId } from './validator/get-author.validator';
import { updateAuthorValidator } from './validator/update-author.validator';

const authorRouter = express.Router();

authorRouter.get('/', AuthorController.getAllAuthors);
authorRouter.get('/:id', validateAuthorId, AuthorController.getAuthorDetails);
authorRouter.post('/', authMiddleware, createAuthorValidator, AuthorController.createAuthor);
authorRouter.put('/:id', authMiddleware, validateAuthorId, updateAuthorValidator, AuthorController.updateAuthor);

export default authorRouter;
