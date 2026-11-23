/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          navy: {
            900: '#0B2545',
            800: '#133966',
            700: '#1E3A8A',
          },
          saffron: {
            700: '#B45309',
            600: '#D97706',
            500: '#F59E0B',
            100: '#FEF3C7',
            50: '#FFFBEB',
          },
          emerald: {
            800: '#065F46',
            600: '#059669',
            500: '#10B981',
            100: '#D1FAE5',
            50: '#ECFDF5',
          },
        },
        slate: {
          canvas: '#F8FAFC',
          border: '#E2E8F0',
        },
      },
      fontFamily: {
        kannada: ['"Noto Sans Kannada"', 'Tunga', 'sans-serif'],
        devanagari: ['"Noto Sans Devanagari"', 'Mangal', 'sans-serif'],
        bengali: ['"Noto Sans Bengali"', 'sans-serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      lineHeight: {
        'kannada': '1.75',
        'devanagari': '1.65',
        'bengali': '1.65',
      },
      boxShadow: {
        'crisp-sm': '0 1px 2px 0 rgba(15, 23, 42, 0.05), 0 0 0 1px rgba(15, 23, 42, 0.06)',
        'crisp-md': '0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.04), 0 0 0 1px rgba(15, 23, 42, 0.08)',
        'crisp-lg': '0 10px 15px -3px rgba(15, 23, 42, 0.10), 0 4px 6px -4px rgba(15, 23, 42, 0.05), 0 0 0 1px rgba(15, 23, 42, 0.08)',
        'crisp-xl': '0 20px 25px -5px rgba(15, 23, 42, 0.15), 0 8px 10px -6px rgba(15, 23, 42, 0.06)',
      },
    },
  },
  plugins: [],
}
