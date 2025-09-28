import { SVGProps } from 'react';
import { clsx } from 'clsx';

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'default' | 'pixel';
}

const iconSizes = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
  '2xl': 'w-12 h-12',
};

// Pyramid logo icon (Xambatlán logo)
export function PyramidIcon({ size = 'md', variant = 'pixel', className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={clsx(
        iconSizes[size],
        variant === 'pixel' && 'pixel-art',
        className
      )}
      {...props}
    >
      <path d="M12 2L2 20h20L12 2zm0 4l6 12H6l6-12z" />
      <rect x="10" y="14" width="4" height="2" />
      <rect x="9" y="16" width="6" height="2" />
    </svg>
  );
}

// Artisan/craftsperson icon
export function ArtisanIcon({ size = 'md', variant = 'pixel', className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={clsx(
        iconSizes[size],
        variant === 'pixel' && 'pixel-art',
        className
      )}
      {...props}
    >
      <rect x="3" y="19" width="18" height="2" />
      <path d="M8 2v2h8V2H8zm1 4h6l1 10H8l1-10z" />
      <rect x="10" y="8" width="4" height="1" />
      <rect x="9" y="10" width="6" height="1" />
    </svg>
  );
}

// Shield icon for trust/security
export function ShieldIcon({ size = 'md', variant = 'pixel', className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={clsx(
        iconSizes[size],
        variant === 'pixel' && 'pixel-art',
        className
      )}
      {...props}
    >
      <path d="M12 2L4 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-8-3z" />
      <path d="M10 12l2 2 4-4" stroke="white" strokeWidth="2" fill="none" />
    </svg>
  );
}

// Coin icon for payments
export function CoinIcon({ size = 'md', variant = 'pixel', className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={clsx(
        iconSizes[size],
        variant === 'pixel' && 'pixel-art',
        className
      )}
      {...props}
    >
      <circle cx="12" cy="12" r="9" />
      <rect x="9" y="8" width="6" height="1" fill="white" />
      <rect x="8" y="10" width="8" height="1" fill="white" />
      <rect x="8" y="12" width="8" height="1" fill="white" />
      <rect x="8" y="14" width="8" height="1" fill="white" />
      <rect x="9" y="16" width="6" height="1" fill="white" />
    </svg>
  );
}

// Star icon for ratings
export function StarIcon({ size = 'md', variant = 'pixel', className, filled = false, ...props }: IconProps & { filled?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth="2"
      className={clsx(
        iconSizes[size],
        variant === 'pixel' && 'pixel-art',
        className
      )}
      {...props}
    >
      <polygon points="12,2 15,8 22,8 17,13 19,20 12,16 5,20 7,13 2,8 9,8" />
    </svg>
  );
}

// Tools icon for services
export function ToolsIcon({ size = 'md', variant = 'pixel', className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={clsx(
        iconSizes[size],
        variant === 'pixel' && 'pixel-art',
        className
      )}
      {...props}
    >
      <rect x="2" y="6" width="20" height="2" />
      <rect x="6" y="2" width="2" height="6" />
      <rect x="16" y="2" width="2" height="6" />
      <rect x="3" y="12" width="18" height="2" />
      <rect x="5" y="16" width="14" height="2" />
      <rect x="7" y="20" width="10" height="2" />
    </svg>
  );
}

// Eye icon for reveal functionality
export function EyeIcon({ size = 'md', variant = 'pixel', className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={clsx(
        iconSizes[size],
        variant === 'pixel' && 'pixel-art',
        className
      )}
      {...props}
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

// Lock icon for security
export function LockIcon({ size = 'md', variant = 'pixel', className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={clsx(
        iconSizes[size],
        variant === 'pixel' && 'pixel-art',
        className
      )}
      {...props}
    >
      <rect x="5" y="10" width="14" height="10" rx="2" />
      <rect x="9" y="6" width="6" height="6" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="11" y="14" width="2" height="3" fill="white" />
    </svg>
  );
}

// User icon for profiles
export function UserIcon({ size = 'md', variant = 'pixel', className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={clsx(
        iconSizes[size],
        variant === 'pixel' && 'pixel-art',
        className
      )}
      {...props}
    >
      <circle cx="12" cy="8" r="5" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  );
}

// Badge icon for achievements
export function BadgeIcon({ size = 'md', variant = 'pixel', className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={clsx(
        iconSizes[size],
        variant === 'pixel' && 'pixel-art',
        className
      )}
      {...props}
    >
      <circle cx="12" cy="8" r="6" />
      <path d="M8 14l2 6 2-2 2 2 2-6" />
      <circle cx="12" cy="8" r="2" fill="white" />
    </svg>
  );
}

// Arrow icons for navigation
export function ArrowRightIcon({ size = 'md', variant = 'pixel', className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      className={clsx(
        iconSizes[size],
        variant === 'pixel' && 'pixel-art',
        className
      )}
      {...props}
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

export function ArrowLeftIcon({ size = 'md', variant = 'pixel', className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      className={clsx(
        iconSizes[size],
        variant === 'pixel' && 'pixel-art',
        className
      )}
      {...props}
    >
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}