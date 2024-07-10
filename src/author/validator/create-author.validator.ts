import { body, ValidationChain } from 'express-validator';

export const createAuthorValidator: ValidationChain[] = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isString()
    .withMessage('Name must be a string')
    .isLength({ max: 255 })
    .withMessage('Name must not greater than 255 letters'),

  body('bio').optional().isString().withMessage('Bio must be a string'),

  body('birthdate')
    .notEmpty()
    .withMessage('Birthdate is required')
    .isISO8601()
    .withMessage('Birthdate must be a valid date in the format YYYY-MM-DD'),
];
