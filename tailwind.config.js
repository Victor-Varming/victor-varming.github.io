/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",          // scan index.html
    "./src/**/*.{js,jsx,ts,tsx}" // scan all JS/React files
  ],
  theme: {
    extend: {}, // you can add custom colors, fonts, spacing here later
  },
  plugins: [],
};
