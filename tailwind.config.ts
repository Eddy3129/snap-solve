import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}'
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        // Cyberpunk color palette
        neonPink: '#ff007f',
        neonBlue: '#00ffff',
        neonGreen: '#39ff14',
        neonPurple: '#9d00ff',
        darkBg: '#0d0d0d',
        darkFg: '#e6e6e6',

        // Override default colors with cyberpunk theme
        border: '#222222',
        input: '#333333',
        ring: '#ff007f',
        background: '#0d0d0d',
        foreground: '#e6e6e6',
        primary: {
          DEFAULT: '#ff007f',
          foreground: '#0d0d0d'
        },
        secondary: {
          DEFAULT: '#00ffff',
          foreground: '#0d0d0d'
        },
        destructive: {
          DEFAULT: '#ff3131',
          foreground: '#0d0d0d'
        },
        muted: {
          DEFAULT: '#333333',
          foreground: '#e6e6e6'
        },
        accent: {
          DEFAULT: '#9d00ff',
          foreground: '#0d0d0d'
        },
        popover: {
          DEFAULT: '#1a1a1a',
          foreground: '#e6e6e6'
        },
        card: {
          DEFAULT: '#1a1a1a',
          foreground: '#e6e6e6'
        }
      },
      fontFamily: {
        // Add a cyberpunk font
        cyberpunk: ['"Orbitron"', 'sans-serif']
      },
      borderRadius: {
        lg: '12px',
        md: '10px',
        sm: '8px'
      },
      boxShadow: {
        // Neon glow effect
        neon: '0 0 10px rgba(255, 0, 127, 0.7)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        }
      },
    }
  },
  plugins: [require('tailwindcss-animate')]
} satisfies Config;
