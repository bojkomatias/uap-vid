const { rose, teal, amber } = require('tailwindcss/colors')

module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)'],
      },
      colors: {
        current: 'currentColor',
        primary: {
          DEFAULT: '#003C71',
          50: '#e9fcff',
          100: '#cef7ff',
          200: '#a7f3ff',
          300: '#6bf0ff',
          400: '#26e0ff',
          500: '#00beff',
          600: '#0094ff',
          700: '#0079ff',
          800: '#0068e6',
          900: '#005cb3',
          950: '#003c71',
        },
        error: rose,
        success: teal,
        warning: amber,
      },
      borderRadius: { DEFAULT: '0.5rem' },
      borderColor: ({ theme }) => ({
        ...theme('colors'),
        DEFAULT: theme('colors.gray.200', 'currentColor'),
      }),
      ringColor: ({ theme }) => ({
        DEFAULT: theme('colors.gray.300', 'currentColor'),
        ...theme('colors'),
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
