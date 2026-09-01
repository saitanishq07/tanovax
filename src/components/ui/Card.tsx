import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  activeBorder?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverEffect = true,
  activeBorder = false,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`bg-dark-card/90 rounded-2xl border ${
        activeBorder ? 'border-brand-500/40 bg-dark-card' : 'border-slate-800/80'
      } ${
        hoverEffect
          ? 'hover:border-brand-500/40 hover:shadow-xl hover:shadow-brand-950/20 transition-all duration-300'
          : ''
      } p-6 relative overflow-hidden backdrop-blur-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
