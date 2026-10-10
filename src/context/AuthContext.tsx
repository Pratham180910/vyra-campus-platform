import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { AuthContext, type AuthContextType } from './authContextDefinition';
import { authService, type AuthResponse } from '../services/authService';
import { registrationService } from '../services/registrationService';
import type { LoginFormData, RegisterFormData } from '../types/auth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Initial session retrieval
    authService
      .getSession()
      .then((activeSession) => {
        if (!mounted) return;
        setSession(activeSession);
        const currentUser = activeSession?.user ?? null;
        setUser(currentUser);
        registrationService.syncUserRegistrations(currentUser?.id ?? null);
        setLoading(false);
      })
      .catch(() => {
        if (!mounted) return;
        setLoading(false);
      });

    // Real-time auth state subscription
    const unsubscribe = authService.onAuthStateChange((_event, currentSession) => {
      if (!mounted) return;
      setSession(currentSession);
      const currentUser = currentSession?.user ?? null;
      setUser(currentUser);
      registrationService.syncUserRegistrations(currentUser?.id ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (data: LoginFormData): Promise<AuthResponse> => {
    const res = await authService.signIn(data);
    if (res.success && res.session) {
      setSession(res.session);
      setUser(res.session.user);
    }
    return res;
  }, []);

  const signUp = useCallback(async (data: RegisterFormData): Promise<AuthResponse> => {
    const res = await authService.signUp(data);
    if (res.success && res.session) {
      setSession(res.session);
      setUser(res.session.user);
    }
    return res;
  }, []);

  const signOut = useCallback(async (): Promise<void> => {
    const res = await authService.signOut();
    if (!res.success) {
      throw new Error(res.message || 'Failed to sign out from Supabase');
    }
    setSession(null);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextType>(() => {
    return {
      user,
      session,
      loading,
      isAuthenticated: Boolean(session && user),
      signIn,
      signUp,
      signOut,
    };
  }, [user, session, loading, signIn, signUp, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
