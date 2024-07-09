import express from 'express';
import * as AuthorController from './author.controller';

const authorRouter = express.Router();

authorRouter.get('/', AuthorController.getAllAuthors);

export default authorRouter;
