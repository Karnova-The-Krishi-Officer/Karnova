/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdfa',
          500: '#14b8a6',
          700: '#0f766e',
          900: '#134e4a',
        },
      },
      boxShadow: {
        soft: '0 10px 30px rgba(2, 132, 199, 0.15)',
      },
    },
  },
  plugins: [],
};
