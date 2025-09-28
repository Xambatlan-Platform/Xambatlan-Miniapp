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
        // BOLD Pastel-Jade Aztec/Maya Palette
        jade: {
          50: '#f0fdf7',    // Very light jade mist
          100: '#d9f7e8',   // Light jade
          200: '#b3efcf',   // Soft jade
          300: '#7EC9A3',   // PRIMARY: Pastel jade background
          400: '#52b37a',   // Medium jade
          500: '#2a9d5f',   // Strong jade
          600: '#1e7a4b',   // Deep jade for headers/buttons
          700: '#2F6D5D',   // DEEP jade/teal for primary elements
          800: '#1a4f3d',   // Very deep jade
          900: '#0f2b20',   // Darkest jade
        },
        // Tenochtitlán Teal - Deep waters of Lake Texcoco
        teal: {
          50: '#e8fffe',
          100: '#ccfffe',
          200: '#9efffe',
          300: '#5efafc',
          400: '#1ee8f0',
          500: '#06c7d1',
          600: '#0a9fa8',
          700: '#2F6D5D',   // Deep Tenochtitlán teal
          800: '#1a4f56',
          900: '#0d2b2f',
        },
        // Mayan Gold - Temple treasures
        gold: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#D8A547',   // MUTED gold for highlights
          600: '#b8860b',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
        // Coral Sunset - Aztec ceremonial red
        coral: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#F47E64',   // CORAL for action highlights
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        // Obsidian Stone - Deep volcanic glass
        obsidian: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',   // VERY DARK for high contrast text
          900: '#0f1419',   // Deepest obsidian black
        },
        // Limestone - Temple stone
        stone: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',   // Medium grey for secondary
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
        },
        // Cacao Brown - Sacred drink color
        cacao: {
          50: '#faf7f0',
          100: '#f4ede0',
          200: '#e8d5b7',
          300: '#dbb584',
          400: '#cd9747',
          500: '#b8782d',
          600: '#9a5f23',
          700: '#7f4a1e',
          800: '#6b3e1f',
          900: '#5a341e',
        },
        // Feathered Serpent - Quetzal blues and greens
        quetzal: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
        // Status colors with Aztec inspiration
        success: '#2a9d5f',    // Jade success
        warning: '#D8A547',    // Gold warning
        error: '#dc2626',      // Temple red error
        info: '#0891b2',       // Quetzal info
      },
      fontFamily: {
        // BOLD retro pixel fonts for Aztec/Maya aesthetic
        pixel: ['Orbitron', 'monospace'],           // XAMBATLÁN headers
        'aztec': ['Orbitron', 'Arial Black', 'sans-serif'], // Extra bold for impact
        // Large, clear fonts for accessibility (18-55 age group)
        sans: ['Inter', 'system-ui', 'sans-serif'], // 16-18px minimum body
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        // OVERSIZED, accessible typography for 18-55 users
        'xs': ['14px', '20px'],    // Minimum readable
        'sm': ['16px', '24px'],    // Small body text
        'base': ['18px', '28px'],  // PRIMARY body size (18px)
        'lg': ['20px', '32px'],    // Large body text
        'xl': ['24px', '36px'],    // Section headers
        '2xl': ['32px', '40px'],   // Page headers
        '3xl': ['40px', '48px'],   // Major titles
        '4xl': ['48px', '56px'],   // XAMBATLÁN logo
        '5xl': ['64px', '72px'],   // Hero titles
        '6xl': ['80px', '88px'],   // Massive display
        // Special pixel font sizes
        'pixel-sm': ['14px', '20px'],
        'pixel-base': ['16px', '24px'],
        'pixel-lg': ['20px', '28px'],
        'pixel-xl': ['24px', '32px'],
        'pixel-2xl': ['32px', '40px'],
        'pixel-3xl': ['40px', '48px'],
      },
      spacing: {
        // EXTRA touch-friendly spacing for large controls
        '15': '3.75rem',  // 60px
        '18': '4.5rem',   // 72px - minimum touch
        '22': '5.5rem',   // 88px - comfortable touch
        '26': '6.5rem',   // 104px - large touch
        '30': '7.5rem',   // 120px - extra large
        '34': '8.5rem',   // 136px
        '38': '9.5rem',   // 152px
        '42': '10.5rem',  // 168px
        '46': '11.5rem',  // 184px
        '50': '12.5rem',  // 200px
      },
      minHeight: {
        // OVERSIZED touch targets for accessibility
        'touch': '44px',      // Minimum WCAG
        'touch-lg': '56px',   // Comfortable
        'touch-xl': '72px',   // Large buttons
        'touch-2xl': '88px',  // Extra large
        'touch-3xl': '104px', // Massive action buttons
      },
      minWidth: {
        'touch': '44px',
        'touch-lg': '120px',
        'touch-xl': '160px',
        'touch-2xl': '200px',
      },
      borderRadius: {
        // Geometric Aztec/Maya temple architecture
        'aztec': '6px',        // Basic geometric
        'temple': '12px',      // Temple corners
        'pyramid': '16px',     // Pyramid steps
        'tenochtitlan': '20px', // Grand temple
        'obsidian': '2px',     // Sharp volcanic glass
      },
      boxShadow: {
        // BOLD pixel-art temple shadows
        'pixel': '3px 3px 0px rgba(15, 20, 25, 0.3)',        // Sharp pixel shadow
        'pixel-lg': '6px 6px 0px rgba(15, 20, 25, 0.3)',     // Large pixel shadow
        'pixel-xl': '8px 8px 0px rgba(15, 20, 25, 0.25)',    // Extra large
        'temple': '0 12px 24px rgba(47, 109, 93, 0.15), 0 4px 8px rgba(47, 109, 93, 0.1)',
        'tenochtitlan': '0 20px 40px rgba(47, 109, 93, 0.2), 0 8px 16px rgba(47, 109, 93, 0.15)',
        'obsidian': '0 6px 12px rgba(15, 20, 25, 0.4), 0 2px 4px rgba(15, 20, 25, 0.3)',
        'jade-glow': '0 0 20px rgba(126, 201, 163, 0.3)',
        'gold-glow': '0 0 16px rgba(216, 165, 71, 0.4)',
      },
      backgroundImage: {
        // BOLD Aztec/Maya temple gradients
        'jade-gradient': 'linear-gradient(135deg, #7EC9A3 0%, #2F6D5D 100%)',
        'temple-gradient': 'linear-gradient(180deg, #f0fdf7 0%, #d9f7e8 50%, #b3efcf 100%)',
        'tenochtitlan-gradient': 'linear-gradient(135deg, #2F6D5D 0%, #1a4f3d 50%, #0f2b20 100%)',
        'obsidian-gradient': 'linear-gradient(135deg, #1e293b 0%, #0f1419 100%)',
        'gold-gradient': 'linear-gradient(135deg, #D8A547 0%, #b8860b 100%)',
        'coral-gradient': 'linear-gradient(135deg, #F47E64 0%, #dc2626 100%)',
        'quetzal-gradient': 'linear-gradient(135deg, #67e8f9 0%, #0e7490 100%)',
        // Aztec pattern backgrounds
        'aztec-pattern': "url('data:image/svg+xml,%3Csvg width=\"40\" height=\"40\" viewBox=\"0 0 40 40\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M0 0h20v20H0V0zm20 20h20v20H20V20z\" fill=\"%23d9f7e8\" opacity=\"0.1\"%3E%3C/path%3E%3C/svg%3E')",
        'temple-stone': "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Crect width=\"60\" height=\"60\" fill=\"%23f0fdf7\"%3E%3C/rect%3E%3Cpath d=\"M0 30h60M30 0v60\" stroke=\"%23d9f7e8\" stroke-width=\"1\" opacity=\"0.3\"%3E%3C/path%3E%3C/svg%3E')",
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