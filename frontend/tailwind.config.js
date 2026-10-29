/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0A0F1D',
        surface: '#111A2E',
        surface2: '#16223B',
        line: '#243252',
        mist: '#8B96AD',
        paper: '#EAF0FB',
        cyan: {
          DEFAULT: '#2DD4E8',
          soft: '#8FE9F2',
        },
        violet: {
          DEFAULT: '#8B7CF6',
          soft: '#C4BBFB',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(45,212,232,0.15), 0 8px 30px -8px rgba(45,212,232,0.25)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
};
