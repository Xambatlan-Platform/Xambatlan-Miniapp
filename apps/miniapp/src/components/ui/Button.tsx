import { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost' | 'outline' | 'tenochtitlan' | 'gold' | 'obsidian';
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  glow?: boolean; // Add mystical glow effect
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
      glow = false,
      ...props
    },
    ref
  ) => {
    const baseClasses = [
      // BOLD Aztec/Maya temple button styling
      'relative inline-flex items-center justify-center gap-3',
      'font-bold font-aztec uppercase tracking-widest text-center',
      'transition-all duration-300 ease-out transform-gpu',
      'focus:outline-none focus:ring-4 focus:ring-jade-400 focus:ring-offset-4',
      'disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none',
      'cursor-pointer select-none',
      // OVERSIZED touch targets for 18-55 accessibility
      'min-h-touch-lg w-full', // 56px minimum, full-width
      'active:scale-95 hover:scale-[1.02]',
      // BOLD pixel-art shadows
      'shadow-pixel-lg hover:shadow-pixel-xl',
      // Temple architecture borders
      'rounded-temple border-4',
      // Mystical glow when enabled
      glow && 'animate-pulse',
    ].filter(Boolean);

    const variantClasses = {
      // Deep jade - Primary temple stone
      primary: [
        'bg-jade-700 text-white border-jade-800',
        'hover:bg-jade-600 hover:border-jade-700 hover:shadow-jade-glow',
        'active:bg-jade-800',
      ],
      // Stone grey - Secondary temple material
      secondary: [
        'bg-stone-600 text-white border-stone-700',
        'hover:bg-stone-500 hover:border-stone-600',
        'active:bg-stone-700',
      ],
      // Coral red - Destructive ceremonial
      destructive: [
        'bg-coral-500 text-white border-coral-600',
        'hover:bg-coral-400 hover:border-coral-500',
        'active:bg-coral-600',
      ],
      // Tenochtitlán - Main temple variant
      tenochtitlan: [
        'bg-gradient-to-br from-teal-700 to-jade-800 text-white border-teal-800',
        'hover:from-teal-600 hover:to-jade-700 hover:border-teal-700 hover:shadow-tenochtitlan',
        'active:from-teal-800 active:to-jade-900',
      ],
      // Mayan gold - Precious temple accent
      gold: [
        'bg-gradient-to-br from-gold-500 to-gold-600 text-obsidian-900 border-gold-700',
        'hover:from-gold-400 hover:to-gold-500 hover:border-gold-600 hover:shadow-gold-glow',
        'active:from-gold-600 active:to-gold-700',
      ],
      // Obsidian - Volcanic glass power
      obsidian: [
        'bg-gradient-to-br from-obsidian-800 to-obsidian-900 text-white border-obsidian-700',
        'hover:from-obsidian-700 hover:to-obsidian-800 hover:border-obsidian-600 hover:shadow-obsidian',
        'active:from-obsidian-900 active:to-black',
      ],
      // Ghost - Transparent temple spirit
      ghost: [
        'bg-transparent text-jade-700 border-transparent',
        'hover:bg-jade-100 hover:border-jade-300',
        'active:bg-jade-200',
      ],
      // Outline - Temple border only
      outline: [
        'bg-transparent text-jade-700 border-jade-600',
        'hover:bg-jade-50 hover:border-jade-700',
        'active:bg-jade-100',
      ],
    };

    const sizeClasses = {
      // OVERSIZED temple button sizes for accessibility
      sm: 'px-4 py-3 text-base min-h-touch',         // 44px minimum - never smaller than WCAG
      md: 'px-6 py-4 text-lg min-h-touch-lg',        // 56px comfortable
      lg: 'px-8 py-5 text-xl min-h-touch-xl',        // 72px large
      xl: 'px-10 py-6 text-2xl min-h-touch-2xl',     // 88px extra large
      '2xl': 'px-12 py-7 text-3xl min-h-touch-3xl',  // 104px massive
      '3xl': 'px-16 py-8 text-4xl min-h-[120px]',    // 120px giant temple buttons
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
          <div className="animate-spin rounded-full h-6 w-6 border-3 border-current border-t-transparent" />
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0 text-2xl">{leftIcon}</span>}
            <span className="font-bold">{children}</span>
            {rightIcon && <span className="flex-shrink-0 text-2xl">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
export type { ButtonProps };