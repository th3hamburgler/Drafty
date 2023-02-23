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
      fontFamily: {
        sans: '"Premier League W01", Helvetica, Arial, sans-serif',
      },
      gridColumn: {
        'span-13': 'span 13 / span 13',
        'span-14': 'span 14 / span 14',
        'span-15': 'span 15 / span 15',
        'span-16': 'span 16 / span 16',
        'span-17': 'span 17 / span 17',
        'span-18': 'span 18 / span 18',
        'span-19': 'span 19 / span 19',
        'span-20': 'span 20 / span 20',
        'span-21': 'span 21 / span 21',
        'span-22': 'span 22 / span 22',
        'span-23': 'span 23 / span 23',
        'span-24': 'span 24 / span 24',
        'span-25': 'span 25 / span 25',
        'span-26': 'span 26 / span 26',
        'span-27': 'span 27 / span 27',
        'span-28': 'span 28 / span 28',
        'span-29': 'span 29 / span 29',
        'span-30': 'span 30 / span 30',
        'span-31': 'span 31 / span 31',
        'span-32': 'span 32 / span 32',
        'span-33': 'span 33 / span 33',
        'span-34': 'span 34 / span 34',
        'span-35': 'span 35 / span 35',
        'span-36': 'span 36 / span 36',
        'span-37': 'span 37 / span 37',
        'span-38': 'span 38 / span 38',
      },
      gridTemplateColumns: {
        // Simple 16 column grid
        15: 'repeat(15, minmax(0, 1fr))',
        38: 'repeat(38, minmax(0, 1fr))',
      },
      gridColumnStart: {
        13: '13',
        14: '14',
        15: '15',
        16: '16',
        17: '17',
      },
    },
  },
  plugins: [],
};
