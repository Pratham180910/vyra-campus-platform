export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface FormErrors {
  [key: string]: string | undefined;
}

export type PasswordStrengthLevel = 'weak' | 'fair' | 'strong' | null;
