import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: { DEFAULT: '#FAF7F0', dark: '#F0EBE0' },
        pistachio: {
          DEFAULT: '#5B7B5A',
          light:   '#D4E8D3',
          dark:    '#3D5C3C',
        },
        fragola:  { DEFAULT: '#D95F6A', light: '#FADDE0' },
        nocciola: { DEFAULT: '#9C6B3C', light: '#F0E0CC' },
        muted: '#6B6560',
      },
      fontFamily: {
        sans: ['Satoshi', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-slide-up': 'fadeSlideUp 0.38s ease forwards',
        'pop-in':        'popIn 0.28s cubic-bezier(0.34,1.56,0.64,1) forwards',
        'fade-in':       'fadeIn 0.25s ease forwards',
      },
      keyframes: {
        fadeSlideUp: {
          '0%':   { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        popIn: {
          '0%':   { opacity: '0', transform: 'scale(0.92)' },
          '60%':  { transform: 'scale(1.03)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      boxShadow: {
        'card-hover': '0 12px 32px rgba(0,0,0,0.11)',
      },
    },
  },
  plugins: [],
} satisfies Config
