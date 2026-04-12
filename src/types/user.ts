export type UserRole = 'customer' | 'chef';

export interface User {
  id: string;
  phone: string;
  role: UserRole;
  name: string;
}

export interface UserSession {
  userId: string | null;
  role: UserRole | null;
  phone: string | null;
  authenticatedAt: number | null;
}

export interface AuthResult {
  success: boolean;
  user: User | null;
  error: { code: string; message: string } | null;
}
