import { body, ValidationChain } from 'express-validator';

export const createAuthorValidator: ValidationChain[] = [
  body('name').isString().notEmpty().withMessage('Name is required'),
  body('bio').optional().isString(),
  body('birthdate').isISO8601().withMessage('Birthdate must be a valid date in the format YYYY-MM-DD'),
];
