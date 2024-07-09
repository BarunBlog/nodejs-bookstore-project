import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../auth/auth.model';
import logger from '../utils/logger';
import { CustomError } from '../utils/custom-error';
import { JwtPayload } from '../auth/interface/jwt-payload.interface';
import * as authModel from '../auth/auth.model';

export interface AuthenticatedRequest extends Request {
  // request user except the password
  user?: Omit<User, 'password'> | undefined;
}

const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  logger.info('Start authorizing the user');

  // Split the authorization header
  const accessToken = req.header('Authorization')?.replace('Bearer ', '');
  if (!accessToken) {
    logger.warn('User not authorized');
    return next(new CustomError('User not authorized', 401));
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET as string) as JwtPayload;

    // Query the database to get the user
    const user = await authModel.getUserByUsername(decoded.username);
    if (!user) {
      return next(new CustomError('Invalid token', 401));
    }

    const { password, ...userWithoutPassword } = user;
    req.user = userWithoutPassword;

    next();
  } catch (err) {
    return next(new CustomError('Authentication failed.', 500));
  }
};

export { authMiddleware };
