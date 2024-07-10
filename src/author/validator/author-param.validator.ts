import { param } from 'express-validator';

export const authorParamValidator = [
  param('id')
    .isInt({ gt: 0 })
    .withMessage('author id must be a positive integer')
    .notEmpty()
    .withMessage('author id is required'),
];
