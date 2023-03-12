const colors = require('tailwindcss/colors')
module.exports = {
    presets: [
        require('tailwindcss/defaultConfig'),
        // require('./presets/colors'),
    ],
    content: [
        './src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        fontFamily: {
            sans: ['var(--font-sans)']
        },
        colors: {
            current: 'currentColor',
            base: colors.neutral,
            primary: {
                DEFAULT: '#003C71',
            },
            gray: colors.gray,
            white: colors.white,
            black: colors.black,
            error: colors.rose,
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
        // ...
    ],
}
