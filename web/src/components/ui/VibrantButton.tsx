"use client";

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface VibrantButtonProps extends Omit<HTMLMotionProps<"button">, 'ref' | 'children'> {
  variant?: 'primary' | 'store' | 'admin' | 'super' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  children?: React.ReactNode;
}


export const VibrantButton = React.forwardRef<HTMLButtonElement, VibrantButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    
    const variants = {
      primary: "bg-primary text-white shadow-[0_0_20px_rgba(130,100,250,0.3)]",
      store: "bg-accent-store text-black shadow-[0_0_20px_rgba(245,200,60,0.2)]",
      admin: "bg-accent-admin text-black shadow-[0_0_20px_rgba(16,185,129,0.1)]",
      super: "bg-accent-super text-white shadow-[0_0_20px_rgba(180,100,250,0.3)]",
      outline: "border border-white/10 hover:bg-white/5 text-zinc-400 hover:text-white"
    };

    const sizes = {
      sm: "px-4 py-2 text-[10px]",
      md: "px-6 py-3 text-xs",
      lg: "px-8 py-4 text-sm",
      xl: "px-10 py-5 text-base"
    };

    return (
      <motion.button
        ref={ref}
        disabled={isLoading}
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "relative inline-flex items-center justify-center rounded-2xl font-black uppercase tracking-[0.2em] transition-colors disabled:opacity-50 overflow-hidden group",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {/* Subtle Shine Effect */}
        <div className="absolute inset-0 bg-linear-to-tr from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

        
        {isLoading ? (
          <div className="mr-3 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent shadow-inner" />
        ) : null}
        <span className="relative z-10">{children}</span>
      </motion.button>
    );
  }
);

VibrantButton.displayName = "VibrantButton";

