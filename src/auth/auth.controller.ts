import { NextFunction, Request, Response } from 'express';
import * as authModel from './auth.model';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import logger from '../utils/logger';
import { User } from './auth.model';
import { CustomError } from '../utils/custom-error';
import { JwtPayload } from './interface/jwt-payload.interface';
import { v4 as uuidv4 } from 'uuid';
import { generateToken } from '../utils/token';

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
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

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  logger.info('Start getting the user by username from the database');

  let user: User | undefined;

  try {
    // Get the user by username -----------------------------------------------------------------------------
    user = await authModel.getUserByUsername(username);
  } catch (err) {
    logger.error(err);
    next(new CustomError('Authenctication failed', 500));
  }

  if (!user) {
    logger.warn('User not found with the given credentials');
    return next(new CustomError('Invalid credentials', 401));
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    logger.warn('Wrong username or password');
    return next(new CustomError('Invalid credentials', 401));
  }

  // Generate the JWT Token ---------------------------------------------------------------------------------
  const payload: JwtPayload = {
    jti: uuidv4(),
    username: user.username,
  };

  const tokenPayload = generateToken(payload);

  logger.info(`User ${username} logged in successfully`);

  res.status(200).json(tokenPayload);
};
