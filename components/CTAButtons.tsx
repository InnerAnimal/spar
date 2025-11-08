'use client';

import React from 'react';
import { useModal } from '@/contexts/ModalContext';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

const baseStyles = 'font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
const variantStyles = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
  secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500',
  outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 focus:ring-blue-500',
};
const sizeStyles = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

export function TNRRequestButton({ 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className = '' 
}: ButtonProps) {
  const { openModal } = useModal();

  return (
    <button
      onClick={() => openModal('tnr-request')}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      Request TNR Service
    </button>
  );
}

export function AdoptionButton({ 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className = '',
  children
}: ButtonProps & { children?: React.ReactNode }) {
  const { openModal } = useModal();

  return (
    <button
      onClick={() => openModal('adoption')}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {children || 'Apply to Adopt'}
    </button>
  );
}

export function DonationButton({ 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className = '' 
}: ButtonProps) {
  const { openModal } = useModal();

  return (
    <button
      onClick={() => openModal('donation')}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      Donate Now
    </button>
  );
}

