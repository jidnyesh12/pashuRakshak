import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'white';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', variant = 'primary', className = '' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  const variantClasses = {
    primary: 'border-gray-300 border-t-primary-600',
    white: 'border-white/30 border-t-white'
  };

  return (
    <div className={`animate-spin rounded-full border-2 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`} />
  );
};

export default LoadingSpinner;