import { body, ValidationChain } from 'express-validator';

export const createBookValidator: ValidationChain[] = [
  body('title')
    .notEmpty()
    .withMessage('title field is required')
    .isString()
    .withMessage('title must be a string')
    .isLength({ max: 255 })
    .withMessage('title must not greater than 255 letters'),

  body('description').optional().isString().withMessage('description must be a string'),

  body('published_date')
    .notEmpty()
    .withMessage('published_date is required')
    .isISO8601()
    .withMessage('published_date must be a valid date in the format YYYY-MM-DD'),
];
