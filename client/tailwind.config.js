/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0f0f17',
          card: '#1a1a24',
          primary: '#6366f1',
          accent: '#ec4899',
        },
      },
    },
  },
  plugins: [],
};
