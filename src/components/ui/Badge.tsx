import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'brand' | 'slate' | 'concept' | 'demo' | 'status';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'brand',
  className = ''
}) => {
  const variantStyles = {
    brand: 'bg-brand-500/10 text-brand-400 border-brand-500/30',
    slate: 'bg-slate-800/80 text-slate-300 border-slate-700/60',
    concept: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    demo: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    status: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border tracking-wide ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
