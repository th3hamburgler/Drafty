/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/index.html', './app/**/*.{hbs,js}', './stories/**/*.js'],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        red: '#F2055C',
        cyan: '#07F2F2',
        lime: '#05F26C',
        yellow: '#EAF205',
        purple: '#340040',
      },
      gridTemplateColumns: {
        // Simple 16 column grid
        15: 'repeat(15, minmax(0, 1fr))',
      },
    },
  },
  plugins: [],
};
