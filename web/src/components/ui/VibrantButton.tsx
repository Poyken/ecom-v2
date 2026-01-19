"use client";

import React from 'react';

interface VibrantButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'store' | 'admin' | 'super' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
}

export const VibrantButton = React.forwardRef<HTMLButtonElement, VibrantButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    
    const variants = {
      primary: "bg-primary text-white shadow-[0_0_20px_rgba(130,100,250,0.3)] hover:scale-[1.02]",
      store: "bg-accent-store text-black shadow-[0_0_20px_rgba(245,200,60,0.2)] hover:scale-[1.02]",
      admin: "bg-accent-admin text-black hover:scale-[1.02]",
      super: "bg-accent-super text-white shadow-[0_0_20px_rgba(180,100,250,0.3)] hover:scale-[1.02]",
      outline: "border border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-white"
    };

    const sizes = {
      sm: "px-4 py-2 text-xs",
      md: "px-6 py-3 text-sm",
      lg: "px-8 py-4 text-base",
      xl: "px-10 py-5 text-lg"
    };

    return (
      <button
        ref={ref}
        disabled={isLoading}
        className={`
          inline-flex items-center justify-center rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50
          ${variants[variant]}
          ${sizes[size]}
          ${className}
        `}
        {...props}
      >
        {isLoading ? (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    );
  }
);

VibrantButton.displayName = "VibrantButton";
