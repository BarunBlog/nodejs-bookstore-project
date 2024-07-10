import express from 'express';
import * as BookController from './book.controller';
import { authMiddleware } from '../middleware/auth-middleware';
import { createBookValidator } from './validator/create-book.validator';

const bookRouter = express.Router();

bookRouter.post('/', authMiddleware, createBookValidator, BookController.createBook);

export default bookRouter;
