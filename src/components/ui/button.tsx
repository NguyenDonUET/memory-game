import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';

import { cn } from '@/lib/utils';

import type { ButtonHTMLAttributes } from 'react';

/**
 * Contrast notes (WCAG AA normal text ≥ 4.5:1):
 * - primary: blue-950 on orange-400 (~7:1) — white on orange fails
 * - soft (idle): blue-950 on blue-300 (~5.5:1) — white on blue-300 fails
 * - selected: white on blue-800 (~8.5:1)
 * - secondary: blue-950 on blue-100 (~10:1)
 */
const buttonVariants = cva(
  'inline-flex items-center justify-center font-bold leading-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-orange-400 text-blue-950 hover:bg-orange-300',
        secondary: 'bg-blue-100 text-blue-950 hover:bg-blue-350 hover:text-white',
        soft: 'bg-blue-300 text-blue-950 hover:bg-blue-350 hover:text-white',
        selected: 'bg-blue-800 text-white hover:bg-blue-950',
        ghost: 'bg-transparent text-blue-950',
      },
      size: {
        default: 'h-500 rounded-full px-300 text-preset-5',
        lg: 'h-600 rounded-full px-400 text-preset-4',
        option: 'h-600 flex-1 rounded-full text-preset-5',
        sm: 'h-400 rounded-full px-200 text-preset-5',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  ),
);
Button.displayName = 'Button';

export { buttonVariants };
