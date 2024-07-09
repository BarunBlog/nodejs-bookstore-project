import jwt from 'jsonwebtoken';
import { JwtPayload } from '../auth/interface/jwt-payload.interface';
import { TokenPayload } from '../auth/interface/token-payload.interface';

export const generateToken = (jwtPayload: JwtPayload): TokenPayload => {
  const token = jwt.sign(jwtPayload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRATION,
  });

  const tokenPayload: TokenPayload = {
    tokenType: 'Bearer',
    accessToken: token,
  };

  return tokenPayload;
};
