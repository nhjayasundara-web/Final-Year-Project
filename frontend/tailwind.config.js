/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        hope: {
          cream: '#fff8f2',
          blush: '#ffe8ef',
          rose: '#d84d7d',
          wine: '#8f2946',
          berry: '#5d1832',
          sage: '#6b8f71'
        }
      },
      boxShadow: {
        soft: '0 20px 70px rgba(143, 41, 70, 0.14)'
      },
      fontFamily: {
        display: ['Georgia', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui']
      }
    }
  },
  plugins: []
};
