'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useModal } from '@/contexts/ModalContext';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

const baseStyles = 'font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-md hover:shadow-lg';
const variantStyles = {
  primary: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
  secondary: 'bg-gray-900 hover:bg-gray-800 text-white focus:ring-gray-500',
  outline: 'border-2 border-green-600 text-green-600 hover:bg-green-50 focus:ring-green-500',
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
  const router = useRouter();

  return (
    <button
      onClick={() => router.push('/forms/adoption-application')}
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

