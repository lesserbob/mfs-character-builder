export interface AuthUser {
  id: number;
  username: string;
  type?: string; // e.g., 'GM', 'Player', etc.
}
