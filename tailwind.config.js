import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // La clé "fontFamily" doit être à l'intérieur de "extend"
      fontFamily: {
        // On cible bien la clé "sans"
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        brand: {
          revenu: '#16a34a',
          besoins: '#2563eb',
          envies: '#d97706',
          epargne: '#7c3aed',
        }
      }
    },
  },
  plugins: [],
}