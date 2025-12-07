'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-full font-bold transition-all duration-200 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-[#F5C94C] text-[#1a1a1a] border-[2.5px] border-[#1a1a1a] hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#1a1a1a]',
        secondary: 'bg-white text-[#1a1a1a] border-[2.5px] border-[#1a1a1a] hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#1a1a1a]',
        outline: 'border-[2.5px] border-[#1a1a1a] bg-transparent hover:bg-gray-50 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#1a1a1a]',
        ghost: 'hover:bg-gray-100',
        destructive: 'bg-red-500 text-white border-[2.5px] border-[#1a1a1a] hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#1a1a1a]',
        success: 'bg-green-500 text-white border-[2.5px] border-[#1a1a1a] hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#1a1a1a]',
      },
      size: {
        sm: 'h-9 px-4 text-sm',
        md: 'h-11 px-6 text-sm',
        lg: 'h-12 px-8 text-base',
        xl: 'h-14 px-10 text-lg',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={buttonVariants({ variant, size, className })}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
