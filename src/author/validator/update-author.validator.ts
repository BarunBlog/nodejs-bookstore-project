import { body } from 'express-validator';

export const updateAuthorValidator = [
  body('name').optional().isString().withMessage('Name must be a string'),
  body('bio').optional().isString().withMessage('Bio must be a string'),
  body('birthdate').optional().isDate().withMessage('Birthdate must be a valid date in the format YYYY-MM-DD'),
];
