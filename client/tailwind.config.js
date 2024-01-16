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
        'colorY': '#FFFBF2',
        'colorYH': '#F3EADC',

        'colorG': '#073937',

        'colorY2': '#FCF5EB',
        'colorY2H': '#F3EADC',
      },

      fontFamily: {
        Classy: ['Bodoni Moda', 'serif'],
        Secondary: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
});

