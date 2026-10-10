import React, { useEffect } from 'react';
import { AuthShell } from '../components/auth/AuthShell';
import { LoginForm } from '../components/auth/LoginForm';

export const Login: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = 'Sign In — VYRA | Your Campus. Your Moments.';
  }, []);

  return (
    <AuthShell>
      <LoginForm />
    </AuthShell>
  );
};

export default Login;
