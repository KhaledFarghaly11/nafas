export type UserRole = 'customer' | 'chef';

export interface User {
  id: string;
  phone: string;
  role: UserRole;
  name: string;
  area?: string;
  kitchenId?: string;
  createdAt: string;
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
  error: { code: string } | null;
}
