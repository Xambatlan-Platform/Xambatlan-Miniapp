import { HTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'temple' | 'marketplace' | 'profile' | 'tenochtitlan' | 'obsidian';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  hoverable?: boolean;
  glow?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = 'default',
      padding = 'md',
      hoverable = false,
      glow = false,
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses = [
      'relative rounded-none border-4',
      'transition-all duration-100 ease-linear',
      'shadow-pixel-authentic',
      // Enhanced pixel-perfect edges for authentic retro look
      'box-border pixel-art',
      // Glow effect when enabled
      glow && 'shadow-jade-glow',
      // High contrast text for readability
      'text-high-contrast',
    ].filter(Boolean);

    const variantClasses = {
      default: [
        'bg-white border-obsidian-900',
        'text-obsidian-900 text-high-contrast',
        hoverable && 'hover:border-obsidian-700 hover:shadow-pixel-authentic',
      ],
      temple: [
        'bg-gradient-to-br from-jade-50 via-jade-100 to-jade-200',
        'border-obsidian-900 text-obsidian-900 text-high-contrast',
        'shadow-pixel-authentic',
        hoverable && 'hover:transform hover:translate-x-1 hover:translate-y-1 hover:shadow-tenochtitlan',
      ],
      tenochtitlan: [
        'bg-gradient-to-br from-teal-100 via-jade-100 to-quetzal-100',
        'border-obsidian-900 text-obsidian-900 text-high-contrast',
        'shadow-pixel-authentic',
        hoverable && 'hover:shadow-jade-glow hover:translate-x-1 hover:translate-y-1',
      ],
      obsidian: [
        'bg-gradient-to-br from-obsidian-100 via-stone-100 to-jade-50',
        'border-obsidian-900 text-obsidian-900 text-high-contrast',
        'shadow-pixel-authentic',
        hoverable && 'hover:border-obsidian-700 hover:translate-x-1 hover:translate-y-1',
      ],
      marketplace: [
        'bg-gradient-to-br from-white via-jade-50 to-quetzal-50',
        'border-obsidian-900 text-obsidian-900 text-high-contrast',
        'hover:border-obsidian-700 hover:shadow-pixel-authentic',
        'cursor-pointer',
      ],
      profile: [
        'bg-gradient-to-br from-gold-50 via-jade-50 to-coral-50',
        'border-obsidian-900 text-obsidian-900 text-high-contrast',
        hoverable && 'hover:border-obsidian-700 hover:shadow-gold-glow hover:translate-x-1 hover:translate-y-1',
      ],
    };

    const paddingClasses = {
      none: '',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
      xl: 'p-8',
      '2xl': 'p-12',
    };

    return (
      <div
        ref={ref}
        className={clsx(
          baseClasses,
          variantClasses[variant],
          paddingClasses[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// Card composition components
const CardHeader = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & { withBorder?: boolean }
>(({ className, withBorder = false, ...props }, ref) => (
  <div
    ref={ref}
    className={clsx(
      'flex flex-col space-y-1.5',
      withBorder && 'border-b border-jade-200 pb-4 mb-4',
      className
    )}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement> & {
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    aztec?: boolean;
  }
>(({ className, as: Component = 'h3', aztec = false, ...props }, ref) => (
  <Component
    ref={ref}
    className={clsx(
      'text-lg font-semibold leading-none tracking-tight text-obsidian-800',
      aztec && 'font-pixel text-xl uppercase',
      className
    )}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={clsx('text-base text-stone-600 leading-relaxed', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={clsx('pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & { withBorder?: boolean }
>(({ className, withBorder = false, ...props }, ref) => (
  <div
    ref={ref}
    className={clsx(
      'flex items-center pt-4',
      withBorder && 'border-t border-jade-200 mt-4',
      className
    )}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
};
export type { CardProps };