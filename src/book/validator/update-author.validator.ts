import { body } from 'express-validator';

export const updateBookValidator = [
  body('title').optional().isString().withMessage('title must be a string'),
  body('description').optional().isString().withMessage('description must be a string'),
  body('published_at').optional().isDate().withMessage('published_at must be a valid date in the format YYYY-MM-DD'),
];
