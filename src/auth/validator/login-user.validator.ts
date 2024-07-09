import { body } from 'express-validator';

export const loginUserValidator = [
  body('username').isString().notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
];
