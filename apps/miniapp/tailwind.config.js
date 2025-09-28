import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Jade-pastel primary palette
        jade: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#7EC9A3', // Primary pastel jade
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d', // Deeper jade
          800: '#166534',
          900: '#14532d',
        },
        // Teal accents
        teal: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488', // Medium teal
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        // Muted gold/coral accents
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b', // Muted gold
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        coral: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444', // Coral red
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        // High contrast greys
        stone: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c', // Medium grey for secondary buttons
          600: '#57534e',
          700: '#44403c',
          800: '#292524', // Dark text
          900: '#1c1917',
        },
        // Aztec-inspired colors
        obsidian: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a', // Deep obsidian black
        },
        // Status colors
        success: '#22c55e',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
      },
      fontFamily: {
        // Pixel/retro fonts for titles
        pixel: ['Orbitron', 'monospace'],
        // Clear sans-serif for body
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        // Accessibility-focused sizes (16px+ for body)
        'xs': ['12px', '16px'],
        'sm': ['14px', '20px'],
        'base': ['16px', '24px'], // Minimum body size
        'lg': ['18px', '28px'],   // Preferred body size
        'xl': ['20px', '28px'],
        '2xl': ['24px', '32px'],
        '3xl': ['30px', '36px'],
        '4xl': ['36px', '40px'],
        '5xl': ['48px', '52px'],
        '6xl': ['60px', '64px'],
      },
      spacing: {
        // Touch-friendly spacing
        '18': '4.5rem', // 72px
        '22': '5.5rem', // 88px
        '26': '6.5rem', // 104px
        '30': '7.5rem', // 120px
      },
      minHeight: {
        // 44px minimum touch target
        'touch': '44px',
        'touch-lg': '56px',
        'touch-xl': '72px',
      },
      borderRadius: {
        // Aztec-inspired geometric borders
        'aztec': '4px',
        'temple': '8px',
        'pyramid': '12px',
      },
      boxShadow: {
        // Pixel-art inspired shadows
        'pixel': '2px 2px 0px rgba(0, 0, 0, 0.2)',
        'pixel-lg': '4px 4px 0px rgba(0, 0, 0, 0.2)',
        'temple': '0 8px 16px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
      },
      backgroundImage: {
        // Gradient patterns inspired by Aztec textiles
        'jade-gradient': 'linear-gradient(135deg, #7EC9A3 0%, #14b8a6 100%)',
        'temple-gradient': 'linear-gradient(180deg, #f0fdf4 0%, #dcfce7 100%)',
        'obsidian-gradient': 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
};

export default config;