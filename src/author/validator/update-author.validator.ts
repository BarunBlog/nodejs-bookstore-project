import { body, param } from 'express-validator';

export const validateAuthorId = [
  param('id')
    .isInt({ gt: 0 })
    .withMessage('author id must be an integer')
    .notEmpty()
    .withMessage('author id is required')
    .toInt(),
];

export const updateAuthorValidator = [
  body('name').optional().isString().withMessage('Name must be a string'),
  body('bio').optional().isString().withMessage('Bio must be a string'),
  body('birthdate').optional().isDate().withMessage('Birthdate must be a valid date in the format YYYY-MM-DD'),
];
