/**
 * This interface is used to define the structure of the JWT auth token payload.
 */

export interface TokenPayload {
  tokenType: string;
  accessToken: string;
}
