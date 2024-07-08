import { NextFunction, Request, Response } from 'express';
import * as authModel from './auth.model';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import logger from '../utils/logger';
import { User } from './auth.model';
import { CustomError } from '../utils/custom-error';

export const registerUser = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password } = req.body;

  // Encrypt the password
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser: User = { username, email, password: hashedPassword };

  logger.info('Start creating the user');

  try {
    // Create the user into the database --------------------------------------------------------------------
    await authModel.createUser(newUser);

    logger.info(`User ${username} created successfully`);

    res.status(201).json({ message: 'User created successfully' });
  } catch (error: any) {
    logger.error('Failed to create the user');
    next(error);
  }
};
