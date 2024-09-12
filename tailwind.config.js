/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

export default {
  darkMode: "selector",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      flexGrow: {
        2: '2',
        3: '3'
      },
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        'primary': '#D1E9F6',
        'secondary': '#F6EACB',
        'ternary': '#F1D3CE',
        'action': '#EECAD5',
        ...colors
      },
      screens: {

        'tablet': '640px',
        // => @media (min-width: 640px) { ... }

        'laptop': '1024px',
        // => @media (min-width: 1024px) { ... }

        'desktop': '1280px',
        // => @media (min-width: 1280px) { ... }

        ...defaultTheme.screens,
      },
    },
  },
  plugins: [],
}

