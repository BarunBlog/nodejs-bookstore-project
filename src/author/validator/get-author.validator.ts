import { param } from 'express-validator';

export const validateAuthorId = [
  param('id').isInt({ gt: 0 }).notEmpty().toInt().withMessage('author id is required').toInt(),
];
