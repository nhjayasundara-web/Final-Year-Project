import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        hope: {
          rose:    '#C0395A',
          blush:   '#F2A7BF',
          cream:   '#FDF6F0',
          wine:    '#7B1C38',
          soft:    '#FDEEF4',
          muted:   '#8C6070',
          dark:    '#1A0A0F',
          teal:    '#2D6E6E',
          mint:    '#A8D8C8',
        }
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['"DM Sans"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'hope-gradient': 'linear-gradient(135deg, #FDF6F0 0%, #FDEEF4 50%, #F2A7BF22 100%)',
        'rose-gradient': 'linear-gradient(135deg, #C0395A 0%, #7B1C38 100%)',
        'card-shimmer': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
      },
      animation: {
        'fade-up':      'fadeUp 0.6s ease forwards',
        'fade-in':      'fadeIn 0.4s ease forwards',
        'pulse-rose':   'pulseRose 2s ease-in-out infinite',
        'shimmer':      'shimmer 2s infinite',
        'float':        'float 3s ease-in-out infinite',
        'ribbon-wave':  'ribbonWave 4s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulseRose: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(192,57,90,0.4)' },
          '50%':      { boxShadow: '0 0 0 12px rgba(192,57,90,0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        ribbonWave: {
          '0%, 100%': { transform: 'rotate(-3deg) scale(1)' },
          '50%':      { transform: 'rotate(3deg) scale(1.05)' },
        },
      },
      boxShadow: {
        'hope':    '0 4px 24px rgba(192,57,90,0.12)',
        'hope-lg': '0 8px 40px rgba(192,57,90,0.18)',
        'card':    '0 2px 16px rgba(26,10,15,0.08)',
        'card-hover': '0 8px 32px rgba(26,10,15,0.14)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
}

export default config
