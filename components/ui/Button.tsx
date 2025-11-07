import React from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 disabled:pointer-events-none disabled:opacity-50',
          variant === 'default' &&
            'bg-green-600 text-white hover:bg-green-700 shadow-sm',
          variant === 'outline' &&
            'border border-gray-300 bg-white hover:bg-gray-50',
          variant === 'ghost' && 'hover:bg-gray-100',
          size === 'default' && 'h-11 px-6 py-2',
          size === 'sm' && 'h-9 px-4 text-sm',
          size === 'lg' && 'h-12 px-8 text-lg',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button }
