import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'premium';
}

export const GlassCard = ({ children, className = "", variant = 'default' }: GlassCardProps) => {
  return (
    <div className={`
      rounded-[2.5rem] border transition-all duration-500
      ${variant === 'premium' 
        ? 'glass-card border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]' 
        : 'glass border-zinc-800/50'}
      ${className}
    `}>
      {children}
    </div>
  );
};
