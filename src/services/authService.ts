import { supabase, isSupabaseConfigured, assertSupabaseConfigured } from '../lib/supabase';
import type { LoginFormData, RegisterFormData, UserProfile } from '../types/auth';
import type { Session, User, AuthChangeEvent } from '@supabase/supabase-js';

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: UserProfile;
  session?: Session | null;
  requiresEmailVerification?: boolean;
}

export const authService = {
  /**
   * Real Supabase email/password sign in
   */
  async signIn(data: LoginFormData): Promise<AuthResponse> {
    if (!isSupabaseConfigured) {
      return {
        success: false,
        message: 'Supabase is not configured. Please supply VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.',
      };
    }

    try {
      assertSupabaseConfigured();
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email.trim(),
        password: data.password,
      });

      if (error) {
        return {
          success: false,
          message: error.message || 'Invalid email or password.',
        };
      }

      const user = authData.user;
      return {
        success: true,
        session: authData.session,
        user: user
          ? {
              id: user.id,
              email: user.email || '',
              name: (user.user_metadata?.full_name as string) || (user.user_metadata?.fullName as string) || '',
              role: (user.user_metadata?.role as string) || 'student',
            }
          : undefined,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Authentication failed. Please check network connection.';
      return {
        success: false,
        message,
      };
    }
  },

  /**
   * Alias for backward compatibility with LoginForm
   */
  async login(data: LoginFormData): Promise<AuthResponse> {
    return this.signIn(data);
  },

  /**
   * Real Supabase email/password sign up with automatic profile metadata
   */
  async signUp(data: RegisterFormData): Promise<AuthResponse> {
    if (!isSupabaseConfigured) {
      return {
        success: false,
        message: 'Supabase is not configured. Please supply VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.',
      };
    }

    try {
      assertSupabaseConfigured();
      const fullName = data.fullName.trim();
      const email = data.email.trim();

      const { data: authData, error } = await supabase.auth.signUp({
        email,
        password: data.password,
        options: {
          data: {
            full_name: fullName,
            fullName,
            role: 'student',
          },
        },
      });

      if (error) {
        return {
          success: false,
          message: error.message || 'Unable to create account.',
        };
      }

      const user = authData.user;
      const session = authData.session;
      const requiresEmailVerification = Boolean(user && !session);

      // Opportunistically upsert profile in public.profiles table (safe alongside DB trigger)
      if (user) {
        try {
          await supabase.from('profiles').upsert(
            {
              id: user.id,
              full_name: fullName,
              email,
              avatar_style: 'neon-violet',
              role: 'student',
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'id' }
          );
        } catch {
          // If RLS prevents immediate unconfirmed client write or DB trigger handles it, proceed safely
        }
      }

      return {
        success: true,
        session,
        requiresEmailVerification,
        message: requiresEmailVerification
          ? 'Registration successful! Please check your email to verify your account.'
          : 'Account created successfully.',
        user: user
          ? {
              id: user.id,
              email: user.email || '',
              name: fullName,
              role: 'student',
            }
          : undefined,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      return {
        success: false,
        message,
      };
    }
  },

  /**
   * Alias for backward compatibility with RegisterForm
   */
  async register(data: RegisterFormData): Promise<AuthResponse> {
    return this.signUp(data);
  },

  /**
   * Invalidate current user session
   */
  async signOut(): Promise<{ success: boolean; message?: string }> {
    if (!isSupabaseConfigured) {
      return { success: true };
    }

    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        return { success: false, message: error.message };
      }
      return { success: true };
    } catch (err: unknown) {
      return {
        success: false,
        message: err instanceof Error ? err.message : 'Sign out error',
      };
    }
  },

  /**
   * Real Supabase password reset
   */
  async requestPasswordReset(email: string): Promise<AuthResponse> {
    if (!isSupabaseConfigured) {
      return {
        success: false,
        message: 'Supabase is not configured. Please supply VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.',
      };
    }

    try {
      assertSupabaseConfigured();
      const redirectUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/login`
        : undefined;

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: redirectUrl,
      });

      if (error) {
        return {
          success: false,
          message: error.message || 'Unable to request password recovery.',
        };
      }

      return {
        success: true,
        message: 'Password recovery instructions sent to your email.',
      };
    } catch (err: unknown) {
      return {
        success: false,
        message: err instanceof Error ? err.message : 'Unable to request password reset.',
      };
    }
  },

  /**
   * Get active Supabase session
   */
  async getSession(): Promise<Session | null> {
    if (!isSupabaseConfigured) return null;
    try {
      const { data } = await supabase.auth.getSession();
      return data.session;
    } catch {
      return null;
    }
  },

  /**
   * Get current Supabase Auth user
   */
  async getCurrentUser(): Promise<User | null> {
    if (!isSupabaseConfigured) return null;
    try {
      const { data } = await supabase.auth.getUser();
      return data.user;
    } catch {
      return null;
    }
  },

  /**
   * Subscribe to real Supabase auth state changes
   */
  onAuthStateChange(
    callback: (event: AuthChangeEvent, session: Session | null) => void
  ): () => void {
    if (!isSupabaseConfigured) {
      return () => {};
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });

    return () => {
      subscription.unsubscribe();
    };
  },
};
