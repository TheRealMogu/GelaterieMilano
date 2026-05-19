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
    },
  },
  plugins: [],
} satisfies Config
