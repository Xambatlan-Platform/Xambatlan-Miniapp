import { SVGProps } from 'react';
import { clsx } from 'clsx';

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  variant?: 'default' | 'pixel' | 'aztec' | 'temple';
}

// OVERSIZED icon sizes for accessibility (18-55 age group)
const iconSizes = {
  xs: 'w-4 h-4',      // 16px minimum
  sm: 'w-6 h-6',      // 24px small
  md: 'w-8 h-8',      // 32px default
  lg: 'w-10 h-10',    // 40px large
  xl: 'w-12 h-12',    // 48px extra large
  '2xl': 'w-16 h-16', // 64px massive
  '3xl': 'w-20 h-20', // 80px giant
  '4xl': 'w-24 h-24', // 96px colossal temple icons
};

// Tenochtitlán Temple - XAMBATLÁN logo (Authentic Aztec pyramid)
export function PyramidIcon({ size = 'md', variant = 'aztec', className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="currentColor"
      className={clsx(
        iconSizes[size],
        'drop-shadow-lg',
        className
      )}
      {...props}
    >
      {/* Temple base - largest tier */}
      <rect x="2" y="24" width="28" height="4" rx="1" />
      {/* Second tier */}
      <rect x="4" y="20" width="24" height="4" rx="1" />
      {/* Third tier */}
      <rect x="6" y="16" width="20" height="4" rx="1" />
      {/* Fourth tier */}
      <rect x="8" y="12" width="16" height="4" rx="1" />
      {/* Temple top */}
      <rect x="10" y="8" width="12" height="4" rx="1" />
      {/* Sacred chamber */}
      <rect x="12" y="4" width="8" height="4" rx="1" />
      {/* Temple crown */}
      <rect x="14" y="1" width="4" height="3" rx="1" />

      {/* Temple steps - central stairway */}
      <rect x="15" y="6" width="2" height="18" className="opacity-20" />

      {/* Sacred fire altar */}
      <circle cx="16" cy="3" r="1" className="opacity-80" />
    </svg>
  );
}

// Aztec Artisan - Skilled craftsperson with feathered headdress
export function ArtisanIcon({ size = 'md', variant = 'aztec', className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="currentColor"
      className={clsx(
        iconSizes[size],
        'drop-shadow-lg',
        className
      )}
      {...props}
    >
      {/* Feathered headdress - quetzal feathers */}
      <rect x="8" y="2" width="16" height="6" rx="3" className="opacity-90" />
      <rect x="6" y="4" width="4" height="8" rx="2" className="opacity-70" />
      <rect x="22" y="4" width="4" height="8" rx="2" className="opacity-70" />
      <rect x="4" y="6" width="3" height="6" rx="1" className="opacity-50" />
      <rect x="25" y="6" width="3" height="6" rx="1" className="opacity-50" />

      {/* Face and head */}
      <rect x="10" y="8" width="12" height="8" rx="2" />

      {/* Eyes */}
      <rect x="12" y="10" width="2" height="2" rx="1" fill="white" />
      <rect x="18" y="10" width="2" height="2" rx="1" fill="white" />

      {/* Nose ornament - jade plug */}
      <rect x="15" y="12" width="2" height="1" rx="0.5" className="opacity-80" />

      {/* Body - tunic */}
      <rect x="8" y="16" width="16" height="12" rx="2" />

      {/* Arms with tools */}
      <rect x="4" y="18" width="6" height="4" rx="2" />
      <rect x="22" y="18" width="6" height="4" rx="2" />

      {/* Craft tools */}
      <rect x="2" y="20" width="8" height="1" rx="0.5" className="opacity-90" />
      <rect x="22" y="20" width="8" height="1" rx="0.5" className="opacity-90" />

      {/* Jade ornaments */}
      <circle cx="16" cy="14" r="1" className="opacity-60" />
    </svg>
  );
}

// Obsidian Shield - Aztec warrior protection with divine symbols
export function ShieldIcon({ size = 'md', variant = 'aztec', className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="currentColor"
      className={clsx(
        iconSizes[size],
        'drop-shadow-lg',
        className
      )}
      {...props}
    >
      {/* Shield outline - obsidian war shield */}
      <path d="M16 2L6 6v8c0 6 4.5 12 10 14 5.5-2 10-8 10-14V6L16 2z" />

      {/* Eagle warrior symbol - center */}
      <circle cx="16" cy="12" r="6" fill="white" className="opacity-90" />

      {/* Eagle head design */}
      <rect x="14" y="8" width="4" height="3" rx="1" fill="currentColor" />
      <rect x="13" y="9" width="2" height="1" fill="currentColor" />
      <rect x="17" y="9" width="2" height="1" fill="currentColor" />

      {/* Eagle beak */}
      <polygon points="16,11 15,13 17,13" fill="currentColor" />

      {/* Feather patterns */}
      <rect x="12" y="14" width="8" height="1" fill="currentColor" className="opacity-60" />
      <rect x="13" y="15" width="6" height="1" fill="currentColor" className="opacity-60" />
      <rect x="14" y="16" width="4" height="1" fill="currentColor" className="opacity-60" />

      {/* Divine protection runes */}
      <circle cx="10" cy="8" r="1" fill="white" className="opacity-70" />
      <circle cx="22" cy="8" r="1" fill="white" className="opacity-70" />
      <circle cx="10" cy="16" r="1" fill="white" className="opacity-70" />
      <circle cx="22" cy="16" r="1" fill="white" className="opacity-70" />
    </svg>
  );
}

// Quetzal Coin - Sacred feathered serpent currency
export function CoinIcon({ size = 'md', variant = 'aztec', className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="currentColor"
      className={clsx(
        iconSizes[size],
        'drop-shadow-lg',
        className
      )}
      {...props}
    >
      {/* Coin base */}
      <circle cx="16" cy="16" r="14" />

      {/* Inner sacred circle */}
      <circle cx="16" cy="16" r="10" fill="white" className="opacity-90" />

      {/* Quetzalcoatl serpent head */}
      <circle cx="16" cy="12" r="4" fill="currentColor" />

      {/* Serpent eyes */}
      <circle cx="14" cy="11" r="1" fill="white" />
      <circle cx="18" cy="11" r="1" fill="white" />

      {/* Feathered crown */}
      <rect x="14" y="8" width="4" height="2" rx="1" fill="currentColor" className="opacity-80" />

      {/* Serpent body - coiled */}
      <path d="M16 16 Q20 18 18 22 Q14 24 12 20 Q8 18 10 14 Q14 12 16 16"
            fill="currentColor" className="opacity-60" strokeWidth="1" />

      {/* Sacred dots - four directions */}
      <circle cx="10" cy="10" r="1" fill="currentColor" className="opacity-50" />
      <circle cx="22" cy="10" r="1" fill="currentColor" className="opacity-50" />
      <circle cx="10" cy="22" r="1" fill="currentColor" className="opacity-50" />
      <circle cx="22" cy="22" r="1" fill="currentColor" className="opacity-50" />
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