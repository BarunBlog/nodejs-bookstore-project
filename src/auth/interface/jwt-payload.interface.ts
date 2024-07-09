/**
 * This interface is used to define the structure of the JWT payload.
 */
export interface JwtPayload {
  jti: string;
  username: string;
  role?: string;
  permissions?: string[];
}
