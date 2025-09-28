import { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses = [
      // Base styles - touch-friendly, accessible
      'relative inline-flex items-center justify-center gap-2',
      'font-medium font-pixel uppercase tracking-wide',
      'transition-all duration-200 ease-in-out',
      'focus:outline-none focus:ring-2 focus:ring-jade-300 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'touch-target', // Ensures minimum 44px height
      'active:transform active:scale-[0.98]',
      // Pixel-art shadow effect
      'shadow-pixel hover:shadow-pixel-lg',
      // Rounded corners with Aztec influence
      'rounded-aztec',
    ];

    const variantClasses = {
      primary: [
        'bg-jade-700 text-white border-2 border-jade-800',
        'hover:bg-jade-600 hover:border-jade-700',
        'active:bg-jade-800',
      ],
      secondary: [
        'bg-stone-500 text-white border-2 border-stone-600',
        'hover:bg-stone-400 hover:border-stone-500',
        'active:bg-stone-600',
      ],
      destructive: [
        'bg-coral-500 text-white border-2 border-coral-600',
        'hover:bg-coral-400 hover:border-coral-500',
        'active:bg-coral-600',
      ],
      ghost: [
        'bg-transparent text-jade-700 border-2 border-transparent',
        'hover:bg-jade-50 hover:border-jade-200',
        'active:bg-jade-100',
      ],
      outline: [
        'bg-transparent text-jade-700 border-2 border-jade-300',
        'hover:bg-jade-50 hover:border-jade-400',
        'active:bg-jade-100',
      ],
    };

    const sizeClasses = {
      sm: 'px-3 py-2 text-sm min-h-[36px]',
      md: 'px-4 py-3 text-base min-h-touch', // 44px minimum
      lg: 'px-6 py-4 text-lg min-h-touch-lg', // 56px
      xl: 'px-8 py-5 text-xl min-h-touch-xl', // 72px
    };

    return (
      <button
        ref={ref}
        className={clsx(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
export type { ButtonProps };