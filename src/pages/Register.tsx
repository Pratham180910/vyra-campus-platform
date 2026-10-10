import React, { useEffect } from 'react';
import { AuthShell } from '../components/auth/AuthShell';
import { RegisterForm } from '../components/auth/RegisterForm';

export const Register: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = 'Create Account — VYRA | Your Campus. Your Moments.';
  }, []);

  return (
    <AuthShell>
      <RegisterForm />
    </AuthShell>
  );
};

export default Register;
