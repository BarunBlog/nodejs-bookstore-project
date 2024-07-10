import { param } from 'express-validator';

export const bookParamValidator = [
  param('id')
    .isInt({ gt: 0 })
    .withMessage('book id must be a positive integer')
    .notEmpty()
    .withMessage('book id is required'),
];
