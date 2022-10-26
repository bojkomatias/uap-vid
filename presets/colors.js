const colors = require('tailwindcss/colors')

module.exports = {
    presets: [],
    theme: {
        colors: {
            current: 'currentColor',
            base: colors.neutral,
            primary: {
                DEFAULT: '#003C71',
                100: '#003c7011',
                200: colors.sky,
            },
            secondary: colors.gray,
            white: colors.white,
            black: colors.black,
            error: colors.rose,
        },
    },
}
