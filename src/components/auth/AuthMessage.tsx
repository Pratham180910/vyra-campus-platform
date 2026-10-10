import React from 'react';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

interface AuthMessageProps {
  type: 'error' | 'success' | 'info';
  title?: string;
  message: string;
}

export const AuthMessage: React.FC<AuthMessageProps> = ({ type, title, message }) => {
  const getStyles = () => {
    switch (type) {
      case 'error':
        return {
          container: 'bg-rose-500/10 border-rose-500/30 text-rose-300',
          icon: <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />,
        };
      case 'success':
        return {
          container: 'bg-secondary/10 border-secondary/30 text-secondary shadow-glow-lime',
          icon: <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" />,
        };
      case 'info':
      default:
        return {
          container: 'bg-primary/10 border-primary/30 text-primary-light',
          icon: <Info className="w-4 h-4 text-primary shrink-0" />,
        };
    }
  };

  const style = getStyles();

  return (
    <div
      role="alert"
      className={`p-3.5 rounded-2xl border text-xs sm:text-sm flex items-start gap-2.5 animate-fade-in ${style.container}`}
    >
      <div className="pt-0.5">{style.icon}</div>
      <div className="space-y-0.5">
        {title && <p className="font-bold font-mono tracking-wide uppercase text-[11px]">{title}</p>}
        <p className="leading-relaxed">{message}</p>
      </div>
    </div>
  );
};
