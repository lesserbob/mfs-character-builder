import { Request } from 'express';

export interface AuthUser {
  id: number;
  username: string;
  type?: string; // e.g., 'GM', 'Player', etc.
}

export interface AuthenticatedRequest extends Request {
  user: AuthUser;
}
