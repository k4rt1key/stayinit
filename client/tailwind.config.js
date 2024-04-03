/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        'color1': '#FFFBF2',
        'color2': "#073937",
        // 'color1': '#F8EEE7',
        'color3': '#FDF5EA',
        'color4': '#CAC4BC'
        // 'colorG': '#073937',
        // 'color3': '#FCF5EB',
        // 'color3': '#F3EADC',
      },

      fontFamily: {
        1: ['Libre Baskerville', 'serif'],
        2: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
});

