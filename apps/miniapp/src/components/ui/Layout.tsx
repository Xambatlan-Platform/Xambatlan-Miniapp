import { ReactNode } from 'react';
import { clsx } from 'clsx';
import { PyramidIcon } from './Icons';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  showLogo?: boolean;
  className?: string;
  variant?: 'default' | 'centered' | 'marketplace';
}

export function Layout({
  children,
  title,
  subtitle,
  showLogo = true,
  className,
  variant = 'default',
}: LayoutProps) {
  const containerClasses = {
    default: 'min-h-screen bg-temple-gradient p-4',
    centered: 'min-h-screen bg-temple-gradient flex items-center justify-center p-4',
    marketplace: 'min-h-screen bg-gradient-to-br from-jade-50 via-teal-50 to-gold-50 p-4',
  };

  return (
    <div className={clsx(containerClasses[variant], className)}>
      <div className="max-w-md mx-auto w-full">
        {showLogo && (
          <header className="text-center mb-6 pt-4">
            <div className="flex items-center justify-center gap-3 mb-2">
              <PyramidIcon size="2xl" className="text-jade-700" />
              <h1 className="text-3xl font-pixel font-bold text-obsidian-900 uppercase tracking-wider">
                Xambatlán
              </h1>
            </div>
            {title && (
              <h2 className="text-xl font-pixel font-semibold text-jade-700 uppercase tracking-wide mb-1">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-base text-stone-600 font-medium">
                {subtitle}
              </p>
            )}
          </header>
        )}

        <main className="w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

interface SectionProps {
  children: ReactNode;
  title?: string;
  className?: string;
  variant?: 'default' | 'marketplace' | 'profile';
}

export function Section({
  children,
  title,
  className,
  variant = 'default',
}: SectionProps) {
  const sectionClasses = {
    default: 'mb-6',
    marketplace: 'mb-8',
    profile: 'mb-6',
  };

  return (
    <section className={clsx(sectionClasses[variant], className)}>
      {title && (
        <h3 className="text-lg font-pixel font-semibold text-obsidian-800 uppercase tracking-wide mb-4 flex items-center gap-2">
          {title}
        </h3>
      )}
      {children}
    </section>
  );
}

interface GridProps {
  children: ReactNode;
  cols?: 1 | 2 | 3;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Grid({
  children,
  cols = 1,
  gap = 'md',
  className,
}: GridProps) {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  };

  const gapClasses = {
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6',
  };

  return (
    <div className={clsx(
      'grid',
      gridClasses[cols],
      gapClasses[gap],
      className
    )}>
      {children}
    </div>
  );
}

interface StatusIndicatorProps {
  status: 'online' | 'offline' | 'busy' | 'verified';
  className?: string;
}

export function StatusIndicator({ status, className }: StatusIndicatorProps) {
  const statusClasses = {
    online: 'bg-success',
    offline: 'bg-stone-400',
    busy: 'bg-warning',
    verified: 'bg-jade-500',
  };

  return (
    <div
      className={clsx(
        'w-3 h-3 rounded-full',
        statusClasses[status],
        className
      )}
    />
  );
}

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'gold';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({
  children,
  variant = 'default',
  size = 'sm',
  className,
}: BadgeProps) {
  const variantClasses = {
    default: 'bg-jade-100 text-jade-800 border-jade-200',
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-gold-100 text-gold-800 border-gold-200',
    error: 'bg-coral-100 text-coral-800 border-coral-200',
    gold: 'bg-gold-200 text-gold-900 border-gold-300',
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center font-medium rounded-aztec border',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </span>
  );
}

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  variant?: 'default' | 'reputation';
}

export function ProgressBar({
  value,
  max = 100,
  className,
  variant = 'default',
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  const variantClasses = {
    default: 'bg-jade-500',
    reputation: 'bg-gradient-to-r from-gold-400 to-jade-500',
  };

  return (
    <div className={clsx(
      'w-full bg-jade-100 rounded-full h-2.5 border border-jade-200',
      className
    )}>
      <div
        className={clsx(
          'h-full rounded-full transition-all duration-300 ease-in-out',
          variantClasses[variant]
        )}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}