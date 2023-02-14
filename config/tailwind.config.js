/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/index.html', './app/**/*.{hbs,js}', './stories/**/*.js'],
  darkMode: 'media',
  theme: {
    extend: {
      gridTemplateColumns: {
        // Simple 16 column grid
        15: 'repeat(15, minmax(0, 1fr))',
      },
    },
  },
  plugins: [],
};
