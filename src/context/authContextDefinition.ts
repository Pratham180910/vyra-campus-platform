import { createContext } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import type { LoginFormData, RegisterFormData } from '../types/auth';
import type { AuthResponse } from '../services/authService';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (data: LoginFormData) => Promise<AuthResponse>;
  signUp: (data: RegisterFormData) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);
