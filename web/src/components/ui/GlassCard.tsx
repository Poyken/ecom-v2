"use client";

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps extends HTMLMotionProps<"div"> {
  variant?: 'default' | 'premium';
}

export const GlassCard = ({ children, className, variant = 'default', ...props }: GlassCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "rounded-[2.5rem] border overflow-hidden",
        variant === 'premium' 
          ? 'glass-card border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]' 
          : 'glass border-white/5',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};

