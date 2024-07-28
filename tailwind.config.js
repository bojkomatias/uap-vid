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
      keyframes: {
        animation: {
          ping: 'ping .1s cubic-bezier(0, 0, 0.5, 1) infinite',
        },
        ping: {
          '75%, 100%': {
            transform: 'scale(1.1)',
            opacity: '0',
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/container-queries'),
  ],
}
