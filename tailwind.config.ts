import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        slate: {
          950: '#0a0f1e',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #6366f1, #a855f7, #ec4899)',
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;