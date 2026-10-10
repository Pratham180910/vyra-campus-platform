import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

interface PasswordFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  autoComplete?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  rightAction?: React.ReactNode;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  onBlur,
  placeholder = 'Enter password',
  autoComplete = 'current-password',
  error,
  disabled = false,
  required = false,
  rightAction,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-1.5 w-full">
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="block text-xs font-mono uppercase tracking-wider text-text-secondary"
        >
          {label} {required && <span className="text-secondary">*</span>}
        </label>
        {rightAction}
      </div>

      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted group-focus-within:text-primary transition-colors">
          <Lock className="w-4 h-4" />
        </div>

        <input
          id={id}
          name={name}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`w-full pl-10 pr-11 py-3 bg-[#08090D]/80 border rounded-2xl text-sm text-white placeholder-text-muted transition-all duration-200 outline-none ${
            error
              ? 'border-rose-500/80 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30'
              : 'border-white/10 hover:border-white/20 focus:border-primary focus:ring-1 focus:ring-primary/40 focus:bg-[#0D0F17]'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        />

        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          disabled={disabled}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-text-muted hover:text-white transition-colors focus:outline-none focus-visible:text-secondary"
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4" aria-hidden="true" />
          ) : (
            <Eye className="w-4 h-4" aria-hidden="true" />
          )}
        </button>
      </div>

      {error && (
        <p id={`${id}-error`} className="text-xs text-rose-400 font-sans pl-1 flex items-center gap-1 animate-fade-in">
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};
