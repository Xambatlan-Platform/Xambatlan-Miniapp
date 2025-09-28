import { HTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'temple' | 'marketplace' | 'profile';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hoverable?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = 'default',
      padding = 'md',
      hoverable = false,
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses = [
      'relative bg-white rounded-temple border-2',
      'transition-all duration-200 ease-in-out',
      'shadow-temple',
    ];

    const variantClasses = {
      default: [
        'border-jade-200',
        hoverable && 'hover:border-jade-300 hover:shadow-xl',
      ],
      temple: [
        'border-jade-300 bg-temple-gradient',
        'shadow-pixel-lg',
        hoverable && 'hover:transform hover:scale-[1.02]',
      ],
      marketplace: [
        'border-teal-200',
        'hover:border-teal-300 hover:shadow-xl',
        'cursor-pointer',
      ],
      profile: [
        'border-gold-200 bg-gradient-to-br from-jade-50 to-gold-50',
        hoverable && 'hover:border-gold-300',
      ],
    };

    const paddingClasses = {
      none: '',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
      xl: 'p-8',
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