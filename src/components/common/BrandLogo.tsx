import React from 'react';
import { Link } from 'react-router-dom';

interface BrandLogoProps {
  className?: string;
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ 
  className = '', 
  size = 'md' 
}) => {
  const logoHeights = {
    sm: 'h-9 sm:h-10',
    md: 'h-11 sm:h-12',
    lg: 'h-16 sm:h-20'
  };

  return (
    <Link to="/" className={`inline-flex items-center gap-3 group ${className}`}>
      <img 
        src="/logo.png" 
        alt="TanovaX Logo" 
        className={`${logoHeights[size]} w-auto object-contain filter drop-shadow-[0_4px_16px_rgba(41,184,150,0.3)] transition-transform duration-300 group-hover:scale-105 rounded-lg`}
      />
    </Link>
  );
};
